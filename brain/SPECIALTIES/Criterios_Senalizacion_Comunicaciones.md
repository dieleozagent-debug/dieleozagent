* 

  Mauricio.Mora
  Diego Leonardo Zuñiga Samboni
  2
  1320
  2026-04-24T18:22:00Z
  2026-04-24T18:22:00Z
  34
  10390
  57149
  476
  134
  67405
  16.00

  Clean
  Clean

  false

  21

  false
  false
  false

  ES-CO
  JA
  AR-SA

CONTRATO
DE CONCESIÓN BAJO EL ESQUEMA DE APP No. 001 DE 2025

BASES,
PARÁMETROS Y CRITERIOS DE DISEÑO PARA SISTEMA DE SEÑALIZACIÓN, CONTROL DE
TRÁFICO Y COMUNICACIONES

VERSIÓN No. 001

Bogotá D.C., abril de 2026

CONTROL DE
  REVISIONES

Versión

Modificaciones

Fecha

001

Entrega Inicial

04/2026

REGISTRO DE
  FIRMAS

Versión

Elaborado por

Revisado por

Revisado por

No Objetado por

Ardanuy Colombia

LFC

Interventoría

001

Pedro Acosta Zhandra Aguiño Armando Flores Argenis Ruiz

Stephanie G Cruz

Luis Lozano

Luis Guillermo Duarte

TABLA DE CONTENIDO

TOC \o &quot;1-4&quot; \z
 \u \h1.     INTRODUCCIÓN........................................................................................ PAGEREF _Toc20867229 \h2
  08D0C9EA79F9BACE118C8200AA004BA90B02000000080000000D0000005F0054006F006300320030003800360037003200320039000000

1.1.  Propósito
 del documento............................................................................................. PAGEREF _Toc800273947 \h3
  08D0C9EA79F9BACE118C8200AA004BA90B02000000080000000E0000005F0054006F0063003800300030003200370033003900340037000000

1.2.  Alcance del
 Sistema..................................................................................................... PAGEREF _Toc932354774 \h3
  08D0C9EA79F9BACE118C8200AA004BA90B02000000080000000E0000005F0054006F0063003900330032003300350034003700370034000000

1.3.  Principio
 fundamental de diseño: Arquitectura PTC con cantonamiento virtual........... PAGEREF _Toc652782305 \h4
  08D0C9EA79F9BACE118C8200AA004BA90B02000000080000000E0000005F0054006F0063003600350032003700380032003300300035000000

2.     MARCO
 CONTRACTUAL.............................................................................. PAGEREF _Toc658875074 \h5
  08D0C9EA79F9BACE118C8200AA004BA90B02000000080000000E0000005F0054006F0063003600350038003800370035003000370034000000

2.1.  Jerarquía
 normativa aplicable....................................................................................... PAGEREF _Toc760423541 \h5
  08D0C9EA79F9BACE118C8200AA004BA90B02000000080000000E0000005F0054006F0063003700360030003400320033003500340031000000

3.     DESCRIPCIÓN
 DEL PROYECTO................................................................... PAGEREF _Toc1574324465 \h11
  08D0C9EA79F9BACE118C8200AA004BA90B02000000080000000F0000005F0054006F00630031003500370034003300320034003400360035000000

3.1.  Corredor La
 Dorada – Chiriguaná................................................................................ PAGEREF _Toc1630440279 \h11
  08D0C9EA79F9BACE118C8200AA004BA90B02000000080000000F0000005F0054006F00630031003600330030003400340030003200370039000000

3.2.  Localización............................................................................................................... PAGEREF _Toc1818002905 \h11
  08D0C9EA79F9BACE118C8200AA004BA90B02000000080000000F0000005F0054006F00630031003800310038003000300032003900300035000000

3.3.  Sectorización
 por Unidades Funcionales.................................................................... PAGEREF _Toc1999769270 \h13
  08D0C9EA79F9BACE118C8200AA004BA90B02000000080000000F0000005F0054006F00630031003900390039003700360039003200370030000000

3.4.  Despliegue
 modular................................................................................................... PAGEREF _Toc2098407170 \h14
  08D0C9EA79F9BACE118C8200AA004BA90B02000000080000000F0000005F0054006F00630032003000390038003400300037003100370030000000

4.     FILOSOFÍA
 DE DISEÑO: ARQUITECTURA PTC CON CANTONAMIENTO VIRTUAL...... PAGEREF _Toc1561167230 \h14
  08D0C9EA79F9BACE118C8200AA004BA90B02000000080000000F0000005F0054006F00630031003500360031003100360037003200330030000000

4.1.  Fundamento
 contractual............................................................................................ PAGEREF _Toc1493258497 \h14
  08D0C9EA79F9BACE118C8200AA004BA90B02000000080000000F0000005F0054006F00630031003400390033003200350038003400390037000000

4.1.1.        Componentes
 de la Arquitectura PTC con cantonamiento virtual................... PAGEREF _Toc814714836 \h16
  08D0C9EA79F9BACE118C8200AA004BA90B02000000080000000E0000005F0054006F0063003800310034003700310034003800330036000000

4.1.1.1.   Equipo
 Embarcado (Onboard).................................................. PAGEREF _Toc1709933500 \h16
  08D0C9EA79F9BACE118C8200AA004BA90B02000000080000000F0000005F0054006F00630031003700300039003900330033003500300030000000

4.1.1.2.   Centro
 de Control (Back Office)................................................ PAGEREF _Toc818686446 \h17
  08D0C9EA79F9BACE118C8200AA004BA90B02000000080000000E0000005F0054006F0063003800310038003600380036003400340036000000

4.1.1.3.   Infraestructura
 en Vía (Wayside)............................................... PAGEREF _Toc954175645 \h17
  08D0C9EA79F9BACE118C8200AA004BA90B02000000080000000E0000005F0054006F0063003900350034003100370035003600340035000000

4.1.1.4.   Sistema
 de Comunicaciones................................................... PAGEREF _Toc1309140520 \h18
  08D0C9EA79F9BACE118C8200AA004BA90B02000000080000000F0000005F0054006F00630031003300300039003100340030003500320030000000

5.     CRITERIOS
 DEL SISTEMA DE CONTROL DE TRENES PTC CON CANTONAMIENTO VIRTUAL PAGEREF _Toc681166664 \h18
  08D0C9EA79F9BACE118C8200AA004BA90B02000000080000000E0000005F0054006F0063003600380031003100360036003600360034000000

5.1.  Funcionalidades
 obligatorias...................................................................................... PAGEREF _Toc1192675069 \h18
  08D0C9EA79F9BACE118C8200AA004BA90B02000000080000000F0000005F0054006F00630031003100390032003600370035003000360039000000

5.2.  Subsistema
 embarcado.............................................................................................. PAGEREF _Toc1356019353 \h19
  08D0C9EA79F9BACE118C8200AA004BA90B02000000080000000F0000005F0054006F00630031003300350036003000310039003300350033000000

5.2.1.        Computador
 PTC............................................................................................. PAGEREF _Toc1721846550 \h19
  08D0C9EA79F9BACE118C8200AA004BA90B02000000080000000F0000005F0054006F00630031003700320031003800340036003500350030000000

5.2.2.        Sistema
 de posicionamiento y detección........................................................ PAGEREF _Toc582840635 \h20
  08D0C9EA79F9BACE118C8200AA004BA90B02000000080000000E0000005F0054006F0063003500380032003800340030003600330035000000

5.2.3.        Interfaz
 del Maquinista (DMI)........................................................................... PAGEREF _Toc2107757045 \h20
  08D0C9EA79F9BACE118C8200AA004BA90B02000000080000000F0000005F0054006F00630032003100300037003700350037003000340035000000

5.3.  Subsistema
 Central (Back Office)............................................................................... PAGEREF _Toc978283233 \h21
  08D0C9EA79F9BACE118C8200AA004BA90B02000000080000000E0000005F0054006F0063003900370038003200380033003200330033000000

6.     CRITERIOS
 DEL SISTEMA DE TELECOMUNICACIONES...................................... PAGEREF _Toc885312330 \h21
  08D0C9EA79F9BACE118C8200AA004BA90B02000000080000000E0000005F0054006F0063003800380035003300310032003300330030000000

6.1.  Fibra
 Óptica (Backbone y Acceso).............................................................................. PAGEREF _Toc516556460 \h22
  08D0C9EA79F9BACE118C8200AA004BA90B02000000080000000E0000005F0054006F0063003500310036003500350036003400360030000000

6.1.1.        Obras
 civiles y tendido..................................................................................... PAGEREF _Toc1794273156 \h22
  08D0C9EA79F9BACE118C8200AA004BA90B02000000080000000F0000005F0054006F00630031003700390034003200370033003100350036000000

6.2.  Radio Tetra
 (Voz Operativa y Datos de Explotación).................................................... PAGEREF _Toc2001670732 \h23
  08D0C9EA79F9BACE118C8200AA004BA90B02000000080000000F0000005F0054006F00630032003000300031003600370030003700330032000000

6.2.1.        Infraestructura
 y obra civil:.............................................................................. PAGEREF _Toc1348090339 \h23
  08D0C9EA79F9BACE118C8200AA004BA90B02000000080000000F0000005F0054006F00630031003300340038003000390030003300330039000000

6.2.2.        Especificaciones
 para Configuración y lineamientos de puesta en marcha.... PAGEREF _Toc701117805 \h23
  08D0C9EA79F9BACE118C8200AA004BA90B02000000080000000E0000005F0054006F0063003700300031003100310037003800300035000000

6.2.3.        Sistema
 de Redundancia................................................................................. PAGEREF _Toc846490547 \h24
  08D0C9EA79F9BACE118C8200AA004BA90B02000000080000000E0000005F0054006F0063003800340036003400390030003500340037000000

6.2.4.        Especificaciones
 para Pruebas y aceptación................................................... PAGEREF _Toc1358088080 \h24
  08D0C9EA79F9BACE118C8200AA004BA90B02000000080000000F0000005F0054006F00630031003300350038003000380038003000380030000000

7.     CRITERIOS
 DEL CENTRO DE CONTROL DE OPERACIONES (CCO)........................ PAGEREF _Toc913528778 \h24
  08D0C9EA79F9BACE118C8200AA004BA90B02000000080000000E0000005F0054006F0063003900310033003500320038003700370038000000

