const fs = require('fs');
const glob = require('glob');
const path = require('path');

const srcAdmin = path.join(__dirname, '../src/pages/admin');
const files = glob.sync(`${srcAdmin}/**/*.tsx`);

let updatedCount = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  let hasChanges = false;
  
  // Replace <div className="text-center py-12">{t.loading}</div> etc
  // We look for anything matching `<div className="text-center py-12*.*>...Loading...</div>`
  const regex = /<div className="text-center py-12[^>]*>\s*(?:<p[^>]*>)?\s*({[^}]+}|Loading\.\.\.)\s*(?:<\/p>)?\s*<\/div>/g;
  
  if (regex.test(content)) {
    content = content.replace(regex, (match, innerText) => {
      // Remove <p> tags if they exist inside innerText, shouldn't normally as the regex captures innerText
      return `<LoadingSpinner text={${innerText.startsWith('{') ? innerText.slice(1, -1) : `"${innerText}"`}} />`;
    });
    hasChanges = true;
  }
  
  // Import LoadingSpinner if changes were made and not already imported
  if (hasChanges && !content.includes('LoadingSpinner')) {
    // Add import statement after the last import
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
