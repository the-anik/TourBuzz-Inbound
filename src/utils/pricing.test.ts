import test from 'node:test';
import assert from 'node:assert/strict';
import { convertPrice, formatPrice, calculateBookingTotal } from './pricing';

test('convertPrice converts USD to other currencies properly', () => {
  assert.equal(convertPrice(100, 'USD'), 100);
  assert.equal(convertPrice(100, 'EUR'), 92);
  assert.equal(convertPrice(100, 'JPY'), 15450);
  assert.equal(convertPrice(100, 'BDT'), 12150);
});

test('convertPrice handles zero and negative numbers safely', () => {
  assert.equal(convertPrice(0, 'USD'), 0);
  assert.equal(convertPrice(-50, 'EUR'), 0);
});

test('formatPrice formats with expected symbols', () => {
  assert.match(formatPrice(100, 'USD'), /\$100/);
  assert.match(formatPrice(100, 'EUR'), /€92/);
  assert.match(formatPrice(100, 'BDT'), /৳12,150/);
});

test('calculateBookingTotal accounts for guests and solo supplement', () => {
  assert.equal(calculateBookingTotal(250, 1, 50), 300); // 1 guest with solo supplement
  assert.equal(calculateBookingTotal(250, 2, 50), 500); // 2 guests, no supplement
  assert.equal(calculateBookingTotal(250, 0), 0); // invalid guest count
});
