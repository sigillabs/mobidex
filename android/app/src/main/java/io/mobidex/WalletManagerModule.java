package io.mobidex;

import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.lang.reflect.Array;
import java.math.BigInteger;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;

import org.apache.commons.lang3.ArrayUtils;
import org.json.JSONException;
import org.json.JSONObject;
import org.kethereum.bip32.ExtendedKey;
import org.kethereum.bip39.Mnemonic;
import org.kethereum.crypto.ECKeyPair;
import org.kethereum.crypto.SignKt;
import org.kethereum.model.Address;
import org.kethereum.model.SignatureData;
import org.kethereum.model.Transaction;
import org.kethereum.wallet.WalletKt;

import static java.util.Collections.emptyList;
import static org.kethereum.bip32.BIP32.generateKey;
import static org.kethereum.functions.TransactionRLPEncoderKt.encodeRLP;
import static org.kethereum.keccakshortcut.KeccakKt.keccak;
import static org.kethereum.wallet.WalletFileKt.generateWalletFile;
import static org.kethereum.wallet.WalletFileKt.loadKeysFromWalletFile;
import static org.kethereum.model.TransactionKt.createTransactionWithDefaults;

public class WalletManagerModule extends ReactContextBaseJavaModule {
    private File walletDirectory;
    private PasscodeManager passcodeManager;
    private final static char[] hexArray = "0123456789ABCDEF".toCharArray();

    public static String bytesToHex(byte[] bytes) {
        char[] hexChars = new char[bytes.length * 2];
        for ( int j = 0; j < bytes.length; j++ ) {
            int v = bytes[j] & 0xFF;
            hexChars[j * 2] = hexArray[v >>> 4];
            hexChars[j * 2 + 1] = hexArray[v & 0x0F];
        }
        return new String(hexChars);
    }

    private static String stripHexPrefix(String s) {
        if (s.startsWith("0x")) {
            return s.substring(2);
        } else {
            return s;
        }
    }

    public static List<Byte> hexStringToByteList(String s) {
        String stripped = stripHexPrefix(s);
        int len = stripped.length();
        List<Byte> data = new LinkedList<Byte>();
        for (int i = 0; i < len; i += 2) {
            data.add((byte) ((Character.digit(stripped.charAt(i), 16) << 4)
                    + Character.digit(stripped.charAt(i+1), 16)));
        }
        return data;
    }

    public static byte[] hexStringToByteArray(String s) {
        String stripped = stripHexPrefix(s);
        int len = stripped.length();
        byte[] data = new byte[len / 2];
        for (int i = 0; i < len; i += 2) {
            data[i / 2] = (byte) ((Character.digit(stripped.charAt(i), 16) << 4)
                    + Character.digit(stripped.charAt(i+1), 16));
        }
        return data;
    }

    public static byte[] removeLeadingZeros(byte[] arr) {
        int start = 0;
        while (arr[start] == 0) {
            start++;
        }
        if (start > 0) {
            return Arrays.copyOfRange(arr, start, arr.length);
        } else {
            return arr;
        }
    }

    public static byte[] leftPadWithZeros(byte[] arr, int size) {
        if (arr.length >= size) {
            return arr;
        }

        int paddingSize = size - arr.length;
        byte[] padding = new byte[paddingSize];

        Arrays.fill(padding, (byte)0);

        return ArrayUtils.addAll(padding, arr);
    }

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
    public void supportsFaceIDAuthentication(Callback cb) {
        cb.invoke(null, false);
    }

    @ReactMethod
    public void cancelFingerPrintAuthentication(final Callback cb) {
        passcodeManager.cancelFingerPrintAuthentication();
        cb.invoke(null, null);
    }

