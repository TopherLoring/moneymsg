const fs = require('fs');
let code = fs.readFileSync('src/modules/webhooks/http/routes.ts', 'utf8');

code = code.replace(/<<<<<<< HEAD\n=======\n        const ok = verifyHmac\(raw \|\| "", signature, config\.secret, undefined\);\n        const ok = verifyHmac\(raw \|\| "", signature, config\.secret\);\n>>>>>>> origin\/main\n/s, '');

// Also fix the content type parser
code = code.replace(/app\.removeAllContentTypeParsers\(\);\n  app\.addContentTypeParser\("\*", \{ parseAs: "string" \}, \(req, body, done\) => \{\n  app\.addContentTypeParser\("\*\/\*", \{ parseAs: "string", bodyLimit: 1048576 \}, \(req, body, done\) => \{\n/g,
`app.removeAllContentTypeParsers();
  app.addContentTypeParser("*", { parseAs: "string", bodyLimit: 1048576 }, (req, body, done) => {
`);

fs.writeFileSync('src/modules/webhooks/http/routes.ts', code);
