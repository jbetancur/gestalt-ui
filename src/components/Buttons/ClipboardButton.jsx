import React from 'react';
import PropTypes from 'prop-types';
import CopyToClipboard from 'react-copy-to-clipboard';
import Button from '@material-ui/core/Button';
import ContentCopy from '@material-ui/icons/FileCopy';
import IconButton from './IconButton';

const ClipboardButton = ({ text, showLabel, table, tooltipLabel, tooltipPosition }) => {
  const renderButton = () => {
    if (showLabel) {
      return (
        <Button
          label={text}
          tooltipPosition={tooltipPosition}
          tooltipLabel={tooltipLabel}
        >
          <ContentCopy />
        </Button>
      );
    }

    return (
      <IconButton
        tooltipPosition={tooltipPosition}
        tooltipLabel={tooltipLabel}
        style={table ? { padding: '3px' } : null}
      >
        <ContentCopy fontSize="small" style={table ? { fontSize: '16px' } : null} />
      </IconButton>
    );
  };

  return (
    <CopyToClipboard text={text}>
      {renderButton()}
    </CopyToClipboard>
  );
};

ClipboardButton.propTypes = {
  text: PropTypes.string.isRequired,
  tooltipLabel: PropTypes.string,
  tooltipPosition: PropTypes.string,
  showLabel: PropTypes.bool,
  table: PropTypes.bool,
};

ClipboardButton.defaultProps = {
  tooltipLabel: '',
  tooltipPosition: 'bottom',
  showLabel: true,
  table: false,
};

export default ClipboardButton;
