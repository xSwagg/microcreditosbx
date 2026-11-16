import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { obtenerPerfilCompleto } from '../services/auth'

// Estilos del panel: todo el CSS del dashboard vive en este archivo.
const ESTILOS_DASHBOARD = `
/* ============================================================
   Dashboard · Microcréditos BX
   Estilos aislados bajo .dash para no afectar el resto de la app.
   ============================================================ */

.dash {
  --d-bg: #f4f6fb;
  --d-bg-2: #eef2f9;
  --d-card: #ffffff;
  --d-card-2: #f7f9fc;
  --d-line: #e7ebf3;
  --d-text: #101828;
  --d-text-2: #475467;
  --d-muted: #8492a6;
  --d-primary: #4f46e5;
  --d-primary-2: #6366f1;
  --d-primary-soft: #eef0ff;
  --d-green: #0ea472;
  --d-green-soft: #e6f7f0;
  --d-amber: #d97706;
  --d-amber-soft: #fff4e5;
  --d-red: #dc2626;
  --d-red-soft: #fdecec;
  --d-blue: #2563eb;
  --d-blue-soft: #eaf1ff;
  --d-violet: #7c3aed;
  --d-violet-soft: #f2ecff;
  --d-shadow: 0 1px 2px rgba(16, 24, 40, 0.04), 0 10px 28px -16px rgba(16, 24, 40, 0.16);
  --d-radius: 18px;

  display: flex;
  min-height: 100vh;
  background:
    radial-gradient(1100px 560px at 82% -12%, rgba(79, 70, 229, 0.1), transparent 62%),
    radial-gradient(880px 480px at -6% 104%, rgba(14, 164, 114, 0.08), transparent 58%),
    var(--d-bg);
  color: var(--d-text);
  font-family: 'Segoe UI', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
}

.dash--dark {
  --d-bg: #0a1120;
  --d-bg-2: #0f172a;
  --d-card: #111a2e;
  --d-card-2: #0d1628;
  --d-line: #1e2a44;
  --d-text: #e9effb;
  --d-text-2: #a9b7d0;
  --d-muted: #7d8db0;
  --d-primary: #8b8cf8;
  --d-primary-2: #a5a6ff;
  --d-primary-soft: rgba(99, 102, 241, 0.16);
  --d-green: #34d399;
  --d-green-soft: rgba(16, 185, 129, 0.14);
  --d-amber: #fbbf24;
  --d-amber-soft: rgba(245, 158, 11, 0.14);
  --d-red: #f87171;
  --d-red-soft: rgba(239, 68, 68, 0.14);
  --d-blue: #60a5fa;
  --d-blue-soft: rgba(37, 99, 235, 0.18);
  --d-violet: #c084fc;
  --d-violet-soft: rgba(124, 58, 237, 0.18);
  --d-shadow: 0 1px 2px rgba(0, 0, 0, 0.3), 0 16px 32px -20px rgba(0, 0, 0, 0.8);
  background:
    radial-gradient(1000px 520px at 85% -10%, rgba(99, 102, 241, 0.16), transparent 62%),
    radial-gradient(760px 420px at -8% 106%, rgba(16, 185, 129, 0.1), transparent 58%),
    var(--d-bg);
}

/* Reset local: evita que los estilos globales de la app interfieran. */
.dash *,
.dash *::before,
.dash *::after {
  box-sizing: border-box;
}

.dash h1,
.dash h2,
.dash h3,
.dash h4,
.dash p,
.dash ul {
  margin: 0;
  padding: 0;
}

.dash a {
  color: inherit;
  text-decoration: none;
}

.dash button {
  font: inherit;
  color: inherit;
  background: none;
  border: 0;
  cursor: pointer;
}

.dash svg {
  display: block;
}

/* ============================================================
   Sidebar
   ============================================================ */

.dash-sidebar {
  position: fixed;
  inset: 0 auto 0 0;
  z-index: 60;
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: 264px;
  padding: 22px 16px 18px;
  overflow-y: auto;
  color: #cbd5e1;
  background:
    radial-gradient(240px 220px at 16% 0%, rgba(99, 102, 241, 0.4), transparent 70%),
    linear-gradient(180deg, #0c1424 0%, #101d38 55%, #0a1120 100%);
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  transform: translateX(-100%);
  transition: transform 0.28s ease;
}

.dash-sidebar.is-open {
  transform: translateX(0);
}

.dash-brand {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 2px 8px 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.dash-logo {
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  width: 40px;
  height: 40px;
  border-radius: 13px;
  color: #fff;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.02em;
  background: linear-gradient(135deg, #6366f1, #22d3ee);
  box-shadow: 0 8px 20px -8px rgba(99, 102, 241, 0.9);
}

.dash-brand-txt {
  display: flex;
  flex-direction: column;
  line-height: 1.25;
  min-width: 0;
}

.dash-brand-txt strong {
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.dash-brand-txt span {
  font-size: 11px;
  color: #8fa1c0;
}

.dash-sidebar-close {
  display: none;
  margin-left: auto;
  width: 34px;
  height: 34px;
  color: #cbd5e1;
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.12);
  box-shadow: none;
}

.dash-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.dash-nav-label {
  padding: 14px 10px 6px;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #64748b;
}

.dash-nav-item {
  display: flex;
  align-items: center;
  gap: 11px;
  width: 100%;
  padding: 10px 12px;
  border-radius: 11px;
  color: #b6c2d9;
  font-size: 13.5px;
  font-weight: 500;
  text-align: left;
  transition: background 0.18s ease, color 0.18s ease;
}

.dash-nav-item svg {
  flex: 0 0 auto;
  width: 18px;
  height: 18px;
  opacity: 0.92;
}

.dash-nav-item:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.06);
}

.dash-nav-item.is-active {
  color: #fff;
  background: linear-gradient(90deg, rgba(99, 102, 241, 0.32), rgba(99, 102, 241, 0.1));
  box-shadow: inset 0 0 0 1px rgba(129, 140, 248, 0.35);
}

.dash-nav-chevron {
  width: 14px !important;
  height: 14px !important;
  margin-left: auto;
  opacity: 0.6 !important;
}

.dash-nav-badge {
  margin-left: auto;
  padding: 2px 7px;
  border-radius: 999px;
  background: #6366f1;
  color: #fff;
  font-size: 10.5px;
  font-weight: 700;
}

.dash-nivel {
  margin-top: auto;
  padding: 14px;
  border-radius: 15px;
  border: 1px solid rgba(129, 140, 248, 0.25);
  background: linear-gradient(140deg, rgba(99, 102, 241, 0.24), rgba(34, 211, 238, 0.1));
}

.dash-nivel-label {
  display: block;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #93a5c6;
}

.dash-nivel strong {
  display: block;
  margin-top: 4px;
  color: #fff;
  font-size: 16px;
  letter-spacing: -0.01em;
}

.dash-nivel p {
  margin-top: 6px;
  font-size: 11.5px;
  line-height: 1.45;
  color: #94a3b8;
}

.dash-backdrop {
  position: fixed;
  inset: 0;
  z-index: 55;
  background: rgba(6, 12, 24, 0.55);
  backdrop-filter: blur(2px);
}

/* ============================================================
   Layout principal
   ============================================================ */

.dash-main {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}

.dash-topbar {
  position: sticky;
  top: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px clamp(16px, 3vw, 34px);
  background: color-mix(in srgb, var(--d-bg) 84%, transparent);
  border-bottom: 1px solid var(--d-line);
  backdrop-filter: blur(14px);
}

.dash-topbar-title {
  min-width: 0;
}

.dash-topbar-title h1 {
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.dash-topbar-title p {
  margin-top: 1px;
  font-size: 11.5px;
  color: var(--d-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dash-topbar-actions {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-left: auto;
}

.dash-icon-btn {
  position: relative;
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  color: var(--d-text-2);
  background: var(--d-card);
  border: 1px solid var(--d-line);
  box-shadow: var(--d-shadow);
  transition: color 0.18s ease, border-color 0.18s ease, transform 0.18s ease;
}

.dash-icon-btn svg {
  width: 18px;
  height: 18px;
}

.dash-icon-btn:hover {
  color: var(--d-primary);
  border-color: color-mix(in srgb, var(--d-primary) 35%, var(--d-line));
  transform: translateY(-1px);
}

.dash-dot {
  position: absolute;
  top: 9px;
  right: 10px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #f43f5e;
  box-shadow: 0 0 0 2px var(--d-card);
}

.dash-burger {
  flex: 0 0 auto;
}

.dash-user {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 12px 5px 5px;
  border-radius: 999px;
  background: var(--d-card);
  border: 1px solid var(--d-line);
  box-shadow: var(--d-shadow);
}

.dash-avatar {
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  color: #fff;
  font-size: 12.5px;
  font-weight: 700;
  letter-spacing: 0.02em;
  background: linear-gradient(135deg, #6366f1, #a855f7);
}

.dash-user-txt {
  display: flex;
  flex-direction: column;
  line-height: 1.25;
  max-width: 150px;
}

.dash-user-txt strong {
  font-size: 12.5px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dash-user-txt span {
  font-size: 10.5px;
  color: var(--d-muted);
  text-transform: capitalize;
}

.dash-content {
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: 100%;
  max-width: 1500px;
  margin: 0 auto;
  padding: clamp(18px, 3vw, 34px);
}

/* ============================================================
   Hero / encabezados de vista
   ============================================================ */

.dash-hero {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 18px;
  flex-wrap: wrap;
}

.dash-eyebrow {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--d-primary);
}

.dash-hero h2 {
  margin-top: 6px;
  font-size: clamp(24px, 2.6vw, 32px);
  font-weight: 700;
  letter-spacing: -0.025em;
}

.dash-hero-sub {
  max-width: 560px;
  margin-top: 6px;
  font-size: 13.5px;
  color: var(--d-text-2);
}

.dash-hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
}

.dash-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease,
    color 0.18s ease;
}

.dash-btn svg {
  width: 16px;
  height: 16px;
}

.dash-btn--primary {
  color: #fff;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  box-shadow: 0 12px 22px -14px rgba(79, 70, 229, 0.95);
}

.dash-btn--primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 16px 26px -14px rgba(79, 70, 229, 0.95);
}

.dash-btn--ghost {
  color: var(--d-text-2);
  background: var(--d-card);
  border: 1px solid var(--d-line);
  box-shadow: var(--d-shadow);
}

.dash-btn--ghost:hover {
  color: var(--d-primary);
  border-color: color-mix(in srgb, var(--d-primary) 35%, var(--d-line));
}

/* ============================================================
   Tarjetas KPI
   ============================================================ */

.dash-kpis {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(215px, 1fr));
  gap: 15px;
}

.dash-kpi {
  --tono: var(--d-primary);
  --tono-soft: var(--d-primary-soft);
  position: relative;
  padding: 18px;
  overflow: hidden;
  background: var(--d-card);
  border: 1px solid var(--d-line);
  border-radius: var(--d-radius);
  box-shadow: var(--d-shadow);
}

.dash-kpi::after {
  content: '';
  position: absolute;
  right: -34px;
  bottom: -46px;
  width: 128px;
  height: 128px;
  border-radius: 50%;
  background: var(--tono-soft);
  opacity: 0.75;
  pointer-events: none;
}

.dash-kpi--indigo {
  --tono: var(--d-primary);
  --tono-soft: var(--d-primary-soft);
}

.dash-kpi--amber {
  --tono: var(--d-amber);
  --tono-soft: var(--d-amber-soft);
}

.dash-kpi--green {
  --tono: var(--d-green);
  --tono-soft: var(--d-green-soft);
}

.dash-kpi--violet {
  --tono: var(--d-violet);
  --tono-soft: var(--d-violet-soft);
}

.dash-kpi--blue {
  --tono: var(--d-blue);
  --tono-soft: var(--d-blue-soft);
}

.dash-kpi-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}

.dash-kpi-icon {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  color: var(--tono);
  background: var(--tono-soft);
}

.dash-kpi-icon svg {
  width: 20px;
  height: 20px;
}

.dash-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 9px;
  border-radius: 999px;
  font-size: 10.5px;
  font-weight: 700;
  color: var(--tono);
  background: var(--tono-soft);
  white-space: nowrap;
}

.dash-pill svg {
  width: 12px;
  height: 12px;
}

.dash-kpi-label {
  margin-top: 16px;
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--d-muted);
}

.dash-kpi-value {
  margin-top: 5px;
  font-size: 25px;
  font-weight: 700;
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
  line-height: 1.15;
}

.dash-kpi-detail {
  margin-top: 6px;
  font-size: 12px;
  color: var(--d-text-2);
}

/* ============================================================
   Tarjetas y grids
   ============================================================ */

.dash-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
}

.dash-card {
  padding: 20px;
  background: var(--d-card);
  border: 1px solid var(--d-line);
  border-radius: var(--d-radius);
  box-shadow: var(--d-shadow);
}

.dash-card-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.dash-card-head h3 {
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.dash-card-head p {
  margin-top: 3px;
  font-size: 12px;
  color: var(--d-muted);
}

.dash-chip {
  flex: 0 0 auto;
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  color: var(--d-text-2);
  background: var(--d-card-2);
  border: 1px solid var(--d-line);
  white-space: nowrap;
}

.dash-chip--primary {
  color: var(--d-primary);
  background: var(--d-primary-soft);
  border-color: transparent;
}

.dash-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 8px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  color: var(--d-primary);
  white-space: nowrap;
}

.dash-link svg {
  width: 14px;
  height: 14px;
}

.dash-link:hover {
  background: var(--d-primary-soft);
}

/* ============================================================
   Donut / anillo
   ============================================================ */

.dash-donut {
  position: relative;
  flex: 0 0 auto;
}

.dash-donut svg {
  display: block;
}

.dash-donut-center {
  position: absolute;
  inset: 0;
  display: grid;
  place-content: center;
  text-align: center;
}

.dash-donut-center strong {
  font-size: 27px;
  font-weight: 700;
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
}

.dash-donut-center span {
  margin-top: 1px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--d-muted);
}

.dash-donut--anillo .dash-donut-center strong {
  font-size: 21px;
}

.dash-donut-wrap {
  display: flex;
  align-items: center;
  gap: 28px;
  flex-wrap: wrap;
}

.dash-legend {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 14px;
  min-width: 180px;
}

.dash-legend li {
  display: flex;
  align-items: center;
  gap: 10px;
  list-style: none;
}

.dash-punto {
  flex: 0 0 auto;
  width: 10px;
  height: 10px;
  border-radius: 3px;
}

.dash-legend b {
  display: block;
  font-size: 13.5px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.dash-legend small {
  font-size: 11.5px;
  color: var(--d-muted);
}

.dash-perfil-resumen {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.dash-check {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 9px;
  min-width: 180px;
}

.dash-check li {
  display: flex;
  align-items: center;
  gap: 9px;
  list-style: none;
  font-size: 12.5px;
  color: var(--d-text-2);
}

.dash-check li svg {
  flex: 0 0 auto;
  width: 16px;
  height: 16px;
}

.dash-check li.ok svg {
  color: var(--d-green);
}

.dash-check li.no {
  color: var(--d-muted);
}

.dash-check li.no svg {
  opacity: 0.5;
}

/* ============================================================
   Gráfico de barras
   ============================================================ */

.dash-bars {
  display: flex;
  gap: clamp(6px, 1.6vw, 16px);
  height: 208px;
}

.dash-bar-col {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  min-width: 0;
  height: 100%;
}

.dash-bar-value {
  height: 14px;
  font-size: 10.5px;
  font-weight: 600;
  color: var(--d-muted);
  white-space: nowrap;
}

.dash-bar-track {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  flex: 1;
  width: 100%;
}

.dash-bar {
  width: 100%;
  max-width: 44px;
  min-height: 4px;
  border-radius: 8px 8px 5px 5px;
  background: linear-gradient(180deg, #818cf8, #4f46e5);
  box-shadow: 0 8px 16px -12px rgba(79, 70, 229, 0.9);
  transition: height 0.5s ease;
}

.dash-bar:hover {
  filter: brightness(1.08);
}

.dash-bar--cero {
  background: var(--d-line);
  box-shadow: none;
}

.dash-bar-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: capitalize;
  color: var(--d-muted);
}

/* ============================================================
   Tablas
   ============================================================ */

.dash-table-wrap {
  overflow-x: auto;
}

.dash-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12.5px;
}

.dash-table th {
  padding: 9px 12px;
  border: 0;
  border-bottom: 1px solid var(--d-line);
  background: transparent;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  text-align: left;
  color: var(--d-muted);
  white-space: nowrap;
}

.dash-table td {
  padding: 13px 12px;
  border: 0;
  border-bottom: 1px solid var(--d-line);
  color: var(--d-text-2);
  white-space: nowrap;
}

.dash-table tbody tr:last-child td {
  border-bottom: 0;
}

.dash-table tbody tr {
  transition: background 0.16s ease;
}

.dash-table tbody tr:hover {
  background: var(--d-card-2);
}

.dash-table td strong {
  color: var(--d-text);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

/* ============================================================
   Estados / badges
   ============================================================ */

.dash-estado {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 9px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  text-transform: capitalize;
  white-space: nowrap;
}

.dash-estado::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.dash-estado--aprobado {
  color: var(--d-green);
  background: var(--d-green-soft);
}

.dash-estado--pendiente {
  color: var(--d-amber);
  background: var(--d-amber-soft);
}

.dash-estado--revision {
  color: var(--d-blue);
  background: var(--d-blue-soft);
}

.dash-estado--rechazado {
  color: var(--d-red);
  background: var(--d-red-soft);
}

.dash-estado--neutro {
  color: var(--d-text-2);
  background: var(--d-card-2);
}

/* ============================================================
   Créditos
   ============================================================ */

.dash-creditos {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(285px, 1fr));
  gap: 15px;
}

.dash-credito-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.dash-credito-id {
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--d-muted);
}

.dash-credito-head h3 {
  margin-top: 4px;
  font-size: 23px;
  font-weight: 700;
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
}

.dash-credito-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.dash-credito-grid span {
  display: block;
  margin-bottom: 3px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--d-muted);
}

.dash-credito-grid strong {
  font-size: 13px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.dash-progress {
  height: 8px;
  overflow: hidden;
  border-radius: 999px;
  background: var(--d-card-2);
  border: 1px solid var(--d-line);
}

.dash-progress > span {
  display: block;
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #10b981, #34d399);
  transition: width 0.6s ease;
}

.dash-credito-pie {
  margin-top: 10px;
  font-size: 11.5px;
  color: var(--d-muted);
}

/* ============================================================
   Notificaciones
   ============================================================ */

.dash-notif {
  display: flex;
  flex-direction: column;
}

.dash-notif li {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px dashed var(--d-line);
  list-style: none;
}

.dash-notif li:last-child {
  border-bottom: 0;
}

.dash-notif-icon {
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  width: 36px;
  height: 36px;
  border-radius: 11px;
  color: var(--d-primary);
  background: var(--d-primary-soft);
}

.dash-notif-icon svg {
  width: 17px;
  height: 17px;
}

.dash-notif p {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  font-size: 12.5px;
  line-height: 1.5;
  color: var(--d-text);
}

.dash-notif small {
  display: block;
  margin-top: 3px;
  font-size: 11px;
  color: var(--d-muted);
}

.dash-notif--full li {
  align-items: flex-start;
  padding: 15px 2px;
}

.dash-notif--full li.no-leida {
  background: linear-gradient(90deg, var(--d-primary-soft), transparent 70%);
}

.dash-notif-tag {
  margin-left: auto;
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 700;
  color: var(--d-primary);
  background: var(--d-primary-soft);
  white-space: nowrap;
}

/* ============================================================
   Estados vacíos, alertas y carga
   ============================================================ */

.dash-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 34px 16px;
  text-align: center;
}

.dash-empty-icon {
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  margin-bottom: 4px;
  border-radius: 16px;
  color: var(--d-primary);
  background: var(--d-card-2);
  border: 1px dashed var(--d-line);
}

.dash-empty-icon svg {
  width: 24px;
  height: 24px;
}

.dash-empty h4 {
  font-size: 14px;
  font-weight: 700;
}

.dash-empty p {
  max-width: 350px;
  font-size: 12.5px;
  line-height: 1.5;
  color: var(--d-muted);
}

.dash-empty .dash-btn {
  margin-top: 8px;
}

.dash-alerta {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 12px 16px;
  border-radius: 14px;
  font-size: 12.5px;
  color: var(--d-red);
  background: var(--d-red-soft);
  border: 1px solid color-mix(in srgb, var(--d-red) 28%, transparent);
}

.dash-alerta svg {
  flex: 0 0 auto;
  width: 18px;
  height: 18px;
}

.dash-alerta .dash-btn {
  margin-left: auto;
}

.dash--centrado {
  align-items: center;
  justify-content: center;
}

.dash-spinner {
  width: 42px;
  height: 42px;
  border: 3px solid var(--d-line);
  border-top-color: var(--d-primary);
  border-radius: 50%;
  animation: dash-girar 0.8s linear infinite;
}

.dash-skeleton {
  border-radius: 8px;
  background: linear-gradient(
    90deg,
    var(--d-card-2) 25%,
    var(--d-line) 37%,
    var(--d-card-2) 63%
  );
  background-size: 400% 100%;
  animation: dash-brillo 1.4s ease infinite;
}

@keyframes dash-girar {
  to {
    transform: rotate(360deg);
  }
}

@keyframes dash-brillo {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}

/* ============================================================
   Responsive
   ============================================================ */

@media (min-width: 1024px) {
  .dash-sidebar {
    transform: none;
  }

  .dash-main {
    margin-left: 264px;
  }

  .dash-burger,
  .dash-sidebar-close,
  .dash-backdrop {
    display: none;
  }
}

@media (min-width: 1100px) {
  .dash-grid--2 {
    grid-template-columns: 1.6fr 1fr;
  }
}

@media (max-width: 1023px) {
  .dash-sidebar-close {
    display: grid;
  }
}

@media (max-width: 640px) {
  .dash-topbar {
    padding: 12px 16px;
  }

  .dash-topbar-title p {
    display: none;
  }

  .dash-user-txt {
    display: none;
  }

  .dash-user {
    padding: 4px;
  }

  .dash-content {
    padding: 16px;
  }

  .dash-hero-actions {
    width: 100%;
  }

  .dash-hero-actions .dash-btn {
    flex: 1;
    justify-content: center;
  }

  .dash-donut-wrap,
  .dash-perfil-resumen {
    justify-content: center;
  }

  .dash-credito-grid {
    grid-template-columns: 1fr 1fr;
  }

  .dash-alerta {
    flex-wrap: wrap;
  }

  .dash-alerta .dash-btn {
    margin-left: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .dash *,
  .dash *::before,
  .dash *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
`

