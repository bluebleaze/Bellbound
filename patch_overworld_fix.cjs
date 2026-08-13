const fs = require('fs');
let code = fs.readFileSync('src/components/Overworld.tsx', 'utf8');

code = code.replace(
`} else {
              setNearTeacher(null);
            }
          } else {
              setNearTeacher(null);
            }
          } else {`, 
`} else {
              setNearTeacher(null);
            }
          } else {`);

fs.writeFileSync('src/components/Overworld.tsx', code);
console.log('Fixed');
