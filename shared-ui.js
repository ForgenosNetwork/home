// GitHub Root: /shared-ui.js

function renderForgenosUI() {
    // 1. MOBILE HEADER
    const mobileHeaderHTML = `
        <div class="flex items-center cursor-pointer" onclick="location.href='/index.html'">
            <img src="https://forgenos.com/assets/logo2.png" alt="Logo" class="w-10 h-10 object-contain scale-110">
            <span class="ml-3 text-xl font-bold brand-logo-text tracking-[0.05em] mt-[2px]">FORGENOS</span>
        </div>
        <button onclick="toggleMobileMenu()" class="p-2 text-white/80"><i data-lucide="menu" class="w-7 h-7"></i></button>
    `;

    // 2. DESKTOP SIDEBAR (All Categories Included)[cite: 6]
    const sidebarHTML = `
        <div class="h-24 w-[17.5rem] flex items-center pl-4 cursor-pointer border-b border-white/5 shrink-0" onclick="location.href='/index.html'">
            <img src="https://forgenos.com/assets/logo2.png" alt="Logo" class="w-14 h-14 object-contain scale-110">
            <span class="logo-text ml-3 text-[22px] font-bold brand-logo-text tracking-[0.05em] mt-[2px]">FORGENOS</span>
        </div>
        <nav class="flex-1 flex flex-col gap-2 py-10 px-4 overflow-y-auto hide-scroll">
            <a href="/index.html#home" class="flex items-center px-4 h-14 rounded-2xl text-gray-500 hover:text-white hover:bg-white/5 transition-all group">
                <div class="nav-icon-wrapper"><i data-lucide="home" class="w-6 h-6"></i></div>
                <span class="nav-label ml-4 font-bold text-sm">Home</span>
            </a>
            <a href="/index.html#projects" class="flex items-center px-4 h-14 rounded-2xl text-gray-500 hover:text-white hover:bg-white/5 transition-all group">
                <div class="nav-icon-wrapper"><i data-lucide="folder-heart" class="w-6 h-6"></i></div>
                <span class="nav-label ml-4 font-bold text-sm">My Toolkits</span>
            </a>
            <a href="/index.html#finance" class="flex items-center px-4 h-14 rounded-2xl text-gray-500 hover:text-white hover:bg-white/5 transition-all group">
                <div class="nav-icon-wrapper"><i data-lucide="dollar-sign" class="w-6 h-6"></i></div>
                <span class="nav-label ml-4 font-bold text-sm">Finance</span>
            </a>
            <a href="/index.html#dev" class="flex items-center px-4 h-14 rounded-2xl text-gray-500 hover:text-white hover:bg-white/5 transition-all group">
                <div class="nav-icon-wrapper"><i data-lucide="code-2" class="w-6 h-6"></i></div>
                <span class="nav-label ml-4 font-bold text-sm">Dev Tools</span>
            </a>
            <a href="/index.html#student" class="flex items-center px-4 h-14 rounded-2xl text-gray-500 hover:text-white hover:bg-white/5 transition-all group">
                <div class="nav-icon-wrapper"><i data-lucide="graduation-cap" class="w-6 h-6"></i></div>
                <span class="nav-label ml-4 font-bold text-sm">Study Zone</span>
            </a>
            <a href="/index.html#brain" class="flex items-center px-4 h-14 rounded-2xl text-gray-500 hover:text-white hover:bg-white/5 transition-all group">
                <div class="nav-icon-wrapper"><i data-lucide="brain-circuit" class="w-6 h-6"></i></div>
                <span class="nav-label ml-4 font-bold text-sm">Brain Training</span>
            </a>
            <a href="/index.html#health" class="flex items-center px-4 h-14 rounded-2xl text-gray-500 hover:text-white hover:bg-white/5 transition-all group">
                <div class="nav-icon-wrapper"><i data-lucide="heart-pulse" class="w-6 h-6"></i></div>
                <span class="nav-label ml-4 font-bold text-sm">Health</span>
            </a>
            <a href="/index.html#pdf" class="flex items-center px-4 h-14 rounded-2xl text-gray-500 hover:text-white hover:bg-white/5 transition-all group">
                <div class="nav-icon-wrapper"><i data-lucide="file-text" class="w-6 h-6"></i></div>
                <span class="nav-label ml-4 font-bold text-sm">PDF Magic</span>
            </a>
            <a href="/index.html#image" class="flex items-center px-4 h-14 rounded-2xl text-gray-500 hover:text-white hover:bg-white/5 transition-all group">
                <div class="nav-icon-wrapper"><i data-lucide="image" class="w-6 h-6"></i></div>
                <span class="nav-label ml-4 font-bold text-sm">Image Lab</span>
            </a>
            <a href="/index.html#saved" class="flex items-center px-4 h-14 rounded-2xl text-gray-500 hover:text-white hover:bg-white/5 transition-all group">
                <div class="nav-icon-wrapper"><i data-lucide="heart" class="w-6 h-6"></i></div>
                <span class="nav-label ml-4 font-bold text-sm">My List</span>
            </a>
        </nav>
    `;

    // 3. GLOBAL FOOTER[cite: 6]
    const footerHTML = `
        <div class="py-8 px-6 md:px-10 lg:px-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0 text-left bg-[#141414]">
            <p class="text-gray-600 text-[10px] font-black uppercase tracking-[0.2em]">&copy; 2026 Forgenos.</p>
            <div class="flex gap-6">
                <a href="https://twitter.com/forgenos" target="_blank" class="text-gray-600 hover:text-brand-accent transition-colors"><i data-lucide="twitter" class="w-4 h-4"></i></a>
                <a href="https://github.com/forgenos" target="_blank" class="text-gray-600 hover:text-brand-accent transition-colors"><i data-lucide="github" class="w-4 h-4"></i></a>
            </div>
        </div>
    `;

    // Injection logic[cite: 6]
    const headerElement = document.querySelector('header.md\\:hidden');
    const sidebarElement = document.getElementById('sidebar');
    const footerElement = document.querySelector('footer');

    if(headerElement) headerElement.innerHTML = mobileHeaderHTML;
    if(sidebarElement) sidebarElement.innerHTML = sidebarHTML;
    if(footerElement) footerElement.innerHTML = footerHTML;

    // Refresh Lucide Icons
    if(typeof lucide !== 'undefined') lucide.createIcons();
}

// Run as soon as the DOM is ready
document.addEventListener('DOMContentLoaded', renderForgenosUI);
