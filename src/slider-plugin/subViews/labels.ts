const Labels = function Labels(elem: Element) {
    this.elem = elem;
};
Labels.prototype.render = function render() {
    for (let i = 0; i < 2; i++) {
        const label = document.createElement('label');
        label.classList.add('range-slider__result');
        label.dataset.id = i.toString();
        this.elem.append(label);
    }
    this.labels = this.elem.querySelectorAll('label');
};
Labels.prototype.change = function change(id: number, thumbOx: number, inputVal: number, vertical: boolean, tip: boolean) {
    if (vertical) {
        if (tip) {
            this.labels[id].style.display = 'block';
            this.labels[id].style.top = `${thumbOx}px`;
            this.labels[id].style.marginLeft = `25px`;
        } else {
            this.labels[id].style.display = 'none';
        }
    } else if (tip) {
        this.labels[id].style.display = 'block';
        this.labels[id].style.left = `${thumbOx}px`;
    } else {
        this.labels[id].style.display = 'none';
    }

    this.labels[id].innerHTML = inputVal;
};
Labels.prototype.remove = function remove() {
    if (this.elem.querySelectorAll('.range-slider__result')) {
        this.elem.querySelectorAll('.range-slider__result').forEach((item: Element) => item.remove());
    }
};

export default Labels;
