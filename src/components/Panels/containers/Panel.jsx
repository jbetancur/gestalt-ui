import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';
import { Title } from 'components/Typography';
import DotActivity from 'components/DotActivity';
import Header from '../components/Header';
import Content from '../components/Content';
import ExpanderIcon from '../components/ExpanderIcon';

const PanelWrapper = styled.div`
  width: 100%;
  box-shadow: 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12), 0 3px 1px -2px rgba(0,0,0,.2);
`;

class Panel extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
    defaultExpanded: PropTypes.bool,
    noPadding: PropTypes.bool,
    minHeight: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    pending: PropTypes.bool,
  };

  static defaultProps = {
    defaultExpanded: true,
    noPadding: false,
    minHeight: false,
    children: null,
    pending: false,
  };

  state = { isExpanded: this.props.defaultExpanded };

  toggle = () => this.setState({ isExpanded: !this.state.isExpanded });

  render() {
    return (
      <PanelWrapper>
        <Header onClick={this.toggle}>
          <ExpanderIcon isExpanded={this.state.isExpanded}>expand_more</ExpanderIcon>
          <Title>{this.props.title}</Title>
        </Header>
        <Content
          isExpanded={this.state.isExpanded}
          noPadding={this.props.noPadding}
          minHeight={this.props.minHeight}
        >
          {this.props.pending ? <DotActivity centered size={1} /> : this.props.children}
        </Content>
      </PanelWrapper>
    );
  }
}

export default withTheme(Panel);
