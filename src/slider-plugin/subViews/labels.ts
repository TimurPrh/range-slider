const Labels = function Labels($elem: Element) {
    this.$elem = $elem;
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
        this.$elem.append(label);
    }
    this.$labels = this.$elem.find('label');
};
Labels.prototype.change = function change(id: number, thumbOx: number, offsetLeft: number, inputVal: number, vertical: boolean, tip: boolean) {
    const $label = this.$labels.eq(id);
    if (vertical) {
        if (tip) {
            $label.css('display', 'block');
            $label.css('top', `${thumbOx}%`);
            $label.css('marginLeft', `${offsetLeft + 5}px`);
        } else {
            $label.css('display', 'none');
        }
    } else if (tip) {
        $label.css('display', 'block');
        $label.css('left', `${thumbOx}%`);
    } else {
        $label.css('display', 'none');
    }

    $label.html(inputVal);
};
Labels.prototype.remove = function remove() {
    if (this.$elem.find('.range-slider__result')) {
        this.$elem.find('.range-slider__result').each((i: number, item: Element) => item.remove());
    }
};

export default Labels;
