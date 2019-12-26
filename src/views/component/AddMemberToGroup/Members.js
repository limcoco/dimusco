import React from 'react';

const GroupsMembers = ({title, members, words, onAddMemberToGroup, openAddMemberToGroup, showBack}) => {
    return (
        <div className='col-md-6 col-xs-12' style={{padding: '0 15px'}}>
            <div className="hide show">
                <div className="gi-header">
                    <div className="gi-title">{title}</div>
                    {showBack && <a className='arrow-button' tabindex="0" role="button" onClick={openAddMemberToGroup}><img src="/media/images/back.png" width="30" height="30" /></a>}
                </div>
                <div className="row center-xs">
                    <div className="col-xs-12">
                        <div className="box">
                            <ul className="member-list">
                                {members.map((item) => {
                                    return (
                                        <div className="m-l" key={item.uid}>
                                            <li className="member transition-all m-p-15" onDoubleClick={() => onAddMemberToGroup(item.uid)}>
                                                <div className="overlay-page-body-row">
                                                    <div className="body-list-inside">
                                                        <div className="body-list-inside-main">
                                                            <div className="body-list-inside-title"><span>{item.name || '-'}</span></div>
                                                            <div className="body-list-inside-meta">
                                                                {item.is_admin && <span className="meta-admin">{words.gen_admin }</span>}
                                                                {!item.name && <span className="meta-not-register">{words.gen_not_registered}</span>}
                                                            </div>
                                                        </div>
                                                        <div className="body-list-inside-secondary"><span>{item.email}</span></div>
                                                    </div>
                                                </div>
                                            </li>
                                        </div>
                                    )
                                })}
                                
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GroupsMembers;
