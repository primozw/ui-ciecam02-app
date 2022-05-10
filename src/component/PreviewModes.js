import React from 'react';
import Radio, { RadioGroup } from 'material-ui/Radio';
import { FormLabel, FormControl, FormControlLabel, FormHelperText, FormGroup } from 'material-ui/Form';

import TextModeSettings from './TextModeSettings';
import IconModeSettings from './IconModeSettings';

const PreviewModes = ({mode, setMode, options, onFontFamilyChange, onTextChange, fontList, onTextVariantChange, onChangeIcon}) => {

  const classes = {
      modeControlForm: {
        root: 'settings__switch-mode'
      },
      radio: {
        root: 'btn--radio',
        label: 'btn--radio__label'
      }
    }



  const renderSettings = function(){
    if (mode === 'text'){
      return (
       <TextModeSettings options={options.textMode} onFontFamilyChange={onFontFamilyChange} onTextChange={onTextChange} fontList={fontList} onTextVariantChange={onTextVariantChange}/>
      );
    } else if (mode === 'icons'){
      return (
        <IconModeSettings options={options.iconMode} onIconSizeChange={(event)=>onChangeIcon('iconSize', event.target.value)} onIconChange={event => onChangeIcon('icon', event.currentTarget.dataset.icon)}/>
      )
    }
  }

  return(
    <div className="preview-mode">
      <FormControl component="fieldset" classes={classes.modeControlForm}>
        <RadioGroup
          aria-label="Preview Mode"
          name="preview-mode"
          className='settings__switch-mode__btns'
          value={mode}
          onChange={(event)=>setMode(event)}
        >
          <FormControlLabel classes={classes.radio} value="text" control={<Radio />} label="Text" />
          <FormControlLabel classes={classes.radio} value="icons" control={<Radio />} label="Icons" />
          <FormControlLabel classes={classes.radio} value="gui" control={<Radio />} label="GUI Elements" />
        </RadioGroup>
      </FormControl>
                  
      {renderSettings()}
    </div>
  );
}


export default PreviewModes;
