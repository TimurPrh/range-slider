/**
 * @jest-environment jsdom
*/

import $ from 'jquery';
import '@testing-library/jest-dom';
import Track from "../subViews/track";

let $wrapper;
let track;

beforeAll(() => {
  $('<div>', {
    class: 'test-elem',
  }).appendTo('body');
  $wrapper = $('.test-elem');
});

describe('Subview - Track: render', () => {
  beforeEach(() => {
    track = new Track($wrapper);
  });
  afterEach(() => {
    track.remove();
  });
  test('should render $track with option "bar" - true', () => {
    track.render(true);
    const trackElem = document.querySelector('.range-slider__range-bg');
    expect(document.querySelector('body')).toContainElement(trackElem);
    expect(trackElem).toHaveClass('range-slider__range-bg');
    expect(trackElem).toBeVisible();
  });
  test('should render $track with option "bar" - false', () => {
    track.render(false);
    const trackElem = document.querySelector('.range-slider__range-bg');
    expect(document.querySelector('body')).toContainElement(trackElem);
    expect(trackElem).toHaveClass('range-slider__range-bg');
    expect(trackElem).not.toBeVisible();
  });
});

describe('Subview - Track: change', () => {
  beforeEach(() => {
    track = new Track($wrapper);
  });
  afterEach(() => {
    track.remove();
  });
  test('should change style properties', () => {
    track.render(true);
    track.change(10, 20, false);
    const trackElem = document.querySelector('.range-slider__range-bg');
    expect(trackElem.style.left).toEqual('10%');
    expect(trackElem.style.width).toEqual('10%');
  });
  test('should change style properties', () => {
    track.render(true);
    track.change(10, 20, true);
    const trackElem = document.querySelector('.range-slider__range-bg');
    expect(trackElem.style.top).toEqual('10%');
    expect(trackElem.style.height).toEqual('10%');
  });
});

describe('Subview - Track: remove', () => {
  beforeEach(() => {
    track = new Track($wrapper);
  });
  test('should remove $track', () => {
    track.render(true);
    track.remove();

    const trackElem = document.querySelector('.range-slider__range-bg');
    expect(trackElem).toBeFalsy();
  });
  test('should remove $track', () => {
    track.remove();

    const trackElem = document.querySelector('.range-slider__range-bg');
    expect(trackElem).toBeFalsy();
  });
});
