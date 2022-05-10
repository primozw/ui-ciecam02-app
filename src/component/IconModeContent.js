import React from 'react';

const IconModeContent = ({type, options, colors}) => {
  const styles = {
    'textAlign': 'center',
    'fontSize': options.iconSize + 'px',
    'color': colors[type],
  }

  return(
    <p style={styles} className="material-icons">{options.icon}</p>
  );
}

export default IconModeContent;