    @ReactMethod
    public void cancelFaceIDAuthentication(final Callback cb) {
        cb.invoke(null, null);
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

    private void loadKeypair(String password, final Callback errorCallback, final Callback successCallback) {
        final File walletFile = getWalletFile();

        if (walletFile == null) {
            successCallback.invoke();
            return;
        }

        final PasscodeManager.GetPasscodeCallback passcodeCallback = new PasscodeManager.GetPasscodeCallback() {
            public void invoke(Exception error, String password) {
                if (error != null) {
                    errorCallback.invoke(error.getMessage());
                    return;
                }

                try {
                    ECKeyPair pair = loadKeysFromWalletFile(walletFile, password);
                    successCallback.invoke(pair);
                } catch (Exception e) {
                    Log.e("WalletManager", e.getMessage());
                    errorCallback.invoke(e.getMessage());
                }
            }
        };

        try {
            if (password == null) {
                if (this.passcodeManager.supportsFingerPrintAuthentication()) {
                    this.passcodeManager.getPasscode(passcodeCallback);
                } else {
                    successCallback.invoke();
                }
            } else {
                passcodeCallback.invoke(null, password);
            }
        } catch (Exception e) {
            Log.e("WalletManager", e.getClass().getCanonicalName());
            Log.e("WalletManager", e.getMessage());
            Log.e("WalletManager", e.getStackTrace().toString());
            errorCallback.invoke(e.getMessage());
        }
    }

    @ReactMethod
    public void loadWallet(String password, final Callback cb) {
        loadKeypair(password, new Callback() {
            @Override
            public void invoke(Object... args) {
                if (args.length == 1) {
                    cb.invoke(args[0], null);
                } else {
                    cb.invoke(null, null);
                }
            }
        }, new Callback() {
            @Override
            public void invoke(Object... args) {
                if (args.length == 1) {
                    cb.invoke(null, ((ECKeyPair)args[0]).getPrivateKey().toString(16));
                } else {
                    cb.invoke(null, null);
                }
            }
        });
    }

    @ReactMethod
    public void loadWalletAddress(final Callback cb) {
        final File walletFile = getWalletFile();

        if (walletFile == null) {
            cb.invoke(null, null);
            return;
        }

        try {
            byte[] data = new byte[(int) walletFile.length()];
            FileInputStream is = new FileInputStream(walletFile);
            is.read(data);
            is.close();

            JSONObject json = new JSONObject(new String(data, "UTF-8"));
            cb.invoke(null, json.getString("address"));
        } catch (FileNotFoundException e) {
            cb.invoke(e.getMessage(), null);
        } catch (IOException e) {
            cb.invoke(e.getMessage(), null);
        } catch (JSONException e) {
            cb.invoke(e.getMessage(), null);
        }
    }

    @ReactMethod
    public void signTransaction(ReadableMap tx, String password, final Callback cb) {
        BigInteger gasLimit = null;
        BigInteger gasPrice = null;
        BigInteger nonce = null;
        Address from = null;
        Address to = null;
        BigInteger value = new BigInteger("0");
        List<Byte> data = emptyList();

        if (tx.hasKey("data")) {
            data = hexStringToByteList(tx.getString("data"));
        }

        if (tx.hasKey("gas")) {
            gasLimit = new BigInteger(stripHexPrefix(tx.getString("gas")), 16);
        }

        if (tx.hasKey("gasPrice")) {
            gasPrice = new BigInteger(stripHexPrefix(tx.getString("gasPrice")), 16);
        }

        if (tx.hasKey("nonce")) {
            nonce = new BigInteger(stripHexPrefix(tx.getString("nonce")), 16);
        }

        if (tx.hasKey("from")) {
            from = new Address(tx.getString("from"));
        }

        if (tx.hasKey("to")) {
            to = new Address(tx.getString("to"));
        }

        if (tx.hasKey("value")) {
            value = new BigInteger(stripHexPrefix(tx.getString("value")), 16);
        }

        Transaction transaction = createTransactionWithDefaults(null, null, from, gasLimit, gasPrice, data, nonce, to,null, value );
        byte[] rlp = encodeRLP(transaction, null);

        loadKeypair(password, new Callback() {
            @Override
            public void invoke(Object... args) {
                if (args.length == 1) {
                    cb.invoke(args[0], null);
                } else {
                    cb.invoke(null, null);
                }
            }
        }, new Callback() {
            @Override
            public void invoke(Object... args) {
                if (args.length == 1) {
                    SignatureData signature = SignKt.signMessage(((ECKeyPair)args[0]), rlp);
                    WritableMap response = Arguments.createMap();
                    response.putString("r",signature.getR().toString(16));
                    response.putString("s",signature.getS().toString(16));
                    response.putString("v", new BigInteger(Byte.valueOf(signature.getV()).toString()).toString(16));

                    cb.invoke(null, response);
                } else {
                    cb.invoke(null, null);
                }
            }
        });
    }

    @ReactMethod
    public void signMessage(String message, String password, final Callback cb) {
        loadKeypair(password, new Callback() {
            @Override
            public void invoke(Object... args) {
                if (args.length == 1) {
                    cb.invoke(args[0], null);
                } else {
                    cb.invoke(null, null);
                }
            }
        }, new Callback() {
            @Override
            public void invoke(Object... args) {
                if (args.length == 1) {
                    byte[] messageData = hexStringToByteArray(message);

                    // NOTE: Without https://github.com/walleth/kethereum/issues/48 need to implement own `eth_sign` function.
                    String message = "\u0019Ethereum Signed Message:\n" + messageData.length;
                    byte[] data = ArrayUtils.addAll(message.getBytes(), messageData);
//                    Log.d("HASH", bytesToHex(keccak(data)));

                    SignatureData signature = SignKt.signMessage((ECKeyPair)args[0], data);

                    byte[] r = leftPadWithZeros(removeLeadingZeros(signature.getR().toByteArray()), 32);
                    byte[] s = leftPadWithZeros(removeLeadingZeros(signature.getS().toByteArray()), 32);

//                    Log.d("R", new Integer(signature.getR().toByteArray().length).toString());
//                    Log.d("R", signature.getR().toString(16));
//                    Log.d("R", bytesToHex(r));
//                    Log.d("S", new Integer(signature.getS().toByteArray().length).toString());
//                    Log.d("S", signature.getS().toString(16));
//                    Log.d("S", bytesToHex(s));
//                    Log.d("V", bytesToHex(new byte[]{signature.getV()}));

                    byte[] compressedSignature = ArrayUtils.addAll(r, s);
                    compressedSignature = ArrayUtils.add(compressedSignature, signature.getV());

                    cb.invoke(null, bytesToHex(compressedSignature));
                } else {
                    cb.invoke(null, null);
                }
            }
        });
    }
}