7.1.  Ubicación y
 Funciones............................................................................................... PAGEREF _Toc1624743990 \h24
  08D0C9EA79F9BACE118C8200AA004BA90B02000000080000000F0000005F0054006F00630031003600320034003700340033003900390030000000

7.2.  Filosofía
 CTC.............................................................................................................. PAGEREF _Toc314146702 \h25
  08D0C9EA79F9BACE118C8200AA004BA90B02000000080000000E0000005F0054006F0063003300310034003100340036003700300032000000

7.3.  Redundancia
 y Alta Disponibilidad............................................................................. PAGEREF _Toc1585880276 \h26
  08D0C9EA79F9BACE118C8200AA004BA90B02000000080000000F0000005F0054006F00630031003500380035003800380030003200370036000000

7.4.  Interfaz
 Hombre-Máquina (HMI)................................................................................. PAGEREF _Toc349335091 \h26
  08D0C9EA79F9BACE118C8200AA004BA90B02000000080000000E0000005F0054006F0063003300340039003300330035003000390031000000

8.     CRITERIOS
 DE PASOS A NIVEL.................................................................... PAGEREF _Toc1025638735 \h26
  08D0C9EA79F9BACE118C8200AA004BA90B02000000080000000F0000005F0054006F00630031003000320035003600330038003700330035000000

8.1.  Alcance...................................................................................................................... PAGEREF _Toc1577051064 \h27
  08D0C9EA79F9BACE118C8200AA004BA90B02000000080000000F0000005F0054006F00630031003500370037003000350031003000360034000000

8.2.  Clasificación
 de Pasos a Nivel.................................................................................... PAGEREF _Toc827443624 \h27
  08D0C9EA79F9BACE118C8200AA004BA90B02000000080000000E0000005F0054006F0063003800320037003400340033003600320034000000

8.2.1.        Pasos
 a Nivel Tipo B......................................................................................... PAGEREF _Toc1872598943 \h27
  08D0C9EA79F9BACE118C8200AA004BA90B02000000080000000F0000005F0054006F00630031003800370032003500390038003900340033000000

8.2.2.        Pasos
 a Nivel Tipo C......................................................................................... PAGEREF _Toc1696902302 \h27
  08D0C9EA79F9BACE118C8200AA004BA90B02000000080000000F0000005F0054006F00630031003600390036003900300032003300300032000000

8.3.  Detección y
 activación............................................................................................... PAGEREF _Toc577837093 \h27
  08D0C9EA79F9BACE118C8200AA004BA90B02000000080000000E0000005F0054006F0063003500370037003800330037003000390033000000

8.4.  Controlador
 local de paso a nivel............................................................................... PAGEREF _Toc186888784 \h28
  08D0C9EA79F9BACE118C8200AA004BA90B02000000080000000E0000005F0054006F0063003100380036003800380038003700380034000000

8.5.  Normatividad
 aplicable.............................................................................................. PAGEREF _Toc57751511 \h28
  08D0C9EA79F9BACE118C8200AA004BA90B02000000080000000D0000005F0054006F006300350037003700350031003500310031000000

9.     INTEROPERABILIDAD
 CON FENOCO............................................................ PAGEREF _Toc1516330170 \h28
  08D0C9EA79F9BACE118C8200AA004BA90B02000000080000000F0000005F0054006F00630031003500310036003300330030003100370030000000

9.1.  Definición
 de Interoperabilidad.................................................................................. PAGEREF _Toc713864231 \h29
  08D0C9EA79F9BACE118C8200AA004BA90B02000000080000000E0000005F0054006F0063003700310033003800360034003200330031000000

9.2.  Procedimiento
 Operacional: Stop & Switch................................................................ PAGEREF _Toc2118762991 \h29
  08D0C9EA79F9BACE118C8200AA004BA90B02000000080000000F0000005F0054006F00630032003100310038003700360032003900390031000000

9.3.  Configuración
 de Equipos Embarcados...................................................................... PAGEREF _Toc489246883 \h29
  08D0C9EA79F9BACE118C8200AA004BA90B02000000080000000E0000005F0054006F0063003400380039003200340036003800380033000000

10.   ALIMENTACIÓN
 ELÉCTRICA A LOS EQUIPOS DE SEÑALIZACIÓN Y COMUNICACIONES FERROVIARIAS          PAGEREF _Toc63011054 \h30
  08D0C9EA79F9BACE118C8200AA004BA90B02000000080000000D0000005F0054006F006300360033003000310031003000350034000000

10.1 Enclavamientos electrónicos..................................................................................... PAGEREF _Toc1099881428 \h30
  08D0C9EA79F9BACE118C8200AA004BA90B02000000080000000F0000005F0054006F00630031003000390039003800380031003400320038000000

10.2 Equipos de control PTC fuera de las zonas de
 enclavamiento (si existen).................. PAGEREF _Toc875473812 \h30
  08D0C9EA79F9BACE118C8200AA004BA90B02000000080000000E0000005F0054006F0063003800370035003400370033003800310032000000

10.3 Equipos de control en los Pasos a nivel con
 protección............................................. PAGEREF _Toc195126924 \h31
  08D0C9EA79F9BACE118C8200AA004BA90B02000000080000000E0000005F0054006F0063003100390035003100320036003900320034000000

10.4 Centro de Control de Operaciones (CCO).................................................................. PAGEREF _Toc904459079 \h31
  08D0C9EA79F9BACE118C8200AA004BA90B02000000080000000E0000005F0054006F0063003900300034003400350039003000370039000000

10.5 Equipos del sistema TETRA........................................................................................ PAGEREF _Toc1845547869 \h31
  08D0C9EA79F9BACE118C8200AA004BA90B02000000080000000F0000005F0054006F00630031003800340035003500340037003800360039000000

10.6   Servicios
 Auxiliares (CCTV, SCADA, alarmas):.......................................................... PAGEREF _Toc1729776278 \h31
  08D0C9EA79F9BACE118C8200AA004BA90B02000000080000000F0000005F0054006F00630031003700320039003700370036003200370038000000

LISTA
DE FIGURAS

 TOC \h \z \c &quot;Figura&quot; Figura 1. Concesión Línea
Férrea Central...............................................................................  PAGEREF _Toc227847257 \h 15
 08D0C9EA79F9BACE118C8200AA004BA90B02000000080000000E0000005F0054006F0063003200320037003800340037003200350037000000

LISTA DE TABLAS 

 TOC \h \z \c &quot;Tabla&quot; Tabla 1. Listado de
Municipios que hacen parte del corredor del Proyecto. 
PAGEREF _Toc227847262 \h 14
 08D0C9EA79F9BACE118C8200AA004BA90B02000000080000000E0000005F0054006F0063003200320037003800340037003200360032000000

Tabla 2. Arquitectura Funcional del Sistema. 17

# 1.                 
INTRODUCCIÓN

## 1.1.           
Propósito del documento

Este documento
tiene por propósito establecer los criterios técnicos, funcionales y normativos
que regirán el desarrollo del diseño de detalle del Sistema de Señalización,
control de tráfico y comunicaciones del Corredor Férreo La Dorada – Chiriguaná,
en el marco del Contrato de Concesión APP No. 001 de 2025 y sus Apéndices
Técnicos. Su alcance se limita a definir una base preliminar de diseño del
sistema, su arquitectura general, sus principios de operación y criterios de
cumplimiento aplicables al subsistema de control de trenes, al Centro de
Control de Operaciones, a las comunicaciones requeridas para la señalización, a
la protección de pasos a nivel y la interoperabilidad con la red de FENOCO. 

El documento
orienta el sistema hacia una arquitectura de Positive Train Control (PTC) con cantonamiento virtual, conforme a
la exigencia contractual basada en la FRA 49 CFR Part 236, Subpart I (2026),
complementada por la FRA 49 CFR Part 213 (2026), el AREMA Manual for Railway
Engineering (2021) y el AREMA Communications & Signals Manual (2021), como
marco técnico principal para el sistema de señalización y control de trenes.
Para la demostración de seguridad, el desarrollo, la verificación y la
validación del sistema PTC, se adoptan como normas principales y obligatorias las
disposiciones de la FRA 49 CFR Part 236, Subpart I (2026), en particular los §§
236.1005, 236.1009, 236.1013, 236.1015 y 236.1017, que regulan las funciones
obligatorias del sistema, los requisitos procedimentales, el PTC Development
Plan (PTCDP), el PTC Safety Plan (PTCSP), la certificación del sistema y la
verificación y validación independiente cuando esta sea requerida por la FRA.
Para los elementos que deban desarrollarse en territorio colombiano, se
aplicará además la normativa nacional obligatoria pertinente, en particular el
RETIE 2024, la NSR-10 (Decreto 926 de 2010 y sus modificaciones), la NTC
4741:1999 y el Manual de Señalización Vial de Colombia, adoptado mediante la
Resolución 20243040045005 de 2024 e incorporado como Anexo 76 de la Resolución
20223040045295 de 2022. 

El documento no constituye diseño constructivo ni reemplaza la
ingeniería de detalle. En consecuencia, no define cantidades finales,
localización exacta de equipos, rutas definitivas, coberturas, memorias de
cálculo, planos constructivos, protocolos de prueba ni especificaciones de
instalación.

## 1.2.           
Alcance del Sistema

El sistema de señalización a desarrollar para
el Corredor Férreo La Dorada–Chiriguaná se establecerá bajo una arquitectura de
Positive Train Control (PTC) con cantonamiento virtual en los tramos de vía
sencilla del corredor y con
cantonamiento físico en las cinco zonas operativas exigidas en el Apéndice Técnico I que serán controladas
por enclavamientos electrónicos: La Dorada–México, Puerto Berrío–Grecia,
Barrancabermeja, García Cadena y Zapatosa, encargados de asegurar las rutas
mediante lógica segura, verificar las condiciones de liberación y ocupación de
vía, comandar señales y cambiavías motorizados, y permitir, cuando aplique, la
transferencia controlada a operación local en caso de contingencia,
mantenimiento o pérdida de comunicación con el Centro de Control de Operaciones
(CCO). Esta solución se adopta para un corredor ferroviario de aproximadamente
526,133 km, en trocha de 914 mm, destinado principalmente al transporte de
carga, operado en vía única con apartaderos en estaciones y con conexión en su
extremo norte con la red de FENOCO en Chiriguaná. 

