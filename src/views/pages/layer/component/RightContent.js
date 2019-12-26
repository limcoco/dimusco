import React from "react";
import AssignedRow from '../../../component/Row/PurchasedAssignedRow.js'
import ListView from '../../../component/Listview/List.js'

const RightContent = ({
    onUnassign,
    onAssign,
    groups,
    unregisteredGroups,
    members,
    unregisteredMembers,
    activeScoreIndex,
    words,
    loading_proccess
}) => {

    const assignedGroupProps = {
        title: words.library_group_assigned,
        emptyMessage: (activeScoreIndex === -1 ? words.library_no_selected_score : words.library_no_group_found),
        height: 197,
      }
  
      const unassignedGroupProps = {
        title: words.library_group_not_assigned,
        emptyMessage: (activeScoreIndex === -1 ? words.library_no_selected_score : words.library_no_group_found),
        height: 197,
      }
  
      const assignedMasterProps = {
        title: words.layer_master_assigned,
        emptyMessage: (activeScoreIndex === -1 ? words.library_no_selected_score : "No Master Found"),
        height: 197,
      }
  
      const unassignedMasterProps = {
        title: words.layer_no_master_assigned,
        emptyMessage: (activeScoreIndex === -1 ? words.library_no_selected_score : "No Master Found"),
        height: 197,
      }
    return (
        <div className="col-md-6 col-sm-12 col-xs-12">
                <div className="animated fadeIn">
                  <div className="row">
                    <div className="col-md-6 col-sm-6 col-xs-12 border-left">
                      <div className="row">

                        {/* ASSIGNED GROUPS */}
                        <ListView className="col-md-12 col-sm-12 col-xs-12 no-margin no-padding" {...assignedGroupProps}>
                          {groups.map((value, index) => {
                            return (
                              <AssignedRow
                                key={index}
                                index={index}
                                data={{ data: value, type: "group", id: value.gid }}
                                name={value.name}
                                onClick={onUnassign}
                                loadingType={loading_proccess.type === "group_unassign"}
                                loadingIndex={loading_proccess.index}
                              />
                            )
                          })}
                        </ListView>
                        {/* END ASSIGNED GROUPS */}

                        {/* UNASSIGNED GROUP */}
                        <ListView className="col-md-12 col-sm-12 col-xs-12 no-margin no-padding" {...unassignedGroupProps}>
                          {unregisteredGroups.map((value, index) => {
                            return (
                              <AssignedRow
                                key={index}
                                index={index}
                                data={{ data: value, type: "group", id: value.gid }}
                                name={value.name}
                                onClick={onAssign}
                                loadingType={loading_proccess.type === "group_assign"}
                                loadingIndex={loading_proccess.index}
                              />
                            )
                          })}
                        </ListView>
                        {/* END UNASSIGNED GROUP */}

                      </div>
                    </div>
                    <div className="col-md-6 col-sm-6 col-xs-12 border-left">
                      <div className="row">

                        {/* ASSIGNED MEMBER */}
                        <ListView className="col-md-12 col-sm-12 col-xs-12 no-margin no-padding" {...assignedMasterProps}>
                          {members.map((value, index) => {
                            return (
                              <AssignedRow
                                key={index}
                                index={index}
                                data={{ data: value, type: "user", id: value.uid }}
                                name={value.name.trim() === "" ? value.email : value.name}
                                unregistered={value.name.trim() === ""}
                                onClick={onUnassign}
                                loadingType={loading_proccess.type === "member_unassign"}
                                loadingIndex={loading_proccess.index}
                              />
                            )
                          })}
                        </ListView>
                        {/* END ASSIGNED MEMBER */}

                        {/* UNASSIGNED MEMBER */}
                        <ListView className="col-md-12 col-sm-12 col-xs-12 no-margin no-padding" {...unassignedMasterProps}>
                          {unregisteredMembers.map((value, index) => {
                            return (
                              <AssignedRow
                                key={index}
                                index={index}
                                data={{ data: value, type: "user", id: value.uid }}
                                name={value.name.trim() === "" ? value.email : value.name}
                                unregistered={value.name.trim() === ""}
                                onClick={onAssign}
                                loadingType={loading_proccess.type === "member_assign"}
                                loadingIndex={loading_proccess.index}
                              />
                            )
                          })}
                        </ListView>
                        {/* END UNASSIGNED MEMBER */}

                      </div>
                    </div>
                  </div>
                </div>
              </div>
    )
}


export default RightContent;