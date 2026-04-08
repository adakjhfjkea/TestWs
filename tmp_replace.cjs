const fs = require('fs');
const path = require('path');

function walk(d) {
  let res = [];
  const list = fs.readdirSync(d);
  list.forEach(f => {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) {
      res = res.concat(walk(p));
    } else {
      if (p.endsWith('.tsx') || p.endsWith('.ts')) {
        res.push(p);
      }
    }
  });
  return res;
}

const fList = walk(path.join(__dirname, 'src'));
let changed = 0;
fList.forEach(fp => {
  let c = fs.readFileSync(fp, 'utf8');
  let orig = c;
  
  // Replace: import { varName } from '.../QUAN_TRI_WEBSITE/...'
  // With: import varName from '.../QUAN_TRI_WEBSITE/....json'
  c = c.replace(/import\s+\{\s*([a-zA-Z0-9_]+)\s*\}\s+from\s+['"]([^'"]*QUAN_TRI_WEBSITE[^'"]*)['"]/g, "import $1 from '$2.json'");
  
  if (c !== orig) {
    fs.writeFileSync(fp, c, 'utf8');
    changed++;
  }
});
console.log(`Replaced imports in ${changed} files`);
