/**
 * @jest-environment jsdom
*/

import '@testing-library/jest-dom';
import SliderView from "../view";

import Inputs from "../subViews/inputs";
import Labels from "../subViews/labels";
import Scale from "../subViews/scale";
import Thumbs from "../subViews/thumbs";
import Track from "../subViews/track";

jest.mock("../subViews/inputs");
jest.mock("../subViews/labels");
jest.mock("../subViews/scale");
jest.mock("../subViews/thumbs");
jest.mock("../subViews/track");

let wrapper;
let view;

beforeAll(() => {
    wrapper = document.createElement('div');
    document.body.appendChild(wrapper);
});

describe('View: render', () => {
    beforeEach(() => {
        Inputs.mockClear();
        Labels.mockClear();
        Scale.mockClear();
        Thumbs.mockClear();
        Track.mockClear();

        view = new SliderView(wrapper);
    });
    afterEach(() => {
        view.removeSubViews();
    });

    test('should render view', () => {
        view.render();
        expect(view.rangeSlider).toHaveClass('range-slider');
        expect(view.rangeSlider).toBeVisible();

        expect(Inputs).toHaveBeenCalledTimes(1);
        expect(Labels).toHaveBeenCalledTimes(1);
        expect(Scale).toHaveBeenCalledTimes(1);
        expect(Thumbs).toHaveBeenCalledTimes(1);
        expect(Track).toHaveBeenCalledTimes(1);
    });
});

describe('View: initParams', () => {
    beforeEach(() => {
        Inputs.mockClear();
        Labels.mockClear();
        Scale.mockClear();
        Thumbs.mockClear();
        Track.mockClear();

        view = new SliderView(wrapper);
    });
    afterEach(() => {
        view.removeSubViews();
    });

    test('should initialize parameters', () => {
        const opts = {
            viewModel: {
                sliderMin: 0,
                sliderMax: 100,
                sliderStep: 10,
            },
            isVertical: false,
            isRange: true,
            scale: true,
            tip: true,
            bar: true,
            stepDegree: 1,
        };
        view.initParams(...Object.values(opts));

        expect(view.rangeSlider).toHaveClass('range-slider');
        expect(view.rangeSlider).toBeVisible();
        expect(Track).toHaveBeenCalledTimes(1);

        // mock track
        const mockTrackInstance = Track.mock.instances[0];
        const mockTrackRender = mockTrackInstance.render;
        expect(mockTrackRender.mock.calls[0][0]).toEqual(opts.bar);
        expect(mockTrackRender).toHaveBeenCalledTimes(1);

        // mock thumbs
        const mockThumbsInstance = Thumbs.mock.instances[0];
        const mockThumbsRender = mockThumbsInstance.render;
        expect(mockThumbsRender.mock.calls[0][0]).toEqual(opts.isRange);
        expect(mockThumbsRender).toHaveBeenCalledTimes(1);

        // mock labels
        const mockLabelsInstance = Labels.mock.instances[0];
        const mockLabelsRender = mockLabelsInstance.render;
        expect(mockLabelsRender.mock.calls[0][0]).toEqual(opts.isVertical);
        expect(mockLabelsRender).toHaveBeenCalledTimes(1);

        // mock inputs
        const mockInputsInstance = Inputs.mock.instances[0];
        const mockInputsRender = mockInputsInstance.render;
        expect(mockInputsRender.mock.calls[0][0]).toEqual(opts.viewModel);
        expect(mockInputsRender).toHaveBeenCalledTimes(1);

        // mock scale
        const mockScaleInstance = Scale.mock.instances[0];
        const mockScaleRender = mockScaleInstance.render;
        expect(mockScaleRender.mock.calls[0][0]).toEqual(opts.scale);
        expect(mockScaleRender.mock.calls[0][1]).toEqual(opts.isVertical);
        expect(mockScaleRender.mock.calls[0][2]).toEqual(opts.viewModel);
        expect(mockScaleRender.mock.calls[0][3]).toEqual(opts.stepDegree);
        expect(mockScaleRender.mock.calls[0][4]).toEqual(0);
        expect(mockScaleRender.mock.calls[0][5]).toEqual(0);
        expect(mockScaleRender).toHaveBeenCalledTimes(1);
    });
    test('should initialize parameters', () => {
        const opts = {
            viewModel: {
                sliderMin: 0,
                sliderMax: 100,
                sliderStep: 10,
            },
            isVertical: true,
            isRange: true,
            scale: true,
            tip: true,
            bar: true,
            stepDegree: 1,
        };

        view.initParams(...Object.values(opts));

        expect(view.rangeSlider).toHaveClass('range-slider');
        expect(view.slider).toHaveClass('range-slider__wrapper_vertical');
        expect(view.rangeSlider).toBeVisible();
        expect(Track).toHaveBeenCalledTimes(1);
    });
});

