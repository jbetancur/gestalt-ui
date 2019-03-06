import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { IconButton } from 'components/Buttons';
import { DeleteIcon } from 'components/Icons';

const DeleteButton = styled(IconButton)`
  color: ${props => props.theme.colors['$md-red-500']};
`;

class APIEndpointDeleteButton extends PureComponent {
  static propTypes = {
    endpoint: PropTypes.object.isRequired,
    onDelete: PropTypes.func.isRequired,
  }

  handleClick = () => {
    this.props.onDelete(this.props.endpoint);
  }

  render() {
    return (
      <DeleteButton
        icon={DeleteIcon}
        onClick={this.handleClick}
      />
    );
  }
}

export default APIEndpointDeleteButton;
