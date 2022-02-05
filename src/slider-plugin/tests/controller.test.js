/**
 * @jest-environment jsdom
*/

import '@testing-library/jest-dom';
// eslint-disable-next-line no-unused-vars
import ResizeObserver from './__mocks__/ResizeObserver';
import SliderController from '../controller';
import SliderView from '../view';
import SliderModel from '../model';

jest.mock("../view");
jest.mock("../model");

let controller;

describe('Controller: initialize', () => {
    beforeEach(() => {
        SliderView.mockClear();
        SliderModel.mockClear();

        controller = new SliderController();
    });

    test('should initialize slider', () => {
        Object.defineProperty(controller.sliderView, 'thumbsModule', { value: { onMoveThumb: null } });
        controller.sliderView.getSliderWidth = jest.fn(() => 200);
        Object.defineProperty(controller.sliderView, '$rangeSlider', { value: { resize: jest.fn((callback) => callback()) } });

        Object.defineProperty(controller.sliderModel, 'outputOx', { value: 'test Ox' });
        Object.defineProperty(controller.sliderModel, 'isRange', { value: false });
        Object.defineProperty(controller.sliderModel, 'isVertical', { value: false });

        controller.initialize();

        expect(SliderView).toHaveBeenCalledTimes(1);
        expect(SliderModel).toHaveBeenCalledTimes(1);

        expect(controller.sliderModel.offsetWidth).toEqual(200);

        // mock model
        const mockModelInstance = SliderModel.mock.instances[0];
        const mockModelSetInitialSettings = mockModelInstance.setInitialSettings;
        const mockModelInitView = mockModelInstance.initView;
        const mockModelSetInitialOutput = mockModelInstance.setInitialOutput;

        expect(mockModelSetInitialSettings.mock.calls[0][0]).toEqual(undefined);
        expect(mockModelSetInitialSettings).toHaveBeenCalledTimes(1);
        expect(mockModelInitView).toHaveBeenCalledTimes(1);
        expect(mockModelSetInitialOutput).toHaveBeenCalledTimes(1);

        // mock view
        const mockViewInstance = SliderView.mock.instances[0];
        const mockViewMoveAt = mockViewInstance.moveAt;
        expect(mockViewMoveAt.mock.calls[0][0]).toEqual('test Ox');
        expect(mockViewMoveAt.mock.calls[0][1]).toEqual(1);
        expect(mockViewMoveAt).toHaveBeenCalledTimes(1);
    });
    test('should initialize slider with options isVertical and isRange - true', () => {
        Object.defineProperty(controller.sliderView, 'thumbsModule', { value: { onMoveThumb: null } });
        controller.sliderView.getSliderWidth = jest.fn(() => 200);
        Object.defineProperty(controller.sliderView, '$rangeSlider', { value: { resize: jest.fn((callback) => callback()) } });

        Object.defineProperty(controller.sliderModel, 'outputOx', { value: 'test Ox' });
        Object.defineProperty(controller.sliderModel, 'isRange', { value: true });
        Object.defineProperty(controller.sliderModel, 'isVertical', { value: true });

        controller.initialize();

        expect(SliderView).toHaveBeenCalledTimes(1);
        expect(SliderModel).toHaveBeenCalledTimes(1);

        expect(controller.sliderModel.offsetWidth).toEqual(200);

        // mock model
        const mockModelInstance = SliderModel.mock.instances[0];
        const mockModelSetInitialSettings = mockModelInstance.setInitialSettings;
        const mockModelInitView = mockModelInstance.initView;
        const mockModelSetInitialOutput = mockModelInstance.setInitialOutput;

        expect(mockModelSetInitialSettings.mock.calls[0][0]).toEqual(undefined);
        expect(mockModelSetInitialSettings).toHaveBeenCalledTimes(1);
        expect(mockModelInitView).toHaveBeenCalledTimes(1);
        expect(mockModelSetInitialOutput).toHaveBeenCalledTimes(1);

        // mock view
        const mockViewInstance = SliderView.mock.instances[0];
        const mockViewMoveAt = mockViewInstance.moveAt;
        expect(mockViewMoveAt.mock.calls[0][0]).toEqual('test Ox');
        expect(mockViewMoveAt.mock.calls[0][1]).toEqual(1);
        expect(mockViewMoveAt.mock.calls[1][0]).toEqual('test Ox');
        expect(mockViewMoveAt.mock.calls[1][1]).toEqual(0);
        expect(mockViewMoveAt).toHaveBeenCalledTimes(2);
    });
});

