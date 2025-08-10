import { Style } from './index';

describe('Style class', () => {
    test('can attach and detach style element', () => {
        const style = new Style('test-guid');

        style.addStyle('body { background-color: rgb(255, 0, 0); }');

        style.attach();

        expect(document.body).toHaveStyle({
            'background-color': 'rgb(255, 0, 0)',
        });

        style.remove();

        expect(document.body).not.toHaveStyle({
            'background-color': 'rgb(255, 0, 0)',
        });

        style.attach();

        style.addStyle('body { background-color: rgb(0, 0, 255); }');

        expect(document.body).toHaveStyle({
            'background-color': 'rgb(0, 0, 255)',
        });
    });

    test('can disable and enable body scroll', () => {
        const style = new Style('test-guid');

        style.attach();

        style.disableBodyScroll();

        expect(document.body).toHaveStyle({ overflow: 'hidden' });

        style.enableBodyScroll();

        expect(document.body).not.toHaveStyle({ overflow: 'hidden' });
    });
});
