import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import CopyToClipboard from 'react-copy-to-clipboard';
import Button from '../Button';

const EnhancedButton = styled(({ inLink, ...rest }) => <Button {...rest} />)`
  text-transform: none;
  vertical-align: middle;
  ${props => props.inLink && css`
    height: 20px;
    width: 24px;
    padding: 1px;

    i {
      font-size: 16px !important;
    }

    &:hover {
      background: none !important;
    }
  `};
`;

const ClipboardButton = ({ text, showLabel, inLink, tooltipLabel, tooltipPosition }) => (
  <CopyToClipboard text={text}>
    <EnhancedButton
      iconChildren="content_copy"
      tooltipPosition={tooltipPosition}
      tooltipLabel={tooltipLabel}
      flat={showLabel}
      icon={!showLabel}
      inLink={inLink}
    >
      {showLabel && text}
    </EnhancedButton>
  </CopyToClipboard>
);

ClipboardButton.propTypes = {
  text: PropTypes.string.isRequired,
  tooltipLabel: PropTypes.string,
  tooltipPosition: PropTypes.string,
  showLabel: PropTypes.bool,
  inLink: PropTypes.bool,
};

ClipboardButton.defaultProps = {
  tooltipLabel: '',
  tooltipPosition: 'bottom',
  showLabel: true,
  inLink: false,
};

export default ClipboardButton;
