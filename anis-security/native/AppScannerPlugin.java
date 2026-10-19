package __APPID__;

import android.app.admin.DevicePolicyManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.ServiceInfo;
import android.os.Build;
import android.provider.Settings;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

/** Reads the list of installed (non-system) apps. Nothing leaves the device. */
@CapacitorPlugin(name = "AppScanner")
public class AppScannerPlugin extends Plugin {

    @PluginMethod
    public void listApps(PluginCall call) {
        try {
            Context ctx = getContext();
            PackageManager pm = ctx.getPackageManager();
            List<PackageInfo> pkgs = pm.getInstalledPackages(
                    PackageManager.GET_PERMISSIONS | PackageManager.GET_SERVICES);

            Set<String> a11y = new HashSet<>();
            String enabled = Settings.Secure.getString(
                    ctx.getContentResolver(), Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES);
            if (enabled != null) {
                for (String s : enabled.split(":")) {
                    int i = s.indexOf('/');
                    if (i > 0) a11y.add(s.substring(0, i));
                }
            }

            Set<String> admins = new HashSet<>();
            DevicePolicyManager dpm =
                    (DevicePolicyManager) ctx.getSystemService(Context.DEVICE_POLICY_SERVICE);
            if (dpm != null) {
                List<ComponentName> list = dpm.getActiveAdmins();
                if (list != null) {
                    for (ComponentName c : list) admins.add(c.getPackageName());
                }
            }

            JSArray out = new JSArray();
            for (PackageInfo p : pkgs) {
                ApplicationInfo ai = p.applicationInfo;
                if (ai == null || (ai.flags & ApplicationInfo.FLAG_SYSTEM) != 0) continue;

                String installer = null;
                try {
                    if (Build.VERSION.SDK_INT >= 30) {
                        installer = pm.getInstallSourceInfo(p.packageName).getInstallingPackageName();
                    } else {
                        installer = pm.getInstallerPackageName(p.packageName);
                    }
                } catch (Exception ignored) { }

                JSObject o = new JSObject();
                o.put("pkg", p.packageName);
                o.put("name", String.valueOf(pm.getApplicationLabel(ai)));
                o.put("installer", installer == null ? "" : installer);
                o.put("debuggable", (ai.flags & ApplicationInfo.FLAG_DEBUGGABLE) != 0);
                o.put("hasLauncher", pm.getLaunchIntentForPackage(p.packageName) != null);
                o.put("a11yEnabled", a11y.contains(p.packageName));
                o.put("deviceAdmin", admins.contains(p.packageName));

                JSArray perms = new JSArray();
                if (p.requestedPermissions != null) {
                    for (String r : p.requestedPermissions) perms.put(r);
                }
                o.put("permissions", perms);

                JSArray bound = new JSArray();
                if (p.services != null) {
                    for (ServiceInfo s : p.services) {
                        if (s.permission != null) bound.put(s.permission);
                    }
                }
                o.put("bound", bound);
                out.put(o);
            }
            JSObject res = new JSObject();
            res.put("apps", out);
            call.resolve(res);
        } catch (Exception e) {
            call.reject("scan failed: " + e.getMessage());
        }
    }
}
