// menu.js

// Функции для работы с localStorage
function getOrderFromStorage() {
    const orderData = localStorage.getItem('foodConstructOrder');
    return orderData ? JSON.parse(orderData) : {
        soup: null,
        main: null,
        starter: null,
        drink: null,
        dessert: null
    };
}

function saveOrderToStorage(order) {
    localStorage.setItem('foodConstructOrder', JSON.stringify(order));
}

function clearOrderFromStorage() {
    localStorage.removeItem('foodConstructOrder');
}

// Функция для загрузки данных о блюдах через API
async function loadDishes() {
    try {
        const API_KEY = '7e752a30-b955-4eac-85de-b8786c610d1f'; 
        const response = await fetch(`https://edu.std-900.ist.mospolytech.ru/labs/api/dishes?api_key=${API_KEY}`);
        
        if (!response.ok) {
            throw new Error(`Ошибка загрузки данных: ${response.status} ${response.statusText}`);
        }
        
        const dishesData = await response.json();
        return dishesData;
    } catch (error) {
        console.error('Ошибка при загрузке блюд:', error);
        // В случае ошибки возвращаем пустой массив
        return [];
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    // Загружаем блюда через API вместо использования dishes.js
    const dishes = await loadDishes();
    
    // Если блюда не загрузились, используем пустой массив
    if (!dishes || dishes.length === 0) {
        console.warn('Не удалось загрузить блюда через API');
        return;
    }

    // Объект для хранения выбранных блюд
    const selectedDishes = {
        soup: null,
        main: null,
        starter: null,
        drink: null,
        dessert: null
    };

    // Объект для хранения активных фильтров
    const activeFilters = {
        soup: null,
        main: null,
        starter: null,
        drink: null,
        dessert: null
    };

    // Сортируем блюда в алфавитном порядке
    const sortedDishes = dishes.sort((a, b) => a.name.localeCompare(b.name));
    
    // Группируем блюда по категориям (приводим названия категорий к нужному формату)
    const dishesByCategory = {
        'soup': sortedDishes.filter(dish => dish.category === 'soup'),
        'main': sortedDishes.filter(dish => dish.category === 'main-course'),
        'starter': sortedDishes.filter(dish => dish.category === 'salad'),
        'drink': sortedDishes.filter(dish => dish.category === 'drink'),
        'dessert': sortedDishes.filter(dish => dish.category === 'dessert')
    };
    
    // Отображаем блюда в соответствующих секциях
    displayDishesInSection('soup', dishesByCategory.soup);
    displayDishesInSection('main', dishesByCategory.main);
    displayDishesInSection('starter', dishesByCategory.starter);
    displayDishesInSection('drink', dishesByCategory.drink);
    displayDishesInSection('dessert', dishesByCategory.dessert);
    
    // Восстанавливаем выбранные блюда из localStorage
    restoreSelectedDishes();
    
    // Инициализируем функционал добавления в заказ
    initializeOrderFunctionality();
    
    // Инициализируем функционал фильтрации
    initializeFilterFunctionality();
    
    // Инициализируем sticky панель
    updateStickyPanel();

    function displayDishesInSection(category, dishes) {
        const section = document.getElementById(`${category}-dishes`);
        
        if (!section) return;
        
        section.innerHTML = '';
        
        dishes.forEach(dish => {
            const dishElement = createDishElement(dish);
            section.appendChild(dishElement);
        });
        
        // Обновляем выделение после отрисовки
        updateSelectedDishesDisplay();
    }

    function createDishElement(dish) {
        const dishDiv = document.createElement('div');
        dishDiv.className = 'dish-item';
        dishDiv.setAttribute('data-dish', dish.keyword);
        dishDiv.setAttribute('data-kind', dish.kind);
        dishDiv.setAttribute('data-id', dish.id);
        
        dishDiv.innerHTML = `
            <img src="${dish.image}" alt="${dish.name}" onerror="this.src='placeholder.jpg'">
            <p class="price">${dish.price}&#8381;</p>
            <p class="name">${dish.name}</p>
            <p class="weight">${dish.count}</p>
            <button class="add-to-cart">Добавить</button>
        `;
        
        return dishDiv;
    }

    function initializeOrderFunctionality() {
        // Добавляем обработчики для кнопок "Добавить"
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('add-to-cart')) {
                const dishItem = e.target.closest('.dish-item');
                const dishKeyword = dishItem.getAttribute('data-dish');
                addDishToOrder(dishKeyword);
            }
        });
    }

    function initializeFilterFunctionality() {
        // Добавляем обработчики для кнопок фильтров
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('filter-btn')) {
                const filterBtn = e.target;
                const category = filterBtn.closest('.filters').getAttribute('data-category');
                const kind = filterBtn.getAttribute('data-kind');
                
                toggleFilter(category, kind, filterBtn);
            }
        });
    }

    function toggleFilter(category, kind, filterBtn) {
        const isActive = filterBtn.classList.contains('active');
        
        // Снимаем активность со всех фильтров в этой категории
        document.querySelectorAll(`.filters[data-category="${category}"] .filter-btn`).forEach(btn => {
            btn.classList.remove('active');
        });
        
        if (isActive) {
            // Если фильтр уже был активен, снимаем фильтрацию
            activeFilters[category] = null;
            displayDishesInSection(category, dishesByCategory[category]);
        } else {
            // Активируем фильтр и применяем его
            filterBtn.classList.add('active');
            activeFilters[category] = kind;
            const filteredDishes = dishesByCategory[category].filter(dish => dish.kind === kind);
            displayDishesInSection(category, filteredDishes);
        }
        
        // Обновляем выделение выбранных блюд после фильтрации
        updateSelectedDishesDisplay();
    }

    function addDishToOrder(dishKeyword) {
        const dish = dishes.find(d => d.keyword === dishKeyword);
        if (!dish) return;
        
        // Определяем категорию для нашего формата
        let category;
        switch(dish.category) {
            case 'soup': category = 'soup'; break;
            case 'main-course': category = 'main'; break;
            case 'salad': category = 'starter'; break;
            case 'drink': category = 'drink'; break;
            case 'dessert': category = 'dessert'; break;
            default: category = dish.category;
        }
        
        // Снимаем выделение с предыдущего блюда в этой категории
        document.querySelectorAll(`.dish-item[data-dish].selected`).forEach(item => {
            const itemDish = dishes.find(d => d.keyword === item.getAttribute('data-dish'));
            if (itemDish) {
                let itemCategory;
                switch(itemDish.category) {
                    case 'soup': itemCategory = 'soup'; break;
                    case 'main-course': itemCategory = 'main'; break;
                    case 'salad': itemCategory = 'starter'; break;
                    case 'drink': itemCategory = 'drink'; break;
                    case 'dessert': itemCategory = 'dessert'; break;
                    default: itemCategory = itemDish.category;
                }
                if (itemCategory === category) {
                    item.classList.remove('selected');
                    item.style.border = '';
                }
            }
        });
        
        // Добавляем выделение текущему блюду
        const currentDishElement = document.querySelector(`.dish-item[data-dish="${dishKeyword}"]`);
        if (currentDishElement) {
            currentDishElement.classList.add('selected');
            currentDishElement.style.border = '2px solid tomato';
        }
        
        // Сохраняем выбранное блюдо
        selectedDishes[category] = dish;
        
        // Сохраняем в localStorage
        const currentOrder = getOrderFromStorage();
        currentOrder[category] = dish.id;
        saveOrderToStorage(currentOrder);
        
        // Обновляем sticky панель
        updateStickyPanel();
    }

    function restoreSelectedDishes() {
        const order = getOrderFromStorage();
        
        Object.entries(order).forEach(([category, dishId]) => {
            if (dishId) {
                const dish = dishes.find(d => d.id === dishId);
                if (dish) {
                    selectedDishes[category] = dish;
                }
            }
        });
        
        updateSelectedDishesDisplay();
    }

    function updateSelectedDishesDisplay() {
        // Обновляем отображение выбранных блюд после фильтрации
        Object.keys(selectedDishes).forEach(category => {
            const dish = selectedDishes[category];
            if (dish) {
                const dishElement = document.querySelector(`.dish-item[data-dish="${dish.keyword}"]`);
                if (dishElement) {
                    dishElement.classList.add('selected');
                    dishElement.style.border = '2px solid tomato';
                }
            }
        });
    }

    // Функция для обновления sticky панели
    function updateStickyPanel() {
        const panel = document.getElementById('sticky-order-panel');
        const totalPriceElement = document.getElementById('sticky-total-price');
        const orderBtn = document.getElementById('order-btn');
        
        if (!panel) return;
        
        // Рассчитываем общую стоимость
        const totalPrice = Object.values(selectedDishes)
            .filter(dish => dish !== null)
            .reduce((sum, dish) => sum + dish.price, 0);
        
        // Проверяем валидность комбо
        const isValid = validateOrderCombo(selectedDishes);
        
        // Показываем/скрываем панель
        if (totalPrice > 0) {
            panel.style.display = 'block';
            totalPriceElement.textContent = `${totalPrice}₽`;
            
            // Активируем/деактивируем кнопку
            if (isValid) {
                orderBtn.style.pointerEvents = 'auto';
                orderBtn.style.opacity = '1';
                orderBtn.style.cursor = 'pointer';
            } else {
                orderBtn.style.pointerEvents = 'none';
                orderBtn.style.opacity = '0.6';
                orderBtn.style.cursor = 'not-allowed';
            }
        } else {
            panel.style.display = 'none';
        }
    }

    // Функция для проверки комбо
    function validateOrderCombo(order) {
        const validCombinations = [
            ['soup', 'main', 'starter', 'drink'],
            ['soup', 'main', 'drink'],
            ['soup', 'starter', 'drink'],
            ['main', 'starter', 'drink'],
            ['main', 'drink']
        ];

        return validCombinations.some(combo => {
            return combo.every(category => order[category]);
        });
    }
});