# Problem 2 (20 points)

**Goal:** Implement an algorithm (e.g., a simplified version of the Yannakakis algorithm) to evaluate line join queries in $O(N+OUT)$ time.

**Example:**
$$q(A_{1},A_{2},A_{3},A_{4}) :- R_{1}(A_{1},A_{2}), R_{2}(A_{2},A_{3}), R_{3}(A_{3},A_{4})$$

The query above is an example of a 4-line join.

**Assumptions:**
1.  The domain of each attribute is $\mathbb{Z}$.
2.  Each relation has $N$ tuples.
3.  Each relation has exactly two attributes and joins as shown in the example above.
4.  You focus on $k$-line joins for $k \le 10$.

**Report Requirements:**
* In the report, explain how you implement your algorithm.