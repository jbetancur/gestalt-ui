import React from 'react';
import { shallow, mount } from 'enzyme';
import { ThemeProvider } from 'styled-components';
import 'jest-styled-components';
import theme from '../src/themes/light';

export const shallowWithTheme = (tree) => {
  const context = shallow(<ThemeProvider theme={theme} />)
    .instance()
    .getChildContext();
  return shallow(tree, { context });
};

export const mountWithTheme = (tree) => {
  const context = mount(<ThemeProvider theme={theme} />)
    .instance()
    .getChildContext();
  return mount(tree, { context });
};
