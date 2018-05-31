import styled, { css } from 'styled-components';

const ULStyled = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  ${props => props.maxHeight && css`
    max-height: ${props.maxHeight};
    overflow: scroll;
  `};
`;

export default ULStyled;
