import './App.css';
import { Headline } from '@/components/Headline';
import { Devices } from './components/Devices';
import { AddDevice } from './components/AddDevice';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import { FileNotFound } from './views/FileNotFound';

function App() {
  return (
    <>
      <Router>
        <header className="text-left dark:bg-slate-500 w-full p-4 text-slate-800 flex justify-between items-center">
          <Headline type="h1" content="Device Manager" className="text-3xl font-bold" />
          <nav className="flex">
            <ul className="list-none flex flex-wrap gap-2">
              <li>
                <NavLink
                  className={({ isActive }) => (isActive ? 'font-bold dark:text-slate-700' : 'dark:text-slate-700')}
                  to="/">
                  Devices
                </NavLink>
              </li>
              <li>
                <NavLink
                  className={({ isActive }) => (isActive ? 'font-bold dark:text-slate-700' : 'dark:text-slate-700')}
                  to="/add-devices">
                  Add Devices
                </NavLink>
              </li>
            </ul>
          </nav>
        </header>

        <section className="p-4">
          <Routes>
            <Route path="/" element={<Devices />} />
            <Route path="/add-devices" element={<AddDevice />} />
            <Route path="*" element={<FileNotFound />} />
          </Routes>
        </section>
      </Router>
    </>
  );
}

export default App;
