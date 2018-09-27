import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const HeaderStyle = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  height: 56px;
  z-index: 19;
  background-image: radial-gradient(circle, ${props => props.theme.colors['$russian-black-50']} 0%, ${props => props.theme.colors['$russian-black-100']} 100%);
  color: white;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.1), 0 1px 1px 0 rgba(0, 0, 0, 0.1), 0 0 1px -4px rgba(0, 0, 0, 0.2);
`;

const LeftContent = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  height: 100%;

  button,
  i * {
    color: white;
  }

  #orgs-nav {
    height: 100%;
  }
`;

const Logo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 69px;
  height: 100%;
`;

const RightContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding-right: 16px;

  button,
  i * {
    color: white;
  }
`;

class Header extends Component {
  render() {
    const { logo, logoVisible, leftContent, rightContent } = this.props;

    return (
      <HeaderStyle>
        {logo && logoVisible &&
        <Logo>
          {logo}
        </Logo>}
        <LeftContent>
          {leftContent}
        </LeftContent>

        <RightContent>
          {rightContent}
        </RightContent>
      </HeaderStyle>
    );
  }
}

Header.propTypes = {
  leftContent: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  rightContent: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  logo: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  logoVisible: PropTypes.bool,
};

Header.defaultProps = {
  leftContent: null,
  rightContent: null,
  logo: null,
  logoVisible: true,
};

export default Header;
