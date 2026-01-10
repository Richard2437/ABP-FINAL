/* =====================================================
   RDSLP - JavaScript de Lenguajes de Programación
===================================================== */

document.addEventListener('DOMContentLoaded', function () {
    const auth = window.authManager;
    const content = window.contentManager;
    let currentUser = null;

    init();

    function init() {
        checkAuth();
        loadUserData();
        loadLenguajesContent();
        setupEventListeners();
    }

    function checkAuth() {
        if (!auth.isAuthenticated()) {
            window.location.href = 'login.html';
            return;
        }
        currentUser = auth.getCurrentUser();
    }

    function loadUserData() {
        if (!currentUser) return;
        const userAvatar = document.getElementById('userAvatar');
        const userName = document.getElementById('userName');

        if (userAvatar) userAvatar.textContent = currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U';
        if (userName) userName.textContent = currentUser.name || 'Usuario';
    }

    function setupEventListeners() {
        document.getElementById('logoutBtn')?.addEventListener('click', () => {
            auth.logout();
            window.location.href = 'login.html';
        });

        document.getElementById('closeModal')?.addEventListener('click', closeModal);
        document.getElementById('contentModal')?.addEventListener('click', function (e) {
            if (e.target === this) closeModal();
        });
    }

    function loadLenguajesContent() {
        const grid = document.getElementById('lenguajesGrid');
        if (!grid) return;

        const lenguajes = [
            { id: 'lang-python', name: 'Python', icon: 'python', abbr: 'PY', description: 'Lenguaje versátil ideal para principiantes, ciencia de datos e inteligencia artificial.', tags: ['Backend', 'Data Science', 'IA', 'Automatización'] },
            { id: 'lang-javascript', name: 'JavaScript', icon: 'javascript', abbr: 'JS', description: 'El lenguaje de la web, esencial para desarrollo frontend y backend con Node.js.', tags: ['Frontend', 'Backend', 'Web', 'Mobile'] },
            { id: 'lang-java', name: 'Java', icon: 'java', abbr: 'JV', description: 'Lenguaje robusto para aplicaciones empresariales y desarrollo Android.', tags: ['Enterprise', 'Android', 'Backend'] },
            { id: 'lang-csharp', name: 'C#', icon: 'csharp', abbr: 'C#', description: 'Lenguaje de Microsoft para desarrollo de juegos con Unity y aplicaciones Windows.', tags: ['Unity', 'Windows', 'Web', 'Games'] },
            { id: 'lang-cpp', name: 'C++', icon: 'cpp', abbr: 'C++', description: 'Alto rendimiento para sistemas operativos, juegos y aplicaciones críticas.', tags: ['Sistemas', 'Juegos', 'IoT', 'Performance'] },
            { id: 'lang-go', name: 'Go', icon: 'go', abbr: 'GO', description: 'Lenguaje moderno de Google para sistemas distribuidos y cloud computing.', tags: ['Cloud', 'Backend', 'DevOps', 'Microservices'] },
            { id: 'lang-rust', name: 'Rust', icon: 'rust', abbr: 'RS', description: 'Seguridad de memoria y alto rendimiento para sistemas de bajo nivel.', tags: ['Sistemas', 'WebAssembly', 'Seguridad'] },
            { id: 'lang-php', name: 'PHP', icon: 'php', abbr: 'PHP', description: 'Lenguaje del lado del servidor que impulsa gran parte de la web.', tags: ['Web', 'Backend', 'CMS', 'WordPress'] },
            { id: 'lang-swift', name: 'Swift', icon: 'swift', abbr: 'SW', description: 'Lenguaje de Apple para desarrollo de aplicaciones iOS y macOS.', tags: ['iOS', 'macOS', 'Mobile'] },
            { id: 'lang-kotlin', name: 'Kotlin', icon: 'kotlin', abbr: 'KT', description: 'Lenguaje moderno para Android, interoperable con Java.', tags: ['Android', 'Mobile', 'Backend'] },
            { id: 'lang-typescript', name: 'TypeScript', icon: 'typescript', abbr: 'TS', description: 'JavaScript con tipos estáticos para proyectos a gran escala.', tags: ['Frontend', 'Backend', 'Web'] },
            { id: 'lang-ruby', name: 'Ruby', icon: 'ruby', abbr: 'RB', description: 'Lenguaje elegante con el framework Ruby on Rails.', tags: ['Web', 'Backend', 'Startups'] }
        ];

        grid.innerHTML = lenguajes.map(lang => createLanguageCard(lang)).join('');
        setupRatingListeners();
    }

    function createLanguageCard(lang) {
        const rating = content.getAverageRating(lang.id);

        return `
            <div class="language-card" data-id="${lang.id}">
                <div class="language-icon ${lang.icon}">${lang.abbr}</div>
                <h3>${lang.name}</h3>
                <p>${lang.description}</p>
                <div class="language-tags">
                    ${lang.tags.map(tag => `<span class="language-tag">${tag}</span>`).join('')}
                </div>
                <div class="language-rating">
                    ${createStarsHTML(lang.id, rating)}
                    <span class="rating-count">${rating.average} (${rating.count})</span>
                </div>
                <button class="language-btn" onclick="openLanguageModal('${lang.id}', '${lang.name}')">Explorar</button>
            </div>
        `;
    }

    function createStarsHTML(contentId, rating) {
        const userRating = currentUser ? content.getUserRating(contentId, currentUser.id) : 0;
        let html = '<div class="stars">';
        for (let i = 1; i <= 5; i++) {
            html += `<svg class="star ${i <= userRating ? 'filled' : ''}" data-rating="${i}" data-content="${contentId}" width="16" height="16" viewBox="0 0 24 24" fill="${i <= userRating ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
        }
        html += '</div>';
        return html;
    }

    function setupRatingListeners() {
        document.querySelectorAll('.star').forEach(star => {
            star.addEventListener('click', function () {
                if (!currentUser) {
                    alert('Debes iniciar sesión para calificar');
                    return;
                }
                const contentId = this.dataset.content;
                const rating = parseInt(this.dataset.rating);
                content.rateContent(contentId, rating, currentUser.id);
                loadLenguajesContent();
            });
        });
    }

    window.openLanguageModal = function (id, name) {
        const modal = document.getElementById('contentModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');

        const langDetails = {
            'lang-python': {
                intro: 'Python es un lenguaje de alto nivel conocido por su sintaxis limpia y legible.',
                uses: ['Ciencia de datos y Machine Learning', 'Desarrollo web con Django y Flask', 'Automatización y scripting', 'Inteligencia Artificial'],
                example: `# Ejemplo básico de Python
def saludar(nombre):
    return f"Hola, {nombre}!"

print(saludar("Mundo"))`
            },
            'lang-javascript': {
                intro: 'JavaScript es el lenguaje de la web, ejecutándose tanto en el navegador como en el servidor.',
                uses: ['Desarrollo frontend con React, Vue, Angular', 'Backend con Node.js', 'Aplicaciones móviles con React Native', 'Desarrollo full-stack'],
                example: `// Ejemplo básico de JavaScript
const saludar = (nombre) => {
    return \`Hola, \${nombre}!\`;
};

console.log(saludar("Mundo"));`
            }
        };

        const details = langDetails[id] || {
            intro: `${name} es un lenguaje de programación popular con múltiples aplicaciones.`,
            uses: ['Desarrollo de software', 'Aplicaciones web', 'Sistemas y herramientas'],
            example: '// Código de ejemplo...'
        };

        modalTitle.textContent = name;
        modalBody.innerHTML = `
            <div style="margin-bottom: 20px;">
                <p>${details.intro}</p>
            </div>
            <h4 style="margin-bottom: 12px;">Usos principales:</h4>
            <ul style="list-style: disc; padding-left: 20px; color: var(--text-secondary); margin-bottom: 20px;">
                ${details.uses.map(u => `<li>${u}</li>`).join('')}
            </ul>
            <h4 style="margin-bottom: 12px;">Ejemplo de código:</h4>
            <div style="background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 8px; padding: 16px; margin-bottom: 20px; overflow-x: auto;">
                <pre style="font-family: monospace; color: var(--text-primary); font-size: 13px;">${escapeHtml(details.example)}</pre>
            </div>
            ${getCommentsSection(id)}
        `;
        modal.classList.add('active');
    };

    function getCommentsSection(contentId) {
        const comments = content.getComments(contentId);
        return `
            <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid var(--border-color);">
                <h4 style="margin-bottom: 16px;">Comentarios (${comments.length})</h4>
                <div style="display: flex; gap: 12px; margin-bottom: 20px;">
                    <input type="text" id="newComment" placeholder="Escribe un comentario..." style="flex: 1; padding: 12px; background: var(--bg-input); border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-primary);">
                    <button onclick="addComment('${contentId}')" style="padding: 12px 20px; background: var(--accent-primary); border: none; border-radius: 8px; color: white; cursor: pointer;">Enviar</button>
                </div>
                <div id="commentsList">
                    ${comments.length === 0
                ? '<p style="color: var(--text-muted);">No hay comentarios aún.</p>'
                : comments.map(c => `
                            <div style="background: var(--bg-input); border-radius: 8px; padding: 12px; margin-bottom: 8px;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                                    <strong style="font-size: 14px;">${escapeHtml(c.authorName)}</strong>
                                    <span style="font-size: 12px; color: var(--text-muted);">${new Date(c.createdAt).toLocaleDateString()}</span>
                                </div>
                                <p style="font-size: 14px; color: var(--text-secondary);">${escapeHtml(c.text)}</p>
                            </div>
                        `).join('')
            }
                </div>
            </div>
        `;
    }

    window.addComment = function (contentId) {
        const input = document.getElementById('newComment');
        if (!input || !input.value.trim()) return;
        if (!currentUser) {
            alert('Debes iniciar sesión');
            return;
        }
        content.addComment(contentId, input.value.trim(), currentUser.id, currentUser.name);
        openLanguageModal(contentId, document.getElementById('modalTitle').textContent);
    };

    function closeModal() {
        document.getElementById('contentModal').classList.remove('active');
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});
