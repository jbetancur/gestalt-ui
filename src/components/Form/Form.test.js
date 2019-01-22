import React from 'react';
import { render } from 'react-testing-library';
import Form from './Form';

describe('Components::Form::Form', () => {
  it('mounts with default props', () => {
    const { container } = render(<Form />);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correctly when disabled', () => {
    const { container } = render(<Form disabled />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
