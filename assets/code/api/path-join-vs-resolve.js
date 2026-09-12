path.join('/a', 'b', '../c');     // '/a/c'  — concatenates, then normalizes
path.resolve('/a', 'b', '../c');  // '/a/c'  — same here, but...
path.resolve('a', 'b');           // '/cwd/a/b' — resolve() anchors to CWD
                                   //             for a relative first segment
path.join('a', 'b');              // 'a/b'       — join() never adds CWD