describe('Controller: reInitialize', () => {
    beforeEach(() => {
        SliderView.mockClear();
        SliderModel.mockClear();

        controller = new SliderController();
    });

    test('should reinitialize slider', () => {
        Object.defineProperty(controller.sliderView, 'thumbsModule', { value: { onMoveThumb: null } });
        controller.sliderView.getSliderWidth = jest.fn(() => 200);
        Object.defineProperty(controller.sliderView, '$rangeSlider', { value: { resize: jest.fn((callback) => callback()) } });

        Object.defineProperty(controller.sliderModel, 'outputOx', { value: 'test Ox' });
        Object.defineProperty(controller.sliderModel, 'isRange', { value: false });
        Object.defineProperty(controller.sliderModel, 'isVertical', { value: false });

        controller.reInitialize();

        expect(controller.sliderModel.offsetWidth).toEqual(200);

        // mock model
        const mockModelInstance = SliderModel.mock.instances[0];
        const mockModelSetSettings = mockModelInstance.setSettings;
        const mockModelInitView = mockModelInstance.initView;
        const mockModelSetInitialOutput = mockModelInstance.setInitialOutput;

        expect(mockModelSetSettings.mock.calls[0][0]).toEqual(undefined);
        expect(mockModelSetSettings).toHaveBeenCalledTimes(1);
        expect(mockModelInitView).toHaveBeenCalledTimes(1);
        expect(mockModelSetInitialOutput).toHaveBeenCalledTimes(1);

        // mock view
        const mockViewInstance = SliderView.mock.instances[0];
        const mockViewMoveAt = mockViewInstance.moveAt;
        expect(mockViewMoveAt.mock.calls[0][0]).toEqual('test Ox');
        expect(mockViewMoveAt.mock.calls[0][1]).toEqual(1);
        expect(mockViewMoveAt).toHaveBeenCalledTimes(1);
    });
});

describe('Controller: getSettings', () => {
    beforeEach(() => {
        SliderView.mockClear();
        SliderModel.mockClear();

        controller = new SliderController();
    });

    test('should get slider settings', () => {
        const settings = {
            range: true,
            vertical: false,
            scale: true,
            tip: true,
            bar: true,
            min: 0,
            max: 100,
            step: 10,
            from: 10,
            to: 20,
        };
        Object.defineProperty(controller.sliderView, 'inputsModule', { value: { $inputs: [{ value: 10 }, { value: 20 }] } });
        controller.sliderModel.isRange = settings.range;
        controller.sliderModel.isVertical = settings.vertical;
        controller.sliderModel.viewScale = settings.scale;
        controller.sliderModel.viewTip = settings.tip;
        controller.sliderModel.viewBar = settings.bar;
        controller.sliderModel.initialMin = settings.min;
        controller.sliderModel.initialMax = settings.max;
        controller.sliderModel.initialStep = settings.step;
        expect(controller.getSettings()).toEqual(settings);
    });
});

describe('Controller: initView', () => {
    beforeEach(() => {
        SliderView.mockClear();
        SliderModel.mockClear();

        controller = new SliderController();
    });
    test('should call view function initParams', () => {
        const props = {
            sliderMin: 0,
            sliderMax: 100,
            sliderStep: 10,
        };
        controller.sliderModel.isRange = true;
        controller.sliderModel.isVertical = false;
        controller.sliderModel.viewScale = true;
        controller.sliderModel.viewTip = true;
        controller.sliderModel.viewBar = true;
        controller.sliderModel.stepDegree = 1;

        controller.initView(props);

        // mock view
        const mockViewInstance = SliderView.mock.instances[0];
        const mockViewInitParams = mockViewInstance.initParams;
        expect(mockViewInitParams.mock.calls[0][0]).toEqual(props);
        expect(mockViewInitParams.mock.calls[0][1]).toEqual(controller.sliderModel.isVertical);
        expect(mockViewInitParams.mock.calls[0][2]).toEqual(controller.sliderModel.isRange);
        expect(mockViewInitParams.mock.calls[0][3]).toEqual(controller.sliderModel.viewScale);
        expect(mockViewInitParams.mock.calls[0][4]).toEqual(controller.sliderModel.viewTip);
        expect(mockViewInitParams.mock.calls[0][5]).toEqual(controller.sliderModel.viewBar);
        expect(mockViewInitParams.mock.calls[0][6]).toEqual(controller.sliderModel.stepDegree);
        expect(mockViewInitParams).toHaveBeenCalledTimes(1);
    });
});

