import React, { useState } from 'react';
import styles from './dataset-creator.module.css';

export default function DatasetCreator() {
  const [labels, setLabels] = useState([]);
  const [labelInput, setLabelInput] = useState('');

  const addLabel = () => {
    if (!labelInput || labels.includes(labelInput)) {
      return;
    }
    setLabels((prevLabels) => [...prevLabels, labelInput.toString()]);
    setLabelInput('');
  };

  const removeLabel = (labelToRemove) => {
    if (!labels.includes(labelToRemove)) {
      return;
    }
    setLabels((prevLabels) => prevLabels.filter((label) => label !== labelToRemove));
  };

  const onInputLabelKeyDown = (event) => {
    if (event.key === 'Enter') {
      addLabel();
    }
  };

  return (
    <div>
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
        value={labelInput}
        onChange={({ target }) => setLabelInput(target.value)}
        onKeyDown={onInputLabelKeyDown}
      />
    </div>
  );
}
