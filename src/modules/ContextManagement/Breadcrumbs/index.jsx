import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import FontIcon from 'react-md/lib/FontIcons';
import { truncate, getParentFQON } from 'util/helpers/strings';
import { Button } from 'components/Buttons';

const EnhancedLink = styled(Link)`
  color: inherit;

  &:link {
      text-decoration: none;
  }

  &:visited {
      text-decoration: none;
  }

  &:hover {
      text-decoration: none;
  }

  &:active {
      text-decoration: none;
  }
`;

const Icon = styled(FontIcon)`
  font-size: ${props => `${props.size}px`};
  line-height: 32px;
  padding: 1px;
`;

const IconSeperator = styled(FontIcon)`
  font-size: ${props => `${props.size}px`};
  line-height: 34px;
`;

const Wrapper = styled.div`
  display: inline;
  font-size: ${props => `${props.size}px`};
  color: ${props => props.theme.colors['$md-grey-500']};
  line-height: 32px;

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

  a:last-child {
    color: ${props => props.theme.colors['$md-grey-800']};

    i.seperator {
      color: ${props => props.theme.colors['$md-grey-500']};
    }
  }
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
    pending: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    pending: false,
    className: '',
    size: 16.5,
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
      <Wrapper className={className} size={size}>
        {!isGestaltHome &&
        <Button
          icon
          disabled={pending}
          component={Link}
          to={parentOrgRoute}
          tooltipLabel={`${parentFQON}`}
        >
          <Icon size={size}>arrow_upward</Icon>
        </Button>}

        {orgName &&
        <EnhancedLink
          onClick={e => this.checkIfShouldNav(e, orgsRoute)}
          to={orgsRoute}
        >
          <span><Icon size={size}>domain</Icon>{orgName}</span>
        </EnhancedLink>}

        {isWorkspaceCtx &&
          <EnhancedLink
            onClick={e => this.checkIfShouldNav(e, workspaceRoute)}
            to={workspaceRoute}
          >
            <IconSeperator className="seperator" size={size}>chevron_right</IconSeperator>
            <span><Icon size={size}>work</Icon>{workspaceName}</span>
          </EnhancedLink>}

        {isEnvironmentCtx &&
          <EnhancedLink
            onClick={e => this.checkIfShouldNav(e, environmentRoute)}
            to={environmentRoute}
          >
            <IconSeperator className="seperator" size={size}>chevron_right</IconSeperator>
            <span><Icon size={size}>folder</Icon>{environmentName}</span>
          </EnhancedLink>}
      </Wrapper>
    );
  }
}

function mapStateToProps(state) {
  return {
    self: state.metaResource.self.self,
    currentOrgContext: state.metaResource.currentOrgContext.organization,
    currentWorkspaceContext: state.metaResource.currentWorkspaceContext.workspace,
    currentEnvironmentContext: state.metaResource.currentEnvironmentContext.environment,
  };
}

export default connect(mapStateToProps)(withRouter(Breadcrumbs));
