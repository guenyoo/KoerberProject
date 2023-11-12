import './App.css';
import { Headline } from '@/components/Headline';
import { Devices } from './components/Devices';
import { AddOrEditDevice } from './components/AddOrEditDevice';
import { BrowserRouter as Router, Route, Routes, NavLink, useParams } from 'react-router-dom';
import { FileNotFound } from './views/FileNotFound';
import { devicesStore } from './stores/devices-store';

const EditDevicePage = () => {
  const devices = devicesStore((state) => state.devices);
  const { id } = useParams();

  return <AddOrEditDevice type="edit" device={devices.find((device) => device.id === Number(id))} />;
};

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
                  className={({ isActive }) =>
                    isActive
                      ? 'font-bold hover:text-slate-800 dark:text-slate-700 dark:hover:text-white'
                      : 'dark:text-slate-700 hover:text-slate-800 dark:hover:text-white'
                  }
                  to="/"
                >
                  Devices
                </NavLink>
              </li>
              <li>
                <NavLink
                  className={({ isActive }) =>
                    isActive
                      ? 'font-bold hover:text-slate-800 dark:text-slate-700 dark:hover:text-white'
                      : 'dark:text-slate-700 hover:text-slate-800 dark:hover:text-white'
                  }
                  to="/add-devices"
                >
                  Add Devices
                </NavLink>
              </li>
            </ul>
          </nav>
        </header>

        <section className="p-4">
          <Routes>
            <Route path="/" element={<Devices />} />
            <Route path="/add-devices" element={<AddOrEditDevice type="add" />} />
            <Route path="/edit-device/:id" element={<EditDevicePage />} />
            <Route path="*" element={<FileNotFound />} />
          </Routes>
        </section>
      </Router>
    </>
  );
}

export default App;
