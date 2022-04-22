type SnackBarType = 'info' | 'success' | 'warning'| 'error';
type SnackBarPosition = 'top-right' | 'top-center' | 'top-left'| 'bottom-right' | 'bottom-center' | 'bottom-left';
type SnackBarAnimation = 'bounce' | 'slide' | 'zoom'| 'flip';
type SnackBarOptions = {
  type?: SnackBarType,
  position?: SnackBarPosition,
  animationType?: SnackBarAnimation,
  autoClose?: number,
  closeOnClick?: boolean,
  onClose?: () => void,
  showProgressBar?: boolean,
  pauseOnHover?: boolean,
  pauseOnFocusLoss?: boolean,
  swipeToClose?: boolean,
}
type SnackBarDefaultOptions = Required<SnackBarOptions>;

export class SnackBar {
  readonly _defaultOptions: SnackBarDefaultOptions = {
    type: 'info',
    position: 'top-right',
    animationType: 'bounce',
    autoClose: 5000,
    closeOnClick: true,
    onClose: () => undefined,
    showProgressBar: true,
    pauseOnHover: true,
    pauseOnFocusLoss: true,
    swipeToClose: true,

  };
  _snackBarElementIcons: {[key in SnackBarType]: string};
  _snackBarsOptions: Map<string, SnackBarDefaultOptions>;
  _snackBarsTimeoutsId: Map<string, number>;
  _snackBarsIntervalsId: Map<string, number>;
  _pauseOnFocusLossElementsList: HTMLDivElement[];
  _bindedOnFocusLossHandler: () => void;
  _bindedSwipeToCloseHandler: (event: TouchEvent) => void;

  constructor() {
    this._snackBarElementIcons = {
      info: '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor"><path d="M11.983 0a12.206 12.206 0 00-8.51 3.653A11.8 11.8 0 000 12.207 11.779 11.779 0 0011.8 24h.214A12.111 12.111 0 0024 11.791 11.766 11.766 0 0011.983 0zM10.5 16.542a1.476 1.476 0 011.449-1.53h.027a1.527 1.527 0 011.523 1.47 1.475 1.475 0 01-1.449 1.53h-.027a1.529 1.529 0 01-1.523-1.47zM11 12.5v-6a1 1 0 012 0v6a1 1 0 11-2 0z"></path></svg>',
      success: '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor"><path d="M12 0a12 12 0 1012 12A12.014 12.014 0 0012 0zm6.927 8.2l-6.845 9.289a1.011 1.011 0 01-1.43.188l-4.888-3.908a1 1 0 111.25-1.562l4.076 3.261 6.227-8.451a1 1 0 111.61 1.183z"></path></svg>',
      warning: '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor"><path d="M23.32 17.191L15.438 2.184C14.728.833 13.416 0 11.996 0c-1.42 0-2.733.833-3.443 2.184L.533 17.448a4.744 4.744 0 000 4.368C1.243 23.167 2.555 24 3.975 24h16.05C22.22 24 24 22.044 24 19.632c0-.904-.251-1.746-.68-2.44zm-9.622 1.46c0 1.033-.724 1.823-1.698 1.823s-1.698-.79-1.698-1.822v-.043c0-1.028.724-1.822 1.698-1.822s1.698.79 1.698 1.822v.043zm.039-12.285l-.84 8.06c-.057.581-.408.943-.897.943-.49 0-.84-.367-.896-.942l-.84-8.065c-.057-.624.25-1.095.779-1.095h1.91c.528.005.84.476.784 1.1z"></path></svg>',
      error: '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor"><path d="M11.983 0a12.206 12.206 0 00-8.51 3.653A11.8 11.8 0 000 12.207 11.779 11.779 0 0011.8 24h.214A12.111 12.111 0 0024 11.791 11.766 11.766 0 0011.983 0zM10.5 16.542a1.476 1.476 0 011.449-1.53h.027a1.527 1.527 0 011.523 1.47 1.475 1.475 0 01-1.449 1.53h-.027a1.529 1.529 0 01-1.523-1.47zM11 12.5v-6a1 1 0 012 0v6a1 1 0 11-2 0z"></path></svg>',
    };
    this._snackBarsOptions = new Map();
    this._snackBarsTimeoutsId = new Map();
    this._snackBarsIntervalsId = new Map();
    this._pauseOnFocusLossElementsList = [];
    this._bindedOnFocusLossHandler = this._onFocusLossHandler.bind(this);
    this._bindedSwipeToCloseHandler = this._swipeToCloseHandler.bind(this);
  }

