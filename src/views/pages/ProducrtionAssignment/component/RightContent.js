import React, {Fragment} from 'react';
import ListView from '../../../component/Listview/List.js';
import AssignedRow from '../../../component/Row/PurchasedAssignedRow.js';

const RightContent = ({
    groups,
    unregisteredGroups,
    activeScoreIndex,
    onAssign,
    onUnassign,
    words
}) => {
    const assignedGroupProps = {
        title: words.prod_assign_groups_yes,
        emptyMessage:
          activeScoreIndex === -1
            ? words.library_no_selected_score
            : words.library_no_group_found,
        height: 197
      };
  
      const unassignedGroupProps = {
        title: words.prod_assign_groups_no,
        emptyMessage:
          activeScoreIndex === -1
            ? words.library_no_selected_score
            : words.library_no_group_found,
        height: 197
      };


      
     const renderGroupsWithChildren = (data) => {
        return data.map((value, index) => {
          return (
            <Fragment>
              <AssignedRow
                key={index}
                index={index}
                data={{
                  data: value,
                  type: 'group',
                  id: value.group_id
                }}
                name={value.name}
                onClick={onUnassign}
              />
              <ul className='group-wrp'>
                {value.children && value.children.length > 0 && renderGroupsWithChildren(value.children)}
              </ul>
            </Fragment>
            )
        })
      }


      const renderUnregisteredGroupsWithChildren = (data) => {
        return data.map((value, index) => {
          return (
            <Fragment>
              <AssignedRow
                key={index}
                index={index}
                data={{
                  data: value,
                  type: 'group',
                  id: value.gid
                }}
                name={value.name}
                onClick={onAssign}
              />
              <ul className='group-wrp'>
                {value.children && value.children.length > 0 && renderUnregisteredGroupsWithChildren(value.children)}
              </ul>
            </Fragment>
            )
        })
      }

    return (
        <div className="col-md-5 col-sm-12 col-xs-12">
         <div className="animated fadeIn">
           <div className="row">
             <div className="col-md-12 col-sm-12 col-xs-12 border-left">
               <div className="row">
                 {/* ASSIGNED GROUPS */}
                 <ListView
                   className="col-md-12 col-sm-12 col-xs-12 no-margin no-padding"
                   {...assignedGroupProps}
                 >
                   {renderGroupsWithChildren(groups)}
                 </ListView>
                 {/* END ASSIGNED GROUPS */}
               </div>
             </div>
             <div className="col-md-12 col-sm-12 col-xs-12 border-left">
               <div className="row">
                {/* UNASSIGNED GROUP */}
                <ListView
                   className="col-md-12 col-sm-12 col-xs-12 no-margin no-padding"
                   {...unassignedGroupProps}
                 >
                   {renderUnregisteredGroupsWithChildren(unregisteredGroups)}
                 </ListView>
                 {/* END UNASSIGNED GROUP */}
               </div>
             </div>
           </div>
         </div>
       </div>
    );
}

export default RightContent;