import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-flexybox';
import styled from 'styled-components';
import { FontIcon } from 'react-md';
// import { Button } from 'components/Buttons';
import { media } from 'util/helpers/media';
import CreateMenu from './CreateMenu';
import Breadcrumbs from './Breadcrumbs';
import OrganizationDetails from './OrganizationDetails';
import WorkspaceDetails from './WorkspaceDetails';
import EnvironmentDetails from './EnvironmentDetails';
import withContext from '../hocs/withContext';
import UserMenu from './UserMenu';
import AppToolbarInfoMenu from './AppToolbarInfoMenu';
import { AppConsumer } from '../../../App/AppContext';

const NavHeader = styled.nav`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  background-color: white;
  border-bottom: 1px solid ${props => props.theme.colors.backgroundVariant};
  padding-top: 7.5px;
  padding-bottom: 7.5px;
  min-height: 56px;
  padding-left: 16px;
  padding-right: 16px;
  text-align: left;
  overflow: visible;
  z-index: 4;
  ${() => media.xs`
    padding-top: 20px;
    padding-bottom: 20px;
  `};
  ${() => media.sm`
    padding-top: 20px;
    padding-bottom: 20px;
  `};
  ${() => media.md`
    padding-top: 20px;
    padding-bottom: 20px;
  `};
`;

const CollapseWrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: calc(50% - 64px);
  text-align: center;
`;

const CollapseButton = styled.button`
  position: relative;
  background-color: ${props => props.theme.colors.background};
  border-top: 1px solid ${props => props.theme.colors.backgroundVariant};
  border-left: 1px solid ${props => props.theme.colors.backgroundVariant};
  border-right: 1px solid ${props => props.theme.colors.backgroundVariant};
  border-bottom: none;
  padding: 0;
  width: 128px;
  height: 20px;
  text-align: center;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  outline: none;
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;

  &:hover:not([disabled]) {
    background-color: ${props => props.theme.colors.backgroundVariant};
  }

  &:hover:disabled {
    cursor: unset;
  }
`;

const Section = styled.div`
  display: flex;
  align-items: center;
  height: 24px;
`;

const ExpansionPanel = styled(({ isExpanded, expandedHeight, ...rest }) => <div {...rest} />)`
  width: 100%;
  max-height: ${props => (props.isExpanded ? props.expandedHeight : 0)};
  overflow: hidden;
  transition: max-height 400ms ${props => (props.isExpanded ? 'ease-in-out' : 'cubic-bezier(0, 1, 0, 1)')};
`;

const ActionsPanel = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  overflow: visible;
  ${() => media.xs`
    justify-content: center;
  `};
  ${() => media.sm`
    justify-content: center;
  `};
  ${() => media.md`
    justify-content: center;
  `};

  button,
  a {
    margin-left: 3px;
    padding: 4px 8px;
    font-size: 11px;

    span:last-child,
    div:last-child {
      padding-left: 6px;
    }

    i {
      font-size: 18px;
    }
  }
`;

const CollapseIcon = styled(({ isExpanded, ...rest }) => <FontIcon {...rest} />)`
  transition: transform 225ms ease;
  transform: ${props => (props.isExpanded ? 'rotate(-180deg)' : 'rotate(0)')};
`;

class ContextNavigation extends PureComponent {
  static propTypes = {
    children: PropTypes.any,
    hierarchyContext: PropTypes.object.isRequired,
    width: PropTypes.string,
    miniWidth: PropTypes.string,
    expandedHeight: PropTypes.string,
  };

  static defaultProps = {
    children: [],
    width: '200px',
    miniWidth: '64px',
    expandedHeight: '400px',
  };

  state = {
    expanded: false,
  };

  componentDidUpdate(prevProps, prevState) {
    const { hierarchyContext } = this.props;

    if ((prevProps.hierarchyContext.context.contextMeta.context !== hierarchyContext.context.contextMeta.context
      || prevProps.hierarchyContext.context.contextMeta.fqon !== hierarchyContext.context.contextMeta.fqon)
      && prevState.expanded) {
      // it is safe to disabled linting here and call setState since we have have conditions above
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ expanded: false });
    }
  }

  toggle = () => {
    this.setState(prevState => ({ expanded: !prevState.expanded }));
  }

  renderDetailsComponent() {
    const { hierarchyContext } = this.props;
    const { context: { contextMeta } } = hierarchyContext;

    if (contextMeta.context === 'organization') {
      return <OrganizationDetails {...this.props} />;
    }

    if (contextMeta.context === 'workspace') {
      return <WorkspaceDetails {...this.props} />;
    }

    if (contextMeta.context === 'environment') {
      return <EnvironmentDetails {...this.props} />;
    }

    return null;
  }

  renderCollpaseButtonIcon() {
    const { expanded } = this.state;

    return <CollapseIcon isExpanded={expanded}>expand_more</CollapseIcon>;
  }

  render() {
    const {
      hierarchyContext,
      expandedHeight,
      children,
    } = this.props;
    const { contextPending } = hierarchyContext;
    const { expanded } = this.state;

    return (
      <NavHeader>
        <Row alignItems="center">
          <Col xs={12} sm={12} md={6} lg={6}>
            <Section>
              <Breadcrumbs />
            </Section>
          </Col>

          <Col xs={12} sm={12} md={12} lg={6}>
            <AppConsumer>
              {({ onLogout, onShowLicenseModal, enableExperimental }) => (
                <ActionsPanel>
                  <CreateMenu enableExperimental={enableExperimental} {...this.props} />
                  {/* <Button icon onClick={onToggleFavorites}>star</Button> */}
                  <UserMenu onLogout={onLogout} />
                  <AppToolbarInfoMenu onShowLicenseModal={onShowLicenseModal} />
                </ActionsPanel>
              )}
            </AppConsumer>
          </Col>

          <ExpansionPanel isExpanded={expanded} expandedHeight={expandedHeight}>
            {this.renderDetailsComponent()}
          </ExpansionPanel>
        </Row>

        {children}

        <CollapseWrapper>
          <CollapseButton onClick={this.toggle} disabled={contextPending}>
            {this.renderCollpaseButtonIcon()}
          </CollapseButton>
        </CollapseWrapper>
      </NavHeader>
    );
  }
}

export default withContext()(ContextNavigation);
