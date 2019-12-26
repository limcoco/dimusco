import React from 'react';

import FormInputControl from '../FormInputControl';

const ContactBox = props => (
  <div>
    <label>{props.words['gen_contact']}</label>
    <div className="box">
      <div className="row">
        <div className="col-xs-5">
          <FormInputControl
            label={props.words['gen_first-name']}
            validationLabel={props.validationErrors['firstName']}
            name="firstName"
            value={props.firstName}
            onChange={props.onChange}
            placeHolder={props.words.gen_required_field}
            words={props.words}
          />
        </div>
        <div className="col-xs-7">
          <FormInputControl
            label={props.words['gen_last-name']}
            validationLabel={props.validationErrors['lastName']}
            name="lastName"
            value={props.lastName}
            onChange={props.onChange}
            placeHolder={props.words.gen_required_field}
            words={props.words}
          />
        </div>
      </div>
      <FormInputControl
        label={props.words['gen_email'] || 'gen_email'}
        validationLabel={props.validationErrors['contactEmail']}
        name="contactEmail"
        value={props.contactEmail}
        onChange={props.onChange}
        placeHolder={props.words.gen_required_field}
        type='email'
        words={props.words}
      />
      <div className="row">
        <div className="col-xs-6">
          <FormInputControl
            label={props.words['gen_phone1']}
            validationLabel={props.validationErrors['contactPhone1']}
            name="contactPhone1"
            value={props.contactPhone1}
            onChange={props.onChange}
            words={props.words}
          />
        </div>
        <div className="col-xs-6">
          <FormInputControl
            label={props.words['gen_phone2']}
            validationLabel={props.validationErrors['contactPhone2']}
            name="contactPhone2"
            value={props.contactPhone2}
            onChange={props.onChange}
            words={props.words}
          />
        </div>
      </div>
    </div>
  </div>
);

export default ContactBox;
