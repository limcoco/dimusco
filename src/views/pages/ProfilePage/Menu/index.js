import React, { Component } from 'react';

import MenuItem from './Item';

class Menu extends Component {
  constructor() {
    super();

    this.state = {};

    this.toggleSubMenu = this.toggleSubMenu.bind(this);
    this.getItemsSorted = this.getItemsSorted.bind(this);
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.activeTab !== '') {
      this.setState({
        drop: nextProps.activeTab === 9 || nextProps.activeTab === 10 || nextProps.activeTab === 11 || nextProps.activeTab === 4
      })
    }
  }

  componentDidMount () {
    this.setState({
      drop: this.props.pathname === '/profile/cc' ||
      this.props.pathname === '/profile/accounts' ||
      this.props.pathname === '/profile/transfers' ||
      this.props.pathname === '/profile/payment'
    })
  }

  toggleSubMenu() {
    this.setState({
      drop: !this.state.drop
    });
  }

  getItemsSorted() {
    const {
      words,
      institutionIsAuth,
      ensembleIsAuth,
      publisherIsAuth
    } = this.props;

    const arr = [
      {
        content: words['gen_overview'],
        tab: 0,
        url: '/profile/overview'
      },
      {
        content: words['gen_name'],
        tab: 1,
        url: '/profile/name'
      },
      {
        content: words['gen_pwd'] || '',
        tab: 2,
        isUser: true,
        isUserAuth: !institutionIsAuth && !ensembleIsAuth && !publisherIsAuth,
        url: '/profile/pwd'
      },
      {
        content: words['gen_addr'],
        tab: 3,
        url: '/profile/addr'
      },
      {
        institutionIsAuth,
        isInstitution: true,
        content: words['gen_contracts'] || 'gen_contracts',
        tab: 14,
        url: '/relations',
      },
      {
        publisherIsAuth,
        isPublisher: true,
        content: words['gen_contracts'] || 'gen_contracts',
        tab: 14,
        url: '/relations',
      },
      {
        content: words['gen_accounting'] || 'gen_accounting',
        tab: 4,
        isDrop: true,
        url: '/profile/payment',
        list: [
          {
            content: words.gen_transactions,
            tab: 4,
            url: '/profile/payment',
          },
          {
            content: words.gen_cc,
            tab: 9,
            url: '/profile/cc',
          },
          {
            content: words.gen_bank_accounts,
            tab: 10,
            url: '/profile/accounts',
          },
          
        ]
      },
      {
        content: words['gen_order_history'],
        tab: 5,
        url: '/profile/history',
      },
      {
        institutionIsAuth,
        isInstitution: true,
        content: words['profile_menu_man-pub'],
        tab: 13,
        url: '/profile/managePublishers',
      },
      {
        ensembleIsAuth,
        isEnsemble: true,
        content: words['profileensemble_delete_ensemble'],
        tab: 12,
        url: '/profile/deleteEnsemble',
      },
      {
        content: words['profile_cancel_title'],
        tab: 6,
        url: '/profile/cancel',
      }
    ];

    return arr;
  }

  render() {
    const {
      props: { toggleTab, activeTab, pathname, gotoRelations },
      state: { drop },
      toggleSubMenu,
      getItemsSorted
    } = this;
    
    return (
      <ul className="menu-list">
        {getItemsSorted().map(item => {
          let onClick = item.isDrop
            ? tab => {
                toggleSubMenu();
                toggleTab(tab);
              }
            : toggleTab;

          let shouldHide =
            (item.isEnsemble && !item.ensembleIsAuth) ||
            (item.isUser && !item.isUserAuth) ||
            (item.isInstitution && !item.institutionIsAuth) ||
            (item.isPublisher && !item.publisherIsAuth);

          return shouldHide ? null : (
            <React.Fragment>
              <MenuItem
                key={item.tab}
                activeTab={!item.isDrop && activeTab}
                pathname={pathname}
                onClick={onClick}
                tab={item.tab}
                icon={item.icon}
                url={item.url}
                gotoRelations={gotoRelations}
              >
                {item.content}
              </MenuItem>
              {item.isDrop && (
                <ul>
                  {drop &&
                    item.list.map(el => (
                      <MenuItem
                        key={el.tab}
                        activeTab={activeTab}
                        pathname={pathname}
                        tab={el.tab}
                        onClick={toggleTab}
                        url={el.url}
                      >
                        {el.content}
                      </MenuItem>
                    ))}
                </ul>
              )}
            </React.Fragment>
          );
        })}
      </ul>
    );
  }
}

export default Menu;
