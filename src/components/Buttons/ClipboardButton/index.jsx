import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import Button from 'react-md/lib/Buttons/Button';
import CopyToClipboard from 'react-copy-to-clipboard';

const EnhancedButton = styled(Button)`
  text-transform: none;
  vertical-align: middle;

  ${props => props.inLink && css`
    height: 20px;
    width: 24px;
    padding: 1px;

    i {
      font-size: 16px!important;
    }

    &:hover {
      background: none!important;
    }
  `};
`;

class ClipboardButton extends PureComponent {
  static propTypes = {
    text: PropTypes.string.isRequired,
    tooltipLabel: PropTypes.string,
    tooltipPosition: PropTypes.string,
    showLabel: PropTypes.bool,
    inLink: PropTypes.bool,
  };

  static defaultProps = {
    tooltipLabel: '',
    tooltipPosition: 'bottom',
    showLabel: true,
    inLink: false,
  };

  render() {
    return (
      <CopyToClipboard text={this.props.text}>
        <EnhancedButton
          iconChildren="content_copy"
          tooltipPosition={this.props.tooltipPosition}
          tooltipLabel={this.props.tooltipLabel}
          flat={this.props.showLabel}
          icon={!this.props.showLabel}
          inLink={this.props.inLink}
        >
          {this.props.showLabel && this.props.text}
        </EnhancedButton>
      </CopyToClipboard>
    );
  }
}

export default ClipboardButton;
