# AGENTS.md — Dashboard Urgencias

## Fuente de verdad

Git/GitHub prevalece sobre memoria de chat. Para cualquier tarea relevante:

1. `git status`
2. `git log --oneline -5`
3. leer `docs/gobierno/CHECKPOINT_ACTUAL.md`
4. leer la iteración concreta en `docs/iteraciones/ITER-XXX.md`, cuando exista
5. abrir sólo reglas/SQL/código directamente relacionados con la tarea

El protocolo transversal de agentes está en `juliuscvg/dashboard_hcg_specs/transversal/PROTOCOLO_MULTIAGENTE.md`.

## Autoridad funcional Urgencias

- Urgencias conserva sus reglas operativas y analíticas propias.
- La fuente principal es `vurgencias` salvo decisión documentada distinta.
- Los patrones técnicos, UI/UX, trazabilidad y gobierno pueden reutilizar contratos de `dashboard_hcg_specs` y aprendizajes de CEX.
- Las reglas de negocio de CEX NO se transfieren automáticamente a Urgencias.
- No cambiar definiciones de ingreso/egreso, activos, triage, atención, alta médica, reingresos, ventanas temporales o universos sin dejar la decisión documentada.

## Ahorro de tokens/contexto

- No releer todo `docs/`.
- No pegar checkpoints completos en reportes.
- Usar búsquedas dirigidas por símbolo/ruta/indicador.
- No repetir historia del proyecto dentro de cada prompt.
- Las especificaciones nuevas van en `docs/iteraciones/`.
- El cierre actualiza `CHECKPOINT_ACTUAL.md` con deltas y siguiente paso.

## Roles preferidos

- **ChatGPT:** orquestación, decisiones funcionales, especificación y revisión de commit.
- **Codex:** implementación, SQL, pruebas, refactors y rendimiento.
- **Claude Code:** auditoría/reconciliación, QA amplio y failover.

## Failover

Ante interrupción de un agente, no ejecutar `reset`, `restore`, `clean`, `checkout .`, `stash`, rebase ni pull antes de revisar `git status`, `git diff`, `git diff --cached` y `git log`. Conservar trabajo correcto y continuar, no reiniciar.

## Cierre

Toda iteración debe terminar con commit/push, validaciones aplicables y working tree limpio, salvo bloqueo explícito. Reporte final breve: resultado, validaciones, archivos, commit, push y bloqueo real si existe.
