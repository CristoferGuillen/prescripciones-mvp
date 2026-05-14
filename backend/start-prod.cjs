const fs = require('fs');
const path = require('path');

function findMainFile(directory) {
  if (!fs.existsSync(directory)) {
    return null;
  }

  const entries = fs.readdirSync(directory, {
    withFileTypes: true,
  });

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      const found = findMainFile(fullPath);

      if (found) {
        return found;
      }
    }

    if (entry.isFile() && entry.name === 'main.js') {
      return fullPath;
    }
  }

  return null;
}

const distPath = path.join(process.cwd(), 'dist');
const entrypoint = findMainFile(distPath);

if (!entrypoint) {
  console.error('No se encontró main.js dentro de la carpeta dist.');
  console.error('Verifica que npm run build esté generando el backend compilado.');

  if (fs.existsSync(distPath)) {
    console.error('Contenido actual de dist:');

    function printTree(directory, prefix = '') {
      const entries = fs.readdirSync(directory, {
        withFileTypes: true,
      });

      entries.forEach((entry) => {
        const fullPath = path.join(directory, entry.name);
        console.error(`${prefix}- ${entry.name}`);

        if (entry.isDirectory()) {
          printTree(fullPath, `${prefix}  `);
        }
      });
    }

    printTree(distPath);
  } else {
    console.error('La carpeta dist no existe.');
  }

  process.exit(1);
}

console.log(`Iniciando backend desde ${path.relative(process.cwd(), entrypoint)}`);

require(entrypoint);