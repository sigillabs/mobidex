package io.mobidex;

import android.app.Activity;
import android.app.KeyguardManager;
import android.content.Context;
import android.content.Intent;
import android.hardware.fingerprint.FingerprintManager;
import android.os.CancellationSignal;
import android.security.keystore.KeyGenParameterSpec;
import android.security.keystore.KeyProperties;
import android.security.keystore.UserNotAuthenticatedException;
import android.util.Log;

import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.ReactApplicationContext;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.security.InvalidAlgorithmParameterException;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.UnrecoverableEntryException;
import java.security.UnrecoverableKeyException;
import java.security.cert.Certificate;
import java.security.cert.CertificateException;
import java.security.spec.MGF1ParameterSpec;

import javax.crypto.Cipher;
import javax.crypto.spec.OAEPParameterSpec;
import javax.crypto.spec.PSource;

public class PasscodeManager extends BaseActivityEventListener {
    abstract public static class GetPasscodeCallback {
        public abstract void invoke(Exception error, String passcode);
    }

    abstract public static class SavePasscodeCallback {
        public abstract void invoke(Exception error, boolean success);
    }

//    private static final int REQUEST_CODE_CONFIRM_CREDENTIALS_ENCRYPT = 10;
    private static final int REQUEST_CODE_CONFIRM_CREDENTIALS_DECRYPT = 20;
    private static final String ALIAS = "io.mobidex";

    private ReactApplicationContext context;
    private String path;
    private boolean supportsFingerPrint;
    private boolean hasLockScreen;
    private boolean hasEnrolled;
    private FingerprintManager fingerprintManager;
    private KeyguardManager keyguardManager;
    private CancellationSignal fingerprintCancelSignal;

    private GetPasscodeCallback getPasscodeCallback;

    PasscodeManager(ReactApplicationContext reactContext, String path) {
        this.path = path;
        context = reactContext;
        fingerprintManager = (FingerprintManager) context.getSystemService(Context.FINGERPRINT_SERVICE);
        keyguardManager = (KeyguardManager) context.getSystemService(Context.KEYGUARD_SERVICE);

        if (fingerprintManager == null) {
            supportsFingerPrint = false;
            hasEnrolled = false;
        } else {
            supportsFingerPrint = fingerprintManager.isHardwareDetected();
            hasEnrolled = fingerprintManager.hasEnrolledFingerprints();
        }

        if (keyguardManager == null) {
            hasLockScreen  = false;
        } else {
            hasLockScreen  = keyguardManager.isKeyguardSecure();
        }

        reactContext.addActivityEventListener(this);
    }

    boolean supportsFingerPrintAuthentication() {
        return supportsFingerPrint && hasEnrolled && hasLockScreen;
    }

    void cancelFingerPrintAuthentication() {
        if (fingerprintCancelSignal != null) {
            fingerprintCancelSignal.cancel();
        }
    }

    private boolean hasPasscode() throws CertificateException, NoSuchAlgorithmException, IOException, KeyStoreException {
        KeyStore keyStore = KeyStore.getInstance("AndroidKeyStore");
        keyStore.load(null);

        return keyStore.containsAlias(ALIAS);
    }

    private void deletePasscode() throws NoSuchProviderException, NoSuchAlgorithmException, KeyStoreException, IOException, CertificateException {
        KeyStore keyStore = KeyStore.getInstance("AndroidKeyStore");
        keyStore.load(null);

        if (hasPasscode()) {
            keyStore.deleteEntry(ALIAS);
        }
    }

