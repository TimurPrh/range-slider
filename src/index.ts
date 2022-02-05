import $ from "jquery";
import './slider-plugin/index';
import Panel from './panel/panel';
import './styles/style.scss';

const $rangeSliders = [];
const panels = [];

const $rangeSliderWrappers = $('.js-main__slider');
const panelWrappers = document.querySelectorAll('.js-main__panel');

const sliderSettings = [
    {
        range: true, vertical: false, scale: true, tip: true, bar: false, min: 0, max: 100, step: 10, from: 20, to: 40,
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

panelWrappers.forEach((panelWrapper, i) => {
    $rangeSliders[i] = $rangeSliderWrappers.eq(i).slider(sliderSettings[i]);
    const settingsFromSlider = $rangeSliderWrappers.eq(i).slider('getSettings');
    panels[i] = new Panel(panelWrapper, settingsFromSlider);

    function fromAndToValuesHandler(e: CustomEvent, { inputVal, id }) {
        if (id === 0) {
            panels[i].changeFromValue(inputVal);
        } else if (id === 1) {
            panels[i].changeToValue(inputVal);
        }
    }
    $rangeSliderWrappers.eq(i).on('moveThumbEvent', fromAndToValuesHandler.bind(this));

    function configurationHandler(e: CustomEvent) {
        const obj = {};
        obj[e.detail.key] = e.detail.value;

        if (e.detail.key === 'to') {
            $rangeSliderWrappers.eq(i).slider('setToValue', e.detail.value);
        } else if (e.detail.key === 'from') {
            $rangeSliderWrappers.eq(i).slider('setFromValue', e.detail.value);
        } else {
            $rangeSliderWrappers.eq(i).slider('reInit', obj);
        }

        const realSettings = $rangeSliderWrappers.eq(i).slider('getSettings');
        panels[i].changeFromValue(realSettings.from);
        panels[i].changeToValue(realSettings.to);
    }
    panelWrapper.addEventListener('changedInputEvent', configurationHandler.bind(this));
});
