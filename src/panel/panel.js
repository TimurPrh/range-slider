import './panel.scss';

const Panel = function Panel(elem, settings) {
    this.elem = elem;
    this.render(elem);
    this.initialize(settings);
}
Panel.prototype.render = function render(elem) {
    const panelElement = document.createElement('div');
    panelElement.classList.add('panel');
    const panelLeftArray = ['range', 'vertical', 'scale', 'tip', 'bar'];
    const panelRightArray = ['min', 'max', 'step', 'from', 'to'];
    let panelLeft = '', 
        panelRight = '';
    panelLeftArray.forEach((item, i) => {
        panelLeft += `<div class="panel__switch">
            <input class="panel__switch-input panel__switch-input-${item}" id="${item}-${elem.offsetTop}" name="${item}" type="checkbox"> 
            <label class="panel__switch-label" for="${item}-${elem.offsetTop}">${item}</label>
        </div>`
    });
    panelRightArray.forEach((item, i) => {
        panelRight += `<div class="panel__number">
            <input class="panel__number-input panel__number-input-${item}" id="${item}-${elem.offsetTop}" name="${item}" type="number"> 
            <label class="panel__number-label" for="${item}-${elem.offsetTop}">${item}</label>
        </div>`
    });

    panelElement.innerHTML = `<div class="panel__left">
                                ${panelLeft}
                            </div>
                            <div class="panel__right">
                                ${panelRight}
                            </div>`
    elem.append(panelElement);

    this.inputFrom = this.elem.querySelector('.panel__number-input-from');
    this.inputTo = this.elem.querySelector('.panel__number-input-to');
    this.inputs = this.elem.querySelectorAll('input');
}
Panel.prototype.changeFromValue = function changeFromValue(val) {
    this.inputFrom.value = val;
}
Panel.prototype.changeToValue = function changeToValue(val) {
    this.inputTo.value = val;
}
Panel.prototype.initialize = function initialize(settings) {
    this.inputs.forEach(input => {
        if (input.type === 'number') {
            input.value = settings[input.name];
            input.name !== 'step' && input.name !== 'min' ? input.min = settings.min : null;
            input.name === 'min' ? input.min = settings.min - settings.step : null;
            input.step = settings.step;
        } else if (input.type === 'checkbox') {
            input.checked = settings[input.name];
        }
    });
    this.setEvents();
}
Panel.prototype.triggerEvent = function triggerEvent(key, value) {
    const changedInputEvent = new CustomEvent('changedInputEvent', {
        detail: {
            key: key, 
            value: value
        }
    });
    this.elem.dispatchEvent(changedInputEvent);
}
Panel.prototype.setEvents = function setEvents() {
    this.inputs.forEach(input => {
        input.addEventListener('change', (e) => {
            changeInputs(e);
        });
        input.addEventListener('mousewheel', e => {
            e.preventDefault();
            if (e.wheelDelta > 0) {
                e.target.value = parseFloat(e.target.value) + parseFloat(e.target.step);
            } else if (e.wheelDelta < 0) {
                e.target.value = parseFloat(e.target.value) - parseFloat(e.target.step);
            }
            changeInputs(e);
        });

        const changeInputs = (e) => {
            switch (e.target.name) {
                case 'range':
                    console.log('range!!!');
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
                    document.querySelectorAll('.panel__number-input').forEach(item => {
                        item.name !== 'step' && item.name !== 'min' ? item.min = parseFloat(e.target.value) : null;
                        item.name === 'min' ? item.min = parseFloat(e.target.value) - item.step : null;
                    });
                    this.triggerEvent(e.target.name, parseFloat(e.target.value));
                    break;
                case 'max':
                    this.triggerEvent(e.target.name, parseFloat(e.target.value));
                    break;
                case 'step':
                    const step = parseFloat(e.target.value);
                    document.querySelectorAll('.panel__number-input').forEach(item => {
                        if (e.wheelDelta) {
                            item.name !== 'step' ? item.step = step : null;
                        } else {
                            item.step = step;
                        }
                        item.name === 'min' ? item.min = item.value - step : null;
                    });
                    this.triggerEvent(e.target.name, parseFloat(e.target.value));
                    break;
                case 'from':
                    this.triggerEvent(e.target.name, parseFloat(e.target.value));
                    break;
                case 'to':
                    this.triggerEvent(e.target.name, parseFloat(e.target.value));
                    break;
            }
        }
    });
}

export default Panel;