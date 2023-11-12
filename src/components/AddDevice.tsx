import { ZodError } from 'zod';
import { useEffect, useState } from 'react';
import { Headline } from './Headline';
import { createRandomName } from '@/helpers/create-random-name';
import { DeviceSchema } from './Devices';
import { devicesStore } from '@/stores/devices-store';
import { Note } from './Note';
import he from 'he';

const AddDevice = () => {
  const [deviceType, setDeviceType] = useState<string>('Smartphone');
  const generatedRandomName = createRandomName();
  const [deviceName, setDeviceName] = useState<string>(generatedRandomName);
  const [ownerName, setOwnerName] = useState<string>('');
  const [batteryStatus, setBatteryStatus] = useState<number>(0);
  const addDevice = devicesStore((state) => state.addDevice);
  const [showNote, setShowNote] = useState(false);

  const resetInputs = () => {
    setDeviceType('Smartphone');
    setDeviceName(createRandomName());
    setOwnerName('');
    setBatteryStatus(0);
    setShowNote(true);
  };

  const verifyAndSendToDb = () => {
    const escapedInput = {
      deviceName: deviceName.length > 0 && he.escape(deviceName),
      ownerName: ownerName.length > 0 && he.escape(ownerName),
      batteryStatus: batteryStatus >= 0 && batteryStatus <= 100 && !isNaN(batteryStatus as number) ? batteryStatus : 0,
      deviceType: ownerName.length > 0 && he.escape(deviceType),
      id: 0,
    };

    try {
      if (DeviceSchema.parse(escapedInput)) {
        fetch('http://localhost:3000/api/devices/put', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          redirect: 'follow', // manual, *follow, error
          referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
          body: JSON.stringify({
            deviceType,
            batteryStatus,
            deviceName,
            ownerName,
          }),
        })
          .then((data) => data.json())
          .then(({ data }) => addDevice(data))
          .then(resetInputs)
          .catch((e) => console.error(e));
      }
    } catch (error) {
      if (error instanceof ZodError) {
        const customErrors = error.errors.map((e) => ({ path: e.path[0], message: e.message }));
        const errorFields = customErrors.map((e) => `in Feld ${e.path}: ${e.message}`);
        alert(`Bitte überprüfen Sie folgende Felder: \n${errorFields.join(' \n')}`);
      }
    }
  };

  useEffect(() => {
    // This could be animated nicer with transitions
    if (showNote) {
      const timer = setTimeout(() => {
        setShowNote(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showNote]);

  return (
    <div className="text-left">
      <Headline type="h2" content="Add Device" className="text-3xl font-bold text-center" />
      {/* TODO: Create a Component for input fields and labels */}
      <label htmlFor="deviceName" className="block font-bold">
        Device Name
      </label>
      <input
        id="deviceName"
        type="text"
        name="deviceName"
        className="w-full mb-3 p-4 text-xl"
        value={deviceName}
        onChange={(e) => setDeviceName(e.target.value)}
      />

      <label htmlFor="devicyType" className="block font-bold">
        Device Type
      </label>
      <select
        id="device-type"
        className="w-full mb-3 p-4 text-xl"
        name="selected"
        value={deviceType}
        onChange={(e) => setDeviceType(e.target.value)}
      >
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
        className="w-full mb-3 p-4 text-xl"
        onChange={(e) => setOwnerName(e.target.value)}
        value={ownerName}
      />

      <label htmlFor="deviceOwner" className="block font-bold">
        Battery Status
      </label>
      <input
        id="deviceOwner"
        type="number"
        name="deviceOwner"
        className="w-full mb-3 p-4 text-xl"
        placeholder="0 ... 100"
        min="0"
        max="100"
        pattern="[0-9]{1,3}"
        onChange={(e) => setBatteryStatus(Number(e.target.value))}
        value={batteryStatus}
      />
      <button className="bg-green-600 mb-8" onClick={verifyAndSendToDb}>
        Add Device
      </button>
      {showNote && (
        <Note
          className={[
            'w-2/3 text-center center mx-auto transition',
            showNote && 'opacity-100',
            !showNote && 'opacity-0',
          ].join(' ')}
          type="success"
          content="Device wurde erfolgreich hinzugefügt"
          headline="Heureka!"
        />
      )}
    </div>
  );
};

export { AddDevice };
