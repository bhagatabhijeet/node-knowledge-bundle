Buffer.alloc(10);            // 10 zero-filled bytes
Buffer.allocUnsafe(10);      // 10 uninitialized bytes — faster, may contain old memory
Buffer.from('hello', 'utf8');// from a string, given an encoding
Buffer.from([1, 2, 3]);      // from an array of bytes
