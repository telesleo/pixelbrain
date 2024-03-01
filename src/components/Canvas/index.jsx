import React from 'react';
import PropTypes from 'prop-types';
import styles from './canvas.module.css';

export default function Canvas({ width, height, pixelSize }) {
  return (
    <canvas className={styles.canvas} width={width * pixelSize} height={height * pixelSize} />
  );
}

Canvas.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  pixelSize: PropTypes.number.isRequired,
};
