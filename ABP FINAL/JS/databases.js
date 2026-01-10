/* =====================================================
   RDSLP - JavaScript de Bases de Datos
===================================================== */

document.addEventListener('DOMContentLoaded', function () {
    const auth = window.authManager;
    const content = window.contentManager;
    let currentUser = null;

    init();

    function init() {
        checkAuth();
        loadUserData();
        loadDatabaseContent('relacional');
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

        document.querySelectorAll('.db-tab').forEach(tab => {
            tab.addEventListener('click', function () {
                document.querySelectorAll('.db-tab').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                loadDatabaseContent(this.dataset.tab);
            });
        });

        document.getElementById('closeModal')?.addEventListener('click', closeModal);
        document.getElementById('contentModal')?.addEventListener('click', function (e) {
            if (e.target === this) closeModal();
        });
    }

    function loadDatabaseContent(tab) {
        const container = document.getElementById('dbContent');
        if (!container) return;

        if (tab === 'relacional') {
            container.innerHTML = `
                <div class="db-info-card">
                    <h3>Bases de Datos Relacionales (SQL)</h3>
                    <p>Las bases de datos relacionales organizan la información en tablas con filas y columnas. Las relaciones entre los datos se establecen mediante claves primarias y foráneas. Utilizan SQL (Structured Query Language) para manipular y consultar datos.</p>
                    
                    <h4>Características principales:</h4>
                    <ul>
                        <li>Estructura tabular con esquema definido (SCHEMA)</li>
                        <li>Soporte para transacciones ACID (Atomicidad, Consistencia, Aislamiento, Durabilidad)</li>
                        <li>Integridad referencial mediante claves primarias y foráneas</li>
                        <li>Lenguaje SQL estandarizado para consultas</li>
                        <li>Escalabilidad vertical (mejorar hardware del servidor)</li>
                        <li>Ideal para datos estructurados y relaciones complejas</li>
                    </ul>

                    <h4>Bases de datos populares:</h4>
                    <div class="db-grid">
                        ${createDBCard('MySQL', 'mysql', 'Base de datos open source más popular del mundo. Usada por WordPress, Facebook y Twitter.')}
                        ${createDBCard('PostgreSQL', 'postgresql', 'BD relacional avanzada con soporte para JSON, búsqueda full-text y extensiones personalizadas.')}
                        ${createDBCard('SQL Server', 'sqlserver', 'Solución empresarial de Microsoft con integración Azure y herramientas de Business Intelligence.')}
                        ${createDBCard('Oracle', 'oracle', 'Líder en el mercado empresarial con características avanzadas de seguridad y alto rendimiento.')}
                    </div>
                </div>

                <div class="db-info-card">
                    <h3>Ejemplo de SQL</h3>
                    <p>Aquí tienes ejemplos básicos de cómo trabajar con SQL:</p>
                    
                    <div class="code-example">
                        <pre><span class="comment">-- Crear tabla de usuarios</span>
<span class="keyword">CREATE TABLE</span> usuarios (
    id <span class="keyword">INT PRIMARY KEY AUTO_INCREMENT</span>,
    nombre <span class="keyword">VARCHAR</span>(100) <span class="keyword">NOT NULL</span>,
    email <span class="keyword">VARCHAR</span>(150) <span class="keyword">UNIQUE</span>,
    rol <span class="keyword">ENUM</span>(<span class="string">'user'</span>, <span class="string">'moderator'</span>, <span class="string">'admin'</span>),
    fecha_registro <span class="keyword">DATETIME DEFAULT CURRENT_TIMESTAMP</span>
);

<span class="comment">-- Insertar datos</span>
<span class="keyword">INSERT INTO</span> usuarios (nombre, email, rol) 
<span class="keyword">VALUES</span> (<span class="string">'Juan Perez'</span>, <span class="string">'juan@email.com'</span>, <span class="string">'user'</span>);

<span class="comment">-- Consultar datos con filtros</span>
<span class="keyword">SELECT</span> * <span class="keyword">FROM</span> usuarios 
<span class="keyword">WHERE</span> rol = <span class="string">'admin'</span>
<span class="keyword">ORDER BY</span> fecha_registro <span class="keyword">DESC</span>;

<span class="comment">-- Actualizar datos</span>
<span class="keyword">UPDATE</span> usuarios 
<span class="keyword">SET</span> rol = <span class="string">'moderator'</span>
<span class="keyword">WHERE</span> email = <span class="string">'juan@email.com'</span>;

<span class="comment">-- Unir tablas (JOIN)</span>
<span class="keyword">SELECT</span> u.nombre, p.titulo
<span class="keyword">FROM</span> usuarios u
<span class="keyword">INNER JOIN</span> publicaciones p <span class="keyword">ON</span> u.id = p.usuario_id;</pre>
                    </div>
                </div>
            `;
        } else if (tab === 'norelacional') {
            container.innerHTML = `
                <div class="db-info-card">
                    <h3>Bases de Datos No Relacionales (NoSQL)</h3>
                    <p>Las bases de datos NoSQL están diseñadas para manejar grandes volúmenes de datos no estructurados o semi-estructurados. No utilizan el modelo tabular tradicional y ofrecen mayor flexibilidad en el esquema de datos.</p>
                    
                    <h4>Tipos de bases NoSQL:</h4>
                    <ul>
                        <li><strong>Documentales:</strong> Almacenan datos en documentos JSON/BSON (MongoDB, CouchDB)</li>
                        <li><strong>Clave-Valor:</strong> Pares simples de clave y valor, ultra rápidas (Redis, DynamoDB)</li>
                        <li><strong>Columnares:</strong> Optimizadas para consultas en columnas (Cassandra, HBase)</li>
                        <li><strong>Grafos:</strong> Para datos altamente conectados y relaciones (Neo4j, Amazon Neptune)</li>
                    </ul>

                    <h4>Cuándo usar NoSQL:</h4>
                    <ul>
                        <li>Datos no estructurados o semi-estructurados</li>
                        <li>Necesidad de escalabilidad horizontal (agregar más servidores)</li>
                        <li>Alta velocidad de escritura/lectura requerida</li>
                        <li>Esquemas flexibles que cambian frecuentemente</li>
                        <li>Big Data y aplicaciones en tiempo real</li>
                    </ul>

                    <h4>Bases de datos populares:</h4>
                    <div class="db-grid">
                        ${createDBCard('MongoDB', 'mongodb', 'BD documental más popular. Almacena datos en documentos JSON flexibles.')}
                        ${createDBCard('Redis', 'redis', 'Base de datos en memoria ultra rápida, ideal para caché, sesiones y colas.')}
                        ${createDBCard('Cassandra', 'cassandra', 'Diseñada por Facebook para manejar grandes cantidades de datos distribuidos.')}
                        ${createDBCard('Neo4j', 'neo4j', 'Base de datos de grafos para modelar relaciones complejas entre datos.')}
                    </div>
                </div>

                <div class="db-info-card">
                    <h3>Ejemplo de MongoDB</h3>
                    <p>Aquí tienes ejemplos de cómo trabajar con MongoDB:</p>
                    
                    <div class="code-example">
                        <pre><span class="comment">// Insertar un documento</span>
db.usuarios.<span class="function">insertOne</span>({
    nombre: <span class="string">"Juan Perez"</span>,
    email: <span class="string">"juan@email.com"</span>,
    edad: <span class="number">28</span>,
    rol: <span class="string">"user"</span>,
    intereses: [<span class="string">"programación"</span>, <span class="string">"música"</span>, <span class="string">"viajes"</span>],
    direccion: {
        ciudad: <span class="string">"Madrid"</span>,
        pais: <span class="string">"España"</span>,
        cp: <span class="string">"28001"</span>
    }
});

<span class="comment">// Buscar documentos con filtros</span>
db.usuarios.<span class="function">find</span>({
    edad: { <span class="keyword">$gte</span>: <span class="number">25</span> },
    <span class="string">"direccion.ciudad"</span>: <span class="string">"Madrid"</span>
});

<span class="comment">// Actualizar documento</span>
db.usuarios.<span class="function">updateOne</span>(
    { email: <span class="string">"juan@email.com"</span> },
    { 
        <span class="keyword">$set</span>: { edad: <span class="number">29</span> },
        <span class="keyword">$push</span>: { intereses: <span class="string">"fotografía"</span> }
    }
);

<span class="comment">// Agregaciones</span>
db.usuarios.<span class="function">aggregate</span>([
    { <span class="keyword">$match</span>: { rol: <span class="string">"user"</span> } },
    { <span class="keyword">$group</span>: { _id: <span class="string">"$direccion.ciudad"</span>, total: { <span class="keyword">$sum</span>: <span class="number">1</span> } } }
]);</pre>
                    </div>
                </div>
            `;
        } else if (tab === 'ejercicios') {
            const ejercicios = [
                { id: 'ej-db-1', title: 'Crear una BD de Biblioteca', level: 'beginner', description: 'Diseña un esquema relacional para gestionar libros, autores y préstamos.', tech: 'SQL' },
                { id: 'ej-db-2', title: 'Sistema de E-commerce', level: 'intermediate', description: 'Crea las tablas para productos, usuarios, pedidos y carrito de compras.', tech: 'SQL' },
                { id: 'ej-db-3', title: 'Red Social Simple', level: 'intermediate', description: 'Modela usuarios, publicaciones, comentarios y amistades.', tech: 'SQL/NoSQL' },
                { id: 'ej-db-4', title: 'Blog con MongoDB', level: 'beginner', description: 'Diseña la estructura de documentos para un blog con posts y comentarios.', tech: 'MongoDB' },
                { id: 'ej-db-5', title: 'Caché con Redis', level: 'advanced', description: 'Implementa un sistema de caché para sesiones de usuario y datos frecuentes.', tech: 'Redis' },
                { id: 'ej-db-6', title: 'Optimización de Queries', level: 'advanced', description: 'Analiza y optimiza consultas SQL lentas usando índices y EXPLAIN.', tech: 'SQL' }
            ];

            container.innerHTML = `
                <div class="db-info-card">
                    <h3>Ejercicios Prácticos</h3>
                    <p>Pon a prueba tus conocimientos con estos ejercicios de bases de datos:</p>
                </div>
                <div class="db-grid" style="grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));">
                    ${ejercicios.map(ej => createExerciseCard(ej)).join('')}
                </div>
            `;
            setupRatingListeners();
        }
    }

    function createDBCard(name, type, description) {
        const colors = {
            'mysql': '#4479a1',
            'postgresql': '#336791',
            'sqlserver': '#cc2927',
            'oracle': '#f80000',
            'mongodb': '#47a248',
            'redis': '#dc382d',
            'cassandra': '#1287b1',
            'neo4j': '#008cc1'
        };

        return `
            <div class="db-card">
                <div class="db-icon" style="background: ${colors[type] || '#6366f1'};">${name.substring(0, 2).toUpperCase()}</div>
                <h4>${name}</h4>
                <p>${description}</p>
            </div>
        `;
    }

    function createExerciseCard(ej) {
        const levelNames = { 'beginner': 'Básico', 'intermediate': 'Intermedio', 'advanced': 'Avanzado' };
        const rating = content.getAverageRating(ej.id);

        return `
            <div class="exercise-card" data-id="${ej.id}">
                <div class="exercise-header">
                    <span class="badge badge-${ej.level}">${levelNames[ej.level]}</span>
                    <span class="exercise-tech">${ej.tech}</span>
                </div>
                <h4>${ej.title}</h4>
                <p>${ej.description}</p>
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                    ${createStarsHTML(ej.id, rating)}
                    <span style="font-size: 12px; color: var(--text-muted);">${rating.average}</span>
                </div>
                <button class="logica-card-btn" onclick="openExerciseModal('${ej.id}', '${ej.title}')">Ver ejercicio</button>
            </div>
        `;
    }

    function createStarsHTML(contentId, rating) {
        const userRating = currentUser ? content.getUserRating(contentId, currentUser.id) : 0;
        let html = '<div class="stars" style="display: flex; gap: 2px;">';
        for (let i = 1; i <= 5; i++) {
            html += `<svg class="star" style="cursor: pointer; color: ${i <= userRating ? 'var(--warning-color)' : 'var(--text-muted)'};" data-rating="${i}" data-content="${contentId}" width="14" height="14" viewBox="0 0 24 24" fill="${i <= userRating ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
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
                loadDatabaseContent('ejercicios');
            });
        });
    }

    window.openExerciseModal = function (id, title) {
        const modal = document.getElementById('contentModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');

        modalTitle.textContent = title;
        modalBody.innerHTML = `
            <div style="margin-bottom: 20px;">
                <p>Práctica tus conocimientos de bases de datos con este ejercicio.</p>
            </div>
            <h4 style="margin-bottom: 12px;">Instrucciones:</h4>
            <ol style="padding-left: 20px; color: var(--text-secondary); margin-bottom: 20px;">
                <li style="margin-bottom: 8px;">Lee el enunciado completo del ejercicio</li>
                <li style="margin-bottom: 8px;">Diseña tu solución en papel o con diagramas</li>
                <li style="margin-bottom: 8px;">Implementa el código SQL o NoSQL</li>
                <li style="margin-bottom: 8px;">Prueba tu solución con datos de ejemplo</li>
                <li>Comparte tu solución en los comentarios</li>
            </ol>
            ${getCommentsSection(id)}
        `;
        modal.classList.add('active');
    };

    function getCommentsSection(contentId) {
        const comments = content.getComments(contentId);
        return `
            <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid var(--border-color);">
                <h4 style="margin-bottom: 16px;">Soluciones y Comentarios (${comments.length})</h4>
                <div style="display: flex; gap: 12px; margin-bottom: 20px;">
                    <input type="text" id="newComment" placeholder="Comparte tu solución..." style="flex: 1; padding: 12px; background: var(--bg-input); border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-primary);">
                    <button onclick="addComment('${contentId}')" style="padding: 12px 20px; background: var(--accent-primary); border: none; border-radius: 8px; color: white; cursor: pointer;">Enviar</button>
                </div>
                <div id="commentsList">
                    ${comments.length === 0
                ? '<p style="color: var(--text-muted);">Sé el primero en compartir tu solución.</p>'
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
        openExerciseModal(contentId, document.getElementById('modalTitle').textContent);
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