  _createContainer(position: SnackBarPosition) {
    const containerElement = document.createElement('div');
    containerElement.classList.add('snack-bar');
    containerElement.dataset.position = position;
    document.body.appendChild(containerElement);

    return containerElement;
  }

  create(message: string, options?: SnackBarOptions) {
    let snackBarOptions: SnackBarDefaultOptions;
    const snackBarElement = document.createElement('div');
    const snackBarId = String(Date.now());

    if (options) {
      snackBarOptions = { ...this._defaultOptions, ...options };

      if (!snackBarOptions.closeOnClick && !snackBarOptions.autoClose) {
        snackBarOptions.autoClose = this._defaultOptions.autoClose;
      }
    } else {
      snackBarOptions = this._defaultOptions;
    }

    this._snackBarsOptions.set(snackBarId, snackBarOptions);

    snackBarElement.classList.add('snack-bar__element');
    snackBarElement.dataset.snackBarElement = '';
    snackBarElement.dataset.id = snackBarId;
    snackBarElement.dataset.type = snackBarOptions.type;
    snackBarElement.dataset.position = snackBarOptions.position;
    snackBarElement.dataset.animation = snackBarOptions.animationType;
    snackBarElement.dataset.closeOnClick = `${snackBarOptions.closeOnClick}`;
    snackBarElement.insertAdjacentHTML(
      'beforeend',
      `<div class='snack-bar__icon'>
        ${this._snackBarElementIcons[snackBarOptions.type]}
      </div>
      <p class='snack-bar__message'>
        ${message}
      </p>
      ${snackBarOptions.closeOnClick ? '<span class=\'snack-bar__close-icon\'>&times;</span>' : ''}`,
    );

    const container = document.querySelector(`.snack-bar[data-position='${snackBarOptions.position}']`) || this._createContainer(snackBarOptions.position);

    if (snackBarOptions.position.includes('bottom')) {
      container.prepend(snackBarElement);
    } else {
      container.append(snackBarElement);
    }

    requestAnimationFrame(() => {
      snackBarElement.dataset.isActive = 'true';
    });

    if (snackBarOptions.closeOnClick) {
      snackBarElement.addEventListener('click', () => {
        this._delete(snackBarElement, snackBarOptions.onClose);
      }, { once: true });
    }

    if (snackBarOptions.autoClose) {
      this._autoClose(snackBarElement, snackBarOptions.autoClose, snackBarOptions.onClose);
    }

    if (snackBarOptions.showProgressBar && snackBarOptions.autoClose) {
      this._progressCalculation(snackBarElement, snackBarOptions.autoClose);

      if (snackBarOptions.pauseOnHover) {
        snackBarElement.addEventListener('mouseover', (event: MouseEvent) => {
          const snackBarElement = event.target as HTMLDivElement;
          this._displayDurationPause(snackBarElement);
        });
        snackBarElement.addEventListener('mouseleave', (event: MouseEvent) => {
          const snackBarElement = event.target as HTMLDivElement;
          this._displayDurationUnpause(snackBarElement);
        });
      }
    }

    if (snackBarOptions.pauseOnFocusLoss) {
      document.addEventListener('visibilitychange', this._bindedOnFocusLossHandler);
    }

    if (snackBarOptions.swipeToClose) {
      snackBarElement.addEventListener('touchstart', this._bindedSwipeToCloseHandler);
    }
  }

