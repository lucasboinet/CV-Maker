import styled from "styled-components";
import { moduleDefaultProps } from "@/Utils";

const CercleComponent = (props) => (
  <div {...props} className={props.className}></div>
)

const Cercle = styled(CercleComponent)`
    background-color : ${props => props.backgroundcolor};
    border: ${props => props.bordersize}px ${props => props.bordertype} ${props => props.bordercolor};
    width : ${((props) => props.width ? props.width+"px" : "100%")};
    height : ${((props) => props.height ? props.height+"px" : "100%")};
    border-radius : 50%;
`


Cercle.defaultProps = {
  ...moduleDefaultProps,
  backgroundcolor : "#000",
}

export default Cercle;