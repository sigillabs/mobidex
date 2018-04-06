import ethUtil from "ethereumjs-util";
import { NativeModules } from "react-native";
import uuid from "uuid";

var EncryptionManager = NativeModules.EncryptionManager;

export async function generateSalt() {
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

export async function generateIV() {
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

export async function deriveKey(password, salt) {
  return new Promise((resolve, reject) => {
    EncryptionManager.deriveKey(password, salt, (err, result) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(result);
      }
    });
  });
}

export async function encrypt(text, key, options = {}) {
  let { iv } = options;

  return new Promise((resolve, reject) => {
    EncryptionManager.encrypt(text, key, iv, (err, result) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(result);
      }
    });
  });
}

export async function decrypt(ciphertext, key, options = {}) {
  let { iv } = options;

  return new Promise((resolve, reject) => {
    EncryptionManager.decrypt(ciphertext, key, iv, (err, result) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(result);
      }
    });
  });
}

// https://github.com/ethereum/wiki/wiki/Web3-Secret-Storage-Definition
export async function toV3(privateKey, address, password) {
  let salt = await generateSalt();
  let iv = await generateIV();
  let text = ethUtil.stripHexPrefix(privateKey);
  let derivedKey = await deriveKey(password, salt);
  let ciphertext = await encrypt(text, derivedKey, { iv });
  var mac = ethUtil.stripHexPrefix(ethUtil.sha3(Buffer.concat([ new Buffer(derivedKey, "hex").slice(16, 32), new Buffer(ciphertext, "hex") ])).toString("hex"));
  let id = await generateIV();

  return {
    version: 3,
    id: uuid.v4({ random: id }),
    address: address,
    crypto: {
      ciphertext: ciphertext,
      cipherparams: {
        iv: iv
      },
      cipher: "aes-128-ctr",
      kdf: "pbkdf2",
      kdfparams: {
        c: 262144,
        prf: "hmac-sha256",
        dklen: 32,
        salt: salt
      },
      mac: mac
    }
  };
}

export async function fromV3(v3, password) {
  let salt = ethUtil.stripHexPrefix(v3.crypto.kdfparams.salt);
  let iv = ethUtil.stripHexPrefix(v3.crypto.cipherparams.iv);
  let ciphertext = ethUtil.stripHexPrefix(v3.crypto.ciphertext);
  let derivedKey = await deriveKey(password, salt);
  let text = await decrypt(ciphertext, derivedKey, { iv });

  return {
    privateKey: text,
    address: v3.address
  };
}
