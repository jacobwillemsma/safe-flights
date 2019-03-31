import * as React from 'react';
import * as ReactDOM from 'react-dom';

import './css/normalize.css'
import './css/skeleton.css'

import Home from './components/Home';

ReactDOM.render(
  <Home />,
  document.getElementById('root') as HTMLElement
);
