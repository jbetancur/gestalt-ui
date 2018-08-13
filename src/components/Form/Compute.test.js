import React from 'react';
import Compute from './Compute';
import { shallowWithTheme } from '../../../test/helpers';

describe('Components::Form::Compute', () => {
  it('mounts with basic props', () => {
    const formValuesMock = {
      properties: {
        cpus: 1,
        memory: 256,
      }
    };

    const wrapper = shallowWithTheme(<Compute formValues={formValuesMock} form={{ change: jest.fn() }} />);

    expect(wrapper.dive().dive()).toMatchSnapshot();
  });
});
