import React from 'react';
import DeleteIcon from './DeleteIcon';
import baseTheme from '../../themes/light';
import { shallowWithTheme } from '../../../test/helpers';

describe('(Component) DeleteIcon', () => {
  it('renders component without exploding', () => {
    const wrapper = shallowWithTheme(<DeleteIcon />, baseTheme);

    expect(wrapper).toHaveLength(1);
  });

  test('it mounts without additional props', () => {
    const wrapper = shallowWithTheme(<DeleteIcon />, baseTheme);

    expect(wrapper.dive()).toMatchSnapshot();
  });
});
