import React, { Component } from 'react';
import './App.css';

/* Custom Components */
import Footer from './component/Footer';
import Button from './component/Button';
import TextModeContent from './component/TextModeContent';
import IconModeContent from './component/IconModeContent';
import GuiModeContent from './component/GuiModeContent';
import SplitDirection from './component/SplitDirection';
import PreviewModes from './component/PreviewModes';
import Settings from './component/Settings';
import Palette from './component/Palette';


/* Material design React */
import compose from 'recompose/compose';
import Reboot from 'material-ui/Reboot';
import Switch from 'material-ui/Switch';
import Hidden from 'material-ui/Hidden';
import withWidth from 'material-ui/utils/withWidth';
import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Tabs, { Tab } from 'material-ui/Tabs';
import { FormControlLabel, FormGroup } from 'material-ui/Form';
import Snackbar from 'material-ui/Snackbar';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';

/* Icons */
import SettingsIcon from 'material-ui-icons/Settings'
import ColorLensIcon from 'material-ui-icons/ColorLens'
import RemoveRedEyeIcon from 'material-ui-icons/RemoveRedEye'
import ExportIcon from 'material-ui-icons/FileDownload'
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import CloseIcon from 'material-ui-icons/Close';

/* Import CIECAM modules */
import workspace from "./utilities/workspace"
import illuminant from "./utilities/illuminant"
import XYZ from "./utilities/xyz"
import * as rgb from "./utilities/rgb"
import CIECAM02m1 from "./utilities/cam-m1"
import CIECAM02m2 from "./utilities/cam-m2"
import {cfs} from "ciecam02";
import {xyz2lab, lab2xyz} from "./utilities/cielab";

import copy from 'copy-to-clipboard';

const WebFont = require('webfontloader');
const axios = require('axios');
const screenfull = require('screenfull');
const _ = require('lodash');




class App extends Component {
  constructor(props) {
    super(props);
    var that = this;

    this.state = {
      mode: 'text',
      splitHorizontal: true,
      colorAdjustment: true,
      dialog: false,
      tab: 0,
      menu: false,
      colors: {
        initBackground: '#fff',
        targetBackground: '#001f66',
        initForeground: '#ed592c',
        newForeground: false
      },
      options: {
        textMode: {
          text: 'Munsell 2018', //The quick brown fox jumps over the lazy dog.
          fontSize: 35,
          bold: true,
          italic: false,
          underlined: false,
          fontFamily: 'Roboto'
        },
        iconMode: {
          iconSize: 140,
          icon: 'accessibility'
        },
        guiMode: {

        }
      },
      conditions: {
        workspace: 'sRGB',
        adaptingLuminance: 300,
        surroundType: 'dim',
        background: 'init', // init | target | average
        pHue: -0.05,
        pLightness: -0.4,
        whitePoint: illuminant.D65,
        discounting: false,
        proximalField: '100%',
      },
      fontList: false,
      palette: [],
      selectedScheme: null,
      noticeBar: {
        status: false,
        text: ''
      }

    };

    this.counter = 0;

    
    /* COLOR TRANSFORMATION PROPERTIES */
    this.cond = {
      workspace: 'sRGB',
      whitePoint: illuminant.D65,
      adaptingLuminance: 300,
      surroundType: "dim",
      discounting: false
    }

    /* STYLES AND CLASSES */
    this.styles = {
      menuButton: {
        marginLeft: -12,
        marginRight: 20,
      },

      switch: {
        checked: {
          color: "#1f1f1f"
        }
      }
    };

    this.classes = {
      menu: {
        modal: 'menu',
        paper: 'menu__paper'
      },
      tabs: {
        flexContainer: 'tabs',
      },
      tab: {
        labelContainer: 'labelContainer',
        root: 'tab'
      }
    }

    // Bind function to this class
    this.setMode = this.setMode.bind(this);
    this.changeColor = this.changeColor.bind(this);
    this.changeText = this.changeText.bind(this);
    this.changeFontFamily = this.changeFontFamily.bind(this);
    this.changeTextVariant = this.changeTextVariant.bind(this);
    this.changeIcon = this.changeIcon.bind(this);
    this.addScheme = this.addScheme.bind(this);
    this.closeNoticeBar = this.closeNoticeBar.bind(this);
    this.deleteScheme = this.deleteScheme.bind(this);
    this.exportScheme = this.exportScheme.bind(this);



    //Get Google Fonts JSON file
    axios.get('https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBeeXqefLKfQf7r9Hfcn3uxC65iOS0kLPU')
    .then((response) => that.fontList = response.data.items)
    .catch((error) => console.log(error));



    //Open fullscreen
    /*if (screenfull.enabled) {
      screenfull.request();
      console.log('test')
    }*/
  }

