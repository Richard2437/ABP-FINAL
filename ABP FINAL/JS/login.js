/* =====================================================
   RDSLP - JavaScript del Login
   Red Social de Lenguajes de Programación
===================================================== */

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');
    const eyeIcon = document.getElementById('eyeIcon');
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');

    // Inicializar AuthManager
    class AuthManagerSimple {
        constructor() {
            this.init();
        }

        init() {
            // Inicializar usuarios demo si no existen
            if (!localStorage.getItem('rdslp_all_users')) {
                const demoUsers = [
                    {
                        id: 1,
                        email: 'admin@rdslp.com',
                        password: 'admin123',
                        name: 'Administrador',
                        role: 'admin',
                        avatar: 'AD',
                        bio: 'Administrador del sistema RDSLP',
                        createdAt: '2024-01-01T00:00:00Z'
                    },
                    {
                        id: 2,
                        email: 'moderador@rdslp.com',
                        password: 'mod123',
                        name: 'Moderador',
                        role: 'moderator',
                        avatar: 'MO',
                        bio: 'Moderador de contenido',
                        createdAt: '2024-01-01T00:00:00Z'
                    },
                    {
                        id: 3,
                        email: 'usuario@rdslp.com',
                        password: 'user123',
                        name: 'Usuario Demo',
                        role: 'user',
                        avatar: 'US',
                        bio: 'Usuario de demostración',
                        createdAt: '2024-01-01T00:00:00Z'
                    },
                    {
                        id: 4,
                        email: 'dev@rdslp.com',
                        password: 'dev123',
                        name: 'Desarrollador',
                        role: 'user',
                        avatar: 'DE',
                        bio: 'Desarrollador y entusiasta',
                        createdAt: '2024-01-01T00:00:00Z'
                    }
                ];
                localStorage.setItem('rdslp_all_users', JSON.stringify(demoUsers));
            }
        }

        getAllUsers() {
            return JSON.parse(localStorage.getItem('rdslp_all_users') || '[]');
        }

        findUserByEmail(email) {
            const users = this.getAllUsers();
            return users.find(u => u.email === email);
        }

        login(email, password, remember = false) {
            const user = this.findUserByEmail(email);

            if (!user || user.password !== password) {
                return { success: false, message: 'Correo o contraseña incorrectos' };
            }

            const userData = {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                avatar: user.avatar,
                bio: user.bio,
                loginTime: new Date().toISOString()
            };

            if (remember) {
                localStorage.setItem('rdslp_user', JSON.stringify(userData));
            } else {
                sessionStorage.setItem('rdslp_user', JSON.stringify(userData));
            }

            return { success: true, user: userData };
        }

        isAuthenticated() {
            return localStorage.getItem('rdslp_user') || sessionStorage.getItem('rdslp_user');
        }
    }

    const auth = new AuthManagerSimple();

    // Toggle para mostrar/ocultar contraseña
    togglePassword.addEventListener('click', function () {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

        if (type === 'text') {
            eyeIcon.innerHTML = `
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
            `;
        } else {
            eyeIcon.innerHTML = `
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
            `;
        }
    });

    // Validación del formulario
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const remember = document.getElementById('remember').checked;

        errorMessage.classList.remove('show');

        if (!email || !password) {
            showError('Por favor, completa todos los campos');
            return;
        }

        if (!isValidEmail(email)) {
            showError('Por favor, ingresa un correo valido');
            return;
        }

        const result = auth.login(email, password, remember);

        if (result.success) {
            window.location.href = 'dashboard.html';
        } else {
            showError(result.message);
            passwordInput.value = '';
            passwordInput.focus();
        }
    });

    function showError(message) {
        errorText.textContent = message;
        errorMessage.classList.add('show');

        loginForm.style.animation = 'shake 0.5s ease';
        setTimeout(() => {
            loginForm.style.animation = '';
        }, 500);
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Verificar si ya hay sesión activa
    if (auth.isAuthenticated()) {
        window.location.href = 'dashboard.html';
    }

    // Añadir animación de shake
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);
});
