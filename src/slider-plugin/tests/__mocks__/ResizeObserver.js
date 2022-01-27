class ResizeObserver {
    observe() {
        // do nothing
        this.bar = "Hello World";
    }

    unobserve() {
        // do nothing
        this.bar = "Hello World";
    }
}

window.ResizeObserver = ResizeObserver;
export default ResizeObserver;
