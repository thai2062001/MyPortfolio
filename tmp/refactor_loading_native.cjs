const fs = require('fs');
const path = require('path');

const srcAdmin = path.join(__dirname, '../src/pages/admin');

function walk(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      walk(filePath, fileList);
    } else if (filePath.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const files = walk(srcAdmin);

let updatedCount = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  let hasChanges = false;
  
  // Replace <div className="text-center py-12">{t.loading}</div> etc
  const regex = /<div className="text-center py-12[^>]*>\s*(?:<p[^>]*>)?\s*({[^}]+}|Loading\.\.\.)\s*(?:<\/p>)?\s*<\/div>/g;
  
  if (regex.test(content)) {
    content = content.replace(regex, (match, innerText) => {
      // Clean up string wrapper if needed
      return `<LoadingSpinner text={${innerText.startsWith('{') ? innerText.substring(1, innerText.length - 1) : `"${innerText}"`}} />`;
    });
    hasChanges = true;
  }
  
  if (hasChanges && !content.includes('LoadingSpinner')) {
    const importRegex = /import .* from ['"].*['"];?\n/g;
    let match;
    let lastImportIndex = 0;
    while ((match = importRegex.exec(content)) !== null) {
      lastImportIndex = match.index + match[0].length;
    }
    
    content = content.slice(0, lastImportIndex) + `import { LoadingSpinner } from "@/components/ui/loading-spinner";\n` + content.slice(lastImportIndex);
    fs.writeFileSync(file, content);
    updatedCount++;
    console.log(`Updated ${path.basename(file)}`);
  }
}

console.log(`Done! Updated ${updatedCount} files.`);
