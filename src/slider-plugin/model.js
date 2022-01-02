const SliderModel = function SliderModel() {
    this.minThumbOffset = 0;
    this.isRange;
    this.isVertical;
    this.viewScale;
    this.viewTip;
    this.viewBar;
    this.initialMin;
    this.initialMax;
    this.initialStep;
    this.currentValue = [];
    this.sliderRange = [];
    this.outputOx = {thumbs: [
        {
            ox: undefined,
            value: undefined
        },
        {
            ox: undefined,
            value: undefined
        }
    ],
    track: {}};
}
SliderModel.prototype.setInitialSettings = function setInitialSettings(settings) {
    let defaults = {
        range: true,
        vertical: true,
        scale: true,
        tip: true,
        bar: true,
        min: -0.01,
        max: 0.01,
        step: 0.001,
        from: 0,
        to: 0.01
    }
    defaults = {...defaults, ...settings};
    this.isRange = defaults.range;
    this.isVertical = defaults.vertical;
    this.viewScale = defaults.scale;
    this.viewTip = defaults.tip;
    this.viewBar = defaults.bar;
    this.initialMin = defaults.min;
    this.initialMax = defaults.max;
    this.initialStep = defaults.step;
    this.currentValue[0] = defaults.from;
    this.currentValue[1] = defaults.to;

    this.stepDegree = Math.min(this.calculateSagnificantDegree(this.initialMin), this.calculateSagnificantDegree(this.initialStep), this.calculateSagnificantDegree(this.initialMax));
}
SliderModel.prototype.setSettings = function setSettings(settings) {
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
        to: this.currentValue[1]
    }
    defaults = {...defaults, ...settings};
    console.group('set settings');
    console.log(defaults);
    console.groupEnd();
    this.isRange = defaults.range;
    this.isVertical = defaults.vertical;
    this.viewScale = defaults.scale;
    this.viewTip = defaults.tip;
    this.viewBar = defaults.bar;
    this.initialMin = defaults.min;
    this.initialMax = defaults.max;
    this.initialStep = defaults.step;
    this.oldFrom = this.currentValue[0];
    this.oldTo = this.currentValue[1];
    this.currentValue[0] = defaults.from;
    this.currentValue[1] = defaults.to;

    this.stepDegree = Math.min(this.calculateSagnificantDegree(this.initialMin), this.calculateSagnificantDegree(this.initialStep), this.calculateSagnificantDegree(this.initialMax));
}
SliderModel.prototype.calculateSagnificantDegree = function calculateSagnificantDegree(val) {
    val = Math.abs(val);
    const significant = val.toExponential().replace(/^([0-9]+)\.?([0-9]+)?e[\+\-0-9]*$/g, "$1$2").length, //количество значащих цифр
        comma = val.toString().indexOf('.'),
        len = val.toString().length;
    if (comma === -1) {
        return len - significant
    }
    return comma - len + 1
}
SliderModel.prototype.roundValue = function roundValue(val, deg) {
    (function() {
        /**
         * Корректировка округления десятичных дробей.
         *
         * @param {String}  type  Тип корректировки.
         * @param {Number}  value Число.
         * @param {Integer} exp   Показатель степени (десятичный логарифм основания корректировки).
         * @returns {Number} Скорректированное значение.
         */
        function decimalAdjust(type, value, exp) {
            // Если степень не определена, либо равна нулю...
            if (typeof exp === 'undefined' || +exp === 0) {
                return Math[type](value);
            }
            value = +value;
            exp = +exp;
            // Если значение не является числом, либо степень не является целым числом...
            if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
                return NaN;
            }
            // Сдвиг разрядов
            value = value.toString().split('e');
            value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
            // Обратный сдвиг
            value = value.toString().split('e');
            return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
        }
      
        // Десятичное округление к ближайшему
        if (!Math.round10) {
            Math.round10 = function(value, exp) {
                return decimalAdjust('round', value, exp);
            };
        }
        // Десятичное округление вниз
        if (!Math.floor10) {
            Math.floor10 = function(value, exp) {
                return decimalAdjust('floor', value, exp);
            };
        }
        // Десятичное округление вверх
        if (!Math.ceil10) {
            Math.ceil10 = function(value, exp) {
                return decimalAdjust('ceil', value, exp);
            };
        }
    })();
    return Math.round10(val, deg)
}
SliderModel.prototype.initView = function initView(fn) {
    this.sliderProps = [
        {
            sliderMin: this.initialMin,
            sliderMax: this.initialMax,
            sliderStep: this.initialStep,
            offsetLeft: this.minThumbOffset,
            offsetRight: this.minThumbOffset
        },
        {
            sliderMin: this.initialMin,
            sliderMax: this.initialMax,
            sliderStep: this.initialStep,
            offsetLeft: this.minThumbOffset,
            offsetRight: this.minThumbOffset
        }
    ];
    fn(this.sliderProps);
}
SliderModel.prototype.setInitialOutput = function setInitialOutput() {
    if (this.currentValue[0] >= this.oldTo) {
        this.currentValue[0] = this.oldTo - this.initialStep;
    }
    if (this.currentValue[1] <= this.oldFrom) {
        this.currentValue[1] = this.oldFrom + this.initialStep;
    }
    if (this.currentValue[0] >= this.initialMax) {
        this.currentValue[0] = this.initialMax - this.initialStep;
    }
    if (this.currentValue[1] <= this.initialMin) {
        this.currentValue[1] = this.initialMin + this.initialStep;
    }
    
    if (this.isVertical) {
        this.outputOx.thumbs.forEach((thumb, i) => {
            thumb.ox = Math.round((this.currentValue[i] - this.initialMax) * this.offsetWidth / (this.initialMin - this.initialMax));
            thumb.value = this.currentValue[i];
        })
    } else {
        this.outputOx.thumbs.forEach((thumb, i) => {
            thumb.ox = Math.round((this.currentValue[i] - this.initialMin) * this.offsetWidth / (this.initialMax - this.initialMin));
            thumb.value = this.currentValue[i];
        })
    }

    this.calculateMove(this.outputOx.thumbs[1].ox, 1);
    if (this.isRange) {
        this.calculateMove(this.outputOx.thumbs[0].ox, 0);
    }
}
SliderModel.prototype.calculateMove = function calculateMove(ox, id) {
    const viewStep = (this.offsetWidth) * this.sliderProps[id].sliderStep / (this.sliderProps[1].sliderMax - this.sliderProps[0].sliderMin);
    ox = Math.round(ox / viewStep) * viewStep;
    console.log('------------------');
    console.log(ox);
    
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
        if (this.sliderRange[id] == 0) {
            this.currentValue[id] = this.sliderProps[id].sliderMax;
        } else {
            this.currentValue[id] = this.sliderProps[id].sliderMax - this.sliderRange[id] / (this.offsetWidth - this.sliderProps[id].offsetRight - this.sliderProps[id].offsetLeft) * (ox - this.sliderProps[id].offsetLeft);
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
        if (this.sliderRange[id] == 0) {
            this.currentValue[id] = this.sliderProps[id].sliderMax;
        } else {
            this.currentValue[id] = this.sliderProps[id].sliderMax +  this.sliderRange[id] / (this.offsetWidth - this.sliderProps[id].offsetRight - this.sliderProps[id].offsetLeft) * (ox - this.offsetWidth + this.sliderProps[id].offsetRight);
            // this.currentValue[id] = Math.round(this.currentValue[id] / 10**(this.stepDegree)) * 10**(this.stepDegree); //округление до степени шага
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
                end: this.outputOx.thumbs[0].ox
            }
        } else {
            this.outputOx.track = {
                begin: this.outputOx.thumbs[0].ox,
                end: this.outputOx.thumbs[1].ox
            }
        }
    } else {
        if (this.isVertical) {
            this.outputOx.track = {
                begin: ox,
                end: this.offsetWidth
            }
        } else {
            this.outputOx.track = {
                begin: 0,
                end: ox
            }
        }
    }
};
SliderModel.prototype.calculateIndex = function calculateIndex(ox) {
    if (this.isRange) {
        const currOutput = [];
        const delta = [];
        currOutput[0] = this.outputOx.thumbs[0].ox;
        currOutput[1] = this.outputOx.thumbs[1].ox;
        delta[0] = Math.abs(currOutput[0] - ox);
        delta[1] = Math.abs(currOutput[1] - ox);
        return delta.indexOf(Math.min(...delta))
    }
    return 1
}

export default SliderModel;