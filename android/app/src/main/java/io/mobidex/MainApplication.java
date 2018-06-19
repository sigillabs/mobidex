package io.mobidex;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.bitgo.randombytes.RandomBytesPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.horcrux.svg.SvgPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import org.reactnative.camera.RNCameraPackage;
import com.jamesisaac.rnbackgroundtask.BackgroundTaskPackage;
import org.reactnative.camera.RNCameraPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.jamesisaac.rnbackgroundtask.BackgroundTaskPackage;
import com.horcrux.svg.SvgPackage;
import com.bitgo.randombytes.RandomBytesPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RandomBytesPackage(),
            new VectorIconsPackage(),
            new SvgPackage(),
            new ReactNativePushNotificationPackage(),
            new RNCameraPackage(),
            new BackgroundTaskPackage(),
          new EncryptionManagerPackage(),
          new WalletManagerPackage(),
          new RNCameraPackage(),
          new ReactNativePushNotificationPackage(),
          new BackgroundTaskPackage(),
          new SvgPackage(),
          new VectorIconsPackage(),
          new RandomBytesPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    BackgroundTaskPackage.useContext(this);
  }
}
