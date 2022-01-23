import SliderModel from "../model";

let model = new SliderModel();

describe('Model: calculateIndex', () => {
    beforeEach(() => {
        model.outputOx = {
            thumbs: [
                {
                    ox: undefined,
                    value: undefined,
                },
                {
                    ox: undefined,
                    value: undefined,
                },
            ],
            track: {},
        };
        model.isRange = false;
    });
    afterAll(() => {
        model = new SliderModel();
    });
    test('should calculate closest thumb index', () => {
        model.isRange = true;
        model.outputOx.thumbs[0].ox = 20;
        model.outputOx.thumbs[1].ox = 30;
        expect(model.calculateIndex(27)).toBe(1);

        model.outputOx.thumbs[0].ox = 20;
        model.outputOx.thumbs[1].ox = 30;
        expect(model.calculateIndex(22)).toBe(0);

        model.isRange = false;
        model.outputOx.thumbs[0].ox = 20;
        model.outputOx.thumbs[1].ox = 30;
        expect(model.calculateIndex(150)).toBe(1);

        model.outputOx.thumbs[0].ox = 20;
        model.outputOx.thumbs[1].ox = 30;
        expect(model.calculateIndex(15)).toBe(1);
    });
});

describe('Model: setInitialOutput', () => {
    beforeEach(() => {
        model.outputOx = {
            thumbs: [
                {
                    ox: undefined,
                    value: undefined,
                },
                {
                    ox: undefined,
                    value: undefined,
                },
            ],
            track: {},
        };
        model.isRange = false;
        model.isVertical = false;
        model.viewScale = false;
        model.viewTip = false;
        model.viewBar = false;
        model.initialMin = 0;
        model.initialMax = 100;
        model.initialStep = 10;
        model.offsetWidth = 100;
        model.oldFrom = 0;
        model.oldTo = 50;

        model.currentValue = [0, 10];
    });
    afterAll(() => {
        model = new SliderModel();
    });
    const setSliderProps = () => {
        model.sliderProps = [
            {
                sliderMin: model.initialMin,
                sliderMax: model.initialMax,
                sliderStep: model.initialStep,
                offsetLeft: 0,
                offsetRight: 0,
            },
            {
                sliderMin: model.initialMin,
                sliderMax: model.initialMax,
                sliderStep: model.initialStep,
                offsetLeft: 0,
                offsetRight: 0,
            },
        ];
    };
    test('should set initial outputOx', () => {
        setSliderProps();
        model.setInitialOutput();

        expect(model.outputOx).toEqual({
            thumbs: [
                {
                    ox: 0,
                    value: 0,
                },
                {
                    ox: 10,
                    value: 10,
                },
            ],
            track: {
                begin: 0,
                end: 10,
            },
        });
    });
    test('should set initial outputOx', () => {
        model.currentValue = [10, 50];
        model.isRange = true;
        setSliderProps();
        model.setInitialOutput();

        expect(model.outputOx).toEqual({
            thumbs: [
                {
                    ox: 10,
                    value: 10,
                },
                {
                    ox: 50,
                    value: 50,
                },
            ],
            track: {
                begin: 10,
                end: 50,
            },
        });
    });
    test('should set initial outputOx after setting oldTo less than from', () => {
        model.currentValue = [30, 50];
        model.oldTo = 30;
        model.isRange = true;

        setSliderProps();

        model.setInitialOutput();

        expect(model.outputOx).toEqual({
            thumbs: [
                {
                    ox: 20,
                    value: 20,
                },
                {
                    ox: 50,
                    value: 50,
                },
            ],
            track: {
                begin: 20,
                end: 50,
            },
        });
    });
    test('should set initial outputOx after setting oldFrom more than to', () => {
        model.currentValue = [30, 50];
        model.oldFrom = 60;
        model.isRange = true;

        setSliderProps();

        model.setInitialOutput();

        expect(model.outputOx).toEqual({
            thumbs: [
                {
                    ox: 30,
                    value: 30,
                },
                {
                    ox: 70,
                    value: 70,
                },
            ],
            track: {
                begin: 30,
                end: 70,
            },
        });
    });
    test('should set initial outputOx after setting max less than from', () => {
        model.currentValue = [30, 50];
        model.initialMax = 20;
        model.isRange = true;

        setSliderProps();

        model.setInitialOutput();

        expect(model.outputOx).toEqual({
            thumbs: [
                {
                    ox: 50,
                    value: 10,
                },
                {
                    ox: 100,
                    value: 20,
                },
            ],
            track: {
                begin: 50,
                end: 100,
            },
        });
    });
    test('should set initial outputOx after setting min more than to', () => {
        model.currentValue = [30, 50];
        model.initialMin = 80;
        model.isRange = true;

        setSliderProps();

        model.setInitialOutput();

        expect(model.outputOx).toEqual({
            thumbs: [
                {
                    ox: 0,
                    value: 80,
                },
                {
                    ox: 50,
                    value: 90,
                },
            ],
            track: {
                begin: 0,
                end: 50,
            },
        });
    });
    test('should set initial outputOx after setting min more than to', () => {
        model.initialMin = 20;
        setSliderProps();
        model.setInitialOutput();

        expect(model.outputOx.thumbs[1]).toEqual({
            ox: 0,
            value: 20,
        });
        expect(model.outputOx.track).toEqual({
            begin: 0,
            end: 0,
        });
    });
    test('should set initial outputOx with vertical option', () => {
        model.isVertical = true;
        setSliderProps();
        model.setInitialOutput();

        expect(model.outputOx).toEqual({
            thumbs: [
                {
                    ox: 100,
                    value: 0,
                },
                {
                    ox: 90,
                    value: 10,
                },
            ],
            track: {
                begin: 90,
                end: 100,
            },
        });
    });
    test('should set initial outputOx with vertical option', () => {
        model.isVertical = true;
        model.isRange = true;
        setSliderProps();
        model.setInitialOutput();

        expect(model.outputOx).toEqual({
            thumbs: [
                {
                    ox: 100,
                    value: 0,
                },
                {
                    ox: 90,
                    value: 10,
                },
            ],
            track: {
                begin: 90,
                end: 100,
            },
        });
    });
    test('should set initial outputOx after setting max less than from with vertical option', () => {
        model.currentValue = [30, 50];
        model.initialMax = 20;
        model.isRange = true;
        model.isVertical = true;

        setSliderProps();

        model.setInitialOutput();

        expect(model.outputOx).toEqual({
            thumbs: [
                {
                    ox: 50,
                    value: 10,
                },
                {
                    ox: -0,
                    value: 20,
                },
            ],
            track: {
                begin: -0,
                end: 50,
            },
        });
    });
    test('should set initial outputOx after setting min more than to', () => {
        model.currentValue = [30, 50];
        model.initialMin = 80;
        model.isRange = true;
        model.isVertical = true;

        setSliderProps();

        model.setInitialOutput();

        expect(model.outputOx).toEqual({
            thumbs: [
                {
                    ox: 100,
                    value: 80,
                },
                {
                    ox: 50,
                    value: 90,
                },
            ],
            track: {
                begin: 50,
                end: 100,
            },
        });
    });
    test('should set initial outputOx with indivisible range on step', () => {
        model.initialMax = 95;
        model.isRange = true;

        setSliderProps();

        model.setInitialOutput();

        expect(model.outputOx).toEqual({
            thumbs: [
                {
                    ox: 0,
                    value: 0,
                },
                {
                    ox: 11,
                    value: 10,
                },
            ],
            track: {
                begin: 0,
                end: 11,
            },
        });
    });
    test('should set initial outputOx after setting from equal to to', () => {
        model.currentValue = [20, 20];
        model.isRange = true;

        setSliderProps();

        model.setInitialOutput();

        expect(model.outputOx).toEqual({
            thumbs: [
                {
                    ox: 10,
                    value: 10,
                },
                {
                    ox: 20,
                    value: 20,
                },
            ],
            track: {
                begin: 10,
                end: 20,
            },
        });
    });
    test('should set initial outputOx after setting to more than max without range', () => {
        model.currentValue[1] = 110;

        setSliderProps();

        model.setInitialOutput();

        expect(model.outputOx).toEqual({
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
        });
    });
});

