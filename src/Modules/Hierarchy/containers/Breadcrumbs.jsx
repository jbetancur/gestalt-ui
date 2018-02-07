import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import base64 from 'base-64';
import styled, { css } from 'styled-components';
import { Link, withRouter } from 'react-router-dom';
import { withMetaResource } from 'Modules/MetaResource';
import { FontIcon } from 'react-md';
import { truncate, getParentFQON } from 'util/helpers/strings';
import { Button } from 'components/Buttons';

const EnhancedLink = styled(Link)`
  color: inherit;
  text-decoration: none;

  &:hover {
    text-decoration: none;
    color: ${props => props.theme.colors['$md-grey-800']};
  }
`;

const Icon = styled(FontIcon)`
  font-size: ${props => `${props.size}px !important`};
  line-height: 33px;
  padding: 1px;
`;

const BreadIcon = Icon.extend`
  @media (min-width: 0) and (max-width: 659px) {
    display: none;
  }
`;

const IconSeparator = styled(({ size, ...rest }) => <FontIcon {...rest} />)`
  font-size: ${props => `${props.size}px`};
  line-height: 35px;
`;

const Wrapper = styled.div`
  display: inline;
  font-size: ${props => `${props.size}px`};
  color: ${props => props.theme.colors['$md-grey-500']};
  line-height: 32px;
  padding-left: 3px;

  @media (min-width: 0) and (max-width: 659px) {
    font-size: ${props => `${props.size - 2}px`};
  }

  span {
    line-height: 35px;
  }

  i {
    color: inherit;
  }

  a {
    margin: 0;
    height: 35px !important;
  }

  i.seperator {
    color: ${props => props.theme.colors['$md-grey-500']};
  }

  ${props => props.lastIsActive && css`
    a:last-child {
      color: ${props.theme.colors['$md-blue-500']};

      &:hover {
        color: ${props.theme.colors['$md-blue-400']};
      }
    }
  `};
`;

class Breadcrumbs extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    self: PropTypes.object.isRequired,
    organizationSet: PropTypes.object.isRequired,
    workspace: PropTypes.object.isRequired,
    environment: PropTypes.object.isRequired,
    className: PropTypes.string,
    size: PropTypes.number,
    lastIsActive: PropTypes.bool,
    pending: PropTypes.bool,
  };

  static defaultProps = {
    pending: false,
    className: '',
    size: 16,
    lastIsActive: false,
  }

  checkIfShouldNav(e, route) {
    const hashedPath = base64.encode(this.props.location.pathname);
    const hashedRoute = base64.encode(route);

    if (hashedPath === hashedRoute) {
      e.preventDefault();
    }
  }

  render() {
    const {
      self,
      organizationSet,
      workspace,
      environment,
      match,
      className,
      size,
      lastIsActive,
      pending,
    } = this.props;

    const parentFQON = getParentFQON(organizationSet);
    const parentOrgRoute = `/${parentFQON}/hierarchy`;
    const orgsRoute = `/${organizationSet.properties.fqon}/hierarchy`;
    const workspaceRoute = `/${organizationSet.properties.fqon}/hierarchy/${workspace.id}/environments`;
    const environmentRoute = `${match.url}`;
    const orgName = truncate(organizationSet.description || organizationSet.name, 30);
    const workspaceName = truncate(workspace.description || workspace.name, 30);
    const environmentName = truncate(environment.description || environment.name, 30);
    const isWorkspaceCtx = workspace.id && match.params.workspaceId;
    const isEnvironmentCtx = environment.id && match.params.environmentId;
    const isGestaltHome = match.params.fqon === self.properties.gestalt_home.properties.fqon;

    return (
      <Wrapper className={className} size={size} lastIsActive={lastIsActive}>
        {!isGestaltHome &&
        <Button
          icon
          iconChildren={<Icon size={size}>arrow_upward</Icon>}
          disabled={pending}
          component={Link}
          to={parentOrgRoute}
          tooltipLabel={parentFQON}
          tooltipPosition="right"
        />}

        {orgName &&
        <EnhancedLink
          onClick={e => this.checkIfShouldNav(e, orgsRoute)}
          to={orgsRoute}
        >
          <span><BreadIcon size={size}>domain</BreadIcon>{orgName}</span>
        </EnhancedLink>}

        {isWorkspaceCtx &&
          <EnhancedLink
            onClick={e => this.checkIfShouldNav(e, workspaceRoute)}
            to={workspaceRoute}
          >
            <IconSeparator className="seperator" size={size}>chevron_right</IconSeparator>
            <span><BreadIcon size={size}>work</BreadIcon>{workspaceName}</span>
          </EnhancedLink>}

        {isEnvironmentCtx &&
          <EnhancedLink
            onClick={e => this.checkIfShouldNav(e, environmentRoute)}
            to={environmentRoute}
          >
            <IconSeparator className="seperator" size={size}>chevron_right</IconSeparator>
            <span><BreadIcon size={size}>folder</BreadIcon>{environmentName}</span>
          </EnhancedLink>}
      </Wrapper>
    );
  }
}

export default compose(
  withMetaResource,
  withRouter,
)(Breadcrumbs);
