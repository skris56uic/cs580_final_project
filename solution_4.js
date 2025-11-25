// Problem 4: Comparison of Join Algorithms

// --- Dataset Generation ---

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateDataset() {
    const R1 = [];
    const R2 = [];
    const R3 = [];

    // R1: 100 tuples (i, x) where i=1..100, x in [1, 5000]
    // Schema: A1, A2
    for (let i = 1; i <= 100; i++) {
        R1.push({ A1: i, A2: getRandomInt(1, 5000) });
    }

    // R2: 100 tuples (y, j) where j=1..100, y in [1, 5000]
    // Schema: A2, A3
    // Note: The problem says (y, j). Let's assume y is the join attribute with R1 (A2) and j is the join attribute with R3 (A3).
    // Wait, let's check the query structure: q(A1,A2,A3,A4) :- R1(A1,A2), R2(A2,A3), R3(A3,A4)
    // R1(A1, A2). R1 has (i, x). So A1=i, A2=x.
    // R2(A2, A3). R2 has (y, j). So A2=y, A3=j.
    // R3(A3, A4). R3 has (l, l). So A3=l, A4=l.

    for (let j = 1; j <= 100; j++) {
        R2.push({ A2: getRandomInt(1, 5000), A3: j });
    }

    // R3: 100 tuples (l, l) where l=1..100
    // Schema: A3, A4
    for (let l = 1; l <= 100; l++) {
        R3.push({ A3: l, A4: l });
    }

    return [R1, R2, R3];
}

// --- Helper Functions ---

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

function semijoin(targetRel, sourceRel, joinAttr) {
    const sourceIndex = buildIndex(sourceRel, joinAttr);
    return targetRel.filter(t => sourceIndex.has(t[joinAttr]));
}

// --- Algorithm 1: Yannakakis (Generalized) ---

function yannakakisJoin(relations) {
    const k = relations.length;
    let rels = relations.map(r => [...r]); // Shallow copy

    // Reduction Phase
    // Right-to-Left
    for (let i = k - 2; i >= 0; i--) {
        const joinAttr = `A${i + 2}`;
        rels[i] = semijoin(rels[i], rels[i + 1], joinAttr);
    }
    // Left-to-Right
    for (let i = 1; i < k; i++) {
        const joinAttr = `A${i + 1}`;
        rels[i] = semijoin(rels[i], rels[i - 1], joinAttr);
    }

    // Join Phase (DFS)
    const results = [];
    const indices = [];
    for (let i = 1; i < k; i++) {
        indices[i] = buildIndex(rels[i], `A${i + 1}`);
    }

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
            const newResult = { ...currentResultBuilder, ...tuple };
            findMatches(level + 1, tuple, newResult);
        }
    }

    findMatches(0, null, {});
    return results;
}

// --- Algorithm 2: Sequential Hash Join ---

function hashJoin(leftRel, rightRel, joinAttr) {
    const results = [];
    const hashMap = new Map();

    for (const tuple of rightRel) {
        const key = tuple[joinAttr];
        if (!hashMap.has(key)) {
            hashMap.set(key, []);
        }
        hashMap.get(key).push(tuple);
    }

    for (const leftTuple of leftRel) {
        const key = leftTuple[joinAttr];
        if (hashMap.has(key)) {
            const matchingTuples = hashMap.get(key);
            for (const rightTuple of matchingTuples) {
                results.push({ ...leftTuple, ...rightTuple });
            }
        }
    }

    return results;
}

function sequentialJoin(relations) {
    if (relations.length === 0) return [];
    let currentResult = relations[0];

    for (let i = 1; i < relations.length; i++) {
        const nextRelation = relations[i];
        const joinAttr = `A${i + 1}`;
        currentResult = hashJoin(currentResult, nextRelation, joinAttr);
    }

    return currentResult;
}

// --- Execution and Comparison ---

const [R1, R2, R3] = generateDataset();
const relations = [R1, R2, R3];

console.log("Dataset Generated:");
console.log(`R1: ${R1.length} tuples`);
console.log(`R2: ${R2.length} tuples`);
console.log(`R3: ${R3.length} tuples`);

// Run Yannakakis
console.time("Yannakakis");
const resultsYannakakis = yannakakisJoin(relations);
console.timeEnd("Yannakakis");
console.log(`Yannakakis Results: ${resultsYannakakis.length}`);

// Run Sequential
console.time("Sequential");
const resultsSequential = sequentialJoin(relations);
console.timeEnd("Sequential");
console.log(`Sequential Results: ${resultsSequential.length}`);

// Compare Results
// Sort results to compare
function sortResults(res) {
    return res.sort((a, b) => {
        if (a.A1 !== b.A1) return a.A1 - b.A1;
        if (a.A2 !== b.A2) return a.A2 - b.A2;
        if (a.A3 !== b.A3) return a.A3 - b.A3;
        return a.A4 - b.A4;
    });
}

const sortedY = sortResults([...resultsYannakakis]);
const sortedS = sortResults([...resultsSequential]);

const match = JSON.stringify(sortedY) === JSON.stringify(sortedS);
console.log(`Results Match: ${match}`);

if (!match) {
    console.log("Difference found!");
}