  _autoClose(snackBarElement: HTMLDivElement, snackBarDisplayTime: number, onCloseFunction: () => void) {
    const snackBarId = snackBarElement.dataset.id as string;
    const timeoutId = setTimeout(() => {
      this._delete(snackBarElement, onCloseFunction);
    }, snackBarDisplayTime);

    this._snackBarsTimeoutsId.set(snackBarId, Number(timeoutId));
  }

  _progressCalculation(snackBarElement: HTMLDivElement, snackBarAutoCloseValue: number) {
    if (!snackBarElement.dataset.showProgressBar) {
      snackBarElement.dataset.showProgressBar = 'true';
      snackBarElement.style.setProperty('--progress', '1');
    }

    const snackBarId = snackBarElement.dataset.id as string;
    const startProgressTime = Date.now();
    const snackBarDisplayTime = snackBarElement.dataset.displayedTime ? Number(snackBarElement.dataset.displayedTime) : 0;

    const intervalId = setInterval(() => {
      const currentProgressTime = Date.now();
      snackBarElement.style.setProperty('--progress',
        `${1 - ((snackBarDisplayTime + (currentProgressTime - startProgressTime)) / snackBarAutoCloseValue)}`,
      );
      snackBarElement.dataset.displayedTime = `${snackBarDisplayTime + (currentProgressTime - startProgressTime)}`;
    }, 10);

    setTimeout(() => {
      clearInterval(intervalId);
    }, snackBarAutoCloseValue - snackBarDisplayTime);

    this._snackBarsIntervalsId.set(snackBarId, Number(intervalId));
  }

  _displayDurationPause(snackBarElement: HTMLDivElement): void {
    const snackBarId = snackBarElement.dataset.id as string;

    clearInterval(this._snackBarsIntervalsId.get(snackBarId));
    clearInterval(this._snackBarsTimeoutsId.get(snackBarId));
    this._snackBarsIntervalsId.delete(snackBarId);
    this._snackBarsTimeoutsId.delete(snackBarId);
  }

  _displayDurationUnpause(snackBarElement: HTMLDivElement): void {
    const snackBarId = snackBarElement.dataset.id as string;
    const snackBarOptions = this._snackBarsOptions.get(snackBarId) as SnackBarDefaultOptions;

    if (!snackBarOptions) {
      return;
    }

    const snackBarDisplayTime = snackBarElement.dataset.displayedTime ? Number(snackBarElement.dataset.displayedTime) : 0;
    const snackBarRemainingDisplayTime = snackBarOptions.autoClose - snackBarDisplayTime;

    this._progressCalculation(snackBarElement, snackBarOptions.autoClose);
    this._autoClose(snackBarElement, snackBarRemainingDisplayTime, snackBarOptions.onClose);
  }

  _onFocusLossHandler(): void {
    if (document.visibilityState === 'hidden') {
      this._pauseOnFocusLossElementsList.length = 0;

      document.querySelectorAll('[data-snack-bar-element]')?.forEach(element => {
        const currentElement = element as HTMLDivElement;
        const currentElementId = currentElement.dataset.id as string;

        if (this._snackBarsOptions.get(currentElementId)?.pauseOnFocusLoss) {
          this._displayDurationPause(currentElement);
          this._pauseOnFocusLossElementsList.push(currentElement);
        }
      });
    } else {
      if (!this._pauseOnFocusLossElementsList.length) {
        return;
      }
      this._pauseOnFocusLossElementsList.forEach(element => {
        this._displayDurationUnpause(element);
      });
    }
  }

