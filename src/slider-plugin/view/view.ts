import Labels from '../subViews/labels';
import Scale from '../subViews/scale';
import Track from '../subViews/track';
import Inputs from '../subViews/inputs';
import Thumbs from '../subViews/thumbs';
import Border from '../subViews/border';

const SliderView = function SliderView($elem: JQuery<HTMLElement>) {
  this.$elem = $elem;
  this.render();

  this.borderModule = new Border(this.$slider);
  this.trackModule = new Track(this.$slider);
  this.thumbsModule = new Thumbs(this.$slider);
  this.labelsModule = new Labels(this.$slider);
  this.scaleModule = new Scale(this.$slider);
  this.inputsModule = new Inputs(this.$slider);

  this.thumbsModule.onMoveThumb = this.onMoveThumb.bind(this);

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
  this.valueForInputTag = [];
};
SliderView.prototype.render = function render() {
  const sliderElement = document.createElement('div');
  sliderElement.classList.add('range-slider');
  sliderElement.innerHTML = `<div class="range-slider__outer">
                                    <div class="range-slider__wrapper"></div>
                                </div>`;
  this.$elem.append(sliderElement);

  this.$rangeSlider = this.$elem.find('.range-slider');
  this.$slider = this.$rangeSlider.find('.range-slider__wrapper');
};
SliderView.prototype.initParams = function initParams(viewModel: {sliderMin: number, sliderMax: number, sliderStep: number}, isVertical: boolean, isRange: boolean, scale: boolean, tip: boolean, bar: boolean, stepDegree: number) {
  this.isVertical = isVertical;
  this.isRange = isRange;
  this.scale = scale;
  this.tip = tip;
  this.bar = bar;
  this.initialMin = viewModel.sliderMin;
  this.initialMax = viewModel.sliderMax;
  this.initialStep = viewModel.sliderStep;
  this.sliderProps = [{
    sliderMin: viewModel.sliderMin,
    sliderMax: viewModel.sliderMax,
    sliderStep: viewModel.sliderStep,
    offsetLeft: 0,
    offsetRight: 0,
  },
  {
    sliderMin: viewModel.sliderMin,
    sliderMax: viewModel.sliderMax,
    sliderStep: viewModel.sliderStep,
    offsetLeft: 0,
    offsetRight: 0,
  }];
  this.stepDegree = stepDegree;

  if (isVertical) {
    this.$slider.addClass('range-slider__wrapper_vertical');
  } else {
    this.$slider.removeClass('range-slider__wrapper_vertical');
  }

  this.removeSubViews();

  this.offsetWidth = this.getSliderWidth();

  this.width = this.$slider.width();
  this.height = this.$slider.height();

  this.trackModule.render(bar);
  this.borderModule.render();
  this.thumbsModule.render(isRange);
  this.labelsModule.render(isVertical);
  this.inputsModule.render(viewModel);
  this.scaleModule.render(scale, isVertical, viewModel, stepDegree, this.width, this.height);

  this.$rangeSlider.on('mousedown', this.onClickBg.bind(this));
  this.$rangeSlider.on('touchstart', this.onClickBg.bind(this));
};
SliderView.prototype.setWidth = function setWidth(currentValue: number[]) {
  this.offsetWidthOld = this.offsetWidth;
  this.offsetWidth = this.getSliderWidth();
  if (this.offsetWidthOld === 0 && this.offsetWidth !== 0) {
    this.setOutputOx(currentValue, 1);
    if (this.isRange) {
      this.setOutputOx(currentValue, 0);
    }
  }
};
SliderView.prototype.setOutputOx = function setOutputOx(currentValue: number[], id: number) {
  if (this.isVertical) {
    for (let i: number = 0; i < this.outputOx.thumbs.length; i++) {
      this.outputOx.thumbs[i].ox = (100 * Math.round(((currentValue[i] - this.initialMax) * this.offsetWidth) / (this.initialMin - this.initialMax))) / this.offsetWidth;
      this.outputOx.thumbs[i].value = currentValue[i];
    }
  } else {
    for (let i: number = 0; i < this.outputOx.thumbs.length; i++) {
      this.outputOx.thumbs[i].ox = (100 * Math.round(((currentValue[i] - this.initialMin) * this.offsetWidth) / (this.initialMax - this.initialMin))) / this.offsetWidth;
      this.outputOx.thumbs[i].value = currentValue[i];
    }
  }

  this.calculateTrack();

  this.moveAt(this.outputOx, id);
};
SliderView.prototype.moveAt = function moveAt(obj: { thumbs: [{ ox: number, value: number }]; track: {begin: number, end: number}; }, id: number) {
  const thumbOx = obj.thumbs[id].ox;
  const thumbValue = obj.thumbs[id].value;
  const trackOx = obj.track;

  this.trackModule.change(trackOx.begin, trackOx.end, this.isVertical);
  let inputVal: number;
  if (this.isRange || id === 1) {
    inputVal = parseFloat(this.inputsModule.change(thumbValue, id));
    const labelsOffsetLeft = Math.max(this.trackModule.$track.width() / 2, this.thumbsModule.$thumbs.eq(1).width() / 2);
    this.labelsModule.change(id, thumbOx, labelsOffsetLeft, inputVal, this.isVertical, this.tip);
    this.thumbsModule.change(id, thumbOx, this.isVertical);
  }

  this.$elem.trigger('moveThumbEvent', { inputVal, id });
};
SliderView.prototype.getSliderWidth = function getSliderWidth() {
  if (this.isVertical) {
    return this.$slider.height();
  }
  return this.$slider.width();
};
SliderView.prototype.calculateMove = function calculateMove(pos: number, id: number) {
  const maxSteps = Math.floor((this.initialMax - this.initialMin) / this.initialStep);
  const viewStep = ((this.offsetWidth) * this.initialStep) / (this.initialMax - this.initialMin);
  let ox: number;

  if (this.isVertical) {
    ox = this.calculateThumbsObjectVertical(pos, viewStep, maxSteps, id);
  } else {
    ox = this.calculateThumbsObjectHorizontal(pos, viewStep, maxSteps, id);
  }

  ox = (ox * 100) / this.offsetWidth;

  this.outputOx.thumbs[id].ox = ox;
  this.outputOx.thumbs[id].value = this.valueForInputTag[id];

  this.calculateTrack();
};
SliderView.prototype.calculateThumbsObjectVertical = function calculateThumbsObjectVertical(pos: number, viewStep: number, maxSteps: number, id: number) {
  let ox: number;

  const offsetLeft = this.offsetWidth - viewStep * maxSteps;
  const x0 = (pos - offsetLeft) / viewStep - 1 / 2;
  if (x0 < 0) {
    ox = offsetLeft;
  } else {
    ox = Math.ceil(x0) * viewStep + offsetLeft;
  }
  this.sliderProps[0].sliderMax = this.outputOx.thumbs[1].value - this.sliderProps[1].sliderStep;
  this.sliderProps[0].offsetLeft = (this.outputOx.thumbs[1].ox * this.offsetWidth) / 100 + viewStep;

  if (this.isRange) {
    this.sliderProps[1].sliderMin = this.outputOx.thumbs[0].value + this.sliderProps[0].sliderStep;
    this.sliderProps[1].offsetRight = this.offsetWidth - (this.outputOx.thumbs[0].ox * this.offsetWidth) / 100 + viewStep;
  } else {
    this.sliderProps[1].offsetRight = 0;
  }

  this.sliderRange[id] = this.sliderProps[id].sliderMax - this.sliderProps[id].sliderMin;
  if (this.sliderRange[id] === 0) {
    this.valueForInputTag[id] = this.sliderProps[id].sliderMax;
  } else {
    this.valueForInputTag[id] = this.sliderProps[id].sliderMax - (this.sliderRange[id] / (this.offsetWidth - this.sliderProps[id].offsetRight - this.sliderProps[id].offsetLeft)) * (ox - this.sliderProps[id].offsetLeft);
    this.valueForInputTag[id] = this.roundValue(this.valueForInputTag[id]);
  }

  if (ox < this.sliderProps[id].offsetLeft) {
    ox = this.sliderProps[id].offsetLeft;
    this.valueForInputTag[id] = this.sliderProps[id].sliderMax;
  } else if (ox > this.offsetWidth - this.sliderProps[id].offsetRight) {
    ox = this.offsetWidth - this.sliderProps[id].offsetRight;
    this.valueForInputTag[id] = this.sliderProps[id].sliderMin;
  }

  return ox;
};
SliderView.prototype.calculateThumbsObjectHorizontal = function calculateThumbsObjectHorizontal(pos: number, viewStep: number, maxSteps: number, id: number) {
  let ox: number;

  const x0 = (pos - viewStep / 2) / viewStep;
  if (x0 < 0) {
    ox = 0;
  } else if (x0 > (maxSteps - 1)) {
    ox = maxSteps * viewStep;
  } else {
    ox = Math.ceil(x0) * viewStep;
  }

  this.sliderProps[0].sliderMax = this.outputOx.thumbs[1].value - this.sliderProps[1].sliderStep;
  this.sliderProps[0].offsetRight = this.offsetWidth - (this.outputOx.thumbs[1].ox * this.offsetWidth) / 100 + viewStep;

  if (this.isRange) {
    this.sliderProps[1].sliderMin = this.outputOx.thumbs[0].value + this.sliderProps[0].sliderStep;
    this.sliderProps[1].offsetLeft = (this.outputOx.thumbs[0].ox * this.offsetWidth) / 100 + viewStep;
  } else {
    this.sliderProps[1].offsetLeft = 0;
  }

  this.sliderRange[id] = this.sliderProps[id].sliderMax - this.sliderProps[id].sliderMin;
  if (this.sliderRange[id] === 0) {
    this.valueForInputTag[id] = this.sliderProps[id].sliderMax;
  } else {
    this.valueForInputTag[id] = this.sliderProps[id].sliderMax + (this.sliderRange[id] / (this.offsetWidth - this.sliderProps[id].offsetRight - this.sliderProps[id].offsetLeft)) * (ox - this.offsetWidth + this.sliderProps[id].offsetRight);
    this.valueForInputTag[id] = this.roundValue(this.valueForInputTag[id]);
  }

  if (ox < this.sliderProps[id].offsetLeft) {
    ox = this.sliderProps[id].offsetLeft;
    this.valueForInputTag[id] = this.sliderProps[id].sliderMin;
  } else if (ox > this.offsetWidth - this.sliderProps[id].offsetRight) {
    ox = this.offsetWidth - this.sliderProps[id].offsetRight;
    this.valueForInputTag[id] = this.sliderProps[id].sliderMax;
  }

  return ox;
};
SliderView.prototype.calculateTrack = function calculateTrack() {
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
      begin: this.outputOx.thumbs[1].ox,
      end: 100,
    };
  } else {
    this.outputOx.track = {
      begin: 0,
      end: this.outputOx.thumbs[1].ox,
    };
  }
};
SliderView.prototype.onMoveThumb = function onMoveThumb(event: { cancelable?: any; preventDefault: any; target?: any; pageY?: any; pageX?: any; touches?: any; }) {
  if (event.cancelable) {
    event.preventDefault();
  }

  const moveForListener = (e: { preventDefault?: () => void; target?: any; pageY?: any; pageX?: any; touches?: any; }) => {
    if (e.target.classList.contains('range-slider__thumb')) {
      this.currentThumb = e.target;
    }

    const currentThumbId: number = parseInt(this.currentThumb.dataset.id, 10);
    let pageX: number;
    let pageY: number;
    if (e.touches) {
      pageX = e.touches[0].pageX;
      pageY = e.touches[0].pageY;
    } else {
      pageX = e.pageX;
      pageY = e.pageY;
    }

    if (this.isVertical) {
      this.calculateMove(pageY - this.$slider.offset().top, currentThumbId);
    } else {
      this.calculateMove(pageX - this.$slider.offset().left, currentThumbId);
    }

    this.moveAt(this.outputOx, currentThumbId);
  };

  moveForListener(event);
  const onMouseMove = (e: { preventDefault?: () => void; target?: any; pageY?: any; pageX?: any; }) => {
    moveForListener(e);
  };

  function handleOnMouseUp() {
    document.removeEventListener('mousemove', onMouseMove);
  }
  function handleOnTouchEnd() {
    document.removeEventListener('touchmove', onMouseMove);
    document.removeEventListener('mousemove', onMouseMove);
  }

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', handleOnMouseUp, { once: true });
  document.addEventListener('touchmove', onMouseMove);
  document.addEventListener('touchend', handleOnTouchEnd, { once: true });
};
SliderView.prototype.onClickBg = function onClickBg(event: { cancelable: boolean; preventDefault: () => void; target: { classList: any; nodeName: any; parentNode: any; innerHTML: string; }; originalEvent: {touches: { pageX: number; pageY: number; }}; pageX: number; pageY: number; }) {
  if (event.cancelable) {
    event.preventDefault();
  }

  const isClickableBackground = () => {
    const { classList, nodeName, parentNode } = event.target;
    return classList.contains('range-slider__range-bg') || classList.contains('range-slider__border') || classList.contains('range-slider__wrapper') || (nodeName === 'LI' && parentNode.classList.contains('range-slider__scale'));
  };

  if (isClickableBackground()) {
    let ox: number;
    let pageX: number;
    let pageY: number;
    if (event.originalEvent.touches) {
      pageX = event.originalEvent.touches[0].pageX;
      pageY = event.originalEvent.touches[0].pageY;
    } else {
      pageX = event.pageX;
      pageY = event.pageY;
    }

    if (this.isVertical) {
      ox = pageY - this.$slider.offset().top;
    } else {
      ox = pageX - this.$slider.offset().left;
    }
    const id = this.calculateIndex(ox);
    if (event.target.nodeName === 'LI') {
      const inputVal = +event.target.innerHTML;
      this.$elem.trigger('moveThumbEvent', { inputVal, id });
      this.$elem.trigger('needViewUpdateEvent', { id });
    } else {
      this.calculateMove(ox, id);
    }

    this.moveAt(this.outputOx, id);
  }
};
SliderView.prototype.removeSubViews = function removeSubViews() {
  this.borderModule.remove();
  this.trackModule.remove();
  this.thumbsModule.remove();
  this.labelsModule.remove();
  this.scaleModule.remove();
  this.inputsModule.remove();
};
SliderView.prototype.calculateIndex = function calculateIndex(ox: number) {
  if (this.isRange) {
    const currOutput: number[] = [];
    const delta: number[] = [];
    currOutput[0] = this.outputOx.thumbs[0].ox;
    currOutput[1] = this.outputOx.thumbs[1].ox;
    delta[0] = Math.abs(currOutput[0] - (ox * 100) / this.offsetWidth);
    delta[1] = Math.abs(currOutput[1] - (ox * 100) / this.offsetWidth);
    return delta.indexOf(Math.min(...delta));
  }
  return 1;
};
SliderView.prototype.roundValue = function roundValue(val: number) {
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

export default SliderView;
