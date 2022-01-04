import SliderView from './view';
import SliderModel from './model';
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
    this.sliderView = new SliderView(elem);
    this.sliderModel = new SliderModel();
    this.sliderController = new SliderController(this.sliderView, this.sliderModel);
    this.sliderController.initialize(settings);
};
RangeSlider.prototype.getSettings = function getSettings() {
    return this.sliderController.getSettings();
};
RangeSlider.prototype.reInitialize = function reInitialize(settings: sliderSettings) {
    this.sliderController.reInitialize(settings);
};

export default RangeSlider;
