import { render, screen } from '@testing-library/react';
import { devicesStore } from '@/stores/devices-store';

import App from '@/App';

describe('App', () => {
  beforeEach(() => {
    devicesStore.setState({
      devices: [
        {
          id: 0,
          deviceName: 'Hans Rüdiger',
          deviceType: 'Smartphone',
          ownerName: 'Klaus Herbert',
          batteryStatus: 0,
        },
      ],
    });
  });

  it('renders App with Hans Rüdiger as solo Device', () => {
    const app = render(<App />);
    expect(screen.getByText('Hans Rüdiger')).toBeTruthy();
    expect(app).toMatchSnapshot();
  });
});
