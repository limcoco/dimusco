import React from 'react';

import FormInputControl from '../FormInputControl';

const PublisherBox = props => (
  <div className="create-publisher__publisher-box">
    <label>{props.words[`gen_${props.type}`] || `gen_${props.type}`}</label>
    <div className="box">
      <FormInputControl
        validationLabel={props.validationErrors[`${props.type}Name`]}
        name={`${props.type}Name`}
        value={props[`${props.type}Name`]}
        onChange={props.onChange}
        label='Name'
        placeHolder={props.words.gen_required_field}
        words={props.words}
      />
      <FormInputControl
        label={props.words['gen_email']}
        validationLabel={props.validationErrors[`${props.type}Email`]}
        name={`${props.type}Email`}
        value={props[`${props.type}Email`]}
        onChange={props.onChange}
        placeHolder={props.words.gen_required_field}
        type='email'
        words={props.words}
      />
    </div>
  </div>
);

export default PublisherBox;
