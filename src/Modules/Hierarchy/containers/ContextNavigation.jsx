import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { Col, Row } from 'react-flexybox';
import styled, { withTheme } from 'styled-components';
import { Button } from 'components/Buttons';
import ExpansionPanel from 'components/ExpansionPanel';
import { ActionsMenu } from 'Modules/Actions';
import NavHeader from '../components/NavHeader';

const DetailsPanel = styled.div`
  padding: 16px;
`;

const Name = styled.div`
  display: inline-block;
  max-width: 250px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
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

    span:last-child,
    div:last-child {
      padding-left: 6px;
    }

    i {
      font-size: 18px;
    }
  }
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

  constructor() {
    super();

    this.state = {
      expanded: false,
    };
  }

  toggle = () => {
    this.setState(prevState => ({ expanded: !prevState.expanded }));
  }

  render() {
    const { match, breadcrumbComponent, actionsComponent, detailsComponent, pending, pendingContextActions, actionsList, model } = this.props;

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
                iconChildren={this.state.expanded ? 'expand_less' : 'expand_more'}
                onClick={this.toggle}
                tooltipLabel={`${this.state.expanded ? 'Less' : 'More'} Details`}
              >
                <Name>{model.description || model.name}</Name>
              </Button>}

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
  withRouter,
)(ContextNavigation);
