import { create } from 'zustand';
import { type Device } from '@/components/Devices';

interface DevicesState {
  devices: Device[];
  addDevice: (newItem: Device) => void;
  removeDevice: (deviceToRemove: Device) => void;
  sortBy: (value: keyof Device) => void;
}

const devicesStore = create<DevicesState>((set) => ({
  devices: [],
  addDevice: (newItem: Device) => set((state) => ({ devices: [...state.devices, newItem] })),
  removeDevice: (deviceToRemove: Device) =>
    set((state) => ({ devices: state.devices.filter((device) => device.id !== deviceToRemove.id) })),
  sortBy: (value: keyof Device) =>
    set((state) => ({
      devices: [...state.devices].sort((a: Device, b: Device) => {
        if (typeof a[value] === 'string' && typeof b[value] === 'string')
          return (a[value] as string).localeCompare(b[value] as string, undefined, {
            numeric: true,
            sensitivity: 'base',
          });
        if (typeof a[value] === 'number' && typeof b[value] === 'number') return Number(a[value]) - Number(b[value]);
        return 0;
      }),
    })),
}));

// Async function to fetch devices and update the store state
const fetchDevices = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/devices');
    const devicesData = await response.json();

    devicesStore.setState({ devices: devicesData });
  } catch (error) {
    console.error('Error fetching devices:', error);
  }
};
fetchDevices();

export { devicesStore, fetchDevices };
