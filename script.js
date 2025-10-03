// script.js
document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------------------------
    // 0. КОНФИГУРАЦИЯ POCKETBASE И ОБЪЯВЛЕНИЕ ПЕРЕМЕННЫХ
    // ----------------------------------------------------
    
    const PB_URL = 'http://127.0.0.1:8090'; 
    const pb = new PocketBase(PB_URL);

    // Переменные модального окна
    const loginModal = document.getElementById('loginModal');
    const loginBtn = document.querySelector('.btn-login'); 
    const closeBtn = document.querySelector('.close-btn'); 
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');
    const signupLink = document.querySelector('.modal-link a'); // Ссылка "Зарегистрироваться"
    
    // Переменные Hero-секции
    const select = document.getElementById('language-select');
    const startButton = document.getElementById('start-button');
    
    
    // ----------------------------------------------------
    // 1. ЛОГИКА HERO-СЕКЦИИ (Выбор класса)
    // ----------------------------------------------------
    if (startButton && select) {
        startButton.addEventListener('click', () => {
            const selectedClass = select.options[select.selectedIndex].text;
            alert(`Отлично! Начинаем курс: ${selectedClass}. Вам нужно сначала войти или зарегистрироваться.`);
        });

        select.addEventListener('change', () => {
            const selectedClass = select.options[select.selectedIndex].text;
            startButton.textContent = `Начать ${selectedClass}`;
        });

        select.dispatchEvent(new Event('change'));
    }


    // ----------------------------------------------------
    // 2. ЛОГИКА МОДАЛЬНОГО ОКНА (Открытие/Закрытие)
    // ----------------------------------------------------
    if (loginBtn && loginModal) {
        loginBtn.addEventListener('click', () => {
            loginModal.style.display = "block";
        });
    }

    if (closeBtn && loginModal) {
        closeBtn.addEventListener('click', () => {
            loginModal.style.display = "none";
        });
    }

    window.addEventListener('click', (event) => {
        if (event.target === loginModal) {
            loginModal.style.display = "none";
        }
    });


    // Проверка наличия элементов формы для следующих блоков
    if (loginForm && loginMessage) {

        // ----------------------------------------------------
        // 3. ОБРАБОТКА ФОРМЫ ВХОДА С POCKETBASE (Кнопка "Войти")
        // ----------------------------------------------------
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            loginMessage.style.display = 'block';
            loginMessage.textContent = "Проверка данных...";
            loginMessage.classList.remove('error');
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            try {
                // ВХОД
                await pb.collection('users').authWithPassword(email, password);
                
                loginMessage.textContent = "Вход успешен! Перенаправляем...";
                loginMessage.classList.remove('error');
                
                setTimeout(() => {
                    // ПЕРЕНАПРАВЛЕНИЕ:
                    window.location.href = 'profile.html'; 
                }, 1000);

            } catch (error) {
                // Ошибка входа
                console.error("Ошибка входа PocketBase:", error);
                loginMessage.textContent = `Ошибка: Неверный email или пароль.`;
                loginMessage.classList.add('error');
            }
        });


        // ----------------------------------------------------
        // 4. ОБРАБОТКА РЕГИСТРАЦИИ (Ссылка "Зарегистрироваться")
        // ----------------------------------------------------
        if (signupLink) {
            signupLink.addEventListener('click', async (e) => {
                e.preventDefault();
                
                loginMessage.style.display = 'block';
                loginMessage.textContent = "Попытка регистрации...";
                loginMessage.classList.remove('error');

                const email = document.getElementById('loginEmail').value;
                const password = document.getElementById('loginPassword').value;
                
                // Получаем выбранный класс
                const selectedClass = select.options[select.selectedIndex].text; 

                if (!email || password.length < 8) {
                    loginMessage.textContent = "Пароль должен быть не менее 8 символов. Проверьте Email.";
                    loginMessage.classList.add('error');
                    return;
                }

                try {
                    // РЕГИСТРАЦИЯ (с сохранением выбранного класса)
                    await pb.collection('users').create({
                        email: email,
                        password: password,
                        passwordConfirm: password,
                        selected_class: selectedClass // <-- Сохраняем класс
                    });
                    
                    loginMessage.textContent = "Регистрация успешна! Выполняется вход...";
                    loginMessage.classList.remove('error');
                    
                    // Автоматический вход после регистрации
                    await pb.collection('users').authWithPassword(email, password);
                    
                    setTimeout(() => {
                        // ПЕРЕНАПРАВЛЕНИЕ:
                        window.location.href = 'profile.html'; 
                    }, 1500);

                } catch (error) {
                    // Ошибка регистрации
                    console.error("Ошибка регистрации PocketBase:", error);
                    loginMessage.textContent = `Ошибка регистрации: Email уже используется или неверный формат.`;
                    loginMessage.classList.add('error');
                }
            });
        }
    }
});