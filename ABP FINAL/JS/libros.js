/* =====================================================
   RDSLP - JavaScript de Libros
===================================================== */

document.addEventListener('DOMContentLoaded', function () {
    const auth = window.authManager;
    const content = window.contentManager;
    let currentUser = null;

    init();

    function init() {
        checkAuth();
        loadUserData();
        loadLibrosContent();
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
        document.getElementById('userAvatar').textContent = currentUser.name?.charAt(0).toUpperCase() || 'U';
        document.getElementById('userName').textContent = currentUser.name || 'Usuario';
    }

    function setupEventListeners() {
        document.getElementById('logoutBtn')?.addEventListener('click', () => {
            auth.logout();
            window.location.href = 'login.html';
        });

        document.getElementById('closeModal')?.addEventListener('click', () => {
            document.getElementById('contentModal').classList.remove('active');
        });
    }

    function loadLibrosContent() {
        const grid = document.getElementById('librosGrid');
        if (!grid) return;

        const libros = [
            { id: 'book-1', title: 'Clean Code', author: 'Robert C. Martin', description: 'Guía para escribir código limpio y mantenible.', cover: 'clean-code' },
            { id: 'book-2', title: 'Design Patterns', author: 'Gang of Four', description: 'Los 23 patrones de diseño fundamentales.', cover: 'design-patterns' },
            { id: 'book-3', title: 'Introduction to Algorithms', author: 'CLRS', description: 'La biblia de algoritmos y estructuras de datos.', cover: 'algorithms' },
            { id: 'book-4', title: 'The Pragmatic Programmer', author: 'David Thomas', description: 'Consejos prácticos para programadores.', cover: 'pragmatic' },
            { id: 'book-5', title: 'Refactoring', author: 'Martin Fowler', description: 'Técnicas para mejorar código existente.', cover: 'refactoring' },
            { id: 'book-6', title: 'Domain-Driven Design', author: 'Eric Evans', description: 'Modelado del dominio en software.', cover: 'ddd' }
        ];

        grid.innerHTML = libros.map(book => {
            const rating = content.getAverageRating(book.id);
            const abbr = book.title.split(' ').map(w => w[0]).join('').substring(0, 2);
            return `
                <div class="book-card" data-id="${book.id}">
                    <div class="book-cover ${book.cover}">${abbr}</div>
                    <div class="book-info">
                        <h3>${book.title}</h3>
                        <p class="book-author">${book.author}</p>
                        <p class="book-description">${book.description}</p>
                        <div class="book-rating">
                            <span class="rating-value">${rating.average} (${rating.count})</span>
                        </div>
                        <button class="book-btn" onclick="openBookModal('${book.id}', '${book.title}')">Ver detalles</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    window.openBookModal = function (id, title) {
        const modal = document.getElementById('contentModal');
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalBody').innerHTML = `
            <p>Una lectura esencial para todo desarrollador.</p>
            <h4 style="margin: 20px 0 12px;">Por qué leerlo:</h4>
            <ul style="padding-left: 20px; color: var(--text-secondary);">
                <li>Conceptos fundamentales bien explicados</li>
                <li>Ejemplos prácticos</li>
                <li>Referencia para consultas futuras</li>
            </ul>
        `;
        modal.classList.add('active');
    };
});
