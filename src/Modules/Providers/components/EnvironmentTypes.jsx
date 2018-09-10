import React, { PureComponent } from 'react';
import { Field } from 'react-final-form';
import { SelectionControlGroup } from 'components/ReduxFormFields';
import { Caption } from 'components/Typography';
import environmentTypes from '../lists/environmentTypes';

class EnvironmentTypes extends PureComponent {
  render() {
    return (
      <React.Fragment>
        <Caption light>Allowed Environments this Provider can be used with</Caption>
        <Field
          inline
          component={SelectionControlGroup}
          type="checkbox"
          id="restricted-environment-types"
          name="properties.environment_types"
          controls={environmentTypes}
        />
      </React.Fragment>
    );
  }
}

export default EnvironmentTypes;
