import React from 'react';
import AddressCell from './AddressCell';
import { renderWithTheme } from '../../../../test/helpers';

describe('Containers::Component AddressCell', () => {
  it('does not render when there is no address', () => {
    const { container } = renderWithTheme(<AddressCell address={{}} />);

    expect(container.firstChild).toBeNull();
  });

  it('does not render when there is an invalid address shape', () => {
    const address = { host: 'gazoropazorp', port: 80, };
    const { container } = renderWithTheme(<AddressCell address={address} />);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders with a valid address', () => {
    const address = { protocol: 'http', host: 'gazoropazorp', port: 80, };
    const { container } = renderWithTheme(<AddressCell address={address} />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