describe('Controller: setToValue', () => {
    beforeEach(() => {
        SliderView.mockClear();
        SliderModel.mockClear();

        controller = new SliderController();
    });
    test('should set to value in model', () => {
        Object.defineProperty(controller.sliderModel, 'outputOx', { value: 'test Ox' });
        controller.sliderModel.currentValue = [10, 20];

        controller.setToValue(150);

        expect(controller.sliderModel.currentValue[1]).toEqual(150);

        // mock model
        const mockModelInstance = SliderModel.mock.instances[0];
        const mockModelSetInitialOutput = mockModelInstance.setInitialOutput;
        expect(mockModelSetInitialOutput).toHaveBeenCalledTimes(1);

        // mock view
        const mockViewInstance = SliderView.mock.instances[0];
        const mockViewMoveAt = mockViewInstance.moveAt;
        expect(mockViewMoveAt.mock.calls[0][0]).toEqual('test Ox');
        expect(mockViewMoveAt.mock.calls[0][1]).toEqual(1);
        expect(mockViewMoveAt).toHaveBeenCalledTimes(1);
    });
});

describe('Controller: setFromValue', () => {
    beforeEach(() => {
        SliderView.mockClear();
        SliderModel.mockClear();

        controller = new SliderController();
    });
    test('should set from value in model', () => {
        Object.defineProperty(controller.sliderModel, 'outputOx', { value: 'test Ox' });
        controller.sliderModel.currentValue = [10, 20];

        controller.setFromValue(50);

        expect(controller.sliderModel.currentValue[0]).toEqual(50);

        // mock model
        const mockModelInstance = SliderModel.mock.instances[0];
        const mockModelSetInitialOutput = mockModelInstance.setInitialOutput;
        expect(mockModelSetInitialOutput).toHaveBeenCalledTimes(1);

        // mock view
        const mockViewInstance = SliderView.mock.instances[0];
        const mockViewMoveAt = mockViewInstance.moveAt;
        expect(mockViewMoveAt.mock.calls[0][0]).toEqual('test Ox');
        expect(mockViewMoveAt.mock.calls[0][1]).toEqual(0);
        expect(mockViewMoveAt).toHaveBeenCalledTimes(1);
    });
});

