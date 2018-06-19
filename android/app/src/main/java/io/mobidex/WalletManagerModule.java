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

    public WalletManagerModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "WalletManager";
    }

    @ReactMethod
    public void doesWalletExist(Callback successCallback) {
        File f = new File(WALLET_PATH);
        successCallback.invoke(null, f.exists());
    }

    @ReactMethod
    public void generateMnemonics(Callback successCallback) throws CipherException, IOException {
        Bip39Wallet wallet = WalletUtils.generateBip39Wallet(null, new File(WALLET_PATH));
        successCallback.invoke(null, wallet.getMnemonic());
    }

    @ReactMethod
    public void importWalletByMnemonics(String password, String mnemonic, Callback successCallback) throws CipherException, IOException {
        Credentials credentials = WalletUtils.loadBip39Credentials(null, mnemonic);
        WalletUtils.generateWalletFile(password, credentials.getEcKeyPair(), new File(WALLET_PATH), false);
        successCallback.invoke(null, credentials.getEcKeyPair().getPrivateKey().toString(16));
    }

    @ReactMethod
    public void loadWallet(String password, Callback successCallback) throws CipherException, IOException {
        Credentials credentials = WalletUtils.loadCredentials(password, WALLET_PATH);
        successCallback.invoke(null, credentials.getEcKeyPair().getPrivateKey().toString(16));
    }
}
