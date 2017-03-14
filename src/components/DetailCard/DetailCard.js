import styled from 'styled-components';
import Card from 'react-md/lib/Cards/Card';

const DetailCard = styled(Card)`
  position: relative;
  box-shadow: ${props => props.theme.boxShadow}
`;

export default DetailCard;
