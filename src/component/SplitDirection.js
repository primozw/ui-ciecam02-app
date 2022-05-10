import React from 'react';
import DirectionIcon from 'material-ui-icons/DragHandle';
import IconButton from 'material-ui/IconButton';

const SplitDirection = ({split, onClick}) => {
  const styles = {
    icon: {
      transition: 'all 0.3s',
      transform: (split) ? 'rotate(0deg)' : 'rotate(90deg)'
    }
  }
  return(

    <p className="split" style={styles} onClick={onClick}>
      <span>Split</span>
      <IconButton style={styles.icon} aria-label="Split"><DirectionIcon /></IconButton>
    </p>
  );
}

export default SplitDirection;




