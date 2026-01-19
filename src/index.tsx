import React from 'react';
import ReactDOM from 'react-dom/client';
import ResourceLibrary from './ResourceLibrary';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ResourceLibrary />
  </React.StrictMode>
);