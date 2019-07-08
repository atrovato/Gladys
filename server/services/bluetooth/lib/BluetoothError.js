class BluetoothError extends Error {
  constructor(code, ...params) {
    // Passer les arguments restants (incluant ceux spécifiques au vendeur) au constructeur parent
    super(...params);

    this.name = 'BluetoothError';
    // Informations de déboguage personnalisées
    this.code = code;
  }
}

module.exports = BluetoothError;
