import styled, { withTheme } from 'styled-components';

const CardContent = styled.div`
  position: relative;
  font-size: 14px;
  overflow: scroll;
  ${props => (props.noPadding ? 'padding: 0' : 'padding: 16px')};
  ${props => (props.minHeight && `min-height: ${props.minHeight}`)};
  ${props => (props.maxHeight && `max-height: ${props.maxHeight}`)};

  &:last-child {
    padding-bottom: 24px;
  }
`;

export default withTheme(CardContent);
