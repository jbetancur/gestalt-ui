import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';
import { Button } from 'react-md';

const DeleteButton = styled(Button)`
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
        icon
        onClick={this.handleClick}
      >
        delete
      </DeleteButton>
    );
  }
}

export default withTheme(APIEndpointDeleteButton);
