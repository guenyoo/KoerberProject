import locations from '@/config/locations.json';
import fruit from '@/config/fruit.json';
import deserts from '@/config/deserts.json';

function createRandomName() {
  const randomFish = deserts[Math.floor(Math.random() * deserts.length)];
  const randomLocation = locations[Math.floor(Math.random() * locations.length)];
  const randomFruit = fruit[Math.floor(Math.random() * fruit.length)];

  return `${randomFish}-${randomLocation}-${randomFruit}`;
}

export { createRandomName };
