/* =====================================================
   RDSLP - JavaScript de Lógica de Programación
===================================================== */

document.addEventListener('DOMContentLoaded', function () {
    const auth = window.authManager;
    const content = window.contentManager;
    let currentUser = null;

    init();

    function init() {
        checkAuth();
        loadUserData();
        loadLogicaContent();
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
        // Logout
        document.getElementById('logoutBtn')?.addEventListener('click', () => {
            auth.logout();
            window.location.href = 'login.html';
        });

        // Filtros
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                filterContent(this.dataset.filter);
            });
        });

        // Modal
        document.getElementById('closeModal')?.addEventListener('click', closeModal);
        document.getElementById('contentModal')?.addEventListener('click', function (e) {
            if (e.target === this) closeModal();
        });
    }

    function loadLogicaContent() {
        const grid = document.getElementById('logicaGrid');
        if (!grid) return;

        const logicaItems = [
            { id: 'logica-1', title: 'Algoritmos Básicos', description: 'Aprende los fundamentos de los algoritmos y cómo estructurar soluciones paso a paso.', level: 'beginner', lessons: 8, duration: '2 horas' },
            { id: 'logica-2', title: 'Variables y Tipos de Datos', description: 'Entiende cómo funcionan las variables y los diferentes tipos de datos.', level: 'beginner', lessons: 6, duration: '1.5 horas' },
            { id: 'logica-3', title: 'Estructuras de Control', description: 'Domina condicionales, bucles y estructuras de control de flujo.', level: 'intermediate', lessons: 10, duration: '3 horas' },
            { id: 'logica-4', title: 'Funciones y Modularidad', description: 'Aprende a crear funciones reutilizables y código modular.', level: 'intermediate', lessons: 12, duration: '4 horas' },
            { id: 'logica-5', title: 'Recursividad', description: 'Comprende el concepto de recursividad y cuándo aplicarlo.', level: 'advanced', lessons: 8, duration: '3 horas' },
            { id: 'logica-6', title: 'Estructuras de Datos', description: 'Arrays, listas, pilas, colas, árboles y grafos.', level: 'advanced', lessons: 15, duration: '6 horas' },
            { id: 'logica-7', title: 'Pseudocódigo', description: 'Aprende a escribir pseudocódigo para planificar tus programas.', level: 'beginner', lessons: 5, duration: '1 hora' },
            { id: 'logica-8', title: 'Diagramas de Flujo', description: 'Visualiza algoritmos con diagramas de flujo.', level: 'beginner', lessons: 4, duration: '1 hora' },
            { id: 'logica-9', title: 'Complejidad Algorítmica', description: 'Big O notation y análisis de complejidad.', level: 'advanced', lessons: 10, duration: '4 horas' }
        ];

        grid.innerHTML = logicaItems.map(item => createLogicaCard(item)).join('');
        setupRatingListeners();
    }

    function createLogicaCard(item) {
        const levelNames = { 'beginner': 'Básico', 'intermediate': 'Intermedio', 'advanced': 'Avanzado' };
        const rating = content.getAverageRating(item.id);

        return `
            <div class="logica-card" data-id="${item.id}" data-level="${item.level}">
                <div class="logica-card-header">
                    <span class="badge badge-${item.level}">${levelNames[item.level]}</span>
                    <div class="logica-card-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="16 18 22 12 16 6"></polyline>
                            <polyline points="8 6 2 12 8 18"></polyline>
                        </svg>
                    </div>
                </div>
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <div class="logica-card-meta">
                    <span>${item.lessons} lecciones</span>
                    <span>${item.duration}</span>
                </div>
                <div class="logica-card-rating">
                    ${createStarsHTML(item.id, rating)}
                    <span class="rating-count">${rating.average} (${rating.count})</span>
                </div>
                <button class="logica-card-btn" onclick="openLogicaModal('${item.id}', '${item.title}')">Ver contenido</button>
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
                loadLogicaContent();
            });
        });
    }

    function filterContent(filter) {
        const cards = document.querySelectorAll('.logica-card');
        cards.forEach(card => {
            if (filter === 'all' || card.dataset.level === filter) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    window.openLogicaModal = function (id, title) {
        const modal = document.getElementById('contentModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');

        modalTitle.textContent = title;
        modalBody.innerHTML = `
            <div style="margin-bottom: 20px;">
                <p>Este módulo te enseñará los conceptos fundamentales relacionados con <strong>${title}</strong>.</p>
            </div>
            <h4 style="margin-bottom: 12px;">Contenido del módulo:</h4>
            <ul style="list-style: disc; padding-left: 20px; color: var(--text-secondary); margin-bottom: 20px;">
                <li>Introducción a los conceptos básicos</li>
                <li>Ejercicios prácticos paso a paso</li>
                <li>Ejemplos de código detallados</li>
                <li>Mini proyectos para aplicar lo aprendido</li>
                <li>Evaluación final</li>
            </ul>
            ${getCommentsSection(id)}
        `;
        modal.classList.add('active');
        setupCommentListeners(id);
    };

    function getCommentsSection(contentId) {
        const comments = content.getComments(contentId);
        return `
            <div class="comments-section" style="margin-top: 24px; padding-top: 24px; border-top: 1px solid var(--border-color);">
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

    function setupCommentListeners(contentId) {
        window.addComment = function (id) {
            const input = document.getElementById('newComment');
            if (!input || !input.value.trim()) return;
            if (!currentUser) {
                alert('Debes iniciar sesión');
                return;
            }
            content.addComment(id, input.value.trim(), currentUser.id, currentUser.name);
            openLogicaModal(id, document.getElementById('modalTitle').textContent);
        };
    }

    function closeModal() {
        document.getElementById('contentModal').classList.remove('active');
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});
