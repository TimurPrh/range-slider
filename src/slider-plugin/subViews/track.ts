const Track = function Track($elem: JQuery<HTMLElement>) {
    this.$elem = $elem;
};
Track.prototype.render = function render(bar: boolean) {
    const track = document.createElement('div');
    track.classList.add('range-slider__range-bg');
    this.$elem.prepend(track);

    this.$track = this.$elem.find('.range-slider__range-bg');

    if (!bar) {
        this.$track.css('display', 'none');
    } else {
        this.$track.css('display', 'block');
    }
};
Track.prototype.change = function change(begin: number, end: number, vertical: boolean) {
    if (vertical) {
        this.$track.css('top', `${begin}%`);
        this.$track.css('height', `${end - begin}%`);
    } else {
        this.$track.css('left', `${begin}%`);
        this.$track.css('width', `${end - begin}%`);
    }
};
Track.prototype.remove = function remove() {
    this.$elem.parent().find('.range-slider__range-bg').remove();
};

export default Track;
