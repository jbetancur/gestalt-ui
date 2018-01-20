import React, { PureComponent } from 'react';
import { Field } from 'redux-form';
import { SelectionControlGroup } from 'components/ReduxFormFields';
import { Caption } from 'components/Typography';
import httpMethods from '../lists/httpMethods';

class HTTPMethods extends PureComponent {
  render() {
    return [
      <Field
        key="httpmethods--properties.methods"
        inline
        controlStyle={{ minWidth: '7em' }}
        component={SelectionControlGroup}
        type="checkbox"
        id="controlGroupCheckbox"
        name="properties.methods"
        controls={httpMethods}
      />,
      <Caption light key="httpmethods--help-caption">at least one http method is required</Caption>
    ];
  }
}

export default HTTPMethods;
