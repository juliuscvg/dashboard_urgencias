# Validación Diagnósticos — 2026-09-10

U-ING, cohortes cerradas por Fechaing. Ingreso y Egreso son dimensiones independientes.

| Ventana | Ambos códigos | Mismo | Diferente | Sólo ingreso | Sólo egreso | Ninguno |
|---|---:|---:|---:|---:|---:|---:|
|12m|153540|142759|10781|943|776|4563|
|24m|312351|291083|21268|2606|1661|10782|
|36m|456934|424222|32712|6643|2222|18362|

Ingreso mantiene código/descripción prácticamente 1:1 (6163 códigos, 6164 pares). Egreso no: 6250 códigos y 9613 pares; 507 códigos tienen 2–4 descripciones. Además, 6257 eventos tienen `diag_egr` sin `cdiag_egr`; sus 2842 textos mezclan contenido clínico, variantes y mensajes operativos. Se preservan como texto no codificado, sin inferir CIE.

Contratos propuestos: URG-DIAG-01 ingreso codificado inicial; URG-DIAG-02 egreso codificado final; URG-DIAG-03 texto de egreso no codificado complementario; URG-DIAG-04 cobertura/comparación sin interpretación clínica. Todos EN VALIDACIÓN, sin KPI ni API/UI.