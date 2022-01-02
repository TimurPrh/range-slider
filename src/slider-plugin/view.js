const SliderView = function SliderView(elem) {
    this.elem = elem;
    this.render(elem);
    
    this.onMoveThumb = null;
    this.onClickBg = null;
}
SliderView.prototype.render = function render(elem) {
    const sliderElement = document.createElement('div');
    sliderElement.classList.add('range-slider');
    sliderElement.innerHTML = `<div class="range-slider__outer">
                                    <div class="range-slider__wrapper">
                                        <label class="range-slider__result" for='a' data-id="0"></label>
                                        <label class="range-slider__result" for='b' data-id="1"></label>
                                        <div class="range-slider__range-bg"></div>
                                        <div class="range-slider__thumb" data-id="0"></div>
                                        <div class="range-slider__thumb" data-id="1"></div>
                                        <input id="a" class="range-slider__input" type="range">
                                        <input id="b" class="range-slider__input" type="range">
                                    </div>
                                </div>`
    elem.append(sliderElement);

    this.rangeSlider = elem.querySelector('.range-slider');
    this.labels = this.rangeSlider.querySelectorAll('label');
    this.slider = this.rangeSlider.querySelector('.range-slider__wrapper');
    this.thumbs = this.rangeSlider.querySelectorAll('.range-slider__thumb');
    this.track = this.rangeSlider.querySelector('.range-slider__range-bg');
    this.sliderInputs = this.rangeSlider.querySelectorAll('input');
}
SliderView.prototype.initParams = function initParams(viewModel, isVertical, isRange, scale, tip, bar, stepDegree) {
    this.isVertical = isVertical;
    this.isRange = isRange;
    this.scale = scale;
    this.tip = tip;
    this.bar = bar;

    if (isVertical) {
        this.slider.classList.add('range-slider__wrapper_vertical');
    }

    this.offsetWidth = this.slider.offsetWidth;
    this.offsetHeight = this.slider.offsetHeight;

    if (scale) {
        if (isVertical) {
            const scaleElement = document.createElement('ul');
            scaleElement.classList.add('range-slider__scale', 'range-slider__scale_vertical');
            const stepCount = Math.floor((viewModel[0].sliderMax - viewModel[0].sliderMin) / viewModel[0].sliderStep) + 1;
            const stepHeight = this.offsetHeight / (stepCount - 1);
            let stepValue = viewModel[0].sliderMax;
            for (let i = 0; i < stepCount; i++) {
                scaleElement.innerHTML += `<li>${stepValue}</li>`;
                stepValue = this.roundValue((stepValue - viewModel[0].sliderStep), stepDegree);
            }
            scaleElement.style.gridTemplateRows = `repeat(${stepCount}, ${stepHeight}px)`;
            this.slider.parentNode.style.display = 'flex';
            this.slider.parentNode.append(scaleElement); 
        } else {
            const scaleElement = document.createElement('ul');
            scaleElement.classList.add('range-slider__scale');
            const stepCount = Math.floor((viewModel[0].sliderMax - viewModel[0].sliderMin) / viewModel[0].sliderStep) + 1;
            const stepWidth = this.offsetWidth / (stepCount - 1);
            let stepValue = viewModel[0].sliderMin;
            for (let i = 0; i < stepCount; i++) {
                scaleElement.innerHTML += `<li>${stepValue}</li>`;
                // stepValue += viewModel[0].sliderStep;
                stepValue = this.roundValue((stepValue + viewModel[0].sliderStep), stepDegree);
            }
            scaleElement.style.gridTemplateColumns = `repeat(${stepCount}, ${stepWidth}px)`;
            this.slider.parentNode.append(scaleElement);
        }
    }
    
    if (!isRange) {
        this.thumbs[0].style.display = 'none';
        this.labels[0].style.display = 'none';
    } else {
        this.thumbs[0].style.display = 'block';
        this.labels[0].style.display = 'block';
    }

    if (!bar) {
        this.track.style.display = 'none';
    } else {
        this.track.style.display = 'block';
    }
    
    viewModel.forEach((model, id) => {
        this.sliderInputs[id].min = model.sliderMin;
        this.sliderInputs[id].max = model.sliderMax;
        this.sliderInputs[id].step = model.sliderStep;
    });
}
SliderView.prototype.initEventListener = function initEventListener() {
    this.isRange ? this.thumbs.forEach(thumb => thumb.addEventListener('mousedown', this.onMoveThumb)) : this.thumbs[1].addEventListener('mousedown', this.onMoveThumb);
    
    this.slider.addEventListener('mousedown', this.onClickBg);
}
SliderView.prototype.moveAt = function moveAt(obj, id) {
    const numberChangedEvent = new CustomEvent('moveThumbEvent', {
        detail: {
            obj: obj, 
            id: id
        }
    });
    this.elem.dispatchEvent(numberChangedEvent);

    const thumbOx = obj.thumbs[id].ox;
    const thumbValue = obj.thumbs[id].value;
    const trackOx = obj.track;

    console.log(obj.thumbs, id);
    console.log(`moveAt --- ${thumbOx}`);

    this.renderTrack(trackOx.begin, trackOx.end);
    this.updateInputValue(thumbValue, id);

    if (this.isVertical) {
        this.thumbs[id].style.top = `${thumbOx}px`;
        if (this.tip) {
            this.labels[id].style.display = 'block';
            this.labels[id].style.top = `${thumbOx}px`;
            this.labels[id].style.marginLeft = `-${this.labels[id].offsetWidth + 10}px`;
        } else {
            this.labels[id].style.display = 'none';
        }
    } else {
        this.thumbs[id].style.left = `${thumbOx}px`;
        if (this.tip) {
            this.labels[id].style.display = 'block';
            this.labels[id].style.left = `${thumbOx}px`;
        } else {
            this.labels[id].style.display = 'none';
        }
    }
}
SliderView.prototype.renderTrack = function renderTrack(begin, end) {
    this.isVertical ? this.track.style.marginTop = `${begin}px` : this.track.style.marginLeft = `${begin}px`;
    this.isVertical ? this.track.style.height = `${end - begin}px` : this.track.style.width = `${end - begin}px`;
}
SliderView.prototype.updateInputValue = function updateInputValue(val, id) {
    this.sliderInputs[id].value = val;
    console.log(`input value --- ${val} , ${id}`);
    this.updateLabel(this.sliderInputs[id].value, id);
}
SliderView.prototype.updateLabel = function updateLabel(str, id) {
    this.labels[id].innerHTML = str;
}
SliderView.prototype.roundValue = function roundValue(val, deg) {
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

export default SliderView;