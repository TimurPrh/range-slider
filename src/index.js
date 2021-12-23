import './styles/style.scss';

const rangeSliderWrapper = document.querySelector('#root');

const SliderView = function SliderView(elem) {
    this.render(elem);

    this.rangeSlider = elem.querySelector('.range-slider');
    this.labels = this.rangeSlider.querySelectorAll('label');
    this.slider = this.rangeSlider.querySelector('.range-slider__wrapper');
    this.thumbs = this.rangeSlider.querySelectorAll('.range-slider__thumb');
    this.track = this.rangeSlider.querySelector('.range-slider__range-bg');
    this.sliderInputs = this.rangeSlider.querySelectorAll('input');
    this.onMoveThumb = null;
    this.isVertical;
}
SliderView.prototype.render = function render(elem) {
    const sliderElement = document.createElement('div');
    sliderElement.classList.add('range-slider');
    sliderElement.innerHTML = `<label class="range-slider__result" for='a' data-id="0"></label>
                                <label class="range-slider__result" for='b' data-id="1"></label>
                                <div class="range-slider__outer">
                                    <div class="range-slider__wrapper">
                                        <div class="range-slider__range-bg"></div>
                                        <div class="range-slider__thumb" data-id="0"></div>
                                        <div class="range-slider__thumb" data-id="1"></div>
                                        <input id="a" class="range-slider__input" type="range">
                                        <input id="b" class="range-slider__input" type="range">
                                    </div>
                                </div>`
    elem.append(sliderElement);
}
SliderView.prototype.initParams = function initParams(viewModel, isVertical, isRange, scale) {
    this.isVertical = isVertical;
    this.isRange = isRange;
    this.scale = scale;

    if (isVertical) {
        this.slider.classList.add('range-slider__wrapper_vertical');
    }

    this.offsetWidth = this.slider.offsetWidth;
    this.offsetHeight = this.slider.offsetHeight;

    if (scale) {
        if (isVertical) {
            const scaleElement = document.createElement('ul');
            scaleElement.classList.add('range-slider__scale', 'range-slider__scale_vertical');
            const stepCount = Math.floor((viewModel[0].sliderMax - viewModel[0].sliderMin) / viewModel[0].sliderStep) + 1;
            const stepHeight = this.offsetHeight / (stepCount - 1);
            let stepValue = viewModel[0].sliderMax;
            for (let i = 0; i < stepCount; i++) {
                scaleElement.innerHTML += `<li>${stepValue}</li>`;
                stepValue -= viewModel[0].sliderStep;
            }
            scaleElement.style.gridTemplateRows = `repeat(${stepCount}, ${stepHeight}px)`;
            this.slider.parentNode.style.display = 'flex';
            this.slider.parentNode.append(scaleElement); 
        } else {
            const scaleElement = document.createElement('ul');
            scaleElement.classList.add('range-slider__scale');
            const stepCount = Math.floor((viewModel[0].sliderMax - viewModel[0].sliderMin) / viewModel[0].sliderStep) + 1;
            const stepWidth = this.offsetWidth / (stepCount - 1);
            let stepValue = viewModel[0].sliderMin;
            for (let i = 0; i < stepCount; i++) {
                scaleElement.innerHTML += `<li>${stepValue}</li>`;
                stepValue += viewModel[0].sliderStep;
            }
            scaleElement.style.gridTemplateColumns = `repeat(${stepCount}, ${stepWidth}px)`;
            this.slider.parentNode.append(scaleElement);
        }

    }
    
    if (!isRange) {
        this.thumbs[0].style.display = 'none';
        this.labels[0].style.display = 'none';
    }
    
    viewModel.forEach((model, id) => {
        this.sliderInputs[id].min = model.sliderMin;
        this.sliderInputs[id].max = model.sliderMax;
        this.sliderInputs[id].step = model.sliderStep;
    });
}
SliderView.prototype.initEventListener = function initEventListener() {
    this.isRange ? this.thumbs.forEach(thumb => thumb.addEventListener('mousedown', this.onMoveThumb)) : this.thumbs[1].addEventListener('mousedown', this.onMoveThumb);
}
SliderView.prototype.moveAt = function moveAt(obj, id) {
    const thumbOx = obj.thumbs[id].ox;
    const thumbValue = obj.thumbs[id].value;
    const trackOx = obj.track;

    console.log(obj.thumbs, id);
    console.log(`moveAt --- ${thumbOx}`);

    this.renderTrack(trackOx.begin, trackOx.end);
    this.updateInputValue(thumbValue, id);

    this.isVertical ? this.thumbs[id].style.top = `${thumbOx}px` : this.thumbs[id].style.left = `${thumbOx}px`;
}
SliderView.prototype.renderTrack = function renderTrack(begin, end) {
    this.isVertical ? this.track.style.marginTop = `${begin}px` : this.track.style.marginLeft = `${begin}px`;
    this.isVertical ? this.track.style.height = `${end - begin}px` : this.track.style.width = `${end - begin}px`;
}
SliderView.prototype.updateInputValue = function updateInputValue(val, id) {
    this.sliderInputs[id].value = val;
    console.log(`input value --- ${val} , ${id}`);
    this.updateLabel(this.sliderInputs[id].value, id);
}
SliderView.prototype.updateLabel = function updateLabel(str, id) {
    this.labels[id].innerHTML = str;
}


