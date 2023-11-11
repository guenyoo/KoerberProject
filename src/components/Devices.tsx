import { useEffect, useState } from 'react';
import { Headline } from './Headline';

interface Device {
  id: number;
  deviceName: string;
  deviceType: 'Smartphone' | 'Tablet' | 'Camera';
  ownerName: string;
  batteryStatus: number;
}

const Devices = () => {
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    const fetchDevicesInitially = () => fetch('http://localhost:3000/api/devices');
    fetchDevicesInitially()
      .then((data) => data.json())
      .then((data) => setDevices(data))
      .catch((e) => new Error(e));
  }, []);

  return (
    <>
      <Headline type="h2" content="Existing Devices" />
      <ul className="list-none">
        {devices.map((device) => (
          <li className="text-left bg-slate-100 rounded-xl p-8 dark:bg-slate-800 shadow-lg" key={device.id}>
            <div>
              Device Name: <b>{device.deviceName}</b>
            </div>
            <div>
              BatteryStatus: <b>{device.batteryStatus} %</b>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export { Devices };
