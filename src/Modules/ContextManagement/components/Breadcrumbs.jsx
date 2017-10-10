import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import FontIcon from 'react-md/lib/FontIcons';
import { truncate, getParentFQON } from 'util/helpers/strings';
import { Button } from 'components/Buttons';

const EnhancedLink = styled(Link)`
  color: inherit;
  text-decoration: none;

  &:hover {
    text-decoration: none;
    color: ${props => props.theme.colors['$md-blue-300']};
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

const IconSeparator = styled(FontIcon)`
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
      color: ${props.theme.colors['$md-grey-800']};

      &:hover {
        color: ${props.theme.colors['$md-blue-500']};
      }
    }
  `};
`;

class Breadcrumbs extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    self: PropTypes.object.isRequired,
    currentOrgContext: PropTypes.object.isRequired,
    currentWorkspaceContext: PropTypes.object.isRequired,
    currentEnvironmentContext: PropTypes.object.isRequired,
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
    // strip '/'to make compares reliable
    if ((this.props.location.pathname.split('/').join('') === route.split('/').join(''))) {
      e.preventDefault();
    }
  }

  render() {
    const {
      self,
      currentOrgContext,
      currentWorkspaceContext,
      currentEnvironmentContext,
      match,
      className,
      size,
      lastIsActive,
      pending,
    } = this.props;

    const parentFQON = getParentFQON(currentOrgContext);
    const parentOrgRoute = `/${parentFQON}/hierarchy`;
    const orgsRoute = `/${currentOrgContext.properties.fqon}/hierarchy`;
    const workspaceRoute = `/${currentOrgContext.properties.fqon}/hierarchy/${currentWorkspaceContext.id}`;
    const environmentRoute = `/${currentOrgContext.properties.fqon}/hierarchy/${currentWorkspaceContext.id}/environments/${currentEnvironmentContext.id}`;
    const orgName = truncate(currentOrgContext.description || currentOrgContext.name, 30);
    const workspaceName = truncate(currentWorkspaceContext.description || currentWorkspaceContext.name, 30);
    const environmentName = truncate(currentEnvironmentContext.description || currentEnvironmentContext.name, 30);
    const isWorkspaceCtx = currentWorkspaceContext.id && match.params.workspaceId;
    const isEnvironmentCtx = currentEnvironmentContext.id && match.params.environmentId;
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

function mapStateToProps(state) {
  const { contextManager } = state;

  return {
    self: state.metaResource.self.self,
    currentOrgContext: contextManager.currentOrgContext.organization,
    currentWorkspaceContext: contextManager.currentWorkspaceContext.workspace,
    currentEnvironmentContext: contextManager.currentEnvironmentContext.environment,
  };
}

export default connect(mapStateToProps)(withRouter(Breadcrumbs));
