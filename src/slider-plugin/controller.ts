import SliderView from "./view";
import SliderModel from "./model";

const SliderController = function SliderController(elem: Element) {
    this.sliderView = new SliderView(elem);
    this.sliderModel = new SliderModel();
};
SliderController.prototype.initialize = function initialize(settings: {
    range: boolean,
    vertical: boolean,
    scale: boolean,
    tip: boolean,
    bar: boolean,
    min: number,
    max: number,
    step: number,
    from: number,
    to: number}) {
    this.sliderView.thumbsModule.onMoveThumb = this.onMoveThumb.bind(this);
    this.sliderView.onClickBg = this.onClickBg.bind(this);

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
        from: this.sliderView.inputsModule.inputs[0].value,
        to: this.sliderView.inputsModule.inputs[1].value,
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

    this.setModelWidth();

    this.sliderModel.setInitialOutput();

    this.sliderView.moveAt(this.sliderModel.outputOx, 1);
    if (this.sliderModel.isRange) {
        this.sliderView.moveAt(this.sliderModel.outputOx, 0);
    }

    new ResizeObserver(() => this.setModelWidth()).observe(this.sliderView.rangeSlider);
};
SliderController.prototype.setModelWidth = function setModelWidth() {
    this.sliderModel.offsetWidth = this.sliderView.getSliderWidth();
};
SliderController.prototype.reInitialize = function reInitialize(settings) {
    this.sliderModel.setSettings(settings);
    this.setInitialState();
};
SliderController.prototype.setToValue = function setToValue(val: number) {
    [this.sliderModel.oldFrom, this.sliderModel.oldTo] = this.sliderModel.currentValue;
    this.sliderModel.currentValue[1] = val;
    this.sliderModel.setInitialOutput();
    this.sliderView.moveAt(this.sliderModel.outputOx, 1);
};
SliderController.prototype.setFromValue = function setFromValue(val: number) {
    [this.sliderModel.oldFrom, this.sliderModel.oldTo] = this.sliderModel.currentValue;
    this.sliderModel.currentValue[0] = val;
    this.sliderModel.setInitialOutput();
    this.sliderView.moveAt(this.sliderModel.outputOx, 0);
};
SliderController.prototype.onMoveThumb = function onMoveThumb(event: { preventDefault: () => void; }) {
    event.preventDefault();

    const moveForListener = (e: { preventDefault?: () => void; target?: any; pageY?: any; pageX?: any; touches?: any; }) => {
        if (e.target.classList.contains('range-slider__thumb')) {
            this.currentThumb = e.target;
        }

        const currentThumbId: number = parseInt(this.currentThumb.dataset.id, 10);
        let pageX: number;
        let pageY: number;
        if (e.touches) {
            pageX = e.touches[0].pageX;
            pageY = e.touches[0].pageY;
        } else {
            pageX = e.pageX;
            pageY = e.pageY;
        }

        if (this.sliderModel.isVertical) {
            this.sliderModel.calculateMove(pageY - this.sliderView.slider.offsetTop, currentThumbId);
        } else {
            this.sliderModel.calculateMove(pageX - this.sliderView.slider.offsetLeft, currentThumbId);
        }

        this.sliderView.moveAt(this.sliderModel.outputOx, currentThumbId);
    };

    moveForListener(event);
    const onMouseMove = (e: { preventDefault?: () => void; target?: any; pageY?: any; pageX?: any; }) => {
        moveForListener(e);
    };

    function handleOnMouseUp() {
        document.removeEventListener('mousemove', onMouseMove);
    }
    function handleOnTouchEnd() {
        document.removeEventListener('touchmove', onMouseMove);
        document.removeEventListener('mousemove', onMouseMove);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', handleOnMouseUp, { once: true });
    document.addEventListener('touchmove', onMouseMove);
    document.addEventListener('touchend', handleOnTouchEnd, { once: true });
};
SliderController.prototype.onClickBg = function onClickBg(event: { cancelable: any; preventDefault: () => void; target: { classList: any; nodeName: any; parentNode: any; }; touches: { pageX: number; pageY: number; }[]; pageX: number; pageY: number; }) {
    if (event.cancelable) {
        event.preventDefault();
    }

    const isClickableBackground = (e: { cancelable?: any; preventDefault?: () => void; target: any; touches?: { pageX: number; pageY: number; }[]; pageX?: number; pageY?: number; }) => {
        const { classList, nodeName, parentNode } = e.target;
        return classList.contains('range-slider__range-bg') || classList.contains('range-slider__wrapper') || (nodeName === 'LI' && parentNode.classList.contains('range-slider__scale'));
    };

    if (isClickableBackground(event)) {
        let ox: number;
        let pageX: number;
        let pageY: number;
        if (event.touches) {
            pageX = event.touches[0].pageX;
            pageY = event.touches[0].pageY;
        } else {
            pageX = event.pageX;
            pageY = event.pageY;
        }
        if (this.sliderModel.isVertical) {
            ox = pageY - this.sliderView.slider.offsetTop;
        } else {
            ox = pageX - this.sliderView.slider.offsetLeft;
        }
        const i = this.sliderModel.calculateIndex(ox);
        this.sliderModel.calculateMove(ox, i);
        this.sliderView.moveAt(this.sliderModel.outputOx, i);
    }
};

export default SliderController;
