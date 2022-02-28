/**
 * @jest-environment jsdom
*/

import $ from 'jquery';
import '@testing-library/jest-dom';
import Border from "../subViews/border";

let $wrapper;
let border;

beforeAll(() => {
  $('<div>', {
    class: 'test-elem',
  }).appendTo('body');
  $wrapper = $('.test-elem');
});

describe('Subview - Border: render', () => {
  beforeEach(() => {
    border = new Border($wrapper);
  });
  afterEach(() => {
    border.remove();
  });
  test('should render border', () => {
    border.render();

    const borderElem = document.querySelector('.range-slider__border');
    expect(borderElem.parentNode).toContainElement(borderElem);
    expect(borderElem).toHaveClass('range-slider__border');
    expect(borderElem).toBeVisible();
  });
});

describe('Subview - Border: remove', () => {
  beforeEach(() => {
    border = new Border($wrapper);
  });
  test('should remove border', () => {
    border.render();
    border.remove();

    const borderElem = document.querySelector('.range-slider__border');
    expect(borderElem).not.toBeInTheDocument();
  });
  test('should remove border', () => {
    border.remove();
    expect(border.$border).toBeFalsy();
  });
});
