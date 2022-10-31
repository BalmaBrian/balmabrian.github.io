---
title: "Message Authentication"
---

# Message Authentication

A symmetric key authentication algorithm is often called a MAC (for message
authentication code). It produces a piece of data called a "MAC tag" which
can be used for validating received data.

---

### Cryptographic services:
- integrity: was message altered in transit
- authentication: did message come from a key holder?

---

#### MAC generate:
> `t = TagGen(k,x)`

> `send (x,t)`
> `receive (x',t')`

#### MAC verify:
> `t' == TagGen(k, x')`

Should be very hard to create a valid (x,t) pair without k.

-----

### Example constructions:

#### CBC-MAC

Just like CBC encryption, but IV=0 and only output final block.

-----

#### HMAC

> `HMAC(k,x) = H(k || H(k || x))  "Hash MAC"`

> Note: outside hash is over a fixed length. Avoids "length extension" attacks.

Given a Merkle-Damgard hashfunction H, if you know H(x1) and len(x1),
then you can compute H(x1 || x2) without actually knowing x1.

----

#### KMAC

> `KMAC(k,x) = H(k || x)  "Keyed hash function MAC"`

If H safe from length extension attacks

==========

### Security model:

Attacker knows (x1,t1), (x2,t2), ..., (xq,tq)
Attacker tries to guess new valid (x,t) != (xi, ti) for all i.

MAC is secure if no attacker can get significant success probability.

#### Ex:

>Let k be random 128 key.
>
>Let attacker know (x1,t1), (x2,t2), ..., (xq,tq) where ti = KMAC(k, xi)
>
>Attacker guesses (x,t) with (x,t) != (xi,ti) for all i

Case 1:

> If t = ti for some i
> 
> Then x != xi
> 
> Attacker success would mean H(k || x) = H(k || xi)
> 
> This would mean a collision, which is unlikely with a good hash

Case 2:
 
> If t != ti for all i
> 
> Then x != xi for all i
> 
> So, k || x has never been computed
> 
> If H(k || x) = t, this would violate preimage resistance
