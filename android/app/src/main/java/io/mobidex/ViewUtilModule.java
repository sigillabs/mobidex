package io.mobidex;

import android.app.Activity;
import android.os.Build;
import android.os.Handler;
import android.view.View;
import android.view.WindowManager;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class ViewUtilModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;
    private final Handler uiHandler;
    private final Runnable enableImmersive;
    private final Runnable disableImmersive;

    public ViewUtilModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;

        uiHandler = new Handler(reactContext.getMainLooper());
        enableImmersive = new Runnable() {
            @Override
            public void run() {
                Activity activity = getCurrentActivity();
                if(activity != null && Build.VERSION.SDK_INT >= 14){
                    activity.getWindow().getDecorView().setSystemUiVisibility(
                            View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                                    | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                                    | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                                    | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                                    | View.SYSTEM_UI_FLAG_FULLSCREEN
                                    | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                    );
                }
            }
        };

        disableImmersive = new Runnable(){
            @Override
            public void run() {
                Activity activity = getCurrentActivity();
                if(activity != null && Build.VERSION.SDK_INT >= 14){
                    activity.getWindow().getDecorView().setSystemUiVisibility(
                            View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                                    | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                                    | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                    );
                }
            }
        };
    }

    @Override
    public String getName() {
        return "ViewUtil";
    }

    @ReactMethod
    public void enterFullScreen(){
        uiHandler.post(enableImmersive);
    }

    @ReactMethod
    public void disableFullScreen(){
        uiHandler.post(disableImmersive);
    }

    @ReactMethod
    public void keepScreenAwake() {
        getCurrentActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                getCurrentActivity().getWindow()
                        .addFlags(android.view.WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
            }
        });
    }

    @ReactMethod
    public void removeScreenAwake() {
        getCurrentActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                getCurrentActivity().getWindow()
                        .clearFlags(android.view.WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
            }
        });
    }
}
