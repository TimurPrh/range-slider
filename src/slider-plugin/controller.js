const SliderController = function SliderController(sliderView, sliderModel) {
    this.sliderView = sliderView;
    this.sliderModel = sliderModel;
    this.currentThumb;
};
SliderController.prototype.initialize = function initialize(settings) {
    this.sliderView.onMoveThumb = this.onMoveThumb.bind(this);
    this.sliderView.onClickBg = this.onClickBg.bind(this);

    this.sliderModel.setInitialSettings(settings);
    this.sliderModel.initView(this.initView.bind(this));
    this.sliderView.initEventListener();

    if (this.sliderModel.isVertical) {
        this.sliderModel.offsetWidth = this.sliderView.offsetHeight;
    } else {
        this.sliderModel.offsetWidth = this.sliderView.offsetWidth;
    }

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
        // from: this.sliderModel.currentValue[0],
        // to: this.sliderModel.currentValue[1]
        from: this.sliderView.sliderInputs[0].value,
        to: this.sliderView.sliderInputs[1].value
    }
};
SliderController.prototype.destroyView = function destroyView() {
    this.sliderView.rangeSlider.remove();
};
SliderController.prototype.initView = function initView(props) {
    props[0].sliderStep = props[0].sliderStep || 1; // Исключаем нулевой шаг
    props[1].sliderStep = props[1].sliderStep || 1;
    this.sliderView.initParams([
        {
            sliderMin: props[0].sliderMin,
            sliderMax: props[0].sliderMax,
            sliderStep: props[0].sliderStep,
        },
        {
            sliderMin: props[1].sliderMin,
            sliderMax: props[1].sliderMax,
            sliderStep: props[1].sliderStep,
        }
    ], this.sliderModel.isVertical, this.sliderModel.isRange, this.sliderModel.viewScale, this.sliderModel.viewTip, this.sliderModel.viewBar, this.sliderModel.stepDegree);
}
SliderController.prototype.setInitialState = function setInitialState() {
    this.sliderModel.setInitialOutput();

    this.sliderView.moveAt(this.sliderModel.outputOx, 1);
    if (this.sliderModel.isRange) {
        this.sliderView.moveAt(this.sliderModel.outputOx, 0);
    }
}
SliderController.prototype.reInitialize = function reInitialize(settings) {
    this.destroyView();
    this.sliderView.render(this.sliderView.elem);
    this.sliderModel.setSettings(settings);
    this.sliderModel.initView(this.initView.bind(this));
    this.sliderView.initEventListener();

    if (this.sliderModel.isVertical) {
        this.sliderModel.offsetWidth = this.sliderView.offsetHeight;
    } else {
        this.sliderModel.offsetWidth = this.sliderView.offsetWidth;
    }

    this.setInitialState();
}
SliderController.prototype.onMoveThumb = function onMoveThumb(event) {
    event.preventDefault();

    const moveForListener = (event) => {
        if (event.target.classList.contains('range-slider__thumb')) {
            this.currentThumb = event.target;
        }

        this.sliderModel.isVertical ? this.sliderModel.calculateMove(event.pageY - this.sliderView.slider.offsetTop, this.currentThumb.dataset.id) : 
        this.sliderModel.calculateMove(event.pageX - this.sliderView.slider.offsetLeft, this.currentThumb.dataset.id);

        this.sliderView.moveAt(this.sliderModel.outputOx, this.currentThumb.dataset.id);
    }
    
    moveForListener(event);
    const onMouseMove = (event) => {
        moveForListener(event);
    }
    document.addEventListener('mousemove', onMouseMove);
    document.onmouseup = function() {
        document.removeEventListener('mousemove', onMouseMove);
    };
};
SliderController.prototype.onClickBg = function onClickBg(event) {
    event.preventDefault();

    if (event.target.classList.contains('range-slider__range-bg') || event.target.classList.contains('range-slider__wrapper')) {
        let ox;
        this.sliderModel.isVertical ? ox = event.pageY - this.sliderView.slider.offsetTop : ox = event.pageX - this.sliderView.slider.offsetLeft;
        const i = this.sliderModel.calculateIndex(ox);
        this.sliderModel.calculateMove(ox, i);
        this.sliderView.moveAt(this.sliderModel.outputOx, i);
    }
};

export default SliderController;