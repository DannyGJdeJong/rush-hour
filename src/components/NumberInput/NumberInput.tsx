import React, { FunctionComponent, useState } from 'react';

type NumberInputProps = Exclude<React.InputHTMLAttributes<HTMLInputElement>, { type: string, onChange: React.ChangeEventHandler<HTMLInputElement> }> & {
  onChangeCallback: (value: number) => void
}

const NumberInput: FunctionComponent<NumberInputProps> = (props) => {
  const { defaultValue, value, min, max, onChangeCallback } = props;
  const [inputState, setInputState] = useState<number>(defaultValue ? Number(defaultValue) : Number(value));

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Get input value
    let value = Number(event.target.value);

    // Enforce constraints
    if (min) {
      value = Math.max(value, Number(min));
    }

    if (max) {
      value = Math.min(value, Number(max));
    }

    // Set state and call callback function
    setInputState(value);
    onChangeCallback(value);
  }

  return (
    <input { ... props } type="number" value={ inputState } onChange={ handleOnChange }/>
  );
};

export default NumberInput;
