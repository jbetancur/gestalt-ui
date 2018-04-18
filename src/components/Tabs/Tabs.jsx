import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const UL = styled.ul`
  list-style: none;
  padding-left: 0;
  margin-bottom: 0;
  background-color: transparent;
  white-space: nowrap;
  overflow-x: auto;
`;

const Content = styled.div`
  display: block;
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
  }

  render() {
    return (
      <div>
        <UL>
          {this.renderChildrenWithTabsApiAsProps()}
        </UL>
        <Content>
          {this.renderActiveTabContent()}
        </Content>
      </div>
    );
  }
}

Tabs.propTypes = {
  defaultActiveTabIndex: PropTypes.number
};

Tabs.defaultProps = {
  defaultActiveTabIndex: 0
};

export default Tabs;
