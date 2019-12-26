import React from 'react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';

const MenuItem = ({ activeTab, tab, onClick, children, url, pathname, gotoRelations }) => (  
  <li className={classnames({ active: activeTab !== '' ? activeTab === tab : pathname === url })} onClick={() => onClick(tab)}>
    <Link to={url} onClick={() => {
        if (tab === 14)
        gotoRelations();
    }}>
      {children}
    </Link>
  </li>
);

export default MenuItem;
