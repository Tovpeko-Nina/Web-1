// menu.js
document.addEventListener('DOMContentLoaded', function() {
    // Объект для хранения выбранных блюд
    const selectedDishes = {
        soup: null,
        main: null,
        drink: null
    };

    // Сортируем блюда в алфавитном порядке
    const sortedDishes = dishes.sort((a, b) => a.name.localeCompare(b.name));
    
    // Группируем блюда по категориям
    const dishesByCategory = {
        'soup': sortedDishes.filter(dish => dish.category === 'soup'),
        'main': sortedDishes.filter(dish => dish.category === 'main'),
        'drink': sortedDishes.filter(dish => dish.category === 'drink')
    };
    
    // Отображаем блюда в соответствующих секциях
    displayDishesInSection('soup', dishesByCategory.soup);
    displayDishesInSection('main', dishesByCategory.main);
    displayDishesInSection('drink', dishesByCategory.drink);
    
    // Заполняем опции в селектах формы
    populateSelectOptions();
    
    // Инициализируем функционал добавления в заказ
    initializeOrderFunctionality();
    
    // Инициализируем состояние формы заказа
    updateOrderForm();

    function displayDishesInSection(category, dishes) {
        const section = document.querySelector(`.menu-section:nth-child(${getSectionIndex(category)}) .dishes-grid`);
        
        if (!section) return;
        
        section.innerHTML = '';
        
        dishes.forEach(dish => {
            const dishElement = createDishElement(dish);
            section.appendChild(dishElement);
        });
    }

    function getSectionIndex(category) {
        switch(category) {
            case 'soup': return 1;
            case 'main': return 2;
            case 'drink': return 3;
            default: return 1;
        }
    }

    function createDishElement(dish) {
        const dishDiv = document.createElement('div');
        dishDiv.className = 'dish-item';
        dishDiv.setAttribute('data-dish', dish.keyword);
        
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
        populateSelect('drink', dishes.filter(dish => dish.category === 'drink'));
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

    function updateOrderForm() {
        const hasSelectedDishes = selectedDishes.soup || selectedDishes.main || selectedDishes.drink;
        
        // Обновляем селекты в форме
        updateSelect('soup', selectedDishes.soup);
        updateSelect('main-course', selectedDishes.main);
        updateSelect('drink', selectedDishes.drink);
        
        // Обновляем отображение стоимости
        updateOrderTotal();
        
        // Показываем/скрываем блок стоимости
        const totalElement = document.getElementById('order-total');
        if (totalElement) {
            totalElement.style.display = hasSelectedDishes ? 'block' : 'none';
        }
    }

    function updateSelect(selectId, dish) {
        const select = document.getElementById(selectId);
        if (!select) return;
        
        if (dish) {
            select.value = dish.keyword;
        } else {
            select.value = '';
        }
    }

    function updateOrderTotal() {
        let total = 0;
        
        if (selectedDishes.soup) total += selectedDishes.soup.price;
        if (selectedDishes.main) total += selectedDishes.main.price;
        if (selectedDishes.drink) total += selectedDishes.drink.price;
        
        const totalElement = document.getElementById('order-total');
        if (totalElement) {
            totalElement.innerHTML = `
                <hr class="divider">
                <div class="order-total">
                    <h2>Стоимость заказа</h2>
                    <p class="total-price">Итого: ${total}&#8381;</p>
                </div>
            `;
        }
    }

    // Обработка изменения селектов вручную (на случай, если пользователь изменит выбор в форме)
    document.getElementById('soup')?.addEventListener('change', function() {
        handleSelectChange('soup', this.value);
    });
    
    document.getElementById('main-course')?.addEventListener('change', function() {
        handleSelectChange('main', this.value);
    });
    
    document.getElementById('drink')?.addEventListener('change', function() {
        handleSelectChange('drink', this.value);
    });

    function handleSelectChange(category, dishKeyword) {
        if (!dishKeyword) {
            // Если выбрано "отсутствует в заказе"
            selectedDishes[category] = null;
            // Снимаем выделение с блюда
            document.querySelectorAll(`.dish-item[data-dish].selected`).forEach(item => {
                const itemCategory = dishes.find(d => d.keyword === item.getAttribute('data-dish'))?.category;
                if (itemCategory === category) {
                    item.classList.remove('selected');
                    item.style.border = '';
                }
            });
        } else {
            // Добавляем блюдо через стандартную функцию
            addDishToOrder(dishKeyword);
        }
        
        updateOrderForm();
    }
});