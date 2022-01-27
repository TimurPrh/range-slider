/**
 * @jest-environment jsdom
*/

import '@testing-library/jest-dom';
import Thumbs from "../subViews/thumbs";

let wrapper;
let thumbs;

beforeAll(() => {
    wrapper = document.createElement('div');
    document.body.appendChild(wrapper);
});

describe('Subview - Thumbs: render', () => {
    beforeEach(() => {
        thumbs = new Thumbs(wrapper);
    });
    afterEach(() => {
        thumbs.remove();
    });
    test('should render thumbs with option "isRange" - true', () => {
        thumbs.render(true);
        expect(thumbs.elem).toContainElement(thumbs.elem.querySelector('.range-slider__thumb'));
        thumbs.thumbs.forEach((thumb) => {
            expect(thumb).toHaveClass('range-slider__thumb');
            expect(thumb).toBeVisible();
        });
    });
    test('should render thumbs with option "isRange" - false', () => {
        thumbs.render(false);
        expect(thumbs.elem).toContainElement(thumbs.elem.querySelector('.range-slider__thumb'));
        thumbs.thumbs.forEach((thumb) => {
            expect(thumb).toHaveClass('range-slider__thumb');
        });
        expect(thumbs.thumbs[0]).not.toBeVisible();
        expect(thumbs.thumbs[1]).toBeVisible();
    });
});

describe('Subview - Thumbs: change', () => {
    beforeEach(() => {
        thumbs = new Thumbs(wrapper);
    });
    afterEach(() => {
        thumbs.remove();
    });
    test('should change style properties', () => {
        thumbs.render(true);
        thumbs.change(0, 50, false);
        thumbs.change(1, 70, false);

        expect(thumbs.thumbs[0].style.left).toEqual('50%');
        expect(thumbs.thumbs[1].style.left).toEqual('70%');
    });
    test('should change style properties with vertical option', () => {
        thumbs.render(true);
        thumbs.change(0, 50, true);
        thumbs.change(1, 70, true);

        expect(thumbs.thumbs[0].style.top).toEqual('50%');
        expect(thumbs.thumbs[1].style.top).toEqual('70%');
    });
});

describe('Subview - Thumbs: remove', () => {
    beforeEach(() => {
        thumbs = new Thumbs(wrapper);
    });
    test('should remove thumbs', () => {
        thumbs.remove();
        expect(thumbs.thumbs).toBeFalsy();
    });
    test('should remove thumbs', () => {
        thumbs.render(true);

        thumbs.remove();
        thumbs.thumbs.forEach((thumb) => {
            expect(thumb).not.toBeInTheDocument();
        });
    });
});
