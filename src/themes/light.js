import base from './base';

export default {
  ...base,
  colors: {
    ...base.colors,

    // Main Theme
    primary: '#394F7F',
    primaryVariant: '#526899',
    secondary: '#4fc3f7',
    secondaryVariant: '#122C38',
    teritary: '#222639',
    teritaryVariant: '#12141E',
    background: '#FAFAFA',
    backgroundVariant: '#EEE',
    accent: '#d5dcec',
    accentVariant: '#9BA1AC',
    active: '#4fc3f7',
    activeVariant: '#0288d1',

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
