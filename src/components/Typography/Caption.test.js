import React from 'react';
import Caption from './Caption';
import { renderWithTheme } from '../../../test/helpers';

describe('(Component) Caption', () => {
  it('renders with basic props', () => {
    const { container } = renderWithTheme(<Caption>this is a test</Caption>);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('it renders with light prop', () => {
    const { container } = renderWithTheme(<Caption light>this is a test</Caption>);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('it renders with small prop', () => {
    const { container } = renderWithTheme(<Caption small>this is a test</Caption>);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('it renders with large prop', () => {
    const { container } = renderWithTheme(<Caption large>this is a test</Caption>);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('it renders with block prop', () => {
    const { container } = renderWithTheme(<Caption block>this is a test</Caption>);

    expect(container.firstChild).toMatchSnapshot();
  });
});
