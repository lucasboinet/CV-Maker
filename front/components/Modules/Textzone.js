import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { moduleDefaultProps } from '@/Utils';

const TextzoneComponent = ({ hasfocus, content, onChange, ...props }) => {
  const [value, setValue] = useState('');
  const textareaRef = useRef();

  useEffect(() => {
    setValue(content);
  }, [content]);

  useEffect(() => {
    if (hasfocus==true && textareaRef.current) textareaRef.current.focus();
  }, [hasfocus]);

  return (
    <textarea
      ref={textareaRef}
      type="text"
      className={props.className}
      value={value}
      onChange={(e) => onChange({ content: e.target.value })}
      {...props}
    ></textarea>
  );
};

const Textzone = styled(TextzoneComponent)`
  white-space: pre-wrap;
  background-color: ${(props) => props.backgroundcolor};
  width: ${(props) => (props.width ? props.width + 'px' : '100%')};
  color: ${(props) => props.textcolor};
  border: ${(props) => props.bordersize}px ${(props) => props.bordertype} ${(props) => props.bordercolor};
  height: 100%;
  resize: none;
  overflow: hidden;
  text-align: ${(props) => props.textalign};
  font-size: ${(props) => props.fontsize + 'px'};
  font-family: ${(props) => props.fontfamily};
  font-style: ${(props) => (props.fontstyle ? "italic":"normal")};
  font-weight: ${(props) => (props.fontweight ? "bold":"normal")};
`;

Textzone.defaultProps = {
  ...moduleDefaultProps,
  textcolor: 'black',
  backgroundcolor: 'transparent',
  textalign: 'left',
  fontSize: '1em',
  fontFamily: 'sans-serif',
};

export default Textzone;
