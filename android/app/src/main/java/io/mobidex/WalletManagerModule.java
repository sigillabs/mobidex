package io.mobidex;

import android.util.Log;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.File;
import java.io.IOException;
import org.web3j.crypto.Bip39Wallet;
import org.web3j.crypto.CipherException;
import org.web3j.crypto.Credentials;
import org.web3j.crypto.WalletUtils;

public class WalletManagerModule extends ReactContextBaseJavaModule {
    private File walletDirectory;

    public WalletManagerModule(ReactApplicationContext reactContext) {
        super(reactContext);
        walletDirectory = new File(reactContext.getFilesDir().getAbsolutePath() + "/bip39keystore");
        if (!ensureWalletDirectoryExists()) {
            Log.w("WalletManager", "Could not create wallet directory: " + walletDirectory.toString());
        }
    }

    private boolean ensureWalletDirectoryExists() {
        return walletDirectory.mkdirs();
    }

    private File getWalletFile() {
        File[] files = walletDirectory.listFiles();
        if (files == null || files.length == 0) {
            return null;
        } else {
            return files[0];
        }
    }

    private boolean clearKeystorePath() {
        boolean success = true;
        File[] walletFiles = walletDirectory.listFiles();
        if (walletFiles != null) {
            for (File f : walletDirectory.listFiles()) {
                success = success && f.delete();
            }
        }
        return success;
    }

    @Override
    public String getName() {
        return "WalletManager";
    }

    @ReactMethod
    public void doesWalletExist(Callback cb) {
        File walletFile = getWalletFile();
        cb.invoke(null, walletFile != null && walletFile.exists());
    }

    @ReactMethod
    public void generateMnemonics(Callback cb) {
        try {
            Bip39Wallet wallet = WalletUtils.generateBip39Wallet(null, walletDirectory);
            cb.invoke(null, wallet.getMnemonic());
        } catch(CipherException e) {
            Log.e("WalletManager", e.getMessage());
            cb.invoke(e);
        } catch(IOException e) {
            Log.e("WalletManager", e.getMessage());
            cb.invoke(e);
        }
    }

    @ReactMethod
    public void importWalletByMnemonics(String mnemonic, String password, Callback cb) {
        Credentials credentials = WalletUtils.loadBip39Credentials(null, mnemonic);

        if (!clearKeystorePath()) {
            cb.invoke("Could not clear Keystore Path to make way for new credentials.", null);
        }

        try {
            WalletUtils.generateWalletFile(password, credentials.getEcKeyPair(), walletDirectory, false);
            cb.invoke(null, credentials.getEcKeyPair().getPrivateKey().toString(16));
        } catch(CipherException e) {
            Log.e("WalletManager", e.getMessage());
            cb.invoke(e.getMessage());
        } catch(IOException e) {
            Log.e("WalletManager", e.getMessage());
            cb.invoke(e.getMessage());
        }
    }

    @ReactMethod
    public void loadWallet(String password, Callback cb) {
        File walletFile = getWalletFile();

        if (walletFile == null) {
            cb.invoke(null, null);
        }

        try {
            Log.d("WalletManager", password);
            Credentials credentials = WalletUtils.loadCredentials(password, walletFile);
            cb.invoke(null, credentials.getEcKeyPair().getPrivateKey().toString(16));
        } catch(CipherException e) {
            Log.e("WalletManager", e.getMessage());
            cb.invoke(e.getMessage());
        } catch(IOException e) {
            Log.e("WalletManager", e.getMessage());
            cb.invoke(e.getMessage());
        }


    }
}
