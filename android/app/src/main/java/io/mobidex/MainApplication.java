package io.mobidex;

import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.ocetnik.timer.BackgroundTimerPackage;
import com.reactnativenavigation.NavigationApplication;
import com.reactnativenavigation.react.NavigationReactNativeHost;

import java.util.Arrays;
import java.util.List;


public class MainApplication extends NavigationApplication {
    
    @Override
    protected ReactNativeHost createReactNativeHost() {
        return new NavigationReactNativeHost(this) {
            @Override
            protected String getJSMainModuleName() {
                return "index";
            }
        };
    }

    @Override
    public boolean isDebug() {
        return BuildConfig.DEBUG;
    }
  
    @Override
    public List<ReactPackage> createAdditionalReactPackages() {
        return Arrays.<ReactPackage>asList(
            new ReactNativeExceptionHandlerPackage(),
            new WalletManagerPackage(),
            new BackgroundTimerPackage()
          );
    }
}
