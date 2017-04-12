import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-md/lib/Buttons/Button';
import CopyToClipboard from 'react-copy-to-clipboard';

class LambdaUUID extends PureComponent {
  static propTypes = {
    lambda: PropTypes.object.isRequired,
    tooltipPosition: PropTypes.string,
  }

  static defaultProps = {
    tooltipPosition: 'right',
  }

  render() {
    return (
      <CopyToClipboard text={this.props.lambda.id}>
        <Button
          label={this.props.lambda.id}
          iconBefore={false}
          tooltipPosition={this.props.tooltipPosition}
          tooltipLabel="Copy UUID"
        >
        content_copy
            </Button>
      </CopyToClipboard>
    );
  }
}

export default LambdaUUID;
