import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-flexybox';
import { map, sortBy } from 'lodash';
import Label from 'components/Label';

const checkIfPassword = field =>
  field && field.length && (field.toUpperCase().includes('PASSWORD') || field.toUpperCase().includes('SECRET') || field.toUpperCase().includes('KEY'));

class VariablesListing extends Component {
  static propTypes = {
    envMap: PropTypes.object,
  };

  static defaultProps = {
    envMap: {},
  };

  render() {
    const envVariables = map(this.props.envMap, (value, name) => ({ name, value }));
    const sortedVariables = sortBy(envVariables, [v => v.name.toLowerCase()]);

    return (
      <Row columnDivisions={24}>
        <Col flex={5}>
          <Label>Environment Variables:</Label>
        </Col>
        <Col flex={19} style={{ overflow: 'scroll', maxHeight: '18em', width: '100%' }}>
          {sortedVariables.map((item, i) => (
            <div key={i}>
              <Label>{item.name}: </Label><span className="gf-subtitle">{checkIfPassword(item.name) ? '********' : item.value}</span>
            </div>
          ))}
        </Col>
      </Row>
    );
  }
}

export default VariablesListing;
