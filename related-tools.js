// GitHub Root: /related-tools.js

// Function to shuffle an array (Fisher-Yates algorithm)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
}

function showRelatedTools(currentId, currentCat) {
    const container = document.getElementById('related-tools-container');
    if (!container || !window.toolsData) return;

    // 1. Pehle tools filter karo (same category but skip current)
    const filteredTools = window.toolsData.filter(t => t.category === currentCat && t.id !== currentId);

    if (filteredTools.length === 0) return;

    // 2. Ab pure group ko randomize/shuffle karo
    const randomizedTools = shuffleArray(filteredTools);

    // 3. Shuffled list mein se ab top 4 tools slice karo
    const related = randomizedTools.slice(0, 4); // <--- Ab ye 4 varied honge[cite: 3]

    // (Remaining HTML code is same, just iterations are dynamic)
    let html = `<div style="margin-top:2rem; padding-top:1.5rem; border-top:1px solid rgba(255,255,255,.08)">`;
    html += `<p style="font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:.08em; color:#6b7280; margin-bottom:.75rem">Suggested Tools</p>`;
    html += `<div style="display:flex; flex-wrap:wrap; gap:8px">`;

    related.forEach(tool => {
        html += `<a href="${tool.link}" style="font-size:12px; padding:5px 12px; border-radius:999px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); color:#9ca3af; text-decoration:none; transition:0.2s;" onmouseover="this.style.color='#fff';this.style.borderColor='rgba(255,255,255,0.3)'" onmouseout="this.style.color='#9ca3af';this.style.borderColor='rgba(255,255,255,0.1)'">${tool.title}</a>`;
    });

    html += `</div></div>`;
    container.innerHTML = html;
}
