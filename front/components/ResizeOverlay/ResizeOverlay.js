import React, { useEffect, useRef } from 'react';
import styles from './ResizeOverlay.module.scss';

const ResizeOverlay = ({ width, height, posX, posY, rotate, onChange, locksize, preserveratio, ratio }) => {
  const rotateRef = useRef();
  const topLeftRef = useRef();
  const topRightRef = useRef();
  const bottomRightRef = useRef();
  const bottomLeftRef = useRef();

  useEffect(() => {
    const handleResize = (event, left = false, top = false) => {
      const minWidth = 20;
      const minHeight = 20;

      const mousePressX = event.clientX;
      const mousePressY = event.clientY;

      const initW = width;
      const initH = height;

      const initRotate = rotate;
      const initRadians = (initRotate * Math.PI) / 180;
      const cosFraction = Math.cos(initRadians);
      const sinFraction = Math.sin(initRadians);

      const eventMoveHandler = (event) => {
        const wDiff = event.clientX - mousePressX;
        const hDiff = event.clientY - mousePressY;
        let rotatedWDiff = cosFraction * wDiff + sinFraction * hDiff;
        let rotatedHDiff = cosFraction * hDiff - sinFraction * wDiff;

        let newW = width,
          newH = height,
          newX = posX,
          newY = posY;

        if (left) {
          newW = initW - rotatedWDiff;
          if (newW < minWidth) {
            newW = minWidth;
            rotatedWDiff = initW - minWidth;
          }
        } else {
          newW = initW + rotatedWDiff;
          if (newW < minWidth) {
            newW = minWidth;
            rotatedWDiff = minWidth - initW;
          }
        }
        newX += 0.5 * rotatedWDiff * cosFraction;
        newY += 0.5 * rotatedWDiff * sinFraction;

        if (top) {
          newH = initH - rotatedHDiff;
          if (newH < minHeight) {
            newH = minHeight;
            rotatedHDiff = initH - minHeight;
          }
        } else {
          newH = initH + rotatedHDiff;
          if (newH < minHeight) {
            newH = minHeight;
            rotatedHDiff = minHeight - initH;
          }
        }

        if(preserveratio) newH = newW / ratio;

        newX -= 0.5 * rotatedHDiff * sinFraction;
        newY += 0.5 * rotatedHDiff * cosFraction;

        onChange({ width: newW, height: newH, posX: newX, posY: newY });
      };

      window.addEventListener('mousemove', eventMoveHandler, false);

      window.addEventListener('mousemove', eventMoveHandler, false);
      window.addEventListener(
        'mouseup',
        function eventEndHandler() {
          window.removeEventListener('mousemove', eventMoveHandler, false);
          window.removeEventListener('mouseup', eventEndHandler);
        },
        false
      );
    };

    if(!locksize) {
      topLeftRef.current.addEventListener('mousedown', (e) =>
        handleResize(e, true, true)
      );
      topRightRef.current.addEventListener('mousedown', (e) =>
        handleResize(e, false, true)
      );
      bottomRightRef.current.addEventListener('mousedown', (e) =>
        handleResize(e, false, false)
      );
      bottomLeftRef.current.addEventListener('mousedown', (e) =>
        handleResize(e, true, false)
      );
    }

    const handleRotate = (event) => {
      const arrow = document.querySelector('#box');
      const arrowRects = arrow.getBoundingClientRect();
      const arrowX = arrowRects.left + arrowRects.width / 2;
      const arrowY = arrowRects.top + arrowRects.height / 2;

      const eventMoveHandler = (event) => {
        const angle =
          Math.atan2(event.clientY - arrowY, event.clientX - arrowX) +
          Math.PI / 2;
        onChange({ rotate: Math.round((angle * 180) / Math.PI) });
      };

      window.addEventListener('mousemove', eventMoveHandler, false);

      window.addEventListener(
        'mouseup',
        () => {
          window.removeEventListener('mousemove', eventMoveHandler, false);
        },
        false
      );
    };

    rotateRef.current.addEventListener('mousedown', handleRotate, false);
  }, [width, height, posX, posY, rotate, onChange, locksize, preserveratio, ratio]);

  return (
    <div
      className={styles.resizers}
      style={{ width: width + 'px', height: height + 'px' }}
      id="box"
    >
      <div className={styles['rotate']} ref={rotateRef}></div>
      <div
        className={`${styles.resizer} ${styles['top-left']}`}
        ref={topLeftRef}
      ></div>
      <div
        className={`${styles.resizer} ${styles['top-right']}`}
        ref={topRightRef}
      ></div>
      <div
        className={`${styles.resizer} ${styles['bottom-right']}`}
        ref={bottomRightRef}
      ></div>
      <div
        className={`${styles.resizer} ${styles['bottom-left']}`}
        ref={bottomLeftRef}
      ></div>
      <div className={styles['rotate-link']}></div>
    </div>
  );
};

export default ResizeOverlay;
