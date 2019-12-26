import React from 'react';
import { Link, withRouter } from 'react-router-dom';

const getMenuList = words => [
  {
    content: words.gen_library,
    to: '/library'
  },
  {
    content: words['gen_contacts'],
    to: '/contacts'
  },
  {
    content: words.gen_invitation,
    to: '/invitation'
  },
  {
    content: words.gen_administration,
    to: '/profile'
  },
  {
    content: words.gen_upload,
    to: '/upload'
  }
];

const UserMenuList = props => {
  const { onLogout, words } = props;

  return (
    <span>
      {getMenuList(words).map((item, i) => (
        <p key={i}>
          <Link className="link" to={item.to}>
            {item.content}
          </Link>
        </p>
      ))}
      <p onClick={() => onLogout()}>
        <Link className="link red-i" to="/home">
          {words.gen_logout}
        </Link>
      </p>
    </span>
  );
};

export default withRouter(UserMenuList);
