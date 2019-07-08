module.exports = {
  name: 'Smart Tracker',
  matches: () => true,
  features: [
    {
      category: 'presence',
      type: 'battery',
      unit: '%',
      min: 0,
      max: 100,
      read_only: true,
    },
  ],
};
