const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'frontend/src/pages/consultations');
const files = [
  'AdminCalendarView.jsx',
  'AgentCalendarView.jsx',
  'CalendarView.jsx',
  'OperationsCalendarView.jsx',
  'SuperAdminCalendarView.jsx'
];

files.forEach(file => {
  const filePath = path.join(dir, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Make sure monthOffset exists, if not, add it after the component declaration
    if (!content.includes('const [monthOffset, setMonthOffset] = useState(0);')) {
       // Find the first line after `export const ... = () => {`
       content = content.replace(/(\(\) => \{[\s\n]*)/, "$1  const [monthOffset, setMonthOffset] = useState(0);\n");
    }

    // Replace the grid logic using regex to ignore whitespace variations
    const regex = /\/\/ Mock June 2026 Calendar Grid.*?const dateStr = `2026-06-\$\{String\(dayNum\)\.padStart\(2, '0'\)\}`;/s;
    const replacement = `const currentMonth = dayjs().add(monthOffset, 'month').startOf('month');
  const daysInMonth = currentMonth.daysInMonth();
  const yearMonthPrefix = currentMonth.format('YYYY-MM');
  
  const calendarCells = Array.from({ length: daysInMonth }, (_, i) => {
    const dayNum = i + 1;
    const dateStr = \`\${yearMonthPrefix}-\${String(dayNum).padStart(2, '0')}\`;`;

    content = content.replace(regex, replacement);

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fully Fixed grid in ${file}`);
  }
});
