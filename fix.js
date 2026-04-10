const fs = require('fs');
const file = 'd:/GCU/2026_Jan_Jun/GCUInternship/index.html';
let html = fs.readFileSync(file, 'utf8');

// Replace all onerror strings with handleImageError callback
html = html.replace(/onerror="this\.onerror=null;\s*this\.src='images\/(.*?)\.jpg';"/g, "onerror=\"handleImageError(this, '$1')\"");
// specifically mechanical engineering has .jpeg fallback
html = html.replace(/onerror="this\.onerror=null;\s*this\.src='images\/(.*?)\.jpeg';"/g, "onerror=\"handleImageError(this, '$1')\"");

fs.writeFileSync(file, html);
console.log('done');
