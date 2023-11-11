// import { useState } from 'react';
// import reactLogo from '@/assets/react.svg';
// import viteLogo from '/vite.svg';
import './App.css';
import { Headline } from '@/components/Headline';
import { Devices } from './components/Devices';

function App() {
  return (
    <>
      <Headline type="h1" content="Device Manager" className="text-3xl font-bold" />
      <Devices />
    </>
  );
}

export default App;