    private KeyPair generateKeyPair() throws InvalidAlgorithmParameterException, NoSuchProviderException, NoSuchAlgorithmException {
        KeyPairGenerator keyGenerator = KeyPairGenerator.getInstance(
                KeyProperties.KEY_ALGORITHM_RSA, "AndroidKeyStore");
        keyGenerator.initialize(new KeyGenParameterSpec.Builder(
                ALIAS,
                KeyProperties.PURPOSE_ENCRYPT | KeyProperties.PURPOSE_DECRYPT)
                .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_RSA_OAEP)
                .setDigests(KeyProperties.DIGEST_SHA256, KeyProperties.DIGEST_SHA512)
                .setKeySize(2048)
                .setUserAuthenticationRequired(true)
                .build());
        return keyGenerator.generateKeyPair();
    }

    private PrivateKey getPrivateKey() throws CertificateException, NoSuchAlgorithmException, IOException, UnrecoverableKeyException, KeyStoreException {
        KeyStore keyStore = KeyStore.getInstance("AndroidKeyStore");
        keyStore.load(null);

        return (PrivateKey) keyStore.getKey(ALIAS, null);
    }

    private PublicKey getPublicKey() throws CertificateException, NoSuchAlgorithmException, IOException, UnrecoverableEntryException, KeyStoreException {
        KeyStore keyStore = KeyStore.getInstance("AndroidKeyStore");
        keyStore.load(null);
        Certificate cert = keyStore.getCertificate(ALIAS);
        return cert.getPublicKey();
    }

    private KeyPair getKeyPair() throws UnrecoverableEntryException, CertificateException, NoSuchAlgorithmException, KeyStoreException, IOException {
        PrivateKey privateKey = getPrivateKey();
        PublicKey publicKey = getPublicKey();
        return new KeyPair(publicKey, privateKey);
    }

    void savePasscode(String passcode, SavePasscodeCallback callback) {
        if (!supportsFingerPrintAuthentication()) {
            callback.invoke(null, false);
            return;
        }

        try {
            if (!hasPasscode()) {
                generateKeyPair();
            }

            KeyPair kp = getKeyPair();

            OAEPParameterSpec spec = new OAEPParameterSpec("SHA-256", "MGF1",
                    MGF1ParameterSpec.SHA1, PSource.PSpecified.DEFAULT);

            Cipher cipher = Cipher.getInstance("RSA/ECB/OAEPWithSHA-256AndMGF1Padding");
            cipher.init(Cipher.ENCRYPT_MODE, kp.getPublic(), spec);

            byte[] bytes = cipher.doFinal(passcode.getBytes());

            File file = new File(this.path);
            if (file.exists()) {
                file.delete();
            }

            FileOutputStream os = new FileOutputStream(file);
            os.write(bytes);
            os.close();

            callback.invoke(null, true);
        } catch (Exception e) {
            callback.invoke(e, false);
        }
    }

    void getPasscode(final GetPasscodeCallback callback) {
        if (!supportsFingerPrintAuthentication()) {
            callback.invoke(null, null);
            return;
        }

        try {
            final File file = new File(path);
            final byte[] bytes = new byte[(int) file.length()];

            PrivateKey key = getPrivateKey();

            Cipher cipher = Cipher.getInstance("RSA/ECB/OAEPWithSHA-256AndMGF1Padding");
            cipher.init(Cipher.DECRYPT_MODE, key);

            FileInputStream is = new FileInputStream(file);
            is.read(bytes);
            is.close();

            fingerprintCancelSignal = new CancellationSignal();

            this.fingerprintManager.authenticate(
                    new FingerprintManager.CryptoObject(cipher),
                    fingerprintCancelSignal,
                    0,
                    new FingerprintManager.AuthenticationCallback() {
                        @Override
                        public void onAuthenticationError(int errorCode, CharSequence errString) {
                            fingerprintCancelSignal = null;
                            callback.invoke(new Exception("Authentication error (" + errorCode + "): " + errString), null);
                        }

                        @Override
                        public void onAuthenticationFailed() {
                            fingerprintCancelSignal = null;
                            callback.invoke(new Exception("Authentication failed"), null);
                        }

                        @Override
                        public void onAuthenticationSucceeded(FingerprintManager.AuthenticationResult result) {
                            fingerprintCancelSignal = null;
                            try {
                                callback.invoke(null, new String(result.getCryptoObject().getCipher().doFinal(bytes)));
                            } catch (Exception e) {
                                Log.d("PasscodeManager", e.getMessage());
                                callback.invoke(e, null);
                            }
                        }
                    }, null);
        } catch (UserNotAuthenticatedException e) {
            // 30 seconds of window after authenticating to initialize cipher.
            // See https://medium.com/overmorrow/authentication-sucks-bad-security-too-345ed20463d4
            this.getPasscodeCallback = callback;

            Intent intent = keyguardManager.createConfirmDeviceCredentialIntent(
                    "Mobidex",
                    "Mobidex needs access to the key store");
            if (intent != null) {
                Log.w("PasscodeManager", "Not null.");
                context.getCurrentActivity().startActivityForResult(intent, REQUEST_CODE_CONFIRM_CREDENTIALS_DECRYPT);
            }
        } catch (Exception e) {
            Log.w("PasscodeManager", e.getMessage());
            Log.w("PasscodeManager", e.getClass().toString());
            callback.invoke(e, null);
        }
    }

    @Override
    public void onActivityResult(final Activity activity,
                                 final int requestCode,
                                 final int resultCode,
                                 final Intent intent) {
        if (requestCode == REQUEST_CODE_CONFIRM_CREDENTIALS_DECRYPT) {
            GetPasscodeCallback cb = getPasscodeCallback;
            getPasscodeCallback = null;

            if (cb == null || resultCode == Activity.RESULT_CANCELED) {
                return;
            }

            getPasscode(cb);
        }
    }
}
