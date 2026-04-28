// GitHub Root: /related-tools.js
function showRelatedTools(currentId, currentCat) {
    const container = document.getElementById('related-tools-container');
    if (!container || !window.toolsData) return;

    // Filter tools of same category but skip current tool
    const related = window.toolsData
        .filter(t => t.category === currentCat && t.id !== currentId)
        .slice(0, 4); // Max 4 related tools dikhao[cite: 3]

    if (related.length === 0) return;

    let html = `<div style="margin-top:2rem; padding-top:1.5rem; border-top:1px solid rgba(255,255,255,.08)">`;
    html += `<p style="font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:.08em; color:#6b7280; margin-bottom:.75rem">Suggested Tools</p>`;
    html += `<div style="display:flex; flex-wrap:wrap; gap:8px">`;

    related.forEach(tool => {
        html += `<a href="${tool.link}" style="font-size:12px; padding:5px 12px; border-radius:999px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); color:#9ca3af; text-decoration:none; transition:0.2s;" onmouseover="this.style.color='#fff';this.style.borderColor='rgba(255,255,255,0.3)'" onmouseout="this.style.color='#9ca3af';this.style.borderColor='rgba(255,255,255,0.1)'">${tool.title}</a>`;
    });

    html += `</div></div>`;
    container.innerHTML = html;
}
