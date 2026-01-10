/* =====================================================
   RDSLP - JavaScript del Registro
   Red Social de Lenguajes de Programación
===================================================== */

document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.getElementById('registerForm');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const togglePassword = document.getElementById('togglePassword');
    const eyeIcon = document.getElementById('eyeIcon');
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    const successMessage = document.getElementById('successMessage');
    const successText = document.getElementById('successText');
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');

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

    // Verificar fortaleza de contraseña
    passwordInput.addEventListener('input', function () {
        const password = passwordInput.value;
        const strength = checkPasswordStrength(password);

        strengthFill.className = 'strength-fill';
        strengthText.className = 'strength-text';

        if (password.length === 0) {
            strengthFill.className = 'strength-fill';
            strengthText.textContent = 'Fortaleza de la contrasena';
            strengthText.className = 'strength-text';
        } else if (strength === 'weak') {
            strengthFill.classList.add('weak');
            strengthText.classList.add('weak');
            strengthText.textContent = 'Contrasena debil';
        } else if (strength === 'medium') {
            strengthFill.classList.add('medium');
            strengthText.classList.add('medium');
            strengthText.textContent = 'Contrasena media';
        } else {
            strengthFill.classList.add('strong');
            strengthText.classList.add('strong');
            strengthText.textContent = 'Contrasena fuerte';
        }
    });

    function checkPasswordStrength(password) {
        let score = 0;

        if (password.length >= 6) score++;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        if (score <= 2) return 'weak';
        if (score <= 4) return 'medium';
        return 'strong';
    }

    // Validación del formulario
    registerForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const terms = document.getElementById('terms').checked;

        hideMessages();

        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            showError('Por favor, completa todos los campos');
            return;
        }

        if (!isValidEmail(email)) {
            showError('Por favor, ingresa un correo valido');
            return;
        }

        if (password.length < 6) {
            showError('La contrasena debe tener al menos 6 caracteres');
            return;
        }

        if (password !== confirmPassword) {
            showError('Las contrasenas no coinciden');
            return;
        }

        if (!terms) {
            showError('Debes aceptar los terminos y condiciones');
            return;
        }

        // Obtener usuarios existentes
        const existingUsers = JSON.parse(localStorage.getItem('rdslp_all_users') || '[]');

        if (existingUsers.some(u => u.email === email)) {
            showError('Este correo ya esta registrado');
            return;
        }

        // Crear nuevo usuario
        const newUser = {
            id: Date.now(),
            email: email,
            password: password,
            name: `${firstName} ${lastName}`,
            role: 'user', // Nuevos usuarios siempre son 'user'
            avatar: firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase(),
            bio: '',
            createdAt: new Date().toISOString()
        };

        existingUsers.push(newUser);
        localStorage.setItem('rdslp_all_users', JSON.stringify(existingUsers));

        showSuccess('Cuenta creada exitosamente. Redirigiendo...');

        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    });

    function showError(message) {
        errorText.textContent = message;
        errorMessage.classList.add('show');
        successMessage.classList.remove('show');
    }

    function showSuccess(message) {
        successText.textContent = message;
        successMessage.classList.add('show');
        errorMessage.classList.remove('show');
    }

    function hideMessages() {
        errorMessage.classList.remove('show');
        successMessage.classList.remove('show');
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});
