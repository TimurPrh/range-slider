import RangeSlider from './slider-plugin/index';
import Panel from './panel/panel';
import './styles/style.scss';

const rangeSliderWrapper = document.querySelector('.js-main__slider');
const panelWrapper = document.querySelector('.js-main__panel');

const rangeSlider = new RangeSlider(rangeSliderWrapper, {
    range: true,
    vertical: false,
    scale: true,
    tip: true,
    bar: true,
    min: 0,
    max: 100,
    step: 10,
    from: 20,
    to: 40,
});
const panel = new Panel(panelWrapper, rangeSlider.getSettings());

function fromAndToValuesHandler(e: CustomEvent) {
    if (e.detail.id === 0) {
        panel.changeFromValue(e.detail.inputVal);
    } else if (e.detail.id === 1) {
        panel.changeToValue(e.detail.inputVal);
    }
}
rangeSliderWrapper.addEventListener('moveThumbEvent', fromAndToValuesHandler.bind(this));

function configurationHandler(e: CustomEvent) {
    const obj = {};
    obj[e.detail.key] = e.detail.value;

    if (e.detail.key === 'to') {
        rangeSlider.setToValue(e.detail.value);
    } else if (e.detail.key === 'from') {
        rangeSlider.setFromValue(e.detail.value);
    } else {
        rangeSlider.reInitialize(obj);
    }

    const realSettings = rangeSlider.getSettings();
    panel.changeFromValue(realSettings.from);
    panel.changeToValue(realSettings.to);
}
panelWrapper.addEventListener('changedInputEvent', configurationHandler.bind(this));
