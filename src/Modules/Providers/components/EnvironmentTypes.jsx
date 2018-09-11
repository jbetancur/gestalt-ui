import React, { PureComponent } from 'react';
import { Field } from 'react-final-form';
import { ChipsAuto } from 'components/Lists';
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
          component={ChipsAuto}
          name="properties.environment_types"
          data={environmentTypes.map(e => e.value)}
          helpText="type to search for an environment type"
          showUnfilteredData
        />
      </React.Fragment>
    );
  }
}

export default EnvironmentTypes;
