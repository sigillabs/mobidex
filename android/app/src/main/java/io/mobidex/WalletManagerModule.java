package io.mobidex;

import android.util.Log;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.File;

import org.kethereum.bip32.ExtendedKey;
import org.kethereum.bip39.Mnemonic;
import org.kethereum.crypto.ECKeyPair;
import org.kethereum.wallet.WalletKt;

import static org.kethereum.bip32.BIP32.generateKey;
import static org.kethereum.wallet.WalletFileKt.generateWalletFile;
import static org.kethereum.wallet.WalletFileKt.loadKeysFromWalletFile;

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
        File[] walletFiles = walletDirectory.listFiles();
        if (walletFiles != null) {
            for (File f : walletFiles) {
                if (f.getName().endsWith(".json")) {
                    return f;
                }
            }
        }
        return null;
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
            String mnemonic = Mnemonic.INSTANCE.generateMnemonic(128);
            cb.invoke(null, mnemonic);
        } catch(Exception e) {
            Log.e("WalletManager", e.getMessage());
            cb.invoke(e);
        }
    }

    @ReactMethod
    public void importWalletByMnemonics(final String mnemonic, final String password, final Callback cb) {
        final byte[] seed = Mnemonic.INSTANCE.mnemonicToSeed(mnemonic, "");
        final ExtendedKey key = generateKey(seed, "m/44'/60'/0'/0/0");
        final ECKeyPair pair = key.getKeyPair();

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
                generateWalletFile(pair, password, walletDirectory, WalletKt.getLIGHT_SCRYPT_CONFIG());
                cb.invoke(null, pair.getPrivateKey().toString(16));
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
                    ECKeyPair pair = loadKeysFromWalletFile(walletFile, password);
                    cb.invoke(null, pair.getPrivateKey().toString(16));
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
