import React from 'react';
import AddressCell from './AddressCell';
import { shallowWithTheme } from '../../../../test/helpers';

describe('Containers::Component AddressCell', () => {
  it('does not render when there is no address', () => {
    const wrapper = shallow(<AddressCell address={{}} />);

    expect(wrapper).toMatchSnapshot();
  });

  it('does not render when there is an invalid address shape', () => {
    const address = { host: 'gazoropazorp', port: 80, };
    const wrapper = shallowWithTheme(<AddressCell address={address} />);

    expect(wrapper).toMatchSnapshot();
  });

  it('renders with a valid address', () => {
    const address = { protocol: 'http', host: 'gazoropazorp', port: 80, };
    const wrapper = shallowWithTheme(<AddressCell address={address} />);

    expect(wrapper.dive().dive()).toMatchSnapshot();
  });
});
