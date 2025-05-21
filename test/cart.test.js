const Cart = require('../pcart');

beforeEach(() => {
  global.localStorage = {
    store: {},
    getItem(key) { return this.store[key] || null; },
    setItem(key, val) { this.store[key] = String(val); },
    removeItem(key) { delete this.store[key]; }
  };
});

test('addItem accumulates quantity for same id', () => {
  const cart = new Cart();
  cart.addItem({id: 'a1', price: 100, quantity: 2});
  cart.addItem({id: 'a1', price: 100, quantity: 3});
  expect(cart.list()).toEqual([
    { id: 'a1', price: 100, quantity: 5, data: false, subtotal: 500 }
  ]);
});

test('empty clears all data', () => {
  const cart = new Cart();
  cart.addItem({id: 'a1', price: 10, quantity: 1});
  cart.setShipping({type: 'delivery', name: '常溫宅配', price: 60});
  cart.setNote({test: 'note'});
  cart.empty();
  expect(cart.list()).toEqual([]);
  expect(cart.shippingData).toEqual({});
  expect(cart.noteData).toEqual({});
});


test('listDetail mirrors list data', () => {
  const cart = new Cart();
  cart.addItem({id: 'b1', price: 50, quantity: 1});
  expect(cart.listDetail()).toEqual(cart.list());
});
