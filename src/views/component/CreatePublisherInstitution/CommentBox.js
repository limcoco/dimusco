import React from 'react';

import FormInputControl from '../FormInputControl';

const ContactBox = props => (
  <div>
    <label>{props.words['gen_comment'] || 'gen_comment'}</label>
    <div className="box">
      <FormInputControl
        type="textarea"
        validationLabel={props.validationErrors['comment']}
        name="comment"
        value={props.comment}
        onChange={props.onChange}
        words={props.words}
      />
    </div>
  </div>
);

export default ContactBox;
