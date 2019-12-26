import React from 'react';

import FormInputControl from '../FormInputControl';

const AddressBox = props => (
  <div>
    <label>{props.words['gen_addr'] || 'gen_addr'}</label>
    <div className="box">
      <FormInputControl
        label={props.words['gen_addr1'] || 'gen_addr1'}
        validationLabel={props.validationErrors['userAddress1']}
        name="userAddress1"
        value={props.userAdddress1}
        onChange={props.onChange}
        placeHolder={props.words.gen_required_field}
        words={props.words}
      />
      <FormInputControl
        label={props.words['gen_addr2'] || 'gen_addr2'}
        validationLabel={props.validationErrors['userAddress2']}
        name="userAddress2"
        value={props.userAddress2}
        onChange={props.onChange}
        words={props.words}
      />
      <FormInputControl
        label={props.words['gen_addr3'] || 'gen_addr3'}
        validationLabel={props.validationErrors['userAddress3']}
        name="userAddress3"
        value={props.userAddress3}
        onChange={props.onChange}
        words={props.words}
      />
      <div className="row">
        <div className="col-xs-8">
          <FormInputControl
            label={props.words['gen_city'] || 'gen_city'}
            validationLabel={props.validationErrors['city']}
            name="city"
            value={props.city}
            onChange={props.onChange}
            placeHolder={props.words.gen_required_field}
            words={props.words}
          />
        </div>
        <div className="col-xs-4">
          <FormInputControl
            label={props.words['gen_zip'] || 'gen_zip'}
            validationLabel={props.validationErrors['zip']}
            name="zip"
            value={props.zip}
            onChange={props.onChange}
            placeHolder={props.words.gen_required_field}
            words={props.words}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-xs-6">
          <FormInputControl
            label={props.words['gen_country'] || 'gen_country'}
            validationLabel={props.validationErrors['country']}
            value={props.country}
            defaultValue={props.userCountry}
            onChange={props.handleDrop}
            type="dropdown"
            dropDownOptions={props.options}
        words={props.words}
        />
        </div>
        <div className="col-xs-6">
          <FormInputControl
            label={props.words['gen_county'] || 'gen_county'}
            validationLabel={props.validationErrors['state']}
            name="state"
            value={props.state}
            onChange={props.onChange}
        words={props.words}
        />
        </div>
      </div>
      <div className="row">
        <div className="col-xs-6">
          <FormInputControl
            label={props.words['gen_phone1']}
            validationLabel={props.validationErrors['userAddressPhone1']}
            name="userAddressPhone1"
            value={props.userAddressPhone1}
            onChange={props.onChange}
        words={props.words}
        />
        </div>
        <div className="col-xs-6">
          <FormInputControl
            label={props.words['gen_phone2']}
            validationLabel={props.validationErrors['userAddressPhone2']}
            name="userAddressPhone2"
            value={props.userAddressPhone2}
            onChange={props.onChange}
        words={props.words}
        />
        </div>
      </div>
    </div>
  </div>
);

export default AddressBox;
