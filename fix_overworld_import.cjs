const fs = require('fs');
let content = fs.readFileSync('src/components/Overworld.tsx', 'utf-8');
if(!content.includes('GAME_SCHEDULE')) {
  content = content.replace("SubjectId, TeacherFoe } from '../types';", "SubjectId, TeacherFoe, GAME_SCHEDULE } from '../types';");
  fs.writeFileSync('src/components/Overworld.tsx', content);
  console.log('Fixed Overworld import');
}
