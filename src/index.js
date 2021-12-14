import './styles/style.scss';

const rangeSlider1 = document.querySelector('.range-slider');



// const view = {
//     rangeSlider: document.querySelector('.range-slider'),
//     label: document.querySelector('.range-slider label'),
//     thumb: document.querySelector('.range-slider .range-slider__thumb'),
//     track: document.querySelector('.range-slider .range-slider__range-bg'),
//     slider: document.querySelector('.range-slider .range-slider__wrapper'),
//     moveAt: function(ox) {
//         console.log(`moveAt --- ${ox}`);
//         console.log('rangeSlider');
//         console.dir(this.rangeSlider);

//         if (ox < model.displayedMin) {ox = model.displayedMin;}
//         if (ox > model.displayedMax) {ox = model.displayedMax;}

//         this.renderTrack(ox);
//         model.changeInput(ox);

//         this.thumb.style.left = `${ox}px`;
//     },
//     renderTrack: function(ox) {
//         this.track.style.marginLeft = `0px`;
//         this.track.style.width = `${ox}px`;
//     },
//     updateLabel: function(str) {
//         this.label.innerHTML = str;
//     }
// }

// const model = {
//     sliderMin: 1000,
//     sliderMax: 10000,
//     sliderRange: 10000 - 1000,
//     displayedMin: 5,
//     displayedMax: view.slider.offsetWidth - 5,
//     initInput: function() {
//         input.min = this.sliderMin;
//         input.max = this.sliderMax;
//     },
//     changeInput: function(val) {
//         input.value = `${this.sliderMax + this.sliderRange / (this.displayedMax - this.displayedMin) * (val - this.displayedMax)}`;
//         console.log(`input value --- ${input.value}`);
//         view.updateLabel(input.value);
//     }
// }






const SliderView = function SliderView(rangeSlider) {
    this.rangeSlider = rangeSlider;
    this.label = this.rangeSlider.querySelector('label');
    this.thumb = this.rangeSlider.querySelectorAll('.range-slider__thumb');
    this.track = this.rangeSlider.querySelector('.range-slider__range-bg');
    this.slider = this.rangeSlider.querySelector('.range-slider__wrapper');
    this.sliderInput = this.rangeSlider.querySelector('input');
    this.offsetWidth = this.slider.offsetWidth;
    this.sliderCoords = this.slider.getBoundingClientRect();
    this.onMoveThumb = null;
}
SliderView.prototype.render = function render(viewModel) {
    this.sliderInput.min = viewModel.sliderMin;
    this.sliderInput.max = viewModel.sliderMax;
    this.sliderMax = viewModel.sliderMax;
    this.sliderRange = viewModel.sliderRange;
    this.offsetLeft = viewModel.offsetLeft;
    this.offsetRight = viewModel.offsetRight;
}
SliderView.prototype.initEventListener = function initEventListener() {
    this.thumb.forEach(thumb => thumb.addEventListener('mousedown', this.onMoveThumb));
}
SliderView.prototype.moveAt = function moveAt(obj, id) {
    console.log(obj);
    const thumbOx = obj.thumbs[id].ox;
    const thumbValue = obj.thumbs[id].value;
    const trackOx = obj.track;
    console.log(`moveAt --- ${thumbOx}`);

    this.renderTrack(trackOx.begin, trackOx.end);
    this.updateInputValue(thumbValue);

    this.thumb[id].style.left = `${thumbOx}px`;
}
SliderView.prototype.renderTrack = function renderTrack(begin, end) {
    this.track.style.marginLeft = `${begin}px`;
    this.track.style.width = `${end - begin}px`;
}
SliderView.prototype.updateInputValue = function updateInputValue(val) {
    this.sliderInput.value = val;
    console.log(`input value --- ${this.sliderInput.value}`);
    this.updateLabel(this.sliderInput.value);
}
SliderView.prototype.updateLabel = function updateLabel(str) {
    this.label.innerHTML = str;
}


const SliderModel = function SliderModel() {
    this.numberOfThumbs = 2;
    this.sliderProps = {
        sliderMin: 1000,
        sliderMax: 10000,
        offsetLeft: 5,
        offsetRight: 5,
        initialState: 0
    }
    this.currentValue = [];
    this.outputOx = {thumbs: [
        {
            ox: 0,
            value: 0
        },
        {
            ox: 0,
            value: 0
        }
    ],
    track: {}};
}
SliderModel.prototype.initView = function initView(fn) {
    fn(this.sliderProps);
}
SliderModel.prototype.calculateMove = function calculateMove(ox, id) {
    this.sliderRange = this.sliderProps.sliderMax - this.sliderProps.sliderMin;
    this.currentValue[id] = this.sliderProps.sliderMax + this.sliderRange / (this.offsetWidth - this.sliderProps.offsetRight - this.sliderProps.offsetLeft) * (ox - this.offsetWidth + this.sliderProps.offsetRight);
    if (ox < this.sliderProps.offsetLeft) {
        ox = this.sliderProps.offsetLeft;
    }
    if (ox > this.offsetWidth - this.sliderProps.offsetRight) {
        ox = this.offsetWidth - this.sliderProps.offsetRight;
    }

    this.outputOx.thumbs[id].ox = ox;
    this.outputOx.thumbs[id].value = this.currentValue[id];

    console.log(this.outputOx);

    this.outputOx.track = {
        begin: 0,
        end: ox
    }
};


const SliderController = function SliderController(sliderView, sliderModel) {
    this.sliderView = sliderView;
    this.sliderModel = sliderModel;
    this.currentThumb;
};
SliderController.prototype.initialize = function initialize() {
    this.sliderView.onMoveThumb = this.onMoveThumb.bind(this);
    this.sliderModel.offsetWidth = this.sliderView.offsetWidth;
    this.sliderModel.initView(this.initView.bind(this));
};
SliderController.prototype.initView = function initView(props) {
    this.sliderView.render({
        sliderMin: props.sliderMin,
        sliderMax: props.sliderMax,
        sliderRange: props.sliderMax - props.sliderMin,
        offsetLeft: props.offsetLeft,
        offsetRight: props.offsetRight
    });
    this.sliderModel.calculateMove(0,0);
    this.sliderView.moveAt(this.sliderModel.outputOx, 0);
}
SliderController.prototype.onMoveThumb = function onMoveThumb(event) {
    event.preventDefault();

    const moveForListener = (event) => {
        if (event.target.classList.contains('range-slider__thumb')) {
            this.currentThumb = event.target;
        }
        this.sliderModel.calculateMove(event.pageX - this.sliderView.sliderCoords.left, this.currentThumb.dataset.id);
        this.sliderView.moveAt(this.sliderModel.outputOx, this.currentThumb.dataset.id);
    }
    
    moveForListener(event);
    const onMouseMove = (event) => {
        moveForListener(event);
    }
    document.addEventListener('mousemove', onMouseMove);
    document.onmouseup = function() {
        document.removeEventListener('mousemove', onMouseMove);
        // this.sliderView.thumb.onmouseup = null;
    };
};


const sliderView = new SliderView(rangeSlider1);
const sliderModel = new SliderModel();
const sliderController = new SliderController(sliderView, sliderModel);
sliderController.initialize();
sliderView.initEventListener();



// view.moveAt(0);
// model.initInput();



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
