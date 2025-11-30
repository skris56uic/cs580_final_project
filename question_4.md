# Problem 4 (10 points)

**Task:** Create a random dataset for the 3-line join and compare the algorithms from Problems 2 and 3.

**Dataset Generation Instructions:**
Create a dataset where each relation contains exactly **100 tuples**.

* **Relation $R_{1}$:**
    * Add 100 tuples $(i, x)$.
    * Where $i = 1, \dots, 100$.
    * Where $x$ is a random integer in the range $[1, 5000]$.

* **Relation $R_{2}$:**
    * Add 100 tuples $(y, j)$.
    * Where $j = 1, \dots, 100$.
    * Where $y$ is a random integer in the range $[1, 5000]$.

* **Relation $R_{3}$:**
    * Add the tuples $(l, l)$.
    * Where $l = 1, \dots, 100$.

**Execution Requirements:**
1.  Run your implementation from **Problem 2** (Yannakakis / Line Join) on this dataset.
2.  Run your implementation from **Problem 3** (Sequential Join) on this dataset.

**Report Requirements:**
* In the report, show and explain the results.
* Answer the question: Do they return the same results?
* What is the running time?