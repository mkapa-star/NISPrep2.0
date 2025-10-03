// profile.js

document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------------------------
    // 0. КОНФИГУРАЦИЯ POCKETBASE И ОБЪЯВЛЕНИЕ ПЕРЕМЕННЫХ
    // ----------------------------------------------------
    const PB_URL = 'http://127.0.0.1:8090'; 
    const pb = new PocketBase(PB_URL);

    // Переменные для элементов HTML
    const userEmailElement = document.getElementById('user-email-display'); 
    const userNameElement = document.getElementById('user-display-name');   
    const userClassElement = document.getElementById('user-class-display'); 
    const logoutBtn = document.getElementById('logout-btn');                // Единственная кнопка "Выход"

    // ----------------------------------------------------
    // 1. ПРОВЕРКА АУТЕНТИФИКАЦИИ И ЗАЩИТА СТРАНИЦЫ
    // ----------------------------------------------------
    if (!pb.authStore.isValid) {
        // Если пользователь НЕ вошел, перенаправляем его на главную
        alert("У вас нет доступа к этой странице. Войдите, пожалуйста.");
        window.location.href = 'index.html'; // или 'index.html'
        return; // Останавливаем выполнение скрипта
    }

    // Получаем модель пользователя, если он вошел
    const user = pb.authStore.model; 

    // ----------------------------------------------------
    // 2. ОТОБРАЖЕНИЕ ИНФОРМАЦИИ О ПОЛЬЗОВАТЕЛЕ
    // ----------------------------------------------------
    if (user) {
        // 2a. Отображение EMAIL
        if (userEmailElement) {
            userEmailElement.textContent = user.email;
        }
        
        // 2b. Отображение ИМЕНИ (если оно есть)
        if (userNameElement && user.name) {
             userNameElement.textContent = user.name;
        } else if (userNameElement) {
             // Если имени нет, показываем часть email как приветствие
             userNameElement.textContent = user.email.split('@')[0];
        }
        
        // 2c. Отображение ВЫБРАННОГО КЛАССА
        if (userClassElement && user.selected_class) {
            userClassElement.textContent = user.selected_class;
        } else if (userClassElement) {
             userClassElement.textContent = 'Курс не выбран';
        }
    }

    // ----------------------------------------------------
    // 3. ФУНКЦИЯ ВЫХОДА (LOGOUT)
    // ----------------------------------------------------
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            pb.authStore.clear(); // Очищаем токен
            alert("Вы успешно вышли из аккаунта.");
            window.location.href = 'index.html'; // Перенаправляем на главную
        });
    }
});