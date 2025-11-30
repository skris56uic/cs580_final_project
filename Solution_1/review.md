🔍 Minor Suggestions (Optional Improvements):
1. Generalize Attribute Names
Your current implementation assumes attribute names A, B, C. For full generality, you could make the join keys configurable:

javascript
function hashJoin(r1, r2, joinKey) {
  // ...
  const key = t1[joinKey];
  // ...
}
// Usage: hashJoin(R1, R2, 'B')
2. Output Schema Clarification
You correctly output (A, B, C), but note that B appears in both relations. You could explicitly mention that you're using a natural join semantics where the join attribute appears once.

3. Complexity Mention
You correctly note the time complexity as ~O(|R1| + |R2|). You could briefly mention that this is the expected complexity due to hash map operations, and that worst-case could be O(|R1| × |R2|) if all tuples have the same join key (though hash collisions are unlikely in practice with good hash functions).