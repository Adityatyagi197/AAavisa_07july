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
    let changed = false;

    // 1. Add monthOffset state
    if (content.includes("const currentMonth = dayjs().startOf('month');")) {
      content = content.replace(
        "const currentMonth = dayjs().startOf('month');",
        "const [monthOffset, setMonthOffset] = useState(0);\n  const currentMonth = dayjs().add(monthOffset, 'month').startOf('month');"
      );
      changed = true;
    }

    // 2. Change header format to use currentMonth
    if (content.includes("{dayjs().format('MMMM YYYY')}")) {
      content = content.replace(
        /\{dayjs\(\)\.format\('MMMM YYYY'\)\}/g,
        "{currentMonth.format('MMMM YYYY')}"
      );
      changed = true;
    }

    // 3. Enable arrow buttons
    if (content.includes("<IconButton disabled")) {
      content = content.replace(
        /<IconButton disabled(.*?)><ArrowBackIosIcon (.*?)\/><\/IconButton>/g,
        "<IconButton onClick={() => setMonthOffset(p => p - 1)} $1><ArrowBackIosIcon $2/></IconButton>"
      );
      content = content.replace(
        /<IconButton disabled(.*?)><ArrowForwardIosIcon (.*?)\/><\/IconButton>/g,
        "<IconButton onClick={() => setMonthOffset(p => p + 1)} $1><ArrowForwardIosIcon $2/></IconButton>"
      );
      changed = true;
    }

    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated arrows in ${file}`);
    }
  }
});
