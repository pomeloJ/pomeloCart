const Cart = require('../pcart');

beforeEach(() => {
  global.localStorage = {
    store: {},
    getItem(key) { return this.store[key] || null; },
    setItem(key, val) { this.store[key] = String(val); },
    removeItem(key) { delete this.store[key]; }
  };
});

test('addCoupon replaces same tag', () => {
  const cart = new Cart();
  cart.addCoupon({tag: 't', itemTag: 'x', minPrice: 0, discountType: 'amount', discountValue: 5});
  const first = cart.couponList()[0].id;
  cart.addCoupon({tag: 't', itemTag: 'x', minPrice: 0, discountType: 'amount', discountValue: 6});
  const list = cart.couponList();
  expect(list.length).toBe(1);
  expect(list[0].id).not.toBe(first);
});

test('delCoupon and clearCoupons work', () => {
  const cart = new Cart();
  cart.addCoupon({tag: 'a', itemTag: 'x', minPrice: 0, discountType: 'amount', discountValue: 5});
  const id = cart.couponList()[0].id;
  cart.delCoupon({id});
  expect(cart.couponList()).toEqual([]);
  cart.addCoupon({tag: 'b', itemTag: 'x', minPrice: 0, discountType: 'amount', discountValue: 5});
  cart.addCoupon({tag: 'c', itemTag: 'x', minPrice: 0, discountType: 'amount', discountValue: 5});
  cart.clearCoupons();
  expect(cart.couponList()).toEqual([]);
});

test('couponDiscount reflects totals', () => {
  const cart = new Cart();
  cart.addItem({id: 'p1', price: 50, quantity: 3, data: {tag: 'food'}});
  cart.addCoupon({tag: 'd', itemTag: 'food', minPrice: 100, discountType: 'percent', discountValue: 0.1});
  expect(cart.couponDiscount()).toBeCloseTo(15);
  const summary = cart.total();
  expect(summary.couponDiscount).toBeCloseTo(15);
  expect(summary.allPrice).toBeCloseTo(150 - 15);
});
