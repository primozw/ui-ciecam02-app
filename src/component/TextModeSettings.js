import React from 'react';
import TextField from 'material-ui/TextField';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Select from 'material-ui/Select';
import Input, { InputLabel } from 'material-ui/Input';
import IconButton from 'material-ui/IconButton';
import IconBold from 'material-ui-icons/FormatBold';
import IconItalic from 'material-ui-icons/FormatItalic';
import IconUnderlined from 'material-ui-icons/FormatUnderlined';




const FontVariantBtn = ({type, icon, options, clickHandle}) => {
  const styles = {
    color: (options[type]) ?  'rgba(0, 0, 0, 0.75)' : 'rgba(0, 0, 0, 0.5)'
  }
  return (
    <IconButton onClick={clickHandle(type)} style={styles} className="btn__icon" aria-label={type}>
      {icon}
    </IconButton>
  );
}


const TextModeSettings = ({options, onTextChange, onFontFamilyChange, fontList, onTextVariantChange}) => {

  const classes = {
    select: {
      root: 'settings__font-family__select'
    }
  }

  const fonts= fontList.map((el, i)=>{
    return (<option key={i} value={el.family}>{el.family}</option>)
  });




  return(
    <div>
      <TextField
        id="text"
        label="Text"
        className="settings__input"
        value={options.text}
        onChange={onTextChange('text')}
        margin="normal"
        multiline
        rows="2"
        fullWidth
      />
      
      <FormControl className="settings__font-family">
        <InputLabel htmlFor="font-family">Font Family</InputLabel>
        <Select
          classes={classes.select}
          native
          value={options.fontFamily}
          onChange={onFontFamilyChange}
          inputProps={{
            id: 'font-family',
          }}
        >
          {fonts}
        </Select>
      </FormControl>

      <div className="settings__font">
        <FormControl className="settings__font-size">
          <InputLabel htmlFor="font-size">Font Size</InputLabel>
          <Input type="number" id="font-size" value={options.fontSize} onChange={onTextChange('fontSize')} />
        </FormControl>
        
        <FormControl className="settings__font-variant">
          <p>Font property</p>
          <div>
            <FontVariantBtn clickHandle={onTextVariantChange} options={options} type='bold' icon={<IconBold />} />
            <FontVariantBtn clickHandle={onTextVariantChange} options={options} type='italic' icon={<IconItalic />} />
            <FontVariantBtn clickHandle={onTextVariantChange} options={options} type='underlined' icon={<IconUnderlined />} />
          </div>
        </FormControl>
      </div>


    </div>
  );
};

export default TextModeSettings;