Su alcance comprende la definición de los
criterios funcionales, técnicos y normativos que deberán regir el desarrollo de
la ingeniería de detalle de los siguientes elementos del sistema:

a)      El sistema de control de trenes PTC con
cantonamiento virtual, incluyendo sus funciones de supervisión, protección y
autorización de movimiento, bajo norma FRA 49 CFR Part 236 Subpart I (2026).

b)      Cinco enclavamientos que se ubicarán en las
estaciones, La Dorada–México, Puerto Berrío–Grecia, Barrancabermeja, García
Cadena y Zapatosa.

c)      El Centro de Control de Operaciones (CCO),
como instancia central de supervisión, control y gestión de las autorizaciones
de movimiento.

d)      Las comunicaciones requeridas para la
operación del sistema de señalización, limitadas a la red de transmisión
necesaria para soportar el intercambio de información entre el CCO, los equipos
embarcados y los enclavamientos.

e)      Los pasos a nivel que requieran protección
activa e integración con la lógica de operación del sistema.

f)       
La
alimentación de energía y su redundancia de todo el equipamiento asociado al
proyecto. 

g)       Interoperabilidad estrictamente operacional con
la red de FENOCO en Chiriguaná, en los términos definidos por el Contrato y por
los criterios aquí establecidos.

Para efectos del presente documento, el
sistema se concibe sobre una arquitectura compuesta por: equipos embarcados
PTC, servidor o subsistema central de control en el CCO, red lineal de fibra
óptica como backbone principal de transporte de datos, sistema de radio TETRA
como medio de comunicación operacional  de soporte al sistema, y controladores
locales de pasos a nivel cuando resulten aplicables.

## 1.3.           
Principio fundamental de diseño: Arquitectura
PTC con cantonamiento virtual

El principio fundamental de diseño del
Sistema de Señalización del Corredor Férreo La Dorada–Chiriguaná es la
implementación de una arquitectura de Positive Train Control (PTC) con
cantonamiento virtual, complementada con cantonamiento físico en los puntos
operativos definidos en el Apéndice Técnico 1 que, por su complejidad funcional
y requerimientos de explotación, requieren control local seguro de rutas,
señales y cambiavías. Esta arquitectura se adopta en concordancia con la
exigencia contractual de desarrollar un sistema de control de tráfico basado en
la FRA 49 CFR Part 236, Subpart I (2026), complementada por la FRA 49 CFR Part
213 (2026), y con los criterios técnicos establecidos en el AREMA Manual for
Railway Engineering (2021) y el AREMA Communications & Signals Manual (2021).

Bajo esta filosofía, el control del
movimiento de los trenes en los tramos intermedios del corredor se fundamenta
en la determinación y supervisión de autoridades de movimiento emitidas desde
un sistema central, con soporte en equipos embarcados, posicionamiento del
tren, comunicaciones seguras y lógica de protección automática. En los puntos
operativos críticos definidos para la solución del proyecto, el sistema se
complementará con enclavamientos electrónicos, a fin de asegurar el
establecimiento de rutas, el control de movimientos incompatibles y la
posibilidad de operación local en condición degradada o ante contingencias de
comunicación con el Centro de Control de Operaciones (CCO). Fuera de estas
zonas, los desvíos que no requieran enclavamiento completo podrán resolverse
mediante desvíos libres. 

Como parte de esta
arquitectura, el sistema dispondrá de una red troncal lineal de fibra óptica
enterrada, un subsistema de radiocomunicaciones TETRA, y una redundancia
mediante red satelital, como soporte para las comunicaciones operacionales
requeridas por el Sistema de Señalización y Control.

En consecuencia, la arquitectura PTC con
cantonamiento virtual, se adopta como criterio rector de diseño, por cuanto
permite concentrar la infraestructura física de señalización únicamente en los
puntos donde resulta técnica y operacionalmente necesaria, manteniendo en el
resto del corredor una solución centralizada, escalable y compatible con la
operación ferroviaria de carga prevista en el Contrato. Este principio deberá
desarrollarse en la ingeniería de detalle de conformidad con la FRA 49 CFR Part
236, Subpart I (2026), la FRA 49 CFR Part 213 (2026), el AREMA Manual for
Railway Engineering (2021), el AREMA Communications and Signals Manual (2021) y
las demás normas expresamente adoptadas en este documento, sin que ello
implique, por sí mismo, la definición de configuraciones constructivas,
cantidades de obra o soluciones propietarias específicas.

# 2.                 
MARCO CONTRACTUAL

## 2.1.           
Jerarquía normativa aplicable

Definir la
jerarquía de la normativa aplicable tiene por objeto establecer el orden de
referencia y aplicación que deberá observarse durante el desarrollo de la
ingeniería de detalle, la definición de soluciones técnicas y la posterior
elaboración de documentos del Sistema de Señalización del Corredor Férreo La
Dorada–Chiriguaná. Su finalidad es servir como criterio rector para el ensamble
del proyecto en adelante, asegurando consistencia técnica, trazabilidad
contractual y uniformidad en la toma de decisiones de diseño.

En
consecuencia, el presente documento se interpreta y aplica en concordancia con
el Contrato de Concesión APP No. 001 de 2025 y sus Apéndices Técnicos. Cuando
exista contradicción entre disposiciones, criterios, normas o referencias
técnicas, prevalecerá el instrumento de mayor jerarquía conforme al siguiente
orden: 

(i)                 
el Contrato de Concesión y sus documentos
contractuales prevalentes; 

(ii)               
el Apéndice Técnico 1 (AT1), en lo relativo al
alcance del Proyecto, características del corredor, requerimientos del sistema
y condiciones funcionales exigidas; 

(iii)              
el Apéndice Técnico 3 (AT3), en lo relativo a
especificaciones técnicas generales, criterios de diseño y marco normativo
aplicable para los Estudios de Detalle; 

(iv)              
el presente Documento de Bases y Criterios de
Diseño, como guía rectora para el desarrollo del diseño del Sistema de
Señalización; y 

(v)                
las normas y estándares técnicos expresamente
adoptados en este documento, en el orden de prelación aquí definido. 

Para el Sistema de Señalización, y en
atención a la exigencia contractual de una solución de control de trenes basada
en estándares FRA para sistemas tipo Positive Train Control (PTC), la
referencia técnica principal será la normativa ferroviaria norteamericana
aplicable al sistema, en particular la FRA 49 CFR Part 236, Subpart I (2026),
complementada por la FRA 49 CFR Part 213 (2026), el AREMA Manual for Railway
Engineering (2021) y el AREMA Communications and Signals Manual (2021). 

Para la demostración de seguridad, el
desarrollo, la verificación, la validación y las comunicaciones relacionadas
con funciones seguras del sistema PTC, se adoptan como normas principales y
obligatorias las disposiciones de la FRA 49 CFR Part 236, Subpart I (2026), en
particular los §§ 236.1005, 236.1009, 236.1011, 236.1013, 236.1015 y 236.1017,
así como los Apéndices C, D, E y F a la Parte 236, por cuanto establecen las
funciones obligatorias del sistema, los requisitos procedimentales, el PTC
Implementation Plan (PTCIP), el PTC Development Plan (PTCDP), el PTC Safety
Plan (PTCSP), la certificación del sistema, los procesos de verificación y
validación y la revisión independiente cuando sea requerida por la FRA, así
como los criterios aplicables a la interfaz hombre-máquina. De igual forma,
para los componentes e instalaciones que deban ejecutarse en territorio
colombiano, serán de aplicación las disposiciones nacionales obligatorias
pertinentes, incluyendo, según corresponda, el RETIE modificado mediante la
Resolución 40117 de 2024, el RETILAP modificado mediante la Resolución 40150 de
2024, la NSR-10 adoptada mediante el Decreto 926 de 2010 y sus modificaciones,
la NTC 4741:1999 y el Manual de Señalización Vial de Colombia,
adoptado mediante la Resolución 20243040045005 de 2024 e incorporado como Anexo
76 de la Resolución 20223040045295 de 2022.

En caso de que
dos o más normas del mismo nivel establezcan requisitos diferentes sobre una
misma materia, se aplicará de manera estricta la regla de desempate estipulada
en el AT3 (Capítulo I, literal c): AREMA > FRA > AAR > UIC. Ante
cualquier contradicción residual, el desarrollo de la ingeniería de
detalle deberá adoptar la disposición que resulte más restrictiva o segura,
siempre que sea compatible con el Contrato de Concesión, con los Apéndices
Técnicos y con la arquitectura general definida en este documento. Cuando la
diferencia normativa implique impactos en alcance, costo, plazo, interfaces o
configuración del sistema, dicha situación deberá ser tratada en la fase
correspondiente de diseño de detalle y gestión contractual, sin que el presente
documento se interprete como aprobación anticipada de soluciones específicas.

En
consecuencia, la presente jerarquía normativa constituye una regla de
gobernanza técnica del diseño, destinada a orientar el desarrollo coherente del
proyecto en sus etapas posteriores, evitando referencias genéricas,
ambigüedades interpretativas o decisiones aisladas que se aparten del marco
contractual y del principio fundamental de diseño adoptado para el sistema.

La siguiente relación corresponde a las
normas expresamente adoptadas para el sistema:

Normativa principal del sistema de control y
señalización

 FRA 49 CFR Part 236, Subpart I (2026) – Positive
     Train Control Systems 

 * FRA 49 CFR Part 213 (2026) – Track Safety Standards 

 * AREMA Manual for Railway Engineering
     (2021) 

 * AREMA Communications and Signals
     Manual (2021) 

 * AAR
     Manual of Standards and Recommended Practices año 2022(en la sección y
     edición aplicable según el subsistema o equipo correspondiente) 

Normativa técnica aplicable a
telecomunicaciones del sistema

