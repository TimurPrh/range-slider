import Labels from './subViews/labels';
import Scale from './subViews/scale';
import Track from './subViews/track';
import Inputs from './subViews/inputs';
import Thumbs from './subViews/thumbs';

const SliderView = function SliderView(elem: Element) {
    this.elem = elem;
    this.render();

    this.trackModule = new Track(this.slider);
    this.thumbsModule = new Thumbs(this.slider);
    this.labelsModule = new Labels(this.slider);
    this.scaleModule = new Scale(this.slider);
    this.inputsModule = new Inputs(this.slider);

    this.onClickBg = null;
};
SliderView.prototype.render = function render() {
    const sliderElement = document.createElement('div');
    sliderElement.classList.add('range-slider');
    sliderElement.innerHTML = `<div class="range-slider__outer">
                                    <div class="range-slider__wrapper"></div>
                                </div>`;
    this.elem.append(sliderElement);

    this.rangeSlider = this.elem.querySelector('.range-slider');
    this.slider = this.rangeSlider.querySelector('.range-slider__wrapper');
};
SliderView.prototype.initParams = function initParams(viewModel: {sliderMin: number, sliderMax: number, sliderStep: number}, isVertical: boolean, isRange: boolean, scale: boolean, tip: boolean, bar: boolean, stepDegree: number) {
    this.isVertical = isVertical;
    this.isRange = isRange;
    this.scale = scale;
    this.tip = tip;
    this.bar = bar;

    if (isVertical) {
        this.slider.classList.add('range-slider__wrapper_vertical');
    } else {
        this.slider.classList.remove('range-slider__wrapper_vertical');
    }

    this.removeSubViews();

    this.offsetWidth = this.slider.offsetWidth;
    this.offsetHeight = this.slider.offsetHeight;

    this.trackModule.render(bar);
    this.thumbsModule.render(isRange);
    this.labelsModule.render(isVertical);
    this.inputsModule.render(viewModel);
    this.scaleModule.render(scale, isVertical, viewModel, stepDegree, this.offsetWidth, this.offsetHeight);

    this.rangeSlider.addEventListener('mousedown', this.onClickBg);
};
SliderView.prototype.moveAt = function moveAt(obj: { thumbs: [{ ox: number, value: number }]; track: {begin: number, end: number}; }, id: number) {
    const thumbOx = obj.thumbs[id].ox;
    const thumbValue = obj.thumbs[id].value;
    const trackOx = obj.track;

    this.trackModule.change(trackOx.begin, trackOx.end, this.isVertical);
    let inputVal: number;
    if (this.isRange || id === 1) {
        inputVal = this.inputsModule.change(thumbValue, id);
        const labelsOffsetLeft = Math.max(this.trackModule.track.offsetWidth / 2, this.thumbsModule.thumbs[1].offsetWidth / 2);
        this.labelsModule.change(id, thumbOx, labelsOffsetLeft, inputVal, this.isVertical, this.tip);
        this.thumbsModule.change(id, thumbOx, this.isVertical);
    }

    const numberChangedEvent = new CustomEvent('moveThumbEvent', {
        detail: {
            inputVal,
            id,
        },
    });
    this.elem.dispatchEvent(numberChangedEvent);
};
SliderView.prototype.removeSubViews = function removeSubViews() {
    this.trackModule.remove();
    this.thumbsModule.remove();
    this.labelsModule.remove();
    this.scaleModule.remove();
    this.inputsModule.remove();
};

export default SliderView;
