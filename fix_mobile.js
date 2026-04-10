const fs = require('fs');
const file = 'd:/GCU/2026_Jan_Jun/GCUInternship/index.html';
let html = fs.readFileSync(file, 'utf8');

// 1. Add ID to menu button and wrap account_circle in an anchor
html = html.replace(
    /<span\s*.*?data-icon="account_circle">account_circle<\/span>\s*<button class="md:hidden material-symbols-outlined text-primary">menu<\/button>/g,
    `<a href="admin.html" aria-label="Admin Login">
                        <span class="material-symbols-outlined text-primary cursor-pointer scale-95 transition-transform duration-200" data-icon="account_circle">account_circle</span>
                    </a>
                    <button id="mobileMenuBtn" class="md:hidden material-symbols-outlined text-primary">menu</button>`
);

// 2. Extract the departments from the Mega Menu Dropdown using regex
const megaMenuLinksMatch = html.match(/<div class="space-y-2 max-h-\[70vh\].*?">([\s\S]*?)<\/div>\s*<div class="space-y-2 max-h-\[70vh\].*?">([\s\S]*?)<\/div>/);
const part1 = megaMenuLinksMatch ? megaMenuLinksMatch[1] : '';
const part2 = megaMenuLinksMatch ? megaMenuLinksMatch[2] : '';

// 3. Assemble the Mobile Menu HTML
const mobileMenuHTML = `
        <!-- Mobile Menu Container -->
        <div id="mobileMenu" class="hidden md:hidden absolute top-full left-0 w-full bg-surface shadow-2xl border-t border-primary/10 flex-col max-h-[70vh] overflow-y-auto z-50">
            <div class="flex flex-col p-6 space-y-4">
                <div class="text-xl font-serif font-bold text-primary border-b border-outline-variant/30 pb-2">Departments</div>
                ${part1}
                ${part2}
            </div>
        </div>
`;

// Insert the Mobile Menu right before </nav>
if (!html.includes('id="mobileMenu"')) {
    html = html.replace(/<\/nav>/, mobileMenuHTML + '\n    </nav>');
}

// 4. Add the toggle script before </body>
const toggleScript = `
    <script>
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileMenu = document.getElementById('mobileMenu');
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                if (mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.remove('hidden');
                    mobileMenu.classList.add('flex');
                    mobileMenuBtn.textContent = 'close';
                } else {
                    mobileMenu.classList.add('hidden');
                    mobileMenu.classList.remove('flex');
                    mobileMenuBtn.textContent = 'menu';
                }
            });

            // Close mobile menu when a link is clicked
            mobileMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.add('hidden');
                    mobileMenu.classList.remove('flex');
                    mobileMenuBtn.textContent = 'menu';
                });
            });
        }
    </script>
</body>`;

if (!html.includes('mobileMenuBtn.addEventListener')) {
    html = html.replace(/<\/body>/, toggleScript);
}

fs.writeFileSync(file, html);
console.log('Mobile menu added successfully.');
