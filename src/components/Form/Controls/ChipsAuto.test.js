import React from 'react';
import { render } from 'react-testing-library';
import ChipsAuto from './MultiSelect';

describe('ChipsAuto', () => {
  it('mounts with basic props', () => {
    const { container } = render(<ChipsAuto meta={{ error: null, touched: false }} />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
