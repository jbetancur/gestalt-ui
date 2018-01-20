import styled from 'styled-components';

const Form = styled.form`
  height: 100%;
  width: 100%;
  ${props => props.disabled && 'pointer-events: none'};
  ${props => props.disabled && 'opacity: 0.4'};
`;

export default Form;
