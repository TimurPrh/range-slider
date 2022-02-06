const Inputs = function Inputs($elem: JQuery<HTMLElement>) {
    this.$elem = $elem;
};
Inputs.prototype.render = function render(viewModel: {sliderMin: number, sliderMax: number, sliderStep: number}) {
    for (let i = 0; i < 2; i++) {
        const input = document.createElement('input');
        input.classList.add('range-slider__input');
        input.type = "range";
        this.$elem.append(input);
    }
    this.$inputs = this.$elem.find('input');

    this.$inputs.each((i: number, input: any) => {
        this.$inputs[i].min = viewModel.sliderMin;
        this.$inputs[i].max = viewModel.sliderMax;
        this.$inputs[i].step = viewModel.sliderStep;
    });
};
Inputs.prototype.change = function change(val: number, id: number) {
    this.$inputs.eq(id).val(val);
    return this.$inputs.eq(id).val();
};
Inputs.prototype.remove = function remove() {
    this.$elem.find('.range-slider__input').each((i: number, item: Element) => item.remove());
};

export default Inputs;
