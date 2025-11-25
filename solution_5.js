// Problem 5: Stress Test Comparison

// --- Dataset Generation ---

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function generateDataset() {
    const R1 = [];
    const R2 = [];
    const R3 = [];

    // R1:
    // 1. 1000 tuples (i, 5) for i=1..1000
    for (let i = 1; i <= 1000; i++) {
        R1.push({ A1: i, A2: 5 });
    }
    // 2. 1000 tuples (i, 7) for i=1001..2000
    for (let i = 1001; i <= 2000; i++) {
        R1.push({ A1: i, A2: 7 });
    }
    // 3. Tuple (2001, 2002)
    R1.push({ A1: 2001, A2: 2002 });
    // 4. Shuffle
    shuffleArray(R1);

    // R2:
    // 1. 1000 tuples (5, i) for i=1..1000
    for (let i = 1; i <= 1000; i++) {
        R2.push({ A2: 5, A3: i });
    }
    // 2. 1000 tuples (7, i) for i=1001..2000
    for (let i = 1001; i <= 2000; i++) {
        R2.push({ A2: 7, A3: i });
    }
    // 3. Tuple (2002, 8)
    R2.push({ A2: 2002, A3: 8 });
    // 4. Shuffle
    shuffleArray(R2);

    // R3:
    // 1. 2000 random tuples (x, y) with x in [2002, 3000], y in [1, 3000]
    for (let k = 0; k < 2000; k++) {
        const x = Math.floor(Math.random() * (3000 - 2002 + 1)) + 2002;
        const y = Math.floor(Math.random() * 3000) + 1;
        R3.push({ A3: x, A4: y });
    }
    // 2. Tuple (8, 30)
    R3.push({ A3: 8, A4: 30 });
    // 3. Shuffle
    shuffleArray(R3);

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
    let rels = relations.map(r => [...r]);

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

if (match && resultsYannakakis.length > 0) {
    console.log("Result Sample:", resultsYannakakis[0]);
}