  _swipeToCloseHandler(event: TouchEvent): void {
    if (!event.currentTarget) {
      return;
    }

    const targetSnackBarElement = event.currentTarget as HTMLDivElement;
    const targetSnackBarElementId = targetSnackBarElement.dataset.id as string;
    const targetSnackBarOptions = this._snackBarsOptions.get(targetSnackBarElementId) as SnackBarDefaultOptions;
    const targetSnackBarElementContainer = targetSnackBarElement.closest('.snack-bar') as HTMLDivElement;
    const { clientX } = event.changedTouches[0];
    let { pageX } = event.changedTouches[0];
    const {
      width: targetSnackBarElementWidth,
      x: targetSnackBarElementX,
    } = targetSnackBarElement.getBoundingClientRect();
    const { x: targetSnackBarElementContainerX } = targetSnackBarElementContainer.getBoundingClientRect();
    const touchPointShiftX = clientX - (targetSnackBarElementX - targetSnackBarElementContainerX);
    const swipeToCloseDistance = targetSnackBarElementWidth / 2;

    const touchMoveHandler = this._throttle((event: TouchEvent): void => {
      const targetSnackBarElementTranslateX = Number(targetSnackBarElement.style.getPropertyValue('--translateX').replace('px', ''));

      document.body.style.overflow = 'hidden';
      pageX = event.changedTouches[0].pageX;
      targetSnackBarElement.style.setProperty('--translateX', `${pageX - touchPointShiftX}px`);
      targetSnackBarElement.style.setProperty('--opacity', `${1 - Math.abs(targetSnackBarElementTranslateX) / swipeToCloseDistance}`);

      if (targetSnackBarOptions.pauseOnHover) {
        this._displayDurationPause(targetSnackBarElement);
      }

      if (Math.abs(targetSnackBarElementTranslateX) > swipeToCloseDistance) {
        this._delete(targetSnackBarElement, targetSnackBarOptions.onClose, true);
      }
    }, 40);

    const touchEndHandler = (): void => {
      targetSnackBarElement.removeAttribute('data-dragging');
      targetSnackBarElement.style.removeProperty('--translateX');
      targetSnackBarElement.style.removeProperty('--opacity');

      if (targetSnackBarOptions.pauseOnHover) {
        this._displayDurationUnpause(targetSnackBarElement);
      }

      targetSnackBarElement.removeEventListener('touchmove', touchMoveHandler);
      document.body.style.overflow = 'auto';
    };

    targetSnackBarElement.dataset.dragging = '';
    targetSnackBarElement.addEventListener('touchmove', touchMoveHandler);
    targetSnackBarElement.addEventListener('touchend', touchEndHandler, { once: true });
  }

  _delete(snackBarElement: HTMLDivElement, onCloseFunction: () => void, swipeClose = false) {
    const containerElement = snackBarElement.parentElement;
    const snackBarId = snackBarElement.dataset.id as string;

    if (swipeClose) {
      snackBarElement.dataset.swipeClose = '';
      snackBarElement.style.opacity = '0';
    }

    snackBarElement.dataset.isActive = 'false';
    snackBarElement.addEventListener('animationend', () => {
      snackBarElement.remove();
      this._snackBarsOptions.delete(snackBarId);
      this._snackBarsTimeoutsId.delete(snackBarId);
      this._snackBarsIntervalsId.delete(snackBarId);

      if (containerElement) {
        if (containerElement.hasChildNodes()) {
          return;
        }
        containerElement.remove();
        document.removeEventListener('visibilitychange', this._bindedOnFocusLossHandler);
      }
    });
    onCloseFunction();
  }

  _throttle<Params extends any[]>(func: (...args: Params) => any, delay: number): (...args: Params) => void {
    let isThrottle: boolean;
    let lastFn: ReturnType<typeof setTimeout>;
    let lastTime: number;

    function wrapper (this: any, ...args: Params) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const savedThis = this;
      const savedArgs = args;

      if (!isThrottle) {
        func.apply(savedThis, savedArgs);
        lastTime = Date.now();
        isThrottle = true;
      } else {
        clearTimeout(lastFn);
        lastFn = setTimeout(() => {
          if (Date.now() - lastTime >= delay) {
            func.apply(savedThis, savedArgs);
            lastTime = Date.now();
          }
        }, Math.max(delay - (Date.now() - lastTime), 0));
      }
    }
    return wrapper;
  }
}
