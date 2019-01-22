import React from 'react';
import { Form } from 'react-final-form';
import Compute from './Compute';
import { renderWithTheme } from '../../../test/helpers';

describe('Components::Form::Compute', () => {
  it('mounts with basic props', () => {
    const formValuesMock = {
      properties: {
        cpus: 1,
        memory: 256,
      }
    };

    const { container } = renderWithTheme(
      <Form
        render={() => <Compute formValues={formValuesMock} form={{ change: jest.fn() }} />}
        onSubmit={jest.fn()}
      />
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
