// Problem 6: SQL Dataset Generation

const fs = require('fs');
const path = require('path');

// --- Dataset Generation (Same as Problem 5) ---

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

    // R1
    for (let i = 1; i <= 1000; i++) R1.push({ A1: i, A2: 5 });
    for (let i = 1001; i <= 2000; i++) R1.push({ A1: i, A2: 7 });
    R1.push({ A1: 2001, A2: 2002 });
    shuffleArray(R1);

    // R2
    for (let i = 1; i <= 1000; i++) R2.push({ A2: 5, A3: i });
    for (let i = 1001; i <= 2000; i++) R2.push({ A2: 7, A3: i });
    R2.push({ A2: 2002, A3: 8 });
    shuffleArray(R2);

    // R3
    for (let k = 0; k < 2000; k++) {
        const x = Math.floor(Math.random() * (3000 - 2002 + 1)) + 2002;
        const y = Math.floor(Math.random() * 3000) + 1;
        R3.push({ A3: x, A4: y });
    }
    R3.push({ A3: 8, A4: 30 });
    shuffleArray(R3);

    return [R1, R2, R3];
}

// --- SQL Generation ---

function generateSQL() {
    const [R1, R2, R3] = generateDataset();
    let sqlContent = "-- Dataset for Problem 6\n\n";

    // Create Tables
    sqlContent += "CREATE TABLE IF NOT EXISTS R1 (A1 INT, A2 INT);\n";
    sqlContent += "CREATE TABLE IF NOT EXISTS R2 (A2 INT, A3 INT);\n";
    sqlContent += "CREATE TABLE IF NOT EXISTS R3 (A3 INT, A4 INT);\n\n";

    sqlContent += "DELETE FROM R1;\n";
    sqlContent += "DELETE FROM R2;\n";
    sqlContent += "DELETE FROM R3;\n\n";

    // Insert R1
    sqlContent += "-- Inserting into R1\n";
    sqlContent += "INSERT INTO R1 (A1, A2) VALUES\n";
    sqlContent += R1.map(t => `(${t.A1}, ${t.A2})`).join(",\n") + ";\n\n";

    // Insert R2
    sqlContent += "-- Inserting into R2\n";
    sqlContent += "INSERT INTO R2 (A2, A3) VALUES\n";
    sqlContent += R2.map(t => `(${t.A2}, ${t.A3})`).join(",\n") + ";\n\n";

    // Insert R3
    sqlContent += "-- Inserting into R3\n";
    sqlContent += "INSERT INTO R3 (A3, A4) VALUES\n";
    sqlContent += R3.map(t => `(${t.A3}, ${t.A4})`).join(",\n") + ";\n";

    fs.writeFileSync(path.join(__dirname, 'solution_6_dataset.sql'), sqlContent);
    console.log("Generated solution_6_dataset.sql");

    // Generate Query File
    const queryContent = `
-- Query for Problem 6
SELECT *
FROM R1
JOIN R2 ON R1.A2 = R2.A2
JOIN R3 ON R2.A3 = R3.A3;
`;
    fs.writeFileSync(path.join(__dirname, 'solution_6_query.sql'), queryContent);
    console.log("Generated solution_6_query.sql");
}

generateSQL();
