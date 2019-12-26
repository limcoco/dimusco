import React from 'react';

const CardOwner = ({handleInput, first_name, last_name, words}) => {
    return (
        <div className='form-group'>
            <label>{words.gen_cc_owner}</label>
            <div className='row'>
                <div className='col-xs-6'>
                    <input type='text' className='form-control' placeholder={words['gen_first-name']} name='first_name' onChange={handleInput} value={first_name} />
                </div>
                <div className='col-xs-6'>
                    <input type='text' className='form-control' placeholder={words['gen_last-name']} name='last_name' onChange={handleInput} value={last_name} />
                </div>
            </div>
        </div>
    )
}

export default CardOwner;