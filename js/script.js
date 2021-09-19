"use strict"

/*определяем на каком устройстве открыта страница*/

const isMobile = {
    Android: function () {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
        return navigator.userAgent.match(/Opera mini/i);
    },
    Windows: function () {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function () {
        return (
            isMobile.Android() ||
            isMobile.BlackBerry() ||
            isMobile.iOS() ||
            isMobile.Opera() ||
            isMobile.Windows()
        );
    }
};

/*проверяем на каком устройстве открыта страница и 
добавляем соответствующий класс элементу body

если страница открыта на мобилке, собираем все элементы
с классом menu_arrow в массив (стрелочки для вывода подменю, 
их может быть больше, чем 1)

перебираем массив и на каждый элемент (каждую стрелочку) вешаем
event listener, что бы на клик по стрелочке к родительскому элементу 
li добавлялся или убирался класс activ*/

if (isMobile.any()) {
    document.body.classList.add('_touch');

    let menuArrows = document.querySelectorAll('.menu__arrow');
    if (menuArrows.length > 0) {
        for (let i=0; i<menuArrows.length; i++) {
            const menuArrow = menuArrows[i];
            menuArrow.addEventListener("click", function(e) {
                menuArrow.parentElement.classList.toggle('_active');
            });
        }
    }
} else {
    document.body.classList.add('_pc');
}


/*прокрутка до нужного раздела сайте при клике на элемент меню*/

/*собираем все элементы с классом menu__link 
у которых есть атрибут data-goto в массив

проходимся по массиву и на каждый элемент меню вешаем event listener по клику

в функции onMenuLicnkClick мы будем получать объект на который кликаем
(сама ссылка)

обязательное условие проверки - заполнен ли атрибут goto у элемента
и существует ли блок, на который ссылается этот дата атрибут

следующий шаг - получаем в константу тот самый блок, на который ссылается 
дата атрибут

далее высчитываем положение объекта с учетом высоты шапки, 
так как она фиксирована и может закрыть контент (используем встроенную 
функцию getBoundingClientRect и переменную pageYOffset, чтобы посчитать
прокрутку)

проверяеи присвоен ли элементам body, iconMenu и menuBody класс active 
(фактически это значит, что наше меню открыто)
Если меню открыто, при клике удаляем у элементов класс active, 
чтобы закрыть меню и перейти к нужному разделу страницы

обращаемся к окну и в функции scrollTo указываем положение объекта 
и плавную прокрутку 

далее блокируем дефолтное поведение ссылки, чтобы она крутила к нужному блоку,
а не уходила в ссылку переданную в параметр href*/

const menuLinks = document.querySelectorAll('.menu__link[data-goto]');

if (menuLinks.length > 0) {
    menuLinks.forEach(menuLink => {
        menuLink.addEventListener("click", onMenuLinkClick);
    });

    function onMenuLinkClick(e) {
        const menuLink = e.target;
        if (menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto)) {
            const gotoBlock = document.querySelector(menuLink.dataset.goto);
            const gotoBlockValue = gotoBlock.getBoundingClientRect().top + pageXOffset - document.querySelector('header').offsetHeight;

            if (iconMenu.classList.contains('_active')) {
                document.body.classList.remove('_lock');
                iconMenu.classList.remove('_active');
                menuBody.classList.remove('_active');
            }

            window.scrollTo({
                top: gotoBlockValue,
                behavior: "smooth"
            });
            e.preventDefault();
        }
    }
}

/*меню бургер*/

/*получаем элемент бургера

проверяем существует ли такой элемент/класс/объект 

получаем в константу элемент с классом menu__body

вешаем listener по клику на иконку бргера и меню, по клику добавляем 
или убираем класс active

добавляем body класс lock, чтобы нельзя было скроллить контент 
когда открыто меню*/

const iconMenu = document.querySelector('.menu__icon');
const menuBody = document.querySelector('.menu__body');

if (iconMenu) {
    iconMenu.addEventListener("click", function(e) {
        document.body.classList.toggle('_lock');
        iconMenu.classList.toggle('_active');
        menuBody.classList.toggle('_active');
    });
}