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
    // Reduce R_i by R_{i+1} from end to start.

    for (let i = k - 2; i >= 0; i--) {
        const joinAttr = `A${i + 2}`;
        const originalSize = rels[i].length;
        rels[i] = semijoin(rels[i], rels[i + 1], joinAttr);
        console.log(`R${i + 1} reduced by R${i + 2}: ${originalSize} -> ${rels[i].length} tuples`);
    }

    // 2. Semijoin Reduction (Left-to-Right)
    // Reduce R_i by R_{i-1} from start to end.
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
    function dfs(level, previousTuple, currentResultBuilder) {
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
            const newResult = { ...currentResultBuilder, ...tuple };
            dfs(level + 1, tuple, newResult);
        }
    }

    dfs(0, null, {});
    return results;
}


// --- Test Data Generation ---

function generateChain(k, n) {
    const relations = [];
    for (let i = 0; i < k; i++) {
        const rel = [];
        for (let j = 0; j < n; j++) {
            // Generate chain with noise
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

if (require.main === module) {
    // Case 1: k=3
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
    if (results5.length > 0) console.table(results5);


    // Case 3: k=9
    console.log("\nGenerating data for k=9...");
    const rels9 = generateChain(9, 20);
    const results9 = generalizedLineJoin(rels9);
    console.log(`k=9 Results: ${results9.length} tuples found.`);
    if (results9.length > 0) console.table(results9);
}

module.exports = { generalizedLineJoin };
