import React, { PureComponent } from 'react';
import { Field } from 'react-final-form';
import { SelectionControlGroup } from 'components/ReduxFormFields';
import httpMethods from '../lists/httpMethods';

class HTTPMethods extends PureComponent {
  render() {
    return (
      <Field
        inline
        controlStyle={{ minWidth: '7em' }}
        component={SelectionControlGroup}
        type="checkbox"
        id="controlGroupCheckbox"
        name="properties.methods"
        controls={httpMethods}
      />
    );
  }
}

export default HTTPMethods;
