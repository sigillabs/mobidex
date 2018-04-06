package com.facebook.react.modules.toast;

import android.widget.Toast;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.security.SecureRandom;
import java.security.Security;
import java.util.Map;
import java.util.HashMap;

import org.bouncycastle.crypto.generators.PKCS5S2ParametersGenerator;
import org.bouncycastle.jce.provider.BouncyCastleProvider;

public class EncryptionManagerModule extends ReactContextBaseJavaModule {

  static {
    Security.addProvider(new BouncyCastleProvider());
  }

  private final static char[] HEX_ARRAY = "0123456789ABCDEF".toCharArray();
  private final static int DEFAULT_ROUNDS = 262144;

  public EncryptionManagerModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  public static String bytesToHex(byte[] b) {
    char[] hexChars = new char[b.length * 2];
    for ( int j = 0; j < b.length; j++ ) {
      int v = b[j] & 0xFF;
      hexChars[j * 2] = HEX_ARRAY[v >>> 4];
      hexChars[j * 2 + 1] = HEX_ARRAY[v & 0x0F];
    }
    return new String(hexChars);
  }

  public static byte[] hexToBytes(String s) {
    int len = s.length();
    byte[] data = new byte[len / 2];
    for (int i = 0; i < len; i += 2) {
      data[i / 2] = (byte) ((Character.digit(s.charAt(i), 16) << 4)
                           + Character.digit(s.charAt(i+1), 16));
    }
    return data;
  }

  @Override
  public String getName() {
    return "EncryptionManager";
  }

  @ReactMethod
  public void generateSalt(Callback errorCallback, Callback successCallback) {
    SecureRandom random = new SecureRandom();
    byte bytes[] = new byte[32];
    random.nextBytes(bytes);
    String result = bytesToHex(bytes);
    successCallback.invoke(result);
  }

  @ReactMethod
  public void generateIV(Callback errorCallback, Callback successCallback) {
    SecureRandom random = new SecureRandom();
    byte bytes[] = new byte[16];
    random.nextBytes(bytes);
    String result = bytesToHex(bytes);
    successCallback.invoke(result);
  }

  @ReactMethod
  public void deriveKey(String password, String salt, Callback errorCallback, Callback successCallback) {
    byte[] _salt = this.hexToBytes(salt);
    byte[] _password = password.getBytes("UTF-8");
    PKCS5S2ParametersGenerator gen = new PKCS5S2ParametersGenerator(new SHA256Digest());
    gen.init(_password, _salt, DEFAULT_ROUNDS);
    byte[] derivedKey = ((KeyParameter) gen.generateDerivedParameters(256)).getKey();
    String result = bytesToHex(derivedKey);
    successCallback.invoke(result);
  }

  @ReactMethod
  public void encrypt(String text, String key, String iv, Callback errorCallback, Callback successCallback) {
    Key _key = new SecretKeySpec(this.hexToBytes(key), "AES");
    IvParameterSpec _iv = new IvParameterSpec(this.hexToBytes(iv));
    Cipher cipher = Cipher.getInstance("AES/CTR/NoPadding");
    cipher.init(Cipher.ENCRYPT_MODE, _key, _iv);
    byte[] encrypted = cipher.doFinal(this.hexToBytes(text));
    String result = bytesToHex(encrypted);
    successCallback.invoke(result);
  }

  @ReactMethod
  public void decrypt(String ciphertext, String key, String iv, Callback errorCallback, Callback successCallback) {
    Key _key = new SecretKeySpec(this.hexToBytes(key), "AES");
    IvParameterSpec _iv = new IvParameterSpec(this.hexToBytes(iv));
    Cipher cipher = Cipher.getInstance("AES/CTR/NoPadding");
    cipher.init(Cipher.DECRYPT_MODE, _key, _iv);
    byte[] decrypted = cipher.doFinal(this.hexToBytes(ciphertext));
    String result = bytesToHex(decrypted);
    successCallback.invoke(result);
  }
}
