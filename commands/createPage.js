// createPage.js

const fs = require('fs-extra');
const path = require('path');

// Function to create a new page
async function createNewPage(pageName) {
    const htmlDir = path.join(__dirname, '../src/html/pages');
    const jsDir = path.join(__dirname, '../src/js/pages');
    const indexPath = path.join(jsDir, 'index.js');

    const htmlFilePath = path.join(htmlDir, `${pageName}.html`);
    const jsFilePath = path.join(jsDir, `${pageName}.js`);

    // Create new HTML and JS files
    await fs.ensureFile(htmlFilePath);
    await fs.writeFile(htmlFilePath, `<html><body><h1>${pageName}</h1></body></html>`, 'utf8');
    await fs.ensureFile(jsFilePath);
    await fs.writeFile(jsFilePath, `// ${pageName}.js\n\nconsole.log('${pageName} page');`, 'utf8');

    console.log(`Created ${htmlFilePath}`);
    console.log(`Created ${jsFilePath}`);

    // Update index.js
    const files = await fs.readdir(jsDir);
    const imports = files
        .filter(file => file !== 'index.js' && file.endsWith('.js'))
        .map(file => `import * as ${path.basename(file, '.js')} from './${file}';`).join('\n');

    const exports = files
        .filter(file => file !== 'index.js' && file.endsWith('.js'))
        .map(file => path.basename(file, '.js')).join(',\n    ');

    const indexContent = `${imports}

export default {
    ${exports}
};`;

    await fs.writeFile(indexPath, indexContent, 'utf8');
    console.log(`Updated ${indexPath}`);
}

// Get the page name from command line arguments
const [, , pageName] = process.argv;

if (!pageName) {
    console.error('Please provide a page name.');
    process.exit(1);
}

createNewPage(pageName).catch(err => {
    console.error(err);
    process.exit(1);
});
