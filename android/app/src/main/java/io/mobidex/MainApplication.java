package io.mobidex;

import com.avishayil.rnrestart.ReactNativeRestartPackage;
import com.bitgo.randombytes.RandomBytesPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.horcrux.svg.SvgPackage;
import com.idehub.GoogleAnalyticsBridge.GoogleAnalyticsBridgePackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.masteratul.exceptionhandler.ReactNativeExceptionHandlerPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.ocetnik.timer.BackgroundTimerPackage;
import com.reactnativenavigation.NavigationApplication;
import com.reactnativenavigation.react.NavigationReactNativeHost;
import io.mobidex.ViewUtilPackage;
import com.reactnativenavigation.react.ReactGateway;

import java.util.Arrays;
import java.util.List;

import io.github.traviskn.rnuuidgenerator.RNUUIDGeneratorPackage;

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

    protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
                new MainReactPackage(),
                new ViewUtilPackage());
    }

    @Override
    public List<ReactPackage> createAdditionalReactPackages() {
        return Arrays.<ReactPackage>asList(
            new ReactNativeExceptionHandlerPackage(),
            new ReactNativeRestartPackage(),
            new RNDeviceInfo(),
            new GoogleAnalyticsBridgePackage(),
            new WalletManagerPackage(),
            new SvgPackage(),
            new VectorIconsPackage(),
            new RandomBytesPackage(),
            new BackgroundTimerPackage(),
            new RNUUIDGeneratorPackage()
          );
    }
}
