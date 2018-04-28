import React, { PureComponent } from 'react';
import { Field } from 'react-final-form';
import { SelectionControlGroup } from 'components/ReduxFormFields';
import { Caption } from 'components/Typography';
import httpMethods from '../lists/httpMethods';

class HTTPMethods extends PureComponent {
  render() {
    return (
      <React.Fragment>
        <Field
          inline
          controlStyle={{ minWidth: '7em' }}
          component={SelectionControlGroup}
          type="checkbox"
          id="controlGroupCheckbox"
          name="properties.methods"
          controls={httpMethods}
        />

        <Caption light>* at least one http method is required</Caption>
      </React.Fragment>
    );
  }
}

export default HTTPMethods;