  componentDidMount(){
    var [adjColors, conditions]  = this.adjustColor({
      colors: this.state.colors, 
      conditions: this.state.conditions,
    });
    this.setState({
      colors: adjColors
    })
  }

  addScheme(){
    var {colors, palette} = this.state;
    var colors = Object.assign({}, colors);

    palette.push({
      id: this.counter++,
      colors: colors
    })
    
    this.setState({
      palette: palette,
      noticeBar: {status: false}
    })
  }

  deleteScheme(id){
    this.setState((prevState, props) => {
      delete prevState.palette[id];
      return {
        palette: prevState.palette
      }
    });
  }

  exportScheme(id, type){
    var palette = this.state.palette[id].colors;
    if ( type === 'RGB' ){
      copy(palette.initBackground + '\n' + palette.initForeground + '\n' + palette.targetBackground + '\n' + palette.newForeground);
      this.openNoticeBar('RGB values have been copied to clipboard. Press CMD/CTRL + V to paste them.')
    } else if ( type === 'LAB' ) {
      copy(palette.initBgLab.join('\u0009') + '\n' + palette.initFgLab.join('\u0009') + '\n' + palette.targetBgLab.join('\u0009') + '\n' + palette.newFgLab.join('\u0009'));
      this.openNoticeBar('LAB values have been copied to clipboard. Press CMD/CTRL + V to paste them.')
    }
  }

  toggleMenu(status){
    this.setState({
      menu: status
    })
  }

  setMode(event){
    this.setState({
      mode: event.target.value,
    });
  }

  changeColor(colorTarget, color){
    const colors = this.state.colors;
    const conditions = this.state.conditions;
    colors[colorTarget] = color;

    var [adjColors, adjConditions] = this.adjustColor({
      colors: colors, 
      conditions: conditions,
    });

    this.setState({
      colors: adjColors,
      conditions: adjConditions
    });
  }

  changeCondition = prop => event => {
    const conditions = this.state.conditions,
          condition = event.target.value;

    if ('getAttribute' in event.target) {
        conditions[prop] = (event.target.getAttribute('type') === 'number') ? Number(condition) : String(condition);
    } else {
      conditions[prop] = condition;
    }

    const colors = this.state.colors;

    var [adjColors, adjConditions] = this.adjustColor({
      colors: colors, 
      conditions: conditions,
    });

    this.setState({
      colors: adjColors,
      conditions: adjConditions
    });

  };


  crop (v) {
    return Math.max(0, Math.min(1, v));
  }



