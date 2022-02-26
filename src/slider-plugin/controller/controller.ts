import SliderView from "../view/view";
import SliderModel from "../model/model";

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

const SliderController = function SliderController(elem: JQuery<HTMLElement>) {
    this.sliderView = new SliderView(elem);
    this.sliderModel = new SliderModel();

    const handleMoveThumbEvent = (event: any, { inputVal, id }: {inputVal: number, id: number}) => {
        if (id === 0) {
            this.sliderModel.setSettings({ from: inputVal });
        } else if (id === 1) {
            this.sliderModel.setSettings({ to: inputVal });
        }
    };
    this.sliderView.$elem.on('moveThumbEvent', handleMoveThumbEvent);

    const handleNeedViewUpdateEvent = (event: any, { id }: { id: number }) => {
        this.sliderView.setOutputOx(this.sliderModel.currentValue, id);
    };
    this.sliderView.$elem.on('needViewUpdateEvent', handleNeedViewUpdateEvent);
};
SliderController.prototype.initialize = function initialize(settings: sliderSettings) {
    this.sliderModel.setInitialSettings(settings);

    this.setInitialState();
};
SliderController.prototype.getSettings = function getSettings() {
    return {
        range: this.sliderModel.isRange,
        vertical: this.sliderModel.isVertical,
        scale: this.sliderModel.viewScale,
        tip: this.sliderModel.viewTip,
        bar: this.sliderModel.viewBar,
        min: this.sliderModel.initialMin,
        max: this.sliderModel.initialMax,
        step: this.sliderModel.initialStep,
        from: parseFloat(this.sliderView.inputsModule.$inputs[0].value),
        to: parseFloat(this.sliderView.inputsModule.$inputs[1].value),
    };
};
SliderController.prototype.initView = function initView(props:{
        sliderMin: number,
        sliderMax: number,
        sliderStep: number,
    }) {
    this.sliderView.initParams(
        {
            sliderMin: props.sliderMin,
            sliderMax: props.sliderMax,
            sliderStep: props.sliderStep,
        },
        this.sliderModel.isVertical,
        this.sliderModel.isRange,
        this.sliderModel.viewScale,
        this.sliderModel.viewTip,
        this.sliderModel.viewBar,
        this.sliderModel.stepDegree,
    );
};
SliderController.prototype.setInitialState = function setInitialState() {
    this.sliderModel.initView(this.initView.bind(this));

    this.sliderModel.setInitialOutput();

    this.sliderView.setOutputOx(this.sliderModel.currentValue, 1);
    if (this.sliderModel.isRange) {
        this.sliderView.setOutputOx(this.sliderModel.currentValue, 0);
    }

    new ResizeObserver(() => this.sliderView.setWidth(this.sliderModel.currentValue)).observe(this.sliderView.$rangeSlider[0]);
};
SliderController.prototype.reInitialize = function reInitialize(settings: sliderSettings) {
    this.sliderModel.setSettings(settings);
    if (this.sliderModel.validateError) {
        this.sliderView.$elem.trigger('validateSliderSettingsError', { defaults: this.getSettings() });
        this.sliderModel.validateError = false;
    }
    this.setInitialState();
};
SliderController.prototype.setToValue = function setToValue(val: number) {
    [this.sliderModel.oldFrom, this.sliderModel.oldTo] = this.sliderModel.currentValue;
    this.sliderModel.currentValue[1] = val;
    this.sliderModel.setInitialOutput();
    this.sliderView.setOutputOx(this.sliderModel.currentValue, 1);
};
SliderController.prototype.setFromValue = function setFromValue(val: number) {
    [this.sliderModel.oldFrom, this.sliderModel.oldTo] = this.sliderModel.currentValue;
    this.sliderModel.currentValue[0] = val;
    this.sliderModel.setInitialOutput();
    this.sliderView.setOutputOx(this.sliderModel.currentValue, 0);
};

export default SliderController;
