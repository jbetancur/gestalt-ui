import React, { PureComponent } from 'react';
import { Field } from 'react-final-form';
import { MultiSelect } from 'components/Form';
import httpMethods from '../lists/httpMethods';

class HTTPMethods extends PureComponent {
  render() {
    return (
      <Field
        id="allow-http-methods"
        label="Allow Methods"
        component={MultiSelect}
        name="properties.methods"
        data={httpMethods.map(e => e.value)}
        helpText="type to search for an http method"
      />
    );
  }
}

export default HTTPMethods;
