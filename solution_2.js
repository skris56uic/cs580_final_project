// Generalized Line Join Algorithm (Yannakakis) in Node.js
// Query: q(A1, ..., Ak+1) :- R1(A1, A2), R2(A2, A3), ..., Rk(Ak, Ak+1)

// Helper function to build hash index
function buildIndex(relation, keyAttr) {
    const index = new Map();
    for (const tuple of relation) {
        const key = tuple[keyAttr];
        if (!index.has(key)) {
            index.set(key, []);
        }
        index.get(key).push(tuple);
    }
    return index;
}

// Helper function for semijoin reduction: R_target = R_target semijoin R_source
function semijoin(targetRel, sourceRel, joinAttr) {
    const sourceIndex = buildIndex(sourceRel, joinAttr);
    return targetRel.filter(t => sourceIndex.has(t[joinAttr]));
}

// Generalized Algorithm Implementation
function generalizedLineJoin(relations) {
    const k = relations.length;
    if (k === 0) return [];

    // Make a copy of relations to avoid mutating original data
    let rels = relations.map(r => [...r]);

    console.log(`\n--- Processing ${k}-Line Join ---`);
    console.log("--- Reduction Phase ---");

    // 1. Semijoin Reduction (Right-to-Left)
    // For i = k-1 down to 1: Ri = Ri semijoin R(i+1)
    // Note: Array is 0-indexed. R1 is at index 0.
    // Loop i from k-2 down to 0.
    // Ri (index i) joins with R(i+1) (index i+1) on attribute A(i+2)
    // Naming convention: R_i has attributes A_i, A_{i+1}
    // Join attribute between R[i] and R[i+1] is A_{i+2} (using 1-based attribute naming)
    // Let's stick to the property names in the objects.
    // We assume R[i] has keys `A${i+1}` and `A${i+2}`.
    // Join key between R[i] and R[i+1] is `A${i+2}`.

    for (let i = k - 2; i >= 0; i--) {
        const joinAttr = `A${i + 2}`;
        const originalSize = rels[i].length;
        rels[i] = semijoin(rels[i], rels[i + 1], joinAttr);
        console.log(`R${i + 1} reduced by R${i + 2}: ${originalSize} -> ${rels[i].length} tuples`);
    }

    // 2. Semijoin Reduction (Left-to-Right)
    // For i = 2 up to k: Ri = Ri semijoin R(i-1)
    // Loop i from 1 to k-1.
    // Ri (index i) joins with R(i-1) (index i-1) on attribute A(i+1)
    for (let i = 1; i < k; i++) {
        const joinAttr = `A${i + 1}`;
        const originalSize = rels[i].length;
        rels[i] = semijoin(rels[i], rels[i - 1], joinAttr);
        console.log(`R${i + 1} reduced by R${i}: ${originalSize} -> ${rels[i].length} tuples`);
    }

    console.log("--- Join Phase (DFS) ---");

    const results = [];

    // Build indices for all relations (except the first one, which we iterate)
    const indices = [];
    for (let i = 1; i < k; i++) {
        indices[i] = buildIndex(rels[i], `A${i + 1}`);
    }

    // Recursive DFS function
    function dfs(relIndex, currentTuple, currentResult) {
        // Base case: we have matched all relations
        if (relIndex === k) {
            results.push({ ...currentResult });
            return;
        }

        // Current relation is rels[relIndex] (but we use index lookup for >0)
        // If relIndex is 0, we are starting.
        // Actually, better to structure DFS as:
        // Match tuple in R[i], then find matches in R[i+1]...

        // We already have a tuple from R[relIndex-1] in 'currentTuple' (if relIndex > 0)
        // We need to find matches in R[relIndex]

        // This is slightly different structure. Let's restart DFS logic.
        // We iterate R0. For each t0, we recurse to find matches in R1, etc.
    }

    // Redefine DFS
    function findMatches(level, previousTuple, currentResultBuilder) {
        if (level === k) {
            results.push(currentResultBuilder);
            return;
        }

        const relation = rels[level];
        let candidates = [];

        if (level === 0) {
            candidates = relation;
        } else {
            const joinAttr = `A${level + 1}`;
            const joinValue = previousTuple[joinAttr];
            const index = indices[level];
            candidates = index.get(joinValue) || [];
        }

        for (const tuple of candidates) {
            // Merge tuple into result
            // Note: simple merge might overwrite if keys duplicate, but here keys are unique A1..Ak+1
            const newResult = { ...currentResultBuilder, ...tuple };
            findMatches(level + 1, tuple, newResult);
        }
    }

    findMatches(0, null, {});
    return results;
}


// --- Test Data Generation ---

function generateChain(k, n) {
    const relations = [];
    for (let i = 0; i < k; i++) {
        const rel = [];
        for (let j = 0; j < n; j++) {
            // Generate a simple chain: 1->1, 2->2, etc.
            // Plus some noise
            rel.push({
                [`A${i + 1}`]: j,
                [`A${i + 2}`]: j
            });
            // Add noise/dangling tuples
            if (j % 2 === 0) {
                rel.push({
                    [`A${i + 1}`]: j + 1000, // Dangling
                    [`A${i + 2}`]: j + 1000
                });
            }
        }
        relations.push(rel);
    }
    return relations;
}

// --- Execution ---

// Case 1: k=3 (Original Example)
const R1 = [
    { A1: 1, A2: 10 }, { A1: 2, A2: 20 }, { A1: 3, A2: 30 }, { A1: 4, A2: 40 }, { A1: 5, A2: 50 }
];
const R2 = [
    { A2: 10, A3: 100 }, { A2: 20, A3: 200 }, { A2: 40, A3: 400 }, { A2: 50, A3: 501 }, { A2: 60, A3: 600 }
];
const R3 = [
    { A3: 100, A4: 1000 }, { A3: 200, A4: 2000 }, { A3: 200, A4: 2001 }, { A3: 400, A4: 4000 }, { A3: 700, A4: 7000 }
];

const results3 = generalizedLineJoin([R1, R2, R3]);
console.log(`k=3 Results: ${results3.length} tuples found.`);
if (results3.length < 20) console.table(results3);


// Case 2: k=5
console.log("\nGenerating data for k=5...");
const rels5 = generateChain(5, 10);
const results5 = generalizedLineJoin(rels5);
console.log(`k=5 Results: ${results5.length} tuples found.`);
// Sample output
if (results5.length > 0) console.log("Sample result:", results5[0]);


// Case 3: k=9
console.log("\nGenerating data for k=9...");
const rels9 = generateChain(9, 20);
const results9 = generalizedLineJoin(rels9);
console.log(`k=9 Results: ${results9.length} tuples found.`);
if (results9.length > 0) console.log("Sample result:", results9[0]);
