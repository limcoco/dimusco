import React from 'react';

const GroupsMembers = ({title, members, words, onAddMemberToGroup, openAddMemberToGroup, showBack}) => {
    return (
        <div className='col-md-6 col-xs-12'>
            <div className="hide show">
                <div className="gi-header">
                    <div className="gi-title">{title}</div>
                    {showBack &&
                        <a tabindex="0" role="button" onClick={openAddMemberToGroup}
                            className='arrow-button'
                        >
                            <img src="/media/images/back.png" width="30" height="30" />
                        </a>
                    }
                </div>
                <ul className="member-list">
                    {members.map((item) => {
                        return (
                            <div className="m-l" key={item.cid}>
                                <li className="member transition-all m-p-15" onDoubleClick={() => onAddMemberToGroup(item.cid)}>
                                    <div>
                                        <span>{item.last_name && `${item.last_name}, `} {item.first_name}</span><br/>
                                        <span style={{color:'rgba(0, 0, 0, 0.6)',fontSize:'13px'}}> {`${item.email && `${item.email},`} ${item.phone_1 && `${item.phone_1},`} ${item.phone_2 && `${item.phone_2},`} ${item.comment}`}</span>
                                    </div>
                                </li>
                            </div>
                        )
                    })}
                    
                </ul>
            </div>
        </div>
    )
}

export default GroupsMembers;
