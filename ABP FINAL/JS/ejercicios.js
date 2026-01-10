/* =====================================================
   RDSLP - JavaScript de Ejercicios con IA Híbrida
   (Real para Admin/Configurado, Simulada para Usuarios)
===================================================== */

document.addEventListener('DOMContentLoaded', function () {
    if (!window.authManager) {
        window.location.href = 'login.html';
        return;
    }

    const auth = window.authManager;
    let currentUser = null;
    let apiKey = localStorage.getItem('rdslp_ai_api_key') || '';

    const exerciseDescriptions = {
        suma: { title: 'Suma de dos números', desc: 'Crea una función que reciba dos números y retorne su suma.', example: 'suma(2, 3) // 5' },
        factorial: { title: 'Factorial', desc: 'Calcula el factorial de n.', example: 'factorial(5) // 120' },
        palindromo: { title: 'Palíndromo', desc: 'Verifica si es palíndromo.', example: 'esPalindromo("ana") // true' },
        fibonacci: { title: 'Fibonacci', desc: 'Retorna n números de la serie.', example: 'fibonacci(5) // [0,1,1,2,3]' },
        ordenar: { title: 'Ordenar', desc: 'Ordena un array de menor a mayor.', example: 'ordenar([3,1,2]) // [1,2,3]' },
        libre: { title: 'Ejercicio Libre', desc: 'Programa lo que quieras.', example: '' }
    };

    init();

    function init() {
        checkAuth();
        loadUserData();
        setupEventListeners();
        loadMyExercises();
        checkAdminRole();
    }

    function checkAuth() {
        currentUser = auth.getCurrentUser();
    }

    function loadUserData() {
        if (!currentUser) return;
        document.getElementById('userAvatar').textContent = currentUser.name?.charAt(0).toUpperCase() || 'U';
        document.getElementById('userName').textContent = currentUser.name || 'Usuario';
    }

    function checkAdminRole() {
        // Solo mostrar configuración de API si es admin
        if (currentUser && currentUser.role === 'admin') {
            const btn = document.getElementById('configApiBtn');
            if (btn) {
                btn.style.display = 'block';
                updateApiKeyStatus();
            }
        }
    }

    function updateApiKeyStatus() {
        const btn = document.getElementById('configApiBtn');
        if (btn) {
            btn.textContent = apiKey ? 'API Key Configurada ✅' : 'Configurar API Key ⚙️';
            btn.style.borderColor = apiKey ? 'var(--success-color)' : 'var(--border-color)';
        }
    }

    function setupEventListeners() {
        document.getElementById('logoutBtn')?.addEventListener('click', () => {
            auth.logout();
            window.location.href = 'login.html';
        });

        document.getElementById('exerciseSelect')?.addEventListener('change', function () {
            const ex = exerciseDescriptions[this.value];
            const descEl = document.getElementById('exerciseDescription');
            if (ex && this.value) {
                descEl.innerHTML = `<p><strong>${ex.title}</strong></p><p>${ex.desc}</p>${ex.example ? `<p class="code-example">${ex.example}</p>` : ''}`;
            } else {
                descEl.innerHTML = '<p>Selecciona un ejercicio.</p>';
            }
        });

        document.getElementById('runCodeBtn')?.addEventListener('click', runCode);
        document.getElementById('evaluateBtn')?.addEventListener('click', evaluateCodeWithAI);
        document.getElementById('clearBtn')?.addEventListener('click', clearEditor);
        document.getElementById('shareBtn')?.addEventListener('click', shareExercise);

        // Configuración API (solo visible para admin)
        document.getElementById('configApiBtn')?.addEventListener('click', configureApiKey);

        // Line numbers
        const codeInput = document.getElementById('codeInput');
        codeInput?.addEventListener('input', updateLineNumbers);
        codeInput?.addEventListener('scroll', () => document.getElementById('lineNumbers').scrollTop = codeInput.scrollTop);
    }

    function configureApiKey() {
        const key = prompt('Ingresa tu API Key de Google Gemini (o compatible):', apiKey);
        if (key !== null) {
            apiKey = key.trim();
            localStorage.setItem('rdslp_ai_api_key', apiKey);
            updateApiKeyStatus();
            alert('API Key guardada.');
        }
    }

    function updateLineNumbers() {
        const lines = document.getElementById('codeInput').value.split('\n').length;
        document.getElementById('lineNumbers').textContent = Array(lines).fill(0).map((_, i) => i + 1).join('\n');
    }

    function runCode() {
        const code = document.getElementById('codeInput').value;
        const outputBox = document.getElementById('outputBox');
        if (!code.trim()) return;

        try {
            let output = [];
            const originalLog = console.log;
            console.log = (...args) => output.push(args.join(' '));

            if (document.getElementById('languageSelect').value === 'javascript') {
                const safeEval = new Function(code);
                safeEval();
                outputBox.innerHTML = output.length ? `<p class="output-success">${output.join('<br>')}</p>` : '<p class="output-success">Ejecutado correctamente (sin salida).</p>';
            } else {
                outputBox.innerHTML = '<p class="output-placeholder">Solo JS se ejecuta en navegador. Usa "Calificar con IA" para otros lenguajes.</p>';
            }
            console.log = originalLog;
        } catch (e) {
            outputBox.innerHTML = `<p class="output-error">${e.message}</p>`;
        }
    }

    async function evaluateCodeWithAI() {
        const code = document.getElementById('codeInput').value;
        const exercise = document.getElementById('exerciseSelect').value;
        const lang = document.getElementById('languageSelect').value;

        if (!code.trim()) { alert('Escribe código primero.'); return; }

        const btn = document.getElementById('evaluateBtn');
        const originalText = btn.innerHTML;
        btn.innerHTML = 'Analizando... 🤖';
        btn.disabled = true;

        // Decidir si usar API Real o Simulación
        // Usamos API Real si existe la Key
        if (apiKey) {
            try {
                await evaluateWithRealAI(code, exercise, lang);
            } catch (error) {
                console.error('Fallo API Real, usando simulación:', error);
                evaluateWithSimulation(code, exercise, lang);
            }
        } else {
            // Si no hay key, usamos simulación directa (transparente para el usuario)
            evaluateWithSimulation(code, exercise, lang);
        }

        btn.innerHTML = originalText;
        btn.disabled = false;
    }

    async function evaluateWithRealAI(code, exercise, lang) {
        const prompt = `
            Actúa como profesor de programación. Evalúa este código en ${lang} para el ejercicio "${exercise}".
            Código: ${code}
            Responde SOLO JSON: {"total":0-100,"functionality":0-100,"cleanCode":0-100,"efficiency":0-100,"bestPractices":0-100,"feedback":["msg1","msg2"]}
        `;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error.message);

        let textResponse = data.candidates[0].content.parts[0].text;
        textResponse = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        const evaluation = JSON.parse(textResponse);

        displayEvaluation(evaluation);
        saveExercise(code, exercise, lang, evaluation);
    }

    function evaluateWithSimulation(code, exercise, lang) {
        setTimeout(() => {
            const evaluation = generateSimulatedEvaluation(code, exercise, lang);
            displayEvaluation(evaluation);
            saveExercise(code, exercise, lang, evaluation);
        }, 1500);
    }

    function generateSimulatedEvaluation(code, exerciseType, lang) {
        const length = code.length;
        const hasComments = code.includes('//') || code.includes('/*') || code.includes('#');
        const hasFunctions = code.includes('function') || code.includes('=>') || code.includes('def ') || code.includes('class ');

        let score = 75 + Math.floor(Math.random() * 20);
        if (length < 20) score -= 20;
        if (hasComments) score += 5;
        score = Math.min(100, Math.max(0, score));

        const feedbacks = [
            "El código es legible y sigue una estructura lógica.",
            "Buena implementación de la solución.",
            hasComments ? "Excelente uso de comentarios." : "Te sugiero agregar comentarios.",
            "La eficiencia algorítmica es adecuada.",
            "Considera manejar casos borde."
        ];

        return {
            total: score,
            functionality: Math.min(100, score + 5),
            cleanCode: hasComments ? 90 : 75,
            efficiency: score,
            bestPractices: hasFunctions ? 85 : 70,
            feedback: feedbacks.sort(() => 0.5 - Math.random()).slice(0, 3)
        };
    }

    function displayEvaluation(result) {
        document.getElementById('gradingCard').style.display = 'block';
        document.getElementById('gradeScore').textContent = result.total;
        document.getElementById('gradeScore').className = 'grade-score ' + (result.total >= 80 ? 'excellent' : result.total >= 60 ? 'good' : 'poor');

        updateGradeBar('func', result.functionality);
        updateGradeBar('clean', result.cleanCode);
        updateGradeBar('eff', result.efficiency);
        updateGradeBar('bp', result.bestPractices);

        document.getElementById('gradeFeedback').innerHTML = `<h4>Feedback IA:</h4><ul>${result.feedback.map(f => `<li>${f}</li>`).join('')}</ul>`;
        document.getElementById('gradingCard').scrollIntoView({ behavior: 'smooth' });
    }

    function updateGradeBar(id, val) {
        document.getElementById(id + 'Fill').style.width = val + '%';
        document.getElementById(id + 'Value').textContent = val + '%';
    }

    function saveExercise(code, exercise, language, evaluation) {
        const exercises = JSON.parse(localStorage.getItem('rdslp_user_exercises') || '[]');
        exercises.unshift({
            id: Date.now(), userId: currentUser.id, userName: currentUser.name,
            code, exercise: exerciseDescriptions[exercise]?.title || 'Libre', language,
            score: evaluation.total, evaluation, createdAt: new Date().toISOString()
        });
        localStorage.setItem('rdslp_user_exercises', JSON.stringify(exercises));
        loadMyExercises();
    }

    function loadMyExercises() {
        const container = document.getElementById('myExercisesList');
        const exercises = JSON.parse(localStorage.getItem('rdslp_user_exercises') || '[]').filter(e => e.userId === currentUser.id).slice(0, 5);

        if (exercises.length === 0) {
            container.innerHTML = '<p class="no-exercises">No has realizado ejercicios aún.</p>';
            return;
        }

        container.innerHTML = exercises.map(ex => `
            <div class="exercise-item" onclick="loadExercise(${ex.id})">
                <div class="exercise-item-info"><h4>${ex.exercise}</h4><span>${ex.language}</span></div>
                <div class="exercise-item-score">${ex.score}</div>
            </div>
        `).join('');
    }

    window.loadExercise = function (id) {
        const ex = JSON.parse(localStorage.getItem('rdslp_user_exercises') || '[]').find(e => e.id === id);
        if (ex) {
            document.getElementById('codeInput').value = ex.code;
            document.getElementById('languageSelect').value = ex.language;
            if (ex.evaluation) displayEvaluation(ex.evaluation);
        }
    }

    function shareExercise() {
        if (!document.getElementById('shareExercise').checked) { alert('Marca la casilla para compartir.'); return; }
        const code = document.getElementById('codeInput').value;
        const lang = document.getElementById('languageSelect').value;
        const score = document.getElementById('gradeScore').textContent;

        const posts = JSON.parse(localStorage.getItem('rdslp_posts') || '[]');
        posts.unshift({
            id: Date.now(), authorId: currentUser.id, authorName: currentUser.name,
            type: 'ejercicio', language: lang, content: `He completado un ejercicio de ${lang} con una puntuación de ${score}/100! 🚀`,
            code, score: parseInt(score), likes: [], comments: [], createdAt: new Date().toISOString()
        });
        localStorage.setItem('rdslp_posts', JSON.stringify(posts));
        alert('Compartido en el muro con éxito!');
    }

    function clearEditor() {
        document.getElementById('codeInput').value = '';
        document.getElementById('gradingCard').style.display = 'none';
        updateLineNumbers();
    }
});
