import styled from 'styled-components';
import Button from 'react-md/lib/Buttons/Button';

const EnhancedButton = styled(Button)`
  margin-left: .1em;
  margin-right: .1em;
  text-align: center;
  ${props => props.noShadow && 'box-shadow: none'};

  // fixes font when using React-Router-Link
  .md-icon-text {
    font-weight: normal;
  }
`;

export default EnhancedButton;
