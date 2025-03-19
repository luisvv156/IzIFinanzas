document.addEventListener("DOMContentLoaded", function () {
    const togglePassword = document.getElementById("togglePassword");
    const passwordField = document.getElementById("password");

    if (togglePassword && passwordField) {
        togglePassword.addEventListener("click", function () {
            const isPasswordHidden = passwordField.type === "password";
            passwordField.type = isPasswordHidden ? "text" : "password";

            // Alternar icono de ojo
            this.classList.toggle("fa-eye", !isPasswordHidden);
            this.classList.toggle("fa-eye-slash", isPasswordHidden);
        });

        // Establecer el icono inicial
        togglePassword.classList.add("fas", "fa-eye");
    }

    // Manejar las iniciales del usuario si el elemento existe (para el perfil)
    const userInitialsElement = document.getElementById("user-initials");
    if (userInitialsElement) {
        const userInitials = 'DN'; // Aquí puedes obtener las iniciales del usuario desde Flask
        userInitialsElement.textContent = userInitials;
    }
    
});
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registration-form');
    const alertContainer = document.getElementById('alert-container');

    // Función para mostrar alertas
    function showAlert(message, type) {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.innerHTML = `
            ${message}
            <span class="alert-close" onclick="this.parentElement.remove()">×</span>
        `;
        alertContainer.appendChild(alert);

        // Remover la alerta después de 5 segundos
        setTimeout(() => {
            alert.remove();
        }, 5000);
    }

    // Función para validar el correo electrónico
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Función para validar el teléfono (acepta formato internacional)
    function isValidPhone(phone) {
        return /^\+?[\d\s-]{8,}$/.test(phone);
    }

    // Función para mostrar error en un campo específico
    function showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorSpan = document.getElementById(`${fieldId}-error`);
        field.classList.add('input-error');
        errorSpan.textContent = message;
        errorSpan.style.display = 'block';
    }

    // Función para limpiar error de un campo
    function clearFieldError(fieldId) {
        const field = document.getElementById(fieldId);
        const errorSpan = document.getElementById(`${fieldId}-error`);
        field.classList.remove('input-error');
        errorSpan.style.display = 'none';
    }

    // Validación en tiempo real para campos específicos
    document.getElementById('correo').addEventListener('input', function(e) {
        if (this.value && !isValidEmail(this.value)) {
            showFieldError('correo', 'Por favor, ingresa un correo electrónico válido');
        } else {
            clearFieldError('correo');
        }
    });

    document.getElementById('telefono').addEventListener('input', function(e) {
        if (this.value && !isValidPhone(this.value)) {
            showFieldError('telefono', 'Por favor, ingresa un número de teléfono válido');
        } else {
            clearFieldError('telefono');
        }
    });
            document.getElementById("inicar seción si ya tienes una cuentaBtn").addEventListener("click", function() {
            window.location.href = "login2.html";
        });

    // Validación del formulario al enviar
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        let isValid = true;
        const formData = new FormData(form);

        // Validar campos requeridos
        for (let [key, value] of formData.entries()) {
            clearFieldError(key);
            
            if (!value.trim()) {
                isValid = false;
                showFieldError(key, 'Este campo es requerido');
            }
        }

        // Validaciones específicas
        const edad = formData.get('edad');
        if (edad && (edad < 1 || edad > 100)) {
            isValid = false;
            showFieldError('edad', 'La edad debe estar entre 1 y 100 años');
        }

        const correo = formData.get('correo');
        if (correo && !isValidEmail(correo)) {
            isValid = false;
            showFieldError('correo', 'Por favor, ingresa un correo electrónico válido');
        }

        const telefono = formData.get('telefono');
        if (telefono && !isValidPhone(telefono)) {
            isValid = false;
            showFieldError('telefono', 'Por favor, ingresa un número de teléfono válido');
        }

        if (isValid) {
            // Simulación de envío al servidor
            setTimeout(() => {
                try {
                    // Aquí iría la lógica real de envío al servidor
                    showAlert('¡Registro exitoso! Bienvenido.', 'success');
                    form.reset();
                } catch (error) {
                    showAlert('Error al procesar el registro. Por favor, intenta nuevamente.', 'error');
                }
            }, 1000);

            showAlert('Procesando registro...', 'info');
        } else {
            showAlert('Por favor, corrige los errores en el formulario.', 'warning');
        }
    });

    // Limpiar errores al modificar un campo
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            clearFieldError(this.id);
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const loginButton = document.getElementById('loginButton');
    const buttonText = document.getElementById('buttonText');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const usernameInput = document.getElementById('username');

    // Event listener para el botón de generar username
    generateBtn.addEventListener('click', function() {
        const nombres = nombresInput.value.trim();
        const apellidos = apellidosInput.value.trim();
        
        if (!nombres || !apellidos) {
            showAlert('Por favor, completa primero nombres y apellidos', 'warning');
            return;
        }

        const newUsername = generateUsername(nombres, apellidos);
        usernameInput.value = newUsername;
        showAlert('Nombre de usuario generado exitosamente', 'success');
    });

    // Event listeners para nombres y apellidos
    nombresInput.addEventListener('input', function() {
        if (usernameInput.value) {
            usernameInput.value = ''; // Limpia el username si se modifica el nombre
        }
    });

    apellidosInput.addEventListener('input', function() {
        if (usernameInput.value) {
            usernameInput.value = ''; // Limpia el username si se modifica el apellido
        }
    });

    // Función para mostrar alertas
    function showAlert(message, type) {
        const alertContainer = document.getElementById('alert-container');
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        
        alert.innerHTML = `
            <div class="alert-content">
                <span class="alert-icon">
                    ${getAlertIcon(type)}
                </span>
                <span>${message}</span>
            </div>
            <button class="alert-close" onclick="this.parentElement.remove()">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>
        `;

        alertContainer.appendChild(alert);

        // Remover la alerta después de 5 segundos
        setTimeout(() => {
            alert.style.animation = 'slideOut 0.3s ease-in-out forwards';
            setTimeout(() => alert.remove(), 300);
        }, 5000);
    }

    // Función para obtener el ícono de la alerta según el tipo
    function getAlertIcon(type) {
        switch(type) {
            case 'success':
                return `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>`;
            case 'error':
                return `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>`;
            case 'warning':
                return `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>`;
            case 'info':
                return `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>`;
        }
    }
    // Validación del formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validación básica
        const requiredFields = ['nombres', 'apellidos', 'edad', 'correo', 'telefono', 'tipo', 'username'];
        let isValid = true;

        requiredFields.forEach(field => {
            const input = document.getElementById(field);
            if (!input.value.trim()) {
                showFieldError(field, 'Este campo es requerido');
                isValid = false;
            }
        });

        if (!isValid) {
            showAlert('Por favor complete todos los campos requeridos', 'error');
            return;
        }

        // Aquí iría tu lógica de envío del formulario
        showAlert('Registro exitoso!', 'success');
        form.reset();
    });


    // Función para mostrar error en un campo específico
    function showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorSpan = document.getElementById(`${fieldId}-error`);
        field.classList.add('input-error');
        errorSpan.textContent = message;
        errorSpan.style.display = 'block';
    }

    // Función para limpiar error de un campo
    function clearFieldError(fieldId) {
        const field = document.getElementById(fieldId);
        const errorSpan = document.getElementById(`${fieldId}-error`);
        field.classList.remove('input-error');
        errorSpan.style.display = 'none';
    }

    // Validación de campos en tiempo real
    usernameInput.addEventListener('input', function() {
        if (this.value.length < 3) {
            showFieldError('username', 'El nombre de usuario debe tener al menos 3 caracteres');
        } else {
            clearFieldError('username');
        }
    });

    passwordInput.addEventListener('input', function() {
        if (this.value.length < 6) {
            showFieldError('password', 'La contraseña debe tener al menos 6 caracteres');
        } else {
            clearFieldError('password');
        }
    });

    // Toggle password visibility
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Cambiar el ícono según el estado
        this.innerHTML = type === 'password' ? 
            `<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>` :
            `<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>`;
    });

    // Form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validación básica
        const username = usernameInput.value;
        const password = passwordInput.value;
        let isValid = true;

        // Validar username
        if (!username) {
            showFieldError('username', 'El nombre de usuario es requerido');
            isValid = false;
        } else if (username.length < 3) {
            showFieldError('username', 'El nombre de usuario debe tener al menos 3 caracteres');
            isValid = false;
        }

        // Validar password
        if (!password) {
            showFieldError('password', 'La contraseña es requerida');
            isValid = false;
        } else if (password.length < 6) {
            showFieldError('password', 'La contraseña debe tener al menos 6 caracteres');
            isValid = false;
        }

        if (!isValid) {
            showAlert('Por favor corrija los errores en el formulario', 'warning');
            return;
        }

        // Mostrar estado de carga
        buttonText.classList.add('hidden');
        loadingSpinner.classList.remove('hidden');
        loginButton.disabled = true;

        try {
            // Simular llamada al servidor
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Aquí iría tu lógica real de login
            // Por ahora simulamos un login exitoso con credenciales demo
            if (username === 'demo' && password === 'demo123') {
                showAlert('¡Inicio de sesión exitoso!', 'success');
                // Guardar el estado de "Recordarme" si está marcado
                if (document.getElementById('remember-me').checked) {
                    localStorage.setItem('rememberedUser', username);
                } else {
                    localStorage.removeItem('rememberedUser');
                }
                // Redirigir después del login exitoso
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 1000);
            } else {
                showAlert('Credenciales incorrectas', 'error');
            }
        } catch (error) {
            showAlert('Error al intentar iniciar sesión. Por favor intente nuevamente.', 'error');
            console.error('Error:', error);
        } finally {
            // Restaurar estado del botón
            buttonText.classList.remove('hidden');
            loadingSpinner.classList.add('hidden');
            loginButton.disabled = false;
        }
    });

    // Funciones para login social
    window.loginWithGoogle = function() {
        showAlert('Iniciando sesión con Google...', 'info');
        // Aquí iría tu lógica de autenticación con Google
    };

    window.loginWithFacebook = function() {
        showAlert('Iniciando sesión con Facebook...', 'info');
        // Aquí iría tu lógica de autenticación con Facebook
    };

    // Cargar usuario recordado si existe
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
        usernameInput.value = rememberedUser;
        document.getElementById('remember-me').checked = true;
    }
});
