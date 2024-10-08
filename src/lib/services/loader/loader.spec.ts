import { screen } from '@testing-library/dom';
import { Style } from '../style';
import { Loader } from './index';

describe('Loader', () => {
    test('works for showing and hiding', () => {
        const style = new Style('test-guid');
        const loader = new Loader(style, 'test-image-url', 'test-alt-text');

        loader.show();

        expect(screen.getByAltText('test-alt-text')).toBeInTheDocument();

        loader.hide();

        expect(screen.queryByAltText('test-alt-text')).not.toBeInTheDocument();
    });
});
