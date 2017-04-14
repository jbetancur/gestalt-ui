import styled from 'styled-components';

const EnhancedP = styled.p`
  color: ${props => props.theme.fontColorLight}
  padding-bottom: 1em;
  line-height: 1.05;
  font-size: 12px;
`;

export default EnhancedP;
