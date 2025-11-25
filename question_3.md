# Problem 3 (10 points)

**Task:** Implement a simpler algorithm to evaluate a line join query using the join implementation from Problem 1.

**Query Definition:**
Assume the query is a line join of $k$ relations:
$$q(A_{1},...,A_{k+1}) :- R_{1}(A_{1},A_{2}), R_{2}(A_{2},A_{3}), \dots, R_{k}(A_{k}, A_{k+1})$$

**Algorithm Steps:**
The algorithm should evaluate the join sequentially (often called a "left-deep" plan):

1.  **First Step:** Compute the intermediate result $R_{1-2}$ by joining $R_{1}$ and $R_{2}$ using your implementation from Problem 1.
    $$R_{1-2} = R_{1} \bowtie R_{2}$$
2.  **Subsequent Steps:** Join the result of the previous step with the next relation in the sequence.
    * Compute $R_{1-3} = R_{1-2} \bowtie R_{3}$
    * ...
    * Continue this process for all relations.
3.  **Final Step:** The final result is computed as:
    $$R_{1-k} = R_{1-(k-1)} \bowtie R_{k}$$

*Note: The problem instructions explicitly state to use the logic/implementation from Problem 1 (Hash Join) for each step in this sequence.*