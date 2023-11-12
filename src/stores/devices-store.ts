import { create } from 'zustand';
import { type Device } from '@/components/Devices';

interface DevicesState {
  devices: Device[];
  addDevice: (newItem: Device) => void;
}

const devicesStore = create<DevicesState>((set) => ({
  devices: [],
  addDevice: (newItem: Device) => set((state) => ({ devices: [...state.devices, newItem] })),
}));

// Async function to fetch devices and update the store state
const fetchDevices = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/devices');
    const devicesData = await response.json();

    console.log(devicesData);

    devicesStore.setState({ devices: devicesData });
  } catch (error) {
    console.error('Error fetching devices:', error);
  }
};
fetchDevices();

export { devicesStore, fetchDevices };
