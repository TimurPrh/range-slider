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
    this.outputOx = {
        thumbs: [
            {
                ox: undefined,
                value: undefined,
            },
            {
                ox: undefined,
                value: undefined,
            },
        ],
        track: {},
    };
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

    const degrees = [this.initialMin, this.initialStep, this.initialMax].filter((item) => item !== 0).map((item) => this.calculateSagnificantDegree(item));

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

    const degrees = [this.initialMin, this.initialStep, this.initialMax].filter((item) => item !== 0).map((item) => this.calculateSagnificantDegree(item));

    this.stepDegree = Math.min(...degrees);
};
SliderModel.prototype.calculateSagnificantDegree = function calculateSagnificantDegree(val1: number) {
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
SliderModel.prototype.initView = function initView(fn: (props: any) => void) {
    this.sliderProps = [
        {
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
        },
    ];
    fn(this.sliderProps);
};
SliderModel.prototype.setInitialOutput = function setInitialOutput() {
    if (this.isRange) {
        if (this.currentValue[0] >= this.oldTo) {
            this.currentValue[0] = this.oldTo - this.initialStep;
        }
        if (this.currentValue[1] <= this.oldFrom) {
            this.currentValue[1] = this.oldFrom + this.initialStep;
        }
    }
    if (this.currentValue[0] >= this.initialMax) {
        this.currentValue[0] = this.initialMax - this.initialStep;
    }
    if (this.isRange) {
        if (this.currentValue[1] <= this.initialMin) {
            this.currentValue[1] = this.initialMin + this.initialStep;
        }
    }
    if (!this.isRange) {
        if (this.currentValue[1] <= this.initialMin) {
            this.currentValue[1] = this.initialMin;
        }
    }

    if (this.isVertical) {
        for (let i: number = 0; i < this.outputOx.thumbs.length; i++) {
            this.outputOx.thumbs[i].ox = Math.round(((this.currentValue[i] - this.initialMax) * this.offsetWidth) / (this.initialMin - this.initialMax));
            this.outputOx.thumbs[i].value = this.currentValue[i];
        }
    } else {
        for (let i: number = 0; i < this.outputOx.thumbs.length; i++) {
            this.outputOx.thumbs[i].ox = Math.round(((this.currentValue[i] - this.initialMin) * this.offsetWidth) / (this.initialMax - this.initialMin));
            this.outputOx.thumbs[i].value = this.currentValue[i];
        }
    }

    this.calculateMove(this.outputOx.thumbs[1].ox, 1);
    if (this.isRange) {
        this.calculateMove(this.outputOx.thumbs[0].ox, 0);
    }
};
SliderModel.prototype.calculateMove = function calculateMove(pos: number, id: number) {
    const viewStep = ((this.offsetWidth) * this.sliderProps[id].sliderStep) / (this.sliderProps[1].sliderMax - this.sliderProps[0].sliderMin);
    let ox: number = Math.round(pos / viewStep) * viewStep;

    if (this.isVertical) {
        this.sliderProps[0].sliderMax = this.outputOx.thumbs[1].value - this.sliderProps[1].sliderStep;
        this.sliderProps[0].offsetLeft = this.outputOx.thumbs[1].ox + viewStep + this.minThumbOffset;

        if (this.isRange) {
            this.sliderProps[1].sliderMin = this.outputOx.thumbs[0].value + this.sliderProps[0].sliderStep;
            this.sliderProps[1].offsetRight = this.offsetWidth - this.outputOx.thumbs[0].ox + viewStep + this.minThumbOffset;
        } else {
            this.sliderProps[1].offsetRight = this.minThumbOffset;
        }

        this.sliderRange[id] = this.sliderProps[id].sliderMax - this.sliderProps[id].sliderMin;
        if (this.sliderRange[id] === 0) {
            this.currentValue[id] = this.sliderProps[id].sliderMax;
        } else {
            this.currentValue[id] = this.sliderProps[id].sliderMax - (this.sliderRange[id] / (this.offsetWidth - this.sliderProps[id].offsetRight - this.sliderProps[id].offsetLeft)) * (ox - this.sliderProps[id].offsetLeft);
            this.currentValue[id] = this.roundValue(this.currentValue[id], this.stepDegree);
        }

        if (ox < this.sliderProps[id].offsetLeft) {
            ox = this.sliderProps[id].offsetLeft;
            this.currentValue[id] = this.sliderProps[id].sliderMax;
        } else if (ox > this.offsetWidth - this.sliderProps[id].offsetRight) {
            ox = this.offsetWidth - this.sliderProps[id].offsetRight;
            this.currentValue[id] = this.sliderProps[id].sliderMin;
        }
    } else {
        this.sliderProps[0].sliderMax = this.outputOx.thumbs[1].value - this.sliderProps[1].sliderStep;
        this.sliderProps[0].offsetRight = this.offsetWidth - this.outputOx.thumbs[1].ox + viewStep + this.minThumbOffset;

        if (this.isRange) {
            this.sliderProps[1].sliderMin = this.outputOx.thumbs[0].value + this.sliderProps[0].sliderStep;
            this.sliderProps[1].offsetLeft = this.outputOx.thumbs[0].ox + viewStep + this.minThumbOffset;
        } else {
            this.sliderProps[1].offsetLeft = this.minThumbOffset;
        }

        this.sliderRange[id] = this.sliderProps[id].sliderMax - this.sliderProps[id].sliderMin;
        if (this.sliderRange[id] === 0) {
            this.currentValue[id] = this.sliderProps[id].sliderMax;
        } else {
            this.currentValue[id] = this.sliderProps[id].sliderMax + (this.sliderRange[id] / (this.offsetWidth - this.sliderProps[id].offsetRight - this.sliderProps[id].offsetLeft)) * (ox - this.offsetWidth + this.sliderProps[id].offsetRight);
            this.currentValue[id] = this.roundValue(this.currentValue[id], this.stepDegree);
        }

        if (ox < this.sliderProps[id].offsetLeft) {
            ox = this.sliderProps[id].offsetLeft;
            this.currentValue[id] = this.sliderProps[id].sliderMin;
        } else if (ox > this.offsetWidth - this.sliderProps[id].offsetRight) {
            ox = this.offsetWidth - this.sliderProps[id].offsetRight;
            this.currentValue[id] = this.sliderProps[id].sliderMax;
        }
    }

    this.outputOx.thumbs[id].ox = ox;
    this.outputOx.thumbs[id].value = this.currentValue[id];

    if (this.isRange) {
        if (this.isVertical) {
            this.outputOx.track = {
                begin: this.outputOx.thumbs[1].ox,
                end: this.outputOx.thumbs[0].ox,
            };
        } else {
            this.outputOx.track = {
                begin: this.outputOx.thumbs[0].ox,
                end: this.outputOx.thumbs[1].ox,
            };
        }
    } else if (this.isVertical) {
        this.outputOx.track = {
            begin: ox,
            end: this.offsetWidth,
        };
    } else {
        this.outputOx.track = {
            begin: 0,
            end: ox,
        };
    }
};
SliderModel.prototype.calculateIndex = function calculateIndex(ox: number) {
    if (this.isRange) {
        const currOutput: number[] = [];
        const delta: number[] = [];
        currOutput[0] = this.outputOx.thumbs[0].ox;
        currOutput[1] = this.outputOx.thumbs[1].ox;
        delta[0] = Math.abs(currOutput[0] - ox);
        delta[1] = Math.abs(currOutput[1] - ox);
        return delta.indexOf(Math.min(...delta));
    }
    return 1;
};

export default SliderModel;
