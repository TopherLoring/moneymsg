const fs = require('fs');
let code = fs.readFileSync('src/app/google-services.json', 'utf8');
if (!code.endsWith('\n')) {
  code += '\n';
  fs.writeFileSync('src/app/google-services.json', code);
}
