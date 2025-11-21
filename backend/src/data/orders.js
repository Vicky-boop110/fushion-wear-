const orders = [
  {
    items: [
      { productName: 'Classic Cotton Tee', quantity: 2, size: 'M' },
      { productName: 'Cozy Fleece Hoodie', quantity: 1, size: 'L' },
    ],
    customer: {
      firstName: 'Aarav',
      lastName: 'Sharma',
      email: 'aarav.sharma@example.com',
      phone: '+91-9876543210',
      address: {
        line1: '14 Residency Road',
        line2: 'Apt 6B',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560025',
        country: 'IN',
      },
    },
    status: 'processing',
    total: 8715,
    notes: 'Gift wrap the hoodie please.',
  },
  {
    items: [
      { productName: 'Designer V-Neck', quantity: 1, size: 'S' },
      { productName: 'Relaxed Daily Hoodie', quantity: 1, size: 'M' },
    ],
    customer: {
      firstName: 'Ira',
      lastName: 'Kapoor',
      email: 'ira.kapoor@example.com',
      phone: '+91-9123456780',
      address: {
        line1: '221 Marine Drive',
        line2: '',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400020',
        country: 'IN',
      },
    },
    status: 'pending',
    total: 7055,
    notes: '',
  },
  {
    items: [
      { productName: 'Kids Fun Tee', quantity: 3, size: 'S' },
      { productName: 'Comfort Fit', quantity: 1, size: 'XL' },
    ],
    customer: {
      firstName: 'Rohan',
      lastName: 'Das',
      email: 'rohan.das@example.com',
      phone: '+91-9012345678',
      address: {
        line1: '77 Park Street',
        line2: '',
        city: 'Kolkata',
        state: 'West Bengal',
        postalCode: '700016',
        country: 'IN',
      },
    },
    status: 'fulfilled',
    total: 7055,
    notes: 'Deliver on weekdays only.',
  },
];

module.exports = orders;

