const Track = function Track(elem: Element) {
    this.elem = elem;
};
Track.prototype.render = function render(bar: boolean) {
    const track = document.createElement('div');
    track.classList.add('range-slider__range-bg');
    this.elem.prepend(track);

    this.track = this.elem.querySelector('.range-slider__range-bg');

    if (!bar) {
        this.track.style.display = 'none';
    } else {
        this.track.style.display = 'block';
    }
};
Track.prototype.change = function change(begin: number, end: number, vertical: boolean) {
    if (vertical) {
        this.track.style.top = `${begin}%`;
        this.track.style.height = `${end - begin}%`;
    } else {
        this.track.style.left = `${begin}%`;
        this.track.style.width = `${end - begin}%`;
    }
};
Track.prototype.remove = function remove() {
    if (this.elem.parentNode.querySelector('.range-slider__range-bg')) {
        this.elem.parentNode.querySelector('.range-slider__range-bg').remove();
    }
};

export default Track;
