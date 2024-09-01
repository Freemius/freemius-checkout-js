import { Style } from '../style';
import { ExitIntent } from './index';

describe('ExitIntent', () => {
    test('works for attaching and detaching', () => {
        const style = new Style('test-guid');
        const exitIntent = new ExitIntent(style);
        const onExit = jest.fn();

        expect(exitIntent.isAttached()).toBe(false);

        exitIntent.attach(onExit);

        expect(exitIntent.isAttached()).toBe(true);

        // Fire a simulation event with a pageY of 10
        const event = new MouseEvent('mouseleave', {
            clientY: 10,
        });
        // @ts-ignore
        event.pageY = 10;

        document.documentElement.dispatchEvent(event);

        // The onExit function should not have been called
        expect(onExit).not.toHaveBeenCalled();

        exitIntent.detach();

        expect(exitIntent.isAttached()).toBe(false);

        document.documentElement.dispatchEvent(event);

        expect(onExit).not.toHaveBeenCalled();
    });
});
