const SliderView = function SliderView(elem: Element) {
    this.elem = elem;
    this.render(elem);

    this.onMoveThumb = null;
    this.onClickBg = null;
};
SliderView.prototype.render = function render(elem: Element) {
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
                                </div>`;
    elem.append(sliderElement);

    this.rangeSlider = elem.querySelector('.range-slider');
    this.labels = this.rangeSlider.querySelectorAll('label');
    this.slider = this.rangeSlider.querySelector('.range-slider__wrapper');
    this.thumbs = this.rangeSlider.querySelectorAll('.range-slider__thumb');
    this.track = this.rangeSlider.querySelector('.range-slider__range-bg');
    this.sliderInputs = this.rangeSlider.querySelectorAll('input');
};
SliderView.prototype.initParams = function initParams(viewModel: [{sliderMin: number, sliderMax: number, sliderStep: number}], isVertical: boolean, isRange: boolean, scale: boolean, tip: boolean, bar: boolean, stepDegree: number) {
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

    viewModel.forEach((model: { sliderMin: number; sliderMax: number; sliderStep: number; }, id: number) => {
        this.sliderInputs[id].min = model.sliderMin;
        this.sliderInputs[id].max = model.sliderMax;
        this.sliderInputs[id].step = model.sliderStep;
    });
};
SliderView.prototype.initEventListener = function initEventListener() {
    if (this.isRange) {
        this.thumbs.forEach((thumb: HTMLElement) => thumb.addEventListener('mousedown', this.onMoveThumb));
    } else {
        this.thumbs[1].addEventListener('mousedown', this.onMoveThumb);
    }

    this.slider.addEventListener('mousedown', this.onClickBg);
};
SliderView.prototype.moveAt = function moveAt(obj: { thumbs: [{ ox: number, value: number }]; track: {begin: number, end: number}; }, id: number) {
    const numberChangedEvent = new CustomEvent('moveThumbEvent', {
        detail: {
            obj,
            id,
        },
    });
    this.elem.dispatchEvent(numberChangedEvent);

    const thumbOx = obj.thumbs[id].ox;
    const thumbValue = obj.thumbs[id].value;
    const trackOx = obj.track;

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
};
SliderView.prototype.renderTrack = function renderTrack(begin: number, end: number) {
    if (this.isVertical) {
        this.track.style.marginTop = `${begin}px`;
        this.track.style.height = `${end - begin}px`;
    } else {
        this.track.style.marginLeft = `${begin}px`;
        this.track.style.width = `${end - begin}px`;
    }
};
SliderView.prototype.updateInputValue = function updateInputValue(val: number, id: string | number) {
    this.sliderInputs[id].value = val;
    this.updateLabel(this.sliderInputs[id].value, id);
};
SliderView.prototype.updateLabel = function updateLabel(str: number, id: string | number) {
    this.labels[id].innerHTML = str;
};
SliderView.prototype.roundValue = function roundValue(val: number, deg: number) {
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

export default SliderView;