describe('Controller: onClickBg', () => {
    beforeEach(() => {
        SliderView.mockClear();
        SliderModel.mockClear();

        controller = new SliderController();
    });
    test('should set value on slider', () => {
        const event = {
            preventDefault: () => {},
            target: {
                classList: {
                    contains() {
                        return true;
                    },
                },
                nodeName: 'node-name',
                parentNode: 'parent-node',
            },
            pageY: 100,
            pageX: 150,
            cancelable: true,
        };
        controller.sliderModel.isVertical = false;
        Object.defineProperty(controller.sliderModel, 'outputOx', { value: 'test Ox' });
        const mockSliderCoords = jest.fn(() => ({
            left: 20,
            top: 30,
        }));
        Object.defineProperty(controller.sliderView, '$slider', { value: { offset: mockSliderCoords } });
        jest.spyOn(event, 'preventDefault');
        controller.sliderModel.calculateIndex = jest.fn((ox) => 123);

        controller.onClickBg(event);

        expect(event.preventDefault).toBeCalled();

        // mock model
        const mockModelInstance = SliderModel.mock.instances[0];
        const mockModelCalculateIndex = mockModelInstance.calculateIndex;
        const mockModelCalculateMove = mockModelInstance.calculateMove;

        expect(mockModelCalculateIndex.mock.calls[0][0]).toEqual(130);
        expect(mockModelCalculateMove.mock.calls[0][0]).toEqual(130);
        expect(mockModelCalculateMove.mock.calls[0][1]).toEqual(123);
        expect(mockModelCalculateIndex).toHaveBeenCalledTimes(1);
        expect(mockModelCalculateMove).toHaveBeenCalledTimes(1);

        // mock view
        const mockViewInstance = SliderView.mock.instances[0];
        const mockViewMoveAt = mockViewInstance.moveAt;
        expect(mockViewMoveAt.mock.calls[0][0]).toEqual('test Ox');
        expect(mockViewMoveAt.mock.calls[0][1]).toEqual(123);
        expect(mockViewMoveAt).toHaveBeenCalledTimes(1);
    });
    test('should set value on slider, because nodeName is LI', () => {
        const event = {
            preventDefault: () => {},
            target: {
                classList: {
                    contains() {
                        return false;
                    },
                },
                nodeName: 'LI',
                parentNode: {
                    classList: {
                        contains() {
                            return true;
                        },
                    },
                },
            },
            pageY: 100,
            pageX: 150,
            cancelable: true,
        };
        controller.sliderModel.isVertical = false;
        Object.defineProperty(controller.sliderModel, 'outputOx', { value: 'test Ox' });
        const mockSliderCoords = jest.fn(() => ({
            left: 20,
            top: 30,
        }));
        Object.defineProperty(controller.sliderView, '$slider', { value: { offset: mockSliderCoords } });
        jest.spyOn(event, 'preventDefault');
        controller.sliderModel.calculateIndex = jest.fn((ox) => 123);

        controller.onClickBg(event);

        expect(event.preventDefault).toBeCalled();

        // mock model
        const mockModelInstance = SliderModel.mock.instances[0];
        const mockModelCalculateIndex = mockModelInstance.calculateIndex;
        const mockModelCalculateMove = mockModelInstance.calculateMove;

        expect(mockModelCalculateIndex.mock.calls[0][0]).toEqual(130);
        expect(mockModelCalculateMove.mock.calls[0][0]).toEqual(130);
        expect(mockModelCalculateMove.mock.calls[0][1]).toEqual(123);
        expect(mockModelCalculateIndex).toHaveBeenCalledTimes(1);
        expect(mockModelCalculateMove).toHaveBeenCalledTimes(1);

        // mock view
        const mockViewInstance = SliderView.mock.instances[0];
        const mockViewMoveAt = mockViewInstance.moveAt;
        expect(mockViewMoveAt.mock.calls[0][0]).toEqual('test Ox');
        expect(mockViewMoveAt.mock.calls[0][1]).toEqual(123);
        expect(mockViewMoveAt).toHaveBeenCalledTimes(1);
    });
    test('should not set value on slider, because classList does not contains', () => {
        const event = {
            preventDefault: () => {},
            target: {
                classList: {
                    contains() {
                        return false;
                    },
                },
                nodeName: 'node-name',
                parentNode: 'parent-node',
            },
            pageY: 100,
            pageX: 150,
            cancelable: true,
        };
        controller.sliderModel.isVertical = false;
        Object.defineProperty(controller.sliderModel, 'outputOx', { value: 'test Ox' });
        const mockSliderCoords = jest.fn(() => ({
            left: 20,
            top: 30,
        }));
        Object.defineProperty(controller.sliderView, '$slider', { value: { offset: mockSliderCoords } });
        jest.spyOn(event, 'preventDefault');
        controller.sliderModel.calculateIndex = jest.fn((ox) => 123);

        controller.onClickBg(event);

        expect(event.preventDefault).toBeCalled();

        // mock model
        const mockModelInstance = SliderModel.mock.instances[0];
        const mockModelCalculateIndex = mockModelInstance.calculateIndex;
        const mockModelCalculateMove = mockModelInstance.calculateMove;

        expect(mockModelCalculateIndex).toHaveBeenCalledTimes(0);
        expect(mockModelCalculateMove).toHaveBeenCalledTimes(0);

        // mock view
        const mockViewInstance = SliderView.mock.instances[0];
        const mockViewMoveAt = mockViewInstance.moveAt;
        expect(mockViewMoveAt).toHaveBeenCalledTimes(0);
    });
    test('should set value on slider with vertical option', () => {
        const event = {
            preventDefault: () => {},
            target: {
                classList: {
                    contains() {
                        return true;
                    },
                },
                nodeName: 'node-name',
                parentNode: 'parent-node',
            },
            pageY: 100,
            pageX: 150,
            cancelable: true,
        };
        controller.sliderModel.isVertical = true;
        Object.defineProperty(controller.sliderModel, 'outputOx', { value: 'test Ox' });
        const mockSliderCoords = jest.fn(() => ({
            left: 20,
            top: 30,
        }));
        Object.defineProperty(controller.sliderView, '$slider', { value: { offset: mockSliderCoords } });
        jest.spyOn(event, 'preventDefault');
        controller.sliderModel.calculateIndex = jest.fn((ox) => 123);

        controller.onClickBg(event);

        expect(event.preventDefault).toBeCalled();

        // mock model
        const mockModelInstance = SliderModel.mock.instances[0];
        const mockModelCalculateIndex = mockModelInstance.calculateIndex;
        const mockModelCalculateMove = mockModelInstance.calculateMove;

        expect(mockModelCalculateIndex.mock.calls[0][0]).toEqual(70);
        expect(mockModelCalculateMove.mock.calls[0][0]).toEqual(70);
        expect(mockModelCalculateMove.mock.calls[0][1]).toEqual(123);
        expect(mockModelCalculateIndex).toHaveBeenCalledTimes(1);
        expect(mockModelCalculateMove).toHaveBeenCalledTimes(1);

        // mock view
        const mockViewInstance = SliderView.mock.instances[0];
        const mockViewMoveAt = mockViewInstance.moveAt;
        expect(mockViewMoveAt.mock.calls[0][0]).toEqual('test Ox');
        expect(mockViewMoveAt.mock.calls[0][1]).toEqual(123);
        expect(mockViewMoveAt).toHaveBeenCalledTimes(1);
    });
    test('should set value on slider with touch event', () => {
        const event = {
            preventDefault: () => {},
            target: {
                classList: {
                    contains() {
                        return true;
                    },
                },
                nodeName: 'node-name',
                parentNode: 'parent-node',
            },
            touches: [{
                pageY: 100,
                pageX: 150,
            }],
            cancelable: true,
        };
        controller.sliderModel.isVertical = false;
        Object.defineProperty(controller.sliderModel, 'outputOx', { value: 'test Ox' });
        const mockSliderCoords = jest.fn(() => ({
            left: 20,
            top: 30,
        }));
        Object.defineProperty(controller.sliderView, '$slider', { value: { offset: mockSliderCoords } });
        jest.spyOn(event, 'preventDefault');
        controller.sliderModel.calculateIndex = jest.fn((ox) => 123);

        controller.onClickBg(event);

        expect(event.preventDefault).toBeCalled();

        // mock model
        const mockModelInstance = SliderModel.mock.instances[0];
        const mockModelCalculateIndex = mockModelInstance.calculateIndex;
        const mockModelCalculateMove = mockModelInstance.calculateMove;

        expect(mockModelCalculateIndex.mock.calls[0][0]).toEqual(130);
        expect(mockModelCalculateMove.mock.calls[0][0]).toEqual(130);
        expect(mockModelCalculateMove.mock.calls[0][1]).toEqual(123);
        expect(mockModelCalculateIndex).toHaveBeenCalledTimes(1);
        expect(mockModelCalculateMove).toHaveBeenCalledTimes(1);

        // mock view
        const mockViewInstance = SliderView.mock.instances[0];
        const mockViewMoveAt = mockViewInstance.moveAt;
        expect(mockViewMoveAt.mock.calls[0][0]).toEqual('test Ox');
        expect(mockViewMoveAt.mock.calls[0][1]).toEqual(123);
        expect(mockViewMoveAt).toHaveBeenCalledTimes(1);
    });
    test('should set value on slider with touch event and not cancelable event', () => {
        const event = {
            preventDefault: () => {},
            target: {
                classList: {
                    contains() {
                        return true;
                    },
                },
                nodeName: 'node-name',
                parentNode: 'parent-node',
            },
            touches: [{
                pageY: 100,
                pageX: 150,
            }],
            cancelable: false,
        };
        controller.sliderModel.isVertical = false;
        Object.defineProperty(controller.sliderModel, 'outputOx', { value: 'test Ox' });
        const mockSliderCoords = jest.fn(() => ({
            left: 20,
            top: 30,
        }));
        Object.defineProperty(controller.sliderView, '$slider', { value: { offset: mockSliderCoords } });
        jest.spyOn(event, 'preventDefault');
        controller.sliderModel.calculateIndex = jest.fn((ox) => 123);

        controller.onClickBg(event);

        expect(event.preventDefault).not.toBeCalled();

        // mock model
        const mockModelInstance = SliderModel.mock.instances[0];
        const mockModelCalculateIndex = mockModelInstance.calculateIndex;
        const mockModelCalculateMove = mockModelInstance.calculateMove;

        expect(mockModelCalculateIndex.mock.calls[0][0]).toEqual(130);
        expect(mockModelCalculateMove.mock.calls[0][0]).toEqual(130);
        expect(mockModelCalculateMove.mock.calls[0][1]).toEqual(123);
        expect(mockModelCalculateIndex).toHaveBeenCalledTimes(1);
        expect(mockModelCalculateMove).toHaveBeenCalledTimes(1);

        // mock view
        const mockViewInstance = SliderView.mock.instances[0];
        const mockViewMoveAt = mockViewInstance.moveAt;
        expect(mockViewMoveAt.mock.calls[0][0]).toEqual('test Ox');
        expect(mockViewMoveAt.mock.calls[0][1]).toEqual(123);
        expect(mockViewMoveAt).toHaveBeenCalledTimes(1);
    });
});

