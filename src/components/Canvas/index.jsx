import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './canvas.module.css';

export default function Canvas({
  values, width, height, pixelSize, setValues,
}) {
  const canvasRef = useRef();

  const [context, setContext] = useState();
  const [mouse, setMouse] = useState(0);
  const [prevMouseCoord, setPrevMouseCoord] = useState();

  const getCoordOfMouse = (event) => {
    const { clientX, clientY } = event;
    const mouseX = clientX - canvasRef.current.offsetLeft;
    const mouseY = clientY - canvasRef.current.offsetTop;
    const coordX = Math.floor(mouseX / pixelSize, 10);
    const coordY = Math.floor(mouseY / pixelSize, 10);
    return { x: coordX, y: coordY };
  };

  const getLinePixelCoords = (startX, startY, endX, endY) => {
    let x = startX;
    let y = startY;
    const indices = [];
    const deltaX = Math.abs(endX - x);
    const deltaY = Math.abs(endY - y);
    const stepX = x < endX ? 1 : -1;
    const stepY = y < endY ? 1 : -1;
    let error = deltaX - deltaY;
    while (x !== endX || y !== endY) {
      indices.push({ x, y });
      const doubleError = 2 * error;
      if (doubleError > -deltaY) {
        error -= deltaY;
        x += stepX;
      }
      if (doubleError < deltaX) {
        error += deltaX;
        y += stepY;
      }
    }
    indices.push({ x: endX, y: endY });
    return indices;
  };

  const isCoordWithinBounds = (x, y) => x >= 0 && x < width && y >= 0 && y < height;

  const clearValues = () => {
    setValues(new Array(width * height).fill(0));
  };

  const updateValues = (x, y, value) => {
    setValues((prevValues) => {
      const newValues = [...prevValues];
      const pixelCoords = getLinePixelCoords(prevMouseCoord.x, prevMouseCoord.y, x, y)
        .filter((coord) => isCoordWithinBounds(coord.x, coord.y));
      const indices = pixelCoords.map((coord) => coord.y * width + coord.x);
      return newValues.map((newValue, index) => {
        if (indices.includes(index)) {
          return (value === 1) ? 1 : 0;
        }
        return newValue;
      });
    });
  };

  const updateCanvas = () => {
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
  };

  const onMouseDown = (event) => {
    setMouse(event.buttons);
  };

  const onMouseUp = (event) => {
    setMouse(event.buttons);
  };

  const onMouseMove = (event) => {
    const { x, y } = getCoordOfMouse(event);
    if (mouse > 0) {
      updateValues(x, y, mouse);
    }
    setPrevMouseCoord({ x, y });
  };

  const onContextMenu = (event) => {
    if (setValues) {
      event.preventDefault();
    }
  };

  useEffect(() => {
    setContext(canvasRef.current.getContext('2d'));
  }, [canvasRef]);

  useEffect(() => {
    updateCanvas();
  }, [context, values]);

  useEffect(() => {
    if (setValues) {
      window.addEventListener('mousedown', onMouseDown);
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('mousemove', onMouseMove);
    }
    return () => {
      if (setValues) {
        window.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mouseup', onMouseUp);
        window.removeEventListener('mousemove', onMouseMove);
      }
    };
  }, [setValues, mouse, prevMouseCoord]);

  return (
    <div>
      <canvas
        className={styles.canvas}
        ref={canvasRef}
        width={width * pixelSize}
        height={height * pixelSize}
        onContextMenu={onContextMenu}
      />
      {
        (setValues) && (
          <button className={styles['clear-button']} type="button" onClick={clearValues}>Clear</button>
        )
      }
    </div>
  );
}

Canvas.propTypes = {
  values: PropTypes.arrayOf(PropTypes.number).isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  pixelSize: PropTypes.number.isRequired,
  setValues: PropTypes.func,
};

Canvas.defaultProps = {
  setValues: null,
};
