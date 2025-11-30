🔍 Minor Refinements:
1. Dataset Generation Clarification
Your comment about the join selectivity could be more precise:

javascript
// R2: 100 tuples (y, j) where j=1..100, y in [1,5000]
// Schema: A2, A3
// Since A2 values are random in [1,5000] and we only have 100 tuples,
// the join R1 ⋈ R2 on A2 will have low selectivity (few matches expected)
// The join R2 ⋈ R3 on A3 will be more selective since A3=j and R3.A3=l, both 1..100
2. Performance Analysis Enhancement
You could add a brief note about why the performance difference matters:

markdown
**Performance Insight**: The sequential join's slight advantage here demonstrates that algorithm overhead matters for small datasets. For larger N or more complex join patterns, Yannakakis' O(N + OUT) guarantee becomes crucial.
3. Result Verification Improvement
Instead of JSON string comparison (which works but is heavy), you could use a more efficient approach:

javascript
function resultsEqual(res1, res2) {
    if (res1.length !== res2.length) return false;
    const sorted1 = sortResults([...res1]);
    const sorted2 = sortResults([...res2]);
    return sorted1.every((t, i) => 
        t.A1 === sorted2[i].A1 && 
        t.A2 === sorted2[i].A2 && 
        t.A3 === sorted2[i].A3 && 
        t.A4 === sorted2[i].A4
    );
}