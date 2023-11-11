import { ZodError } from 'zod';
import { useState } from 'react';
import { Headline } from './Headline';
import { createRandomName } from '@/helpers/create-random-name';
import { DeviceSchema } from './Devices';
import he from 'he';

const AddDevice = () => {
  const [selectedDeviceType, setSelectedDeviceType] = useState<string>('Smartphone');
  const generatedRandomName = createRandomName();
  const [selectedDeviceName, setSelectedDeviceName] = useState<string>(generatedRandomName);
  const [selectedOwnerName, setSelectedOwnerName] = useState<string>('');
  const [selectedBatteryStatus, setSelectedBatteryStatus] = useState<number>(0);

  const verifyAndSendToDb = () => {
    const escapedInput = {
      deviceName: selectedDeviceName.length > 0 && he.escape(selectedDeviceName),
      ownerName: selectedOwnerName.length > 0 && he.escape(selectedOwnerName),
      batteryStatus:
        selectedBatteryStatus >= 0 && selectedBatteryStatus <= 100 && !isNaN(selectedBatteryStatus as number)
          ? selectedBatteryStatus
          : 0,
      deviceType: selectedOwnerName.length > 0 && he.escape(selectedDeviceType),
      id: 0,
    };

    try {
      if (DeviceSchema.parse(escapedInput))
        console.log('it parsed!', { selectedDeviceType, selectedBatteryStatus, selectedDeviceName, selectedOwnerName });
    } catch (error) {
      if (error instanceof ZodError) {
        const customErrors = error.errors.map((e) => ({ path: e.path[0], message: e.message }));
        const errorFields = customErrors.map((e) => `in Feld ${e.path}: ${e.message}`);
        alert(`Bitte überprüfen Sie folgende Felder: \n${errorFields.join(' \n')}`);
      }
    }
  };

  return (
    <div className="text-left">
      <Headline type="h2" content="Add Device" className="text-3xl font-bold text-center" />
      <label htmlFor="deviceName" className="block font-bold">
        Device Name
      </label>
      <input
        id="deviceName"
        type="text"
        name="deviceName"
        className="w-full mb-3 p-2"
        defaultValue={generatedRandomName}
        onChange={(e) => setSelectedDeviceName(e.target.value)}
      />

      <label htmlFor="devicyType" className="block font-bold">
        Device Type
      </label>
      <select
        id="device-type"
        className="w-full mb-3 p-2"
        name="selected"
        onChange={(e) => setSelectedDeviceType(e.target.value)}>
        <option value="Smartphone">Smartphone</option>
        <option value="Tablet">Tablet</option>
        <option value="Camera">Camera</option>
      </select>

      <label htmlFor="deviceOwner" className="block font-bold">
        Owner Name
      </label>
      <input
        id="deviceOwner"
        type="text"
        name="deviceOwner"
        className="w-full mb-3 p-2"
        onChange={(e) => setSelectedOwnerName(e.target.value)}
      />

      <label htmlFor="deviceOwner" className="block font-bold">
        Battery Status
      </label>
      <input
        id="deviceOwner"
        type="number"
        name="deviceOwner"
        className="w-full mb-3 p-2"
        placeholder="0 ... 100"
        min="0"
        max="100"
        pattern="[0-9]{1,3}"
        onChange={(e) => setSelectedBatteryStatus(Number(e.target.value))}
      />
      <button className="bg-green-600" onClick={verifyAndSendToDb}>
        Add Device
      </button>
    </div>
  );
};

export { AddDevice };
