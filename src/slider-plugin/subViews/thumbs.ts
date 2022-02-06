const Thumbs = function Thumbs($elem: JQuery<HTMLElement>) {
    this.$elem = $elem;

    this.onMoveThumb = null;
};
Thumbs.prototype.render = function render(isRange: boolean) {
    for (let i = 0; i < 2; i++) {
        const thumb = document.createElement('div');
        thumb.classList.add('range-slider__thumb');
        thumb.dataset.id = i.toString();
        this.$elem.append(thumb);
    }
    this.$thumbs = this.$elem.find('.range-slider__thumb');

    if (!isRange) {
        this.$thumbs.eq(0).css('display', 'none');
    } else {
        this.$thumbs.eq(0).css('display', 'block');
    }

    if (isRange) {
        this.$thumbs.each((i: number, thumb) => {
            thumb.addEventListener("mousedown", this.onMoveThumb);
            thumb.addEventListener('touchstart', this.onMoveThumb);
        });
    } else {
        this.$thumbs.eq(1).on('mousedown', this.onMoveThumb);
        this.$thumbs.eq(1).on('touchstart', this.onMoveThumb);
    }
};
Thumbs.prototype.change = function change(id: number, thumbOx: number, isVertical: boolean) {
    if (isVertical) {
        this.$thumbs.eq(id).css('top', `${thumbOx}%`);
    } else {
        this.$thumbs.eq(id).css('left', `${thumbOx}%`);
    }
};
Thumbs.prototype.remove = function remove() {
    this.$elem.find('.range-slider__thumb').each((i: number, item: Element) => item.remove());
};

export default Thumbs;
