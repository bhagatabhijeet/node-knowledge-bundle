path.parse('/home/user/file.txt');
// { root: '/', dir: '/home/user', base: 'file.txt', ext: '.txt', name: 'file' }

path.format({ dir: '/home/user', base: 'file.txt' }); // '/home/user/file.txt'
path.basename('/a/b/file.txt');       // 'file.txt'
path.extname('/a/b/file.txt');        // '.txt'
path.dirname('/a/b/file.txt');        // '/a/b'
