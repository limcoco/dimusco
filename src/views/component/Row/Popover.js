import React, { useState } from 'react';
import Popover from '@material-ui/core/Popover';

export default function SimplePopover({renderOptions}) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  }

  const handleClose = () => {
    setAnchorEl(null);
  }

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div className='dropdown-popover-wrapper'>

      {open
        ?
        <span
          className='close-circle-icon'
          onClick={handleClick}
          style={{
            width: '15px',
            height: '15px'
          }}
        />
        :
        <span style={{ fontSize: '25px' }} onClick={handleClick}>...</span>
      }
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        onClick={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        {renderOptions}
      </Popover>
    </div>
  );
}