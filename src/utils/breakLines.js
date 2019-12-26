import React from 'react';

const makeLineBreaks = text => {
    const val = '\\n';
    const parsed = text.split(val);
    let withBreaks = []
    for (let i = 0; i < parsed.length; i++) {
      if (parsed[i].length) {
        withBreaks.push(parsed[i])
        withBreaks.push(<br />)
      } else {
        withBreaks.push(<br />)
      }
    }
    return withBreaks
}

export default makeLineBreaks;