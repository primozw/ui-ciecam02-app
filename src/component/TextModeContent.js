import React from 'react';

const TextModeContent = ({type, options, colors}) => {
  const styles = {
    p: {
       'textAlign': 'center',
       'fontSize': options.fontSize + 'px',
       'fontWeight': (options.bold) ? '700' : '400',
       'fontStyle': (options.italic) ? 'italic' : 'normal',
       'textDecoration': (options.underlined) ? 'underline' : 'none',
       'color': colors[type],
       'lineHeight': '1.0',
       'fontFamily': options.fontFamily,
    }
}
  return(
    <p style={styles.p}>
      {options.text}
    </p>
  );
}

export default TextModeContent;