Las siguientes normas y especificaciones se
adoptan como referencia técnica y/o de cumplimiento:

 * ETSI EN 300 392-2 V3.8.1 (2016-08) — TETRA
     V+D – Air Interface. 

 * ETSI EN 300 396-3 V1.3.1 (2006-08) — TETRA
     DMO – Mobile Station to Mobile Station (MS-MS) Air Interface Protocol.

 * ETSI EN 300 395-1 V1.2.0 (2004-09) — TETRA – Speech codec for full-rate
     traffic channel – Part 1: General description of speech functions. 

 * ETSI EN
     300 392-5 V2.7.1 (2020-04) — TETRA – Peripheral
     Equipment Interface
     (PEI). 

 * ETSI EN
     300 392-7 V3.5.1 (2020) — TETRA – Security. 

 * ETSI EN 300 394-1 V3.3.1 (2015-04) — TETRA
     – Conformance testing specification – Part 1: Radio. 

 * EN IEC
     62368-1:2024+A11:2024 — Seguridad de equipos de tecnologías de la
     información y las comunicaciones. 

 * EN
     45545-2:2020+A1:2023 — Protección contra incendios en vehículos
     ferroviarios. 

 * EN
     50159 Categoría 3. Trasmisión de datos a través de redes abiertas no
     controladas.

 * ITU-T
     G.652 (08/2024), subcategoría G.652.D — Características de fibra y cable
     óptico monomodo. 

 * Telcordia
     GR-20-CORE, Issue 2 — Requisitos genéricos para fibra óptica y cable OSP. 

 * ANSI/TIA-598-D-2014
     — Código de colores para cables y fibras ópticas. 

 * ADIF
     NAT 405, 2ª Edición, enero de 2021 — Requisitos funcionales para el
     sistema de telefonía de explotación. 

 * ADIF
     NAT 716, 1ª Edición, noviembre de 1976 — Instalación de líneas aéreas de
     comunicaciones. 

 * ADIF ET
     03.366.780.9, ED7M1, febrero de 2022 — Cables de fibra óptica monomodo
     multifibra. 

 * ADIF ET
     03.366.752.8, 1ª Edición + M1, junio de 2024 — Conjuntos de conexión
     óptica. 

Nota: Las referencias ADIF se
emplean como guía de buenas prácticas de explotación y construcción; su
adopción se armoniza con el marco regulatorio colombiano (MinTIC/CRC/ANE).

Para las comunicaciones redundantes
de acceso al tren, se adopta el estándar EN 50159 Categoría 3. Este estándar
permite y garantiza la seguridad (Safety) en la transmisión de datos a través
de redes abiertas y no controladas —tales como la conectividad Satelital
LEO/GEO y las redes celulares públicas GSM/LTE— mediante la implementación de
defensas criptográficas lógicas a bordo de la locomotora.

Normativa nacional aplicable en territorio
colombiano

·        
RETIE 2024 —
Expedido mediante la Resolución 40117 del 2 de abril de 2024 — Reglamento
Técnico de Instalaciones Eléctricas. 

·        
RETILAP 2024
— Expedido mediante la Resolución 40150 del 3 de mayo de 2024 — Reglamento
Técnico de Iluminación y Alumbrado Público. 

·        
NSR-10
(2010) — Reglamento Colombiano de Construcción Sismo Resistente, adoptado
mediante el Decreto 926 de 2010 y sus modificaciones. 

·        
NTC
4741:1999 — Especificaciones técnicas para la señalización de vías férreas.
Pasos a nivel. 

·        
Manual de
Señalización Vial de Colombia (2024) — Adoptado mediante la Resolución
20243040045005 de 2024 e incorporado como Anexo 76 de la Resolución
20223040045295 de 2022, con fe de erratas de 2025. 

La FRA 49 CFR Part 213 (2026) se adopta como
referencia para las condiciones de operación de la infraestructura férrea que
impactan el sistema de señalización, particularmente en lo relativo a
restricciones operativas, velocidades aplicables y parámetros de vía que deben
ser considerados dentro de la lógica funcional del sistema de control de
trenes. 

El AREMA Manual for Railway Engineering
(2021) se adopta como referencia de ingeniería ferroviaria para el desarrollo
de criterios de diseño, interfaces con la infraestructura, implantación de
subsistemas y criterios generales aplicables al ensamblaje técnico del
proyecto. Su función dentro de este documento es servir como marco de
referencia para el desarrollo posterior de la ingeniería, sin reemplazar el
carácter rector del Contrato y de los Apéndices Técnicos. 

El AREMA Communications and Signals Manual
(2021) se adopta como referencia específica para los sistemas de comunicaciones
y señalización ferroviaria, incluyendo criterios asociados a mando y control,
señalización en campo, transmisión de datos, principios de seguridad de
operación y criterios funcionales de subsistemas de control. En este proyecto,
su aplicación se enfoca en orientar el desarrollo técnico del sistema de
señalización y sus interfaces. 

El AAR Manual of Standards and Recommended
Practices 2022, en la sección, documento y edición aplicables según el
subsistema o equipo correspondiente, podrá emplearse como referencia
complementaria para aspectos de compatibilidad e interfaz con el material
rodante, así como para prácticas recomendadas aplicables a equipos
ferroviarios, siempre que su aplicación no contradiga la normativa principal
FRA/AREMA ni el marco contractual del Proyecto. 

Las normas ETSI aplicables al sistema de
radio TETRA, expresamente adoptadas en este documento, se emplearán como
referencia para las comunicaciones de voz y datos que soportan la operación
ferroviaria y las funciones asociadas al sistema de señalización. Entre ellas
se incluyen, según corresponda, ETSI EN 300 392-2 V3.8.1 (2016-08), ETSI EN 300
396-3 V1.3.1 (2006-08), ETSI EN 300 395-1 V1.2.0 (2004-09), ETSI EN 300 392-5
V2.7.1 (2020-04), ETSI EN 300 392-7 V3.5.1 (2019-07) y ETSI EN 300 394-1 V3.3.1
(2015-04). 

Normativa aplicable a la red de transmisión
de datos, gestión de tráfico IP y compatibilidad electromagnética

Para el diseño, configuración y despliegue de
los equipos activos de la red de transmisión de datos del sistema, se adoptan
como referencia las normas IEEE y EMC expresamente incorporadas en el AT3 para
sistemas de redes de voz y datos y para sistemas internos asociados a red de
transmisión de datos. En consecuencia, se aplicará el siguiente catálogo
normativo: 

 * IEEE 1100-2005 — Recommended Practice
     for Powering and Grounding Electronic Equipment. 

 * IEEE 802.3z-1998 — Gigabit Ethernet
     protocol over Fiber Optic. 

 * IEEE 802.3u-1995 — Fast Ethernet
     Protocol. 

 * IEEE 802.3af-2003 — Power over
     Ethernet (PoE). 

 * IEEE 802.3an-2006 — 10G BASE-T (Ethernet 10 Gbit/s – UTP cable). 

 * IEEE 802.3x-1997 — Ethernet, Fast-Ethernet y Gigabit-Ethernet / Full duplex and flow
     control. 

 * IEEE 802.1Q-2022 — VLAN Ethernet / Bridges and Bridged Networks. 

 * IEEE 802.1p-1998 — Priority and
     quality standard (Clases de Servicios / QoS). 

 * IEEE 802.1D-2004 — Spanning-Tree Protocol / MAC Bridges.

 * IEEE 802.1w-2001 — Rapid
     Spanning-Tree Protocol. 

 * IEEE
     802.1X-2020 — Port-Based Network Access
     Control / Autenticación de acceso a la red. 

CISPR
22:2008 — Limits and methods of measurement of radio interference
characteristics. El AT3 la cita como CISPR22.

CISPR 24:2010 — Information
Technology Equipment – Immunity characteristics – Limits and Methods of
Measurement. 

La ingeniería de detalle deberá definir la
aplicación específica de estas referencias según el segmento funcional de la
red que corresponda, incluyendo, según aplique, core,
distribución y acceso, así como los criterios de integración con los
subsistemas de señalización, control, telecomunicaciones y servicios auxiliares
del Proyecto. La conformidad de los equipos activos con las normas de
compatibilidad electromagnética deberá acreditarse en la etapa de suministro y
validación mediante la documentación técnica y certificaciones del fabricante
exigidas en la ingeniería de detalle y en los protocolos de prueba y aceptación.

# 3.                 
DESCRIPCIÓN DEL PROYECTO

## 3.1.           
Corredor La Dorada – Chiriguaná

El presente Documento de Bases y Criterios de
Diseño (DBCD) establece los parámetros técnicos, normativos y funcionales de
obligatorio cumplimiento para el diseño de detalle del Sistema de Control de
Tráfico, Señalización y Comunicaciones de la Unidad Funcional 2 (UF2),
correspondiente a la totalidad del corredor férreo La Dorada (Caldas) –
Chiriguaná (Cesar), en el marco del Contrato de Concesión APP No. 001 de 2025.
El alcance del documento comprende la definición de los criterios de diseño
aplicables a los subsistemas, equipos, interfaces e infraestructura requeridos
para la implementación del sistema en la totalidad de la UF2.

El sistema operará bajo una arquitectura de
Control Positivo de Trenes (PTC) con cantonamiento virtual y centralizada, y
garantizará la continuidad del tráfico ferroviario en el punto de interconexión
norte mediante interoperabilidad con la red concesionada a FENOCO S.A. En
consecuencia, la ingeniería de detalle deberá desarrollarse con arreglo a este
alcance y a las obligaciones contractuales aplicables, como base técnica
verificable.

## 3.2.           
Localización

El Proyecto del Corredor Férreo Dorada –
Chiriguaná comprende la rehabilitación, modernización y puesta en operación del
corredor ferroviario nacional que conecta los municipios de La Dorada, en el
departamento de Caldas, y Chiriguaná, en el departamento del Cesar. El corredor
tiene una longitud total aproximada de 526,133 km de vía principal,
extendiéndose desde el PK 201+470, en el municipio de La Dorada, hasta el PK
722+683, al sur de la estación de Chiriguaná, e incluye los ramales existentes
de Capulco e IDEMA, así como las líneas secundarias y de servicio en
estaciones, líneas de cruce y apartaderos.

Este corredor atraviesa los departamentos de
Caldas, Antioquia, Santander, Norte de Santander y Cesar, cubriendo un conjunto
diverso de territorios con funciones logísticas, industriales y agroproductivas
estratégicas para el sistema ferroviario nacional.

