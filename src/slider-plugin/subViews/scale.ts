interface settings {
    sliderMin: number,
    sliderMax: number,
    sliderStep: number,
    oldStep: number,
}

const Scale = function Scale(elem: HTMLElement) {
    this.elem = elem;
};
Scale.prototype.render = function render(scale: boolean, vertical: boolean, viewModel: settings, stepDegree: number, offsetWidth: number, offsetHeight: number, oldStep: number) {
    if (scale) {
        this.stepDegree = stepDegree;
        if (vertical) {
            const scaleElement = document.createElement('ul');
            scaleElement.classList.add('range-slider__scale', 'range-slider__scale_vertical');
            let stepCount = Math.floor((viewModel.sliderMax - viewModel.sliderMin) / viewModel.sliderStep) + 1;
            if (stepCount > 200) {
                stepCount = 200;
            }
            const stepHeight = offsetHeight / ((viewModel.sliderMax - viewModel.sliderMin) / viewModel.sliderStep);
            let stepValue = this.roundValue(viewModel.sliderMin + viewModel.sliderStep * (stepCount - 1));
            for (let i = 0; i < stepCount; i++) {
                scaleElement.innerHTML += `<li>${stepValue}</li>`;
                stepValue = this.roundValue(stepValue - viewModel.sliderStep);
            }
            scaleElement.style.gridTemplateRows = `repeat(${stepCount}, ${stepHeight}px)`;
            scaleElement.style.marginTop = `${((offsetHeight / (stepCount - 1) - stepHeight) * (stepCount - 1))}px`;
            this.elem.parentNode.style.display = 'flex';
            this.elem.parentNode.prepend(scaleElement);

            let max = 0;
            scaleElement.childNodes.forEach((node) => {
                if (node.clientHeight > stepHeight) {
                    if (node.clientHeight > max) {
                        max = node.clientHeight;
                    }
                }
            });

            const viewModelMod = viewModel;
            if (!viewModel.oldStep) {
                viewModelMod.oldStep = viewModel.sliderStep;
            }
            let sliderMax: number;
            const der = this.isDivisible((viewModel.sliderMax - viewModel.sliderMin), viewModel.oldStep);
            if (!der) {
                sliderMax = this.roundValue(viewModel.sliderMin + (stepCount - 1) * viewModel.sliderStep);
            } else {
                sliderMax = viewModel.sliderMax;
            }
            if (max) {
                const stepPerm = this.findDer(viewModelMod.oldStep, (sliderMax - viewModel.sliderMin), (sliderMax - viewModel.sliderMin) / Math.trunc((stepHeight * stepCount) / max));
                viewModelMod.sliderStep = stepPerm;
                this.remove();
                this.render(scale, vertical, viewModelMod, stepDegree, offsetWidth, offsetHeight);
            }
            this.scaleElement = scaleElement;
        } else {
            const scaleElement = document.createElement('ul');
            scaleElement.classList.add('range-slider__scale');
            let stepCount = Math.floor((viewModel.sliderMax - viewModel.sliderMin) / viewModel.sliderStep) + 1;
            if (stepCount > 200) {
                stepCount = 200;
            }
            const stepWidth = offsetWidth / ((viewModel.sliderMax - viewModel.sliderMin) / viewModel.sliderStep);
            let stepValue = viewModel.sliderMin;
            for (let i = 0; i < stepCount; i++) {
                scaleElement.innerHTML += `<li>${stepValue}</li>`;
                stepValue = this.roundValue(stepValue + viewModel.sliderStep);
            }
            scaleElement.style.gridTemplateColumns = `repeat(${stepCount}, ${stepWidth}px)`;
            scaleElement.style.marginRight = `${((offsetWidth / (stepCount - 1) - stepWidth) * (stepCount - 1))}px`;
            this.elem.parentNode.style.display = 'block';
            this.elem.parentNode.append(scaleElement);

            let max = 0;
            scaleElement.childNodes.forEach((node) => {
                if (node.clientWidth > stepWidth) {
                    if (node.clientWidth > max) {
                        max = node.clientWidth;
                    }
                }
            });

            const viewModelMod = viewModel;
            if (!viewModel.oldStep) {
                viewModelMod.oldStep = viewModel.sliderStep;
            }
            let sliderMax: number;
            const der = this.isDivisible((viewModel.sliderMax - viewModel.sliderMin), viewModel.oldStep);
            if (!der) {
                sliderMax = this.roundValue(viewModel.sliderMin + (stepCount - 1) * viewModel.sliderStep);
            } else {
                sliderMax = viewModel.sliderMax;
            }

            if (max) {
                const stepPerm = this.findDer(viewModelMod.oldStep, (sliderMax - viewModel.sliderMin), (sliderMax - viewModel.sliderMin) / Math.trunc((stepWidth * stepCount) / max));
                viewModelMod.sliderStep = stepPerm;
                this.remove();
                this.render(scale, vertical, viewModelMod, stepDegree, offsetWidth, offsetHeight);
            }
            this.scaleElement = scaleElement;
        }
    }
};
Scale.prototype.findDer = function findDer(step: number, max: number, minRes: number) {
    let x = step;
    while ((x < minRes || !this.isDivisible(max, x)) && x < max) {
        if (x < minRes) {
            x = this.roundValue(Math.ceil(minRes / step) * step);
        } else {
            x = this.roundValue(step + x);
        }
    }
    return x;
};
Scale.prototype.isDivisible = function isDivisible(a: number, b: number) {
    return (a - b * Math.floor(a / b)) === 0;
};
Scale.prototype.roundValue = function roundValue(val: number) {
    const deg: number = this.stepDegree;
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
