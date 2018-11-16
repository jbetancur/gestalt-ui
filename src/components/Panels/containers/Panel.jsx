import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Card } from 'components/Cards';
import styled, { withTheme, css } from 'styled-components';
import { DotActivity } from 'components/ProgressIndicators';
import Header from '../components/Header';
import Content from '../components/Content';

const PanelWrapper = styled(({ fill, error, expanded, noShadow, noBackground, ...rest }) => <Card noShadow={noShadow} {...rest} />)`
  position: relative;
  width: 100%;
  ${props => props.fill && props.expanded && 'height: 100%'};
  ${props => props.error && !props.expanded && css`
    box-shadow: 0 0 2px 2px ${props.theme.colors['$md-red-500']};
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
    maxHeight: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
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
    maxHeight: false,
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
    const { title, noPadding, minHeight, maxHeight, pending, children, expandable, count, error, noShadow, icon, fill, disabled } = this.props;
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
          maxHeight={maxHeight}
          disabled={disabled}
        >
          {pending ? <DotActivity centered size={2} /> : children}
        </Content>
      </PanelWrapper>
    );
  }
}

export default withTheme(Panel);