describe('Model: setInitialSettings', () => {
    afterAll(() => {
        model = new SliderModel();
    });
    test('should set initial Settings', () => {
        model.setInitialSettings({
            range: true,
            vertical: true,
            scale: true,
            tip: true,
            bar: true,
            min: 0,
            max: 100,
            step: 10,
            from: 50,
            to: 60,
        });
        expect(model.isRange).toEqual(true);
        expect(model.isVertical).toEqual(true);
        expect(model.viewScale).toEqual(true);
        expect(model.viewTip).toEqual(true);
        expect(model.viewBar).toEqual(true);
        expect(model.initialMin).toEqual(0);
        expect(model.initialMax).toEqual(100);
        expect(model.initialStep).toEqual(10);
        expect(model.currentValue).toEqual([50, 60]);
        expect(model.stepDegree).toEqual(1);
    });
    test('should set initial Settings', () => {
        model.setInitialSettings({
            range: false,
            vertical: false,
            scale: false,
            tip: false,
            bar: false,
            min: 0,
            max: 100,
            step: 0,
            from: 50,
            to: 60,
        });
        expect(model.isRange).toEqual(false);
        expect(model.isVertical).toEqual(false);
        expect(model.viewScale).toEqual(false);
        expect(model.viewTip).toEqual(false);
        expect(model.viewBar).toEqual(false);
        expect(model.initialMin).toEqual(0);
        expect(model.initialMax).toEqual(100);
        expect(model.initialStep).toEqual(1);
        expect(model.currentValue).toEqual([50, 60]);
        expect(model.stepDegree).toEqual(0);
    });
});

