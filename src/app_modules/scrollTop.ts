interface IScrollTop {
  containerElement?: HTMLElement,
  triggerOffSet?: number,
  isLeftPosition?: boolean,
  size?: number,
  bgColor?: string,
  iconColor?: string,
  borderRadius?: number,
}

export class ScrollTop {
  _scrollTopElement: HTMLElement;
  _scrollTopButtonElement: HTMLButtonElement;
  _triggerOffSet: number;

  constructor(params?: IScrollTop) {
    const containerElement = params?.containerElement ? params?.containerElement : document.body;
    const isLeftPosition = params?.isLeftPosition;
    const size = params?.size;
    const bgColor = params?.bgColor;
    const iconColor = params?.iconColor;
    const borderRadius = params?.borderRadius;

    this._triggerOffSet = params?.triggerOffSet ? params?.triggerOffSet : 200;

    containerElement.insertAdjacentHTML(
      'beforeend',
      `<div
        class="scroll-top"
        id="scroll-top"
      >
        <button class="scroll-top__button" id="scroll-top-button">
          <svg
            aria-hidden='true'
            focusable='false'
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 448 512'
            width='1em'
            height='1em'
          >
            <path
              fill='currentColor'
              d='M240.971 130.524l194.343 194.343c9.373 9.373 9.373 24.569 0 33.941l-22.667 22.667c-9.357 9.357-24.522 9.375-33.901.04L224 227.495 69.255 381.516c-9.379 9.335-24.544 9.317-33.901-.04l-22.667-22.667c-9.373-9.373-9.373-24.569 0-33.941L207.03 130.525c9.372-9.373 24.568-9.373 33.941-.001z'
            >
            </path>
          </svg>
        </button>
      </div>`,
    );

    this._scrollTopElement = document.getElementById('scroll-top') as HTMLElement;
    this._scrollTopButtonElement = document.getElementById('scroll-top-button') as HTMLButtonElement;

    if (size) {
      this._scrollTopElement.style.setProperty('--size', `${size}px`);
    }
    if (bgColor) {
      this._scrollTopElement.style.setProperty('--bgColor', `${bgColor}`);
    }
    if (iconColor) {
      this._scrollTopElement.style.setProperty('--iconColor', `${iconColor}`);
    }
    if (borderRadius) {
      this._scrollTopElement.style.setProperty('--borderRadius', `${borderRadius}px`);
    }
    if (isLeftPosition) {
      this._scrollTopElement.dataset.position = 'left';
    } else {
      this._scrollTopElement.dataset.position = 'right';
    }

    this._scrollTopButtonElement.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }

  use(): void {
    if (document.documentElement.scrollTop > this._triggerOffSet) {
      if (!this._scrollTopElement.classList.contains('scroll-top--active')) {
        this._scrollTopElement.classList.add('scroll-top--active');
      }
    } else {
      if (this._scrollTopElement.classList.contains('scroll-top--active')) {
        this._scrollTopElement.classList.remove('scroll-top--active');
      }
    }
  }

  _getScrollBarWidth(): number {
    const outer = document.createElement('div');

    outer.style.position = 'adsolute';
    outer.style.top = '-9999px';
    outer.style.width = '50px';
    outer.style.height = '50px';
    outer.style.overflow = 'scroll';
    outer.style.visibility = 'hidden';

    document.body.appendChild(outer);

    const scrollbarWidth = outer.offsetWidth - outer.clientWidth;

    document.body.removeChild(outer);

    return scrollbarWidth;
  }

  compensateScrollBarWidth(isCompensate: boolean): void {
    if (isCompensate && this._scrollTopElement.dataset.position === 'right') {
      const scrollBarWidth = this._getScrollBarWidth();

      if (scrollBarWidth && this._scrollTopElement.classList.contains('scroll-top--active')) {
        this._scrollTopElement.style.setProperty('--scrollBarWidth', `${scrollBarWidth}px`);
      }
    } else {
      if (this._scrollTopElement.style.getPropertyValue('--scrollBarWidth')) {
        this._scrollTopElement.style.removeProperty('--scrollBarWidth');
      }
    }
  }
}
