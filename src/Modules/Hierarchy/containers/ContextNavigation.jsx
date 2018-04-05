import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Col, Row } from 'react-flexybox';
import styled, { withTheme } from 'styled-components';
import { Button } from 'components/Buttons';
import ExpansionPanel from 'components/ExpansionPanel';
import { NavHeader } from 'components/Navigation';
import { ActionsMenu } from 'Modules/Actions';

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
    font-size: 10px;

    span:last-child {
      padding-left: 6px;
    }

    i {
      font-size: 18px;
    }
  }
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
      <NavHeader>
        <Row alignItems="center">
          <Col xs={12} sm={12} md={6} lg={6}>
            {breadcrumbComponent}
          </Col>

          {actionsComponent &&
            <Col component={ActionsPanel} xs={12} sm={12} md={6} lg={6}>
              {detailsComponent && !pending &&
                <Button
                  flat
                  iconChildren={this.state.expanded ? 'expand_more' : 'expand_less'}
                  onClick={this.toggle}
                  tooltipLabel={`${this.state.expanded ? 'Less' : 'More'} Details`}
                >
                  {`${model.description || model.name} Details`}
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
            <ExpansionPanel expanded={this.state.expanded}>
              <DetailsPanel>{detailsComponent}</DetailsPanel>
            </ExpansionPanel>
          </Col>}
        </Row>
        {this.props.children}
      </NavHeader>
    );
  }
}

export default compose(
  withTheme,
)(ContextNavigation);
