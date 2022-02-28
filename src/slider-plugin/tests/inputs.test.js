/**
 * @jest-environment jsdom
*/

import $ from 'jquery';
import '@testing-library/jest-dom';
import Inputs from "../subViews/inputs";

let $wrapper;
let inputs;

beforeAll(() => {
  $('<div>', {
    class: 'test-elem',
  }).appendTo('body');
  $wrapper = $('.test-elem');
});

describe('Subview - Inputs: render', () => {
  beforeEach(() => {
    inputs = new Inputs($wrapper);
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

    const inputElements = document.querySelectorAll('.range-slider__input');
    expect(document.querySelector('body')).toContainElement(inputElements[0]);
    inputElements.forEach((input, i) => {
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
    inputs = new Inputs($wrapper);
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

    const inputElements = document.querySelectorAll('.range-slider__input');
    expect(inputElements[0].value).toEqual('20');
  });
  test('should change style properties', () => {
    expect(inputs.change(40, 1)).toEqual('40');

    const inputElements = document.querySelectorAll('.range-slider__input');
    expect(inputElements[1].value).toEqual('40');
  });
});

describe('Subview - Inputs: remove', () => {
  beforeEach(() => {
    inputs = new Inputs($wrapper);
  });
  test('should remove inputs', () => {
    inputs.remove();
    expect(inputs.$inputs).toBeFalsy();
  });
  test('should remove inputs', () => {
    const viewModel = {
      sliderMin: 0,
      sliderMax: 100,
      sliderStep: 10,
    };
    inputs.render(viewModel);

    inputs.remove();
    inputs.$inputs.each((i, input) => {
      expect(input).not.toBeInTheDocument();
    });
  });
});
