import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexybox';
import { Field } from 'react-final-form';
import { Checkbox, TextField } from 'components/ReduxFormFields';
import { Conditional } from 'components/Form';

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
            component={Checkbox}
            name="properties.plugins.rateLimit.enabled"
            defaultChecked={this.props.isToggled}
            hasMargin={false}
          />
        </Col>
        <Conditional when="properties.plugins.rateLimit.enabled" is={true}>
          <Col flex={6}>
            <Field
              component={TextField}
              name="properties.plugins.rateLimit.perMinute"
              min={1}
              max={65536}
              step={1}
              placeholder="Per Minute"
              type="number"
              required
              parse={value => Number(value)} // redux form formats everything as string, so force number
              style={{ paddingLeft: '5px' }}
            />
          </Col>
        </Conditional>
      </Row>
    );
  }
}
