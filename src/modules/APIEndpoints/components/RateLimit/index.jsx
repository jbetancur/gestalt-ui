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
    isToggled: PropTypes.bool,
    onToggledState: PropTypes.func,
  };

  static defaultProps = {
    className: '',
    isToggled: false,
    onToggledState: v => v,
  };

  constructor(props) {
    super(props);

    this.state = {
      showLimits: props.isToggled,
    };
  }

  onToggledState() {
    return this.state.showLimits;
  }

  handleCheckedState() {
    const newState = !this.state.showLimits;
    this.setState({ showLimits: newState });
    this.props.onToggledState(newState);
  }

  render() {
    return (
      <div className={this.props.className}>
        <div className="flex-row">
          <Field
            id="show-rate-limits"
            component={Checkbox}
            name={this.props.rateLimitToggledName}
            checked={this.state.showLimits}
            label="Rate Limit"
            style={{ minWidth: '10em' }}
            onChange={() => this.handleCheckedState()}
            className="flex-3 flex-xs-12"
          />
          {this.state.showLimits &&
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
