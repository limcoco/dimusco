import React, { Fragment } from 'react';
import PropTypes from "prop-types";
import { Link, withRouter } from 'react-router-dom';

const OrganizationMenuList = (props) => {
    const {
        words,
        isLoginAsInstitution,
        isLoginAsEnsemble,
        isLoginAsPublisher,
        onLogout } = props;
    let linkManage, linkLibrary;

    if (isLoginAsInstitution) {
        linkManage = '/institution';
        linkLibrary = '/assignment';
    } else if (isLoginAsEnsemble) {
        linkManage = '/ensemble';
        linkLibrary = '/assignment';
    } else if (isLoginAsPublisher) {
        linkManage = '/publisher';
        linkLibrary = '/pub-library';
    }

    return (
        <span>
            <p>
                <Link className="link" to={linkLibrary}>
                    {words.gen_library}
                </Link>
            </p>
            {
                isLoginAsInstitution && isLoginAsEnsemble &&
                <p>
                    <Link className="link" to="/layers">
                        {words.header_layers}
                    </Link>
                </p>
            }
            <p>
                <Link className="link" to={linkManage}>
                    {words.header_manage}
                </Link>
            </p>
            <p>
                <Link className="link" to="/upload">
                    {words.gen_upload}
                </Link>
            </p>
            {
                isLoginAsPublisher &&
                <Fragment>
                    <p>
                        <Link className="link" to="/pub-prices">
                            {words.header_set_price}
                        </Link>
                    </p>
                    {/* <p>
                        <Link className="link" to="/pub-discount">
                            {words.header_set_discount}
                        </Link>
                    </p> */}
                </Fragment>
            }
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
            {isLoginAsInstitution && 
                <p>
                    <Link className="link" to="/layers">
                        {words.general_layers}
                    </Link>
                </p>
            }
            <p onClick={() => onLogout()}>
                <Link className="link red-i" to="/home">
                    {words.gen_logout}
                </Link>
            </p>
        </span>
    );
}

OrganizationMenuList.propTypes = {
// TODO: add propTypes to rest props
  onLogout: PropTypes.func.isRequired,
  words: PropTypes.object.isRequired,
//   isLoginAsInstitution
//   isLoginAsEnsemble
//   isLoginAsPublisher
//   onLogout
}

export default withRouter(OrganizationMenuList);