const SliderModel = function SliderModel() {
    this.minThumbOffset = 0;
    this.isRange = true;
    this.isVertical = true;
    this.viewScale = true;
    this.sliderProps = [
        {
            sliderMin: -100,
            sliderMax: 100,
            sliderStep: 25,
            offsetLeft: this.minThumbOffset,
            offsetRight: this.minThumbOffset,
            initialState: 0
        },
        {
            sliderMin: -100,
            sliderMax: 100,
            sliderStep: 25,
            offsetLeft: this.minThumbOffset,
            offsetRight: this.minThumbOffset,
            initialState: 0
        }
    ]
    this.currentValue = [];
    this.sliderRange = [];
    this.outputOx = {thumbs: [
        {
            ox: undefined,
            value: undefined
        },
        {
            ox: undefined,
            value: undefined
        }
    ],
    track: {}};
}
SliderModel.prototype.initView = function initView(fn) {
    fn(this.sliderProps);
}
SliderModel.prototype.setInitialOutput = function setInitialOutput(output) {
    this.outputOx.thumbs.forEach((thumb, i) => {
        thumb.ox = output[i].ox;
        thumb.value = output[i].value;
    })
}
SliderModel.prototype.calculateMove = function calculateMove(ox, id) {
    const viewStep = (this.offsetWidth) * this.sliderProps[id].sliderStep / (this.sliderProps[1].sliderMax - this.sliderProps[0].sliderMin);
    ox = Math.round(ox / viewStep) * viewStep;
    console.log('------------------');
    console.log(ox);
    
    if (this.isVertical) {
        this.sliderProps[0].sliderMax = this.outputOx.thumbs[1].value - this.sliderProps[1].sliderStep;
        this.sliderProps[0].offsetLeft = this.outputOx.thumbs[1].ox + viewStep + this.minThumbOffset;
        

        if (this.isRange) {
            this.sliderProps[1].sliderMin = this.outputOx.thumbs[0].value + this.sliderProps[0].sliderStep;
            this.sliderProps[1].offsetRight = this.offsetWidth - this.outputOx.thumbs[0].ox + viewStep + this.minThumbOffset;
        } else {
            this.sliderProps[1].offsetRight = this.minThumbOffset;
        }

        this.sliderRange[id] = this.sliderProps[id].sliderMax - this.sliderProps[id].sliderMin;
        if (this.sliderRange[id] == 0) {
            this.currentValue[id] = this.sliderProps[id].sliderMax;
        } else {
            this.currentValue[id] = this.sliderProps[id].sliderMax - this.sliderRange[id] / (this.offsetWidth - this.sliderProps[id].offsetRight - this.sliderProps[id].offsetLeft) * (ox - this.sliderProps[id].offsetLeft);
        }

        if (ox < this.sliderProps[id].offsetLeft) {
            ox = this.sliderProps[id].offsetLeft;
            this.currentValue[id] = this.sliderProps[id].sliderMax;
        } else if (ox > this.offsetWidth - this.sliderProps[id].offsetRight) {
            ox = this.offsetWidth - this.sliderProps[id].offsetRight;
            this.currentValue[id] = this.sliderProps[id].sliderMin;
        }
    } else {
        this.sliderProps[0].sliderMax = this.outputOx.thumbs[1].value - this.sliderProps[1].sliderStep;
        this.sliderProps[0].offsetRight = this.offsetWidth - this.outputOx.thumbs[1].ox + viewStep + this.minThumbOffset;
        
        if (this.isRange) {
            this.sliderProps[1].sliderMin = this.outputOx.thumbs[0].value + this.sliderProps[0].sliderStep;
            this.sliderProps[1].offsetLeft = this.outputOx.thumbs[0].ox + viewStep + this.minThumbOffset;
        } else {
            this.sliderProps[1].offsetLeft = this.minThumbOffset;
        }

        this.sliderRange[id] = this.sliderProps[id].sliderMax - this.sliderProps[id].sliderMin;
        if (this.sliderRange[id] == 0) {
            this.currentValue[id] = this.sliderProps[id].sliderMax;
        } else {
            this.currentValue[id] = this.sliderProps[id].sliderMax +  this.sliderRange[id] / (this.offsetWidth - this.sliderProps[id].offsetRight - this.sliderProps[id].offsetLeft) * (ox - this.offsetWidth + this.sliderProps[id].offsetRight);
        }

        if (ox < this.sliderProps[id].offsetLeft) {
            ox = this.sliderProps[id].offsetLeft;
            this.currentValue[id] = this.sliderProps[id].sliderMin;
        } else if (ox > this.offsetWidth - this.sliderProps[id].offsetRight) {
            ox = this.offsetWidth - this.sliderProps[id].offsetRight;
            this.currentValue[id] = this.sliderProps[id].sliderMax;
        }
    }

    this.outputOx.thumbs[id].ox = ox;
    this.outputOx.thumbs[id].value = this.currentValue[id];

    if (this.isRange) {
        if (this.isVertical) {
            this.outputOx.track = {
                begin: this.outputOx.thumbs[1].ox,
                end: this.outputOx.thumbs[0].ox
            }
        } else {
            this.outputOx.track = {
                begin: this.outputOx.thumbs[0].ox,
                end: this.outputOx.thumbs[1].ox
            }
        }
    } else {
        if (this.isVertical) {
            this.outputOx.track = {
                begin: ox,
                end: this.offsetWidth
            }
        } else {
            this.outputOx.track = {
                begin: 0,
                end: ox
            }
        }
    }
};


