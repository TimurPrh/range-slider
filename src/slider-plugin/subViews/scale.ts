interface settings {
    sliderMin: number,
    sliderMax: number,
    sliderStep: number,
    oldStep: number,
}

const Scale = function Scale($elem: JQuery<HTMLElement>) {
  this.$elem = $elem;
};
Scale.prototype.render = function render(scale: boolean, vertical: boolean, viewModel: settings, stepDegree: number, offsetWidth: number, offsetHeight: number) {
  if (scale) {
    this.stepDegree = stepDegree;
    this.vertical = vertical;
    this.offsetWidth = offsetWidth;
    this.offsetHeight = offsetHeight;
    if (vertical) {
      this.renderVerticalScale(viewModel, offsetHeight);
    } else {
      this.renderHorizontalScale(viewModel, offsetWidth);
    }
  }
};
Scale.prototype.renderVerticalScale = function renderVerticalScale(viewModel: settings, offsetHeight: number) {
  const scaleElement = document.createElement('ul');
  scaleElement.classList.add('range-slider__scale', 'range-slider__scale_vertical');
  let stepCount = Math.floor((viewModel.sliderMax - viewModel.sliderMin) / viewModel.sliderStep) + 1;
  if (stepCount > 200) {
    stepCount = 200;
  }
  this.stepCount = stepCount;
  this.stepWidth = offsetHeight / ((viewModel.sliderMax - viewModel.sliderMin) / viewModel.sliderStep);
  let stepValue = this.roundValue(viewModel.sliderMin + viewModel.sliderStep * (stepCount - 1));
  for (let i = 0; i < stepCount; i++) {
    scaleElement.innerHTML += `<li>${stepValue}</li>`;
    stepValue = this.roundValue(stepValue - viewModel.sliderStep);
  }
  scaleElement.style.gridTemplateRows = `repeat(${stepCount}, ${(this.stepWidth * 100) / offsetHeight}%)`;
  const scaleTop = ((offsetHeight / (stepCount - 1) - this.stepWidth) * (stepCount - 1)) / 2;
  scaleElement.style.top = `${(scaleTop * 100) / offsetHeight}%`;
  this.$elem.parent().css('display', 'flex');
  this.$elem.parent().prepend(scaleElement);

  this.scaleElement = scaleElement;

  this.checkCapacity('clientHeight', viewModel);
};
Scale.prototype.renderHorizontalScale = function renderHorizontalScale(viewModel: settings, offsetWidth: number) {
  const scaleElement = document.createElement('ul');
  scaleElement.classList.add('range-slider__scale');
  let stepCount = Math.floor((viewModel.sliderMax - viewModel.sliderMin) / viewModel.sliderStep) + 1;
  if (stepCount > 200) {
    stepCount = 200;
  }
  this.stepCount = stepCount;
  this.stepWidth = offsetWidth / ((viewModel.sliderMax - viewModel.sliderMin) / viewModel.sliderStep);
  let stepValue = viewModel.sliderMin;
  for (let i = 0; i < stepCount; i++) {
    scaleElement.innerHTML += `<li>${stepValue}</li>`;
    stepValue = this.roundValue(stepValue + viewModel.sliderStep);
  }
  scaleElement.style.gridTemplateColumns = `repeat(${stepCount}, ${100 / (stepCount - 1)}%)`;
  const scaleMarginRight = ((offsetWidth / (stepCount - 1) - this.stepWidth) * (stepCount - 1));
  scaleElement.style.marginRight = `${(scaleMarginRight * 100) / offsetWidth}%`;
  this.$elem.parent().css('display', 'block');
  this.$elem.parent().append(scaleElement);

  this.scaleElement = scaleElement;

  this.checkCapacity('clientWidth', viewModel);
};
Scale.prototype.checkCapacity = function checkCapacity(dim: string, viewModel: settings) {
  const {
    stepWidth, stepCount, scaleElement, stepDegree, vertical, offsetWidth, offsetHeight,
  } = this;
  let max = 0;
  scaleElement.childNodes.forEach((node: HTMLElement) => {
    const nodeSize = node[dim];
    if (nodeSize > stepWidth) {
      if (nodeSize > max) {
        max = nodeSize;
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
    this.render(true, vertical, viewModelMod, stepDegree, offsetWidth, offsetHeight);
  }
};
Scale.prototype.findDer = function findDer(step: number, max: number, minRes: number) {
  const isNotFoundedDivisibleX = (x: number, minResCondition: number, maxCondition: number) => (x < minResCondition || !this.isDivisible(maxCondition, x)) && x < maxCondition;

  let x = step;
  while (isNotFoundedDivisibleX(x, minRes, max)) {
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
  this.$elem.parent().find('.range-slider__scale').remove();
};

export default Scale;
