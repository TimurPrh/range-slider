/**
 * @jest-environment jsdom
*/

import '@testing-library/jest-dom';
import Scale from "../subViews/scale";

let wrapper;
let scale;

beforeAll(() => {
    wrapper = document.createElement('div');
    document.body.appendChild(wrapper);
});

describe('Subview - scale: render', () => {
    beforeEach(() => {
        scale = new Scale(wrapper);
    });
    afterEach(() => {
        scale.remove();
    });
    test('should not render scale', () => {
        const opts = {
            scale: false,
            vertical: false,
            viewModel: {
                sliderMin: 0,
                sliderMax: 100,
                sliderStep: 10,
            },
            stepDegree: 1,
            offsetWidth: 100,
            offsetHeight: 100,
        };
        scale.render(...Object.values(opts));

        expect(scale.scaleElement).toBeFalsy();
    });
    test('should render scale with option "vertical" - false', () => {
        const opts = {
            scale: true,
            vertical: false,
            viewModel: {
                sliderMin: 0,
                sliderMax: 100,
                sliderStep: 10,
            },
            stepDegree: 1,
            offsetWidth: 100,
            offsetHeight: 100,
        };
        scale.render(...Object.values(opts));

        expect(scale.scaleElement).toBeInTheDocument();
        expect(scale.scaleElement).toHaveClass('range-slider__scale');
        expect(scale.scaleElement).toBeVisible();
    });
    test('should render scale with option "vertical" - false', () => {
        const opts = {
            scale: true,
            vertical: false,
            viewModel: {
                sliderMin: 0,
                sliderMax: 100,
                sliderStep: 0.25,
            },
            stepDegree: 0,
            offsetWidth: 100,
            offsetHeight: 100,
        };

        scale.render(...Object.values(opts));

        scale.scaleElement.childNodes.forEach((node) => {
            Object.defineProperty(node, 'clientWidth', { value: 10 });
        });

        scale.checkCapacity('clientWidth', opts.viewModel);

        expect(scale.scaleElement).toBeInTheDocument();
        expect(scale.scaleElement).toHaveClass('range-slider__scale');
        expect(scale.scaleElement).toBeVisible();
    });
    test('should render scale with option "vertical" - true', () => {
        const opts = {
            scale: true,
            vertical: true,
            viewModel: {
                sliderMin: 0,
                sliderMax: 100,
                sliderStep: 10,
            },
            stepDegree: 1,
            offsetWidth: 100,
            offsetHeight: 100,
        };
        scale.render(...Object.values(opts));

        expect(scale.scaleElement).toBeInTheDocument();
        expect(scale.scaleElement).toHaveClass('range-slider__scale');
        expect(scale.scaleElement).toHaveClass('range-slider__scale_vertical');
        expect(scale.scaleElement).toBeVisible();
    });
    test('should render scale with option "vertical" - true', () => {
        const opts = {
            scale: true,
            vertical: true,
            viewModel: {
                sliderMin: 0,
                sliderMax: 100,
                sliderStep: 0.25,
            },
            stepDegree: 0,
            offsetWidth: 100,
            offsetHeight: 100,
        };

        scale.render(...Object.values(opts));

        scale.scaleElement.childNodes.forEach((node) => {
            Object.defineProperty(node, 'clientHeight', { value: 10 });
        });

        scale.checkCapacity('clientHeight', opts.viewModel);

        expect(scale.scaleElement).toBeInTheDocument();
        expect(scale.scaleElement).toHaveClass('range-slider__scale');
        expect(scale.scaleElement).toHaveClass('range-slider__scale_vertical');
        expect(scale.scaleElement).toBeVisible();
    });
    test('should render scale with option "vertical" - true and indivisible range', () => {
        const opts = {
            scale: true,
            vertical: true,
            viewModel: {
                sliderMin: 0,
                sliderMax: 95,
                sliderStep: 10,
            },
            stepDegree: 0,
            offsetWidth: 100,
            offsetHeight: 100,
        };

        scale.render(...Object.values(opts));

        scale.scaleElement.childNodes.forEach((node) => {
            Object.defineProperty(node, 'clientHeight', { value: 10 });
        });

        scale.checkCapacity('clientHeight', opts.viewModel);

        expect(scale.scaleElement).toBeInTheDocument();
        expect(scale.scaleElement).toHaveClass('range-slider__scale');
        expect(scale.scaleElement).toHaveClass('range-slider__scale_vertical');
        expect(scale.scaleElement).toBeVisible();
    });
});

describe('Subview - scale: remove', () => {
    beforeEach(() => {
        scale = new Scale(wrapper);
    });
    test('should remove scale', () => {
        const opts = {
            scale: true,
            vertical: false,
            viewModel: {
                sliderMin: 0,
                sliderMax: 100,
                sliderStep: 10,
            },
            stepDegree: 0,
            offsetWidth: 100,
            offsetHeight: 100,
        };
        scale.render(...Object.values(opts));

        scale.remove();
        expect(scale.scaleElement).not.toBeInTheDocument();
    });
    test('should remove scale', () => {
        scale.remove();
        expect(scale.scaleElement).toBeFalsy();
    });
});

describe('Subview - scale: findDer', () => {
    beforeEach(() => {
        scale = new Scale(wrapper);
    });
    afterEach(() => {
        scale.remove();
    });
    test('should find minimum value', () => {
        expect(scale.findDer(1, 100, 1.5)).toEqual(2);
        expect(scale.findDer(4, 100, 5)).toEqual(20);
    });
});

describe('Subview - scale: roundValue', () => {
    beforeEach(() => {
        scale = new Scale(wrapper);
    });
    afterEach(() => {
        scale.remove();
    });

    test('should round value', () => {
        scale.stepDegree = 1;
        expect(scale.roundValue(12)).toEqual(10);
    });
    test('should round value', () => {
        scale.stepDegree = 1;
        expect(scale.roundValue(8e0)).toEqual(10);
    });
    test('should round value', () => {
        scale.stepDegree = 1;
        expect(scale.roundValue(8e1)).toEqual(80);
    });
    test('should round value', () => {
        scale.stepDegree = 10;
        expect(scale.roundValue(12e3)).toEqual(0);
    });
    test('should round value', () => {
        scale.stepDegree = -1;
        expect(scale.roundValue(1.23)).toEqual(1.2);
    });
    test('should round value', () => {
        scale.stepDegree = -3;
        expect(scale.roundValue(1.27)).toEqual(1.27);
    });
    test('should round value', () => {
        scale.stepDegree = 0;
        expect(scale.roundValue(6.6, 0)).toEqual(7);
    });
    test('should round value', () => {
        scale.stepDegree = -1;
        expect(scale.roundValue(7.105427357601002e-15)).toEqual(0);
    });
    test('should round value', () => {
        scale.stepDegree = -1;
        expect(scale.roundValue(7.105427357601002e105)).toEqual(7.105427357601002e+105);
    });
});
