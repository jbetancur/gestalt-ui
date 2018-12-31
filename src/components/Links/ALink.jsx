import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const StyledNavLink = styled(({ staticContext, primary, block, ...rest }) => <Link {...rest} />)`
  font-size: 13px;
  ${props => props.block && 'display: block'};
  ${props => props.primary && `color: ${props.theme.colors['$md-blue-600']}`};
`;

export default class ALink extends Component {
  static propTypes = {
    to: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
    ]).isRequired,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]).isRequired,
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
    const { to, children, ...rest } = this.props;
    const isInternal = this.isInternal(to);

    if (isInternal) {
      return (
        <StyledNavLink
          to={to}
          {...rest}
        >
          {children}
        </StyledNavLink>
      );
    }

    return (
      <a href={to} {...rest}>{children}</a>
    );
  }
}
