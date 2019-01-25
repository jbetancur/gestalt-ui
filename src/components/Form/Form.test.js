import React from 'react';
import { renderWithTheme } from '../../../test/helpers';
import Form from './Form';

describe('Components::Form::Form', () => {
  it('mounts with default props', () => {
    const { container } = renderWithTheme(
      <Form>
        <div>ho</div>
      </Form>
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correctly when disabled', () => {
    const { container } = renderWithTheme(
      <Form disabled>
        <div>ho</div>
      </Form>
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
