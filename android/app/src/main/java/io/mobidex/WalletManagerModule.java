package io.mobidex;

import android.util.Log;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.File;

import org.web3j.crypto.Bip39Wallet;
import org.web3j.crypto.Credentials;
import org.web3j.crypto.WalletUtils;

public class WalletManagerModule extends ReactContextBaseJavaModule {
    private File walletDirectory;
    private PasscodeManager passcodeManager;

    WalletManagerModule(ReactApplicationContext reactContext) {
        super(reactContext);

        walletDirectory = new File(reactContext.getFilesDir().getAbsolutePath() + "/bip39keystore");

        if (!ensureWalletDirectoryExists()) {
            Log.w("WalletManager", "Could not create wallet directory: " + walletDirectory.toString());
        }

        passcodeManager = new PasscodeManager(reactContext, reactContext.getFilesDir().getAbsolutePath() + "/pass");
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
    public void supportsFingerPrintAuthentication(Callback cb) {
        cb.invoke(null, passcodeManager.supportsFingerPrintAuthentication());
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
        } catch(Exception e) {
            Log.e("WalletManager", e.getMessage());
            cb.invoke(e);
        }
    }

    @ReactMethod
    public void importWalletByMnemonics(final String mnemonic, final String password, final Callback cb) {
        final Credentials credentials = WalletUtils.loadBip39Credentials(null, mnemonic);

        if (!clearKeystorePath()) {
            cb.invoke("Could not clear Keystore Path to make way for new credentials.", null);
        }

        final PasscodeManager.SavePasscodeCallback passcodeCallback = new PasscodeManager.SavePasscodeCallback() {
            public void invoke(Exception error, boolean success) {
                if (error != null) {
                    cb.invoke(error.getMessage());
                    return;
                }

                if (!success) {
                    Log.d("WalletManager", "Skipped finger print authentication setup.");
                }

                try {
                    WalletUtils.generateWalletFile(password, credentials.getEcKeyPair(), walletDirectory, false);
                    cb.invoke(null, credentials.getEcKeyPair().getPrivateKey().toString(16));
                } catch(Exception e) {
                    Log.e("WalletManager", e.getMessage());
                    cb.invoke(e.getMessage());
                }
            }
        };

        passcodeManager.savePasscode(password, passcodeCallback);
    }

    @ReactMethod
    public void loadWallet(String password, final Callback cb) {
        final File walletFile = getWalletFile();

        if (walletFile == null) {
            cb.invoke(null, null);
        }

        final PasscodeManager.GetPasscodeCallback passcodeCallback = new PasscodeManager.GetPasscodeCallback() {
            public void invoke(Exception error, String password) {
                if (error != null) {
                    cb.invoke(error.getMessage());
                    return;
                }

                try {
                    Credentials credentials = WalletUtils.loadCredentials(password, walletFile);
                    cb.invoke(null, credentials.getEcKeyPair().getPrivateKey().toString(16));
                } catch (Exception e) {
                    Log.e("WalletManager", e.getMessage());
                    cb.invoke(e.getMessage());
                }
            }
        };

        try {
            if (password == null) {
                if (this.passcodeManager.supportsFingerPrintAuthentication()) {
                    this.passcodeManager.getPasscode(passcodeCallback);
                } else {
                    cb.invoke(null, null);
                }
            } else {
                passcodeCallback.invoke(null, password);
            }
        } catch (Exception e) {
            Log.e("WalletManager", e.getClass().getCanonicalName());
            Log.e("WalletManager", e.getMessage());
            Log.e("WalletManager", e.getStackTrace().toString());
            cb.invoke(e.getMessage());
        }
    }
}
