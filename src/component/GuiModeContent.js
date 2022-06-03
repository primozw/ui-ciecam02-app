import React from 'react';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';

const GuiModeContent = ({type, bg, options, colors}) => {
  const styles = {
    backgroundColor: colors[type],
    color: colors[bg],
    margin:'0 1rem'
  }

  return(
    <div className="gui-elements">
      <Button style={styles} className="gui-btn" variant="raised">Primary</Button>
      <Button style={styles} className="gui-btn" variant="fab" aria-label="add"><AddIcon /> </Button>
    </div>
  );
}

export default GuiModeContent;
