# GeoGuessr Clone

Clon de GeoGuessr con multijugador online, construido con Next.js 15, Firebase Realtime Database y la API de Google Maps + Street View.

## Características

- **Single player** y **multijugador online** con códigos de sala
- 5 rondas (configurable) con temporizador por ronda
- Sistema de puntuación 0–5000 puntos por proximidad
- Modos por región: mundial, Europa, Américas, Asia
- Ajustes de dificultad: permitir/bloquear movimiento y zoom
- Sincronización en tiempo real con Firebase Realtime Database
- Autenticación anónima — los jugadores solo introducen un nombre

## Inicio rápido

1. Lee la **[guía de setup](./SETUP_GUIDE.md)** para obtener la API key de Google Maps y configurar Firebase.
2. Copia las variables de entorno:
   ```bash
   cp .env.local.example .env.local
   # edita .env.local con tus claves
   ```
3. Instala dependencias y arranca:
   ```bash
   npm install
   npm run dev
   ```
4. Abre [http://localhost:3000](http://localhost:3000).

## Estructura

```
src/
├── app/
│   ├── page.tsx                # Home: crear / unirse a sala
│   ├── solo/page.tsx           # Modo single player
│   └── room/[code]/page.tsx    # Sala multijugador
├── components/
│   ├── Lobby.tsx               # Sala de espera con ajustes
│   ├── GameView.tsx            # Pantalla de juego (Street View + mapa)
│   ├── StreetViewPanorama.tsx  # Wrapper de Google Street View
│   ├── GuessMap.tsx            # Mapa interactivo para poner el pin
│   ├── Timer.tsx               # Cuenta atrás por ronda
│   ├── RoundResults.tsx        # Resultados de la ronda
│   └── FinalScoreboard.tsx     # Marcador final
├── lib/
│   ├── firebase.ts             # Inicialización de Firebase
│   ├── room.ts                 # Crear/unirse/sincronizar salas
│   ├── locations.ts            # Pool de coordenadas con Street View
│   ├── scoring.ts              # Distancia (Haversine) y puntuación
│   ├── roomCode.ts             # Generación de códigos de sala
│   └── useGoogleMapsLoader.ts  # Hook para cargar la API
├── types/game.ts               # Tipos compartidos
└── database.rules.json         # Reglas de seguridad de Firebase RTDB
```

## Stack

- **Next.js 15** + App Router + TypeScript
- **TailwindCSS** para estilos
- **Firebase** (Auth anónima + Realtime Database)
- **@react-google-maps/api** para Street View y el mapa
- **@turf/distance** para cálculo geodésico de distancias
- **Zustand** (preparado, no usado aún — útil si añades más estado local)

## Despliegue

Para producción, recomendamos:
- **Vercel** (Next.js nativo)
- **Firebase Hosting** con Firebase App Hosting si quieres todo en Firebase

Acuérdate de añadir las variables de entorno en el panel del hosting y de restringir la API key de Google Maps al dominio de producción.

## Próximos pasos sugeridos

- Verificar dinámicamente cobertura de Street View con `StreetViewService.getPanorama` para usar coordenadas verdaderamente aleatorias
- Persistir ranking global con Firestore
- Chat en sala con Realtime Database
- PWA / instalable
- Modo "sin moverse" más estricto bloqueando el panorama
