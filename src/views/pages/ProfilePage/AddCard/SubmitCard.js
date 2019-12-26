import React from 'react';
import { Link } from 'react-router-dom';

const SubmitCard = ({ validate, words }) => {
    return (
        <div className='btns-wrp'>
            <Link className='btn black' to='/profile/cc'>«{words.gen_back}</Link>
            <button className='btn black' type='submit' disabled={validate}>{words.gen_add}</button>
        </div>
    )
}

export default SubmitCard;




