/**
 * @jest-environment jsdom
*/

import '@testing-library/jest-dom';
import Labels from "../subViews/labels";

let wrapper;
let labels;

beforeAll(() => {
    wrapper = document.createElement('div');
    document.body.appendChild(wrapper);
});

describe('Subview - Labels: render', () => {
    beforeEach(() => {
        labels = new Labels(wrapper);
    });
    afterEach(() => {
        labels.remove();
    });
    test('should render labels with option "isVertical" - true', () => {
        labels.render(true);
        expect(labels.elem).toContainElement(labels.elem.querySelector('.range-slider__result'));
        labels.labels.forEach((label) => {
            expect(label.tagName).toEqual('LABEL');
            expect(label).toHaveClass('range-slider__result');
            expect(label).toHaveClass('range-slider__result_vertical');
            expect(label).toBeVisible();
        });
    });
    test('should render labels with option "isVertical" - false', () => {
        labels.render(false);
        expect(labels.elem).toContainElement(labels.elem.querySelector('.range-slider__result'));
        labels.labels.forEach((label) => {
            expect(label.tagName).toEqual('LABEL');
            expect(label).toHaveClass('range-slider__result');
            expect(label).not.toHaveClass('range-slider__result_vertical');
            expect(label).toBeVisible();
        });
    });
});

describe('Subview - Labels: change', () => {
    beforeEach(() => {
        labels = new Labels(wrapper);
    });
    afterEach(() => {
        labels.remove();
    });
    test('should change style properties', () => {
        const opts = {
            id: 0,
            thumbOx: 50,
            offsetLeft: 50,
            inputVal: 100,
            vertical: false,
            tip: true,
        };
        labels.render(opts.vertical);
        labels.change(...Object.values(opts));

        expect(labels.labels[opts.id]).toBeVisible();
        expect(labels.labels[opts.id].style.left).toEqual(`${opts.thumbOx}%`);
        expect(labels.labels[opts.id].innerHTML).toEqual(`${opts.inputVal}`);
    });
    test('should change style properties', () => {
        const opts = {
            id: 1,
            thumbOx: 50,
            offsetLeft: 50,
            inputVal: 100,
            vertical: true,
            tip: true,
        };
        labels.render(opts.vertical);
        labels.change(...Object.values(opts));

        expect(labels.labels[opts.id]).toBeVisible();
        expect(labels.labels[opts.id].style.top).toEqual(`${opts.thumbOx}%`);
        expect(labels.labels[opts.id].style.marginLeft).toEqual(`${opts.offsetLeft + 5}px`);
        expect(labels.labels[opts.id].innerHTML).toEqual(`${opts.inputVal}`);
    });

    test('should change style properties and not visible', () => {
        const opts = {
            id: 0,
            thumbOx: 50,
            offsetLeft: 50,
            inputVal: 100,
            vertical: false,
            tip: false,
        };
        labels.render(opts.vertical);
        labels.change(...Object.values(opts));

        expect(labels.labels[opts.id]).not.toBeVisible();
        expect(labels.labels[opts.id].innerHTML).toEqual(`${opts.inputVal}`);
    });
    test('should change style properties and not visible', () => {
        const opts = {
            id: 1,
            thumbOx: 50,
            offsetLeft: 50,
            inputVal: 100,
            vertical: true,
            tip: false,
        };
        labels.render(opts.vertical);
        labels.change(...Object.values(opts));

        expect(labels.labels[opts.id]).not.toBeVisible();
        expect(labels.labels[opts.id].innerHTML).toEqual(`${opts.inputVal}`);
    });
});

describe('Subview - labels: remove', () => {
    beforeEach(() => {
        labels = new Labels(wrapper);
    });
    test('should remove labels', () => {
        labels.remove();
        expect(labels.labels).toBeFalsy();
    });
    test('should remove labels', () => {
        labels.render(true);

        labels.remove();
        labels.labels.forEach((label) => {
            expect(label).not.toBeInTheDocument();
        });
    });
});
