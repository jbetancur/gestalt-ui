import styled, { withTheme } from 'styled-components';

const Card = styled.div`
  position: relative;
  background: white;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.1), 0 1px 1px 0 rgba(0, 0, 0, 0.1), 0 0 1px -4px rgba(0, 0, 0, 0.2);
`;

export default withTheme(Card);
