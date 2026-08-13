const fs = require('fs');
let content = fs.readFileSync('src/components/ScheduleModal.tsx', 'utf-8');

content = content.replace(/className=\\{\\\`/g, "className={`");
content = content.replace(/\\`\\}/g, "`}");

// Wait, looking at the error, it seems the string contains \\\` or something, or I escaped it incorrectly in the script.
// Let's just rewrite ScheduleModal.tsx completely using fs.writeFileSync in the script without EOF backtick issues.
