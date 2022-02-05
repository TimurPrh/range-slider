import Labels from './subViews/labels';
import Scale from './subViews/scale';
import Track from './subViews/track';
import Inputs from './subViews/inputs';
import Thumbs from './subViews/thumbs';
import Border from './subViews/border';

const SliderView = function SliderView($elem) {
    this.$elem = $elem;
    this.render();

    this.borderModule = new Border(this.$slider);
    this.trackModule = new Track(this.$slider);
    this.thumbsModule = new Thumbs(this.$slider);
    this.labelsModule = new Labels(this.$slider);
    this.scaleModule = new Scale(this.$slider);
    this.inputsModule = new Inputs(this.$slider);

    this.onClickBg = null;
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

    if (isVertical) {
        this.$slider.addClass('range-slider__wrapper_vertical');
    } else {
        this.$slider.removeClass('range-slider__wrapper_vertical');
    }

    this.removeSubViews();

    this.offsetWidth = this.$slider.width();
    this.offsetHeight = this.$slider.height();

    this.trackModule.render(bar);
    this.borderModule.render();
    this.thumbsModule.render(isRange);
    this.labelsModule.render(isVertical);
    this.inputsModule.render(viewModel);
    this.scaleModule.render(scale, isVertical, viewModel, stepDegree, this.offsetWidth, this.offsetHeight);

    this.$rangeSlider.on('mousedown', this.onClickBg);
    this.$rangeSlider.on('touchstart', this.onClickBg);
};
SliderView.prototype.moveAt = function moveAt(obj: { thumbs: [{ ox: number, value: number }]; track: {begin: number, end: number}; }, id: number) {
    const thumbOx = obj.thumbs[id].ox;
    const thumbValue = obj.thumbs[id].value;
    const trackOx = obj.track;

    this.trackModule.change(trackOx.begin, trackOx.end, this.isVertical);
    let inputVal: number;
    if (this.isRange || id === 1) {
        inputVal = this.inputsModule.change(thumbValue, id);
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
SliderView.prototype.removeSubViews = function removeSubViews() {
    this.borderModule.remove();
    this.trackModule.remove();
    this.thumbsModule.remove();
    this.labelsModule.remove();
    this.scaleModule.remove();
    this.inputsModule.remove();
};

export default SliderView;
