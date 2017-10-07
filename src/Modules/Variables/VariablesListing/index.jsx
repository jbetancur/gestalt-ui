import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-flexybox';
import { map, sortBy } from 'lodash';
import Label from 'components/Label';

class VariablesListing extends Component {
  static propTypes = {
    envMap: PropTypes.object.isRequired,
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
        <Col flex={19} style={{ overflow: 'scroll', maxHeight: '18em' }}>
          {sortedVariables.map((item, i) => (
            <div key={i}>
              <Label>{item.name}: </Label><span className="gf-subtitle">{item.value}</span>
            </div>
          ))}
        </Col>
      </Row>
    );
  }
}

export default VariablesListing;
