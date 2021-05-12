;BEGIN PREDATOR NC HEADER
;MACH_FILE=HAAS - 3XVMILL.MCH
;MTOOL T1 S1 D6. C0. A0. H57.15
 ;MTOOL T1 S1 D6. H57.15 A0. C0. DIAM_OFFSET 1 = 3.
;MTOOL T2 S1 D2. C0. A0. H57.15
 ;MTOOL T2 S1 D2. H57.15 A0. C0. DIAM_OFFSET 2 = 1.
;SBOX X-16. Y-17.649 Z0. L32. W37.649 H2.
;END PREDATOR NC HEADER

;PROGRAM NAME - TOOLHOLDER.NC
;POST -  GRBL CNC Cue Maker
;DATE - SUN. 03/14/2021
;TIME - 12:24AM

G21 G40 G49 G54 G80 G90 G91.1
G53 G0 Z0.

;MACHINE SETUP - 1-FEATURE 2 AXIS-POCKET
;FEATURE 2 AXIS
;TOOL #1 6. 6.0000 DIA. 0.0000 CRAD. 4 FL.10.0000 CL
M6 T1
S1261 M3
G0 G90 G54 X9.5 Y13.5
;G43 H1 Z27. M8
Z7.
Z5.
G1 Z2. F179.4032
Z-8.
X-9.5 F358.8064
Y10.773
G17 G3 X-7.781 Y6.638 I16. J4.227
G2 X7.781 Y6.638 I7.781 J-11.638
G3 X9.5 Y10.773 I-14.281 J8.362
G1 Y13.5
X12.5
Y16.5
X-12.5
Y10.4
G3 X-8.343 Y2.278 I19. J4.6
G2 X-8.296 Y2.223 I-2.657 J-2.278
X8.296 Y2.223 I8.296 J-7.223
X8.343 Y2.278 I2.704 J-2.223
G3 X12.5 Y10.4 I-14.843 J12.722
G1 Y13.5
G0 Z7.
Z27.
M9
M5
G53 G0 Z0.
G53 G0 X0. Y0.

;MACHINE SETUP - 1-FEATURE 2 AXIS-PROFILE FINISH
;FEATURE 2 AXIS

;TOOL #2 2. 2.0000 DIA. 0.0000 CRAD. 4 FL.10.0000 CL
M6 T2
S3783 M3
G90 G54 X13. Y19.
;G43 H2 Z27. M8
G0 Z7.
Z5.
G1 Z-8. F269.1048
X-13. F538.2096
G17 G3 X-15. Y17. I0. J-2.
G1 Y10.111
G3 X-10.241 Y.651 I21.5 J4.889
G2 X-10. Y0. I-.759 J-.651
G1 Y-16.649
X-8.336 Y-14.11
X-8.333 Y-14.106
G3 X-8.333 Y-11.894 I-1.667 J1.106
G2 X-8.5 Y-11.342 I.833 J.553
G1 Y-5.
G2 X8.5 Y-5. I8.5 J0.
G1 Y-5.004
X8.471 Y-11.39
G2 X8.314 Y-11.924 I-1. J.004
G3 X8.3 Y-14.053 I1.686 J-1.076
G1 X10. Y-16.649
Y0.
G2 X10.241 Y.651 I1. J0.
G3 X15. Y10.111 I-16.741 J14.349
G1 Y17.
G3 X13. Y19. I-2. J0.
G0 Z7.
Z27.
M9
M5
G53 G0 Z0.
M30

;END OF PROGRAM

