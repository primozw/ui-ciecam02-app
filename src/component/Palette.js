import React, { Component } from 'react';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import Checkbox from 'material-ui/Checkbox';
import DeleteIcon from 'material-ui-icons/Delete';
import DownloadIcon from 'material-ui-icons/FileDownload';
import IconButton from 'material-ui/IconButton';


const classes = {
  button: 'btn--add',
  palette: 'palette',
  color: 'scheme',
  colors: 'schemes'
}


const TextIcon = ({icon, text, onClick}) => {
  return (
    <div onClick={onClick} className="icon--text">
      {icon}
      <span>{text}</span>
    </div>
  );
}



const Scheme = ({colors, onClick, selected, deleteHandler, exportHandler}) => {
  var colors = colors.map((elem, ind) => (<div key={ind} className="patch" style={{backgroundColor: elem}}/>));
  return (
    <div onClick={onClick} className={classes.color} >
      <div className="scheme__colors">
        <Checkbox checked={selected} />
        {colors}
      </div>
      {(selected) ?
      (<div className="scheme__buttons">
        <TextIcon icon={<DeleteIcon />} text="Delete" onClick={deleteHandler} />
        <TextIcon icon={<DownloadIcon />} text="Copy RGB" onClick={(event)=>{
          exportHandler('RGB');
          event.stopPropagation();
        }} />
        <TextIcon icon={<DownloadIcon />} text="Copy LAB" onClick={(event)=>{
          exportHandler('LAB');
          event.stopPropagation();
        }} />
      </div>) : ''}
    </div>
  )
}
const Palette = ({addSchemeHandler, schemes, setColors, selectedScheme, deleteHandler, exportHandler}) => {
  const palette = schemes.map((elem, ind) => {
    const colors = [elem.colors.initBackground,elem.colors.initForeground, elem.colors.targetBackground, elem.colors.newForeground];
    return <Scheme 
      key={elem.id} 
      selected={elem.id === selectedScheme} 
      colors={colors} 
      onClick={(event)=>setColors(elem.colors, elem.id)} 
      deleteHandler={(event)=>{
        deleteHandler(elem.id)
        event.stopPropagation();
      }}
      exportHandler={(type)=>{
        exportHandler(elem.id, type);
      }}
       />
  });

  return(
    <div className={classes.palette}>
      <div className={classes.colors}>
        {palette}
      </div>
      <div className={classes.button} onClick={addSchemeHandler}>
        <Button mini variant="fab" color="primary" aria-label="add">
          <AddIcon />
        </Button>
        <p>Add colors</p>
      </div>
    </div>
  );
}


export default Palette;

