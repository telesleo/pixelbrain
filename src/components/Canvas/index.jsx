import React from 'react';
import PropTypes from 'prop-types';

export default function Canvas({ width, height, pixelSize }) {
  return (
    <div>
      <canvas width={width * pixelSize} height={height * pixelSize} />
    </div>
  );
}

Canvas.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  pixelSize: PropTypes.number.isRequired,
};