  adjustColor = ({colors, conditions}) => {

    var xyz = XYZ(workspace[conditions.workspace], conditions.whitePoint);

    var xyzInitBg = xyz.fromRgb(rgb.fromHex(colors.initBackground)),
        xyzInitFg = xyz.fromRgb(rgb.fromHex(colors.initForeground)),
        xyzTargetBg = xyz.fromRgb(rgb.fromHex(colors.targetBackground)),
        background;

    //Define background condition
    if (conditions.background === 'init'){
      background = xyzInitBg;
    } else if (conditions.background === 'target') {
      background = xyzTargetBg;
    } else {
      const labInit = xyz2lab(xyzInitBg, conditions.whitePoint);
      const labTarget = xyz2lab(xyzTargetBg, conditions.whitePoint);
      background = lab2xyz([
        (labInit[0] + labTarget[0]) / 2,
        (labInit[1] + labTarget[1]) / 2,
        (labInit[2] + labTarget[2]) / 2,
      ], conditions.whitePoint);
    }



    /*
    console.log('Init Background (XYZ): ', xyzInitBg);
    console.log('Target Background (XYZ): ', xyzTargetBg);
    console.log('Init foreground (XYZ): ', xyzInitFg);
    */
   
    /*
    var forwardCam = ciecam02.cam({
      whitePoint: this.cond.whitePoint,
      adaptingLuminance: this.cond.adaptingLuminance,
      backgroundLuminance: xyzInitBg[1],
      surroundType: this.cond.surroundType,
      discounting: this.cond.discounting
    });

    var inverseCam = ciecam02.cam({
      whitePoint: this.cond.whitePoint,
      adaptingLuminance: this.cond.adaptingLuminance,
      backgroundLuminance: xyzTargetBg[1],
      surroundType: this.cond.surroundType,
      discounting: this.cond.discounting
    });
    */
   
   //console.log('White Point: ', this.cond.whitePoint);

    var forwardCam = CIECAM02m2({
      whitePoint: conditions.whitePoint,
      adaptingLuminance: conditions.adaptingLuminance,
      background: xyzInitBg,
      proximalField: xyzInitBg,
      surroundType: conditions.surroundType,
      discounting: conditions.discounting
    }, {
      lightness: conditions.pLightness,
      hue: conditions.pHue
    });

    var inverseCam = CIECAM02m2({
      whitePoint: conditions.whitePoint,
      adaptingLuminance: conditions.adaptingLuminance,
      background: background,
      proximalField: xyzTargetBg,
      surroundType: conditions.surroundType,
      discounting: conditions.discounting
    },{
      lightness: conditions.pLightness,
      hue: conditions.pHue
    });
    
    var JCH = forwardCam.fromXyz(xyzInitFg),
        xyzTarget = inverseCam.toXyz(JCH),
        rgbFg = xyz.toRgb(xyzTarget);

    colors.newForeground = rgb.toHex(rgbFg.map(this.crop));
    colors.initFgLab = xyz2lab(xyzInitFg, conditions.whitePoint);
    colors.newFgLab = xyz2lab(xyzTarget, conditions.whitePoint);
    colors.initBgLab = xyz2lab(xyzInitBg, conditions.whitePoint);
    colors.targetBgLab = xyz2lab(xyzTargetBg, conditions.whitePoint);

    return [colors, conditions];

      
  }





  changeText = prop => event => {
    const options = this.state.options;
    options.textMode[prop] = event.target.value;
    this.setState({
      options: options
    });
  };

  changeTextVariant = prop => event => {
    const options = this.state.options;
    options.textMode[prop] = !options.textMode[prop];
    this.setState({
      options: options
    });
  };

  changeFontFamily(event){
    const options = this.state.options;
    options.textMode.fontFamily = event.target.value;
    this.setState({
      options: options
    });

    WebFont.load({
      google: {
        families: [event.target.value + ':400,400i,700,700i&amp;subset=latin-ext']
      }
    });
  }

  changeIcon(prop, value){
    const options = this.state.options;
    options.iconMode[prop] = value;
    this.setState({
      options: options
    });
  }


  renderMainContent(foregroundColorType, backgroundColorType){
    if (this.state.mode === 'text'){
      return (
       <TextModeContent type={foregroundColorType} colors={this.state.colors} options={this.state.options.textMode}/>
      );
    } else if (this.state.mode === 'gui'){
      return (
        <GuiModeContent type={foregroundColorType} bg={backgroundColorType} colors={this.state.colors} options={this.state.options.guiMode}/>
      );
    } else {
      return (
        <IconModeContent type={foregroundColorType} colors={this.state.colors} options={this.state.options.iconMode} />
      )
    }
  }

  openNoticeBar(text){
    this.setState({
      noticeBar: {
        status: true,
        text: text
      }
    })
  }

  closeNoticeBar(){
    this.setState({ noticeBar: { status: false} })
  }

  


