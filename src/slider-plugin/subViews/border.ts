const Border = function Border(elem: Element) {
    this.elem = elem;
};
Border.prototype.render = function render(bar: boolean) {
    const border = document.createElement('div');
    border.classList.add('range-slider__border');
    this.elem.prepend(border);

    this.border = this.elem.querySelector('.range-slider__border');
};
Border.prototype.remove = function remove() {
    if (this.elem.parentNode.querySelector('.range-slider__border')) {
        this.elem.parentNode.querySelector('.range-slider__border').remove();
    }
};

export default Border;
