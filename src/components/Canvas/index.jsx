import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './canvas.module.css';

export default function Canvas({
  values, setValues, width, height, pixelSize,
}) {
  const canvasRef = useRef();

  const [context, setContext] = useState();
  const [isMouseDown, setIsMouseDown] = useState(false);

  const getCoordOfMouse = (event) => {
    const { clientX, clientY } = event;
    const mouseX = clientX - canvasRef.current.offsetLeft;
    const mouseY = clientY - canvasRef.current.offsetTop;
    let coordX = Math.floor(mouseX / pixelSize, 10);
    let coordY = Math.floor(mouseY / pixelSize, 10);
    coordX = Math.max(0, Math.min(coordX, width - 1));
    coordY = Math.max(0, Math.min(coordY, height - 1));
    return { x: coordX, y: coordY };
  };

  const onMouseDown = () => {
    setIsMouseDown(true);
  };

  const onMouseUp = () => {
    setIsMouseDown(false);
  };

  const onMouseMove = (event) => {
    if (isMouseDown) {
      const { x, y } = getCoordOfMouse(event);
      setValues((prevValues) => {
        const newValues = [...prevValues];
        const index = y * width + x;
        newValues[index] = 1;
        return newValues;
      });
    }
  };

  useEffect(() => {
    setContext(canvasRef.current.getContext('2d'));
  }, [canvasRef]);

  useEffect(() => {
    if (!context) return;
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    context.fillStyle = 'black';
    for (let index = 0; index < values.length; index += 1) {
      if (values[index] > 0) {
        const x = index % width;
        const y = Math.floor(index / width);
        context.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
      }
    }
  }, [context, values]);

  useEffect(() => {
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  return (
    <canvas
      className={styles.canvas}
      ref={canvasRef}
      width={width * pixelSize}
      height={height * pixelSize}
      onMouseMove={onMouseMove}
    />
  );
}

Canvas.propTypes = {
  values: PropTypes.arrayOf(PropTypes.number).isRequired,
  setValues: PropTypes.func.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  pixelSize: PropTypes.number.isRequired,
};
