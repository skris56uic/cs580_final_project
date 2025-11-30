# Problem 5 (10 points)

**Task:** Create a specific dataset for a 3-line query designed to stress-test the algorithms and compare their performance.

**Dataset Generation Instructions:**

* **Relation $R_{1}$:**
    1.  Add 1000 tuples $(i, 5)$ for $i = 1, 2, \dots, 1000$.
    2.  Add 1000 tuples $(i, 7)$ for $i = 1001, 1002, \dots, 2000$.
    3.  Add the tuple $(2001, 2002)$.
    4.  **Important:** Apply a random permutation to the tuples in $R_{1}$ (shuffle the rows).

* **Relation $R_{2}$:**
    1.  Add 1000 tuples $(5, i)$ for $i = 1, 2, \dots, 1000$.
    2.  Add 1000 tuples $(7, i)$ for $i = 1001, 1002, \dots, 2000$.
    3.  Add the tuple $(2002, 8)$.
    4.  **Important:** Apply a random permutation to the tuples in $R_{2}$.

* **Relation $R_{3}$:**
    1.  Add 2000 random tuples $(x, y)$ with $x \in [2002, 3000]$ and $y \in [1, 3000]$.
    2.  Add the tuple $(8, 30)$.
    3.  **Important:** Apply a random permutation to the tuples in $R_{3}$.

**Execution Requirements:**
1.  Run your implementation from **Problem 2** (Yannakakis / Line Join) on this dataset.
2.  Run your implementation from **Problem 3** (Sequential Join) on this dataset.

**Report Requirements:**
* In the report, show and explain the results.
* Answer the question: Do they return the same results?
* Answer the question: **How fast are the two implementations and why?** (This is the critical analysis part of this problem).