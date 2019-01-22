import React from 'react';
import Content from './Content';
import { renderWithTheme } from '../../../../test/helpers';

describe('(Panels) Content', () => {
  it('renders component without exploding', () => {
    const { container } = renderWithTheme(
      <Content />
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders that is expanded', () => {
    const { container } = renderWithTheme(
      <Content isExpanded />
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders that is collapsed', () => {
    const { container } = renderWithTheme(
      <Content isExpanded={false} />
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders with minHeight', () => {
    const { container } = renderWithTheme(
      <Content minHeight="1em" />
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders with noPadding', () => {
    const { container } = renderWithTheme(
      <Content noPadding />
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
