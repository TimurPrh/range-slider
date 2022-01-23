/**
 * @jest-environment jsdom
*/

import '@testing-library/jest-dom';
import Inputs from "../subViews/inputs";

let wrapper;
let inputs;

beforeAll(() => {
    wrapper = document.createElement('div');
    document.body.appendChild(wrapper);
});

describe('Subview - Inputs: render', () => {
    beforeEach(() => {
        inputs = new Inputs(wrapper);
    });
    afterEach(() => {
        inputs.remove();
    });
    test('should render inputs', () => {
        const viewModel = {
            sliderMin: 0,
            sliderMax: 100,
            sliderStep: 10,
        };
        inputs.render(viewModel);
        expect(inputs.elem).toContainElement(inputs.elem.querySelector('.range-slider__input'));
        inputs.inputs.forEach((input, i) => {
            expect(input.tagName).toEqual('INPUT');
            expect(input).toHaveClass('range-slider__input');
            expect(input.type).toBe('range');
            expect(input.min).toBe(`${viewModel.sliderMin}`);
            expect(input.max).toBe(`${viewModel.sliderMax}`);
            expect(input.step).toBe(`${viewModel.sliderStep}`);
        });
    });
});

describe('Subview - Inputs: change', () => {
    beforeEach(() => {
        inputs = new Inputs(wrapper);
        const viewModel = {
            sliderMin: 0,
            sliderMax: 100,
            sliderStep: 10,
        };
        inputs.render(viewModel);
    });
    afterEach(() => {
        inputs.remove();
    });
    test('should change style properties', () => {
        expect(inputs.change(20, 0)).toEqual('20');
        expect(inputs.inputs[0].value).toEqual('20');
    });
    test('should change style properties', () => {
        expect(inputs.change(40, 1)).toEqual('40');
        expect(inputs.inputs[1].value).toEqual('40');
    });
});

describe('Subview - Inputs: remove', () => {
    beforeEach(() => {
        inputs = new Inputs(wrapper);
    });
    test('should remove inputs', () => {
        inputs.remove();
        expect(inputs.inputs).toBeFalsy();
    });
    test('should remove inputs', () => {
        const viewModel = {
            sliderMin: 0,
            sliderMax: 100,
            sliderStep: 10,
        };
        inputs.render(viewModel);

        inputs.remove();
        inputs.inputs.forEach((input) => {
            expect(input).not.toBeInTheDocument();
        });
    });
});
