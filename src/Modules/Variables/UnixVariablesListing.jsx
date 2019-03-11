import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { checkIfPassword } from 'util/helpers/strings';
import { Col, Row } from 'react-flexybox';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';
import Label from 'components/Label';

class UnixVariablesListing extends PureComponent {
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

export default UnixVariablesListing;
