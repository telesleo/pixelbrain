import React, { useState } from 'react';
import Canvas from './components/Canvas';

const CANVAS_SIZE = 16;
const PIXEL_SIZE = 10;

function App() {
  const [canvasValues] = useState(Array(CANVAS_SIZE ** 2).fill(0));

  return (
    <div className="App">
      <Canvas
        values={canvasValues}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        pixelSize={PIXEL_SIZE}
      />
    </div>
  );
}

export default App;