describe('Model: setSettings', () => {
    afterAll(() => {
        model = new SliderModel();
    });
    test('should set Settings', () => {
        model.setSettings({
            range: true,
            vertical: true,
            scale: true,
            tip: true,
            bar: true,
            min: 0.1,
            max: 1,
            step: 0.1,
            from: 0.2,
            to: 0.3,
        });
        expect(model.isRange).toEqual(true);
        expect(model.isVertical).toEqual(true);
        expect(model.viewScale).toEqual(true);
        expect(model.viewTip).toEqual(true);
        expect(model.viewBar).toEqual(true);
        expect(model.initialMin).toEqual(0.1);
        expect(model.initialMax).toEqual(1);
        expect(model.initialStep).toEqual(0.1);
        expect(model.currentValue).toEqual([0.2, 0.3]);
        expect(model.stepDegree).toEqual(-1);
    });
    test('should set initial Settings', () => {
        model.setSettings({
            range: false,
            vertical: false,
            scale: false,
            tip: false,
            bar: false,
            min: 0,
            max: 100,
            step: 0,
            from: 50,
            to: 60,
        });
        expect(model.isRange).toEqual(false);
        expect(model.isVertical).toEqual(false);
        expect(model.viewScale).toEqual(false);
        expect(model.viewTip).toEqual(false);
        expect(model.viewBar).toEqual(false);
        expect(model.initialMin).toEqual(0);
        expect(model.initialMax).toEqual(100);
        expect(model.initialStep).toEqual(1);
        expect(model.currentValue).toEqual([50, 60]);
        expect(model.stepDegree).toEqual(0);
    });
});

describe('Model: roundValue', () => {
    afterAll(() => {
        model = new SliderModel();
    });

    test('should round value', () => {
        expect(model.roundValue(12, 1)).toEqual(10);
    });
    test('should round value', () => {
        expect(model.roundValue(8e0, 1)).toEqual(10);
    });
    test('should round value', () => {
        expect(model.roundValue(8e1, 1)).toEqual(80);
    });
    test('should round value', () => {
        expect(model.roundValue(12e3, 10)).toEqual(0);
    });
    test('should round value', () => {
        expect(model.roundValue(1.23, -1)).toEqual(1.2);
    });
    test('should round value', () => {
        expect(model.roundValue(1.27, -3)).toEqual(1.27);
    });
    test('should round value', () => {
        expect(model.roundValue(6.6, 0)).toEqual(7);
    });
    test('should round value', () => {
        expect(model.roundValue(7.105427357601002e-15, -1)).toEqual(0);
    });
    test('should round value', () => {
        expect(model.roundValue(7.105427357601002e105, -1)).toEqual(7.105427357601002e+105);
    });
});

