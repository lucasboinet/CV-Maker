import React, { useRef } from 'react';
import { global, moduleParams } from '@/Utils';
import FileUpload from '@/components/FileUpload/FileUpload';
import styles from './ParamsBar.module.scss';
import { BsBack, BsFront } from 'react-icons/bs';

const ParamsBar = ({ item, updateItem, toggleColorPicker, toFore, toBack }) => {
  const parameters = { ...global, ...moduleParams[item.type] };
  const hoverPlaceholder = useRef();

  const displayHoverPlaceholder = (e, placeholder) => {
    hoverPlaceholder.current.style.opacity = '1';
    hoverPlaceholder.current.innerText = placeholder;
    hoverPlaceholder.current.style.transform =
      'translate(-50%, calc(100% + 10px))';

    const element = e.target.getBoundingClientRect();
    const tooltip = hoverPlaceholder.current.getBoundingClientRect();
    hoverPlaceholder.current.style.left = `${element.x - tooltip.width / 2}px`;
  };

  const hideHoverPlaceholder = () => {
    hoverPlaceholder.current.style.opacity = '0';
    hoverPlaceholder.current.style.transform =
      'translate(-50%, calc(100% + 30px))';
  };

  const getParamsInput = ({
    slug,
    type,
    name,
    values,
    defaultvalue,
    ...rest
  }) => {
    switch (type) {
      case 'string':
        return (
          <input
            type="text"
            value={item[slug]}
            onChange={(e) => {
              let newItem = { id: item.id };
              newItem[slug] = e.target.value;
              updateItem(newItem);
            }}
          />
        );
      case 'number':
        return (
          <input
            type="number"
            value={item[slug]}
            min={rest.min ?? null}
            max={rest.max ?? null}
            onChange={(e) => {
              let newItem = { id: item.id };
              newItem[slug] = parseInt(e.target.value);
              updateItem(newItem);
            }}
          />
        );
      case 'color':
        return (
          <button
            onClick={() =>
              toggleColorPicker({ id: item.id, slug })
            }
            className={styles['color-toggle']}
            style={{ backgroundColor: item[slug] ?? defaultvalue }}
          >
            &nbsp;
          </button>
        );
      case 'select':
        return (
          <select
            value={item[slug] ?? ''}
            onChange={(e) => {
              let newItem = { id: item.id };
              newItem[slug] = e.target.value;
              updateItem(newItem);
            }}
          >
            {values.map((value) => {
              return (
                <option key={value} value={value}>
                  {value}
                </option>
              );
            })}
          </select>
        );
      case 'image':
        return (
          <FileUpload
            mini
            value={item[slug]}
            onChange={(file) => {
              let newItem = { id: item.id };
              newItem[slug] = file;
              updateItem(newItem);
            }}
          />
        );
      case 'bool':
        return (
          <input
            type="checkbox"
            checked={item[slug] ?? defaultvalue}
            onChange={(e) => {
              let newItem = { id: item.id };
              newItem[slug] = e.target.checked;
              updateItem(newItem);
            }}
          />
        );
      default:
        break;
    }
  };

  const getCustomParam = (label, Icon, func) => {
    return (
      <div className={styles.param}>
        <button onClick={() => func(item)}>
          <Icon
            onMouseEnter={(e) => displayHoverPlaceholder(e, label)}
            onMouseLeave={hideHoverPlaceholder}
          />
        </button>
      </div>
    );
  };

  return (
    <div className={styles['params-bar']}>
      <p ref={hoverPlaceholder} className={styles['hover-placeholder']}>
        placeholder
      </p>
      {Object.keys(parameters).map((key, index) => {
        return parameters[key].parts.map((field) => {
          const Icon = field.name;
          return (
            <div className={styles.param} key={field.slug}>
              {index !== 0 && <div className={styles.separator}></div>}
              {typeof Icon !== 'string' && (
                <Icon
                  onMouseEnter={(e) => displayHoverPlaceholder(e, field.label)}
                  onMouseLeave={hideHoverPlaceholder}
                />
              )}
              {getParamsInput(field)}
            </div>
          );
        });
      })}
      <div className={styles.separator}></div>
      {getCustomParam('Avancer', BsFront, toFore)}
      {getCustomParam('Reculer', BsBack, toBack)}
    </div>
  );
};

export default ParamsBar;
