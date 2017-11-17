import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const ExpansionPanelStyle = styled.div`
  width: 100%;
  max-height: ${props => (props.expanded ? '400px' : 0)};
  overflow: hidden;
  transition: max-height 400ms ${props => (props.expanded ? 'ease-in-out' : 'cubic-bezier(0, 1, 0, 1)')};
`;

class ExpansionPanel extends PureComponent {
  static propTypes = {
    expanded: PropTypes.bool,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]).isRequired,
  };

  static defaultProps = {
    expanded: false,
  };

  render() {
    return (
      <ExpansionPanelStyle expanded={this.props.expanded}>
        {this.props.children}
      </ExpansionPanelStyle>
    );
  }
}

export default ExpansionPanel;
