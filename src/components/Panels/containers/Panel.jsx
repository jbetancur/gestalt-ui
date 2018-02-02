import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme, css } from 'styled-components';
import DotActivity from 'components/DotActivity';
import Header from '../components/Header';
import Content from '../components/Content';

const PanelWrapper = styled.div`
  width: 100%;
  ${props => !props.error && !props.noShadow && 'box-shadow: 0 1px 1px 0 rgba(0,0,0,.1), 0 1px 1px 0 rgba(0,0,0,.1), 0 0 1px -4px rgba(0,0,0,.2)'};
  ${props => props.error && css`
  box-shadow: 0 1px 1px 0 rgba(0,0,0,.1), 0 1px 1px 0 rgba(0,0,0,.1), 0 0 1px -4px rgba(0,0,0,.2);
  box-shadow: 0 0px 3px 0 ${props.theme.colors['$md-red-500']},
  0 1px 3px 0 ${props.theme.colors['$md-red-500']},
  0 2px 3px -4px ${props.theme.colors['$md-red-500']};`};
`;

class Panel extends PureComponent {
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
    expandable: PropTypes.bool,
    count: PropTypes.number,
    error: PropTypes.bool,
    noShadow: PropTypes.bool,
  };

  static defaultProps = {
    defaultExpanded: true,
    noPadding: false,
    minHeight: false,
    children: null,
    pending: false,
    expandable: true,
    count: 0,
    error: false,
    noShadow: false,
  };

  state = { isExpanded: this.props.defaultExpanded };

  toggle = () => this.setState({ isExpanded: !this.state.isExpanded });

  render() {
    const { title, noPadding, minHeight, pending, children, expandable, count, error, noShadow } = this.props;

    return (
      <PanelWrapper error={error} noShadow={noShadow}>
        <Header
          title={title}
          onClick={expandable && this.toggle}
          expandable={expandable}
          expanded={this.state.isExpanded}
          count={count}
        />
        <Content
          isExpanded={this.state.isExpanded}
          noPadding={noPadding}
          minHeight={minHeight}
        >
          {pending ? <DotActivity centered size={2} /> : children}
        </Content>
      </PanelWrapper>
    );
  }
}

export default withTheme(Panel);
