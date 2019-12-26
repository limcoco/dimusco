import React from 'react';
import PropTypes from "prop-types";
import { Link, withRouter } from 'react-router-dom';

const UserMenuList = (props) => {
    const { onLogout, words } = props;

    return (
        <span>
            <p>
                <Link className="link" to={'/upload'}>
                    {words.gen_upload}
                </Link>
            </p>
            <p>
                <Link className="link" to={'/library'}>
                    {words.gen_library}
                </Link>
            </p>
            <p>
                <Link className="link" to="/profile">
                    {words.gen_administration}
                </Link>
            </p>
            <p>
                <Link className="link" to="/invitation">
                    {words.gen_invitation}
                </Link>
            </p>
            <p onClick={() => onLogout()}>
                <Link className="link red-i" to="/home">
                    {words.gen_logout}
                </Link>
            </p>
        </span>
    );
}

UserMenuList.propTypes = {
  onLogout: PropTypes.func.isRequired,
  words: PropTypes.object.isRequired
}


export default withRouter(UserMenuList);