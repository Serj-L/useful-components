import {
  Spinner,
  ScrollTop,
  ThemeSwitcher,
  SnackBar,
} from './app_modules';

import './styles.scss';

const changeThemeButton = document.getElementById('theme-switcher');
const spinner = new Spinner({ size: 120, strokeWidth: 8, color: 'red' });
const scrollTop = new ScrollTop({ size: 24, triggerOffSet: 150, isLeftPosition: true, borderRadius: 6 });
const themeSwithcher = new ThemeSwitcher ({ localStorageKeyName: 'testTheme', initialThemeType: 'dark' });
const snackBarNotification = new SnackBar();

spinner.use(true);

window.addEventListener('scroll', () => {
  scrollTop.use();
  if (document.documentElement.scrollTop > 350) {
    scrollTop.compensateScrollBarWidth(true);
  } else {
    scrollTop.compensateScrollBarWidth(false);
  }
});

changeThemeButton?.addEventListener('click', () => themeSwithcher.changeThemeType());

snackBarNotification.create('Info', { position: 'top-left', autoClose: 30000, animationType: 'zoom', pauseOnHover: false });
setTimeout(() => {
  snackBarNotification.create('Warning', { type: 'warning', position: 'top-left', autoClose: 20000, animationType: 'flip', pauseOnFocusLoss: false });
}, 2000);
setTimeout(() => {
  snackBarNotification.create('Error', { type: 'error', position: 'top-left', autoClose: 15000, swipeToClose: false });
}, 4000);
setTimeout(() => {
  snackBarNotification.create('Success', { type: 'success', position: 'top-left', autoClose: 10000, animationType: 'slide', pauseOnFocusLoss: false });
}, 5000);
