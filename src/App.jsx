import React from 'react';
import Canvas from './components/Canvas';

const CANVAS_SIZE = 16;
const PIXEL_SIZE = 10;

function App() {
  return (
    <div className="App">
      <Canvas width={CANVAS_SIZE} height={CANVAS_SIZE} pixelSize={PIXEL_SIZE} />
    </div>
  );
}

export default App;
