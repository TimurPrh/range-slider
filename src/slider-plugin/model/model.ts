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

const SliderModel = function SliderModel() {
    this.minThumbOffset = 0;
    this.currentValue = [];
    this.sliderRange = [];
};
SliderModel.prototype.setInitialSettings = function setInitialSettings(settings: sliderSettings) {
    let defaults = {
        range: true,
        vertical: true,
        scale: true,
        tip: true,
        bar: true,
        min: 0,
        max: 100,
        step: 10,
        from: 0,
        to: 100,
    };
    defaults = { ...defaults, ...settings };
    const step: number = defaults.step || 1; // Исключаем нулевой шаг
    this.isRange = defaults.range;
    this.isVertical = defaults.vertical;
    this.viewScale = defaults.scale;
    this.viewTip = defaults.tip;
    this.viewBar = defaults.bar;
    this.initialMin = defaults.min;
    this.initialMax = defaults.max;
    this.initialStep = step;
    this.currentValue[0] = defaults.from;
    this.currentValue[1] = defaults.to;

    const degrees = [this.initialMin, this.initialStep, this.initialMax].filter((item) => item !== 0).map((item) => this.calculateSignificantDegree(item));

    this.stepDegree = Math.min(...degrees);
};
SliderModel.prototype.setSettings = function setSettings(settings: sliderSettings) {
    let defaults = {
        range: this.isRange,
        vertical: this.isVertical,
        scale: this.viewScale,
        tip: this.viewTip,
        bar: this.viewBar,
        min: this.initialMin,
        max: this.initialMax,
        step: this.initialStep,
        from: this.currentValue[0],
        to: this.currentValue[1],
    };
    defaults = { ...defaults, ...settings };

    const step: number = defaults.step || 1; // Исключаем нулевой шаг

    this.isRange = defaults.range;
    this.isVertical = defaults.vertical;
    this.viewScale = defaults.scale;
    this.viewTip = defaults.tip;
    this.viewBar = defaults.bar;
    this.initialMin = defaults.min;
    this.initialMax = defaults.max;
    this.initialStep = step;
    [this.oldFrom, this.oldTo] = this.currentValue;
    this.currentValue[0] = defaults.from;
    this.currentValue[1] = defaults.to;

    const degrees = [this.initialMin, this.initialStep, this.initialMax].filter((item) => item !== 0).map((item) => this.calculateSignificantDegree(item));

    this.stepDegree = Math.min(...degrees);
};
SliderModel.prototype.initView = function initView(fn: (props: any) => void) {
    this.sliderProps = [{
        sliderMin: this.initialMin,
        sliderMax: this.initialMax,
        sliderStep: this.initialStep,
        offsetLeft: this.minThumbOffset,
        offsetRight: this.minThumbOffset,
    },
    {
        sliderMin: this.initialMin,
        sliderMax: this.initialMax,
        sliderStep: this.initialStep,
        offsetLeft: this.minThumbOffset,
        offsetRight: this.minThumbOffset,
    }];
    fn(this.sliderProps[0]);
};
SliderModel.prototype.setInitialOutput = function setInitialOutput() {
    const a = this.initialMax - this.initialMin;
    const b = this.initialStep;
    const tempMax = this.initialMax;
    if (!((a - b * Math.floor(a / b)) === 0)) { // если разница максимального и минимального значения не делится на шаг, то переписываем максимальное значение
        this.initialMax = this.roundValue(this.initialMin + this.initialStep * Math.floor((this.initialMax - this.initialMin) / this.initialStep), this.stepDegree);
    }
    this.currentValue[1] = this.roundValue(this.initialMin + this.initialStep * Math.round((this.currentValue[1] - this.initialMin) / this.initialStep), this.stepDegree);
    if (this.isRange) {
        this.currentValue[0] = this.roundValue(this.initialMin + this.initialStep * Math.round((this.currentValue[0] - this.initialMin) / this.initialStep), this.stepDegree);

        if (this.currentValue[0] >= this.oldTo) {
            this.currentValue[0] = this.oldTo - this.initialStep;
        }
        if (this.currentValue[1] <= this.oldFrom) {
            this.currentValue[1] = this.oldFrom + this.initialStep;
        }
        if (this.currentValue[1] <= this.initialMin) {
            this.currentValue[1] = this.initialMin + this.initialStep;
        }
        if (this.currentValue[1] >= this.initialMax) {
            this.currentValue[1] = this.initialMax;
        }

        if (this.currentValue[0] === this.currentValue[1] && this.currentValue[1] > this.initialMin) {
            this.currentValue[0] -= this.initialStep;
        }
    }
    if (this.currentValue[0] >= this.initialMax) {
        this.currentValue[0] = this.initialMax - this.initialStep;
    }
    if (this.currentValue[0] <= this.initialMin) {
        this.currentValue[0] = this.initialMin;
    }
    if (!this.isRange) {
        if (this.currentValue[1] <= this.initialMin) {
            this.currentValue[1] = this.initialMin;
        }
        if (this.currentValue[1] >= this.initialMax) {
            this.currentValue[1] = this.initialMax;
        }
    }

    this.initialMax = tempMax;
};
SliderModel.prototype.calculateSignificantDegree = function calculateSignificantDegree(val1: number) {
    const val: number = Math.abs(val1);
    const significant = val.toExponential().replace(/^([0-9]+)\.?([0-9]+)?e[+\-0-9]*$/g, "$1$2").length; // количество значащих цифр
    const comma = val.toString().indexOf('.');
    const len = val.toString().length;
    if (comma === -1) {
        return len - significant;
    }
    return comma - len + 1;
};
SliderModel.prototype.roundValue = function roundValue(val: number, deg: number) {
    // Если степень не определена, либо равна нулю...
    if (typeof deg === 'undefined' || +deg === 0) {
        return Math.round(val);
    }
    let value: number = +val;
    const exp: number = +deg;
    // Сдвиг разрядов
    let valueStr = value.toString().split('e');
    value = Math.round(+(`${valueStr[0]}e${valueStr[1] ? (+valueStr[1] - exp) : -exp}`));
    // Обратный сдвиг
    valueStr = value.toString().split('e');
    return +(`${valueStr[0]}e${valueStr[1] ? (+valueStr[1] + exp) : exp}`);
};

export default SliderModel;
