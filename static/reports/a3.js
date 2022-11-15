"use strict";

// Get data from csv file
var internet_users = Papa.parse("users-by-country.csv", {
  header: true,
  download: true,
  dynamicTyping: true,
  complete: function (results) {
    internet_users = results.data;
  },
});

// // Get data from csv file
// var individual_shares = Papa.parse("individuals-using-the-internet.csv", {
//   header: true,
//   download: true,
//   dynamicTyping: true,
//   complete: function (results) {
//     individual_shares = results.data;
//   },
// });

// Load data on handling the data and visualizations
if (document.isConnected) {
  window.addEventListener("load", init);
}

function years() {
  let year = [];
  for (let i = 0; i < internet_users.length; i++) {
    year.push(internet_users[i].Year);
  }
  year = [...new Set(year)];
  year.sort((a, b) => a - b);
  return year;
}

function createOptions() {
  var select = document.getElementById("selectYear");
  for (let i = 0; i < years().length; i++) {
    var option = document.createElement("option");
    option.text = years()[i];
    select.add(option);
  }
  document.getElementById("selectYear").innerHTML = select.innerHTML;
  select = document.getElementById("selectRank");
  var options = [3, 5, 10, 20];
  for (let i = 0; i < options.length; i++) {
    var option = document.createElement("option");
    option.text = options[i];
    select.add(option);
  }
  document.getElementById("selectRank").innerHTML = select.innerHTML;
}

function keepTop(data, top) {
  let topData = [];
  for (let i = 0; i < data.length; i++) {
    topData.push(data[i]);
    if (topData.length > top) {
      topData.sort((a, b) => b.users - a.users);
      topData.pop();
    }
  }
  return topData;
}

function updateVisual_01() {
  var snapshots = internet_users.filter(
    (d) => d.Year == document.getElementById("selectYear").value
  );
  var ranking = document.getElementById("selectRank").value;
  var spec = {
    title: {
      text:
        "Top " +
        ranking +
        " countries by internet users in the year " +
        snapshots[0].Year,
    },
    width: 600,
    data: {
      values: snapshots.map((d) => {
        return {
          entity: d.Entity,
          users: d.Users,
        };
      }),
    },
    encoding: {
      x: {
        field: "users",
        type: "quantitative",
        title: "Number of Internet Users",
      },
      y: {
        field: "entity",
        type: "nominal",
        title: "Country",
        sort: {
          field: "users",
          op: "sum",
          order: "descending",
        },
      },
    },
    layer: [
      {
        mark: {
          type: "bar",
          color: "darkgreen",
        },
      },
      {
        mark: {
          type: "text",
          align: "left",
          baseline: "middle",
          dx: 3,
        },
        encoding: {
          text: {
            field: "users",
            type: "quantitative",
            format: ".2s",
          },
        },
      },
    ],
  };
  spec.data.values = spec.data.values.filter((d) => d.entity != "World");
  spec.data.values = keepTop(spec.data.values, ranking);
  vegaEmbed("#vis1", spec);
}

function init() {
  createOptions();
  updateVisual_01();
}

function playAnimation() {
  // set innerHTML of button to vis2 to display loading animation
  document.getElementById("vis2").innerHTML = "Loading...";
  var snapshots, ranking, spec;
  for (let i = 0; i < years().length; i++) {
    setTimeout(function () {
      snapshots = internet_users.filter((d) => d.Year == years()[i]);
      ranking = document.getElementById("selectRank").value;
      spec = {
        title: {
          text:
            "Top " +
            ranking +
            " countries by internet users in the year " +
            snapshots[0].Year,
        },
        width: 600,
        data: {
          values: snapshots.map((d) => {
            return {
              entity: d.Entity,
              users: d.Users,
            };
          }),
        },
        encoding: {
          x: {
            field: "users",
            type: "quantitative",
            title: "Number of Internet Users",
          },
          y: {
            field: "entity",
            type: "nominal",
            title: "Country",
            sort: {
              field: "users",
              op: "sum",
              order: "descending",
            },
          },
        },
        layer: [
          {
            mark: {
              type: "bar",
              color: "darkgreen",
            },
          },
          {
            mark: {
              type: "text",
              align: "left",
              baseline: "middle",
              dx: 3,
            },
            encoding: {
              text: {
                field: "users",
                type: "quantitative",
                format: ".2s",
              },
            },
          },
        ],
      };
      spec.data.values = spec.data.values.filter((d) => d.entity != "World");
      spec.data.values = keepTop(spec.data.values, ranking);
      vegaEmbed("#vis2", spec);
    }, 5000);
  }
}
