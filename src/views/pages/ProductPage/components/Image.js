import React from 'react';
import RememberedScores from './RememberedScores';

const Image = ({ icon, isLoading, togglePreviewMode, token, sid, isCopy }) => (
  <div className="col-md-4 col-xs-12">
    {isLoading ? null : (
      <img
        className="product-image"
        src={`${icon}?token=${token}`}
        alt={'Preview'}
        width="360"
        height="480"
        onClick={togglePreviewMode}
      />
    )}
    {!isCopy &&
      <RememberedScores sid={sid} />
    }
  </div>
);

export default Image;
