import React from 'react';
import Header from './Header';
import { shallowWithTheme } from '../../../../test/helpers';

describe('(Panels) Header', () => {
  it('renders without exploding', () => {
    const wrapper = shallowWithTheme(
      <Header title="gazobazorb" />
    );

    expect(wrapper).to.have.length(1);
  });

  it('renders with a title', () => {
    const wrapper = shallowWithTheme(
      <Header title="gazobazorb" />
    );

    expect(wrapper.dive()).toMatchSnapshot();
  });
});