describe('View: moveAt', () => {
    beforeEach(() => {
        Inputs.mockClear();
        Labels.mockClear();
        Scale.mockClear();
        Thumbs.mockClear();
        Track.mockClear();

        view = new SliderView(wrapper);
    });
    afterEach(() => {
        view.removeSubViews();
    });
    test('should move at specified position', () => {
        const moveAtOpts = {
            obj: {
                thumbs: [
                    {
                        ox: 0,
                        value: 0,
                    },
                    {
                        ox: 100,
                        value: 100,
                    },
                ],
                track: {
                    begin: 0,
                    end: 100,
                },
            },
            id: 0,
        };
        Object.defineProperty(view.trackModule, 'track', { value: { offsetWidth: 100 } });
        Object.defineProperty(view.thumbsModule, 'thumbs', { value: ['', { offsetWidth: 10 }] });
        view.isVertical = false;
        view.moveAt(...Object.values(moveAtOpts));

        // mock track
        const mockTrackInstance = Track.mock.instances[0];
        const mockTrackChange = mockTrackInstance.change;
        expect(mockTrackChange.mock.calls[0][0]).toEqual(moveAtOpts.obj.track.begin);
        expect(mockTrackChange.mock.calls[0][1]).toEqual(moveAtOpts.obj.track.end);
        expect(mockTrackChange.mock.calls[0][2]).toEqual(view.isVertical);
        expect(mockTrackChange).toHaveBeenCalledTimes(1);
    });
    test('should move at specified position with range option', () => {
        const moveAtOpts = {
            obj: {
                thumbs: [
                    {
                        ox: 0,
                        value: 0,
                    },
                    {
                        ox: 100,
                        value: 100,
                    },
                ],
                track: {
                    begin: 0,
                    end: 100,
                },
            },
            id: 0,
        };
        Object.defineProperty(view.trackModule, 'track', { value: { offsetWidth: 100 } });
        Object.defineProperty(view.thumbsModule, 'thumbs', { value: ['', { offsetWidth: 10 }] });
        view.isRange = true;
        view.moveAt(...Object.values(moveAtOpts));

        // mock track
        const mockTrackInstance = Track.mock.instances[0];
        const mockTrackChange = mockTrackInstance.change;
        expect(mockTrackChange.mock.calls[0][0]).toEqual(moveAtOpts.obj.track.begin);
        expect(mockTrackChange.mock.calls[0][1]).toEqual(moveAtOpts.obj.track.end);
        expect(mockTrackChange.mock.calls[0][2]).toEqual(view.isVertical);
        expect(mockTrackChange).toHaveBeenCalledTimes(1);

        // mock inputs
        const { id } = moveAtOpts;
        const mockInputsInstance = Inputs.mock.instances[0];
        const mockInputsChange = mockInputsInstance.change;
        expect(mockInputsChange.mock.calls[0][0]).toEqual(moveAtOpts.obj.thumbs[id].value);
        expect(mockInputsChange.mock.calls[0][1]).toEqual(id);
        expect(mockInputsChange).toHaveBeenCalledTimes(1);

        // mock labels
        const mockLabelsInstance = Labels.mock.instances[0];
        const mockLabelsChange = mockLabelsInstance.change;
        expect(mockLabelsChange.mock.calls[0][0]).toEqual(id);
        expect(mockLabelsChange.mock.calls[0][1]).toEqual(moveAtOpts.obj.thumbs[id].ox);
        expect(mockLabelsChange.mock.calls[0][2]).toEqual(50);
        expect(mockLabelsChange.mock.calls[0][4]).toEqual(view.isVertical);
        expect(mockLabelsChange.mock.calls[0][5]).toEqual(view.tip);
        expect(mockLabelsChange).toHaveBeenCalledTimes(1);

        // mock thumbs
        const mockThumbsInstance = Thumbs.mock.instances[0];
        const mockThumbsChange = mockThumbsInstance.change;
        expect(mockThumbsChange.mock.calls[0][0]).toEqual(id);
        expect(mockThumbsChange.mock.calls[0][1]).toEqual(moveAtOpts.obj.thumbs[id].ox);
        expect(mockThumbsChange.mock.calls[0][2]).toEqual(view.isVertical);
        expect(mockThumbsChange).toHaveBeenCalledTimes(1);
    });
});

describe('View: getSliderWidth', () => {
    beforeEach(() => {
        Inputs.mockClear();
        Labels.mockClear();
        Scale.mockClear();
        Thumbs.mockClear();
        Track.mockClear();

        view = new SliderView(wrapper);
    });
    afterEach(() => {
        view.removeSubViews();
    });
    test('should return actual size of the slider', () => {
        const offset = 100;
        view.isVertical = false;
        Object.defineProperty(view.slider, 'offsetWidth', { value: offset });

        expect(view.getSliderWidth()).toEqual(offset);
    });
    test('should return actual size of the slider', () => {
        const offset = 100;
        view.isVertical = true;
        Object.defineProperty(view.slider, 'offsetHeight', { value: offset });

        expect(view.getSliderWidth()).toEqual(offset);
    });
});
