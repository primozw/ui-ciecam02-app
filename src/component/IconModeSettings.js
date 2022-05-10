import React from 'react';
import TextField from 'material-ui/TextField';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Select from 'material-ui/Select';
import Input, { InputLabel } from 'material-ui/Input';
import IconButton from 'material-ui/IconButton';
import IconBold from 'material-ui-icons/FormatBold';
import IconItalic from 'material-ui-icons/FormatItalic';
import IconUnderlined from 'material-ui-icons/FormatUnderlined';

const googleIcons = require('./googleIcons.js');

const IconModeSettings = ({options, onIconChange, onIconSizeChange}) => {


  const iconList = googleIcons.icons.map(function(elem, index) {
    if (index <= 100) {
      return (
        <IconButton key={index} data-icon={elem} onClick={onIconChange}>
          <i style={{
            color: (elem === options.icon) ? '#212121' : '#808080'
          }} className="material-icons">{elem}</i>
        </IconButton>
      );
    }
  });

  return(
    <div className="settings__icons">
      <FormControl className="settings__icons-size">
        <InputLabel htmlFor="font-size">Icon Size</InputLabel>
        <Input type="number" id="font-size" value={options.iconSize} onChange={onIconSizeChange} />
      </FormControl>

      <div className="settings__icons__list">
        {iconList}
      </div>
    </div>
  );
};

export default IconModeSettings;


