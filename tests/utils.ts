export function createDeferred<T>() {
    let resolve: (value: T | PromiseLike<T>) => void;
    let reject: (reason?: any) => void;

    const promise = new Promise<T>((res, rej) => {
        resolve = res;
        reject = rej;
    });

    return { promise, resolve: resolve!, reject: reject! };
}

export function sendMockedCanceledEvent() {
    const message = new MessageEvent('message', {
        source: window,
        origin: 'https://checkout.freemius.com',
        data: JSON.stringify({ type: 'canceled', data: null }),
    });
    window.dispatchEvent(message);
}
