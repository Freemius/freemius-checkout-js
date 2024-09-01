import { Style } from './index';

describe('Style class', () => {
    test('can attach and detach style element', () => {
        const style = new Style('test-guid');

        style.addStyle('body { background-color: red; }');

        style.attach();

        expect(document.body).toHaveStyle({ 'background-color': 'red' });

        style.remove();

        expect(document.body).not.toHaveStyle({ 'background-color': 'red' });

        style.attach();

        style.addStyle('body { background-color: blue; }');

        expect(document.body).toHaveStyle({ 'background-color': 'blue' });
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
