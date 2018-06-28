import React from 'react';
import Chips from './Chips';

describe('Chips', () => {
  it('mounts with basic props', () => {
    const wrapper = mount(<Chips meta={{ error: null, touched: false }} />);

    expect(wrapper).toMatchSnapshot();
  });
});
