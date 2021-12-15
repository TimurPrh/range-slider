import './styles/style.scss';

const rangeSlider1 = document.querySelector('.range-slider');

const SliderView = function SliderView(elem) {
    this.rangeSlider = elem;
    this.labels = this.rangeSlider.querySelectorAll('label');
    this.thumbs = this.rangeSlider.querySelectorAll('.range-slider__thumb');
    this.track = this.rangeSlider.querySelector('.range-slider__range-bg');
    this.slider = this.rangeSlider.querySelector('.range-slider__wrapper');
    this.sliderInputs = this.rangeSlider.querySelectorAll('input');
    this.offsetWidth = this.slider.offsetWidth;
    this.sliderCoords = this.slider.getBoundingClientRect();
    this.onMoveThumb = null;
}
SliderView.prototype.render = function render(viewModel) {
    viewModel.forEach((model, id) => {
        this.sliderInputs[id].min = model.sliderMin;
        this.sliderInputs[id].max = model.sliderMax;
    });
    
}
SliderView.prototype.initEventListener = function initEventListener() {
    this.thumbs.forEach(thumb => thumb.addEventListener('mousedown', this.onMoveThumb));
}
SliderView.prototype.moveAt = function moveAt(obj, id) {
    const thumbOx = obj.thumbs[id].ox;
    const thumbValue = obj.thumbs[id].value;
    const trackOx = obj.track;

    console.log(obj);
    console.log(`moveAt --- ${thumbOx}`);

    this.renderTrack(trackOx.begin, trackOx.end);
    this.updateInputValue(thumbValue, id);

    this.thumbs[id].style.left = `${thumbOx}px`;
}
SliderView.prototype.renderTrack = function renderTrack(begin, end) {
    this.track.style.marginLeft = `${begin}px`;
    this.track.style.width = `${end - begin}px`;
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
    this.numberOfThumbs = 2;
    this.minThumbOffset = 5;
    this.sliderProps = [
        {
            sliderMin: 1000,
            sliderMax: 10000,
            offsetLeft: this.minThumbOffset,
            offsetRight: this.minThumbOffset,
            initialState: 0
        },
        {
            sliderMin: 1000,
            sliderMax: 10000,
            offsetLeft: this.minThumbOffset,
            offsetRight: this.minThumbOffset,
            initialState: 0
        }
    ]
    this.currentValue = [];
    this.sliderRange = [];
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
    this.sliderProps[0].sliderMax = this.outputOx.thumbs[1].value - 100;
    this.sliderProps[0].offsetRight = this.offsetWidth - this.outputOx.thumbs[1].ox + this.minThumbOffset * 3;

    this.sliderProps[1].sliderMin = this.outputOx.thumbs[0].value + 100;
    this.sliderProps[1].offsetLeft = this.outputOx.thumbs[0].ox + this.minThumbOffset * 3;

    this.sliderRange[id] = this.sliderProps[id].sliderMax - this.sliderProps[id].sliderMin;
    this.currentValue[id] = this.sliderProps[id].sliderMax + this.sliderRange[id] / (this.offsetWidth - this.sliderProps[id].offsetRight - this.sliderProps[id].offsetLeft) * (ox - this.offsetWidth + this.sliderProps[id].offsetRight);
    if (ox < this.sliderProps[id].offsetLeft) {
        ox = this.sliderProps[id].offsetLeft;
        this.currentValue[id] = this.sliderProps[id].sliderMin;
    } else if (ox > this.offsetWidth - this.sliderProps[id].offsetRight) {
        ox = this.offsetWidth - this.sliderProps[id].offsetRight;
        this.currentValue[id] = this.sliderProps[id].sliderMax;
    }

    if (this.currentValue[id]) {
        this.outputOx.thumbs[id].ox = ox;
        this.outputOx.thumbs[id].value = this.currentValue[id];
    }

    if (this.numberOfThumbs === 1) {
        this.outputOx.track = {
            begin: 0,
            end: ox
        }
    } else if (this.numberOfThumbs === 2) {
        this.outputOx.track = {
            begin: this.outputOx.thumbs[0].ox,
            end: this.outputOx.thumbs[1].ox
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
    this.sliderModel.offsetWidth = this.sliderView.offsetWidth;
    this.sliderModel.initView(this.initView.bind(this));
};
SliderController.prototype.initView = function initView(props) {
    this.sliderView.render([
        {
            sliderMin: props[0].sliderMin,
            sliderMax: props[0].sliderMax,
        },
        {
            sliderMin: props[1].sliderMin,
            sliderMax: props[1].sliderMax,
        }
    ]);
    this.sliderModel.calculateMove(0, 0);
    this.sliderModel.calculateMove(280, 1);
    this.sliderView.moveAt(this.sliderModel.outputOx, 0);
    this.sliderView.moveAt(this.sliderModel.outputOx, 1);
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
    };
};


const sliderView = new SliderView(rangeSlider1);
const sliderModel = new SliderModel();
const sliderController = new SliderController(sliderView, sliderModel);
sliderController.initialize();
sliderView.initEventListener();




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
