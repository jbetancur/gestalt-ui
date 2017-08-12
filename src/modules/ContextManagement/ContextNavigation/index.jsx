import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';
import { Button } from 'components/Buttons';

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
  font-size: 11px;

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
  };

  static defaultProps = {
    children: [],
    pending: false,
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
    const { breadcrumbComponent, actionsComponent, detailsComponent, pending } = this.props;

    return (
      <ContextNavigationStyle>
        <div className="flex-row start-center no-gutter">
          <div className="flex-7 flex-xs-12 flex-sm-12">
            {breadcrumbComponent}
          </div>

          {actionsComponent &&
            <ActionsPanel className="flex-5 flex-xs-12 flex-sm-12">
              {detailsComponent &&
              <Button
                flat
                label="Details"
                onClick={this.toggle}
                tooltipLabel={`${this.state.expanded ? 'Less' : 'More'} Details`}
                disabled={pending}
              >
                {this.state.expanded ? 'expand_more' : 'expand_less'}
              </Button>}
              {actionsComponent}
            </ActionsPanel>}

          {actionsComponent &&
          <div className="flex-12">
            <ExpansionPanel expanded={this.state.expanded}>
              <DetailsPanel>{detailsComponent}</DetailsPanel>
            </ExpansionPanel>
          </div>}
        </div>
        {this.props.children}
      </ContextNavigationStyle>
    );
  }
}


export default withTheme(ContextNavigation);
