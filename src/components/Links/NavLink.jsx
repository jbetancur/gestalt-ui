import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { NavLink as ReactLink } from 'react-router-dom';

const StyledNavLink = styled(({ staticContext, ...rest }) => <ReactLink {...rest} />)`
  &.active-link * {
    color: ${props => props.theme.colors['$md-blue-500']} !important;
  }
`;

export default class Link extends Component {
  static propTypes = {
    to: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
    ]).isRequired,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]).isRequired,
    target: PropTypes.string,
    activeClassName: PropTypes.string,
  };

  static defaultProps = {
    target: '_blank',
    activeClassName: 'active-link',
  };

  parseTo(to) {
    const parser = document.createElement('a');
    parser.href = to;
    return parser;
  }

  isInternal(to) {
    // If it's a relative url such as '/path', 'path' and does not contain a protocol we can assume it is internal.
    if (to.indexOf('://') === -1) return true;

    const toLocation = this.parseTo(to);
    return window.location.hostname === toLocation.hostname;
  }

  render() {
    const { to, target, children, activeClassName, ...rest } = this.props;
    const isInternal = this.isInternal(to);

    if (isInternal) {
      return (
        <StyledNavLink
          to={to}
          activeClassName={activeClassName}
          {...rest}
        >
          {children}
        </StyledNavLink>
      );
    }

    return (
      <a href={to} target={target} rel="noopener noreferrer" {...rest}>{children}</a>
    );
  }
}
