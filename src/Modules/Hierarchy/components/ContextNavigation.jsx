import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { IconButton } from 'components/Buttons';
import FavoriteIcon from '@material-ui/icons/StarBorderOutlined';
import ExpanderIcon from '@material-ui/icons/ExpandMore';
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
  background-color: white;
  border-bottom: 1px solid ${props => props.theme.colors.backgroundVariant};
  min-height: 56px;
  padding: 0 16px 0 6px;
  flex: 0;
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
  width: 96px;
  height: 16px;
  line-height: 12px;
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

const ExpansionPanel = styled.div`
  width: 100%;
  max-height: ${props => (props.isExpanded ? props.expandedHeight : 0)};
  overflow: hidden;
  transition: max-height 400ms ${props => (props.isExpanded ? 'ease-in-out' : 'cubic-bezier(0, 1, 0, 1)')};
`;

const Items = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  flex-grow: 1;
  flex-shrink: 0;
  min-height: 55px;
  align-items: center;
`;

const BreadCrumbSection = styled.div`
  display: flex;
  align-items: center;
`;

const ActionsSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
  min-width: 275px;
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
  }
`;

const CollapseIcon = styled(({ isExpanded, ...rest }) => <ExpanderIcon {...rest} />)`
  font-size: 15px !important;
  transition: transform 225ms ease;
  transform: ${props => (props.isExpanded ? 'rotate(-180deg)' : 'rotate(0)')};
`;

class ContextNavigation extends PureComponent {
  static propTypes = {
    hierarchyContext: PropTypes.object.isRequired,
    width: PropTypes.string,
    miniWidth: PropTypes.string,
    expandedHeight: PropTypes.string,
    expanded: PropTypes.bool,
    onChangeContext: PropTypes.func,
  };

  static defaultProps = {
    width: '200px',
    miniWidth: '64px',
    expandedHeight: '400px',
    expanded: false,
    onChangeContext: () => { },
  };

  componentDidUpdate(prevProps) {
    const { hierarchyContext, onChangeContext } = this.props;

    if ((prevProps.hierarchyContext.context.contextMeta.context !== hierarchyContext.context.contextMeta.context
      || prevProps.hierarchyContext.context.contextMeta.fqon !== hierarchyContext.context.contextMeta.fqon) && prevProps.expanded) {
      onChangeContext();
    }
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

  render() {
    const {
      expanded,
      hierarchyContext,
      expandedHeight,
    } = this.props;
    const { contextPending } = hierarchyContext;

    return (
      <NavHeader>
        <AppConsumer>
          {({ onLogout, onToggleMainNavigation, onToggleFavorites, enableExperimental }) => (
            <React.Fragment>
              <Items>
                <BreadCrumbSection>
                  <Breadcrumbs />
                </BreadCrumbSection>

                <ActionsSection>
                  <CreateMenu enableExperimental={enableExperimental} {...this.props} />
                  <IconButton onClick={onToggleFavorites}><FavoriteIcon fontSize="small" /></IconButton>
                  <AppToolbarInfoMenu />
                  <UserMenu onLogout={onLogout} />
                </ActionsSection>
              </Items>

              <ExpansionPanel isExpanded={expanded} expandedHeight={expandedHeight}>
                {this.renderDetailsComponent()}
              </ExpansionPanel>

              <CollapseWrapper>
                <CollapseButton onClick={onToggleMainNavigation} disabled={contextPending}>
                  <CollapseIcon isExpanded={expanded} />
                </CollapseButton>
              </CollapseWrapper>
            </React.Fragment>
          )}
        </AppConsumer>
      </NavHeader>
    );
  }
}

export default withContext()(ContextNavigation);
