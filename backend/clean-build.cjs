const fs = require('fs');

const pathsToRemove = ['dist', 'tsconfig.build.tsbuildinfo'];

for (const pathToRemove of pathsToRemove) {
  fs.rmSync(pathToRemove, {
    recursive: true,
    force: true,
  });
}

console.log('Build anterior limpiado correctamente.');