function EstilosDashboard() {
  return <style>{ESTILOS_DASHBOARD}</style>
}

/* ============================================================
   Utilidades de formato
   ============================================================ */

const numero = (valor) => {
  const n = Number(valor)
  return Number.isFinite(n) ? n : 0
}

const dinero = (valor) =>
  numero(valor).toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  })

const dineroCorto = (valor) => {
  const n = numero(valor)
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1).replace('.', ',')}M`
  if (n >= 1000) return `$${Math.round(n / 1000)}k`
  return `$${n}`
}

const fecha = (valor, opciones = { day: '2-digit', month: 'short', year: 'numeric' }) => {
  if (!valor) return '—'
  const d = new Date(valor)
  if (Number.isNaN(d.getTime())) return String(valor)
  return d.toLocaleDateString('es-CO', opciones)
}

const capitalizar = (texto = '') =>
  texto ? texto.charAt(0).toUpperCase() + texto.slice(1) : ''

const NIVELES = {
  basico: 'Básico',
  intermedio: 'Intermedio',
  avanzado: 'Avanzado',
}

const nombreNivel = (nivel) => NIVELES[nivel] || nivel || 'Básico'

const ESTADOS = {
  pendiente: { texto: 'Pendiente', clase: 'pendiente' },
  en_revision: { texto: 'En revisión', clase: 'revision' },
  aprobado: { texto: 'Aprobado', clase: 'aprobado' },
  rechazado: { texto: 'Rechazado', clase: 'rechazado' },
  pagado: { texto: 'Pagado', clase: 'aprobado' },
  activo: { texto: 'Activo', clase: 'aprobado' },
}

const NAV = [
  { id: 'resumen', texto: 'Resumen', icono: 'grid' },
  { id: 'creditos', texto: 'Mis créditos', icono: 'tarjeta' },
  { id: 'solicitudes', texto: 'Solicitudes', icono: 'documento' },
  { id: 'notificaciones', texto: 'Notificaciones', icono: 'campana' },
]

const TITULOS = {
  resumen: ['Resumen', 'Tu información financiera de un vistazo'],
  creditos: ['Mis créditos', 'Detalle de tus créditos aprobados'],
  solicitudes: ['Solicitudes', 'Historial y estado de tus solicitudes'],
  notificaciones: ['Notificaciones', 'Novedades de tu cuenta'],
}

/* ============================================================
   Iconos (SVG en línea, sin dependencias externas)
   ============================================================ */

const ICONOS = {
  grid: (
    <>
      <rect x="3" y="3" width="7" height="9" rx="1.6" />
      <rect x="14" y="3" width="7" height="5" rx="1.6" />
      <rect x="14" y="12" width="7" height="9" rx="1.6" />
      <rect x="3" y="16" width="7" height="5" rx="1.6" />
    </>
  ),
  tarjeta: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
      <path d="M2.5 10h19" />
      <path d="M6 15h4" />
    </>
  ),
  documento: (
    <>
      <path d="M14 2.5H6.5A2.5 2.5 0 0 0 4 5v14a2.5 2.5 0 0 0 2.5 2.5h11A2.5 2.5 0 0 0 20 19V8.5z" />
      <path d="M14 2.5V9h6" />
      <path d="M8.5 13h7" />
      <path d="M8.5 17h5" />
    </>
  ),
  campana: (
    <>
      <path d="M18 8.5a6 6 0 1 0-12 0c0 6-2.5 7.5-2.5 7.5h17S18 14.5 18 8.5z" />
      <path d="M13.7 20a2 2 0 0 1-3.4 0" />
    </>
  ),
  usuario: (
    <>
      <path d="M20 21v-1.8a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4V21" />
      <circle cx="12" cy="7.5" r="3.8" />
    </>
  ),
  salir: (
    <>
      <path d="M9 21H5.5A2.5 2.5 0 0 1 3 18.5v-13A2.5 2.5 0 0 1 5.5 3H9" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </>
  ),
  menu: (
    <>
      <path d="M3 6h18" />
      <path d="M3 12h18" />
      <path d="M3 18h18" />
    </>
  ),
  cerrar: (
    <>
      <path d="M18 6 6 18" />
      <path d="M6 6l12 12" />
    </>
  ),
  sol: (
    <>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2v2.2M12 19.8V22M2 12h2.2M19.8 12H22M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M19.1 4.9l-1.6 1.6M6.5 17.5l-1.6 1.6" />
    </>
  ),
  luna: <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />,
  flecha: (
    <>
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </>
  ),
  check: (
    <>
      <path d="M20.5 11.1V12a8.5 8.5 0 1 1-5-7.8" />
      <path d="m8.6 11.5 3.2 3.2 8-8.2" />
    </>
  ),
  tendencia: (
    <>
      <path d="m22 7-8.5 8.5-5-5L2 17" />
      <path d="M16 7h6v6" />
    </>
  ),
  escudo: (
    <>
      <path d="M12 22s8-3.8 8-10V5.2L12 2 4 5.2V12c0 6.2 8 10 8 10z" />
      <path d="m9 12 2.2 2.2L15.5 10" />
    </>
  ),
  calendario: (
    <>
      <rect x="3" y="4.5" width="18" height="17" rx="2.5" />
      <path d="M8 2.5v4M16 2.5v4M3 10h18" />
    </>
  ),
  ayuda: (
    <>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M9.3 9.2a2.8 2.8 0 0 1 5.4 1c0 1.9-2.8 2.5-2.8 4" />
      <path d="M12 17.3h.01" />
    </>
  ),
  chevron: <path d="m9 18 6-6-6-6" />,
  chispa: (
    <>
      <path d="M12 3.2 13.8 9l5.8 1.8-5.8 1.8L12 18.4l-1.8-5.8L4.4 10.8 10.2 9z" />
      <path d="M19 3v3M17.5 4.5h3" />
    </>
  ),
  reloj: (
    <>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M12 7v5.2l3.4 2" />
    </>
  ),
  alerta: (
    <>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M12 7.5v5.5" />
      <path d="M12 16.5h.01" />
    </>
  ),
  chart: (
    <>
      <path d="M3 3v18h18" />
      <path d="M7 16v-4M12 16V8M17 16v-6" />
    </>
  ),
  circulo: <circle cx="12" cy="12" r="8.5" />,
}

function Icon({ name, className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICONOS[name]}
    </svg>
  )
}

/* ============================================================
   Piezas reutilizables
   ============================================================ */

function TarjetaKpi({ tono, icono, etiqueta, valor, detalle, extra }) {
  return (
    <article className={`dash-kpi dash-kpi--${tono}`}>
      <div className="dash-kpi-top">
        <span className="dash-kpi-icon">
          <Icon name={icono} />
        </span>
        {extra}
      </div>
      <p className="dash-kpi-label">{etiqueta}</p>
      <p className="dash-kpi-value">{valor}</p>
      <p className="dash-kpi-detail">{detalle}</p>
    </article>
  )
}

function Donut({ valor, etiqueta = 'Pagado', tamano = 180, grosor = 16 }) {
  const pct = Math.min(Math.max(valor, 0), 1)
  const radio = (tamano - grosor) / 2
  const circunferencia = 2 * Math.PI * radio

  return (
    <div className="dash-donut" style={{ width: tamano, height: tamano }}>
      <svg
        width={tamano}
        height={tamano}
        viewBox={`0 0 ${tamano} ${tamano}`}
        role="img"
        aria-label={`${Math.round(pct * 100)}% ${etiqueta}`}
      >
        <defs>
          <linearGradient id="dashDegradado" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
        </defs>
        <circle
          cx={tamano / 2}
          cy={tamano / 2}
          r={radio}
          fill="none"
          stroke="var(--d-line)"
          strokeWidth={grosor}
        />
        <circle
          cx={tamano / 2}
          cy={tamano / 2}
          r={radio}
          fill="none"
          stroke="url(#dashDegradado)"
          strokeWidth={grosor}
          strokeLinecap="round"
          strokeDasharray={`${circunferencia * pct} ${circunferencia}`}
          transform={`rotate(-90 ${tamano / 2} ${tamano / 2})`}
        />
      </svg>
      <div className="dash-donut-center">
        <strong>{Math.round(pct * 100)}%</strong>
        <span>{etiqueta}</span>
      </div>
    </div>
  )
}

function Anillo({ valor, tamano = 108, grosor = 10 }) {
  const pct = Math.min(Math.max(valor, 0), 1)
  const radio = (tamano - grosor) / 2
  const circunferencia = 2 * Math.PI * radio

  return (
    <div className="dash-donut dash-donut--anillo" style={{ width: tamano, height: tamano }}>
      <svg width={tamano} height={tamano} viewBox={`0 0 ${tamano} ${tamano}`} aria-hidden="true">
        <defs>
          <linearGradient id="dashDegradadoAnillo" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
        <circle
          cx={tamano / 2}
          cy={tamano / 2}
          r={radio}
          fill="none"
          stroke="var(--d-line)"
          strokeWidth={grosor}
        />
        <circle
          cx={tamano / 2}
          cy={tamano / 2}
          r={radio}
          fill="none"
          stroke="url(#dashDegradadoAnillo)"
          strokeWidth={grosor}
          strokeLinecap="round"
          strokeDasharray={`${circunferencia * pct} ${circunferencia}`}
          transform={`rotate(-90 ${tamano / 2} ${tamano / 2})`}
        />
      </svg>
      <div className="dash-donut-center">
        <strong>{Math.round(pct * 100)}%</strong>
      </div>
    </div>
  )
}

function Barras({ datos }) {
  const max = Math.max(...datos.map((d) => d.total), 0)

  return (
    <div className="dash-bars">
      {datos.map((d) => {
        const altura = max > 0 ? Math.max((d.total / max) * 100, 3) : 4
        return (
          <div className="dash-bar-col" key={d.clave}>
            <span className="dash-bar-value">{d.total > 0 ? dineroCorto(d.total) : '—'}</span>
            <div className="dash-bar-track">
              <div
                className={`dash-bar ${d.total > 0 ? '' : 'dash-bar--cero'}`}
                style={{ height: `${altura}%` }}
                title={`${capitalizar(d.etiqueta)}: ${dinero(d.total)} · ${d.cantidad} solicitud(es)`}
              />
            </div>
            <span className="dash-bar-label">{d.etiqueta}</span>
          </div>
        )
      })}
    </div>
  )
}

function Estado({ estado }) {
  const info = ESTADOS[estado] || { texto: estado || '—', clase: 'neutro' }
  return <span className={`dash-estado dash-estado--${info.clase}`}>{info.texto}</span>
}

function Vacio({ icono, titulo, texto, accion }) {
  return (
    <div className="dash-empty">
      <span className="dash-empty-icon">
        <Icon name={icono} />
      </span>
      <h4>{titulo}</h4>
      <p>{texto}</p>
      {accion}
    </div>
  )
}

function TablaSolicitudes({ solicitudes }) {
  return (
    <div className="dash-table-wrap">
      <table className="dash-table">
        <thead>
          <tr>
            <th>Solicitud</th>
            <th>Monto</th>
            <th>Fecha</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {solicitudes.map((s) => (
            <tr key={s.id_solicitud}>
              <td>
                <strong>#{String(s.id_solicitud).padStart(4, '0')}</strong>
              </td>
              <td>
                <strong>{dinero(s.monto)}</strong>
              </td>
              <td>{fecha(s.fecha)}</td>
              <td>
                <Estado estado={s.estado} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Esqueleto() {
  return (
    <>
      <section className="dash-hero">
        <div>
          <div className="dash-skeleton" style={{ width: 150, height: 12 }} />
          <div className="dash-skeleton" style={{ width: 280, height: 34, marginTop: 12 }} />
          <div className="dash-skeleton" style={{ width: 340, height: 12, marginTop: 10 }} />
        </div>
      </section>

      <section className="dash-kpis">
        {Array.from({ length: 4 }).map((_, i) => (
          <div className="dash-kpi" key={i}>
            <div className="dash-skeleton" style={{ width: 42, height: 42, borderRadius: 12 }} />
            <div className="dash-skeleton" style={{ width: '55%', height: 12, marginTop: 16 }} />
            <div className="dash-skeleton" style={{ width: '80%', height: 26, marginTop: 10 }} />
            <div className="dash-skeleton" style={{ width: '50%', height: 12, marginTop: 10 }} />
          </div>
        ))}
      </section>

      <section className="dash-grid dash-grid--2">
        <div className="dash-card">
          <div className="dash-skeleton" style={{ height: 210, borderRadius: 14 }} />
        </div>
        <div className="dash-card">
          <div className="dash-skeleton" style={{ height: 210, borderRadius: 14 }} />
        </div>
      </section>
    </>
  )
}

/* ============================================================
   Vistas
   ============================================================ */

function VistaResumen({ datos, resumen, mensual, completitud, onVista }) {
  const nombre = datos.nombre || 'de nuevo'
  const solicitudes = datos.solicitudes || []
  const notificaciones = datos.notificaciones || []

  return (
    <>
      <section className="dash-hero">
        <div>
          <p className="dash-eyebrow">Panel de control</p>
          <h2>Hola, {nombre} 👋</h2>
          <p className="dash-hero-sub">
            Aquí tienes el estado de tu cuenta y el avance de tus microcréditos.
          </p>
        </div>
        <div className="dash-hero-actions">
          <button type="button" className="dash-btn dash-btn--ghost" onClick={() => onVista('solicitudes')}>
            <Icon name="documento" /> Mis solicitudes
          </button>
          <Link to="/perfil" className="dash-btn dash-btn--primary">
            <Icon name="usuario" /> Mi perfil
          </Link>
        </div>
      </section>

      <section className="dash-kpis">
        <TarjetaKpi
          tono="indigo"
          icono="tarjeta"
          etiqueta="Crédito aprobado"
          valor={dinero(resumen.totalAprobado)}
          detalle={`${resumen.creditosCount} crédito${resumen.creditosCount === 1 ? '' : 's'} registrado${resumen.creditosCount === 1 ? '' : 's'}`}
          extra={
            <span className="dash-pill">
              <Icon name="escudo" /> {resumen.activos > 0 ? 'Activo' : 'Sin cartera'}
            </span>
          }
        />
        <TarjetaKpi
          tono="amber"
          icono="tendencia"
          etiqueta="Saldo pendiente"
          valor={dinero(resumen.saldo)}
          detalle={
            resumen.saldo > 0
              ? `de ${dinero(resumen.totalAprobado)} aprobados`
              : 'No tienes saldo por pagar'
          }
        />
        <TarjetaKpi
          tono="green"
          icono="check"
          etiqueta="Cuotas pagadas"
          valor={`${resumen.cuotasPagadas}/${resumen.cuotasTotales}`}
          detalle={`${Math.round(resumen.progreso * 100)}% del crédito pagado`}
        />
        <TarjetaKpi
          tono="violet"
          icono="documento"
          etiqueta="Solicitudes"
          valor={resumen.solicitudesCount}
          detalle={`${resumen.enRevision} en revisión · ${resumen.aprobadas} aprobada${resumen.aprobadas === 1 ? '' : 's'}`}
        />
      </section>

      <section className="dash-grid dash-grid--2">
        <article className="dash-card">
          <header className="dash-card-head">
            <div>
              <h3>Estado de tu crédito</h3>
              <p>Pagos realizados frente al monto aprobado</p>
            </div>
            <span className="dash-chip">
              {resumen.activos} activo{resumen.activos === 1 ? '' : 's'}
            </span>
          </header>

          {resumen.totalAprobado > 0 ? (
            <div className="dash-donut-wrap">
              <Donut valor={resumen.progreso} etiqueta="Pagado" />
              <ul className="dash-legend">
                <li>
                  <span className="dash-punto" style={{ background: 'var(--d-green)' }} />
                  <div>
                    <b>{dinero(resumen.pagado)}</b>
                    <small>Capital pagado</small>
                  </div>
                </li>
                <li>
                  <span className="dash-punto" style={{ background: 'var(--d-amber)' }} />
                  <div>
                    <b>{dinero(resumen.saldo)}</b>
                    <small>Saldo pendiente</small>
                  </div>
                </li>
                <li>
                  <span className="dash-punto" style={{ background: 'var(--d-primary)' }} />
                  <div>
                    <b>{dinero(resumen.totalAprobado)}</b>
                    <small>Total aprobado</small>
                  </div>
                </li>
              </ul>
            </div>
          ) : (
            <Vacio
              icono="tarjeta"
              titulo="Todavía no tienes créditos"
              texto="Cuando una solicitud sea aprobada, podrás seguir aquí el avance de tus pagos."
            />
          )}
        </article>

        <article className="dash-card">
          <header className="dash-card-head">
            <div>
              <h3>Perfil de crédito</h3>
              <p>Completa tus datos para agilizar tus solicitudes</p>
            </div>
            <span className="dash-chip">
              {completitud.ok}/{completitud.items.length} datos
            </span>
          </header>

          <div className="dash-perfil-resumen">
            <Anillo valor={completitud.pct / 100} />
            <ul className="dash-check">
              {completitud.items.map((item) => (
                <li key={item.texto} className={item.ok ? 'ok' : 'no'}>
                  <Icon name={item.ok ? 'check' : 'circulo'} />
                  {item.texto}
                </li>
              ))}
            </ul>
          </div>
        </article>
      </section>

      <section className="dash-grid dash-grid--2">
        <article className="dash-card">
          <header className="dash-card-head">
            <div>
              <h3>Actividad de solicitudes</h3>
              <p>Monto solicitado en los últimos 6 meses</p>
            </div>
            <span className="dash-chip">{resumen.solicitudesCount} en total</span>
          </header>
          <Barras datos={mensual} />
        </article>

        <article className="dash-card">
          <header className="dash-card-head">
            <div>
              <h3>Notificaciones</h3>
              <p>Novedades recientes de tu cuenta</p>
            </div>
            {resumen.noLeidas > 0 && (
              <span className="dash-chip dash-chip--primary">{resumen.noLeidas} nuevas</span>
            )}
          </header>

          {notificaciones.length ? (
            <ul className="dash-notif">
              {notificaciones.slice(0, 3).map((n) => (
                <li key={n.id_notificacion}>
                  <span className="dash-notif-icon">
                    <Icon name="campana" />
                  </span>
                  <div>
                    <p>{n.mensaje}</p>
                    <small>
                      {fecha(n.fecha_envio)} · {n.leida ? 'Leída' : 'Nueva'}
                    </small>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <Vacio
              icono="campana"
              titulo="Sin notificaciones"
              texto="Te avisaremos aquí cuando haya novedades sobre tus créditos."
            />
          )}
        </article>
      </section>

      <section className="dash-card">
        <header className="dash-card-head">
          <div>
            <h3>Últimas solicitudes</h3>
            <p>Historial reciente de tus solicitudes de crédito</p>
          </div>
          <button type="button" className="dash-link" onClick={() => onVista('solicitudes')}>
            Ver todas <Icon name="chevron" />
          </button>
        </header>

        {solicitudes.length ? (
          <TablaSolicitudes solicitudes={solicitudes.slice(0, 5)} />
        ) : (
          <Vacio
            icono="documento"
            titulo="Aún no has solicitado un crédito"
            texto="Tus solicitudes aparecerán aquí con su estado en tiempo real."
          />
        )}
      </section>
    </>
  )
}

function VistaCreditos({ creditos, onVista }) {
  return (
    <>
      <section className="dash-hero">
        <div>
          <p className="dash-eyebrow">Cartera</p>
          <h2>Mis créditos</h2>
          <p className="dash-hero-sub">
            Consulta el avance y las condiciones de cada crédito aprobado.
          </p>
        </div>
      </section>

      {creditos.length ? (
        <section className="dash-creditos">
          {creditos.map((c) => {
            const total = numero(c.monto_aprobado)
            const saldo = numero(c.saldo_pendiente)
            const pagado = Math.max(total - saldo, 0)
            const pct = total > 0 ? Math.min(pagado / total, 1) : 0

            return (
              <article className="dash-card dash-credito" key={c.id_credito}>
                <header className="dash-credito-head">
                  <div>
                    <span className="dash-credito-id">
                      Crédito #{String(c.id_credito).padStart(4, '0')}
                    </span>
                    <h3>{dinero(total)}</h3>
                  </div>
                  <Estado estado={saldo > 0 ? 'activo' : 'pagado'} />
                </header>

                <div className="dash-credito-grid">
                  <div>
                    <span>Saldo pendiente</span>
                    <strong>{dinero(saldo)}</strong>
                  </div>
                  <div>
                    <span>Tasa de interés</span>
                    <strong>{numero(c.tasa_interes)}%</strong>
                  </div>
                  <div>
                    <span>Cuotas</span>
                    <strong>
                      {numero(c.cuotas_pagadas)} / {numero(c.cuotas_totales)}
                    </strong>
                  </div>
                </div>

                <div className="dash-progress">
                  <span style={{ width: `${pct * 100}%` }} />
                </div>
                <p className="dash-credito-pie">
                  {Math.round(pct * 100)}% pagado · Aprobado el {fecha(c.fecha_aprobacion)}
                </p>
              </article>
            )
          })}
        </section>
      ) : (
        <div className="dash-card">
          <Vacio
            icono="tarjeta"
            titulo="Sin créditos activos"
            texto="Cuando tu solicitud sea aprobada, aquí verás el detalle completo de tu crédito."
            accion={
              <button
                type="button"
                className="dash-btn dash-btn--primary"
                onClick={() => onVista('solicitudes')}
              >
                Ver mis solicitudes
              </button>
            }
          />
        </div>
      )}
    </>
  )
}

function VistaSolicitudes({ solicitudes, resumen }) {
  return (
    <>
      <section className="dash-hero">
        <div>
          <p className="dash-eyebrow">Historial</p>
          <h2>Solicitudes</h2>
          <p className="dash-hero-sub">
            Revisa el estado de cada solicitud de crédito que has registrado.
          </p>
        </div>
      </section>

      <section className="dash-kpis">
        <TarjetaKpi
          tono="violet"
          icono="documento"
          etiqueta="Total"
          valor={solicitudes.length}
          detalle="Solicitudes registradas"
        />
        <TarjetaKpi
          tono="blue"
          icono="reloj"
          etiqueta="En revisión"
          valor={resumen.enRevision}
          detalle="Pendientes de respuesta"
        />
        <TarjetaKpi
          tono="green"
          icono="check"
          etiqueta="Aprobadas"
          valor={resumen.aprobadas}
          detalle="Créditos aprobados"
        />
      </section>

      <section className="dash-card">
        <header className="dash-card-head">
          <div>
            <h3>Historial de solicitudes</h3>
            <p>Todas tus solicitudes con su estado actual</p>
          </div>
        </header>

        {solicitudes.length ? (
          <TablaSolicitudes solicitudes={solicitudes} />
        ) : (
          <Vacio
            icono="documento"
            titulo="Aún no tienes solicitudes"
            texto="Cuando registres una solicitud de crédito, aparecerá aquí con su estado."
            accion={
              <Link to="/perfil" className="dash-btn dash-btn--primary">
                Ir a mi perfil
              </Link>
            }
          />
        )}
      </section>
    </>
  )
}

function VistaNotificaciones({ notificaciones }) {
  return (
    <>
      <section className="dash-hero">
        <div>
          <p className="dash-eyebrow">Bandeja</p>
          <h2>Notificaciones</h2>
          <p className="dash-hero-sub">
            Mantente al día con las novedades de tus créditos y tu cuenta.
          </p>
        </div>
      </section>

      <section className="dash-card">
        <header className="dash-card-head">
          <div>
            <h3>Todas las notificaciones</h3>
            <p>Mensajes enviados a tu cuenta</p>
          </div>
          <span className="dash-chip">{notificaciones.length} mensaje(s)</span>
        </header>

        {notificaciones.length ? (
          <ul className="dash-notif dash-notif--full">
            {notificaciones.map((n) => (
              <li key={n.id_notificacion} className={n.leida ? '' : 'no-leida'}>
                <span className="dash-notif-icon">
                  <Icon name="campana" />
                </span>
                <div>
                  <p>{n.mensaje}</p>
                  <small>
                    {fecha(n.fecha_envio, {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </small>
                </div>
                {!n.leida && <span className="dash-notif-tag">Nueva</span>}
              </li>
            ))}
          </ul>
        ) : (
          <Vacio
            icono="campana"
            titulo="Sin notificaciones"
            texto="Cuando haya novedades sobre tus créditos, te avisaremos por aquí."
          />
        )}
      </section>
    </>
  )
}

/* ============================================================
   Página principal
   ============================================================ */

export default function Dashboard() {
  const { user, loading, logout } = useAuth()
  const navigate = useNavigate()

  const [perfil, setPerfil] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [recarga, setRecarga] = useState(0)
  const [vista, setVista] = useState('resumen')
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [oscuro, setOscuro] = useState(() => {
    try {
      return localStorage.getItem('bx-dash-tema') === 'oscuro'
    } catch {
      return false
    }
  })

  useEffect(() => {
    if (!loading && !user) navigate('/login', { replace: true })
  }, [loading, user, navigate])

  useEffect(() => {
    try {
      localStorage.setItem('bx-dash-tema', oscuro ? 'oscuro' : 'claro')
    } catch {
      /* El tema es opcional: si el navegador lo bloquea, se ignora. */
    }
  }, [oscuro])

  useEffect(() => {
    if (!user) return undefined

    let activo = true
    setCargando(true)
    setError('')

    obtenerPerfilCompleto(user.id_usuario)
      .then((data) => {
        if (activo) setPerfil(data)
      })
      .catch((err) => {
        if (activo) {
          setError(err.response?.data?.msg || 'No se pudieron cargar tus datos financieros.')
        }
      })
      .finally(() => {
        if (activo) setCargando(false)
      })

    return () => {
      activo = false
    }
  }, [user, recarga])

  const datos = perfil || user || {}
  const creditos = datos.creditos || []
  const solicitudes = datos.solicitudes || []
  const notificaciones = datos.notificaciones || []

  const resumen = useMemo(() => {
    const totalAprobado = creditos.reduce((suma, c) => suma + numero(c.monto_aprobado), 0)
    const saldo = creditos.reduce((suma, c) => suma + numero(c.saldo_pendiente), 0)
    const pagado = Math.max(totalAprobado - saldo, 0)
    const cuotasTotales = creditos.reduce((suma, c) => suma + numero(c.cuotas_totales), 0)
    const cuotasPagadas = creditos.reduce((suma, c) => suma + numero(c.cuotas_pagadas), 0)

    return {
      totalAprobado,
      saldo,
      pagado,
      cuotasTotales,
      cuotasPagadas,
      progreso: totalAprobado > 0 ? Math.min(pagado / totalAprobado, 1) : 0,
      enRevision: solicitudes.filter(
        (s) => s.estado === 'pendiente' || s.estado === 'en_revision',
      ).length,
      aprobadas: solicitudes.filter((s) => s.estado === 'aprobado').length,
      noLeidas: notificaciones.filter((n) => !n.leida).length,
      activos: creditos.filter((c) => numero(c.saldo_pendiente) > 0).length,
      creditosCount: creditos.length,
      solicitudesCount: solicitudes.length,
    }
  }, [creditos, solicitudes, notificaciones])

  const mensual = useMemo(() => {
    const hoy = new Date()
    const meses = []

    for (let i = 5; i >= 0; i -= 1) {
      const d = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1)
      meses.push({
        clave: `${d.getFullYear()}-${d.getMonth()}`,
        etiqueta: d.toLocaleDateString('es-CO', { month: 'short' }),
        total: 0,
        cantidad: 0,
      })
    }

    const mapa = new Map(meses.map((m) => [m.clave, m]))

    solicitudes.forEach((s) => {
      const d = new Date(s.fecha)
      if (Number.isNaN(d.getTime())) return
      const mes = mapa.get(`${d.getFullYear()}-${d.getMonth()}`)
      if (mes) {
        mes.total += numero(s.monto)
        mes.cantidad += 1
      }
    })

    return meses
  }, [solicitudes])

  const completitud = useMemo(() => {
    const items = [
      { texto: 'Datos personales', ok: Boolean(datos.nombre && datos.apellido) },
      { texto: 'Cédula registrada', ok: Boolean(datos.cedula) },
      { texto: 'Correo registrado', ok: Boolean(datos.correo) },
      { texto: 'Teléfono de contacto', ok: Boolean(datos.telefono) },
      { texto: 'Prueba virtual completada', ok: Boolean(datos.prueba_virtual_completada) },
    ]
    const ok = items.filter((i) => i.ok).length
    return { items, ok, pct: Math.round((ok / items.length) * 100) }
  }, [datos])

  const nombreCompleto = [datos.nombre, datos.apellido].filter(Boolean).join(' ') || 'Mi cuenta'
  const iniciales =
    `${(datos.nombre || '').charAt(0)}${(datos.apellido || '').charAt(0)}`.toUpperCase() || 'BX'

  const [tituloVista, subtituloVista] = TITULOS[vista]

  if (loading || !user) {
    return (
      <div className="dash dash--centrado">
        <EstilosDashboard />
        <span className="dash-spinner" aria-label="Cargando panel" />
      </div>
    )
  }

  const cerrarSesion = () => {
    logout()
    navigate('/')
  }

  return (
    <div className={`dash ${oscuro ? 'dash--dark' : ''}`}>
      <EstilosDashboard />
      {menuAbierto && (
        <button
          type="button"
          className="dash-backdrop"
          aria-label="Cerrar menú"
          onClick={() => setMenuAbierto(false)}
        />
      )}

      <aside className={`dash-sidebar ${menuAbierto ? 'is-open' : ''}`}>
        <div className="dash-brand">
          <span className="dash-logo">BX</span>
          <div className="dash-brand-txt">
            <strong>Microcréditos</strong>
            <span>BX · Panel financiero</span>
          </div>
          <button
            type="button"
            className="dash-icon-btn dash-sidebar-close"
            aria-label="Cerrar menú"
            onClick={() => setMenuAbierto(false)}
          >
            <Icon name="cerrar" />
          </button>
        </div>

        <nav className="dash-nav" aria-label="Menú del panel">
          <span className="dash-nav-label">Principal</span>
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`dash-nav-item ${vista === item.id ? 'is-active' : ''}`}
              onClick={() => {
                setVista(item.id)
                setMenuAbierto(false)
              }}
            >
              <Icon name={item.icono} />
              <span>{item.texto}</span>
              {item.id === 'notificaciones' && resumen.noLeidas > 0 && (
                <span className="dash-nav-badge">{resumen.noLeidas}</span>
              )}
            </button>
          ))}

          <span className="dash-nav-label">Cuenta</span>
          <Link to="/perfil" className="dash-nav-item">
            <Icon name="usuario" />
            <span>Mi perfil</span>
            <Icon name="chevron" className="dash-nav-chevron" />
          </Link>
          <button type="button" className="dash-nav-item" onClick={cerrarSesion}>
            <Icon name="salir" />
            <span>Cerrar sesión</span>
          </button>
        </nav>

        <div className="dash-nivel">
          <span className="dash-nivel-label">Nivel actual</span>
          <strong>{nombreNivel(datos.nivel)}</strong>
          <p>Sigue al día con tus cuotas para acceder a mejores tasas.</p>
        </div>
      </aside>

      <div className="dash-main">
        <header className="dash-topbar">
          <button
            type="button"
            className="dash-icon-btn dash-burger"
            aria-label="Abrir menú"
            onClick={() => setMenuAbierto(true)}
          >
            <Icon name="menu" />
          </button>

          <div className="dash-topbar-title">
            <h1>{tituloVista}</h1>
            <p>{subtituloVista}</p>
          </div>

          <div className="dash-topbar-actions">
            <button
              type="button"
              className="dash-icon-btn"
              aria-label={oscuro ? 'Activar modo claro' : 'Activar modo oscuro'}
              onClick={() => setOscuro((valor) => !valor)}
            >
              <Icon name={oscuro ? 'sol' : 'luna'} />
            </button>

            <button
              type="button"
              className="dash-icon-btn"
              aria-label="Ver notificaciones"
              onClick={() => setVista('notificaciones')}
            >
              <Icon name="campana" />
              {resumen.noLeidas > 0 && <span className="dash-dot" />}
            </button>

            <div className="dash-user">
              <span className="dash-avatar">{iniciales}</span>
              <div className="dash-user-txt">
                <strong>{nombreCompleto}</strong>
                <span>{datos.rol || 'cliente'}</span>
              </div>
            </div>
          </div>
        </header>

        <main className="dash-content">
          {error && (
            <div className="dash-alerta" role="alert">
              <Icon name="alerta" />
              <span>{error}</span>
              <button
                type="button"
                className="dash-btn dash-btn--ghost"
                onClick={() => setRecarga((valor) => valor + 1)}
              >
                Reintentar
              </button>
            </div>
          )}

          {vista === 'resumen' &&
            (cargando ? (
              <Esqueleto />
            ) : (
              <VistaResumen
                datos={datos}
                resumen={resumen}
                mensual={mensual}
                completitud={completitud}
                onVista={setVista}
              />
            ))}

          {vista === 'creditos' && (
            <VistaCreditos creditos={creditos} onVista={setVista} />
          )}

          {vista === 'solicitudes' && (
            <VistaSolicitudes solicitudes={solicitudes} resumen={resumen} />
          )}

          {vista === 'notificaciones' && (
            <VistaNotificaciones notificaciones={notificaciones} />
          )}
        </main>
      </div>
    </div>
  )
}
