import { useState } from 'react';
import { z } from 'zod';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import { Headline } from './Headline';
import { devicesStore } from '@/stores/devices-store';

const DeviceSchema = z.object({
  id: z.number(),
  deviceName: z.string(),
  deviceType: z.union([z.literal('Smartphone'), z.literal('Tablet'), z.literal('Camera')]),
  ownerName: z.string(),
  batteryStatus: z.number().min(0).max(100),
});

type Device = z.infer<typeof DeviceSchema>;

interface DevicesProps {
  className?: string;
}

const Devices = ({ className }: DevicesProps) => {
  const devices = devicesStore((state) => state.devices);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  const handleDeviceEdit = (device: Device) => {
    if (selectedDevice && selectedDevice.id === device.id) setSelectedDevice(null);
    else setSelectedDevice(device);
  };

  const handleDeviceDump = (device: Device) => {
    if (window.confirm('Are you sure you want to Delete this Device?')) {
      fetch('http://localhost:3000/api/devices/delete', {
        method: 'DELETE',
        body: JSON.stringify({ id: device.id }),
      }).then(() => {
        // TODO: Cleanup, either get new Devices from Database or filter Store
        // TODO: Add manual refetch Button
      });
    }
  };

  // TODO: Implement also filtering for i.e. devices that have no more battery
  // or add a searchbar that filters for the supplied name of the Owner

  return (
    <div className={[className, 'relative'].join(' ')}>
      <Headline type="h2" content="Existing Devices" className="font-bold text-2xl mb-4" />
      <div className="flex justify-between items-center mb-4">
        <Headline type="h3" content="Sort items" className="font-bold text-2xl text-left" />
        <ul className="list-none flex gap-2">
          {/* map over these */}
          <li>
            <button>By Battery Status</button>
          </li>
          <li>
            <button>By Owner</button>
          </li>
          <li>
            <button>By Name</button>
          </li>
          <li>
            <button>By Type</button>
          </li>
        </ul>
      </div>
      <ul className="list-none grid grid-cols-3 gap-4">
        {devices.map((device) => (
          <li
            className={[
              'text-left bg-lime-200 rounded-xl p-8 dark:border-slate-800 dark:bg-slate-700 shadow-lg relative border border-transparent hover:border-solid dark:hover:border-slate-400',
              selectedDevice && selectedDevice?.id !== device.id ? 'opacity-50' : '',
            ].join(' ')}
            key={device.id}>
            <div className="w-5/6">
              <p className="mb-4">
                Device Name: <br />
                <strong>{device.deviceName}</strong>
              </p>
              <p className="mb-4">
                Owner Name: <br />
                <strong>{device.ownerName}</strong>
              </p>
              <p>
                BatteryStatus: <br />
                <strong>{device.batteryStatus} %</strong>
              </p>
            </div>
            <div className="bg-slate-600 w-1/6 absolute top-0 right-0 bottom-0 rounded-r-xl flex flex-wrap justify-center items-center py-2">
              <button
                className={['bg-transparent group', selectedDevice?.id === device.id ? 'bg-slate-100' : ''].join(' ')}
                onClick={() => handleDeviceEdit(device)}>
                <PencilIcon className="w-4 text-slate-800 group-hover:text-slate-400" />
              </button>
              <button
                className={['bg-transparent group', selectedDevice?.id === device.id ? 'bg-slate-100' : ''].join(' ')}
                onClick={() => handleDeviceDump(device)}>
                <TrashIcon className="w-4 text-slate-800 group-hover:text-slate-400" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export { Devices, DeviceSchema, type Device };
