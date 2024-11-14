import logo from './logo.svg';
import './App.css';
import React from 'react';
import TopBanner from './components/TopBanner';
import UploadForm from './components/UploadForm';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <TopBanner />
        <img src={logo} className="App-logo" alt="logo" />
        <UploadForm />
      </header>
    </div>
  );
}

export default App;