const SliderController = function SliderController(sliderView, sliderModel) {
    this.sliderView = sliderView;
    this.sliderModel = sliderModel;
    this.currentThumb;
};
SliderController.prototype.initialize = function initialize() {
    this.sliderView.onMoveThumb = this.onMoveThumb.bind(this);
    
    this.sliderModel.initView(this.initView.bind(this));
    this.sliderView.initEventListener();

    if (this.sliderModel.isVertical) {
        this.sliderModel.offsetWidth = this.sliderView.offsetHeight;
    } else {
        this.sliderModel.offsetWidth = this.sliderView.offsetWidth;
    }

    this.setInitialState();
};
SliderController.prototype.initView = function initView(props) {
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
    ], this.sliderModel.isVertical, this.sliderModel.isRange, this.sliderModel.viewScale);
}
SliderController.prototype.setInitialState = function setInitialState() {
    if (this.sliderModel.isVertical) {
        this.sliderModel.setInitialOutput([{ox: this.sliderModel.offsetWidth, value: this.sliderModel.sliderProps[0].sliderMin},{ox: 0, value: this.sliderModel.sliderProps[1].sliderMax}]);

        this.sliderModel.calculateMove(0, 1);
        if (this.sliderModel.isRange) {
            this.sliderModel.calculateMove(this.sliderModel.offsetWidth, 0);
        }
    } else {
        this.sliderModel.setInitialOutput([{ox: 0, value: this.sliderModel.sliderProps[0].sliderMin},{ox: this.sliderModel.offsetWidth, value: this.sliderModel.sliderProps[1].sliderMax}]);

        this.sliderModel.calculateMove(this.sliderModel.offsetWidth, 1);
        if (this.sliderModel.isRange) {
            this.sliderModel.calculateMove(0, 0);
        }
    }

    this.sliderView.moveAt(this.sliderModel.outputOx, 1);
    if (this.sliderModel.isRange) {
        this.sliderView.moveAt(this.sliderModel.outputOx, 0);
    }
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


const sliderView = new SliderView(rangeSliderWrapper);
const sliderModel = new SliderModel();
const sliderController = new SliderController(sliderView, sliderModel);
sliderController.initialize();





// thumb.onmousedown = function(event) {
//     event.preventDefault();
    
//     view.moveAt(event.pageX - sliderCoords.left);

//     function onMouseMove(event) {
//         view.moveAt(event.pageX - sliderCoords.left);
//     }

//     document.addEventListener('mousemove', onMouseMove);

//     document.onmouseup = function() {
//         document.removeEventListener('mousemove', onMouseMove);
//         thumb.onmouseup = null;
//     };

// };



// thumb.ondragstart = function() {
//     return false;
// };






//событие на колёсико
// slider.onwheel = function(event) {
//     event.preventDefault();
//     shiftX = 0;
//     console.log(event.deltaY)
    // moveAt(thumb.getBoundingClientRect().left - event.deltaY/50);
// }

// чтобы ползунок прыгал вдоль слайдера по клику мышки
// slider.onmousedown = function(event) {
//     if (event.target !== slider) {
//         return false;
//     }
//     shiftX = thumb.offsetWidth/2;

//     moveAt(event.pageX);
// }
