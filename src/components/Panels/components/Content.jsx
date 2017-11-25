import styled, { withTheme } from 'styled-components';

const Content = styled.div`
  background-color: ${props => props.theme.colors['$md-white']};
  border-bottom: 1px solid ${props => props.theme.colors['$md-grey-200']};
  width: 100%;
  display: ${props => (props.isExpanded ? 'block' : 'none')};
  ${props => (props.noPadding ? 'padding: 0' : 'padding: 1em')};
  ${props => (props.minHeight && `min-height: ${props.minHeight}`)};
`;

export default withTheme(Content);
