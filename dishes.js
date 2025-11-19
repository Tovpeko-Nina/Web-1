// dishes.js
const dishes = [
    // Супы (6 блюд)
    {
        keyword: 'tom-yam',
        name: 'Том Ям с креветками',
        price: 365,
        category: 'soup',
        count: '350 мл',
        image: 'tom_yam.png',
        kind: 'fish'
    },
    {
        keyword: 'norwegian-soup',
        name: 'Норвежский суп',
        price: 270,
        category: 'soup',
        count: '350 мл',
        image: 'norwegian_soup.png',
        kind: 'fish'
    },
    {
        keyword: 'chicken-soup',
        name: 'Куриный суп с лапшой',
        price: 220,
        category: 'soup',
        count: '350 мл',
        image: 'chicken_coup.png',
        kind: 'meat'
    },
    {
        keyword: 'mushroom-soup',
        name: 'Грибной суп пюре',
        price: 185,
        category: 'soup',
        count: '350 мл',
        image: 'mushroom_soup.png',
        kind: 'veg'
    },
    {
        keyword: 'borscht',
        name: 'Борщ с говядиной',
        price: 240,
        category: 'soup',
        count: '350 мл',
        image: 'borscht.png',
        kind: 'meat'
    },
    {
        keyword: 'gazpacho',
        name: 'Гаспачо',
        price: 195,
        category: 'soup',
        count: '350 мл',
        image: 'gazpacho.png',
        kind: 'veg'
    },

    // Главные блюда (6 блюд)
    {
        keyword: 'lasagna',
        name: 'Лазанья',
        price: 385,
        category: 'main',
        count: '350 г',
        image: 'lasagna.png',
        kind: 'meat'
    },
    {
        keyword: 'potatoes-mushrooms',
        name: 'Жаренная картошка с грибами',
        price: 150,
        category: 'main',
        count: '300 г',
        image: 'mushrooms.png',
        kind: 'veg'
    },
    {
        keyword: 'chicken-cutlets',
        name: 'Котлеты из курицы с картофельным пюре',
        price: 225,
        category: 'main',
        count: '350 г',
        image: 'potato.png',
        kind: 'meat'
    },
    {
        keyword: 'fish-cutlet',
        name: 'Рыбная котлета с рисом и спаржей',
        price: 320,
        category: 'main',
        count: '370 г',
        image: 'fish_cutlet.png',
        kind: 'fish'
    },
    {
        keyword: 'pasta-shrimp',
        name: 'Паста с креветками',
        price: 340,
        category: 'main',
        count: '280 г',
        image: 'pasta_shrimp.png',
        kind: 'fish'
    },
    {
        keyword: 'vegetable-stew',
        name: 'Овощное рагу',
        price: 195,
        category: 'main',
        count: '350 г',
        image: 'vegetable_stew.png',
        kind: 'veg'
    },

    // Напитки (6 блюд)
    {
        keyword: 'orange-juice',
        name: 'Апельсиновый сок',
        price: 120,
        category: 'drink',
        count: '250 мл',
        image: 'orange.png',
        kind: 'cold'
    },
    {
        keyword: 'apple-juice',
        name: 'Яблочный сок',
        price: 110,
        category: 'drink',
        count: '250 мл',
        image: 'apple.png',
        kind: 'cold'
    },
    {
        keyword: 'water',
        name: 'Минеральная вода',
        price: 80,
        category: 'drink',
        count: '500 мл',
        image: 'water.png',
        kind: 'cold'
    },

    {
        keyword: 'cappuccino',
        name: 'Капучино',
        price: 180,
        category: 'drink',
        count: '300 мл',
        image: 'cappuccino.png',
        kind: 'hot'
    },
    {
        keyword: 'green-tea',
        name: 'Зеленый чай',
        price: 100,
        category: 'drink',
        count: '300 мл',
        image: 'green_tea.png',
        kind: 'hot'
    },
    {
        keyword: 'black-tea',
        name: 'Черный чай',
        price: 90,
        category: 'drink',
        count: '300 мл',
        image: 'black_tea.png',
        kind: 'hot'
    },

    // Салаты и стартеры (6 блюд)
    {
        keyword: 'korean-salad',
        name: 'Корейский салат с овощами и яйцом',
        price: 330,
        category: 'starter',
        count: '250 г',
        image: 'korean_salad.png',
        kind: 'veg'
    },
    {
        keyword: 'tuna-salad',
        name: 'Салат с тунцом',
        price: 480,
        category: 'starter',
        count: '250 г',
        image: 'tuna_salad.png',
        kind: 'fish'
    },
    {
        keyword: 'caesar-salad',
        name: 'Цезарь с цыпленком',
        price: 370,
        category: 'starter',
        count: '220 г',
        image: 'caesar_salad.png',
        kind: 'meat'
    },
    {
        keyword: 'caprese',
        name: 'Капрезе с моцареллой',
        price: 350,
        category: 'starter',
        count: '235 г',
        image: 'caprese.png',
        kind: 'veg'
    },
    {
        keyword: 'fries-caesar',
        name: 'Картофель фри с соусом Цезарь',
        price: 280,
        category: 'starter',
        count: '235 г',
        image: 'fries_caesar.png',
        kind: 'veg'
    },
    {
        keyword: 'fries-ketchup',
        name: 'Картофель фри с кетчупом',
        price: 260,
        category: 'starter',
        count: '235 г',
        image: 'fries_ketchup.png',
        kind: 'veg'
    },

    // Десерты (6 блюд)
    {
        keyword: 'baklava',
        name: 'Пахлава',
        price: 220,
        category: 'dessert',
        count: '300 г',
        image: 'baklava.png',
        kind: 'small'
    },
    {
        keyword: 'chocolate-cake',
        name: 'Шоколадный торт',
        price: 270,
        category: 'dessert',
        count: '140 г',
        image: 'chocolate_cake.png',
        kind: 'medium'
    },
    {
        keyword: 'cheesecake',
        name: 'Чизкейк',
        price: 240,
        category: 'dessert',
        count: '125 г',
        image: 'cheesecake.png',
        kind: 'small'
    },
    {
        keyword: 'donuts-3',
        name: 'Пончики (3 штуки)',
        price: 410,
        category: 'dessert',
        count: '350 г',
        image: 'donuts_3.png',
        kind: 'medium'
    },
    {
        keyword: 'chocolate-cheesecake',
        name: 'Шоколадный чизкейк',
        price: 260,
        category: 'dessert',
        count: '125 г',
        image: 'chocolate_cheesecake.png',
        kind: 'small'
    },
    {
        keyword: 'donuts-6',
        name: 'Пончики (6 штук)',
        price: 650,
        category: 'dessert',
        count: '700 г',
        image: 'donuts_6.png',
        kind: 'large'
    }
];