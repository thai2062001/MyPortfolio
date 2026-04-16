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
console.log("Found files:", files.length);

let updatedCount = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  let hasChanges = false;
  
  const regex = /<\s*div[^>]*className="text-center py-12(?: text-sm md:text-base)?"[^>]*>([\s\S]*?)<\/\s*div\s*>/g;
  
  content = content.replace(regex, (match, inner) => {
    // Only replace it if it actually contains a loading text
    if (inner.includes('translations[lang].loading')) {
      hasChanges = true;
      return '<LoadingSpinner text={translations[lang].loading} />';
    }
    if (inner.includes('t.loading')) {
      hasChanges = true;
      return '<LoadingSpinner text={t.loading} />';
    }
    if (inner.includes('Loading...')) {
      hasChanges = true;
      return '<LoadingSpinner text="Loading..." />';
    }
    return match; // don't replace if it's some other banner
  });
  
  if (hasChanges) {
    if (!content.includes('LoadingSpinner')) {
      const importRegex = /import .* from ['"].*['"];?(?:\r?\n)/g;
      let match;
      let lastImportIndex = 0;
      while ((match = importRegex.exec(content)) !== null) {
        lastImportIndex = match.index + match[0].length;
      }
      content = content.slice(0, lastImportIndex) + `import { LoadingSpinner } from "@/components/ui/loading-spinner";\n` + content.slice(lastImportIndex);
    }
    fs.writeFileSync(file, content);
    updatedCount++;
    console.log(`Updated ${path.basename(file)}`);
  }
}

console.log(`Done! Updated ${updatedCount} files.`);
