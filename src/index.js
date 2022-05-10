import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { createMuiTheme } from 'material-ui/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#EEEEEE',
      main: '#212121',
      dark: '#212121',
      contrastText: '#fff',
    },
    secondary: {
      light: '#EEEEEE',
      main: '#212121',
      dark: '#212121',
      contrastText: '#fff',
    },
  },
});


ReactDOM.render(<MuiThemeProvider theme={theme}><App /></MuiThemeProvider>, document.getElementById('root'));
registerServiceWorker();
