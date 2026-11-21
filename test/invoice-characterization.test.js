const test = require('node:test');
const assert = require('node:assert/strict');

const pricing = require('../lib/pricing');
const invoice = require('../lib/invoice');
const reports = require('../lib/reports');

test('CURRENT BEHAVIOUR: order pricing applies HSN GST after coupon discount', function () {
  const items = [{
    id: 1,
    name: 'Rice',
    sku: 'RICE-1',
    hsn: '1006',
    price: 1000,
    qty: 1
  }];

  const totals = pricing.computeTotals(items, 'WELCOME');

  assert.deepEqual({
    subtotal: totals.subtotal,
    discount: totals.discount,
    taxable: totals.taxable,
    tax: totals.tax,
    cgst: totals.cgst,
    sgst: totals.sgst,
    total: totals.total
  }, {
    subtotal: 1000,
    discount: 50,
    taxable: 950,
    tax: 47.5,
    cgst: 23.75,
    sgst: 23.75,
    total: 997.5
  });
  assert.deepEqual(totals.lines[0], {
    id: 1,
    name: 'Rice',
    hsn: '1006',
    gstPercent: 5,
    gross: 1000,
    discount: 50,
    taxable: 950,
    tax: 47.5,
    net: 997.5
  });
});

test('invoice matches order pricing for HSN GST and coupon discounts', function () {
  const order = {
    id: 7,
    items: [{ name: 'Rice', sku: 'RICE-1', hsn: '1006', price: 1000, qty: 1 }],
    coupon: 'WELCOME',
    subtotal: 1000,
    discount: 50,
    tax: 47.5,
    total: 997.5
  };

  const figures = invoice.computeInvoiceFigures(order);

  assert.deepEqual({
    subtotal: figures.subtotal,
    discount: figures.discount,
    tax: figures.tax,
    cgst: figures.cgst,
    sgst: figures.sgst,
    total: figures.total,
    rowGstPercent: figures.rows[0].gstPercent,
    rowTax: figures.rows[0].lineTax
  }, {
    subtotal: 1000,
    discount: 50,
    tax: 47.5,
    cgst: 23.75,
    sgst: 23.75,
    total: 997.5,
    rowGstPercent: 5,
    rowTax: 47.5
  });
});

test('GST reconciliation matches invoice and ledger when order pricing is valid', function () {
  const result = reports.getGstReconciliation({
    orders: [{
      id: 7,
      date: '2026-11-21',
      customer: 'Asha',
      coupon: 'WELCOME',
      items: [{ name: 'Rice', hsn: '1006', price: 1000, qty: 1 }],
      subtotal: 1000,
      discount: 50,
      tax: 47.5,
      total: 997.5
    }]
  });

  assert.deepEqual(result, {
    totalChecked: 1,
    mismatchCount: 0,
    totalDelta: 0,
    rows: [{
      orderId: 7,
      date: '2026-11-21',
      customer: 'Asha',
      coupon: 'WELCOME',
      ledgerSubtotal: 1000,
      ledgerDiscount: 50,
      ledgerTax: 47.5,
      ledgerTotal: 997.5,
      invoiceDiscount: 50,
      invoiceTax: 47.5,
      invoiceTotal: 997.5,
      delta: 0,
      matched: true
    }]
  });
});
