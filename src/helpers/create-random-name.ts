import fish from '@/config/fish.json';
import locations from '@/config/locations.json';
import fruit from '@/config/fruit.json';

function createRandomName() {
  const randomFish = fish[Math.floor(Math.random() * fish.length)];
  const randomLocation = locations[Math.floor(Math.random() * locations.length)];
  const randomFruit = fruit[Math.floor(Math.random() * fruit.length)];

  return `${randomFish}-${randomLocation}-${randomFruit}`;
}

export { createRandomName };
