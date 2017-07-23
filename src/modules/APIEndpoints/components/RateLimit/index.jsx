import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import Checkbox from 'components/Checkbox';
import TextField from 'components/TextField';

export default class RateLimit extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    rateLimitToggledName: PropTypes.string.isRequired,
    perMinuteName: PropTypes.string.isRequired,
    isToggled: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    className: '',
    isToggled: false,
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={this.props.className}>
        <div className="flex-row">
          <Field
            id="show-rate-limits"
            component={Checkbox}
            name={this.props.rateLimitToggledName}
            checked={this.props.isToggled}
            label="Rate Limit"
            style={{ minWidth: '10em' }}
            className="flex-3 flex-xs-12"
          />
          {this.props.isToggled &&
          <Field
            component={TextField}
            name={this.props.perMinuteName}
            min={1}
            max={65536}
            step={1}
            label="Per Minute"
            type="number"
            required
            parse={value => Number(value)}  // redux form formats everything as string, so force number
            helpText="Accesses per minute allowed for this endpoint"
            className="flex-3 flex-xs-12"
          />}
        </div>
      </div>
    );
  }
}
