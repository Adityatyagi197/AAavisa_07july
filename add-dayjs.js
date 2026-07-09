const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'frontend/src/pages/consultations');
const files = [
  'AdminCalendarView.jsx',
  'AdminConsultationList.jsx',
  'AgentCalendarView.jsx',
  'AgentConsultationList.jsx',
  'CalendarView.jsx',
  'OperationsCalendarView.jsx',
  'OperationsConsultationList.jsx',
  'SuperAdminCalendarView.jsx',
  'SuperAdminConsultationList.jsx'
];

files.forEach(file => {
  const filePath = path.join(dir, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if dayjs is imported
    if (!content.includes("import dayjs from 'dayjs'") && !content.includes('import dayjs from "dayjs"')) {
      // Find the first import statement and prepend it there
      const importIndex = content.indexOf('import ');
      if (importIndex !== -1) {
        content = content.slice(0, importIndex) + "import dayjs from 'dayjs';\n" + content.slice(importIndex);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Added dayjs import to ${file}`);
      }
    }
  }
});
