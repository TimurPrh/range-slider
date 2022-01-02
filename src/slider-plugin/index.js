import SliderView from './view.js';
import SliderModel from './model.js';
import SliderController from './controller.js';

import './style.scss';

const RangeSlider = function RangeSlider(elem, settings) {
    this.sliderView = new SliderView(elem);
    this.sliderModel = new SliderModel();
    this.sliderController = new SliderController(this.sliderView, this.sliderModel);
    this.sliderController.initialize(settings);
}
RangeSlider.prototype.getSettings = function getSettings() {
    return this.sliderController.getSettings();
}
RangeSlider.prototype.reInitialize = function reInitialize(settings) {
    this.sliderController.reInitialize(settings);
}

export default RangeSlider;