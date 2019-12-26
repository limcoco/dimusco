import React from 'react';

import DropDown from '../DropDown';

import './styles.css';

const FormInputControl = props => {
  const {
    label,
    validationLabel,
    onChange,
    name,
    value,
    type,
    defaultValue,
    dropDownOptions,
    placeHolder,
    words
  } = props;

  let Content = null;
  switch (type) {
    case 'dropdown':
      Content = (
        <DropDown
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          options={dropDownOptions}
          className="form-control"
          label="Choose a country"
          search
        />
      );
      break;

    case 'textarea':
      Content = (
        <textarea
          rows="5"
          name={name}
          onChange={onChange}
          value={value}
          placeHolder={placeHolder}
          className={validationLabel? 'error form-control form__textarea' : 'form-control form__textarea'}
        />
      );
      break;

    default:
      Content = (
        <input
          type={type || 'text'}
          name={name}
          onChange={onChange}
          value={value}
          placeHolder={placeHolder}
          className={validationLabel? 'error form-control' : 'form-control'}
        />
      );
  }
  
  return (
    <div className="form-group">
      <label>{label}</label>
      {validationLabel !== words.gen_required_field && <span className="validation__message">{validationLabel}</span>}
      {Content}
    </div>
  );
};

export default FormInputControl;
