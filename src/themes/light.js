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
    fontTitle: '#616161',
    fontTitleVariant: '#FAFAFA',
    fontCaption: '#9e9e9e',
    fontCaptionVariant: '#FAFAFA',

    // Progress
    progress: '#9e9e9e',
    progressVariant: '#4fc3f7',

    // Notifications
    error: '#ff1744',
    warning: '#ff9800',
    info: '#2196f3',
    success: '#00c853',

    // Misc
    organization: '#b0bec5',
    workspace: '#42a5f5',
    environment: '#fdd835',
  }
};
