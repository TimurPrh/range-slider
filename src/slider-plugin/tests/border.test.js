/**
 * @jest-environment jsdom
*/

import '@testing-library/jest-dom';
import Border from "../subViews/border";

let wrapper;
let border;

beforeAll(() => {
    wrapper = document.createElement('div');
    document.body.appendChild(wrapper);
});

describe('Subview - Border: render', () => {
    beforeEach(() => {
        border = new Border(wrapper);
    });
    afterEach(() => {
        border.remove();
    });
    test('should render border', () => {
        border.render();
        expect(border.elem.parentNode).toContainElement(border.elem.parentNode.querySelector('.range-slider__border'));
        expect(border.border).toHaveClass('range-slider__border');
        expect(border.border).toBeVisible();
    });
});

describe('Subview - Border: remove', () => {
    beforeEach(() => {
        border = new Border(wrapper);
    });
    test('should remove border', () => {
        border.render();

        border.remove();
        expect(border.border).not.toBeInTheDocument();
    });
    test('should remove border', () => {
        border.remove();
        expect(border.border).toBeFalsy();
    });
});
