const SliderController = function SliderController(sliderView: any, sliderModel: any) {
    this.sliderView = sliderView;
    this.sliderModel = sliderModel;
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
        from: this.sliderView.inputModule.inputs[0].value,
        to: this.sliderView.inputModule.inputs[1].value,
    };
};
SliderController.prototype.initView = function initView(props:{
        sliderMin: number,
        sliderMax: number,
        sliderStep: number,
        offsetLeft: number,
        offsetRight: number,
    }) {
    this.sliderView.initParams([
        {
            sliderMin: props.sliderMin,
            sliderMax: props.sliderMax,
            sliderStep: props.sliderStep,
        },
    ], this.sliderModel.isVertical, this.sliderModel.isRange, this.sliderModel.viewScale, this.sliderModel.viewTip, this.sliderModel.viewBar, this.sliderModel.stepDegree);
};
SliderController.prototype.setInitialState = function setInitialState() {
    this.sliderModel.initView(this.initView.bind(this));

    if (this.sliderModel.isVertical) {
        this.sliderModel.offsetWidth = this.sliderView.offsetHeight;
    } else {
        this.sliderModel.offsetWidth = this.sliderView.offsetWidth;
    }

    this.sliderModel.setInitialOutput();

    this.sliderView.moveAt(this.sliderModel.outputOx, 1);
    if (this.sliderModel.isRange) {
        this.sliderView.moveAt(this.sliderModel.outputOx, 0);
    }
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

    const moveForListener = (e: { preventDefault?: () => void; target?: any; pageY?: any; pageX?: any; }) => {
        if (e.target.classList.contains('range-slider__thumb')) {
            this.currentThumb = e.target;
        }

        const currentThumbId: number = parseInt(this.currentThumb.dataset.id, 10);

        if (this.sliderModel.isVertical) {
            this.sliderModel.calculateMove(e.pageY - this.sliderView.slider.offsetTop, currentThumbId);
        } else {
            this.sliderModel.calculateMove(e.pageX - this.sliderView.slider.offsetLeft, currentThumbId);
        }

        this.sliderView.moveAt(this.sliderModel.outputOx, currentThumbId);
    };

    moveForListener(event);
    const onMouseMove = (e: { preventDefault?: () => void; target?: any; pageY?: any; pageX?: any; }) => {
        moveForListener(e);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.onmouseup = () => {
        document.removeEventListener('mousemove', onMouseMove);
    };
};
SliderController.prototype.onClickBg = function onClickBg(event: { preventDefault: () => void; target: { classList: any; nodeName: any; parentNode: any; }; pageY: number; pageX: number; }) {
    event.preventDefault();
    const { classList, nodeName, parentNode } = event.target;
    if (classList.contains('range-slider__range-bg') || classList.contains('range-slider__wrapper') || (nodeName === 'LI' && parentNode.classList.contains('range-slider__scale'))) {
        let ox: number;
        if (this.sliderModel.isVertical) {
            ox = event.pageY - this.sliderView.slider.offsetTop;
        } else {
            ox = event.pageX - this.sliderView.slider.offsetLeft;
        }
        const i = this.sliderModel.calculateIndex(ox);
        this.sliderModel.calculateMove(ox, i);
        this.sliderView.moveAt(this.sliderModel.outputOx, i);
    }
};

export default SliderController;
