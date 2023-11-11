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
      <ul>
        {devices.map((device) => (
          <li key={device.id}>
            Device Name: <b>{device.deviceName}</b>, BatteryStatus: <b>{device.batteryStatus} %</b>,
          </li>
        ))}
      </ul>
    </>
  );
};

export { Devices };
