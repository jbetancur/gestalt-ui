import base from './base';

export default {
  ...base,
  colors: {
    ...base.colors,

    // Main Theme
    primary: {
      default: '#03a9f4',
      50: '#e1f5fe',
      100: '#b3e5fc',
      200: '#81d4fa',
      300: '#4fc3f7',
      400: '#29b6f6',
      500: '#03a9f4',
      600: '#039be5',
      700: '#0288d1',
      800: '#0277bd',
      900: '#01579b',
      A100: '#80d8ff',
      A200: '#40c4ff',
      A400: '#00b0ff',
      A700: '#0091ea'
    },
    secondary: {
      default: '#03a9f4',
      50: '#e3f2fd',
      100: '#bbdefb',
      200: '#90caf9',
      300: '#64b5f6',
      400: '#42a5f5',
      500: '#2196f3',
      600: '#1e88e5',
      700: '#1976d2',
      800: '#1565c0',
      900: '#0d47a1',
      A100: '#82b1ff',
      A200: '#448aff',
      A400: '#2979ff',
      A700: '#2962ff'
    },
    common: {
      black: '#000',
      white: '#fff',
    },
    grey: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
      A100: '#d5d5d5',
      A200: '#aaaaaa',
      A400: '#303030',
      A700: '#616161',
    },
    background: {
      paper: '#fff',
      default: '#fafafa',
      defaultBorder: '#eeeeee',
    },

    accent: '#d5dcec',
    accentVariant: '#9BA1AC',
    active: '#4fc3f7',
    activeVariant: '#0288d1',

    // Navs
    leftNavBackground: '#394F7F',
    leftNavBackgroundVariant: '#526899',

    // Fonts
    font: '#212121',
    fontVariant: '#FAFAFA',
    fontTitle: '#424242',
    fontTitleVariant: '#FAFAFA',
    fontCaption: '#9e9e9e',
    fontCaptionVariant: '#FAFAFA',

    // Icons
    defaultIcon: 'rgba(0, 0, 0, 0.54)',

    // Progress
    progress: '#9e9e9e',
    progressVariant: '#4fc3f7',

    // Dividers
    divider: '#eeeeee',
    dividerVariant: '#e0e0e0',

    // Notifications
    error: '#f44336',
    warning: '#ff9800',
    info: '#2196f3',
    success: '#00c853',

    // Login Page
    loginBackground: '#222639',
    loginBackgroundVariant: '#12141E',
    loginFont: '#383b4c',
    loginButton: 'white',
    loginButtonVariant: '#cfd8dc',
    loginFieldBorder: '#383b4c',
    loginFieldBorderFocus: '#58B8D3',

    // Misc
    organization: '#b0bec5',
    workspace: '#42a5f5',
    environment: '#fdd835',
    disabled: '#9e9e9e',
    favorite: '#fdd835',
  }
};
