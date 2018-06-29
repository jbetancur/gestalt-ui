import React from 'react';
import ChipsAuto from './ChipsAuto';

describe('ChipsAuto', () => {
  it('mounts with basic props', () => {
    const wrapper = mount(<ChipsAuto meta={{ error: null, touched: false }} />);

    expect(wrapper).toMatchSnapshot();
  });
});
