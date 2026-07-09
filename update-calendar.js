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

const oldGridBlock = `  // Mock June 2026 Calendar Grid (Starts on Monday, June 1st)
  // June 1st 2026 is a Monday. June has 30 days.
  const daysInJune = 30;
  const calendarCells = Array.from({ length: daysInJune }, (_, i) => {
    const dayNum = i + 1;
    const dateStr = \`2026-06-\${String(dayNum).padStart(2, '0')}\`;`;

const newGridBlock = `  const currentMonth = dayjs().startOf('month');
  const daysInMonth = currentMonth.daysInMonth();
  const yearMonthPrefix = currentMonth.format('YYYY-MM');
  
  const calendarCells = Array.from({ length: daysInMonth }, (_, i) => {
    const dayNum = i + 1;
    const dateStr = \`\${yearMonthPrefix}-\${String(dayNum).padStart(2, '0')}\`;`;

files.forEach(file => {
  const filePath = path.join(dir, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    if (content.includes('daysInJune = 30')) {
      content = content.replace(oldGridBlock, newGridBlock);
      changed = true;
    }

    if (content.includes('June 2026')) {
      content = content.replace(/>\s*June 2026\s*</g, ">{dayjs().format('MMMM YYYY')}<");
      changed = true;
    }

    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${file}`);
    }
  }
});
