import SliderController from './controller/controller';

import './style.scss';

interface sliderSettings {
    range: boolean,
    vertical: boolean,
    scale: boolean,
    tip: boolean,
    bar: boolean,
    min: number,
    max: number,
    step: number,
    from: number,
    to: number,
}

declare global {
    interface JQuery {
        slider(args: any, options?: any): JQuery & sliderSettings;
    }
}

(function customSliderOuter($) {
    const methods = {
        init(options: any) {
            const $this = $(this);
            const data = $this.data('slider');

            const controller = new SliderController($this);
            if (!data) {
                // Тут выполняем инициализацию
                controller.initialize(options);
                $(this).data('slider', controller);
            }
        },
        reInit(options: any) {
            const $this = $(this);
            const data = $this.data('slider');

            data.reInitialize(options);
        },
        getSettings() {
            const $this = $(this);
            const data = $this.data('slider');

            return data.getSettings();
        },
        setToValue(val: number) {
            const $this = $(this);
            const data = $this.data('slider');
            data.setToValue(val);
            return this;
        },
        setFromValue(val: number) {
            const $this = $(this);
            const data = $this.data('slider');
            data.setFromValue(val);
            return this;
        },
    };

    jQuery.fn.slider = function customSlider(method, ...args) {
        if (methods[method]) {
            return methods[method].apply(this, args);
        } if (typeof method === 'object' || !method) {
            return methods.init.apply(this, [method]);
        }
        return $.error(`Метод с именем ${method} не существует для jQuery.slider`);
    };
}(jQuery));

export default $.fn.slider;
