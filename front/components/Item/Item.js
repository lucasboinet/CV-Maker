import React, { useEffect, useState } from 'react';
import { useDrag } from 'react-dnd';
import styles from './Item.module.scss';
import PropTypes from 'prop-types';
import ResizeOverlay from '@/components/ResizeOverlay/ResizeOverlay';

const Item = (props) => {
  const Module = props.module;
  const [hasFocus, setHasFocus] = useState(false);
  const [ratio, setRatio] = useState(null);
  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: 'image',
      item: props,
      collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
    }),
    [props]
  );

  const handleSelect = (e) => {
    e.stopPropagation();
    props.selectItem();
  };

  const handleUnselect = (e) => {
    e.stopPropagation();
    props.unselectItem();
  };

  const handleChange = (newprops) => {
    props.updateItem({ ...props, ...newprops });
  };

  useEffect(() => {
    const img = new Image();
    preview(img);
  }, [props]);

  useEffect(() => {
    setRatio(props.preserveratio ? props.width / props.height : null);
  }, [props.preserveratio, props.moduleParams.locksize]);

  return (
    <div
      className={`${styles.item} ${props.updating ? styles.updating : ''}`}
      style={{
        top: props.posY + 'px',
        left: props.posX + 'px',
        width: props.width,
        height: props.height,
        transform: `translate(-50%,-50%) rotate(${props.rotate}deg)`,
      }}
      onClick={(e) => (props.updating ? handleUnselect(e) : handleSelect(e))}
      onDoubleClick={() => setHasFocus(!hasFocus)}
    >
      <div className={styles['drag-overlay']} ref={drag}></div>
      {props.updating && (
        <ResizeOverlay
          width={props.width}
          height={props.height}
          posX={props.posX}
          posY={props.posY}
          rotate={props.rotate}
          locksize={props.moduleParams.locksize}
          preserveratio={props.preserveratio}
          ratio={ratio}
          onChange={handleChange}
        />
      )}
      <Module
        className={styles['item-content']}
        hasfocus={props.type === "textzone" && props.updating ? true : undefined}
        onChange={(newprops) => handleChange(newprops)}
        {...props.moduleParams}
      />
    </div>
  );  
};

Item.propTypes = {
  updateItem: PropTypes.func.isRequired,
  selectItem: PropTypes.func.isRequired,
  unselectItem: PropTypes.func.isRequired,
  updating: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  module: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  posX: PropTypes.number.isRequired,
  posY: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  rotate: PropTypes.number.isRequired,
  backgroundimage: PropTypes.object,
  params: PropTypes.object,
};

export default Item;
