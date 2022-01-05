const Thumbs = function Thumbs(elem: Element) {
    this.elem = elem;

    this.onMoveThumb = null;
};
Thumbs.prototype.render = function render(isRange: boolean) {
    for (let i = 0; i < 2; i++) {
        const thumb = document.createElement('div');
        thumb.classList.add('range-slider__thumb');
        thumb.dataset.id = i.toString();
        this.elem.append(thumb);
    }
    this.thumbs = this.elem.querySelectorAll('.range-slider__thumb');

    if (!isRange) {
        this.thumbs[0].style.display = 'none';
    } else {
        this.thumbs[0].style.display = 'block';
    }

    if (isRange) {
        this.thumbs.forEach((thumb: HTMLElement) => thumb.addEventListener('mousedown', this.onMoveThumb));
    } else {
        this.thumbs[1].addEventListener('mousedown', this.onMoveThumb);
    }
};
Thumbs.prototype.change = function change(id: number, thumbOx: number, isVertical: boolean) {
    if (isVertical) {
        this.thumbs[id].style.top = `${thumbOx}px`;
    } else {
        this.thumbs[id].style.left = `${thumbOx}px`;
    }
};
Thumbs.prototype.remove = function remove() {
    if (this.elem.querySelectorAll('.range-slider__thumb')) {
        this.elem.querySelectorAll('.range-slider__thumb').forEach((item: Element) => item.remove());
    }
};

export default Thumbs;
