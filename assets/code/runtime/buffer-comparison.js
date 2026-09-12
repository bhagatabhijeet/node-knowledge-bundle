Buffer.from('a').equals(Buffer.from('a')); // true, content comparison
Buffer.compare(bufA, bufB);                // -1, 0, or 1 — for sorting
