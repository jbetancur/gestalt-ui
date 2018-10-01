import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
// import { Tooltipped } from 'react-md';
import { NavLink } from 'components/Links';
import styled, { withTheme } from 'styled-components';

// const tooltipStyles = {
//   color: 'white',
//   borderRadius: '3px',
//   opacity: 0.95,
//   height: '36px',
//   minWidth: '100px',
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
// };

const NavLinkStyle = styled(NavLink)`
  position: relative;
  display: flex;
  padding-right: 16px;
  text-decoration: none;
  color: inherit;
  height: 48px;
  width: 100%;
  cursor: pointer;
  user-select: none;

  &:hover {
    background-color: ${props => props.theme.colors['$md-grey-200']};
  }
`;

const Icon = styled.div`
  display: inline-block;
  line-height: 0;
  margin: 13px 20px;
`;

const Text = styled.div`
  color: ${props => props.theme.colors['$md-grey-900']};
  line-height: 1.5em;
  text-overflow: ellipsis;
  overflow: hidden;
  display: flex;
  align-items: center;
`;

class NavItem extends Component {
  static propTypes = {
    icon: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
    ]).isRequired,
    title: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
    ]).isRequired,
    open: PropTypes.bool.isRequired,
    isVisible: PropTypes.bool,
    history: PropTypes.object.isRequired,
    to: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
    ]).isRequired,
  };

  static defaultProps = {
    isVisible: true,
  };

  checkIfShouldNav = (e) => {
    const { history, to } = this.props;
    let route = to;

    if (typeof to === 'object') {
      route = to.pathname;
    }

    if (history.location.pathname === route) {
      e.preventDefault();
    }
  }

  render() {
    const { icon, title, isVisible, ...rest } = this.props;

    if (!isVisible) {
      return null;
    }

    // if (open) {
    //   return (
    //     <NavLinkStyle onClick={this.checkIfShouldNav} {...rest}>
    //       <Icon>{icon}</Icon>
    //       <Text>{title}</Text>
    //     </NavLinkStyle>
    //   );
    // }

    // return (
    //   <Tooltipped
    //     label={title}
    //     position="right"
    //     delay={500}
    //     setPosition
    //     tooltipStyle={tooltipStyles}
    //   >
    //     <NavLinkStyle onClick={this.checkIfShouldNav} {...rest}>
    //       <Icon>{icon}</Icon>
    //       <Text>{title}</Text>
    //     </NavLinkStyle>
    //   </Tooltipped>
    // );

    return (
      <NavLinkStyle onClick={this.checkIfShouldNav} {...rest}>
        <Icon>{icon}</Icon>
        <Text>{title}</Text>
      </NavLinkStyle>
    );
  }
}

export default compose(
  withTheme,
  withRouter,
)(NavItem);
