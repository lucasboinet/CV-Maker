import styled from 'styled-components';
import { moduleDefaultProps } from '@/Utils';

const CarreComponent = (props) => <div {...props} className={props.className}></div>;
const Carre = styled(CarreComponent)`
  background-color: ${(props) => props.backgroundcolor};
  border: ${(props) => props.bordersize}px ${(props) => props.bordertype}
    ${(props) => props.bordercolor};
  width: ${(props) => (props.width ? props.width + 'px' : '100%')};
  height: ${(props) => (props.height ? props.height + 'px' : '100%')};
`;

Carre.defaultProps = {
  ...moduleDefaultProps,
  backgroundcolor: '#000',
};

export default Carre;
