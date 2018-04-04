import { NativeModules } from "react-native";

var EncryptionManager = NativeModules.EncryptionManager;

export function generateSalt() {
  return new Promise((resolve, reject) => {
    EncryptionManager.generateSalt((err, result) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(result);
      }
    });
  });
}

export function generateIV() {
  return new Promise((resolve, reject) => {
    EncryptionManager.generateIV((err, result) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(result);
      }
    });
  });
}

export function encrypt(text, options = {}) {
  let { password, salt, iv } = options;

  return new Promise((resolve, reject) => {
    EncryptionManager.encrypt(text, password, iv, salt, (err, result) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(result);
      }
    });
  });
}

export function decrypt(ciphertext, options = {}) {
  let { password, salt, iv } = options;

  return new Promise((resolve, reject) => {
    EncryptionManager.decrypt(ciphertext, password, iv, salt, (err, result) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(result);
      }
    });
  });
}