Tabla SEQ
Tabla \* ARABIC1.
Listado de Municipios que hacen parte del corredor del Proyecto

DEPARTAMENTO

MUNICIPIO

DESDE

HASTA

CALDAS

La Dorada

PK 201+470

PK 237+800

ANTIOQUIA

Sonsón

PK 237+800

PK 248+700

Puerto
  Triunfo

PK 248+700

PK 269+540

Puerto
  Nare

PK 269+540

PK 299+800

Puerto
  Berrío

PK 299+800

PK 332+500

SANTANDER

Cimitarra

PK 332+500

PK 375+750

Puerto
  Parra

PK 375+750

PK 403+750

Simacota

PK 403+750

PK 423+400

Barrancabermeja

PK 423+400

PK 465+250

Puerto
  Wilches

PK 465+250

PK 485+400

Sabana de
  Torres

PK 485+400

PK 515+400

Rionegro

PK 515+400

PK 524+500

Norte de
  Santander

La
  Esperanza

PK 524+500

PK 528+800

CESAR

San
  Alberto

PK 528+800

PK 540+500

San Martín

PK 540+500

PK 572+700

Río de Oro

PK 572+700

PK 577+800

Aguachica

PK 577+800

PK 588+300

Gamarra

PK 588+300

PK 617+000

La Gloria

PK 617+000

PK 639+800

Pelaya

PK 639+800

PK 642+000

Tamalameque

PK 642+000

PK 652+900

Pailitas

PK 652+900

PK 662+800

Chimichagua

PK 662+800

PK 696+500

Curumaní

PK 696+500

PK 712+800

Chiriguaná

PK 712+800

PK 722+683

Fuente: ANEXO 1, Apéndice
Técnico 1

Figura SEQ
Figura \* ARABIC1.
Concesión Línea Férrea Central

Fuente: Elaboración propia a
partir de la base de datos interna de la Agencia Nacional de Infraestructura
(ANI), Corredor del proyecto.

## 3.3.           
Sectorización por Unidades Funcionales

Para efectos de referenciación geográfica y
ordenamiento de los planos de diseño, el corredor se entenderá en concordancia
con la sectorización por UFVF definida en el AT1.

Los puntos operativos críticos
(enclavamientos, detección, señales, cambiavías, pasos a nivel) quedarán
mapeados a la UFVF correspondiente exclusivamente para fines de localización e
inventario.

La programación de la instalación física,
implantación, integración, activación operativa y puesta en servicio del
sistema centralizado PTC/CTC corresponde de manera integral a la UF2, conforme
al Plan de Obras, sin que la sectorización geográfica por UFVF implique
entregas operativas parciales anticipadas.

## 3.4.           
Despliegue modular

El Sistema de Señalización y Control se
concibe bajo un principio de despliegue modular en su fase constructiva, de
manera que su desarrollo, instalación física e integración técnica en campo
puedan realizarse progresivamente, en concordancia con la habilitación de
infraestructura, la disponibilidad de comunicaciones y la secuencia de
ejecución del Proyecto.

Este enfoque constructivo modular no
fracciona el sistema operacionalmente. La entrada en operación del sistema
centralizado PTC/CTC corresponde a la culminación integral de la Unidad
Funcional 2 (UF2), sin que el despliegue constructivo secuencial genere
obligaciones de entregas operativas parciales ante la Interventoría.

# 4.                 
FILOSOFÍA DE DISEÑO: ARQUITECTURA PTC CON CANTONAMIENTO VIRTUAL 

## 4.1.           
Fundamento contractual

El fundamento contractual de la arquitectura
adoptada en el presente documento se encuentra en el Apéndice Técnico 1, el
cual exige que se disponga de un sistema de control de tráfico, señalización y
comunicaciones completamente operativo y funcional, capaz de garantizar la
operación ferroviaria, el seguimiento y el control de trenes a lo largo de todo
el corredor del Proyecto, así como la interoperabilidad con el tramo norte
concesionado a FENOCO S.A. Para efectos del presente documento rector, y en
alineación con los requerimientos de la FRA, esta interoperabilidad se abordará
mediante procedimientos operacionales sin que ello imponga como criterio base
la integración lógica, automática o de software directa con arquitecturas
propietarias de terceros.  El
mismo AT1 remite al Apéndice Técnico 3 (AT3) para las especificaciones técnicas
aplicables al sistema.

En ese marco, la Tabla 17 del Apéndice
Técnico 1 exige la implementación de un sistema de control de tráfico que
supervise la conducción del tren con base en los requerimientos y estándares de
la Federal Railroad Administration (FRA) aplicables a sistemas tipo Positive
Train Control (PTC), contenidos en el Título 49, Subtítulo B, Capítulo II,
Parte 236, Subparte I del Code of Federal Regulations de los Estados Unidos. En desarrollo de
dicha exigencia contractual, el presente documento adopta como referencia
técnica la FRA 49 CFR Part 236, Subpart I (2026), por corresponder a la versión
vigente consultada de la citada regulación.

Entendiendo que dicha exigencia contractual
no impone por sí misma una única solución constructiva de detalle, pero sí
obliga a que la solución seleccionada sea coherente con los principios
funcionales, operacionales y de seguridad propios de un sistema tipo PTC. 

Bajo esa lógica, la arquitectura
definida en este documento se estructura sobre cantonamiento físico exclusivamente
en las cinco zonas operativas definidas en la Tabla 17 del Apéndice Técnico 1
(Zapatosa, García Cadena, Barrancabermeja, Puerto Berrío - Grecia y La Dorada -
México), donde se implementarán enclavamientos electrónicos. Por consiguiente,
en los tramos y estaciones diferentes a estas zonas, el control se ejercerá
mediante un sistema PTC con cantonamiento virtual, y se implementará la
instalación de desvíos libres.

Tabla SEQ Tabla \* ARABIC2. Arquitectura Funcional del Sistema

Componente

Criterio
   adoptado para el Proyecto

Arquitectura
  general del sistema

PTC con cantonamiento virtual como arquitectura
  principal de control de trenes. El cantonamiento físico en los cinco puntos
  operativos con enclavamiento electrónico (ENCE) definidos en la Tabla 17 del
  AT1.

Detección
  / localización de trenes en línea

Posicionamiento mediante equipos embarcados, con supervisión
  desde el sistema central PTC. La instalación de
  elementos físicos de detección en vía en los cinco puntos ENCE definidos en la
  tabla 17 del AT1.

Cantones
  en tramos intermedios

Virtuales, gestionados desde la lógica central
  del sistema conforme a la arquitectura PTC con cantonamiento virtual.

Cantones
  en puntos operativos de enclavamientos

Físicos, asociados a las cinco zonas operativas con enclavamiento
  electrónico (ENCE) definidas en la Tabla 17 del AT1. 

Señalización
  en línea

Señalización exclusiva en cabina, mediante el
  sistema PTC con cantonamiento virtual.

Señales
  en puntos operativos de enclavamientos

Señalización semafórica en las cinco zonas
  operativas con enclavamiento electrónico (ENCE) definidas en la Tabla 17 del
  AT1, integradas al sistema PTC con cantonamiento virtual. 

Enclavamientos

Enclavamientos electrónicos asociados a las cinco
  zonas operativas definidas en la Tabla 17 del AT1, con aseguramiento de rutas, control de
  incompatibilidades y posibilidad de operación local en condición degradada

Cambiavías
  en zonas operativas de enclavamientos

Motorizados y gobernados por enclavamiento
  electrónico

Desvíos
  fuera de zonas con enclavamiento

 Desvíos
  libres conforme a la Tabla 17 del AT1

Autorización
  de movimiento

Movement Authority (MA) emitida dentro de la
  lógica del sistema PTC con cantonamiento virtual y gestionada desde el
  sistema central

Centro de
  control

CCO como instancia central de supervisión,
  gestión de tráfico, monitoreo de trenes y administración de autorizaciones de
  movimiento

Comunicaciones
  del sistema

Soporte mediante red lineal de fibra óptica y
  sistema de radio TETRA para la operación y transmisión de información
  asociada al sistema.

Red de
  transmisión Satelital de redundancia

Comunicaciones Tren-Tierra, se establece una redundancia
  mediante red satelital.

Interoperabilidad

Interoperabilidad con la infraestructura
  ferroviaria concesionada, conforme al Contrato de Concesión APP No. 001 de
  2025.

Pasos a
  Nivel

Protección activa mediante el Sistema PTC con
  cantonamiento virtual.

Fuente: Elaboración Propia en
base al Apéndice Técnico 1

### 4.1.1.      Componentes
de la Arquitectura PTC con
cantonamiento virtual 

#### 4.1.1.1.                     
Equipo Embarcado (Onboard)

 * Computador
     PTC embarcado.

 * Sistema
     de posicionamiento del tren.

 * Odometría
     embarcada.

 * Pantalla
     del maquinista con velocidad permitida y Movement Authority (MA).

 * Interfaz
     con el sistema de freno para supervisión y enforcement.

 * Equipamiento
     de radiocomunicaciones de voz y datos para la red del corredor y para la
     red adyacente.

 * Módulo
     de conectividad mediante redundancia con red Satelital.

 * Registrador
     jurídico.

 * Dispositivo
     de inicio y fin de tren (HOT-EOT) o medio equivalente para comprobación de
     integridad del convoy.

 * Base de
     datos de vía embarcada.

#### 4.1.1.2.                     
Centro de Control (Back Office)

 * Servidores
     PTC centralizados en el CCO, en arquitectura redundante / Alta
     Disponibilidad (HA), para soportar la continuidad operativa del sistema y
     los requerimientos de seguridad, verificación y certificación aplicables
     bajo FRA 49 CFR Part 236, Subpart I.

 * Sistema
     de gestión de tráfico / interfaz CTC.

 * Base de
     datos de vía (track database) con geometría y restricciones.

 * Motor
     de cálculo y gestión de Movement Authority (MA).

 * Sistema
     de Regulación de Tráfico Ferroviario.

 * Consolas
     de operación y supervisión.

 * Registrador
     Jurídico Central, sistema de respaldo y almacenamiento de eventos.

 * Sistema
     de comunicaciones asociado al control central, incluyendo interfaces para
     la red principal en fibra óptica.