describe('Model: initView', () => {
    const mockCallback = jest.fn((x) => 42 + x);
    afterAll(() => {
        model = new SliderModel();
    });

    test('should set sliderProps and call callback-function with it', () => {
        model.initialMin = 10;
        model.initialMax = 100;
        model.initialStep = 10;
        model.minThumbOffset = 0;
        model.minThumbOffset = 0;

        model.initView(mockCallback);

        expect(mockCallback.mock.calls.length).toBe(1);
        expect(model.sliderProps).toEqual({
            sliderMin: 10,
            sliderMax: 100,
            sliderStep: 10,
            offsetLeft: 0,
            offsetRight: 0,
        });
    });
});

describe('Model: calculateMove', () => {
    const setSliderProps = () => {
        model.sliderProps = [
            {
                sliderMin: model.initialMin,
                sliderMax: model.initialMax,
                sliderStep: model.initialStep,
                offsetLeft: 0,
                offsetRight: 0,
            },
            {
                sliderMin: model.initialMin,
                sliderMax: model.initialMax,
                sliderStep: model.initialStep,
                offsetLeft: 0,
                offsetRight: 0,
            },
        ];
    };
    beforeEach(() => {
        model.outputOx = {
            thumbs: [
                {
                    ox: undefined,
                    value: undefined,
                },
                {
                    ox: undefined,
                    value: undefined,
                },
            ],
            track: {},
        };
        model.minThumbOffset = 0;
        model.isRange = false;
        model.isVertical = false;
        model.viewScale = false;
        model.viewTip = false;
        model.viewBar = false;
        model.initialMin = 0;
        model.initialMax = 100;
        model.initialStep = 10;
        model.offsetWidth = 100;
        model.oldFrom = 20;
        model.oldTo = 40;

        model.currentValue = [20, 40];
    });
    afterAll(() => {
        model = new SliderModel();
    });
    test('should calculate outputOx', () => {
        model.isRange = true;
        setSliderProps();
        model.setInitialOutput();
        model.calculateMove(60, 1);

        expect(model.outputOx).toEqual({
            thumbs: [
                {
                    ox: 20,
                    value: 20,
                },
                {
                    ox: 60,
                    value: 60,
                },
            ],
            track: {
                begin: 20,
                end: 60,
            },
        });
    });
    test('should calculate outputOx without range', () => {
        setSliderProps();
        model.setInitialOutput();
        model.calculateMove(70, 1);

        expect(model.outputOx.thumbs[1]).toEqual({
            ox: 70,
            value: 70,
        });
        expect(model.outputOx.track).toEqual({
            begin: 0,
            end: 70,
        });
    });
    test('should calculate outputOx option and "min" equal to max for "to" thumb', () => {
        model.isRange = true;
        model.oldFrom = 90;
        model.oldTo = 100;
        model.currentValue = [90, 100];
        setSliderProps();
        model.setInitialOutput();
        model.calculateMove(106, 1);

        expect(model.outputOx).toEqual({
            thumbs: [
                {
                    ox: 90,
                    value: 90,
                },
                {
                    ox: 100,
                    value: 100,
                },
            ],
            track: {
                begin: 90,
                end: 100,
            },
        });
    });
    test('should calculate outputOx with vertical option and indivisible range to step', () => {
        model.isVertical = true;
        model.isRange = true;
        setSliderProps();
        model.setInitialOutput();
        model.calculateMove(30, 1);
        model.calculateMove(80, 0);

        expect(model.outputOx).toEqual({
            thumbs: [
                {
                    ox: 80,
                    value: 20,
                },
                {
                    ox: 30,
                    value: 70,
                },
            ],
            track: {
                begin: 30,
                end: 80,
            },
        });
    });
    test('should calculate outputOx with vertical option', () => {
        model.isVertical = true;
        model.isRange = true;
        model.initialMax = 95;
        setSliderProps();
        model.setInitialOutput();
        model.calculateMove(0, 1);
        model.calculateMove(100, 0);

        expect(model.outputOx).toEqual({
            thumbs: [
                {
                    ox: 100,
                    value: 0,
                },
                {
                    ox: 5.263157894736835,
                    value: 90,
                },
            ],
            track: {
                begin: 5.263157894736835,
                end: 100,
            },
        });
    });
    test('should calculate outputOx with vertical option and "min" equal to max for "to" thumb', () => {
        model.isVertical = true;
        model.isRange = true;
        model.oldFrom = 90;
        model.oldTo = 100;
        model.currentValue = [90, 100];
        setSliderProps();
        model.setInitialOutput();
        model.calculateMove(0, 1);

        expect(model.outputOx).toEqual({
            thumbs: [
                {
                    ox: 10,
                    value: 90,
                },
                {
                    ox: 0,
                    value: 100,
                },
            ],
            track: {
                begin: 0,
                end: 10,
            },
        });
    });
    test('should calculate outputOx with vertical option without range', () => {
        model.isVertical = true;
        setSliderProps();
        model.setInitialOutput();
        model.calculateMove(70, 1);

        expect(model.outputOx.thumbs[1]).toEqual({
            ox: 70,
            value: 30,
        });
        expect(model.outputOx.track).toEqual({
            begin: 70,
            end: 100,
        });
    });
    describe('should calculate outputOx with out off range input - "pos"', () => {
        test('"pos" more than offsetRight with vertical option', () => {
            model.isVertical = true;
            model.isRange = true;
            setSliderProps();
            model.setInitialOutput();
            model.calculateMove(110, 0);

            expect(model.outputOx).toEqual({
                thumbs: [
                    {
                        ox: 100,
                        value: 0,
                    },
                    {
                        ox: 60,
                        value: 40,
                    },
                ],
                track: {
                    begin: 60,
                    end: 100,
                },
            });
        });
        test('"pos" more than offsetRight', () => {
            model.isRange = true;
            setSliderProps();
            model.setInitialOutput();
            model.calculateMove(40, 0);

            expect(model.outputOx).toEqual({
                thumbs: [
                    {
                        ox: 30,
                        value: 30,
                    },
                    {
                        ox: 40,
                        value: 40,
                    },
                ],
                track: {
                    begin: 30,
                    end: 40,
                },
            });
        });
        test('"pos" less than offsetLeft with vertical option', () => {
            model.isVertical = true;
            model.isRange = true;
            setSliderProps();
            model.setInitialOutput();
            model.calculateMove(38, 0);

            expect(model.outputOx).toEqual({
                thumbs: [
                    {
                        ox: 70,
                        value: 30,
                    },
                    {
                        ox: 60,
                        value: 40,
                    },
                ],
                track: {
                    begin: 60,
                    end: 70,
                },
            });
        });
        test('"pos" less than offsetLeft', () => {
            model.isRange = true;
            setSliderProps();
            model.setInitialOutput();
            model.calculateMove(20, 1);

            expect(model.outputOx).toEqual({
                thumbs: [
                    {
                        ox: 20,
                        value: 20,
                    },
                    {
                        ox: 30,
                        value: 30,
                    },
                ],
                track: {
                    begin: 20,
                    end: 30,
                },
            });
        });
        test('"pos" less than viewStep/2', () => {
            model.isRange = true;
            setSliderProps();
            model.setInitialOutput();
            model.calculateMove(3, 1);

            expect(model.outputOx).toEqual({
                thumbs: [
                    {
                        ox: 20,
                        value: 20,
                    },
                    {
                        ox: 30,
                        value: 30,
                    },
                ],
                track: {
                    begin: 20,
                    end: 30,
                },
            });
        });
        test('"pos" close to max', () => {
            model.isRange = true;
            setSliderProps();
            model.setInitialOutput();
            model.calculateMove(98, 1);

            expect(model.outputOx).toEqual({
                thumbs: [
                    {
                        ox: 20,
                        value: 20,
                    },
                    {
                        ox: 100,
                        value: 100,
                    },
                ],
                track: {
                    begin: 20,
                    end: 100,
                },
            });
        });
    });
});
