import './styles/style.scss';

const rangeSlider1 = document.querySelector('.range-slider'),
    input = document.querySelector('#a'),
    thumb = rangeSlider1.querySelector('.range-slider__thumb'),
    slider = rangeSlider1.querySelector('.range-slider__wrapper');



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
    this.thumb = this.rangeSlider.querySelector('.range-slider__thumb');
    this.track = this.rangeSlider.querySelector('.range-slider__range-bg');
    this.slider = this.rangeSlider.querySelector('.range-slider__wrapper');
    this.sliderInput = this.rangeSlider.querySelector('input');
    this.offsetWidth = this.slider.offsetWidth;
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
    this.thumb.addEventListener('mousedown', this.onMoveThumb);
}
SliderView.prototype.moveAt = function moveAt(ox) {
    console.log(`moveAt --- ${ox}`);
    console.log('rangeSlider');
    console.dir(this.rangeSlider);

    if (ox < this.offsetLeft) {ox = this.offsetLeft;}
    if (ox > this.slider.offsetWidth - this.offsetRight) {ox = this.slider.offsetWidth - this.offsetRight;}

    this.renderTrack(ox);
    this.updateInputValue(ox);

    this.thumb.style.left = `${ox}px`;
}
SliderView.prototype.renderTrack = function renderTrack(ox) {
    this.track.style.marginLeft = `0px`;
    this.track.style.width = `${ox}px`;
}
SliderView.prototype.updateInputValue = function updateInputValue(val) {
    // this.input.value = `${this.sliderMax + this.sliderRange / (this.displayedMax - this.displayedMin) * (val - this.displayedMax)}`;
    this.sliderInput.value = `${this.sliderMax + this.sliderRange / (this.offsetWidth - this.offsetRight - this.offsetLeft) * (val - this.offsetWidth + this.offsetRight)}`;
    console.log(`offset width --- ${this.offsetWidth}`);
    console.log(`input value --- ${this.sliderInput.value}`);
    this.updateLabel(this.sliderInput.value);
}
SliderView.prototype.updateLabel = function updateLabel(str) {
    this.label.innerHTML = str;
}


const SliderModel = function SliderModel(rangeSlider) {
    this.sliderMin = 1000;
    this.sliderMax = 10000;
    this.sliderRange = 10000 - 1000;
    this.offsetLeft = 5;
    this.offsetRight = 5;
}



var SliderController = function SliderController(sliderView) {
    this.sliderView = sliderView;
    // this.sliderModel = sliderModel;
};
SliderController.prototype.initialize = function initialize() {
    this.sliderView.onMoveThumb = this.onMoveThumb.bind(this);
};
SliderController.prototype.onMoveThumb = function onMoveThumb(event) {
    event.preventDefault();
    
    this.sliderView.moveAt(event.pageX - sliderCoords.left);

    function onMouseMove(event) {
        this.sliderView.moveAt(event.pageX - sliderCoords.left);
    }

    document.addEventListener('mousemove', onMouseMove);

    document.onmouseup = function() {
        document.removeEventListener('mousemove', onMouseMove);
        thumb.onmouseup = null;
    };
};


const sliderView = new SliderView(rangeSlider1);
sliderView.render({
    sliderMin: 1000,
    sliderMax: 10000,
    sliderRange: 10000 - 1000,
    offsetLeft: 5,
    offsetRight: 5
});
sliderView.moveAt(28);

// const sliderModel = new SliderModel();

const sliderController = new SliderController(sliderView);

sliderController.initialize();

sliderView.initEventListener();






let sliderCoords = slider.getBoundingClientRect();

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



thumb.ondragstart = function() {
    return false;
};






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