#### 4.1.1.3.                     
Infraestructura en Vía (Wayside)

 * Enclavamientos
     electrónicos en los cinco puntos operativos definidos en
     el AT1 Tabla 17. 

 * Cambiavías
     motorizados en los cinco puntos operativos definidos en el AT1 Tabla 17.

 * Detección
     física de trenes en zonas con ENCE.

 * Protección
     con Señales en zonas con ENCE.

 * Cambiavías
     libres fuera de zonas con enclavamiento.

 * Interfaces
     de supervisión de estado hacia el CCO (señales y detección en zonas con
     ENCE).

 * Sistemas
     de protección de pasos a nivel.

 * Equipos
     de energía y respaldo para elementos de campo en zonas con ENCE.

#### 4.1.1.4.                     
Sistema de Comunicaciones

 * Red
     lineal de fibra óptica a lo largo del corredor.

 * Sistema
     de radio TETRA para operación ferroviaria.

 * Torres o sitios de radio TETRA para cobertura del
     corredor.

 * Red de transmisión de datos entre CCO, equipos
     embarcados y elementos de campo.

 * Canales de comunicación para supervisión, comandos
     y reporte de estado.

 * Equipos de red y gestión de comunicaciones del
     sistema.

# 5.                 
CRITERIOS DEL SISTEMA DE CONTROL DE TRENES PTC CON CANTONAMIENTO VIRTUAL

## 5.1.           
Funcionalidades obligatorias

El Sistema de Control de Trenes PTC con
cantonamiento virtual deberá desarrollarse de conformidad con los principios
funcionales aplicables a sistemas tipo Positive Train Control, conforme a la
FRA 49 CFR Part 236 Subpart I (2026), y deberá orientarse a soportar las
siguientes funciones de seguridad:

 * Prevención
     de colisiones entre trenes.

 * Prevención
     de descarrilamientos por exceso de velocidad.

 * Prevención
     de incursión en zonas de trabajo protegidas.

 * Prevención
     de movimiento a través de cambios mal posicionados.

Estas funciones deberán ser implementadas
dentro de la lógica general del sistema adoptado para el Proyecto, en
coherencia con la arquitectura PTC con cantonamiento virtual definida en el
presente documento, el esquema de operación del corredor y las condiciones de integración
con:

 * Los
     cinco puntos operativos definidos en el AT1 (Tabla 17), los cuales
     dispondrán de cantonamiento físico, enclavamiento, señales y cambiavías
     motorizados.

 * Los
     desvíos libres instalados en el resto del corredor, conforme a la Tabla 17
     del AT1.

La definición específica de parámetros, modos
de supervisión, umbrales de intervención, interfaces de software y secuencias
de actuación corresponderá a la ingeniería de detalle, sin que el presente
documento establezca por sí mismo una solución exhaustiva de implementación.

## 5.2.           
Subsistema embarcado

El subsistema embarcado del sistema PTC con
cantonamiento virtual deberá diseñarse para su integración con el material
rodante tractivo del Proyecto definido en el AT1, Capítulo 5.1, que hacen parte
del inventario base. En caso de material rodante adicional, su integración
deberá desarrollarse bajo los mismos criterios funcionales y de compatibilidad
operacional. 

El subsistema embarcado deberá permitir, como
criterio general, la supervisión de la circulación del tren dentro de la
arquitectura PTC con cantonamiento virtual adoptada para el corredor,
incluyendo la recepción y ejecución de autorizaciones de movimiento, la
presentación de información operativa al maquinista, la interacción con los
sistemas del tren requeridos para la protección automática y el intercambio de información
con el sistema central.

De manera general, el subsistema embarcado
deberá contemplar:

 * equipo
     embarcado PTC con interfaz de operación para maquinista;

 * medios
     de posicionamiento y referencia de marcha compatibles con la lógica del
     sistema;

 * interfaz
     con los sistemas del tren requeridos para funciones de supervisión y
     protección;

 * medios
     de comunicación de voz y datos para garantizar la conectividad y la
     interoperabilidad tanto en la red propia como en la red adyacente;

 * registro
     de eventos y parámetros operativos relevantes para la explotación del
     sistema;

 * dispositivo
     de fin de tren (EOT - End of Train) o medio equivalente para la
     comprobación de integridad del tren.

La definición específica de arquitectura
embarcada, configuración por tipo de locomotora, interfaces particulares con
cada unidad tractiva y requisitos detallados de instalación corresponderá a la
ingeniería de detalle, de conformidad con el material rodante efectivamente
habilitado para la operación del corredor y con las exigencias de
interoperabilidad mencionadas.

### 5.2.1.     
Computador PTC

El computador PTC embarcado deberá soportar las
funciones requeridas para la supervisión de la circulación, la recepción y
ejecución de autorizaciones de movimiento, la interacción con el maquinista y
la aplicación de las funciones de protección automática definidas para el
sistema.

Como criterio general, el computador PTC
deberá contar con una arquitectura de procesamiento adecuada para funciones de
seguridad ferroviaria, conforme a la FRA 49 CFR Part 236 Subpart I (2026) como
norma principal del sistema de control de trenes, al AREMA Communications and
Signals Manual 2021 para los criterios aplicables de señalización y control.

El computador PTC deberá permitir:

 * la
     interfaz con los sistemas del tren requeridos para las funciones de
     supervisión y protección, en particular con los sistemas de freno y demás
     subsistemas que resulten necesarios para la aplicación de la lógica del
     sistema;

 * el
     almacenamiento y gestión de la información de vía requerida para la
     operación del sistema, incluyendo la track database y sus actualizaciones
     controladas;

 * el
     registro de eventos, condiciones operativas y actuaciones relevantes del
     sistema embarcado;

 * la
     comunicación con el sistema central y con los demás elementos asociados a
     la arquitectura PTC con cantonamiento virtual del Proyecto.

### 5.2.2.     
Sistema de posicionamiento y detección

En los tramos del corredor operados bajo
cantonamiento virtual, el sistema PTC deberá disponer de un sistema embarcado
de posicionamiento del tren cuyas tolerancias de precisión cumplan
estrictamente con los requerimientos de la norma FRA 49 CFR Part 236 Subpart I
(2026) para soportar las funciones de supervisión del movimiento, determinación
de ubicación y control asociadas a la arquitectura adoptada para el Proyecto.
Como criterio general, esta función se soportará en posicionamiento GPS
complementado con odometría embarcada, conforme a los requerimientos
funcionales del sistema.

En los cinco puntos operativos contemplados
en la solución del Proyecto, la determinación de ocupación y liberación de vía
se efectuará mediante sistemas de detección física de trenes instalados en
dichas zonas, supervisados por el enclavamiento electrónico correspondiente a
cada punto.

### 5.2.3.     
Interfaz del Maquinista (DMI)

El subsistema embarcado PTC dispondrá de una
Interfaz del Maquinista (DMI) que permita la presentación clara y oportuna de
la información operativa requerida para la conducción del tren dentro de la
arquitectura adoptada para el Proyecto.

Como criterio general, la DMI deberá
permitir:

 * La
     indicación de la velocidad permitida aplicable a la operación del tren.

 * La
     visualización de la Movement Authority (MA) vigente y de la referencia de
     distancia asociada a la misma.

 * La
     generación de alarmas visuales y sonoras previas a la actuación de las
     funciones automáticas de protección o enforcement.

·        
La
indicación clara del estado operativo del sistema PTC.

## 5.3.           
Subsistema Central (Back Office)

El sistema PTC deberá disponer de un
Subsistema Central (Back Office) ubicado en el Centro de Control de Operaciones
(CCO), encargado de soportar la lógica central de supervisión y control del
movimiento ferroviario dentro de la arquitectura adoptada para el Proyecto.

Como criterio general, este subsistema deberá
contemplar:

 * Una
     arquitectura de servidores PTC redundante para minimizar los riesgos a
     fallas con capacidad para gestionar la lógica de autorización de
     movimientos del sistema.

 * Una
     track database con la información de vía requerida para la operación,
     incluyendo geometría, gradientes y restricciones operativas permanentes y
     temporales.

 * Una
     interfaz con el sistema de control de tráfico, para soportar la gestión de
     rutas, la supervisión operativa y la coordinación con los puntos de
     control del corredor.

 * Comunicación
     bidireccional segura con los equipos embarcados para el intercambio de
     información operativa y de control, garantizando la autenticación e
     integridad criptográfica de los mensajes conforme a la norma FRA 49 CFR §
     236.1033.

# 6.                 
CRITERIOS DEL SISTEMA DE TELECOMUNICACIONES

Se establecen los criterios de
diseño y aceptación para los sistemas de telecomunicaciones del corredor férreo
La Dorada–Chiriguaná, incluyendo el Centro de Control Operativo (CCO), la
comunicación tren–tierra hacia el CCO, la red de radio de operación (TETRA), la
red de transporte en fibra óptica, la redundancia Satelital y los subsistemas
de CCTV. El alcance comprende la infraestructura, los equipos, las interfaces y
los medios de transmisión requeridos para soportar la operación ferroviaria, la
supervisión del sistema PTC, la transmisión de eventos, alarmas y estados de
campo, y la coordinación operativa del corredor. 

La arquitectura contempla: (a)
una capa de acceso radio basada en TETRA para voz operativa y datos SDS; (b)
una red IP/MPLS sobre fibra óptica como columna vertebral principal del
corredor; (c) una red de redundancia de comunicaciones (d) el CCO con sistemas
de gestión, supervisión y grabación de comunicaciones; y (e) subsistemas de
CCTV, integrados al sistema central.

## 6.1.           
Fibra Óptica (Backbone y Acceso)

### 6.1.1.     
Obras civiles y tendido

·        
Canalización y cotas
(Red Troncal): La red de fibra óptica se instalará soterrada mediante ductos de
protección, priorizando el costado derecho de la vía férrea (sentido
Sur-Norte). La profundidad de instalación en tendido longitudinal y los
criterios de protección mecánica en cruces transversales se definirán en la
ingeniería de detalle conforme al AREMA Manual for Railway Engineering (2021) y
las cargas dinámicas del corredor.

