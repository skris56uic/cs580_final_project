# Problem 1 (10 points)

**Task:** Implement an algorithm to evaluate the following query:
$$q(A,B,C) :- R_{1}(A,B), R_{2}(B,C)$$

**Assumptions:**
* Assume that each attribute has domain $\mathbb{Z}$ (the set of integers).

**Recommended Implementation Strategy:**
There are many ways to implement this, but one of the most common is to use **hashing**.

1.  Hash the tuples of $R_{2}$ using keys from attribute $B$ and values as the list of tuples in $R_{2}$ that share the key.
2.  If $h$ is a hash map, then for $b \in \mathbb{Z}$:
    $$h[b] = \{t \in R_{2} \mid \pi_{B}(t) = b\}$$
3.  Iterate over each tuple $t^{\prime} \in R_{1}$, probe the hash map with $\pi_{B}(t^{\prime})$, and report all tuples in $R_{2}$ that can be joined with $t^{\prime}$.
4.  Report all results in the join.

**Report Requirements:**
* Create a dataset with 10 tuples in $R_{1}$ and 10 tuples in $R_{2}$.
* Run your algorithm and explain why it is correct.
* In the report, explain how you implemented your algorithm and why your implementation is correct.