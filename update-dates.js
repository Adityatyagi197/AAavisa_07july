const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'frontend/src/pages/consultations');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Replace calendar hardcoded state
  if (content.includes("useState('2026-06-18')")) {
    content = content.replace(/useState\('2026-06-18'\)/g, "useState(dayjs().format('YYYY-MM-DD'))");
    changed = true;
  }

  // Replace mockToday
  if (content.includes("mockToday = '2026-06-18'")) {
    content = content.replace(/mockToday = '2026-06-18'/g, "mockToday = dayjs().format('YYYY-MM-DD')");
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
