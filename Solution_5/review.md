🔍 Minor Refinements:
1. Result Count Explanation
You could briefly explain where the 1001 results come from:

markdown
**Result Count Analysis**: The 1001 results consist of:
- 1000 tuples from the path: R1(A2=5) ⋈ R2(A2=5, A3=1..1000) ⋈ R3(A3=1..1000, A4=?) 
- 1 tuple from the path: R1(2001,2002) ⋈ R2(2002,8) ⋈ R3(8,30)
2. Yannakakis Reduction Details
You could add more specific reduction statistics:

javascript
// During reduction phase, add logging:
console.log(`R2 reduced from ${originalSize} to ${rels[1].length} tuples`);
// This would show R2 being dramatically reduced from 2001 to ~1 tuple
3. Memory Usage Note
The report could mention that Sequential Join also uses significantly more memory due to materializing 2M intermediate tuples, while Yannakakis keeps relations small throughout.

