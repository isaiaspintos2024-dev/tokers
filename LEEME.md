# Toker's — cómo obtener el APK para Android

Este proyecto convierte Toker's en una app Android (APK). La compilación la hace **GitHub gratis en la nube**: no hace falta instalar Android Studio ni nada en la computadora.

## La primera vez (unos 15 minutos)

1. **Creá una cuenta gratis** en <https://github.com> (si ya tenés, entrá).
2. Arriba a la derecha tocá **+ → New repository**.
   - Nombre: `tokers`
   - Elegí **Public** (así el APK se puede descargar sin iniciar sesión y compartirlo con los alumnos).
   - Tocá **Create repository**.
3. En la página nueva tocá el enlace **uploading an existing file**.
4. Descomprimí el zip en la computadora, entrá a la carpeta `tokers-apk` y **arrastrá todo su contenido** (carpetas y archivos) a la página de GitHub. Esperá a que suban y tocá **Commit changes**.
5. Andá a la pestaña **Actions**. Vas a ver "Compilar APK de Toker's" girando 🟡. Tarda unos 5–8 minutos. Cuando aparece ✅, está listo.
6. Volvé a la página principal del repositorio: a la derecha aparece **Releases → Toker's — versión 1.x**. Ahí está **Tokers.apk**.

> **Si en la pestaña Actions no aparece nada:** es porque la carpeta oculta `.github` no se subió (pasa en Mac). Solución: en **Actions** tocá **set up a workflow yourself**, borrá lo que aparece, pegá el contenido del archivo `.github/workflows/compilar-apk.yml` y tocá **Commit changes**.

## Instalar en el celular

1. Desde el celular abrí `https://github.com/TU-USUARIO/tokers/releases/latest` y tocá **Tokers.apk**.
2. Abrí el archivo descargado. Android va a pedir permiso para **instalar apps de origen desconocido**: aceptalo para el navegador (Chrome).
3. Si aparece **Play Protect** avisando que la app es desconocida, tocá **Más detalles → Instalar de todos modos**. Es normal en apps que no están en Play Store.

El mismo enlace sirve para pasárselo a los alumnos (o mandar el APK por WhatsApp).

## Para actualizar la app

Cuando cambies `www/index.html` (por ejemplo, con una versión mejorada), subilo de nuevo al repositorio con **Add file → Upload files**. GitHub compila solo un APK nuevo, que se instala **encima** del anterior sin perder los dibujos.

## Compartir con amigos

- **Android:** pasales el enlace `https://github.com/TU-USUARIO/tokers/releases/latest` o mandales el archivo **Tokers.apk** por WhatsApp. Al abrirlo, el teléfono pide permiso para "instalar apps desconocidas" y Play Protect puede avisar que la app no es de Play Store: se sigue con **Más detalles → Instalar de todos modos**.
- **iPhone (o cualquier celular, sin instalar el APK):** en el repositorio, entrá a **Settings → Pages**, en *Branch* elegí **gh-pages** y tocá **Save**. A los dos minutos la app queda en `https://TU-USUARIO.github.io/tokers/`. Tus amigos la abren y la instalan desde el navegador: en Android con **⋮ → Instalar app** y en iPhone con **Compartir → Agregar a pantalla de inicio**.
- Cada vez que GitHub compila, también guarda el APK en la rama **apk** y la versión web en la rama **gh-pages**.

## ¿Y los conversores web (subir un zip a una página)?

Sirven para probar, pero **no dejan guardar imágenes ni videos en el celular**: la app avisa con un cartel. Para guardar y tener la carpeta Documentos › Tokers, usá el APK que arma GitHub con este proyecto.

## Qué hace distinto la versión APK

- Funciona **sin internet**, desde el primer uso.
- La primera vez crea la carpeta **Documentos › Tokers** en el celular, con **Imagenes**, **Videos** y **Proyectos** adentro.
- **Exportar PNG** guarda la imagen en **Documentos › Tokers › Imagenes** y ofrece compartirla (WhatsApp, Drive, Fotos…).
- Al salir de un proyecto (☰ → 🏠 Mis proyectos) queda una copia en **Documentos › Tokers › Proyectos** (archivo .tokers).
- El **botón atrás** cierra paneles y diálogos; si no hay nada abierto, minimiza la app (no se pierde el dibujo).
- Ícono propio y pantalla de carga con el logo.
- Puede usar el **micrófono** para grabar el sonido de las animaciones (la primera vez pide permiso).
- Los videos de las animaciones se guardan en **Documentos › Tokers › Videos**.

## Contenido del proyecto

| Carpeta / archivo | Qué es |
|---|---|
| `www/` | La app Toker's (el mismo HTML que funciona en el navegador) |
| `assets/` | Ícono y pantalla de carga |
| `keystore/` | Firma de la app (no borrar: sin ella las actualizaciones no se instalan encima) |
| `scripts/patch-android.js` | Ajustes automáticos del proyecto Android |
| `.github/workflows/compilar-apk.yml` | La receta que usa GitHub para compilar |
| `capacitor.config.json`, `package.json` | Configuración de Capacitor |
