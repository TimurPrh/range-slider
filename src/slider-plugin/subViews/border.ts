const Border = function Border($elem: JQuery<HTMLElement>) {
    this.$elem = $elem;
};
Border.prototype.render = function render(bar: boolean) {
    const border = document.createElement('div');
    border.classList.add('range-slider__border');
    this.$elem.prepend(border);

    this.$border = this.$elem.find('.range-slider__border');
};
Border.prototype.remove = function remove() {
    this.$elem.parent().find('.range-slider__border').remove();
};

export default Border;
