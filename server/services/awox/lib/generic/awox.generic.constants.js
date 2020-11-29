const COMMANDS = {
  ON: [0xaa, 0x0a, 0xfc, 0x3a, 0x86, 0x01, 0x0a, 0x01, 0x01, 0x00, 0x28, 0x0d],
  OFF: [0xaa, 0x0a, 0xfc, 0x3a, 0x86, 0x01, 0x0a, 0x01, 0x00, 0x01, 0x28, 0x0d],
  BRIGHTNESS: [0xaa, 0x0a, 0xfc, 0x3a, 0x86, 0x01, 0x0c, 0x01, 0x00, 0x00, 0x00, 0x0d],
  COLOR: [0xaa, 0x0a, 0xfc, 0x3a, 0x86, 0x01, 0x0d, 0x06, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x0d],
  RESET: [0xaa, 0x0a, 0xfc, 0x3a, 0x86, 0x01, 0x0d, 0x06, 0x01, 0x20, 0x30, 0x40, 0x50, 0x60, 0x00, 0x00, 0x0d],
};

const SERVICES = {
  EXEC: 'fff0',
};

const CHARACTERISTICS = {
  COMMAND: 'fff1',
};

module.exports = {
  COMMANDS,
  SERVICES,
  CHARACTERISTICS,
};
