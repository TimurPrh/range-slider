import RangeSlider from './slider-plugin/index';
import Panel from './panel/panel';
import './styles/style.scss';

const rangeSliders = [];
const panels = [];

const rangeSliderWrappers = document.querySelectorAll('.js-main__slider');
const panelWrappers = document.querySelectorAll('.js-main__panel');

const sliderSettings = [
    {
        range: true, vertical: false, scale: true, tip: true, bar: true, min: 0, max: 100, step: 10, from: 20, to: 40,
    },
    {
        range: true, vertical: false, scale: true, tip: true, bar: true, min: -1, max: 1, step: 0.1, from: -0.5, to: 0.5,
    },
    {
        range: false, vertical: true, scale: true, tip: true, bar: true, min: 0, max: 1000, step: 10, from: 200, to: 400,
    },
    {
        range: true, vertical: false, scale: true, tip: true, bar: true, min: 1000, max: 15000, step: 100, from: 2000, to: 4000,
    },
];

rangeSliderWrappers.forEach((rangeSliderWrapper, i) => {
    rangeSliders[i] = new RangeSlider(rangeSliderWrapper, sliderSettings[i]);
    panels[i] = new Panel(panelWrappers[i], rangeSliders[i].getSettings());

    function fromAndToValuesHandler(e: CustomEvent) {
        if (e.detail.id === 0) {
            panels[i].changeFromValue(e.detail.inputVal);
        } else if (e.detail.id === 1) {
            panels[i].changeToValue(e.detail.inputVal);
        }
    }
    rangeSliderWrapper.addEventListener('moveThumbEvent', fromAndToValuesHandler.bind(this));

    function configurationHandler(e: CustomEvent) {
        const obj = {};
        obj[e.detail.key] = e.detail.value;

        if (e.detail.key === 'to') {
            rangeSliders[i].setToValue(e.detail.value);
        } else if (e.detail.key === 'from') {
            rangeSliders[i].setFromValue(e.detail.value);
        } else {
            rangeSliders[i].reInitialize(obj);
        }

        const realSettings = rangeSliders[i].getSettings();
        panels[i].changeFromValue(realSettings.from);
        panels[i].changeToValue(realSettings.to);
    }
    panelWrappers[i].addEventListener('changedInputEvent', configurationHandler.bind(this));
});
