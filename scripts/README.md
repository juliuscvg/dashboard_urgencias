# Comprobación documental

Desde la raíz, con Node.js y sin dependencias adicionales:

```sh
node scripts/check-markdown-links.mjs
node scripts/check-baseline.mjs
```

El primer comando adapta el patrón CEX: comprueba destinos locales de enlaces Markdown inline y definiciones de referencia, incluidos archivos aún no versionados. Ignora bloques cercados de código, directorios técnicos y symlinks. No es un parser Markdown completo; no verifica disponibilidad HTTP ni fragmentos de encabezados. Los documentos del baseline usan enlaces inline sin anchors. Exit code 1 ante destinos rotos.

El segundo verifica estructura mínima, referencias fijadas y los 71 IDs/estados/motivos de adopción, además de consistencia entre JSON y matriz Markdown. No acredita SQL ni indicadores.
