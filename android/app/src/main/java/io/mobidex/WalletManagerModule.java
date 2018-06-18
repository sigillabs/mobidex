package io.mobidex;

import android.security.keystore.KeyProperties;
import android.security.keystore.KeyProtection;
import android.util.Log;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.File;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.math.BigInteger;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.Key;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.SecureRandom;
import java.security.Security;
import java.security.SignatureException;
import java.security.UnrecoverableEntryException;
import java.security.UnrecoverableKeyException;
import java.security.cert.CertificateException;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import org.bouncycastle.crypto.digests.SHA256Digest;
import org.bouncycastle.crypto.generators.PKCS5S2ParametersGenerator;
import org.bouncycastle.crypto.params.KeyParameter;
import org.web3j.crypto.Bip39Wallet;
import org.web3j.crypto.CipherException;
import org.web3j.crypto.Credentials;
import org.web3j.crypto.ECDSASignature;
import org.web3j.crypto.Sign;
import org.web3j.crypto.Wallet;
import org.web3j.crypto.WalletUtils;

public class WalletManagerModule extends ReactContextBaseJavaModule {
    private final static String WALLET_PATH = "m/44'/60'/0'/0/0";
//    private final static String WALLET_PATH = "mobidex-key-store.bin";

    private final static char[] HEX_ARRAY = "0123456789ABCDEF".toCharArray();
    private final static int DEFAULT_ROUNDS = 262144;

    public WalletManagerModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "WalletManager";
    }

    public static String bytesToHex(byte[] b) {
        char[] hexChars = new char[b.length * 2];
        for (int j = 0; j < b.length; j++) {
            int v = b[j] & 0xFF;
            hexChars[j * 2] = HEX_ARRAY[v >>> 4];
            hexChars[j * 2 + 1] = HEX_ARRAY[v & 0x0F];
        }
        return new String(hexChars);
    }

    public static String byteToHex(byte b) {
        return bytesToHex(new byte[]{ b });
    }

    public static byte[] hexToBytes(String s) {
        int len = s.length();
        byte[] data = new byte[len / 2];
        for (int i = 0; i < len; i += 2) {
            data[i / 2] = (byte) ((Character.digit(s.charAt(i), 16) << 4)
                    + Character.digit(s.charAt(i + 1), 16));
        }
        return data;
    }

    public static byte hexToByte(String s) {
        byte[] result = hexToBytes(s);
        if (result.length > 0) {
            return result[0];
        } else {
            return 0;
        }
    }

    @ReactMethod
    public void doesWalletExist(Callback successCallback) {
        File f = new File(WALLET_PATH);
        successCallback.invoke(null, f.exists());
    }

    @ReactMethod
    public void createNewWallet(Callback successCallback) throws CipherException, IOException {
        Bip39Wallet wallet = WalletUtils.generateBip39Wallet(null, new File(WALLET_PATH));
        successCallback.invoke(null, wallet.getMnemonic());
    }

    @ReactMethod
    public void importWalletByMnemonic(String password, String mnemonic, Callback successCallback) throws CipherException, IOException {
        Credentials credentials = WalletUtils.loadBip39Credentials(null, mnemonic);
        WalletUtils.generateWalletFile(password, credentials.getEcKeyPair(), new File(WALLET_PATH), false);
        successCallback.invoke(null, null);
    }

    public void sign(String password, String data, Callback successCallback) throws IOException, CipherException {
        Credentials credentials = WalletUtils.loadCredentials(password, new File(WALLET_PATH));
        Sign.SignatureData signature = Sign.signMessage(hexToBytes(data), credentials.getEcKeyPair());
        String R = bytesToHex(signature.getR());
        String S = bytesToHex(signature.getS());
        String V = byteToHex(signature.getV());
        successCallback.invoke(null, new String[]{R, S, V});
    }

    public void recoverSignature(String R, String S, String V, String data, Callback successCallback) throws SignatureException {
        byte[] _R = hexToBytes(R);
        byte[] _S = hexToBytes(S);
        byte _V = hexToByte(V);
        BigInteger key = Sign.signedMessageToKey(hexToBytes(data), new Sign.SignatureData(_V, _R, _S));
        successCallback.invoke(null, key.toString(16));
    }
}
