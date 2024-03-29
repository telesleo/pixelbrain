import React, { useEffect, useState } from 'react';
import Canvas from '../../components/Canvas';
import styles from './dataset-creator.module.css';

const CANVAS_SIZE = 16;
const PIXEL_SIZE = 16;
const RECORD_CANVAS_PIXEL_SIZE = 6;

export default function DatasetCreator() {
  const [labels, setLabels] = useState([]);
  const [newLabel, setNewlabel] = useState('');
  const [data, setData] = useState([]);
  const [canvasValues, setCanvasValues] = useState(new Array(CANVAS_SIZE ** 2).fill(0));
  const [labelIndex, setLabelIndex] = useState(0);

  const addLabel = () => {
    if (!newLabel || labels.includes(newLabel)) {
      return;
    }
    setLabels((prevLabels) => [...prevLabels, newLabel.toString()]);
    setNewlabel('');
  };

  const removeLabel = (labelToRemove) => {
    if (!labels.includes(labelToRemove)) {
      return;
    }
    setLabels((prevLabels) => prevLabels.filter((label) => label !== labelToRemove));
  };

  const setRandomLabelIndex = () => {
    if (labels.length > 0) {
      const randomLabelIndex = Math.floor(Math.random() * labels.length);
      setLabelIndex(randomLabelIndex);
    } else {
      setLabelIndex(0);
    }
  };

  const clearCanvas = () => {
    setCanvasValues(new Array(CANVAS_SIZE ** 2).fill(0));
  };

  const addDrawing = () => {
    setData((prevData) => [...prevData, { values: canvasValues, label: labelIndex }]);
    clearCanvas();
    setRandomLabelIndex();
  };

  const onInputLabelKeyDown = (event) => {
    if (event.key === 'Enter') {
      addLabel();
    }
  };

  const loadDataset = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (onLoadEvent) => {
      const jsonData = JSON.parse(onLoadEvent.target.result);
      setLabels(jsonData.labels);
      setData(jsonData.data);
    };
    reader.readAsText(file);
  };

  const downloadDataset = () => {
    const jsonData = JSON.stringify({
      labels,
      'canvas-width': CANVAS_SIZE,
      'canvas-height': CANVAS_SIZE,
      data,
    });
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dataset.json';
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    setRandomLabelIndex();
  }, [labels]);

  return (
    <div>
      <section>
        <label htmlFor="load-dataset">
          {'Load dataset: '}
          <input id="load-dataset" type="file" onChange={loadDataset} />
        </label>
      </section>
      <section>
        <div id={styles['label-list']}>
          {
            labels.map((label) => (
              <div key={label}>
                <p>{label}</p>
                <button type="button" onClick={() => removeLabel(label)}>x</button>
              </div>
            ))
          }
        </div>
        <input
          placeholder="New label"
          value={newLabel}
          onChange={({ target }) => setNewlabel(target.value)}
          onKeyDown={onInputLabelKeyDown}
        />
      </section>
      {
        (labels.length > 0) && (
          <>
            <section>
              {
              labels.map((label, index) => (
                <label key={label} htmlFor={label}>
                  <input
                    id={label}
                    name="labels"
                    type="radio"
                    checked={labelIndex === index}
                    onChange={() => setLabelIndex(index)}
                  />
                  {label}
                </label>
              ))
            }
              <Canvas
                values={canvasValues}
                setValues={setCanvasValues}
                width={CANVAS_SIZE}
                height={CANVAS_SIZE}
                pixelSize={PIXEL_SIZE}
              />
              <button type="button" onClick={addDrawing}>Add drawing</button>
            </section>
            <section>
              <button type="button" onClick={downloadDataset}>Download dataset</button>
            </section>
          </>
        )
      }

      <section id={styles.records}>
        {
          data.map((record, index) => (
            <div key={index}>
              <Canvas
                values={record.values}
                width={CANVAS_SIZE}
                height={CANVAS_SIZE}
                pixelSize={RECORD_CANVAS_PIXEL_SIZE}
              />
              <p>{record.label}</p>
            </div>
          ))
        }
      </section>
    </div>
  );
}
