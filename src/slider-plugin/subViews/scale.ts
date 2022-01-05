interface settings {
    sliderMin: number,
    sliderMax: number,
    sliderStep: number
}

const Scale = function Scale(elem: HTMLElement) {
    this.elem = elem;
};
Scale.prototype.render = function render(scale: boolean, vertical: boolean, viewModel: settings, stepDegree: number, offsetWidth: number, offsetHeight: number) {
    if (scale) {
        if (vertical) {
            const scaleElement = document.createElement('ul');
            scaleElement.classList.add('range-slider__scale', 'range-slider__scale_vertical');
            const stepCount = Math.floor((viewModel.sliderMax - viewModel.sliderMin) / viewModel.sliderStep) + 1;
            const stepHeight = offsetHeight / (stepCount - 1);
            let stepValue = viewModel.sliderMax;
            for (let i = 0; i < stepCount; i++) {
                scaleElement.innerHTML += `<li>${stepValue}</li>`;
                stepValue = this.roundValue((stepValue - viewModel.sliderStep), stepDegree);
            }
            scaleElement.style.gridTemplateRows = `repeat(${stepCount}, ${stepHeight}px)`;
            this.elem.parentNode.style.display = 'flex';
            this.elem.parentNode.prepend(scaleElement);
        } else {
            const scaleElement = document.createElement('ul');
            scaleElement.classList.add('range-slider__scale');
            const stepCount = Math.floor((viewModel.sliderMax - viewModel.sliderMin) / viewModel.sliderStep) + 1;
            const stepWidth = offsetWidth / (stepCount - 1);
            let stepValue = viewModel.sliderMin;
            for (let i = 0; i < stepCount; i++) {
                scaleElement.innerHTML += `<li>${stepValue}</li>`;
                stepValue = this.roundValue((stepValue + viewModel.sliderStep), stepDegree);
            }
            scaleElement.style.gridTemplateColumns = `repeat(${stepCount}, ${stepWidth}px)`;
            this.elem.parentNode.style.display = 'block';
            this.elem.parentNode.append(scaleElement);
        }
    }
};
Scale.prototype.roundValue = function roundValue(val: number, deg: number) {
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
Scale.prototype.remove = function remove() {
    if (this.elem.parentNode.querySelector('.range-slider__scale')) {
        this.elem.parentNode.querySelector('.range-slider__scale').remove();
    }
};

export default Scale;
