import { z } from 'zod';
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

  return (
    <div className={className}>
      <Headline type="h2" content="Existing Devices" className="font-bold text-2xl mb-4" />
      <ul className="list-none grid grid-cols-3 gap-4">
        {devices.map((device) => (
          <li className="text-left bg-lime-200 rounded-xl p-8 dark:bg-slate-700 shadow-lg" key={device.id}>
            <p>
              Device Name: <b>{device.deviceName}</b>
            </p>
            <p>
              Owner Name: <b>{device.ownerName}</b>
            </p>
            <p>
              BatteryStatus: <b>{device.batteryStatus} %</b>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export { Devices, DeviceSchema, type Device };
