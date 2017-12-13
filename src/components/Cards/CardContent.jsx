import styled, { withTheme } from 'styled-components';

const CardContent = styled.div`
  position: relative;
  font-size: 14px;
  padding: 16px;

  &:last-child {
    padding-bottom: 24px;
  }
`;

export default withTheme(CardContent);
