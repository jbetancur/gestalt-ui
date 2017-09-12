import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-flexybox';
import styled, { withTheme } from 'styled-components';
import { Button } from 'components/Buttons';
import { ActionsMenu } from 'modules/Actions';

const ContextNavigationStyle = styled.div`
  background-color: ${props => props.theme.colors['$md-white']};
  border-bottom: 1px solid ${props => props.theme.colors['$md-grey-200']};
  padding: 8px;
  text-align: left;
  min-height: 48px;
  width: 100%;
  overflow: visible;

  .md-btn--icon {
    height: 32px;
    padding: 0;
    width: 32px;
  }
`;

const DetailsPanel = styled.div`
  padding: 16px;
`;

const ActionsPanel = styled.div`
  display: inline;
  text-align: right;
  overflow: visible;

  button, a {
    min-width: 44px;
    padding: 4px 8px;
    font-size: 10px;

    span:last-child {
      padding-left: 6px;
    }

    i {
      font-size: 18px;
    }
  }
`;

const ExpansionPanel = styled.div`
  width: 100%;
  max-height: ${props => (props.expanded ? '400px' : 0)};
  overflow: hidden;
  transition: max-height 400ms ${props => (props.expanded ? 'ease-in-out' : 'cubic-bezier(0, 1, 0, 1)')};
`;

class ContextNavigation extends PureComponent {
  static propTypes = {
    children: PropTypes.any,
    breadcrumbComponent: PropTypes.object.isRequired,
    // eslint-disable-next-line react/require-default-props
    actionsComponent: PropTypes.object,
    // eslint-disable-next-line react/require-default-props
    detailsComponent: PropTypes.object,
    pending: PropTypes.bool,
    pendingContextActions: PropTypes.bool,
    actionsList: PropTypes.array.isRequired,
    model: PropTypes.object,
  };

  static defaultProps = {
    children: [],
    pending: false,
    pendingContextActions: false,
    actions: [],
    model: {},
  };

  constructor() {
    super();

    this.state = {
      expanded: false,
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({ expanded: !this.state.expanded });
  }

  render() {
    const { breadcrumbComponent, actionsComponent, detailsComponent, pending, pendingContextActions, actionsList, model } = this.props;

    return (
      <ContextNavigationStyle>
        <Row alignItems="center">
          <Col xs={12} sm={12} md={6} lg={6}>
            {breadcrumbComponent}
          </Col>

          {actionsComponent &&
            <Col component={ActionsPanel} xs={12} sm={12} md={6} lg={6}>
              {detailsComponent &&
              <Button
                flat
                iconChildren={this.state.expanded ? 'expand_more' : 'expand_less'}
                onClick={this.toggle}
                tooltipLabel={`${this.state.expanded ? 'Less' : 'More'} Details`}
                disabled={pending}
              >
                Details
              </Button>}

              <ActionsMenu
                actionList={actionsList}
                pending={pendingContextActions}
                model={model}
              />

              {actionsComponent}
            </Col>}
          {actionsComponent &&
          <Col flex={12}>
            <ExpansionPanel expanded={this.state.expanded} footer={null}>
              <DetailsPanel>{detailsComponent}</DetailsPanel>
            </ExpansionPanel>
          </Col>}
        </Row>
        {this.props.children}
      </ContextNavigationStyle>
    );
  }
}


export default withTheme(ContextNavigation);