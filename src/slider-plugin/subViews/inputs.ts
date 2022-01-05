const Inputs = function Inputs(elem: Element) {
    this.elem = elem;
};
Inputs.prototype.render = function render(viewModel: [{sliderMin: number, sliderMax: number, sliderStep: number}]) {
    for (let i = 0; i < 2; i++) {
        const input = document.createElement('input');
        input.classList.add('range-slider__input');
        input.type = "range";
        this.elem.append(input);
    }
    this.inputs = this.elem.querySelectorAll('input');

    viewModel.forEach((model: { sliderMin: number; sliderMax: number; sliderStep: number; }, i: number) => {
        this.inputs[i].min = model.sliderMin;
        this.inputs[i].max = model.sliderMax;
        this.inputs[i].step = model.sliderStep;
    });
};
Inputs.prototype.change = function change(val: number, id: number) {
    this.inputs[id].value = val;
    return this.inputs[id].value;
};
Inputs.prototype.remove = function remove() {
    if (this.elem.querySelectorAll('.range-slider__input')) {
        this.elem.querySelectorAll('.range-slider__input').forEach((item: Element) => item.remove());
    }
};

export default Inputs;