describe('Controller: onMoveThumb', () => {
    beforeEach(() => {
        SliderView.mockClear();
        SliderModel.mockClear();

        controller = new SliderController();
    });
    test('should set value on slider when thumb is moving', () => {
        const event = {
            preventDefault: () => {},
            target: {
                classList: {
                    contains() {
                        return true;
                    },
                },
                dataset: {
                    id: '1',
                },
            },
            pageY: 100,
            pageX: 150,
        };
        controller.sliderModel.isVertical = false;
        document.addEventListener = jest.fn((eventName, callback) => {
            callback(event);
        });
        Object.defineProperty(controller.sliderModel, 'outputOx', { value: 'test Ox' });
        const mockSliderCoords = jest.fn(() => ({
            left: 20,
            top: 30,
        }));
        Object.defineProperty(controller.sliderView, '$slider', { value: { offset: mockSliderCoords } });
        jest.spyOn(event, 'preventDefault');

        controller.onMoveThumb(event);

        expect(event.preventDefault).toBeCalled();

        // mock model
        const mockModelInstance = SliderModel.mock.instances[0];
        const mockModelCalculateMove = mockModelInstance.calculateMove;

        expect(mockModelCalculateMove.mock.calls[0][0]).toEqual(130);
        expect(mockModelCalculateMove.mock.calls[0][1]).toEqual(1);
        expect(mockModelCalculateMove).toHaveBeenCalledTimes(3);

        // mock view
        const mockViewInstance = SliderView.mock.instances[0];
        const mockViewMoveAt = mockViewInstance.moveAt;
        expect(mockViewMoveAt.mock.calls[0][0]).toEqual('test Ox');
        expect(mockViewMoveAt.mock.calls[0][1]).toEqual(1);
        expect(mockViewMoveAt).toHaveBeenCalledTimes(3);
    });
    test('should set value on slider when thumb is moving and should not change e.target', () => {
        const event = {
            preventDefault: () => {},
            target: {
                classList: {
                    contains() {
                        return false;
                    },
                },
                dataset: {
                    id: '1',
                },
            },
            pageY: 100,
            pageX: 150,
        };
        controller.currentThumb = {
            dataset: {
                id: '1',
            },
        };
        controller.sliderModel.isVertical = false;
        document.addEventListener = jest.fn((eventName, callback) => {
            callback(event);
        });
        Object.defineProperty(controller.sliderModel, 'outputOx', { value: 'test Ox' });
        const mockSliderCoords = jest.fn(() => ({
            left: 20,
            top: 30,
        }));
        Object.defineProperty(controller.sliderView, '$slider', { value: { offset: mockSliderCoords } });
        jest.spyOn(event, 'preventDefault');

        controller.onMoveThumb(event);

        expect(event.preventDefault).toBeCalled();

        // mock model
        const mockModelInstance = SliderModel.mock.instances[0];
        const mockModelCalculateMove = mockModelInstance.calculateMove;

        expect(mockModelCalculateMove.mock.calls[0][0]).toEqual(130);
        expect(mockModelCalculateMove.mock.calls[0][1]).toEqual(1);
        expect(mockModelCalculateMove).toHaveBeenCalledTimes(3);

        // mock view
        const mockViewInstance = SliderView.mock.instances[0];
        const mockViewMoveAt = mockViewInstance.moveAt;
        expect(mockViewMoveAt.mock.calls[0][0]).toEqual('test Ox');
        expect(mockViewMoveAt.mock.calls[0][1]).toEqual(1);
        expect(mockViewMoveAt).toHaveBeenCalledTimes(3);
    });
    test('should set value on slider when thumb is moving with vertical option', () => {
        const event = {
            preventDefault: () => {},
            target: {
                classList: {
                    contains() {
                        return true;
                    },
                },
                dataset: {
                    id: '1',
                },
            },
            pageY: 100,
            pageX: 150,
        };
        controller.sliderModel.isVertical = true;
        document.addEventListener = jest.fn((eventName, callback) => {
            callback(event);
        });
        Object.defineProperty(controller.sliderModel, 'outputOx', { value: 'test Ox' });
        const mockSliderCoords = jest.fn(() => ({
            left: 20,
            top: 30,
        }));
        Object.defineProperty(controller.sliderView, '$slider', { value: { offset: mockSliderCoords } });
        jest.spyOn(event, 'preventDefault');

        controller.onMoveThumb(event);

        expect(event.preventDefault).toBeCalled();

        // mock model
        const mockModelInstance = SliderModel.mock.instances[0];
        const mockModelCalculateMove = mockModelInstance.calculateMove;

        expect(mockModelCalculateMove.mock.calls[0][0]).toEqual(70);
        expect(mockModelCalculateMove.mock.calls[0][1]).toEqual(1);
        expect(mockModelCalculateMove).toHaveBeenCalledTimes(3);

        // mock view
        const mockViewInstance = SliderView.mock.instances[0];
        const mockViewMoveAt = mockViewInstance.moveAt;
        expect(mockViewMoveAt.mock.calls[0][0]).toEqual('test Ox');
        expect(mockViewMoveAt.mock.calls[0][1]).toEqual(1);
        expect(mockViewMoveAt).toHaveBeenCalledTimes(3);
    });
    test('should set value on slider when thumb is moving by touch', () => {
        const event = {
            preventDefault: () => {},
            target: {
                classList: {
                    contains() {
                        return true;
                    },
                },
                dataset: {
                    id: '1',
                },
            },
            touches: [{
                pageY: 100,
                pageX: 150,
            }],
        };
        controller.sliderModel.isVertical = false;
        document.addEventListener = jest.fn((eventName, callback) => {
            callback(event);
        });
        Object.defineProperty(controller.sliderModel, 'outputOx', { value: 'test Ox' });
        const mockSliderCoords = jest.fn(() => ({
            left: 20,
            top: 30,
        }));
        Object.defineProperty(controller.sliderView, '$slider', { value: { offset: mockSliderCoords } });
        jest.spyOn(event, 'preventDefault');

        controller.onMoveThumb(event);

        expect(event.preventDefault).toBeCalled();

        // mock model
        const mockModelInstance = SliderModel.mock.instances[0];
        const mockModelCalculateMove = mockModelInstance.calculateMove;

        expect(mockModelCalculateMove.mock.calls[0][0]).toEqual(130);
        expect(mockModelCalculateMove.mock.calls[0][1]).toEqual(1);
        expect(mockModelCalculateMove).toHaveBeenCalledTimes(3);

        // mock view
        const mockViewInstance = SliderView.mock.instances[0];
        const mockViewMoveAt = mockViewInstance.moveAt;
        expect(mockViewMoveAt.mock.calls[0][0]).toEqual('test Ox');
        expect(mockViewMoveAt.mock.calls[0][1]).toEqual(1);
        expect(mockViewMoveAt).toHaveBeenCalledTimes(3);
    });
});
