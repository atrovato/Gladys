const battery = {
  services: {
    '180f': ['2a19'],
  },
  transformResult: (dataMap = {}) => {
    const data = dataMap['2a19'];
    if (data !== undefined) {
      return data.readUInt8(0);
    }
    return undefined;
  },
};

module.exports = {
  battery,
};
