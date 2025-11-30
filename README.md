# CS580 Major Project - Join Algorithms

This repository contains implementations of various database join algorithms and query evaluation techniques, including Hash Join, Yannakakis Algorithm, Sequential Join, Generic Join (WCOJ), and Hypertree Width decompositions.

## Project Structure

The project is organized into folders corresponding to each problem statement. Each folder contains the solution code and a detailed report.

```
.
├── Solution_1/          # Problem 1: Hash Join
│   ├── Solution.js      # Node.js implementation
│   └── Report.pdf        # Report and analysis
├── Solution_2/          # Problem 2: Yannakakis Algorithm (Line Join)
│   ├── Solution.js
│   └── Report.pdf
├── Solution_3/          # Problem 3: Sequential Hash Join (Left-Deep)
│   ├── Solution.js
│   └── Report.pdf
├── Solution_4/          # Problem 4: Comparison (Yannakakis vs Sequential)
│   ├── Solution.js
│   └── Report.pdf
├── Solution_5/          # Problem 5: Stress Test Comparison
│   ├── Solution.js
│   └── Report.pdf
├── Solution_6/          # Problem 6: SQL Comparison
│   ├── Solution.js      # Script to generate SQL files
│   ├── solution_6_dataset.sql
│   ├── solution_6_query.sql
│   └── Report.pdf
└── Solution_7/          # Problem 7: GJ, GHW, FHW Comparison
    ├── Solution.js
    └── Report.pdf
```

## Prerequisites

*   **Node.js**: Ensure Node.js is installed on your system to run the solution scripts.
*   **MySQL**: Required only for running the SQL scripts in `Solution_6`.

## How to Run

To run the solution for a specific problem, navigate to the corresponding directory and execute the `Solution.js` file using Node.js.

**Example: Running Problem 1**

```bash
cd Solution_1
node Solution.js
```

**Example: Running Problem 7**

```bash
cd Solution_7
node Solution.js
```

## Reports

Each folder contains a `Report.pdf` file that provides:
*   Explanation of the algorithm implemented.
*   Pseudocode (where applicable).
*   Asymptotic complexity analysis.
*   Experimental results and performance comparisons.
