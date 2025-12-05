// Problem 5: Stress Test Comparison
const { generalizedLineJoin } = require('../Solution_2/Solution.js');
const { sequentialJoin } = require('../Solution_3/Solution.js');

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
    // 1. 1000 tuples (i, 5)
    for (let i = 1; i <= 1000; i++) {
        R1.push({ A1: i, A2: 5 });
    }
    // 2. 1000 tuples (i, 7)
    for (let i = 1001; i <= 2000; i++) {
        R1.push({ A1: i, A2: 7 });
    }
    // 3. Tuple (2001, 2002)
    R1.push({ A1: 2001, A2: 2002 });
    // 4. Shuffle
    shuffleArray(R1);

    // R2:
    // 1. 1000 tuples (5, i)
    for (let i = 1; i <= 1000; i++) {
        R2.push({ A2: 5, A3: i });
    }
    // 2. 1000 tuples (7, i)
    for (let i = 1001; i <= 2000; i++) {
        R2.push({ A2: 7, A3: i });
    }
    // 3. Tuple (2002, 8)
    R2.push({ A2: 2002, A3: 8 });
    // 4. Shuffle
    shuffleArray(R2);

    // R3:
    // 1. 2000 random tuples (x, y)
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

// --- Execution and Comparison ---

const [R1, R2, R3] = generateDataset();
const relations = [R1, R2, R3];

console.log("Dataset Generated:");
console.log(`R1: ${R1.length} tuples`);
console.log(`R2: ${R2.length} tuples`);
console.log(`R3: ${R3.length} tuples`);

// Run Yannakakis
console.time("Yannakakis");
const resultsYannakakis = generalizedLineJoin(relations);
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
