import React from 'react';
import CardTitle from './CardTitle';
import { renderWithTheme } from '../../../test/helpers';

describe('(Cards) CardTitle', () => {
  it('mounts with basic props', () => {
    const { container } = renderWithTheme(<CardTitle />);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('mounts with children', () => {
    const { container } = renderWithTheme(<CardTitle>Hellow!</CardTitle>);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('mounts with title and subTitle', () => {
    const { container } = renderWithTheme(<CardTitle title="woop" subTitle="woop!" />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