  render() {
    return (
      <div className="App">
        <Reboot />
        <header className="header">
          
         <nav className="header__main-nav">
            <FormGroup className="switch">
              <p>Color Adjustment</p>
              <FormControlLabel
                control={
                  <Switch
                    checked={this.state.colorAdjustment}
                    onChange={(event, checked) => this.setState({ colorAdjustment: checked })}
                    classes={{
                      iconChecked: 'iconChecked',
                      bar: 'bar'
                    }}
                  />
                }
                label={(this.state.colorAdjustment)?'On' : 'Off'}
                classes={{
                  label: 'switch-label'
                }}
              />
              <SplitDirection split={this.state.splitHorizontal} onClick={()=>{
                this.setState({splitHorizontal: !this.state.splitHorizontal})
              }} />

            </FormGroup>
         </nav>

        <IconButton onClick={()=>{this.toggleMenu(true)}} className="menu-icon" color="inherit" aria-label="Open Menu">
          <MenuIcon />
        </IconButton>

        </header>

        <main className="main-content" style={{backgroundColor: this.state.colors.initBackground}}>
          <div className="container" style={{flexDirection: (this.state.splitHorizontal) ? 'column' : 'row' }}>
            <div className="initContent" style={{backgroundColor: this.state.colors.initBackground}}>
              <div className="contentWrapper" style={{
                width: this.state.conditions.proximalField,
                height: this.state.conditions.proximalField
              }}>
                {this.renderMainContent('initForeground', 'initBackground')}
              </div>
            </div>
            <div className="targetContent">
              <div className="contentWrapper" style={{
                backgroundColor: this.state.colors.targetBackground,
                width: this.state.conditions.proximalField,
                height: this.state.conditions.proximalField
              }}>
                {this.renderMainContent((this.state.colorAdjustment) ? 'newForeground' : 'initForeground', 'targetBackground')}
              </div>
            </div>
          </div>
          
        </main>

        <footer className="footer">
          <Footer colors={this.state.colors} changeColor={this.changeColor}/>
        </footer>


        <Drawer ModalProps={{hideBackdrop: false}} BackdropProps={{classes: {root: 'overlay'}}} classes={this.classes.menu} anchor="right" open={this.state.menu} onClose={()=>{this.toggleMenu(false)}} >
          <IconButton onClick={()=>{this.toggleMenu(false)}} className="menu-icon__close" color="inherit" aria-label="Close Menu">
            <CloseIcon /> 
          </IconButton>

          <Tabs
            value={this.state.tab}
            onChange={(event, value) => this.setState({ tab: value })}
            indicatorColor="primary"
            textColor="primary"
            centered
            classes={this.classes.tabs}
          >
            <Tab classes={this.classes.tab} label="Preview Mode" icon={<RemoveRedEyeIcon />}/>
            <Tab classes={this.classes.tab} label="Settings" icon={<SettingsIcon />} />
            <Tab classes={this.classes.tab} label="Palette" icon={<ColorLensIcon />} />
          </Tabs>

          {this.state.tab == 0 && <PreviewModes 
            mode={this.state.mode} 
            options={this.state.options} 
            fontList={this.fontList}
            onFontFamilyChange={this.changeFontFamily}
            onTextChange={this.changeText}
            onTextVariantChange={this.changeTextVariant}
            setMode = {this.setMode}
            onChangeIcon = {this.changeIcon}
          />}
          {this.state.tab == 1 && <Settings 
            conditions={this.state.conditions}
            handleChange = {this.changeCondition}
          />} 
          {this.state.tab == 2 && <Palette 
            addSchemeHandler={this.addScheme}
            schemes={this.state.palette}
            setColors={(colors, id)=>{
              this.setState((prevState, props) => ({
                colors: (prevState.selectedScheme === id) ? Object.assign({}, colors) : colors,
                selectedScheme: (prevState.selectedScheme === id) ? null : id
              }));
            }}
            deleteHandler={this.deleteScheme}
            exportHandler={this.exportScheme}
            selectedScheme={this.state.selectedScheme}
          />} 
        </Drawer>

        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          open={this.state.noticeBar.status}
          autoHideDuration={3000}
          onClose={this.closeNoticeBar}
          SnackbarContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{this.state.noticeBar.text}</span>}
        />

        <Dialog
          open={this.state.dialog}
          onClose={()=> this.setState({dialog: false})}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle>{"Select export format"}</DialogTitle>
          <DialogContent>
            <List component="nav">
              <ListItem button>
                <ListItemText primary="RGB (SCSS)" />
              </ListItem>
              <ListItem button>
                <ListItemText primary="CIELAB (TXT)" />
              </ListItem>
            </List>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

//export default App;
export default compose(withWidth())(App);
