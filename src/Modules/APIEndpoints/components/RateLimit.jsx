import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexybox';
import { Field } from 'react-final-form';
import { Conditional, Checkbox, TextField } from 'components/Form';

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
            label="Per Minute Rate Limit"
            type="checkbox"
            component={Checkbox}
            name="properties.plugins.rateLimit.enabled"
            checked={this.props.isToggled}
          />
        </Col>
        <Conditional when="properties.plugins.rateLimit.enabled" is={true}>
          <Col flex={6}>
            <Field
              component={TextField}
              name="properties.plugins.rateLimit.perMinute"
              inputProps={{
                min: 1,
                max: 65536,
                step: 1,
              }}
              label="Per Minute"
              type="number"
              required
              parse={value => Number(value)} // redux form formats everything as string, so force number
            />
          </Col>
        </Conditional>
      </Row>
    );
  }
}
