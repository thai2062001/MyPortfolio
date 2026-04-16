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
  
  if (content.includes('LoadingSpinner') && !content.includes('import { LoadingSpinner }')) {
    // inject at the top, just below first import or absolute top of file
    content = `import { LoadingSpinner } from "@/components/ui/loading-spinner";\n` + content;
    fs.writeFileSync(file, content);
    updatedCount++;
    console.log(`Injected import into ${path.basename(file)}`);
  }
}

console.log(`Done! Injected imports into ${updatedCount} files.`);
