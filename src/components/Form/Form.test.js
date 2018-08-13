import React from 'react';
import Form from './Form';

describe('Components::Form::Form', () => {
  it('mounts with default props', () => {
    const wrapper = shallow(<Form />);

    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('renders correctly when disabled', () => {
    const wrapper = shallow(<Form disabled />);

    expect(wrapper.dive()).toMatchSnapshot();
  });
});
