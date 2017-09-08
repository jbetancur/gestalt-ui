import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Button from 'react-md/lib/Buttons/Button';
import CopyToClipboard from 'react-copy-to-clipboard';

const EnhancedButton = styled(Button)`
  text-transform: none;
  vertical-align: middle;
`;

class ClipboardButton extends PureComponent {
  static propTypes = {
    text: PropTypes.object.isRequired,
    tooltipLabel: PropTypes.string,
    tooltipPosition: PropTypes.string,
    showUUID: PropTypes.bool,
  }

  static defaultProps = {
    tooltipLabel: '',
    tooltipPosition: 'bottom',
    showUUID: true,
  }

  render() {
    return (
      <CopyToClipboard text={this.props.text}>
        <EnhancedButton
          label={this.props.showUUID && this.props.text}
          tooltipPosition={this.props.tooltipPosition}
          tooltipLabel={this.props.tooltipLabel}
          flat={this.props.showUUID}
          icon={!this.props.showUUID}
        >
        content_copy
        </EnhancedButton>
      </CopyToClipboard>
    );
  }
}

export default ClipboardButton;
