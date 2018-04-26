import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';

const TabsStyle = styled.div`
  display: flex;
  /* border-bottom: 1px solid ${props => props.theme.colors['$md-grey-300']}; */
  margin-left: 5px;
  margin-right: 5px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

class Tabs extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      activeTabIndex: this.props.defaultActiveTabIndex
    };
  }

  handleTabClick = (tabIndex) => {
    this.setState({
      activeTabIndex: tabIndex === this.state.activeTabIndex ? this.props.defaultActiveTabIndex : tabIndex
    });
  }

  // Encapsulate <Tabs/> component API as props for <Tab/> children
  renderChildrenWithTabsApiAsProps() {
    return React.Children.map(this.props.children, (child, index) => React.cloneElement(child, {
      onClick: this.handleTabClick,
      tabIndex: index,
      isActive: index === this.state.activeTabIndex
    }));
  }

  // Render current active tab content
  renderActiveTabContent() {
    const { children } = this.props;
    const { activeTabIndex } = this.state;

    if (children[activeTabIndex]) {
      return children[activeTabIndex].props.children;
    }

    return children.props.children;
  }

  render() {
    return (
      <React.Fragment>
        <TabsStyle>
          {this.renderChildrenWithTabsApiAsProps()}
        </TabsStyle>
        <Content>
          {this.renderActiveTabContent()}
        </Content>
      </React.Fragment>
    );
  }
}

Tabs.propTypes = {
  defaultActiveTabIndex: PropTypes.number,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
};

Tabs.defaultProps = {
  defaultActiveTabIndex: 0,
};

export default withTheme(Tabs);
