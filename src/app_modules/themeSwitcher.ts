/* eslint-disable no-unused-vars */
enum ThemeTypesEnum {
  DARK = 'dark',
  LIGHT = 'light',
}
interface IThemeSwither {
  containerElement?: HTMLElement,
  initialThemeType?: `${ThemeTypesEnum}`,
  localStorageKeyName: string,
}

export class ThemeSwitcher {
  _containerElement: HTMLElement;
  _localStorageKeyName: string;

  constructor(params: IThemeSwither) {
    this._containerElement = params.containerElement ? params.containerElement : document.body;
    this._localStorageKeyName = params.localStorageKeyName;
    const themeTypeFromLocalStorage = this._getThemeTypeFromLocalStorage(this._localStorageKeyName);
    let initialThemeType: `${ThemeTypesEnum}`;

    if (themeTypeFromLocalStorage === ThemeTypesEnum.DARK || themeTypeFromLocalStorage === ThemeTypesEnum.LIGHT) {
      initialThemeType = themeTypeFromLocalStorage;
    } else {
      if (params.initialThemeType) {
        initialThemeType = params.initialThemeType;
      } else {
        initialThemeType = window.matchMedia && window.window.matchMedia('(prefers-color-scheme: dark)').matches ? ThemeTypesEnum.DARK : ThemeTypesEnum.LIGHT;
      }

      this._setThemeTypeToLocalStorage(this._localStorageKeyName, initialThemeType);
    }

    if (this._containerElement.dataset.themeType !== initialThemeType) {
      this._containerElement.dataset.themeType = initialThemeType;
    }
  }

  _getThemeTypeFromLocalStorage(keyName: string): string | null {
    return localStorage.getItem(keyName);
  }

  _setThemeTypeToLocalStorage(keyName: string, themeType: `${ThemeTypesEnum}`): void {
    localStorage.setItem(keyName, themeType);
  }

  changeThemeType() {
    const currentThemeType = this._containerElement.dataset.themeType;
    const newThemeType = currentThemeType === ThemeTypesEnum.LIGHT ? ThemeTypesEnum.DARK : ThemeTypesEnum.LIGHT;

    this._containerElement.dataset.themeType = newThemeType;
    this._setThemeTypeToLocalStorage(this._localStorageKeyName, newThemeType);
  }
}
