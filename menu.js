// menu.js
document.addEventListener('DOMContentLoaded', function() {
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
    
    // Группируем блюда по категориям
    const dishesByCategory = {
        'soup': sortedDishes.filter(dish => dish.category === 'soup'),
        'main': sortedDishes.filter(dish => dish.category === 'main'),
        'starter': sortedDishes.filter(dish => dish.category === 'starter'),
        'drink': sortedDishes.filter(dish => dish.category === 'drink'),
        'dessert': sortedDishes.filter(dish => dish.category === 'dessert')
    };
    
    // Отображаем блюда в соответствующих секциях
    displayDishesInSection('soup', dishesByCategory.soup);
    displayDishesInSection('main', dishesByCategory.main);
    displayDishesInSection('starter', dishesByCategory.starter);
    displayDishesInSection('drink', dishesByCategory.drink);
    displayDishesInSection('dessert', dishesByCategory.dessert);
    
    // Заполняем опции в селектах формы
    populateSelectOptions();
    
    // Инициализируем функционал добавления в заказ
    initializeOrderFunctionality();
    
    // Инициализируем функционал фильтрации
    initializeFilterFunctionality();
    
    // Инициализируем состояние формы заказа
    updateOrderForm();

    function displayDishesInSection(category, dishes) {
        const section = document.getElementById(`${category}-dishes`);
        
        if (!section) return;
        
        section.innerHTML = '';
        
        dishes.forEach(dish => {
            const dishElement = createDishElement(dish);
            section.appendChild(dishElement);
        });
    }

    function createDishElement(dish) {
        const dishDiv = document.createElement('div');
        dishDiv.className = 'dish-item';
        dishDiv.setAttribute('data-dish', dish.keyword);
        dishDiv.setAttribute('data-kind', dish.kind);
        
        dishDiv.innerHTML = `
            <img src="${dish.image}" alt="${dish.name}" onerror="this.src='placeholder.jpg'">
            <p class="price">${dish.price}&#8381;</p>
            <p class="name">${dish.name}</p>
            <p class="weight">${dish.count}</p>
            <button class="add-to-cart">Добавить</button>
        `;
        
        return dishDiv;
    }

    function populateSelectOptions() {
        populateSelect('soup', dishes.filter(dish => dish.category === 'soup'));
        populateSelect('main-course', dishes.filter(dish => dish.category === 'main'));
        populateSelect('starter', dishes.filter(dish => dish.category === 'starter'));
        populateSelect('drink', dishes.filter(dish => dish.category === 'drink'));
        populateSelect('dessert', dishes.filter(dish => dish.category === 'dessert'));
    }

    function populateSelect(selectId, dishList) {
        const select = document.getElementById(selectId);
        if (!select) return;
        
        // Сохраняем первые два значения (заголовки)
        const firstOption = select.options[0];
        const secondOption = select.options[1];
        
        // Очищаем селект
        select.innerHTML = '';
        
        // Добавляем обратно заголовки
        select.appendChild(firstOption);
        select.appendChild(secondOption);
        
        // Добавляем блюда
        dishList.forEach(dish => {
            const option = document.createElement('option');
            option.value = dish.keyword;
            option.textContent = `${dish.name} - ${dish.price}₽`;
            select.appendChild(option);
        });
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
        
        // Снимаем выделение с предыдущего блюда в этой категории
        document.querySelectorAll(`.dish-item[data-dish].selected`).forEach(item => {
            const itemCategory = dishes.find(d => d.keyword === item.getAttribute('data-dish'))?.category;
            if (itemCategory === dish.category) {
                item.classList.remove('selected');
                item.style.border = '';
            }
        });
        
        // Добавляем выделение текущему блюду
        const currentDishElement = document.querySelector(`.dish-item[data-dish="${dishKeyword}"]`);
        if (currentDishElement) {
            currentDishElement.classList.add('selected');
            currentDishElement.style.border = '2px solid tomato';
        }
        
        // Сохраняем выбранное блюдо
        selectedDishes[dish.category] = dish;
        
        // Обновляем форму заказа
        updateOrderForm();
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

    function updateOrderForm() {
        const hasSelectedDishes = Object.values(selectedDishes).some(dish => dish !== null);
        
        // Обновляем селекты в форме
        Object.keys(selectedDishes).forEach(category => {
            const dish = selectedDishes[category];
            const selectId = getSelectIdByCategory(category);
            const select = document.getElementById(selectId);
            
            if (select && dish) {
                select.value = dish.keyword;
            }
        });
        
        // Обновляем отображение общей стоимости
        updateTotalPrice();
    }

    function getSelectIdByCategory(category) {
        const categoryToSelectId = {
            'soup': 'soup',
            'main': 'main-course',
            'starter': 'starter',
            'drink': 'drink',
            'dessert': 'dessert'
        };
        return categoryToSelectId[category];
    }

    function updateTotalPrice() {
        const totalPrice = Object.values(selectedDishes)
            .filter(dish => dish !== null)
            .reduce((sum, dish) => sum + dish.price, 0);
        
        const orderTotalElement = document.getElementById('order-total');
        
        if (totalPrice > 0) {
            orderTotalElement.innerHTML = `
                <div class="order-total">
                    <h3 class="total-price">Общая стоимость: ${totalPrice}₽</h3>
                </div>
            `;
            orderTotalElement.style.display = 'block';
        } else {
            orderTotalElement.style.display = 'none';
        }
    }
});