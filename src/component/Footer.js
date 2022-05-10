import React, { Component } from 'react';
import compose from 'recompose/compose';
import BottomNavigation, { BottomNavigationAction } from 'material-ui/BottomNavigation';
import Hidden from 'material-ui/Hidden';
import withWidth from 'material-ui/utils/withWidth';
import ColorIcon from './../component/ColorIcon'
import { ChromePicker, BlockPicker } from 'react-color'
import Popover from 'material-ui/Popover';



class Footer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      anchorEl: null,
      popperOpen: false,
      colors: props.colors,
      colorTarget: null
    };

    this.classes = {
      footerMobile: {
        label: 'footer--mobile__label'
      }
    };
    this.handleColorChange = this.handleColorChange.bind(this);
  }

  handleColorChange(color, event) {
    this.props.changeColor(this.state.colorTarget, color.hex);
  }

  handlePopoverOpen = (event, colorTarget) => {
    this.setState({ 
      anchorEl: event.target, 
      popperOpen: true,
      colorTarget: colorTarget
    });
  };

  handlePopoverClose = () => {
    this.setState({ anchorEl: null, popperOpen: false });
  };


  render(){
    return(
      <div>
        <Popover
          open={this.state.popperOpen}
          anchorEl={this.state.anchorEl}
          anchorReference={'anchorEl'}
          onClose={this.handlePopoverClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          classes={{'paper': 'modalContainer'}}
        >
          {(this.state.colorTarget !== 'newForeground') ? <ChromePicker disableAlpha={true} color={this.props.colors[this.state.colorTarget]} onChange={this.handleColorChange}/> : <BlockPicker triangle="hide" color={this.props.colors[this.state.colorTarget]} colors={[]}/>}
          
        </Popover>

        
        <BottomNavigation
          onChange={this.handleChange}
          showLabels
          className="footer--mobile"
        >
          <BottomNavigationAction onClick={(e)=>this.handlePopoverOpen(e,'initForeground')} classes={this.classes.footerMobile} label="Initial Foreground" icon={<ColorIcon color={this.props.colors.initForeground} />} />
          <BottomNavigationAction onClick={(e)=>this.handlePopoverOpen(e,'initBackground')} classes={this.classes.footerMobile} label="Initial Background" icon={<ColorIcon color={this.props.colors.initBackground} />} />
          <BottomNavigationAction onClick={(e)=>this.handlePopoverOpen(e,'targetBackground')} classes={this.classes.footerMobile} label="Target Background" icon={<ColorIcon color={this.props.colors.targetBackground} />} />
          <BottomNavigationAction onClick={(e)=>this.handlePopoverOpen(e,'newForeground')} classes={this.classes.footerMobile} label="New Foreground" icon={<ColorIcon color={this.props.colors.newForeground} />} />
        </BottomNavigation>
      </div>
    )
  }

}

export default compose(withWidth())(Footer);
