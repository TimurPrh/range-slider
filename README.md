# Range Slider
Четвертый этап - практическое задание MetaLamp.  
Реализация плагина слайдера — специального контрола, который позволяет перетягиванием задавать какое-то числовое значение.

## Основные команды
`npm run dev` - сборка проекта в режиме development  
`npm run build` - сборка проекта в режиме production  
`npm start` - сборка проекта в режиме development, запуск локального сервера, открытие вкладки с адресом локального сервера в браузере  
`npm test` - запуск тестов jest  

## Использование
```javascript
import RangeSlider from './range-slider.js';
import './range-slider.css'

new RangeSlider('#el' [, options]);
```

## Архитектура  
* Основной модуль RangeSlider реализует интерфейс взаимодействия с модулем SliderController.
* Модуль SliderController отвечает за взаимодействие с пользователем и модулями SliderModel и SliderView.
* Модуль SliderModel отвечает за бизнес-логику слайдера.  
Он принимает начальные установки.  
При перерасчете принимет значение в пикселях при перемещении ручки пользователем или конкретные значение при установке положения ручки из JavaScript.  
В нем формируется объект outputOx, содержащий:
    * для каждой ручки положение в процентах и текущее значение;
    * начало и конец прогресс бара в процентах.
* Модуль SliderView отвечает за отображение элементов слайдера.  
При начальной установке и реинициализации он отрисовывает каждый элемент слайдера.    
При принятии объекта outputOx меняются (но не перерисовываются польностью) элементы шкалы, лэйблов и ручек. Также меняется скрытый элемент input.  
В модуле SliderView импортируются subViews: inputs (скрытые input'ы), labels (значения над ручками), scale (шкала), thumbs (ручки), track (прогресс бар).

## Событие слайдера  
`moveThumbEvent` - срабатывает при перемещении ручки и, соответственно, изменений значения. Событие содержит поле detail, в котором
    * id - обозначение ручки. 0 - меньшая ручка, 1 - большая ручка
    * inputVal - значение ручки

Пример использования
```javascript
function fromAndToValuesHandler(e: CustomEvent) {
    // id === 0 - значение "from", id === 1 - значение "to"
    console.log(`id - ${e.detail.id}`);
    console.log(`значение - ${e.detail.inputVal}`);
}
sliderWrapper.addEventListener('moveThumbEvent', fromAndToValuesHandler.bind(this));
```

## API слайдера  
-  `new RangeSlider('#el' [, options])` - при первичной инициализации слайдера.  
    - Первый аргумент - элемент, в который помещается слайдер.  
    - Второй аргумент - объект настроек:  
        - `range: boolean` - слайдер в виде диапазона с двумя ручками  
        - `vertical: boolean` - вертикальный вариант слайдера  
        - `scale: boolean` - добавление шкалы  
        - `tip: boolean` - добавление элемента с текущим значением над ручкой  
        - `bar: boolean` - добавление прогресс бара  
        - `min: number` - минимальное значение  
        - `max: number` - максимальное значение  
        - `step: number` - шаг  
        - `from: number` - значение меньшей ручки (только при range - true)  
        - `to: number` - значение большей ручки  
        <br>
    ```javascript
    const rangeSlider = new RangeSlider(sliderWrapper, {
        range: true,
        vertical: false,
        scale: true,
        tip: true,
        bar: true,
        min: 0,
        max: 100,
        step: 10,
        from: 20,
        to: 40,
    });
    ```

- `reInitialize(options)` - при реинициализации с аналогичным аргументом объектом настроек  

```javascript
rangeSlider.reInitialize({
    range: false,
    vertical: true
});
```

- `getSettings()` - получение текущих настроек слайдера  

```javascript
const settings = rangeSlider.getSettings();
```

- `setToValue` - установка значения меньшей ручки (только при range - true)   

```javascript
rangeSlider.setToValue(20);
```

- `setFromValue` - установка значения большей ручки  

```javascript
rangeSlider.setFromValue(10);
```