·        
Cruces para Accesos y Última Milla: Para
derivaciones de acceso o tramos donde la invasión predial impida la
canalización soterrada, se permitirán tendidos aéreos conforme al AREMA Manual
for Railway Engineering (2021), garantizando el gálibo vertical ferroviario
mínimo y utilizando cable dieléctrico auto soportado (ADSS). Los criterios
específicos de altura, postería y geometría se
definirán en la ingeniería de detalle. 

·        
Especificación del Cable: Cable de fibra
óptica monomodo de cuarenta y ocho (48) hilos, conforme a ITU-T G.652.D, como
solución homogénea para todo el corredor. 

·        
Obras Especiales e Ingeniería: La
definición de rutas, métodos de tendido, pruebas y obras especiales en puentes
y viaductos corresponderá a la ingeniería de detalle. Las cajas de paso se
proyectarán únicamente donde la tensión del cable o la geometría del tendido lo
exijan técnicamente. Queda expresamente prohibido fijar la infraestructura de
telecomunicaciones mediante soldaduras o perforaciones en elementos
estructurales de puentes y viaductos, así como su fijación a elementos de
reemplazo periódico de la vía. Para derivaciones de acceso o tramos donde la
invasión predial dentro del corredor impida la canalización soterrada, se
permitirán tendidos aéreos conforme al AREMA

·        
Topología y derivaciones: La
red troncal de fibra óptica operará físicamente en tendido lineal único con
topología lógica redundante conforme al AT1, el cual establece que la
redundancia se garantiza mediante la operación combinada de la red de fibra y
la red de radio TETRA. Las derivaciones físicas se realizarán exclusivamente
hacia el CCO, los cinco (5) nodos ENCE y las estaciones base de radio TETRA, en
concordancia con la arquitectura PTC con cantonamiento virtual. 

## 6.2.           
Radio Tetra (Voz Operativa y Datos de
Explotación)

### 6.2.1.      Infraestructura
y obra civil:

·        
Diseño funcional y especificación técnica para
torres, soportes y casetas de telecomunicaciones. La ubicación, altura y
cantidad de sitios radiantes se determinarán mediante simulación de cobertura
RF y verificación de line-of-sight
conforme al AREMA Communications and Signals Manual (2021). El diseño
definitivo de cada cimentación corresponderá a la ingeniería de detalle, una
vez confirmada la ubicación exacta, bajo cumplimiento estricto de la NSR-10 del
sitio y las especificaciones del proveedor tecnológico.

·        
Despliegue topológico y cobertura: La ubicación
de la infraestructura física estará estrictamente subordinada a los resultados
de la simulación de cobertura RF. Para dar cumplimiento al 100% de cobertura
exigida en el AT1, el diseño contemplará una arquitectura de sitios radiantes
TETRA distribuidos a lo largo del corredor, garantizando cobertura autónoma
continua. La redundancia de comunicaciones se implementará mediante
comunicación satelital como red de contingencia independiente, sin sustituir la
cobertura TETRA requerida.

·        
Seguridad de comunicaciones: Conforme a FRA 49
CFR §236.1033, la red TETRA y sus sistemas redundantes deberán garantizar
integridad criptográfica de mensajes y autenticación bidireccional para todo el
tráfico de datos del sistema PTC con cantonamiento virtual.

·        
Sistemas de respaldo y protección: Sistemas de
puesta a tierra exclusivos para el equipamiento de señalización y
comunicaciones, sin sustituir las mallas generales de las estaciones,
pararrayos, alimentación y UPS, y red de Backhaul IP hacia el CCO. Los
parámetros específicos corresponderán a la ingeniería de detalle bajo RETIE
2024 y NSR-10.

### 6.2.2.      Especificaciones
para Configuración y lineamientos de puesta en marcha

·        
Parametrización
de la interfaz aire (V+D): definición de los criterios para la configuración de
canales, sincronización, multiplexación, servicios CC/SS/SDS, numeración
funcional y grupos, garantizando el cumplimiento de la ETSI EN 300 392-2 V3.8.1
(2016-08). 

·        
Modo directo
(DMO): especificación técnica para la habilitación del modo directo y para los
protocolos de prueba MS-MS, de conformidad con la ETSI EN 300 396-3 V1.3.1
(2006-08). 

·        
Codec de voz
e integración cabina–DMI: definición de lineamientos para la integración del codec de voz ACELP y de la interfaz DMI/cabina,
estableciendo las pautas de verificación conforme a la ETSI EN 300 395-1 V1.2.0
(2004-09). 

·        
Interfaz
PEI: especificación de la interfaz PEI (AT/SDS/datos) para la integración de
consolas y equipos periféricos, de conformidad con la ETSI EN 300 392-5 V2.7.1
(2020-04). 

·        
Seguridad de
la interfaz aire: definición de los requerimientos de seguridad aplicables a la
autenticación entre infraestructura y estación móvil (MS), la gestión de claves
y el soporte de cifrado en la interfaz aire, exigiendo al proveedor tecnológico
el cumplimiento de la ETSI EN 300 392-7 V3.5.1 (2019-07).

### 6.2.3.      Sistema
de Redundancia

El canal de redundancia Tren-Tierra se
implementará mediante comunicación satelital embarcada, conforme a la
habilitación del AT1. Esta solución operará como red de contingencia
independiente sin requerir infraestructura estática adicional en la vía. El sistema
de comunicaciones embarcado asociado deberá garantizar la seguridad, integridad
y autenticación criptográfica de los datos transmitidos, en cumplimiento de EN
50159 Categoría 3 y FRA 49 CFR §236.1033.

### 6.2.4.      Especificaciones
para Pruebas y aceptación

·        
Los equipos de radio TETRA deberán cumplir con
las normas ETSI aplicables al sistema. Los protocolos específicos de pruebas de
conformidad y aceptación en campo se definirán en la ingeniería de detalle.

# 7.                 
CRITERIOS DEL CENTRO DE CONTROL DE OPERACIONES
(CCO)

## 7.1.           
Ubicación y Funciones

El Centro de Control de Operaciones (CCO) del
Proyecto se ubicará en el municipio de La Dorada, Caldas, y constituirá la
instancia central de supervisión, control y coordinación operativa del Sistema
de Señalización y Control del corredor La Dorada – Chiriguaná.

Como criterio general, el CCO deberá
concentrar, las siguientes funciones:

 * La
     gestión de tráfico mediante el sistema CTC, incluyendo la supervisión
     operativa del corredor y la autorización de rutas y movimientos.

 * El
     subsistema central PTC con cantonamiento virtual, incluyendo la lógica de
     cálculo, gestión y emisión de Movement Authority (MA).

 * La
     supervisión de sistema SCADA.

 * La
     gestión de comunicaciones requeridas para la operación del sistema.

 * La
     coordinación operativa ante eventos, incidencias y situaciones de
     emergencia que afecten la circulación ferroviaria.

 * La
     supervisión de los pasos a nivel tipo B y C, conforme a la
     arquitectura PTC con cantonamiento virtual definida en el Apéndice Técnico
     1.

## 7.2.           
Filosofía CTC

De conformidad con la arquitectura adoptada
para el Proyecto, las operaciones de control del corredor se realizarán de
forma prioritaria desde el CCO, a través del sistema CTC y del subsistema
central PTC con cantonamiento virtual, manteniendo una filosofía de supervisión
y gestión centralizada del tráfico ferroviario.

No obstante, en los cinco puntos operativos
definidos en
la Tabla 17 del AT1 se dispondrá
de enclavamientos electrónicos, los cuales asumirán la lógica local segura
asociada al establecimiento y aseguramiento de rutas, al control de movimientos
incompatibles y al gobierno de señales dentro de su respectiva zona de
influencia.

Bajo este criterio, la filosofía de control
del sistema responderá a los siguientes principios:

 * El CCO
     constituye la instancia principal de supervisión y gestión del tráfico del
     corredor.

 * La
     autorización general de circulación y la supervisión del movimiento de
     trenes se
     gestionarán desde el CCO mediante el sistema PTC con cantonamiento
     virtual.

 * En
     los cinco puntos operativos con ENCE, la lógica local de enclavamiento
     gobernará el establecimiento de rutas y el aseguramiento de movimientos
     dentro de su zona de influencia.

 * La
     operación local o descentralizada (en los cinco puntos operativos con ENCE) solo se habilitará en condición de
     contingencia, mantenimiento, degradación.

 * La
     comunicación entre el CCO, los enclavamientos y los equipos embarcados
     deberá permitir la coordinación funcional entre la supervisión central, la
     lógica local de ruta y la gestión de Movement Authority (MA). 

## 7.3.           
Redundancia y Alta Disponibilidad

El CCO y los subsistemas centrales asociados
al Sistema de Señalización y Control deberán diseñarse con criterios de
redundancia y alta disponibilidad, de manera que se preserve la continuidad
operativa de las funciones críticas de supervisión, control y gestión del
corredor.

Como criterio general, la solución deberá
contemplar:

 * Especificaciones
     de fuentes de energía redundantes para los equipos críticos del CCO,
     incluyendo doble acometida cuando se encuentre disponible, sistemas de
     alimentación ininterrumpida UPS dimensionados para
     una autonomía mínima de cuatro (4) horas, y generación de respaldo.

 * Mecanismos
     de respaldo de información y continuidad operativa, incluyendo backup de
     datos en tiempo real o replicación equivalente.

 * Capacidad
     de recuperación ante contingencias tecnológicas mediante arquitectura de
     servidores redundantes tolerantes a fallos.

## 7.4.           
Interfaz Hombre-Máquina (HMI)

El CCO deberá disponer de una Interfaz
Hombre-Máquina (HMI) adecuada para soportar la supervisión, control y gestión
operativa del corredor. El diseño de la HMI deberá alinearse con los criterios
de factores humanos y mitigación de errores establecidos en la normativa FRA 49
CFR Part 236 Apendix E.

Como criterio general, la HMI deberá
permitir:

 * La
     visualización sinóptica del corredor completo y de sus puntos operativos
     relevantes.

 * La
     indicación de la posición de los trenes dentro del ámbito de supervisión
     del sistema.

 * La
     gestión de rutas y movimientos mediante una interfaz gráfica acorde con la
     lógica de operación del corredor.

 * La
     presentación de alarmas, eventos e incidencias con criterios de
     priorización.

 * El
     registro histórico de eventos y actuaciones operativas para fines de
     análisis, seguimiento y trazabilidad.

