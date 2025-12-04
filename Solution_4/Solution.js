// Problem 4: Comparison of Join Algorithms
const { generalizedLineJoin } = require('../Solution_2/Solution.js');
const { sequentialJoin } = require('../Solution_3/Solution.js');

// --- Dataset Generation ---

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateDataset() {
    const R1 = [];
    const R2 = [];
    const R3 = [];

    // R1: 100 tuples (A1, A2)
    for (let i = 1; i <= 100; i++) {
        R1.push({ A1: i, A2: getRandomInt(1, 5000) });
    }

    // R2: 100 tuples (A2, A3)
    for (let j = 1; j <= 100; j++) {
        R2.push({ A2: getRandomInt(1, 5000), A3: j });
    }

    // R3: 100 tuples (A3, A4)
    for (let l = 1; l <= 100; l++) {
        R3.push({ A3: l, A4: l });
    }

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
