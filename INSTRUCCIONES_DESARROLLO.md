# Instrucciones de Desarrollo

## Estilo de Código
- Usar TypeScript para todos los componentes y utilidades.
- Componentes interactivos: Usar React para la lógica compleja (Calculadoras/Forms) dentro de las Astro Islands.
- Estructura: Mantener la separación entre `/components` (UI) y `/pages` (Rutas).
- Estética: Diseño profesional y limpio (utilizar Tailwind con paleta de colores coherente).

## Gestión de Estado
- Para la calculadora de Fase 1: Usar estados locales de React (`useState`).
- Para la Fase 2: Planificar el uso de `@tanstack/react-query` para consumir la API de Supabase.

## Flujo de Trabajo (Prompts Recomendados)
Cuando necesites ayuda del IDE, usa estructuras como:
- "Basado en PROYECTO_CONTEXT.md, crea el componente de la calculadora con estas reglas: [inserta reglas]."
- "Refactoriza este componente para usar una interfaz de TypeScript definida."