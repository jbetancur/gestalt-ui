import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexybox';
import { Field } from 'redux-form';
import { Checkbox, TextField } from 'components/ReduxFormFields';
import { Caption } from 'components/Typography';

export default class RateLimit extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    isToggled: PropTypes.bool,
  };

  static defaultProps = {
    className: '',
    isToggled: false,
  };

  render() {
    return (
      <Row className={this.props.className}>
        <Col flex={6}>
          <Field
            id="show-rate-limits"
            component={Checkbox}
            name="properties.plugins.rateLimit.enabled"
            checked={this.props.isToggled}
            label="Rate Limit"
          />
        </Col>
        {this.props.isToggled &&
        <Col flex={6}>
          <Field
            component={TextField}
            name="properties.plugins.rateLimit.perMinute"
            min={1}
            max={65536}
            step={1}
            label="Per Minute"
            type="number"
            required
            parse={value => Number(value)} // redux form formats everything as string, so force number
            style={{ paddingLeft: '3px' }}
          />
        </Col>}
        <Caption light>Allowed Accesses per minute</Caption>
      </Row>
    );
  }
}
