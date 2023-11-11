import { z } from 'zod';
import { useEffect, useState } from 'react';
import { Headline } from './Headline';

const Device = z.object({
  id: z.number(),
  deviceName: z.string(),
  deviceType: z.union([z.literal('Smartphone'), z.literal('Tablet'), z.literal('Camera')]),
  ownerName: z.string(),
  batteryStatus: z.number().min(0).max(100),
});

type Device = z.infer<typeof Device>;

interface DevicesProps {
  className?: string;
}

const Devices = ({ className }: DevicesProps) => {
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    const fetchDevicesInitially = () => fetch('http://localhost:3000/api/devices');
    fetchDevicesInitially()
      .then((data) => data.json())
      .then((data) => setDevices(data))
      .catch((e) => new Error(e));
  }, []);

  return (
    <div className={className}>
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
    </div>
  );
};

export { Devices };
