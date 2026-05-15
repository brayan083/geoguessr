# Guía de configuración paso a paso

Esta guía te lleva desde cero hasta tener el juego corriendo en `localhost:3000`. Necesitas dos cosas: **una API key de Google Maps** y **un proyecto Firebase**. Ambas son gratuitas para empezar.

---

## Parte 1 · Google Cloud + Maps API Key

### 1.1 Crea una cuenta y un proyecto

1. Entra en [console.cloud.google.com](https://console.cloud.google.com/).
2. Inicia sesión con tu Google. Si es la primera vez, acepta los términos.
3. Arriba a la izquierda haz clic en el selector de proyecto → **Nuevo proyecto**.
4. Ponle un nombre (ej. `geoguessr-clone`) y crea.

### 1.2 Habilita la facturación

Maps API requiere tener facturación activa, pero **Google da $200 de crédito gratuito cada mes**, suficiente para miles de cargas en desarrollo. No te cobrarán nada si no te pasas.

1. Menú lateral → **Facturación** → **Vincular una cuenta de facturación**.
2. Añade un método de pago. Es obligatorio.

### 1.3 Habilita las APIs necesarias

En el menú lateral ve a **APIs y servicios → Biblioteca** y busca y habilita:

- **Maps JavaScript API** *(obligatoria)*
- **Street View Static API** *(obligatoria)*
- **Places API** *(opcional, no se usa en esta versión pero útil si añades búsquedas)*

### 1.4 Crea la API key

1. **APIs y servicios → Credenciales → Crear credenciales → Clave de API**.
2. Cópiala. La pondrás en `.env.local` como `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`.

### 1.5 Restringe la API key (importante — evita abuso)

En la misma página, clic en la clave creada:

- **Restricciones de aplicación → Sitios web**. Añade:
  - `http://localhost:3000/*` (desarrollo)
  - `https://tudominio.com/*` (producción, cuando despliegues)
- **Restricciones de API → Restringir clave → Selecciona las 3 APIs habilitadas**.

> Sin restricciones, alguien puede robar la clave del código fuente del navegador y cargarte facturación.

---

## Parte 2 · Firebase

### 2.1 Crea un proyecto Firebase

1. Entra en [console.firebase.google.com](https://console.firebase.google.com/).
2. **Agregar proyecto**. Puedes vincularlo al proyecto de Google Cloud que creaste antes (recomendado) o crear uno nuevo.
3. Desactiva Google Analytics si solo es un proyecto de aprendizaje (más rápido).

### 2.2 Registra una app web

1. En la home del proyecto, clic en el icono **`</>`** ("Agregar app web").
2. Ponle apodo (ej. `geoguessr-web`).
3. **No** habilites Firebase Hosting aquí (lo decidiremos después).
4. Te muestra un objeto `firebaseConfig`. Cópialo entero, vas a necesitar cada campo en `.env.local`.

### 2.3 Habilita Authentication (anónima)

1. Menú lateral → **Build → Authentication → Get started**.
2. Pestaña **Sign-in method**.
3. Habilita **Anonymous** y guarda.

> Usamos auth anónima para que cada jugador tenga un UID estable sin tener que registrarse.

### 2.4 Habilita Realtime Database

1. Menú lateral → **Build → Realtime Database → Crear base de datos**.
2. Elige una región (idealmente cercana a tus jugadores).
3. Empieza en **modo de prueba** (más permisivo, lo endureceremos en el siguiente paso).
4. Una vez creada, copia la URL que aparece arriba (algo como `https://geoguessr-clone-default-rtdb.europe-west1.firebasedatabase.app`). Va en `NEXT_PUBLIC_FIREBASE_DATABASE_URL`.

### 2.5 Aplica las reglas de seguridad

1. Dentro de Realtime Database, pestaña **Reglas**.
2. Reemplaza el contenido por el del archivo `database.rules.json` de este repo.
3. Publica.

Estas reglas garantizan que:
- Solo usuarios autenticados pueden leer/escribir salas.
- Cada jugador solo puede editar su propio nodo de jugador.
- Las "guesses" no pueden modificarse una vez enviadas.

---

## Parte 3 · Variables de entorno

Copia `.env.local.example` a `.env.local` y rellena con los valores de los dos pasos anteriores:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...

NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://tu-proyecto-default-rtdb.europe-west1.firebasedatabase.app
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123:web:abc
```

> Los valores `NEXT_PUBLIC_*` se exponen al navegador. Está bien para Firebase (las reglas controlan la seguridad), pero **la API key de Google Maps DEBE estar restringida por dominio** como hicimos en el paso 1.5.

---

## Parte 4 · Instalar y arrancar

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). Si todo está bien:

1. Pon tu nombre, clic en **Crear partida** → te lleva a una sala con código.
2. Abre otra pestaña/ventana (incógnito) y únete con el código.
3. Cuando seas dos o más, el host pulsa **Empezar partida**.
4. Aparece Street View, todos ponen su pin, terminan la ronda, ven resultados, siguiente ronda...

---

## Resolución de problemas comunes

| Problema | Causa probable |
|---|---|
| `Faltan variables de entorno NEXT_PUBLIC_FIREBASE_*` | No copiaste `.env.local.example` a `.env.local` o falta algún campo. Reinicia `npm run dev` tras cambiarlo. |
| El mapa aparece pero dice "For development purposes only" o gris | API key incorrecta, no restringida correctamente, o las APIs no están habilitadas en GCP. |
| Street View no carga | Faltó habilitar **Street View Static API**, o la API key tiene restricciones de IP/dominio que no incluyen `localhost`. |
| `permission_denied` al unirse a una sala | Las reglas de Realtime Database no se han publicado. Repite paso 2.5. |
| Solo un jugador ve los cambios | Comprueba en la consola del navegador que Firebase conecta. Y revisa que ambos clientes usan la misma DB URL. |

---

## Despliegue (cuando esté listo)

**Opción A: Vercel**

```bash
npm install -g vercel
vercel
```

En el panel de Vercel, añade todas las variables `NEXT_PUBLIC_*` en *Settings → Environment Variables*. Acuérdate de añadir tu dominio Vercel a las restricciones de la API key de Google.

**Opción B: Firebase App Hosting**

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

---

## Coste estimado

Para uso personal/amigos:
- **Google Maps**: gratis hasta ~28.000 cargas de mapa/mes con el crédito de $200.
- **Firebase Realtime Database**: capa gratuita 1 GB almacenamiento, 10 GB transferencia/mes.

Para una versión pública con tráfico real, monitoriza el panel de facturación de Google Cloud y considera ponerle un tope de gasto.
