# 🎨 LFC UX/UI DESIGN SYSTEM (Premium Edition)
> **SSOT Visual del Proyecto LFC2**

## 🏁 Principios de Diseño
1. **Premium First:** La interfaz debe sentirse cara, profesional y de alta gama.
2. **Claridad de Datos:** Lo más importante es que la información técnica/económica sea legible.
3. **Interactividad Viva:** Micro-animaciones para indicar cambios de estado (Hover, Click, Load).

## 🎨 Paleta de Colores (Professional HSL)
- **Primary (Steel Blue):** `hsl(210, 30%, 20%)` - Estructura y cabeceras.
- **Accent (Gold/Amber):** `hsl(45, 100%, 50%)` - Destacados e hitos críticos.
- **Success (Emerald):** `hsl(150, 60%, 40%)` - Ahorros de CAPEX y aprobaciones.
- **Glass Effect:** `background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px);` - Para dashboards modernos.

## 🔡 Tipografía
- **Prioridad:** `Inter`, `Roboto`, u `Outfit` de Google Fonts.
- **Jerarquía:** 
  - `H1`: 2.5rem, bold, letter-spacing -1px.
  - `Body`: 1rem, line-height 1.6.

## ✨ Micro-animaciones (CSS Native)
```css
.card-hover {
    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.card-hover:hover {
    transform: translateY(-5px) scale(1.02);
}
```

## 📊 Visualización de Datos
- **Tablas:** Header fijo, filas con efecto cebra en baja opacidad, resaltar totales en negrita.
- **KPIs:** Cards grandes con sombras suaves (`0 10px 30px rgba(0,0,0,0.1)`).

---
**Dictamen:** "No es solo una herramienta, es una experiencia de decisión corporativa."
