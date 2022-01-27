const Labels = function Labels(elem: Element) {
    this.elem = elem;
};
Labels.prototype.render = function render(isVertical: boolean) {
    for (let i = 0; i < 2; i++) {
        const label = document.createElement('label');
        label.classList.add('range-slider__result');
        if (isVertical) {
            label.classList.add('range-slider__result_vertical');
        } else {
            label.classList.remove('range-slider__result_vertical');
        }
        label.dataset.id = i.toString();
        this.elem.append(label);
    }
    this.labels = this.elem.querySelectorAll('label');
};
Labels.prototype.change = function change(id: number, thumbOx: number, offsetLeft: number, inputVal: number, vertical: boolean, tip: boolean) {
    if (vertical) {
        if (tip) {
            this.labels[id].style.display = 'block';
            this.labels[id].style.top = `${thumbOx}%`;
            this.labels[id].style.marginLeft = `${offsetLeft + 5}px`;
        } else {
            this.labels[id].style.display = 'none';
        }
    } else if (tip) {
        this.labels[id].style.display = 'block';
        this.labels[id].style.left = `${thumbOx}%`;
    } else {
        this.labels[id].style.display = 'none';
    }

    this.labels[id].innerHTML = inputVal;
};
Labels.prototype.remove = function remove() {
    if (this.elem.querySelector('.range-slider__result')) {
        this.elem.querySelectorAll('.range-slider__result').forEach((item: Element) => item.remove());
    }
};

export default Labels;
