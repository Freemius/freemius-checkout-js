import { postman } from './index';
import { createDeferred } from '../../../../tests/utils';

function setupIframe(sourceUrl: string) {
    const iframe = document.createElement('iframe');
    document.body.appendChild(iframe);
    iframe.src = 'about:blank';

    const postMessage = function (data: object) {
        // Instead of calling postMessage on the window object, we dispatch a message event to workaround a JSDOM implementation issue.
        // @link https://github.com/jsdom/jsdom/issues/2745#issuecomment-1207414024
        const messageEvent = new MessageEvent('message', {
            source: window,
            origin: sourceUrl,
            data: JSON.stringify(data),
        });

        iframe.contentWindow?.top?.dispatchEvent(messageEvent);
    };

    return { iframe, postMessage };
}

describe('Postman', () => {
    test('works for adding a listener for a type', (done) => {
        const sourceUrl = 'https://checkout.freemius.com';
        const { iframe, postMessage } = setupIframe(sourceUrl);

        const postMan = postman(iframe, sourceUrl)!;

        postMan.on('test', (data) => {
            expect((data as Record<string, any>).value).toBe(1);

            done();
        });

        postMessage({ type: 'test', data: { value: 1 } });
    });

    test('works for multiple listeners', async () => {
        const sourceUrl = 'https://checkout.freemius.com';
        const { iframe, postMessage } = setupIframe(sourceUrl);

        const postMan = postman(iframe, sourceUrl)!;

        const { promise: promise1, resolve: resolve1 } = createDeferred<void>();
        const { promise: promise2, resolve: resolve2 } = createDeferred<void>();

        let value = 0;

        postMan.on('test', (data) => {
            value += (data as Record<string, any>).value;
            resolve1();
        });
        postMan.on('test', (data) => {
            value += (data as Record<string, any>).value + 1;
            resolve2();
        });

        postMessage({ type: 'test', data: { value: 1 } });

        await Promise.all([promise1, promise2]);

        expect(value).toBe(3);
    });

    test('adds only a single listener with the one method', async () => {
        const sourceUrl = 'https://checkout.freemius.com';
        const { iframe, postMessage } = setupIframe(sourceUrl);

        const postMan = postman(iframe, sourceUrl)!;

        const { promise: promise1, resolve: resolve1 } = createDeferred<void>();
        const {
            promise: promise2,
            reject: reject2,
            resolve: resolve2,
        } = createDeferred<void>();

        let value = 0;

        postMan.one('test', (data) => {
            value += (data as Record<string, any>).value;
            resolve1();
        });

        postMan.one(
            'test',
            () => {
                reject2('This should not be called.');
            },
            false
        );

        postMessage({ type: 'test', data: { value: 1 } });

        await promise1;

        expect(value).toBe(1);

        resolve2();
        await promise2;

        expect(value).toBe(1);
    });

    test('calling destroy removes the listener', async () => {
        const sourceUrl = 'https://checkout.freemius.com';
        const { iframe, postMessage } = setupIframe(sourceUrl);

        const postMan = postman(iframe, sourceUrl)!;

        const { promise, reject, resolve } = createDeferred<void>();

        postMan.on('test', () => {
            reject('This should not be called.');
        });

        postMan.destroy();

        postMessage({ type: 'test', data: { value: 1 } });

        await new Promise((res) => setTimeout(res, 100));

        resolve();

        await promise;
    });
});
