const fs = require('fs');
const path = require('path');

const srcDataDir = path.join(__dirname, 'src', 'data');
const newConfigDir = path.join(__dirname, 'QUAN_TRI_WEBSITE');
const srcDir = path.join(__dirname, 'src');

if (!fs.existsSync(newConfigDir)) {
  fs.mkdirSync(newConfigDir);
}

const fileMapping = {
  'siteConfig.ts': '1_ThongTinCongTy.ts',
  'projectsData.ts': '2_DanhSachDuAn.ts',
  'servicesData.tsx': '3_DanhSachDichVu.tsx',
  'teamData.ts': '4_DoiNguNhanSu.ts',
  'videoData.ts': '5_VideoGioiThieu.ts'
};

const regexMapping = {
  'siteConfig': '1_ThongTinCongTy',
  'projectsData': '2_DanhSachDuAn',
  'servicesData': '3_DanhSachDichVu',
  'teamData': '4_DoiNguNhanSu',
  'videoData': '5_VideoGioiThieu'
};

// 1. Move files
if (fs.existsSync(srcDataDir)) {
  const files = fs.readdirSync(srcDataDir);
  for (const file of files) {
    if (fileMapping[file]) {
      const oldPath = path.join(srcDataDir, file);
      const newPath = path.join(newConfigDir, fileMapping[file]);
      fs.renameSync(oldPath, newPath);
    }
  }
}

// 2. Replace all imports in src/**/*.tsx and src/**/*.ts
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else {
      if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        results.push(filePath);
      }
    }
  }
  return results;
}

const sourceFiles = walk(srcDir);
let changedCount = 0;

for (const filePath of sourceFiles) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Let's explicitly calculate relative path from this file to QUAN_TRI_WEBSITE
  let relativeToRoot = path.relative(path.dirname(filePath), newConfigDir).replace(/\\/g, '/');
  if (!relativeToRoot.startsWith('.')) {
      relativeToRoot = './' + relativeToRoot;
  }
  
  for (const [oldName, newName] of Object.entries(regexMapping)) {
    // Look for imports like: import ... from '../data/siteConfig';
    // Replace the path to point to QUAN_TRI_WEBSITE
    const importRegex = new RegExp(`from\\s+['"]([^'"]*)\\/data\\/${oldName}['"]`, 'g');
    content = content.replace(importRegex, `from '${relativeToRoot}/${newName}'`);
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    changedCount++;
  }
}

console.log(`Successfully migrated configs and updated imports in ${changedCount} files.`);
