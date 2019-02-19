import styled from 'styled-components';

const CardText = styled.p`
  font-size: 14px;
  line-height: 16px;
  padding: 8px;
  color: ${props => props.theme.colors.font};

  &:last-child {
    padding-bottom: 24px;
  }
`;

export default CardText;
