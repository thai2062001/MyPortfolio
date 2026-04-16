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
  
  if (content.includes('className="text-center py-12"')){
    console.log("Found in file: ", path.basename(file));
  }
  
  // A simpler replace using split or indexof
  const needles = [
    '<div className="text-center py-12">{translations[lang].loading}</div>',
    '<div className="text-center py-12">{t.loading}</div>',
    '<div className="text-center py-12">Loading...</div>',
    '<div className="text-center py-12">\n            <p className="text-gray-500">{translations[lang].loading}</p>\n          </div>',
    '<div className="text-center py-12">\n            <p className="text-gray-500">Loading...</p>\n          </div>',
    '<div className="text-center py-12 text-sm md:text-base">\n                {translations[lang].loading}\n              </div>'
  ];

  for (let needle of needles) {
     if (content.includes(needle)) {
         let spinnerCall = '';
         if (needle.includes('translations[lang].loading')) spinnerCall = '<LoadingSpinner text={translations[lang].loading} />';
         else if (needle.includes('t.loading')) spinnerCall = '<LoadingSpinner text={t.loading} />';
         else spinnerCall = '<LoadingSpinner text="Loading..." />';

         content = content.replace(needle, spinnerCall);
         hasChanges = true;
     }
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
