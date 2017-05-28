import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Button from 'react-md/lib/Buttons/Button';
import CopyToClipboard from 'react-copy-to-clipboard';

const EnhancedButton = styled(Button)`
  text-transform: none;
  padding: .3em;
`;

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
        <EnhancedButton
          label={this.props.showUUID ? this.props.model.id : null}
          tooltipPosition={this.props.tooltipPosition}
          tooltipLabel="Copy UUID"
          flat={this.props.showUUID}
        >
        content_copy
        </EnhancedButton>
      </CopyToClipboard>
    );
  }
}

export default CopyUUIDButton;
