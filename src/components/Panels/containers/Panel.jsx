import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme, css } from 'styled-components';
import { DotActivity } from 'components/ProgressIndicators';
import Header from '../components/Header';
import Content from '../components/Content';

const PanelWrapper = styled(({ fill, noShadow, error, expanded, ...rest }) => <div {...rest} />)`
  position: relative;
  width: 100%;
  ${props => props.fill && props.expanded && 'height: 100%'};
  background-color: ${props => props.theme.colors['$md-white']};
  ${props => !props.error && !props.noShadow && 'box-shadow: 0 1px 1px 0 rgba(0,0,0,.1), 0 1px 1px 0 rgba(0,0,0,.1), 0 0 1px -4px rgba(0,0,0,.2)'};
  ${props => props.error && css`
    box-shadow: 0 0 3px 0 ${props.theme.colors['$md-red-500']},
    0 1px 3px 0 ${props.theme.colors['$md-red-500']},
    0 2px 3px -4px ${props.theme.colors['$md-red-500']};
  `};
`;

class Panel extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
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
    icon: PropTypes.oneOfType([PropTypes.func, PropTypes.node, PropTypes.bool]),
    fill: PropTypes.bool,
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    title: null,
    defaultExpanded: true,
    noPadding: false,
    minHeight: false,
    children: null,
    pending: false,
    expandable: true,
    count: 0,
    error: false,
    noShadow: false,
    icon: false,
    fill: false,
    disabled: false,
  };

  state = { isExpanded: this.props.defaultExpanded };

  toggle = () => this.setState(prevState => ({ isExpanded: !prevState.isExpanded }));

  render() {
    const { title, noPadding, minHeight, pending, children, expandable, count, error, noShadow, icon, fill, disabled } = this.props;
    const { isExpanded } = this.state;

    return (
      <PanelWrapper error={error} noShadow={noShadow} fill={fill} expanded={isExpanded}>
        {!!title &&
        <Header
          title={title}
          onClick={expandable ? this.toggle : null}
          expandable={expandable}
          expanded={isExpanded}
          count={count}
          icon={icon}
          noShadow={noShadow}
        />}
        <Content
          isExpanded={isExpanded}
          noPadding={noPadding}
          minHeight={minHeight}
          disabled={disabled}
        >
          {pending ? <DotActivity centered size={2} /> : children}
        </Content>
      </PanelWrapper>
    );
  }
}

export default withTheme(Panel);
