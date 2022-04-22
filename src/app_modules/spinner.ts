interface ISpinnerParams {
  containerElement?: HTMLElement,
  size?: number,
  strokeWidth?: number,
  color?: string,
}

export class Spinner {
  _spinnerElement: HTMLElement;

  constructor(params?: ISpinnerParams) {
    const containerElement = params?.containerElement ? params.containerElement : document.body;
    const size = params?.size;
    const color = params?.color;
    const strokeWidth = (params?.strokeWidth || params?.strokeWidth === 0) ?
      params?.strokeWidth < 1 ? 1 : params?.strokeWidth > 10 ? 10 : params?.strokeWidth : 5;

    containerElement.insertAdjacentHTML(
      'beforeend',
      `<div
        class="spinner"
        id="spinner"
      >
        <svg
          class="spinner__icon"
          viewBox="0 0 50 50"
        >
          <circle
            class="spinner__path"
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke-width=${strokeWidth}
          >
          </circle>
        </svg>
      </div>`,
    );

    this._spinnerElement = document.getElementById('spinner') as HTMLElement;
    if (size) {
      this._spinnerElement.style.setProperty('--size', `${size}px`);
    }
    if (color) {
      this._spinnerElement.style.setProperty('--color', `${color}`);
    }
  }

  use(isActive: boolean): void {
    if (isActive) {
      this._spinnerElement.classList.add('spinner--active');
    } else {
      this._spinnerElement.classList.remove('spinner--active');
    }
  }
}
