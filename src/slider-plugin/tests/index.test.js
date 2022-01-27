import RangeSlider from "../index";
import SliderController from "../controller";

jest.mock("../controller");

let indexModule;

describe('RangeSlider: reInitialize', () => {
    beforeEach(() => {
        SliderController.mockClear();

        const elem = "element";
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

        indexModule = new RangeSlider(elem, settings);
    });

    test('should reInitialize slider', () => {
        const settings = {
            range: false,
            vertical: true,
            scale: true,
            tip: true,
            bar: true,
            min: 0,
            max: 100,
            step: 10,
            from: 10,
            to: 20,
        };

        indexModule.reInitialize(settings);

        // mock controller
        const mockControllerInstance = SliderController.mock.instances[0];
        const mockControllerReInitialize = mockControllerInstance.reInitialize;

        expect(mockControllerReInitialize.mock.calls[0][0]).toEqual(settings);
        expect(mockControllerReInitialize).toHaveBeenCalledTimes(1);
    });
});

describe('RangeSlider: getSettings', () => {
    beforeEach(() => {
        SliderController.mockClear();

        const elem = "element";
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

        indexModule = new RangeSlider(elem, settings);
    });

    test('should get settings from controller', () => {
        indexModule.sliderController.getSettings = jest.fn(() => 'test settings');

        expect(indexModule.getSettings()).toEqual('test settings');

        // mock controller
        const mockControllerInstance = SliderController.mock.instances[0];
        const mockControllerGetSettings = mockControllerInstance.getSettings;

        expect(mockControllerGetSettings).toHaveBeenCalledTimes(1);
    });
});

describe('RangeSlider: set slider "to" and "from" values', () => {
    beforeEach(() => {
        SliderController.mockClear();

        const elem = "element";
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

        indexModule = new RangeSlider(elem, settings);
    });

    test('should set "to" value', () => {
        const toValue = 50;
        indexModule.setToValue(toValue);

        // mock controller
        const mockControllerInstance = SliderController.mock.instances[0];
        const mockControllerSetToValue = mockControllerInstance.setToValue;

        expect(mockControllerSetToValue.mock.calls[0][0]).toEqual(toValue);
        expect(mockControllerSetToValue).toHaveBeenCalledTimes(1);
    });
    test('should set "from" value', () => {
        const fromValue = 20;
        indexModule.setFromValue(fromValue);

        // mock controller
        const mockControllerInstance = SliderController.mock.instances[0];
        const mockControllerSetFromValue = mockControllerInstance.setFromValue;

        expect(mockControllerSetFromValue.mock.calls[0][0]).toEqual(fromValue);
        expect(mockControllerSetFromValue).toHaveBeenCalledTimes(1);
    });
});
