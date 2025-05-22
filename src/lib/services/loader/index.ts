import { MAX_ZINDEX } from '../../utils/ops';
import { ILoader } from '../../contracts/ILoader';
import { IStyle } from '../../contracts/IStyle';

export class Loader implements ILoader {
    private readonly loaderElement: HTMLDivElement;

    private isOpen: boolean = false;

    private loaderElementId: string;

    private static readonly TRANSITION_TIME = 200;

    constructor(
        private readonly style: IStyle,
        imageUrl: string,
        altText: string = 'Loading Freemius Checkout'
    ) {
        this.loaderElementId = `fs-loader-${this.style.guid}`;

        this.loaderElement = document.createElement('div');
        this.loaderElement.id = this.loaderElementId;
        this.loaderElement.innerHTML = `<img src="${imageUrl}" alt="${altText}" />`;

        this.style.addStyle(this.getStyle());
    }

    public show(): Loader {
        if (this.isOpen) {
            return this;
        }

        this.loaderElement.classList.add('show');
        document.body.appendChild(this.loaderElement);

        this.isOpen = true;

        return this;
    }

    public hide(): Loader {
        if (!this.isOpen) {
            return this;
        }

        this.loaderElement.classList.remove('show');
        this.isOpen = false;

        // Use setTimeout to ensure the transition is applied before removing the element
        setTimeout(() => {
            this.hideImmediate();
        }, Loader.TRANSITION_TIME);

        return this;
    }

    public hideImmediate(): Loader {
        if (this.loaderElement.parentNode) {
            this.loaderElement.classList.remove('show');
            this.loaderElement.parentNode.removeChild(this.loaderElement);
            this.isOpen = false;
        }

        return this;
    }

    private getStyle(): string {
        return /*@fs-css-minify*/ `#${this.loaderElementId} {
			display: none;
			position: fixed;
			z-index: ${MAX_ZINDEX - 1};
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			text-align: left;
			background: rgba(0, 0, 0, 0.6);
			transition: opacity ${Loader.TRANSITION_TIME}ms ease-out;
			will-change: opacity;
			opacity: 0;
		}
		#${this.loaderElementId}.show {
			opacity: 1;
			display: block;
		}
		#${this.loaderElementId} img {
			position: absolute;
			top: 40%;
			left: 50%;
			width: auto;
			height: auto;
			margin-left: -25px;
			background: #fff;
			padding: 10px;
			border-radius: 50%;
			box-shadow: 2px 2px 2px rgba(0,0,0,0.1);
		}`;
    }
}
