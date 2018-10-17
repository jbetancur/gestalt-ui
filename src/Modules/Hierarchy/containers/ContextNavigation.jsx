import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { Col, Row } from 'react-flexybox';
import styled, { withTheme } from 'styled-components';
import { FontIcon } from 'react-md';
import { ActionsMenu } from 'Modules/Actions';
import ExpansionPanel from 'components/ExpansionPanel';

const NavHeader = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background-color: ${props => props.theme.colors['$md-grey-50']};
  border-bottom: 1px solid ${props => props.theme.colors['$md-grey-200']};
  padding: 12px;
  text-align: left;
  min-height: 56px;
  overflow: visible;
  width: 100%;
  z-index: 4;
`;

const CollapseWrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: calc(50% - 36px);
  text-align: center;
`;

const CollapseButton = styled.button`
  position: relative;
  background-color: ${props => props.theme.colors['$md-grey-200']};
  border: none;
  padding: 0;
  width: 64px;
  height: 20px;
  text-align: center;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  outline: none;
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;

  &:hover:not([disabled]) {
    background-color: ${props => props.theme.colors['$md-grey-300']};
  }

  &:hover:disabled {
    cursor: unset;
  }
`;

const DetailsPanel = styled.div`
  padding: 16px;
`;

const ActionsPanel = styled.div`
  display: inline;
  text-align: right;
  overflow: visible;

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
    match: PropTypes.object.isRequired,
    children: PropTypes.any,
    breadcrumbComponent: PropTypes.object.isRequired,
    // eslint-disable-next-line react/require-default-props
    actionsComponent: PropTypes.object,
    // eslint-disable-next-line react/require-default-props
    detailsComponent: PropTypes.object,
    pending: PropTypes.bool,
    pendingContextActions: PropTypes.bool,
    actionsList: PropTypes.array,
    model: PropTypes.object,
  };

  static defaultProps = {
    children: [],
    pending: false,
    pendingContextActions: false,
    actionsList: [],
    model: {},
  };

  state = {
    expanded: false,
  };

  toggle = () => {
    this.setState(prevState => ({ expanded: !prevState.expanded }));
  }

  renderCollpaseButtonIcon() {
    const { expanded } = this.state;

    return <CollapseIcon isExpanded={expanded}>expand_more</CollapseIcon>;
  }

  render() {
    const { match, breadcrumbComponent, actionsComponent, detailsComponent, pendingContextActions, actionsList, model, pending } = this.props;
    const { expanded } = this.state;

    return (
      <NavHeader>
        <Row alignItems="center">
          <Col xs={12} sm={12} md={6} lg={6}>
            {breadcrumbComponent}
          </Col>

          {actionsComponent &&
            <Col component={ActionsPanel} xs={12} sm={12} md={6} lg={6}>
              <ActionsMenu
                actionList={actionsList}
                pending={pendingContextActions}
                model={model}
                fqon={match.params.fqon}
              />

              {actionsComponent}
            </Col>}
          {actionsComponent &&
          <Col flex={12}>
            <ExpansionPanel expanded={expanded}>
              <DetailsPanel>{detailsComponent}</DetailsPanel>
            </ExpansionPanel>
          </Col>}
        </Row>
        {this.props.children}
        <CollapseWrapper>
          <CollapseButton onClick={this.toggle} disabled={pending}>
            {this.renderCollpaseButtonIcon()}
          </CollapseButton>
        </CollapseWrapper>
      </NavHeader>
    );
  }
}

export default compose(
  withTheme,
  withRouter,
)(ContextNavigation);
