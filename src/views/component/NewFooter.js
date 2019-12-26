import React from 'react';
import { Link } from 'react-router-dom';

const NewFooter = ({ActiveLanguageReducer}) => {
    const {words} = ActiveLanguageReducer;
    return (
        <footer className='new-footer'>
            <div className='container'>
                <div className='content'>
                    <ul className='nav-menu'>
                        <li><img src='/media/images/icon/Logo_svg.svg' width='20' height='20' /></li>
                        <li><Link to='/help'>{words.gen_help}</Link></li>
                        <li><Link to='/contact'>{words.gen_contact}</Link></li>
                        <li><Link to='/privacy'>{words.gen_privacy}</Link></li>
                        <li><Link to='/imprint'>{words.gen_imprint}</Link></li>
                        {/* <li><a href='#'>{words.gen_copyright}</a></li> */}
                    </ul>
                    <div className='copy-right'>© 2018 - {new Date().getFullYear()} dimusco</div>
                </div>
            </div>
        </footer>
    )
}

export default NewFooter;