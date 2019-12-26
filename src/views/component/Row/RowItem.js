import React from 'react';


export const RowItem = ({children}) => (
  <div className={"col-content col-md-2 col-sm-2 col-xs-12"}>
    <div className="book-title">
      {children}
    </div>
  </div>
)