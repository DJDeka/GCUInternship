const fs = require('fs');

const depts = [
    "Computer Science & Engineering",
    "Civil Engineering",
    "Electrical Engineering",
    "Electronics and Communication Engineering",
    "Mechanical Engineering",
    "Computer Application",
    "Medical Laboratory Technology",
    "Physiotherapy",
    "History",
    "Psychology",
    "Economics",
    "Sociology",
    "Political Science",
    "English & Foreign Language",
    "Education",
    "Journalism & Mass Communication",
    "Law",
    "Business Administration",
    "Commerce",
    "Physics",
    "Chemistry",
    "Mathematics",
    "Zoology",
    "Botany",
    "Agriculture",
    "Pharmaceutical Science"
];

function buildId(name) {
    return 'dept-' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

let html = fs.readFileSync('index.html', 'utf-8');

// The Mega Menu is here: <div class="absolute top-full left-0 mt-2 w-[600px] bg-white shadow-2xl rounded-xl p-6 grid grid-cols-2 gap-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-outline-variant/20">
// ... up to </div>\n</div>

const half = Math.ceil(depts.length / 2);
let megaHtml = `
<div class="absolute top-full left-0 mt-2 w-[600px] bg-white shadow-2xl rounded-xl p-6 grid grid-cols-2 gap-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-outline-variant/20">
<div class="space-y-2 max-h-60 overflow-y-auto pr-2">
${depts.slice(0, half).map(d => `<a class="block text-sm text-primary/70 hover:text-secondary" href="#${buildId(d)}">${d.replace(/&/g, '&amp;')}</a>`).join('\n')}
</div>
<div class="space-y-2 max-h-60 overflow-y-auto pr-2">
${depts.slice(half).map(d => `<a class="block text-sm text-primary/70 hover:text-secondary" href="#${buildId(d)}">${d.replace(/&/g, '&amp;')}</a>`).join('\n')}
</div>
</div>
`;

html = html.replace(/<div class="absolute top-full left-0 mt-2 w-\[600px\][\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, megaHtml.trim() + '\n</div>');

// Function for smart embedded JS to find the correct format
// We can't put multiline script cleanly inline into the innerHTML easy, so we just attach an onerror on the image
// And the View Flyer link will just trigger a JS function instead of hardcoding `href`

let gridHtml = `
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
${depts.map(d => {
    let rawName = d;
    return `
<div id="${buildId(d)}" class="group relative department-card bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,25,67,0.04)] hover:shadow-2xl transition-all duration-500 border-l-4 border-secondary scroll-mt-32" data-dept="${rawName}">
<div class="aspect-[4/5] bg-surface-container relative overflow-hidden flex items-center justify-center p-4">
<img alt="${d}" class="dept-image w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 bg-white" src="images/${rawName}.png" onerror="this.onerror=null; this.src='images/${rawName}.jpg';"/>
<div class="absolute inset-0 bg-primary/40 flex items-center justify-center p-6 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
<button onclick="openFlyer('${rawName}')" class="bg-white text-primary px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2 hover:bg-surface">
<span class="material-symbols-outlined">visibility</span> View Flyer
</button>
</div>
</div>
<div class="p-6">
<h3 class="text-lg font-bold text-primary mb-4 serif-title h-14 flex items-center">${d.replace(/&/g, '&amp;')}</h3>
<a href="registration.html" class="register-btn block w-full text-center bg-primary text-white py-3 rounded-lg font-semibold hover:bg-secondary-container hover:text-on-secondary-container transition-all">Register Now</a>
</div>
</div>
`}).join('')}
</div>
`;

html = html.replace(/<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">[\s\S]*?<\/section>/, gridHtml.trim() + '\n</section>');

// Append a small script at the end for the 'openFlyer' function
if (!html.includes('function openFlyer')) {
    html = html.replace('</body>', `
<script>
async function openFlyer(dept) {
    const formats = ['png', 'jpg', 'pdf'];
    for (const fmt of formats) {
        const url = 'images/' + dept + '.' + fmt;
        try {
            const resp = await fetch(url, {method: 'HEAD'});
            if (resp.ok) {
                window.open(url, '_blank');
                return;
            }
        } catch(e) {
            // If fetch fails (like CORS on generic files), we just guess randomly or open pdf directly
        }
    }
    // Fallback: Default to opening PDF if fetch detection failed
    window.open('images/' + dept + '.pdf', '_blank');
}
</script>
</body>
`);
}

fs.writeFileSync('index.html', html);
console.log('Update complete with dynamic images!');
