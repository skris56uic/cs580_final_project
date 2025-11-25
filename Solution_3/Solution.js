// Sequential Hash Join (Left-Deep) in Node.js
// Query: q(A1, ..., Ak+1) :- R1(A1, A2), R2(A2, A3), ..., Rk(Ak, Ak+1)

// Generic Hash Join Function
// Joins leftRel and rightRel on joinAttr
function hashJoin(leftRel, rightRel, joinAttr) {
    const results = [];
    const hashMap = new Map();

    // 1. Build Phase: Hash the right relation (usually smaller in optimizer logic, but here fixed)
    // We'll hash the right relation as per standard hash join description in Problem 1
    for (const tuple of rightRel) {
        const key = tuple[joinAttr];
        if (!hashMap.has(key)) {
            hashMap.set(key, []);
        }
        hashMap.get(key).push(tuple);
    }

    // 2. Probe Phase: Iterate through left relation
    for (const leftTuple of leftRel) {
        const key = leftTuple[joinAttr];
        if (hashMap.has(key)) {
            const matchingTuples = hashMap.get(key);
            for (const rightTuple of matchingTuples) {
                // Merge tuples
                // Note: We need to be careful not to duplicate the join key if we want a clean output,
                // but for simplicity of "A1...Ak+1", we can just merge objects.
                // The join key exists in both, so it will just be overwritten with the same value.
                results.push({ ...leftTuple, ...rightTuple });
            }
        }
    }

    return results;
}

// Sequential Join Algorithm
function sequentialJoin(relations) {
    if (relations.length === 0) return [];
    if (relations.length === 1) return relations[0];

    let currentResult = relations[0];

    // Iterate through the rest of the relations
    for (let i = 1; i < relations.length; i++) {
        const nextRelation = relations[i];
        // Join attribute between R_prev (ending in A_{i+1}) and R_next (starting with A_{i+1})
        // is A_{i+1}.
        // Example: i=1 (2nd relation). Join R1(A1,A2) and R2(A2,A3) on A2.
        const joinAttr = `A${i + 1}`;

        console.log(`Step ${i}: Joining with R${i + 1} on ${joinAttr}...`);
        console.log(`  Left Input Size: ${currentResult.length}`);
        console.log(`  Right Input Size: ${nextRelation.length}`);

        currentResult = hashJoin(currentResult, nextRelation, joinAttr);

        console.log(`  Result Size: ${currentResult.length}`);

        // Optimization: If intermediate result is empty, we can stop early
        if (currentResult.length === 0) {
            console.log("  Intermediate result empty. Stopping.");
            break;
        }
    }

    return currentResult;
}

// --- Test Data Generation (Same as Problem 2 for consistency) ---

function generateChain(k, n) {
    const relations = [];
    for (let i = 0; i < k; i++) {
        const rel = [];
        for (let j = 0; j < n; j++) {
            rel.push({
                [`A${i + 1}`]: j,
                [`A${i + 2}`]: j
            });
            // Add noise
            if (j % 2 === 0) {
                rel.push({
                    [`A${i + 1}`]: j + 1000,
                    [`A${i + 2}`]: j + 1000
                });
            }
        }
        relations.push(rel);
    }
    return relations;
}

// --- Execution ---

// Case 1: k=3
console.log("\n--- Processing 3-Line Join (Sequential) ---");
const R1 = [
    { A1: 1, A2: 10 }, { A1: 2, A2: 20 }, { A1: 3, A2: 30 }, { A1: 4, A2: 40 }, { A1: 5, A2: 50 }
];
const R2 = [
    { A2: 10, A3: 100 }, { A2: 20, A3: 200 }, { A2: 40, A3: 400 }, { A2: 50, A3: 501 }, { A2: 60, A3: 600 }
];
const R3 = [
    { A3: 100, A4: 1000 }, { A3: 200, A4: 2000 }, { A3: 200, A4: 2001 }, { A3: 400, A4: 4000 }, { A3: 700, A4: 7000 }
];

const results3 = sequentialJoin([R1, R2, R3]);
console.log(`k=3 Results: ${results3.length} tuples found.`);
console.table(results3);


// Case 2: k=5
console.log("\n--- Processing 5-Line Join (Sequential) ---");
const rels5 = generateChain(5, 10);
const results5 = sequentialJoin(rels5);
console.log(`k=5 Results: ${results5.length} tuples found.`);
if (results5.length > 0) console.log("Sample result:", results5[0]);
