import { Storage } from '@ionic/storage';
import { Drivers } from '@ionic/storage';

let storage;
const initStorage = async () => {
  if (!storage) {
    storage = new Storage({
      name: '__mydb',
      driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage]
    });
    await storage.create();
  }
};

const setItem = async (key, value) => {
  await initStorage();
  await storage.set(key, value);
};

const getItem = async (key) => {
  await initStorage();
  return await storage.get(key);
};

const removeItem = async (key) => {
  await initStorage();
  await storage.remove(key);
};

export default {
  setItem,
  getItem,
  removeItem
};