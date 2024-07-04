import styled from 'styled-components';
import { moduleDefaultProps } from '@/Utils';
import { BiImageAdd } from 'react-icons/bi';

const ImageComponent = ({ file, locksize, onChange, preserveratio, ...props }) => {
  const handleChangeDimension = (width, height) => {
    if (locksize) {
      if (width > 595 || height > 842) {
        const ratio = width / height;
        width = 595;
        height = 595 / ratio;
      }

      onChange({ width, height, locksize : false });
    }
  };
  return (
    <div {...props} className={props.className}>
      {file ? (
        <img
          onLoad={({target : {naturalWidth : width, naturalHeight : height}}) => handleChangeDimension(width, height)}
          src={file.constructor === File ? URL.createObjectURL(file) : file}
          width={props.width}
          height={props.height}
        />
      ) : (
        <BiImageAdd size={'50%'} />
      )}
    </div>
  );
};
const Image = styled(ImageComponent)`
  border: ${(props) => props.bordersize}px ${(props) => props.bordertype}
    ${(props) => props.bordercolor};
  width: ${(props) => (props.width ? props.width + 'px' : '100%')};
  height: ${(props) => (props.height ? props.height + 'px' : '100%')};

  svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

Image.defaultProps = {
  ...moduleDefaultProps,
  backgroundcolor: '#000',
};

export default Image;
