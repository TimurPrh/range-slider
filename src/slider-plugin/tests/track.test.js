/**
 * @jest-environment jsdom
*/

import '@testing-library/jest-dom';
import Track from "../subViews/track";

let wrapper;
let track;

beforeAll(() => {
    wrapper = document.createElement('div');
    document.body.appendChild(wrapper);
});

describe('Subview - Track: render', () => {
    beforeEach(() => {
        track = new Track(wrapper);
    });
    afterEach(() => {
        track.remove();
    });
    test('should render track with option "bar" - true', () => {
        track.render(true);
        expect(track.elem.parentNode).toContainElement(track.elem.parentNode.querySelector('.range-slider__range-bg'));
        expect(track.track).toHaveClass('range-slider__range-bg');
        expect(track.track).toBeVisible();
    });
    test('should render track with option "bar" - false', () => {
        track.render(false);
        expect(track.elem.parentNode).toContainElement(track.elem.parentNode.querySelector('.range-slider__range-bg'));
        expect(track.track).toHaveClass('range-slider__range-bg');
        expect(track.track).not.toBeVisible();
    });
});

describe('Subview - Track: change', () => {
    beforeEach(() => {
        track = new Track(wrapper);
    });
    afterEach(() => {
        track.remove();
    });
    test('should change style properties', () => {
        track.render(true);
        track.change(10, 20, false);

        expect(track.track.style.left).toEqual('10%');
        expect(track.track.style.width).toEqual('10%');
    });
    test('should change style properties', () => {
        track.render(true);
        track.change(10, 20, true);

        expect(track.track.style.top).toEqual('10%');
        expect(track.track.style.height).toEqual('10%');
    });
});

describe('Subview - Track: remove', () => {
    beforeEach(() => {
        track = new Track(wrapper);
    });
    test('should remove track', () => {
        track.render(true);

        track.remove();
        expect(track.track).not.toBeInTheDocument();
    });
    test('should remove track', () => {
        track.remove();
        expect(track.track).toBeFalsy();
    });
});
