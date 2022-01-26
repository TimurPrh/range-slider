import SliderController from './controller';

import './style.scss';

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

const RangeSlider = function RangeSlider(elem: Element, settings: sliderSettings) {
    this.sliderController = new SliderController(elem);
    this.sliderController.initialize(settings);
};
RangeSlider.prototype.getSettings = function getSettings() {
    return this.sliderController.getSettings();
};
RangeSlider.prototype.reInitialize = function reInitialize(settings: sliderSettings) {
    this.sliderController.reInitialize(settings);
};
RangeSlider.prototype.setToValue = function setToValue(val: number) {
    this.sliderController.setToValue(val);
};
RangeSlider.prototype.setFromValue = function setFromValue(val: number) {
    this.sliderController.setFromValue(val);
};

export default RangeSlider;
