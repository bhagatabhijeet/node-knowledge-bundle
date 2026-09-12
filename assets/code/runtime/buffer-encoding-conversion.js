const buf = Buffer.from('café', 'utf8'); // 5 bytes: 'é' is 2 bytes in UTF-8
buf.toString('utf8');                    // 'café'
buf.toString('hex');                     // '636166c3a9'
