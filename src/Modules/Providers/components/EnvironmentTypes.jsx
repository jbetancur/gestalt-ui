import React, { PureComponent } from 'react';
import { Field } from 'react-final-form';
import { MultiSelect } from 'components/Form';
import { Caption } from 'components/Typography';
import environmentTypes from '../lists/environmentTypes';

class EnvironmentTypes extends PureComponent {
  render() {
    return (
      <React.Fragment>
        <Caption light>Allowed Environments this Provider can be used with</Caption>
        <Field
          id="restricted-environment-types"
          label="Allow Environments"
          component={MultiSelect}
          name="properties.environment_types"
          data={environmentTypes.map(e => e.value)}
          helpText="type to search for an environment type"
        />
      </React.Fragment>
    );
  }
}

export default EnvironmentTypes;
