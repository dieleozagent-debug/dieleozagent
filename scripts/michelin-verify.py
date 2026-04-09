#!/usr/bin/env python3
import os
import re
import sys

# SICC v6.5 Michelin Verify Script
# Proposito: Auditar la jerarquia de verdad en los entregables.

LEVEL_16_KEYWORDS = [
    "Q&A", "Preguntas y Respuestas", "SECOP", "Licitación", "Aclaración ANI",
    "OD_PROCESO", "Observaciones del Proceso"
]

LEVEL_1_2_KEYWORDS = [
    "AT1", "AT2", "AT3", "Apéndice Técnico", "Sección", "Cláusula", 
    "Contrato de Concesión", "Resolución de Surcos", "Res. 2024"
]

def audit_file(filepath):
    print(f"🔬 Iniciando Auditoría Michelin en: {os.path.basename(filepath)}")
    with open(filepath, 'r') as f:
        content = f.read()

    impurezas = []
    lines = content.split('\n')
    
    for i, line in enumerate(lines):
        # Buscar menciones a Nivel 16
        for kw in LEVEL_16_KEYWORDS:
            if kw.lower() in line.lower():
                impurezas.append({
                    "line": i + 1,
                    "type": "⚠️ ADVERTENCIA NIVEL 16 (BAJA PRELACIÓN)",
                    "content": line.strip(),
                    "reason": f"Mención a documento precontractual '{kw}'. Verificar contra Sec 1.2(d)."
                })
        
        # Buscar menciones a Nivel 1/2
        certified = False
        for kw in LEVEL_1_2_KEYWORDS:
            if kw.lower() in line.lower():
                certified = True
                break
        
        if "Gateway" in line and not certified:
            impurezas.append({
                "line": i + 1,
                "type": "🚨 IMPUREZA CRÍTICA: GATEWAY SIN BASE L1/L2",
                "content": line.strip(),
                "reason": "Referencia a Gateway FENOCO sin cita de Nivel 1 o 2. Posible alucinación de CAPEX."
            })

    if not impurezas:
        print("✅ PLATO CERTIFICADO: No se encontraron impurezas de jerarquía.")
        return True
    
    print(f"❌ SE ENCONTRARON {len(impurezas)} IMPUREZAS:")
    for imp in impurezas:
        print(f"  [{imp['line']}] {imp['type']}: {imp['reason']}")
    return False

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Uso: python3 michelin-verify.py <archivo.md>")
        sys.exit(1)
    
    audit_file(sys.argv[1])
