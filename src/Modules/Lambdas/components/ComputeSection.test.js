import React from 'react';
import { Form } from 'react-final-form';
import Compute from './ComputeSection';
import { renderWithTheme } from '../../../../test/helpers';

describe('Lambdas::Components::ComputeSection', () => {
  it('mounts with basic props', () => {
    const formValuesMock = {
      properties: {
        cpus: 1,
        memory: 256,
      }
    };

    const { container } = renderWithTheme(
      <Form
        initialValues={formValuesMock}
        render={() => <Compute form={{ change: jest.fn() }} />}
        onSubmit={jest.fn()}
      />
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
