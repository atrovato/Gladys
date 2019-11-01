const { assert, expect } = require('chai');
const BluetoothManager = require('../../../../services/bluetooth/lib');
const BluetoothMock = require('../BluetoothMock.test');

describe('Bluetooth : verify all available brands', () => {
  let bluetooth;
  let bluetoothManager;

  beforeEach(() => {
    bluetooth = new BluetoothMock();

    bluetoothManager = new BluetoothManager(bluetooth, {}, 'de051f90-f34a-4fd5-be2e-e502339ec9bc');
  });

  afterEach(() => {
    bluetooth.removeAllListeners();
  });

  it('verify there is some available brands', () => {
    const devices = bluetoothManager.availableBrands;
    expect(devices).not.eq(undefined);
    expect(devices.size).eq(2);

    expect(devices.has('nut')).eq(true);
    expect(devices.has('awox')).eq(true);
  });

  it('verify every brand consistency', () => {
    const devices = bluetoothManager.availableBrands;
    devices.forEach((genericDevice, key) => {
      const { device } = genericDevice;

      // Check brand / name
      assert.exists(device.brand, `Device brand should be defined for ${key}`);
      assert.typeOf(device.brand, 'string', `Device brand should be type of 'string' for ${key}`);
      assert.isNotEmpty(device.brand, `Device brand should not be empty for ${key}`);

      // Check requiredServicesAndCharacteristics
      assert.exists(
        device.requiredServicesAndCharacteristics,
        `Device requiredServicesAndCharacteristics should be defined for ${key}`,
      );
      assert.isObject(
        device.requiredServicesAndCharacteristics,
        `Device requiredServicesAndCharacteristics should be type of 'object' for ${key}`,
      );
      assert.isNotEmpty(
        device.requiredServicesAndCharacteristics,
        `Device requiredServicesAndCharacteristics should not be empty for ${key}`,
      );

      // Check each requiredServicesAndCharacteristics
      Object.keys(device.requiredServicesAndCharacteristics).forEach((service) => {
        assert.exists(service, `Device requiredServicesAndCharacteristics -> service should be defined for ${key}`);
        assert.typeOf(
          service,
          'string',
          `Device requiredServicesAndCharacteristics -> service should be type of 'string' for ${key}`,
        );
        assert.lengthOf(
          service,
          4,
          `Device requiredServicesAndCharacteristics -> service should be length of '4' for ${key}`,
        );

        const characteristics = device.requiredServicesAndCharacteristics[service];
        assert.exists(
          characteristics,
          `Device requiredServicesAndCharacteristics -> characteristics should be defined for ${key}`,
        );
        assert.typeOf(
          characteristics,
          'array',
          `Device requiredServicesAndCharacteristics -> characteristics should be type of 'array' for ${key}`,
        );
        assert.isNotEmpty(
          characteristics,
          `Device requiredServicesAndCharacteristics -> characteristics should be not be empty for ${key}`,
        );

        characteristics.forEach((characteristic) => {
          assert.typeOf(
            characteristic,
            'string',
            `Device requiredServicesAndCharacteristics -> characteristics should be type of 'string' for ${key}`,
          );
          assert.lengthOf(
            characteristic,
            4,
            `Device requiredServicesAndCharacteristics -> characteristics should be length of '4' for ${key}`,
          );
        });
      });

      // Checking methods
      assert.exists(device.getMatchingModels, `Device getMatchingModels service should be defined for ${key}`);
      assert.isFunction(device.getMatchingModels, `Device getMatchingModels should be a function for ${key}`);

      // Checking models
      assert.exists(device.models, `Device models should be defined for ${key}`);
      assert.typeOf(device.models, 'array', `Device models should be type of 'array' for ${key}`);
      assert.isNotEmpty(device.models, `Device models should not be empty for ${key}`);

      let pollDevice = false;
      // Checking every model
      device.models.forEach((model, index) => {
        assert.exists(model.name, `Model name is required for ${key} model at position ${index}`);
        assert.typeOf(
          model.name,
          'string',
          `Model name should be type of 'string' for ${key} model at position ${index}`,
        );
        assert.isNotEmpty(model.name, `Model name should not be empty for ${key} model at position ${index}`);

        const modelName = model.name;
        assert.exists(
          model.matches,
          `Model 'matches' function is required for ${key} ${modelName} model at position ${index}`,
        );
        assert.isFunction(
          model.matches,
          `Model 'matches' should be a function for ${key} ${modelName} model at position ${index}`,
        );

        // Check device template
        assert.exists(model.device, `Model 'device' is required for ${key} ${modelName} model at position ${index}`);
        assert.isObject(
          model.device,
          `Model 'device' should be an object for ${key} ${modelName} model at position ${index}`,
        );

        const modelDevice = model.device;
        if (Object.getOwnPropertyDescriptor(modelDevice, 'should_poll')) {
          assert.isBoolean(
            modelDevice.should_poll,
            `Model 'device' 'should_poll' property should be a boolean for ${key} ${modelName} model at position ${index}`,
          );
          if (modelDevice.should_poll) {
            pollDevice = true;

            assert.isNumber(
              modelDevice.poll_frequency,
              `Model 'device' 'poll_frequency' property should be a number for ${key} ${modelName} model at position ${index}`,
            );
            if (modelDevice.poll_frequency <= 0) {
              assert.fail(
                modelDevice.poll_frequency,
                `Model 'device' 'poll_frequency' property should be a greater than 0 for ${key} ${modelName} model at position ${index}`,
              );
            }
          }
        }

        assert.exists(
          modelDevice.features,
          `Model 'device' 'features' property should be defined for ${key} ${modelName} model at position ${index}`,
        );
        assert.isArray(
          modelDevice.features,
          `Model 'device' 'features' property should be an array for ${key} ${modelName} model at position ${index}`,
        );
        assert.isNotEmpty(
          modelDevice.features,
          `Model 'device' 'features' property should not be empty for ${key} ${modelName} model at position ${index}`,
        );

        // Check all features
        modelDevice.features.forEach((feature, fIndex) => {
          assert.exists(
            feature.category,
            `Feature 'category' property should be defined for ${key} feature at position ${fIndex} (${modelName} model at position ${index})`,
          );
          assert.isString(
            feature.category,
            `Feature 'category' property should be a string for ${key} feature at position ${fIndex} (${modelName} model at position ${index})`,
          );
          assert.isNotEmpty(
            feature.category,
            `Feature 'category' property should not be empty for ${key} feature at position ${fIndex} (${modelName} model at position ${index})`,
          );

          const featureName = feature.category;
          assert.exists(
            feature.read_only,
            `Feature 'read_only' property should be defined for ${key} ${featureName} feature at position ${fIndex} (${modelName} model at position ${index})`,
          );
          assert.isBoolean(
            feature.read_only,
            `Feature 'read_only' property should be a boolean for ${key} ${featureName} feature at position ${fIndex} (${modelName} model at position ${index})`,
          );

          assert.exists(
            feature.has_feedback,
            `Feature 'has_feedback' property should be defined for ${key} ${featureName} feature at position ${fIndex} (${modelName} model at position ${index})`,
          );
          assert.isBoolean(
            feature.has_feedback,
            `Feature 'has_feedback' property should be a boolean for ${key} ${featureName} feature at position ${fIndex} (${modelName} model at position ${index})`,
          );

          assert.exists(
            feature.min,
            `Feature 'min' property should be defined for ${key} ${featureName} feature at position ${fIndex} (${modelName} model at position ${index})`,
          );
          assert.isNumber(
            feature.min,
            `Feature 'min' property should be a number for ${key} ${featureName} feature at position ${fIndex} (${modelName} model at position ${index})`,
          );

          assert.exists(
            feature.max,
            `Feature 'max' property should be defined for ${key} ${featureName} feature at position ${fIndex} (${modelName} model at position ${index})`,
          );
          assert.isNumber(
            feature.max,
            `Feature 'max' property should be a number for ${key} ${featureName} feature at position ${fIndex} (${modelName} model at position ${index})`,
          );

          if (feature.min >= feature.max) {
            assert.fail(
              `Feature min (${feature.min}) should be lower than max (${feature.max}) for ${key} ${featureName} feature at position ${fIndex} (${modelName} model at position ${index})`,
            );
          }
        });

        // Check poll feature consistency
        if (pollDevice) {
          assert.exists(
            model.pollFeature,
            `Device 'should poll', so 'pollFetaure should be defined for ${key} ${modelName} model at position ${index}`,
          );
          assert.isObject(
            model.pollFeature,
            `Defined poll feature should be an object for ${key} ${modelName} model at position ${index}`,
          );

          const pollFeatureKeys = Object.keys(model.pollFeature);
          pollFeatureKeys.forEach((category) => {
            const matchinFeature = model.device.features.find((f) => f.category === category);
            assert.exists(
              matchinFeature,
              `Defined poll feature doesn't match any feature, feature category ${category} is missing for ${key} ${modelName} model at position ${index}`,
            );

            const pollFeature = model.pollFeature[category];
            assert.exists(
              pollFeature.services,
              `Poll feature 'services' should be defined for ${key} pollFeature ${category}`,
            );
            assert.isObject(
              pollFeature.services,
              `Poll feature 'services' should be an object for ${key} pollFeature ${category}`,
            );
            assert.isNotEmpty(
              pollFeature.services,
              `Poll feature 'services' should not be empty for ${key} pollFeature ${category}`,
            );

            const serviceKeys = Object.keys(pollFeature.services);
            serviceKeys.forEach((service) => {
              assert.typeOf(
                service,
                'string',
                `Poll feature 'services' key should be a string for ${key} pollFeature ${category}`,
              );
              assert.lengthOf(
                service,
                4,
                `Poll feature 'services' key should be length of '4' for ${key} pollFeature ${category}`,
              );

              const characteristics = pollFeature.services[service];
              assert.exists(
                characteristics,
                `Poll feature 'service' value should be defined for ${key} pollFeature ${category} service ${service}`,
              );
              assert.typeOf(
                characteristics,
                'array',
                `Poll feature 'service' value should be type of 'array' for ${key} pollFeature ${category} service ${service}`,
              );
              assert.isNotEmpty(
                characteristics,
                `Poll feature 'service' value should be not be empty for ${key} pollFeature ${category} service ${service}`,
              );

              characteristics.forEach((characteristic) => {
                assert.typeOf(
                  characteristic,
                  'string',
                  `Poll feature 'service' value should be type of 'string' for ${key} pollFeature ${category} service ${service}`,
                );
                assert.lengthOf(
                  characteristic,
                  4,
                  `Poll feature 'service' value should be length of '4' for ${key} pollFeature ${category} service ${service}`,
                );
              });
            });

            assert.exists(
              pollFeature.transformResult,
              `Poll feature 'transformResult' should be defined for ${key} pollFeature ${category}`,
            );
            assert.isFunction(
              pollFeature.transformResult,
              `Poll feature 'transformResult' should be an function for ${key} pollFeature ${category}`,
            );
          });
        }
      });

      // TODO check device poll / features...
    });
  });
});
