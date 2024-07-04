import { MdTextFields } from 'react-icons/md';
import { BsSquareFill, BsCircleFill, BsImage } from 'react-icons/bs';
import PropTypes from 'prop-types';
import styles from './ModulesBar.module.scss';
import { useRef } from 'react';
import { itemDefaultProps } from '@/Utils';
import { SketchPicker } from 'react-color';

const ModulesBar = ({ getLinkedModule, addItemToSheet, colorPicker, updateItem, item }) => {
  const hoverPlaceholder = useRef();

  const displayHoverPlaceholder = (e, placeholder) => {
    hoverPlaceholder.current.style.opacity = '1';
    hoverPlaceholder.current.innerText = placeholder;
    hoverPlaceholder.current.style.transform =
      'translate(calc(100% + 10px), -50%)';

    const element = e.target.getBoundingClientRect();
    hoverPlaceholder.current.style.top = `calc(45px + ${element.y}px)`;
  };

  const hideHoverPlaceholder = () => {
    hoverPlaceholder.current.style.opacity = '0';
    hoverPlaceholder.current.style.transform =
      'translate(calc(100% + 30px), -50%)';
  };

  return (
    <div className={styles['module-bar']}>
      <div className={styles['item-list']}>
        <p ref={hoverPlaceholder} className={styles['hover-placeholder']}>
          placeholder
        </p>
        <div className={styles['items-wrapper']}>
          <div
            onMouseEnter={(e) => displayHoverPlaceholder(e, 'Carré')}
            onMouseLeave={hideHoverPlaceholder}
            onClick={() =>
              addItemToSheet({
                module: getLinkedModule('carre'),
                type: 'carre',
                ...itemDefaultProps,
              })
            }
          >
            <BsSquareFill size="2.5em" />
          </div>
          <div
            onMouseEnter={(e) => displayHoverPlaceholder(e, 'Cercle')}
            onMouseLeave={hideHoverPlaceholder}
            onClick={() =>
              addItemToSheet({
                module: getLinkedModule('cercle'),
                type: 'cercle',
                ...itemDefaultProps,
              })
            }
          >
            <BsCircleFill size="2.5em" />
          </div>
          <div
            onMouseEnter={(e) => displayHoverPlaceholder(e, 'Zone de texte')}
            onMouseLeave={hideHoverPlaceholder}
            onClick={() =>
              addItemToSheet({
                module: getLinkedModule('textzone'),
                type: 'textzone',
                content: 'Zone de texte',
                ...itemDefaultProps,
              })
            }
          >
            <MdTextFields size="2.5em" />
          </div>
          <div
            onMouseEnter={(e) => displayHoverPlaceholder(e, 'Image')}
            onMouseLeave={hideHoverPlaceholder}
            onClick={() =>
              addItemToSheet({
                module: getLinkedModule('image'),
                type: 'image',
                preserveratio: true,
                locksize: true,
                ...itemDefaultProps,
              })
            }
          >
            <BsImage size="2.5em" />
          </div>
        </div>
      </div>
      {colorPicker && (
        <div className={styles["color-picker"]}>
          <SketchPicker
            color={item[colorPicker.slug]}
            onChange={(color) => {
              const { id, slug } = colorPicker;
              let newItem = { id };
              const col = color.rgb;
              newItem[slug] = `rgba(${col.r}, ${col.g}, ${col.b}, ${col.a})`;
              updateItem(newItem);
            }}
          />
        </div>
      )}
    </div>
  );
};

ModulesBar.propTypes = {
  getLinkedModule: PropTypes.func.isRequired,
  addItemToSheet: PropTypes.func.isRequired,
  itemsSize: PropTypes.number.isRequired,
};

export default ModulesBar;
