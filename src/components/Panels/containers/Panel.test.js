import React from 'react';
import { fireEvent } from 'react-testing-library';
import Panel from './Panel';
import { renderWithTheme } from '../../../../test/helpers';

describe('(Panels) Panel', () => {
  it('renders component without exploding', () => {
    const { container } = renderWithTheme(
      <Panel title="gazobazorb" />
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders component with basic props', () => {
    const { container } = renderWithTheme(
      <Panel title="gazobazorb" />
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders component with minHeight prop', () => {
    const { container } = renderWithTheme(
      <Panel title="gazobazorb" minHeight="10em" />
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders component with noPadding prop', () => {
    const { container } = renderWithTheme(
      <Panel title="gazobazorb" noPadding />
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders component with children', () => {
    const { container } = renderWithTheme(
      <Panel title="gazobazorb"><span>this is a test</span></Panel>
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders component activity status when pending', () => {
    const { container } = renderWithTheme(
      <Panel title="gazobazorb" pending><span>this is a test</span></Panel>
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('toggles isExpanded on correct elements when the Header is clicked', () => {
    const { container, getByText } = renderWithTheme(
      <Panel title="gazobazorb"><span>this is a test</span></Panel>
    );
    const header = getByText('gazobazorb');

    fireEvent.click(header);

    expect(container.firstChild).toMatchSnapshot();
  });
});
