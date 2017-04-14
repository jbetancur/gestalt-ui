import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-md/lib/Buttons/Button';
import CopyToClipboard from 'react-copy-to-clipboard';

class CopyUUIDButton extends PureComponent {
  static propTypes = {
    model: PropTypes.object.isRequired,
    tooltipPosition: PropTypes.string,
    showUUID: PropTypes.bool,
  }

  static defaultProps = {
    tooltipPosition: 'right',
    showUUID: true,
  }

  render() {
    return (
      <CopyToClipboard text={this.props.model.id}>
        <Button
          label={this.props.showUUID ? this.props.model.id : null}
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

export default CopyUUIDButton;
