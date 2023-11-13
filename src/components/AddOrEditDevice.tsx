import { ZodError } from 'zod';
import { useEffect, useState } from 'react';
import { Headline } from './Headline';
import { createRandomName } from '@/helpers/create-random-name';
import { type Device, DeviceSchema } from './Devices';
import { devicesStore } from '@/stores/devices-store';
import { Note } from './Note';
import { API } from '@/config/apis';
import he from 'he';

interface AddOrEditDeviceProps {
  type: 'add' | 'edit';
  device?: Device;
}

const AddOrEditDevice = ({ type, device }: AddOrEditDeviceProps) => {
  const [deviceType, setDeviceType] = useState<Device['deviceType']>(device?.deviceType || 'Smartphone');
  const generatedRandomName = createRandomName();
  const [deviceName, setDeviceName] = useState<string>(device?.deviceName || generatedRandomName);
  const [ownerName, setOwnerName] = useState<string>(device?.ownerName || '');
  const [batteryStatus, setBatteryStatus] = useState<number>(device?.batteryStatus || 0);
  const addDevice = devicesStore((state) => state.addDevice);
  const replaceDevices = devicesStore((state) => state.replaceDevices);
  const devices = devicesStore((state) => state.devices);
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
        fetch(type === 'add' ? API.ADD : API.PUT, {
          method: type === 'add' ? 'POST' : 'PUT',
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
            ...(type === 'edit' ? { id: device?.id } : null),
          }),
        })
          .then((data) => data.json())
          .then(({ data }) => addDevice(data))
          .then(() => {
            if (type === 'edit') {
              const oldDevice = devices.find((oldDevice: Device) => oldDevice.id === device!.id) as Device;
              const newDevice = { ...oldDevice, deviceType, batteryStatus, deviceName, ownerName };
              const devicesWithoutOldOne = devices.filter((oldDevice: Device) => oldDevice.id !== device!.id);
              replaceDevices([...devicesWithoutOldOne, newDevice]);
            }
            resetInputs();
          })
          // TODO: Here, but also generally, a good Error Handling should be implemented to let the user know what's up
          // This also applies to the backend to send more meaningful messages back so that the frontend can use it better
          // Here, if an error happens, it's probably not because of a schema mismatch (I already handle that case) but
          // We could implement refetching after a while, log a message to the user that something went wrong, display a status code, etc.
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
      <Headline type="h2" content={`${type} Device`} className="text-3xl font-bold text-center" />
      {/* TODO: Create a Component for input fields and labels */}
      <label htmlFor="deviceName" className="block font-bold">
        Device Name
      </label>
      <input
        id="deviceName"
        type="text"
        name="deviceName"
        className="w-full mb-3 p-4 text-xl bg-slate-100 dark:bg-slate-900"
        value={deviceName}
        onChange={(e) => setDeviceName(e.target.value)}
      />

      <label htmlFor="devicyType" className="block font-bold">
        Device Type
      </label>
      <select
        id="device-type"
        className="w-full mb-3 p-4 text-xl bg-slate-100 dark:bg-slate-900"
        name="selected"
        value={deviceType}
        onChange={(e) => setDeviceType(e.target.value as Device['deviceType'])}
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
        className="w-full mb-3 p-4 text-xl bg-slate-100 dark:bg-slate-900"
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
        className="w-full mb-3 p-4 text-xl bg-slate-100 dark:bg-slate-900"
        placeholder="0 ... 100"
        min="0"
        max="100"
        pattern="[0-9]{1,3}"
        onChange={(e) => setBatteryStatus(Number(e.target.value))}
        value={batteryStatus}
      />
      <button
        className={[type === 'edit' ? 'bg-orange-400' : 'bg-green-600', 'mb-8'].join(' ')}
        onClick={verifyAndSendToDb}
      >
        {type === 'edit' ? 'Update' : 'Add'} Device
      </button>
      {showNote && ( // TODO: Would be nice to add warning and errors here too
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

export { AddOrEditDevice };
