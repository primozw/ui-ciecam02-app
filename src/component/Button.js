import React from 'react';

const Button = ({children, onClick, icon}) => {

  return(
    <button onClick={onClick} className="btn">{icon}<span>{children}</span></button>
  );
}


export default Button;
