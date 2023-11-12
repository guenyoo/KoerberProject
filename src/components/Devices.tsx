import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import { Headline } from './Headline';
import { devicesStore } from '@/stores/devices-store';
import { API } from '@/config/apis';

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

function isValidSortKey(value: string): value is keyof Device {
  return (
    value === 'id' ||
    value === 'deviceName' ||
    value === 'deviceType' ||
    value === 'ownerName' ||
    value === 'batteryStatus'
  );
}

const Devices = ({ className }: DevicesProps) => {
  const devices = devicesStore((state) => state.devices);
  const removeDevice = devicesStore((state) => state.removeDevice);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const setSortBy = devicesStore((state) => state.sortBy);
  const [sortLabel, setSortLabel] = useState('');
  const [sortDirection, setSortDirection] = useState(true);
  const navigate = useNavigate();

  const handleDeviceEdit = (device: Device) => {
    if (selectedDevice && selectedDevice.id === device.id) setSelectedDevice(null);
    else setSelectedDevice(device);
    navigate(`/edit-device/${device.id}`);
  };

  const sortHandler = (label: string) => {
    if (isValidSortKey(label)) {
      if (sortLabel === label) {
        setSortDirection((state) => !state);
      } else if (sortLabel && sortLabel !== label) setSortDirection(true);
      else setSortDirection(false);
      setSortLabel(label);
      setSortBy(label, sortDirection);
    } else console.error('Invalid sort key:', label);
  };

  const handleDeviceDump = (device: Device) => {
    if (window.confirm('Are you sure you want to Delete this Device?')) {
      fetch(API.DELETE, {
        method: 'DELETE',
        body: JSON.stringify({ id: device.id }),
      }).then(() => {
        removeDevice(device);
        // TODO: Add manual refetch Button (would be nice for users to make sure)
        // even though a reload acomplishes the same, currently
      });
    }
  };

  // TODO: Implement also filtering for i.e. devices that have no more battery
  // or add a searchbar that filters for the supplied name of the Owner

  // TODO: Active States for Sorting Buttons

  return (
    <div className={[className, 'relative'].join(' ')}>
      <Headline type="h2" content="Existing Devices" className="font-bold text-2xl mb-4" />
      <div className="flex justify-between items-center mb-4">
        <Headline type="h3" content="Sort items" className="font-bold text-2xl text-left" />
        <ul className="list-none flex gap-2">
          {[
            { attribute: 'batteryStatus', label: 'By Battery Status' },
            { attribute: 'ownerName', label: 'By Owner' },
            { attribute: 'deviceName', label: 'By Name' },
            { attribute: 'deviceType', label: 'By Type' },
          ].map((btn, index) => (
            <li key={index}>
              <button onClick={() => sortHandler(btn.attribute)}>{btn.label}</button>
            </li>
          ))}
        </ul>
      </div>
      <ul className="list-none grid grid-cols-3 gap-4">
        {devices.map((device) => (
          <li
            className={[
              'text-left bg-violet-100 rounded-xl p-8 dark:border-slate-800 dark:bg-slate-700 shadow-lg relative border border-transparent hover:border-solid dark:hover:border-slate-400',
              selectedDevice && selectedDevice?.id !== device.id ? 'opacity-50' : '',
            ].join(' ')}
            key={device.id}
          >
            <div className="w-5/6">
              {[
                { attribute: device.deviceName, label: 'Device Name' },
                { attribute: device.deviceType, label: 'Device Type' },
                { attribute: device.ownerName, label: 'Owner Name' },
                { attribute: `${device.batteryStatus} %`, label: 'BatteryStatus' },
              ].map((btn, index) => (
                <p className="mb-4" key={index}>
                  {btn.label}: <br />
                  <strong>{btn.attribute}</strong>
                </p>
              ))}
            </div>
            <div className="bg-slate-300 dark:bg-slate-600 w-1/6 absolute top-0 right-0 bottom-0 rounded-r-xl flex flex-wrap justify-center items-center py-2">
              {/* TODO: Create a new component for these buttons */}
              <button
                className={['bg-transparent group', selectedDevice?.id === device.id ? 'bg-slate-100' : ''].join(' ')}
                onClick={() => handleDeviceEdit(device)}
              >
                <PencilIcon className="w-4 text-slate-800 group-hover:text-slate-400" />
              </button>
              <button
                className={['bg-transparent group', selectedDevice?.id === device.id ? 'bg-slate-100' : ''].join(' ')}
                onClick={() => handleDeviceDump(device)}
              >
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
