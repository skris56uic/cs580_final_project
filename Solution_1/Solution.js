
// 1. Create dataset with 10 tuples each for R1 and R2.
// R1(A, B)
const R1 = [
    { A: 1, B: 10 },
    { A: 2, B: 20 },
    { A: 3, B: 30 },
    { A: 4, B: 40 },
    { A: 5, B: 50 },
    { A: 6, B: 60 },
    { A: 7, B: 70 },
    { A: 8, B: 80 },
    { A: 9, B: 90 },
    { A: 10, B: 100 }
];

// R2(B, C)
const R2 = [
    { B: 10, C: 100 },
    { B: 20, C: 200 },
    { B: 30, C: 300 },
    { B: 40, C: 400 },
    { B: 50, C: 500 },
    { B: 10, C: 101 }, // Duplicate B for testing
    { B: 60, C: 600 },
    { B: 70, C: 700 },
    { B: 80, C: 800 },
    { B: 110, C: 1100 } // Unmatched B value
];

console.log("Relation R1(A, B):");
console.table(R1);
console.log("\nRelation R2(B, C):");
console.table(R2);

// Algorithm Implementation

function hashJoin(r1, r2) {
    const results = [];
    const hashMap = new Map();

    // Step 1: Hash R2 tuples by attribute B.
    for (const tuple of r2) {
        const key = tuple.B;
        if (!hashMap.has(key)) {
            hashMap.set(key, []);
        }
        hashMap.get(key).push(tuple);
    }

    // Step 2: Probe hash map with R1 tuples to find matches.
    for (const t1 of r1) {
        const key = t1.B;
        if (hashMap.has(key)) {
            const matchingTuples = hashMap.get(key);
            for (const t2 of matchingTuples) {
                // Create result tuple (A, B, C)
                results.push({ A: t1.A, B: t1.B, C: t2.C });
            }
        }
    }

    return results;
}

// Execute the algorithm
const joinResults = hashJoin(R1, R2);

// Report results
console.log("\nJoin Results q(A,B,C) :- R1(A,B), R2(B,C):");
console.table(joinResults);
