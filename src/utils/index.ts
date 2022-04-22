export const dateToStringConverter = (date: Date): string => {
  const year = `${date.getFullYear()}`;
  const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`;
  const day = date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`;

  return `${year}-${month}-${day}`;
};

export function debounce<Params extends any[]>(func: (...args: Params) => any, timeout: number): (...args: Params) => void {
  let timer: NodeJS.Timeout;

  return (...args: Params) => {
    clearTimeout(timer);

    timer = setTimeout(() => {
      func(...args);
    }, timeout);
  };
}

export function throttle<Params extends any[]>(func: (...args: Params) => any, delay: number): (...args: Params) => void {
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

function getScrollBarWidth (): number {
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

export function scrollLockUnlock (action: 'lock' | 'unlock', isMobile: boolean): void {
  if (isMobile) {
    if (action === 'lock') {
      document.body.style.overflow = 'hidden';
      return;
    }
    document.body.style.overflow = 'auto';
  } else {
    const isVerticalScroll = document.body.scrollHeight > window.innerHeight;
    if (!isVerticalScroll) {
      return;
    }
    if (action === 'lock') {
      const scrollWidth = getScrollBarWidth();
      document.body.style.overflow = 'hidden';
      document.body.style.setProperty('--scrollBarWidth', `${scrollWidth}px`);
      return;
    }
    document.body.style.overflow = 'auto';
    document.body.style.setProperty('--scrollBarWidth', '0px');
  }
}
