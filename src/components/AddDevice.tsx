import { useState } from 'react';
import { Headline } from './Headline';
import { createRandomName } from '@/helpers/create-random-name';

const AddDevice = () => {
  const [selectedDevice, setSelectedDevice] = useState<string>('Smartphone');
  const [selectedOwnerName, setSelectedOwnerName] = useState<string>('Smartphone');
  const generatedRandomName = createRandomName();

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
      />

      <label htmlFor="devicyType" className="block font-bold">
        Device Type
      </label>
      <select
        id="device-type"
        className="w-full mb-3 p-2"
        name="selected"
        onChange={(e) => setSelectedDevice(e.target.value)}>
        <option value="Smartphone">Smartphone</option>
        <option value="Tablet">Tablet</option>
        <option value="Camera">Camera</option>
      </select>

      <label htmlFor="deviceOwner" className="block font-bold">
        Owner Name
      </label>
      <input id="deviceOwner" type="text" name="deviceOwner" className="w-full mb-3 p-2" />

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
      />
      <button className="bg-green-600">Add Device</button>
    </div>
  );
};

export { AddDevice };
