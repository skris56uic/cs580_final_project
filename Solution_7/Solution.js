// Problem 7: GJ, GHW, FHW Comparison

// --- Dataset Generation ---

function generateDataset() {
    const N = 2000; // Number of tuples
    const D = 100;  // Domain size (small domain -> dense relations -> large pairwise joins)

    function randomRel(size, domain) {
        const rel = [];
        for (let i = 0; i < size; i++) {
            rel.push({
                col1: Math.floor(Math.random() * domain),
                col2: Math.floor(Math.random() * domain)
            });
        }
        return rel;
    }

    // Triangle 1: {A1, A2, A3}
    // R1(A1, A2), R2(A2, A3), R3(A1, A3)
    // To make pairwise joins heavy but triangle small:
    // Make R1, R2 dense. Make R3 sparse or selective.
    // Actually, random uniform with small domain is usually good enough to show WCOJ benefit.
    const R1 = randomRel(N, D).map(t => ({ A1: t.col1, A2: t.col2 }));
    const R2 = randomRel(N, D).map(t => ({ A2: t.col1, A3: t.col2 }));
    const R3 = randomRel(N, D).map(t => ({ A1: t.col1, A3: t.col2 }));

    // Bridge: R4(A3, A4)
    const R4 = randomRel(N, D).map(t => ({ A3: t.col1, A4: t.col2 }));

    // Triangle 2: {A4, A5, A6}
    // R5(A4, A5), R6(A5, A6), R7(A4, A6)
    const R5 = randomRel(N, D).map(t => ({ A4: t.col1, A5: t.col2 }));
    const R6 = randomRel(N, D).map(t => ({ A5: t.col1, A6: t.col2 }));
    const R7 = randomRel(N, D).map(t => ({ A4: t.col1, A6: t.col2 }));

    return { R1, R2, R3, R4, R5, R6, R7 };
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

// Standard Hash Join (Pairwise)
function hashJoin(leftRel, rightRel, leftAttr, rightAttr) {
    const index = buildIndex(rightRel, rightAttr);
    const results = [];
    for (const l of leftRel) {
        const key = l[leftAttr];
        if (index.has(key)) {
            for (const r of index.get(key)) {
                results.push({ ...l, ...r });
            }
        }
    }
    return results;
}

// --- Algorithm 1: Generic Join (WCOJ) ---

function genericJoin(data) {
    // Variable ordering: A1, A2, A3, A4, A5, A6
    // Relations:
    // A1: R1(A1, A2), R3(A1, A3)
    // A2: R1(A1, A2), R2(A2, A3)
    // A3: R2(A2, A3), R3(A1, A3), R4(A3, A4)
    // ...

    // Build indices for fast lookups
    const idxR1_A1 = buildIndex(data.R1, 'A1');
    const idxR3_A1 = buildIndex(data.R3, 'A1');

    const idxR1_A2 = buildIndex(data.R1, 'A2');
    const idxR2_A2 = buildIndex(data.R2, 'A2');

    const idxR2_A3 = buildIndex(data.R2, 'A3');
    const idxR3_A3 = buildIndex(data.R3, 'A3');
    const idxR4_A3 = buildIndex(data.R4, 'A3');

    const idxR4_A4 = buildIndex(data.R4, 'A4');
    const idxR5_A4 = buildIndex(data.R5, 'A4');
    const idxR7_A4 = buildIndex(data.R7, 'A4');

    const idxR5_A5 = buildIndex(data.R5, 'A5');
    const idxR6_A5 = buildIndex(data.R6, 'A5');

    const idxR6_A6 = buildIndex(data.R6, 'A6');
    const idxR7_A6 = buildIndex(data.R7, 'A6');

    const results = [];

    // Iterate A1 (Domain: keys of R1 or R3)
    // Optimization: intersection of domains
    const domainA1 = new Set([...idxR1_A1.keys()].filter(k => idxR3_A1.has(k)));

    for (const a1 of domainA1) {
        // Iterate A2 (constrained by R1(a1, A2))
        const candidatesA2 = idxR1_A1.get(a1).map(t => t.A2);

        for (const a2 of candidatesA2) {
            // Check if valid in R2(A2, *)? Not strictly needed if we check intersection later,
            // but for WCOJ we usually intersect valid ranges.
            if (!idxR2_A2.has(a2)) continue;

            // Iterate A3 (constrained by R2(a2, A3) AND R3(a1, A3) AND R4(A3, *))
            const c1 = idxR2_A2.get(a2).map(t => t.A3);
            const c2 = idxR3_A1.get(a1).map(t => t.A3); // R3(a1, A3)
            // Intersect
            const s2 = new Set(c2);
            const validA3 = c1.filter(val => s2.has(val) && idxR4_A3.has(val));

            for (const a3 of validA3) {
                // Iterate A4 (constrained by R4(a3, A4) AND R5(A4, *) AND R7(A4, *))
                const candidatesA4 = idxR4_A3.get(a3).map(t => t.A4);

                for (const a4 of candidatesA4) {
                    if (!idxR5_A4.has(a4) || !idxR7_A4.has(a4)) continue;

                    // Iterate A5 (constrained by R5(a4, A5) AND R6(A5, *))
                    const candidatesA5 = idxR5_A4.get(a4).map(t => t.A5);

                    for (const a5 of candidatesA5) {
                        if (!idxR6_A5.has(a5)) continue;

                        // Iterate A6 (constrained by R6(a5, A6) AND R7(a4, A6))
                        const cA6_1 = idxR6_A5.get(a5).map(t => t.A6);
                        const cA6_2 = idxR7_A4.get(a4).map(t => t.A6);
                        const sA6_2 = new Set(cA6_2);

                        const validA6 = cA6_1.filter(val => sA6_2.has(val));

                        for (const a6 of validA6) {
                            results.push({ A1: a1, A2: a2, A3: a3, A4: a4, A5: a5, A6: a6 });
                        }
                    }
                }
            }
        }
    }
    return results;
}

// --- Algorithm 2: GHW (Standard Join on Decomposition) ---

function ghwJoin(data) {
    // Decomposition:
    // Bag 1: {A1, A2, A3} -> R1, R2, R3
    // Bag 2: {A4, A5, A6} -> R5, R6, R7
    // Connected by R4(A3, A4)

    // Compute Bag 1 using Standard Hash Joins
    // (R1 join R2) join R3
    const r1r2 = hashJoin(data.R1, data.R2, 'A2', 'A2'); // Result: {A1, A2, A3}
    const bag1 = hashJoin(r1r2, data.R3, 'A1', 'A1')
        .filter(t => t.A3 === t.A3); // Check consistency on A3 (hashJoin merges, but we need to ensure R3.A3 == R2.A3)
    // Wait, hashJoin above joined on A1. The result has A3 from R2 and A3 from R3.
    // My simple hashJoin merges objects. If keys collide, right overwrites left.
    // So we need to be careful.
    // Let's refine hashJoin or filter explicitly.

    // Refined Bag 1 computation:
    // 1. Join R1(A1,A2) and R2(A2,A3) -> Temp(A1,A2,A3)
    // 2. Filter Temp where (A1,A3) exists in R3

    // Re-implementing specific logic for correctness:
    const idxR3 = new Set(data.R3.map(t => `${t.A1},${t.A3}`));
    const bag1Results = [];
    const idxR2_A2 = buildIndex(data.R2, 'A2');

    for (const r1 of data.R1) {
        if (idxR2_A2.has(r1.A2)) {
            for (const r2 of idxR2_A2.get(r1.A2)) {
                if (idxR3.has(`${r1.A1},${r2.A3}`)) {
                    bag1Results.push({ A1: r1.A1, A2: r1.A2, A3: r2.A3 });
                }
            }
        }
    }

    // Compute Bag 2 using Standard Hash Joins
    // (R5 join R6) join R7
    const idxR7 = new Set(data.R7.map(t => `${t.A4},${t.A6}`));
    const bag2Results = [];
    const idxR6_A5 = buildIndex(data.R6, 'A5');

    for (const r5 of data.R5) {
        if (idxR6_A5.has(r5.A5)) {
            for (const r6 of idxR6_A5.get(r5.A5)) {
                if (idxR7.has(`${r5.A4},${r6.A6}`)) {
                    bag2Results.push({ A4: r5.A4, A5: r5.A5, A6: r6.A6 });
                }
            }
        }
    }

    // Join Bag 1, R4, Bag 2
    // Bag 1(A1,A2,A3) join R4(A3,A4) join Bag 2(A4,A5,A6)
    const left = hashJoin(bag1Results, data.R4, 'A3', 'A3');
    const final = hashJoin(left, bag2Results, 'A4', 'A4');

    return final;
}

// --- Algorithm 3: FHW (WCOJ on Decomposition) ---

function fhwJoin(data) {
    // Decomposition: Same bags.
    // Compute Bag 1 using WCOJ logic (Generic Join on Triangle)

    function wcojTriangle1() {
        const results = [];
        const idxR1_A1 = buildIndex(data.R1, 'A1');
        const idxR2_A2 = buildIndex(data.R2, 'A2');
        const idxR3_A1 = buildIndex(data.R3, 'A1');

        // Iterate A1
        for (const a1 of idxR1_A1.keys()) {
            if (!idxR3_A1.has(a1)) continue;
            // Iterate A2
            const cA2 = idxR1_A1.get(a1).map(t => t.A2);
            for (const a2 of cA2) {
                if (!idxR2_A2.has(a2)) continue;
                // Iterate A3
                const cA3_1 = idxR2_A2.get(a2).map(t => t.A3);
                const cA3_2 = idxR3_A1.get(a1).map(t => t.A3);
                const sA3_2 = new Set(cA3_2);

                for (const a3 of cA3_1) {
                    if (sA3_2.has(a3)) {
                        results.push({ A1: a1, A2: a2, A3: a3 });
                    }
                }
            }
        }
        return results;
    }

    function wcojTriangle2() {
        const results = [];
        const idxR5_A4 = buildIndex(data.R5, 'A4');
        const idxR6_A5 = buildIndex(data.R6, 'A5');
        const idxR7_A4 = buildIndex(data.R7, 'A4');

        for (const a4 of idxR5_A4.keys()) {
            if (!idxR7_A4.has(a4)) continue;
            const cA5 = idxR5_A4.get(a4).map(t => t.A5);
            for (const a5 of cA5) {
                if (!idxR6_A5.has(a5)) continue;
                const cA6_1 = idxR6_A5.get(a5).map(t => t.A6);
                const cA6_2 = idxR7_A4.get(a4).map(t => t.A6);
                const sA6_2 = new Set(cA6_2);

                for (const a6 of cA6_1) {
                    if (sA6_2.has(a6)) {
                        results.push({ A4: a4, A5: a5, A6: a6 });
                    }
                }
            }
        }
        return results;
    }

    const bag1Results = wcojTriangle1();
    const bag2Results = wcojTriangle2();

    // Join Bag 1, R4, Bag 2
    const left = hashJoin(bag1Results, data.R4, 'A3', 'A3');
    const final = hashJoin(left, bag2Results, 'A4', 'A4');

    return final;
}

// --- Execution ---

const dataset = generateDataset();
console.log("Dataset Generated.");
console.log(`R1: ${dataset.R1.length}, R2: ${dataset.R2.length}, R3: ${dataset.R3.length}`);

// Run GJ
console.time("Generic Join (WCOJ)");
const resGJ = genericJoin(dataset);
console.timeEnd("Generic Join (WCOJ)");
console.log(`GJ Results: ${resGJ.length}`);

// Run GHW
console.time("GHW Join");
const resGHW = ghwJoin(dataset);
console.timeEnd("GHW Join");
console.log(`GHW Results: ${resGHW.length}`);

// Run FHW
console.time("FHW Join");
const resFHW = fhwJoin(dataset);
console.timeEnd("FHW Join");
console.log(`FHW Results: ${resFHW.length}`);

// Verify
const countGJ = resGJ.length;
const countGHW = resGHW.length;
const countFHW = resFHW.length;

if (countGJ === countGHW && countGHW === countFHW) {
    console.log("Verification: All algorithms returned the same number of results.");
} else {
    console.log("Verification FAILED: Result counts differ.");
}
