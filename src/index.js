import RangeSlider from './slider-plugin/index.js';
import Panel from './panel/panel.js';
import './styles/style.scss';

const rangeSliderWrapper = document.querySelector('.js-main__slider');
const panelWrapper = document.querySelector('.js-main__panel');

const rangeSlider = new RangeSlider(rangeSliderWrapper, {
    range: true,
    vertical: false,
    scale: true,
    tip: true,
    bar: true,
    min: -10,
    max: 100,
    step: 10,
    from: 0,
    to: 50
});
const panel = new Panel(panelWrapper, rangeSlider.getSettings());

rangeSliderWrapper.addEventListener('moveThumbEvent', function (e) {
    if (e.detail.id == 0) {
        panel.changeFromValue(e.detail.obj.thumbs[0].value);
    } else if (e.detail.id == 1) {
        panel.changeToValue(e.detail.obj.thumbs[1].value);
    }
});

panelWrapper.addEventListener('changedInputEvent', function (e) {
    const obj = {};
    obj[e.detail.key] = e.detail.value;

    rangeSlider.reInitialize(obj);
});