# 8.                 
CRITERIOS DE PASOS A NIVEL

## 8.1.           
Alcance

Los PAN ubicados en las cinco zonas ENCE
serán controlados por el enclavamiento correspondiente.

Los restantes pasos a nivel con
protección activa serán controlados por el sistema PTC con cantonamiento
virtual conforme a la Tabla 17 del AT1 y la NTC 4741:1999. La arquitectura de
protección, los principios de seguridad funcional y los requisitos de hardware
corresponderán a la ingeniería de detalle conforme a la normativa aplicable y
el análisis de riesgo correspondiente.

## 8.2.           
Clasificación de Pasos a Nivel

La clasificación de los pasos a nivel se
realizará conforme al Apéndice Técnico 1, numeral 4.5. Para efectos de la línea
base de diseño y el presupuesto del sistema, las cantidades que requieren
protección del sistema de señalización se fijan en:

·        
Nueve
(9) pasos a nivel Tipo C

·        
Quince
(15) pasos a nivel Tipo B

### 8.2.1.     
Pasos a Nivel Tipo B

Se entenderá por paso a nivel Tipo B
aquel cruce protegido con señales luminosas y acústicas (S.L.A.). Esta clase
incorpora las actuaciones correspondientes al Tipo A y adiciona un sistema de
advertencia activa para el usuario de la vía, conformado por señales luminosas
y señales acústicas. 

### 8.2.2.     
Pasos a Nivel Tipo C

Se entenderá por paso a nivel Tipo C
aquel cruce protegido con semibarreras, dobles semibarreras o barreras automáticas
o enclavadas. Esta clase incorpora, además de las actuaciones del Tipo B y del
Tipo A, la protección física reforzada del cruce mediante elementos de cierre o
restricción del paso vehicular. 

## 8.3.           
Detección y activación 

La detección y activación
de los pasos a nivel se basa en la lógica de Movement Authority del sistema PTC
con cantonamiento virtual. El sistema procesará la posición exacta y velocidad
del tren en tiempo real para determinar el punto de activación dinámico,
garantizando un Tiempo de Advertencia Constante (Constant Warning Time — CWT)
independientemente del tipo y velocidad del tren.

La secuencia de protección se iniciará
automáticamente cuando el tren alcance el umbral virtual definido, garantizando
que el cruce esté protegido antes de la llegada del material rodante. El
accionamiento de señales lumínicas, sonoras y talanqueras estará supervisado
desde el CCO.

## 8.4.           
Controlador local de paso a nivel

Cada PAN con
protección activa (Tipo B y Tipo C) deberá disponer de un controlador local
encargado de ejecutar la lógica de protección de la instalación, estando
subordinado funcionalmente al sistema PTC con cantonamiento virtual y a la
supervisión del CCO.

Como criterio general, el
controlador local deberá permitir:

·        
La recepción y ejecución de comandos de
activación provenientes de la lógica central del sistema PTC con cantonamiento
virtual.

·        
La ejecución autónoma de la secuencia de
protección del paso a nivel.

·        
La supervisión del estado de barreras, señales
luminosas, señales acústicas y demás elementos principales.

·        
El reporte de condición, alarmas y eventos hacia
el CCO y a la cabina del tren.

·        
Un comportamiento de falla segura ante cualquier
contingencia de comunicación o energía.

## 8.5.           
Normatividad aplicable

Para los pasos a nivel serán de aplicación,
las siguientes normas y referencias:

 * NTC
     4741 (1999), para los aspectos de señalización ferroviaria aplicables.

 * Manual
     de Señalización Vial de Colombia (2024), adoptado mediante Resolución 20243040045005 de 2024 del Ministerio de Transporte,

 * FRA 49
     CFR Part 234 (2026), como referencia para los criterios de seguridad en
     pasos a nivel, dentro del marco de referencia PTC con cantonamiento
     virtual adoptado para el proyecto.

La normativa deberá interpretarse de
manera subordinada a la arquitectura PTC con cantonamiento virtual y al
principio de detección inalámbrica definidos en el presente documento.

# 9.                 
INTEROPERABILIDAD CON FENOCO

## 9.1.        
Definición de Interoperabilidad

La interfaz con la red norte operada por
FENOCO S.A. se define, como una interfaz de carácter operacional, orientada a
permitir la continuidad de la movilización de trenes en el punto de conexión
del corredor, sin que ello implique la integración técnica, lógica o funcional
entre los sistemas de control de trenes de ambas redes.

La interoperabilidad exigida para el Proyecto
se entenderá cumplida mediante la definición de procedimientos operacionales,
reglas de transición, coordinación entre centros de control, compatibilidad de
explotación y condiciones de intercambio operativo. El presente documento no
adopta como criterio de diseño la integración directa entre arquitecturas
propietarias de control, ni la implementación de pasarelas lógicas, intercambio
automático de datos vitales, integración de enclavamientos o acoplamiento entre
plataformas de señalización de distinta titularidad.

Esta definición es consistente con el marco
contractual del Proyecto, el AT1 exige la movilización de trenes y la
compatibilidad con la red conectada en Chiriguaná, pero no establece, obligación
expresa de integración técnica con sistemas propietarios de terceros. 

## 9.2.        
Procedimiento Operacional: Stop & Switch

La transición entre la red La Dorada–Chiriguaná y la red norte operada por FENOCO
S.A. se realizará mediante un procedimiento operacional de parada técnica y
conmutación de sistemas en Chiriguaná, en adelante Stop & Switch.

La continuidad de la circulación ferroviaria
entre ambas redes no dependerá de una integración lógica entre los sistemas de
control, sino de una secuencia operacional controlada de transferencia entre
jurisdicciones. El tren arribará a Chiriguaná bajo control del sistema PTC con
cantonamiento virtual del corredor, realizará parada completa y efectuará la
conmutación de equipos para la operación en la red receptora y solo reanudará
la marcha una vez reciba la autorización de FENOCO.

La definición detallada del punto de
transferencia, secuencia operativa y protocolos de coordinación corresponderá a
la ingeniería operativa posterior. Como criterio rector, la transición se
resolverá mediante parada técnica, cambio de condición operativa y nueva
autorización de circulación.

## 9.3.        
Configuración de Equipos Embarcados

Para soportar la operación en el corredor y
la transición con la red de FENOCO mediante Stop & Switch, el material
rodante habilitado para circular en ambas redes deberá contar con los equipos
embarcados requeridos para operar de manera separada en cada una de ellas.

Como criterio general, la configuración
embarcada deberá contemplar:

 * Medios
     de radiocomunicación de voz para la operación en la red propia y en la red
     FENOCO.

 * Medios
     de comunicación de datos para el sistema PTC del corredor y para la
     operación en la red receptora

 * Interfaz
     de maquinista compatible con la operación en ambas redes.

# 10.             
ALIMENTACIÓN ELÉCTRICA A LOS EQUIPOS DE
SEÑALIZACIÓN Y COMUNICACIONES FERROVIARIAS

El sistema de energía se
estructura en bloques independientes con criterios diferenciados, en función de
su naturaleza tecnológica, como se indica a continuación:  

·        
Enclavamientos electrónicos

·        
Equipos de control PTC fuera de las zonas
de enclavamiento (si existen)

·        
Equipos de control en los Pasos a nivel
con protección

·        
Equipos
Centro de Control de Operaciones

·        
Equipos del sistema TETRA

·        
Equipos de la red backbone de fibra
óptica

Cada uno de estos bloques tiene unos
requerimientos normativos para el respaldo del suministro de energía. A
continuación, se indican los criterios específicos para cada uno de los
bloques.

## 10.1 Enclavamientos
electrónicos

Loa
enclavamientos electrónicos cumplirán las recomendaciones AREMA y la normativa
FRA parte 236. Sus principales criterios de diseño son:

·        
Tensión
de alimentación: 110V

·        
Autonomía mínima de las UPS de los
enclavamientos: 4 horas

·        
Margen de diseño:
+20 % sobre carga pico.

·        
Factores de
simultaneidad y diversidad aplicados según AREMA.

## 10.2 Equipos de control PTC fuera de las zonas de enclavamiento
(si existen)

Los
equipos de control PTC fuera de las zonas de enclavamiento, en el caso de que
sean necesarios, cumplirán la normativa FRA parte 236. Sus principales
criterios de diseño en caso de ser precisos serán:

·        
Tensión de alimentación: 110V DC

·        
Autonomía
mínima de las UPS: 4 horas

## 10.3 Equipos
de control en los Pasos a nivel con protección

Los
equipos de control en los pasos a nivel con protección cumplirán las
recomendaciones AREMA y la normativa FRA parte 234. Sus principales criterios
de diseño relativos al suministro de energía son:

·        
Tensión de alimentación: 110V DC

·        
Autonomía
mínima de las UPS: 4 horas

## 10.4 Centro de Control de Operaciones (CCO)

Los
equipos de señalización del Centro de Control de Operaciones (CCO) cumplirán
las recomendaciones AREMA y la normativa FRA parte 236. Sus principales
criterios de diseño son:

·        
Tensión de alimentación: 110V DC

·        
Autonomía
mínima de las UPS: 4 horas

## 10.5 Equipos del sistema TETRA

Los equipos del sistema TETRA cumplirán
la normativa ETSI 300.132-2. Sus principales criterios de diseño para la
alimentación eléctrica son:

·        
Tensión de alimentación: 48V DC.

·        
Autonomía
mínima de las UPS: 24-48 horas

## 10.6   Servicios Auxiliares (CCTV, SCADA, alarmas):

Para los servicios auxiliares, los
criterios cumplirán el RETIE 2024 y serán:

·        
Uso
de alimentación en 120 VAC únicamente para circuitos no vitales, auxiliares o
como fuente primaria de sistemas de respaldo, siempre que se implementen
medidas adecuadas de protección EMC, aislamiento y filtrado. La energía AC
deberá utilizarse exclusivamente como entrada a UPS o rectificadores y
cargadores de baterías.  

·        
Caída
de tensión máxima admisible: 3 %.