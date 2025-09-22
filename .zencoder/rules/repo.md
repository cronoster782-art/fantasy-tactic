# Repo info: fantasy-tactic

## Stack
- Framework: Next.js 15 (app router)
- React 19, TypeScript
- Auth: next-auth v5 (beta)
- Styling: CSS Modules + Tailwind 4 (postcss)

## Scripts
- dev: next dev --turbopack
- build: next build --turbopack
- start: next start
- lint: eslint

## Estructura relevante
- src/app/**: páginas (app router)
  - ajustes/page.tsx
  - enfrentamiento/[id]/page.tsx
  - otros: equipo, fichajes, liga, login, etc.
- src/services/
  - leagueService.ts: estado de liga en localStorage, alineaciones, puntuaciones
  - apiSportsService.ts: datos de jugadores en vivo
- src/players.ts: Jugadores (TODOS_LOS_JUGADORES)
- src/teams.ts: Equipos y calendario (MATCHES)
- src/rival-data.ts: Formaciones y lógica de formaciones

## Notas funcionales
- initializeLeague(): crea liga y guarda en localStorage alineaciones válidas (lineup puede contener nulls)
- getTeamRoster(): devuelve { lineup, formation, suplentes }, con fallback vacío si no hay estado
- enfrentamiento/[id]/page.tsx: renderiza 3 zonas (Defensa/Medio/Ataque) con puntuaciones aleatorias por ahora

## Sugerencias
- Añadir control de nulls al map de lineup en páginas que lo consumen
- Manejar "match no encontrado" y "liga no inicializada" en páginas de detalle
- Considerar server actions sólo donde no dependan de localStorage