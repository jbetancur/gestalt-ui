import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Row, Col } from 'react-flexybox';
import { SelectField } from 'components/ReduxFormFields';
import { Panel } from 'components/Panels';

const SelectProvider = ({ providers }) => (
  <Row gutter={5}>
    <Col flex={12}>
      <Panel title="Select a Provider" expandable={false}>
        <Row gutter={5}>
          <Col flex={12}>
            <Field
              id="container-provider"
              component={SelectField}
              name="properties.provider.id"
              required
              label="Container Provider"
              itemLabel="name"
              itemValue="id"
              menuItems={providers}
              async
            />
          </Col>
        </Row>
      </Panel>
    </Col>
  </Row>
);

SelectProvider.propTypes = {
  providers: PropTypes.array.isRequired,
};

export default SelectProvider;