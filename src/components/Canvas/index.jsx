import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './canvas.module.css';

export default function Canvas({
  values, width, height, pixelSize,
}) {
  const canvasRef = useRef();

  const [context, setContext] = useState();

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

  return (
    <canvas
      className={styles.canvas}
      ref={canvasRef}
      width={width * pixelSize}
      height={height * pixelSize}
    />
  );
}

Canvas.propTypes = {
  values: PropTypes.arrayOf(PropTypes.number).isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  pixelSize: PropTypes.number.isRequired,
};
