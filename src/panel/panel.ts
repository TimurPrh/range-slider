import './panel.scss';

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

const Panel = function Panel(elem: Element, settings: sliderSettings) {
    this.elem = elem;
    this.render(elem);
    this.initialize(settings);
};
Panel.prototype.render = function render(elem: HTMLElement) {
    const panelElement = document.createElement('div');
    panelElement.classList.add('panel');
    const panelLeftArray = ['range', 'vertical', 'scale', 'tip', 'bar'];
    const panelRightArray = ['min', 'max', 'step', 'from', 'to'];
    let panelLeft = '';
    let panelRight = '';
    panelLeftArray.forEach((item) => {
        panelLeft += `<div class="panel__switch">
            <input class="panel__switch-input panel__switch-input-${item}" id="${item}-${elem.offsetTop}" name="${item}" type="checkbox"> 
            <label class="panel__switch-label" for="${item}-${elem.offsetTop}">${item}</label>
        </div>`;
    });
    panelRightArray.forEach((item) => {
        panelRight += `<div class="panel__number">
            <input class="panel__number-input panel__number-input-${item}" id="${item}-${elem.offsetTop}" name="${item}" type="number"> 
            <label class="panel__number-label" for="${item}-${elem.offsetTop}">${item}</label>
        </div>`;
    });

    panelElement.innerHTML = `<div class="panel__left">
                                ${panelLeft}
                            </div>
                            <div class="panel__right">
                                ${panelRight}
                            </div>`;
    elem.append(panelElement);

    this.inputFrom = this.elem.querySelector('.panel__number-input-from');
    this.inputTo = this.elem.querySelector('.panel__number-input-to');
    this.inputs = this.elem.querySelectorAll('input');
    this.numberInputs = this.elem.querySelectorAll('.panel__number-input');
};
Panel.prototype.changeFromValue = function changeFromValue(val: string) {
    this.inputFrom.value = val;
};
Panel.prototype.changeToValue = function changeToValue(val: string) {
    this.inputTo.value = val;
};
Panel.prototype.initialize = function initialize(settings: sliderSettings) {
    const { inputs } = this;
    inputs.forEach((input: { type: string; value: string; name: string; min: number; step: number; checked: string; }, i: number) => {
        if (input.type === 'number') {
            this.inputs[i].value = settings[input.name];
            if (input.name !== 'step' && input.name !== 'min') {
                this.inputs[i].min = settings.min;
            }
            if (input.name === 'min') {
                this.inputs[i].min = settings.min - settings.step;
            }
            this.inputs[i].step = settings.step;
        } else if (input.type === 'checkbox') {
            this.inputs[i].checked = settings[input.name];
        }
    });
    this.setEvents();
};
Panel.prototype.triggerEvent = function triggerEvent(key: string, value: string) {
    const changedInputEvent = new CustomEvent('changedInputEvent', {
        detail: {
            key,
            value,
        },
    });
    this.elem.dispatchEvent(changedInputEvent);
};
Panel.prototype.setEvents = function setEvents() {
    const changeInputs = (e: { target: { name: any; checked: any; value: string; }; wheelDelta: any; }) => {
        const { numberInputs } = this;
        const step = parseFloat(e.target.value);
        switch (e.target.name) {
        case 'range':
            this.triggerEvent(e.target.name, e.target.checked);
            break;
        case 'vertical':
            this.triggerEvent(e.target.name, e.target.checked);
            break;
        case 'scale':
            this.triggerEvent(e.target.name, e.target.checked);
            break;
        case 'tip':
            this.triggerEvent(e.target.name, e.target.checked);
            break;
        case 'bar':
            this.triggerEvent(e.target.name, e.target.checked);
            break;
        case 'min':
            numberInputs.forEach((item: { name: string; min: number; step: number; }, i: number) => {
                if (item.name !== 'step' && item.name !== 'min') {
                    this.numberInputs[i].min = parseFloat(e.target.value);
                } else if (item.name === 'min') {
                    this.numberInputs[i].min = parseFloat(e.target.value) - item.step;
                }
            });
            this.triggerEvent(e.target.name, parseFloat(e.target.value));
            break;
        case 'max':
            this.triggerEvent(e.target.name, parseFloat(e.target.value));
            break;
        case 'step':
            numberInputs.forEach((item: { name: string; step: number; min: number; value: number; }, i: number) => {
                if (e.wheelDelta) {
                    if (item.name !== 'step') {
                        this.numberInputs[i].step = step;
                    }
                } else {
                    this.numberInputs[i].step = step;
                }
                if (item.name === 'min') {
                    this.numberInputs[i].min = item.value - step;
                }
            });
            this.triggerEvent(e.target.name, parseFloat(e.target.value));
            break;
        case 'from':
            this.triggerEvent(e.target.name, parseFloat(e.target.value));
            break;
        case 'to':
            this.triggerEvent(e.target.name, parseFloat(e.target.value));
            break;
        default:
            break;
        }
    };

    this.inputs.forEach((input: { addEventListener: (arg0: string, arg1: { (e: any): void; (e: any): void; }) => void; }) => {
        input.addEventListener('change', (e: { target: { name: string; checked: boolean; value: string; }; wheelDelta: number; }) => {
            changeInputs(e);
        });
        input.addEventListener('mousewheel', (e: { preventDefault?: any; wheelDelta: number; target: any; }) => {
            e.preventDefault();
            if (e.wheelDelta > 0) {
                e.target.value = parseFloat(e.target.value) + parseFloat(e.target.step);
            } else if (e.wheelDelta < 0) {
                e.target.value = parseFloat(e.target.value) - parseFloat(e.target.step);
            }
            changeInputs(e);
        });
    });
};

export default Panel;
