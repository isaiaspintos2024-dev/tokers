// Ajustes al proyecto Android que genera Capacitor (se ejecuta en la compilación automática).
const fs = require('fs');
const path = require('path');
const A = p => path.join(__dirname, '..', 'android', p);
const edit = (file, fn) => { const f = A(file); const before = fs.readFileSync(f, 'utf8'); const after = fn(before); fs.writeFileSync(f, after); console.log((before === after ? '= sin cambios ' : '✔ ') + file); };

// 1) Permiso para guardar dibujos en Documentos en Android 9 y 10
edit('app/src/main/AndroidManifest.xml', s => {
  if (!s.includes('WRITE_EXTERNAL_STORAGE')) {
    s = s.replace('</manifest>', '    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" android:maxSdkVersion="29" />\n</manifest>');
  }
  // Micrófono: para grabar el sonido de las animaciones
  if (!s.includes('RECORD_AUDIO')) {
    s = s.replace('</manifest>', '    <uses-permission android:name="android.permission.RECORD_AUDIO" />\n    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />\n</manifest>');
  }
  if (!s.includes('requestLegacyExternalStorage')) {
    s = s.replace('<application', '<application\n        android:requestLegacyExternalStorage="true"');
  }
  return s;
});

// 2) Pantalla de carga nativa con fondo oscuro (sin destello blanco)
edit('app/src/main/res/values/styles.xml', s => {
  if (s.includes('windowSplashScreenBackground')) return s;
  return s.replace(
    '<style name="AppTheme.NoActionBarLaunch" parent="Theme.SplashScreen">',
    '<style name="AppTheme.NoActionBarLaunch" parent="Theme.SplashScreen">\n        <item name="windowSplashScreenBackground">#0a0d0b</item>'
  );
});

// 3) Firma fija: así cada APK nuevo se puede instalar encima del anterior sin desinstalar
edit('app/build.gradle', s => {
  if (s.includes('signingConfigs')) return s;
  s = s.replace('    buildTypes {', `    signingConfigs {
        tokers {
            storeFile file('../../keystore/tokers.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
    }
    buildTypes {`);
  return s.replace(/release \{\n(\s+)minifyEnabled false/, 'release {\n$1signingConfig signingConfigs.tokers\n$1minifyEnabled false');
});

// 4) Número de versión automático, para que cada APK nuevo se instale encima del anterior
const run = parseInt(process.env.GITHUB_RUN_NUMBER || '1', 10);
edit('app/build.gradle', s => s
  .replace(/versionCode \d+/, `versionCode ${run}`)
  .replace(/versionName "[^"]*"/, `versionName "1.${run}"`));
