import React from 'react';
import Radio, { RadioGroup } from 'material-ui/Radio';
import { FormLabel, FormControl, FormControlLabel, FormHelperText, FormGroup } from 'material-ui/Form';
import Select from 'material-ui/Select';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';


import TextModeSettings from './TextModeSettings';
import IconModeSettings from './IconModeSettings';

const Settings = ({conditions, handleChange}) => {

  const classes = {
      radio: {
        root: 'btn--radio',
        label: 'btn--radio__label'
      },
      input: {
        root: 'btn--input'
      }
    }


  return(
    <div className="settings">
      <FormControl className={classes.input.root}>
          <InputLabel htmlFor="color-space">Color Space</InputLabel>
          <Select
            value={conditions.workspace}
            onChange={handleChange('workspace')}
            id='color-space'
          >
            <MenuItem value='sRGB'>sRGB</MenuItem>
            <MenuItem value='Adobe RGB'>Adobe RGB</MenuItem>
            <MenuItem value='DCI-P3'>DCI-P3</MenuItem>
          </Select>
        </FormControl>

        <FormControl className={classes.input.root}>
          <InputLabel htmlFor="surround-type">Surround Type</InputLabel>
          <Select
            value={conditions.surroundType}
            onChange={handleChange('surroundType')}
            id='surround-type'
          >
            <MenuItem value='dim'>Dim</MenuItem>
            <MenuItem value='average'>Average</MenuItem>
            <MenuItem value='dark'>Dark</MenuItem>
          </Select>
        </FormControl>

        <FormControl className={classes.input.root}>
          <InputLabel htmlFor="luminance">Luminance</InputLabel>
          <Input
            id="luminance"
            value={conditions.adaptingLuminance}
            onChange={handleChange('adaptingLuminance')}
            inputProps={{
              'aria-label': 'Luminance',
            }}
            inputProps={{
              type:"number",
              min:0,
            }}
            endAdornment={<InputAdornment position="end">cd/m<sup>2</sup></InputAdornment>}
          />
        </FormControl>

        <FormControl className={classes.input.root}>
          <InputLabel htmlFor="luminance">p (Hue, Chrome)</InputLabel>
          <Input
            id="pHue"
            value={conditions.pHue}
            onChange={handleChange('pHue')}
            inputProps={{
              'aria-label': 'p Hue',
            }}
            inputProps={{
              type:"number",
              max:0,
              min:-1,
              step:0.1,
            }}
            
          />
        </FormControl>
        <FormControl className={classes.input.root}>
          <InputLabel htmlFor="luminance">p (Lightness)</InputLabel>
          <Input
            id="pLightness"
            value={conditions.pLightness}
            onChange={handleChange('pLightness')}
            inputProps={{
              'aria-label': 'p Lightness',
            }}
            inputProps={{
              type:"number",
              max:0,
              min:-1,
              step:0.1,
            }}
          />
        </FormControl>

        <FormControl className={classes.input.root}>
          <InputLabel htmlFor="color-space">Background</InputLabel>
          <Select
            value={conditions.background}
            onChange={handleChange('background')}
            id='background'
          >
            <MenuItem value='init'>Inital</MenuItem>
            <MenuItem value='target'>Target</MenuItem>
            <MenuItem value='average'>Average</MenuItem>
          </Select>
        </FormControl>

        <FormControl className={classes.input.root}>
          <InputLabel htmlFor="proximalField">Proximal field size:</InputLabel>
          <Input
            id="proximalField"
            value={conditions.proximalField}
            onChange={handleChange('proximalField')}
            inputProps={{
              'aria-label': 'Proximal field',
            }}
          />
        </FormControl>

        
    </div>
  );
}


export default Settings;
