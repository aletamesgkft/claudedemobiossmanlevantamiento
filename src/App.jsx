import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// Compressed equipment data: [ubicacion, tipo, marca, modelo, aMfg, aIns, prop, rCar, rFun, fServ, proveedor, observaciones]
const R = [
["SALA 1","VAPORIZADOR","MINDRAY","V60","2023","2025","2","0","0","2025-09-17","PLARRE",""],
["SALA 1","ELECTROCAUTERIO","PLARRE","EP600","2024","2025","2","0","0","2025-09-24","PLARRE",""],
["SALA 1","LÁMPARA QUIRURGICA","","","","","12","4","4","2025-06-24","ACUTECH",""],
["SALA 1","MESA QUIRÚRGICA","PLARRE","","2013","2015","12","4","4","2025-10-09","ACUTECH",""],
["QUIROFANO","ASPIRADOR","THE JOHN BUNN","400-002","","2025","7","3","3","2025-10-09","","VIEJO Y OXIDADO"],
["QUIROFANO","MONITOR SIGNOS VITALES","GE MEDICAL","B20","2013","2025","7","3","3","2023-07-01","","MALAS CONDICIONES"],
["QUIROFANO","LAMPARA QUIRURGICA","DEWIMED","ID140","","","7","4","4","2025-05-01","","NO ENCIENDE"],
["QUIROFANO","MESA OPERACIONES","MAQUET","","2015","2023","7","1","1","2023-01-01","","DESPINTADA"],
["QUIROFANO","MESA OPERACIONES","FEHLMEX","FEH-C-300","2015","2023","7","3","3","2023-07-01","","COLCHONES MAL ESTADO"],
["QUIROFANO 1","MAQ. ANESTESIA","MINDRAY","WATOEX-35","2022","2023","7","1","1","2025-04-01","","SIN RECURSOS"],
["QUIROFANO 1 Y 2","LARINGOSCOPIO","WELCH ALLYN","WEA-KIT","","","12","3","3","2025-10-09","","ALGUNOS SIN LUZ"],
["QX 5","LAMPARA QUIRURGICA","DEWIMED","140","","","12","0","0","2025-10-10","",""],
["SALA 1","MAQ. ANESTESIA","MINDRAY","WATOEX65","2023","2024","2","0","0","2024-06-14","BIOSSMANN",""],
["SALA 1","VAPORIZADOR SEVO","DRAGER","VAPOR-2001","2022","2023","2","0","0","2024-06-14","BIOSSMANN",""],
["SALA 1","LAMPARA QUIRURGICA","FEHJMEX","VG-E628","2023","","12","0","0","1900-01-01","",""],
["SALA DE LABOR","MAQ. ANESTESIA","BIOSSMANN","13000-FE","2017","2023","2","0","0","2024-06-14","BIOSSMANN",""],
["SALA DE LABOR","VAPORIZADOR SEVO","DRAGER","VAPOR-2001","2022","2023","2","1","1","2024-06-14","BIOSSMANN","SEGURO ROTO"],
["SALA DE LABOR","LAMPARA QUIRURGICA","FEHJMEX","VG-E628","2023","","12","0","0","2024-06-14","",""],
["EXPULSION","LAMPARA QUIRURGICA","DEWIMED","ID140","","","12","1","1","2025-10-10","","FALLAS PERSISTENTES"],
["SALA 1","MONITOR SIGNOS VITALES","BIOSSMANN","","2023","2023","2","0","0","2024-05-28","BIOSSMANN",""],
["SALA 1","MODULO DE GASES","BIOSSMANN","","2023","2023","2","1","1","2025-06-04","BIOSSMANN","MAL ESTADO PERO FUNCIONAL"],
["SALA 1","CUNA CALOR RADIANTE","ATMOSCARE","ADVENTUM","2023","","12","0","0","2025-10-10","",""],
["SALA 1","ELECTROCAUTERIO","OLYMPUS","TC-E400","","","12","0","0","2025-10-10","",""],
["SALA 2","MAQ. ANESTESIA","MINDRAY","WATOEX65PRO","2022","2023","11","0","0","2024-04-11","MINDRAY",""],
["SALA 2","SUCCION","CAMI","NEWHOSPIVAC","","2025","7","0","0","1900-01-01","CAMI",""],
["SALA 2","SUCCION","IMEBO","R-35","","2018","7","0","0","1900-01-01","DRAGER",""],
["SALA 2","ELECTROCAUTERIO","OLYMPUS","TC-E400","2022","2018","7","0","0","1900-01-01","OLYMPUS",""],
["SALA 2","LAMPARAS","POLARIS 200","DRAGER","2014","2015","7","0","0","1900-01-01","DRAGER",""],
["SALA 2","LAMPARA","FEHLMEX","FEHLED350M","2023","","7","0","0","1900-01-01","FEHLMEX",""],
["SALA 2","MESA OPERACION","SCHARER MEDICAL","AXIS300E","2016","2015","7","0","0","1900-01-01","SCHARER MEDICAL",""],
["QUIRÓFANO 1","ASPIRADOR PORTÁTIL","BAME","182","2013","2018","12","2","4","2025-10-10","OTRO","DETERIORADO"],
["QUIRÓFANO 1","ELECTROCAUTERIZADOR","CONMED","60-5600","2004","2010","12","0","0","2025-10-10","OPE YAXCHILAN",""],
["QUIRÓFANO 1","ASPIRADOR PORTABLE","HERGOM","7E-A","2017","2021","12","0","0","2025-10-10","OTRO","SIN BASE"],
["QUIRÓFANO 1","LÁMPARAS","ACEM","STARLED3NX","2015","2016","12","4","4","2025-10-10","OTRO","DETERIORADO"],
["QUIRÓFANO 1","LÁMPARAS","ACEM","STARLED3NX","2016","2017","12","1","1","2025-10-10","OTRO","TARDÍO ENCENDIDO"],
["QUIRÓFANO 2","LÁMPARA PORTÁTIL","DEWIMED","136LED","2018","2020","12","4","4","2025-10-10","OTRO","NO FUNCIONAL"],
["EXPULSION","LÁMPARAS","DEWIMED","DEW136","2018","2022","12","4","4","2025-10-10","BIOMEDIC","NO FUNCIONAL"],
["EXPULSION","LÁMPARA QX DOBLE LED","KLS MARTIN","127","2009","2010","12","4","4","2025-10-10","OTRO","NO FUNCIONA"],
["EXPULSIÓN","CAMA CLÍNICA","HILL-ROM","P3700","2023","2023","12","0","0","2025-10-10","OTRO",""],
["EXPULSIÓN","CUNA TÉRMICA","ATMOS","ADVENTUM","2023","2023","12","0","0","2025-10-10","OTRO",""],
["QX1","LAMPARA QX DOBLE","PLARRE","OL9570/70","","2017","2","0","0","2025-07-08","",""],
["QX1","MAQ. ANESTESIA","GE DATEX-OHMEDA","AESPIRE-7100","","2017","2","0","0","2025-07-08","",""],
["QX1","MONITOR SIGNOS VITALES","GENERAL ELECTRIC","CARESCAPE","2015","2017","2","1","1","2025-07-08","",""],
["QX1","ELECTROCIRUGIA","COVIDIEN","FORCE-FX","","2017","2","1","0","2025-07-08","","CABLE CORTO"],
["QUIRÓFANO 3","ELECTROCAUTERIO","CONMED","60-8005","","","7","0","0","2025-10-01","",""],
["QUIRÓFANO 3","ASPIRADOR","BAME","182","2021","","7","0","0","2025-10-01","",""],
["QUIROFANO 1","MONITOR","BIOSSMANN","SV17","2023","2024","2","0","0","2023-04-20","BIOSSMANN","FUNCIONAL"],
["QUIROFANO 1","MAQ. ANESTESIA","FABIUS","PLUS","2019","2019","11","1","1","2025-10-02","DRAGER",""],
["QUIROFANO 1","MONITOR","INFINITY","DELTA","2019","2019","11","1","1","1900-01-01","DRAGER",""],
["QUIROFANO 1","VAPORIT","DAGER","2000","2019","2024","2","0","0","2024-01-01","BIOSSMANN","FUNCIONAL"],
["QUIROFANO 1","VAPORIZADOR","DRAGER","300","2018","2019","11","0","0","1900-01-01","DRAGER","FUNCIONAL"],
["QUIROFANO 1","ASPIRADOR","IMEBIO","R-35","","2019","7","1","1","2025-01-10","IMEBO","FRASCOS INADECUADOS"],
["QUIROFANO 1","CUNA DE CALOR","ATMOSCARE","AT18","","","7","0","0","1900-01-01","ATMOSCARE","FUNCIONAL"],
["QUIROFANO 1","MESA QUIRÚRGICA","BERCHTOLDD","OPEROND","2021","2022","7","0","0","2025-01-10","STRYNKER","FUNCIONAL"],
["QUIROFANO 1","ELECTROCAUTERIO","KLS MARTIN","ME200","","2012","7","1","1","1900-01-01","KLS MARTIN","FALLAS"],
["QUIROFANO 1","LÁMPARAS QX","POLARIS","100/200","2016","","7","1","1","1900-01-01","DRAGER","INCOMPLETOS"],
["QUIROFANO 2","MONITOR","BIOSSMANN","SV17","2023","2024","2","1","1","2025-01-02","BIOSSMANN","FALTA SENSOR"],
["QUIROFANO 2","MAQ. ANESTESIA","FABIUS","PLUS","2023","","7","1","1","1900-01-01","DRAGER","FALTA SENSOR O2"],
["QUIROFANO 2","MONITOR","DRAGER","120S","2022","","7","0","0","1900-01-01","DRAGER","FUNCIONAL"],
["QUIROFANO 2","MESA QUIRÚRGICA","BERCHTOLDD","OPEROND","2021","","7","0","0","1900-01-01","STRYNKER","FUNCIONAL"],
["QUIROFANO 2","ASPIRADOR","IMEBIO","R-35","","","7","1","1","1900-01-01","IMEBIO","INCOMPLETO"],
["QUIROFANO 2","LÁMPARA QX","POLARIS","100/200","2016","","7","1","1","1900-01-01","DRAGER","SIN MANERALES"],
["QUIRÓFANO 3","LÁMPARA","TRUMPF","","2021","","7","0","0","2025-10-01","",""],
["QUIRÓFANO 3","LAMPARA","TRUMPF","","2021","","0","0","0","2025-10-01","",""],
["QUIRÓFANO 3","MESA","SMEW","3008","2006","","7","0","0","2025-10-01","",""],
["QUIRÓFANO 3","MAQ. ANESTESIA","BIOSSMANN","BIOSSMANN","2023","2024","2","0","0","2025-03-04","BIOSSMANN",""],
["QUIROFANO 3","MONITOR SV","BIOSSMANN","","2023","2023","2","0","0","2024-05-24","BIOSSMANN",""],
["QUIROFANO 3","VAPORIZADOR SEVO","DRAGER","","2022","2023","2","0","0","2024-05-24","",""],
["QUIRÓFANO 2","ASPIRADOR","BAME","182","2021","","0","0","0","2025-10-01","",""],
["QUIRÓFANO 2","LAMPARA","TRUMPF","","2021","","7","0","0","2025-10-01","",""],
["QUIRÓFANO 2","LAMPARA","TRUMPF","","2021","","7","0","0","2025-10-01","",""],
["QUIRÓFANO 2","ELECTROCAUTERIO","CONMED","60-8005","2021","","7","0","0","2025-10-01","",""],
["QUIRÓFANO 2","MAQ. ANESTESIA","DRAGER","","2020","","7","0","0","2025-10-01","",""],
["QUIRÓFANO 2","MONITOR SV","DRAGER","","2020","","7","4","4","2025-10-01","",""],
["QUIRÓFANO 2","MONITOR SV","BIOSSMANN","","2023","2023","2","0","0","2024-05-24","",""],
["QUIRÓFANO 2","MESA","JIECANG","","","","7","0","0","2025-10-01","",""],
["QUIRÓFANO 2","VAPORIZADOR DESF","DRAGER","","2016","","7","0","0","2025-10-01","",""],
["QUIRÓFANO 2","VAPORIZADOR SEVO","DRAGER","","","","7","0","0","2025-10-01","",""],
["QUIRÓFANO 1","MESA","ADVANCED","OT-500","2021","","7","0","0","2025-10-01","",""],
["QUIRÓFANO 1","ASPIRADOR","BAME","182","2021","","7","0","0","2025-10-01","",""],
["QUIRÓFANO 1","ELECTROCAUTERIO","CONMED","60-8005","2021","","7","0","0","2025-10-01","",""],
["QUIRÓFANO 1","MONITOR SV","BIOSSMANN","","2023","2023","2","0","0","2024-05-24","",""],
["QUIRÓFANO 1","MAQ. ANESTESIA","DRAGER","","2020","","7","0","0","2025-10-01","",""],
["QUIRÓFANO 1","MONITOR SV","DRAGER","","2020","","7","4","4","2025-10-01","",""],
["QUIRÓFANO 1","LÁMPARA","TRUMPF","","2021","","7","0","0","2025-10-01","",""],
["QUIRÓFANO 1","LÁMPARA","TRUMPF","","2021","","7","0","0","2025-10-01","",""],
["QUIRÓFANO 1","RAYOS X","GENERAL MEDICAL","","2021","2023","12","0","0","2023-08-14","REMSA",""],
["QUIRÓFANO 4","MONITOR SV","BIOSSMANN","","2023","2023","2","0","0","2024-05-24","",""],
["QUIRÓFANO 4","MAQ. ANESTESIA","BIOSSMANN","","2019","","7","0","0","2025-10-01","",""],
["QUIRÓFANO 4","ASPIRADOR","BAME","185","2021","","7","0","0","2025-10-01","",""],
["QUIRÓFANO 4","ASPIRADOR","BAME","185","2021","","7","0","0","2025-10-01","",""],
["QUIRÓFANO 4","ELECTROCAUTERIO","CONMED","60-8005","2021","","7","0","0","2025-10-01","",""],
["QUIRÓFANO 4","MESA","ADVANCED","OT-500","2021","","7","0","0","2025-10-01","",""],
["QUIRÓFANO 4","VAPORIZADOR SEVO","PENLON","","2017","","7","0","0","2025-10-01","",""],
["QUIRÓFANO 1","VAPORIZADOR SEVO","DRAGER","","2021","","7","0","0","2025-10-01","",""],
["QUIRÓFANO 1","VAPORIZADOR DESF","DRAGER","","2016","","7","0","0","2025-10-01","",""],
["EXPULSIÓN 1","ASPIRADOR","BAME","182","2021","","7","0","0","2025-10-01","",""],
["EXPULSIÓN 1","LÁMPARA","RIMSA","","2018","","7","0","0","2025-10-01","",""],
["EXPULSIÓN 1","MESA","JIECANG","","","","7","0","0","2025-10-01","",""],
["EXPULSIÓN 1","MAQ. ANESTESIA","DRAGER","","","","7","0","0","2025-10-01","",""],
["EXPULSIÓN 1","MONITOR SV","DRAGER","","2013","","7","1","1","2025-10-01","",""]
];

// Expand to objects
const EQUIPOS = R.map(r => ({
  ubi: r[0], tipo: r[1], marca: r[2], modelo: r[3],
  aMfg: r[4], aIns: r[5], prop: r[6], rCar: r[7],
  rFun: r[8], fServ: r[9], prov: r[10], obs: r[11]
}));

const ESCALA = {
  "0": "Completamente Operativo", "1": "Op. con limitaciones",
  "2": "Op. no adecuado", "3": "Semi funcional",
  "4": "No funcional", "5": "No apto"
};
const PROP_MAP = { "2": "BIOSSMANN", "7": "HOSPITAL", "11": "PLARRE", "12": "PROP. HOSPITAL" };
const YR = 2026;
const PIE_C = ["#F37021", "#4D4D4D", "#FFA726", "#78909C", "#FF7043", "#9E9E9E", "#BDBDBD"];

// ── CATÁLOGOS NORMALIZADOS (extraídos del Excel) ──
const CAT_UBICACION = [
  "QUIRÓFANO 1","QUIRÓFANO 2","QUIRÓFANO 3","QUIRÓFANO 4","QUIRÓFANO 5",
  "SALA 1","SALA 2","SALA DE LABOR","EXPULSIÓN","EXPULSIÓN 1"
];
const CAT_TIPO = [
  "ASPIRADOR","CAMA CLÍNICA","CUNA DE CALOR RADIANTE","CUNA TÉRMICA",
  "ELECTROCAUTERIO","LÁMPARA QUIRÚRGICA","LÁMPARA PORTÁTIL","LARINGOSCOPIO",
  "MÁQUINA DE ANESTESIA","MESA QUIRÚRGICA","MÓDULO DE GASES",
  "MONITOR DE SIGNOS VITALES","RAYOS X","SUCCIÓN",
  "UNIDAD DE ELECTROCIRUGÍA","VAPORIZADOR","VAPORIZADOR SEVOFLURANO",
  "VAPORIZADOR DESFLURANO"
];
const CAT_MARCA = [
  "ACEM","ADVANCED","ATMOSCARE","BAME","BERCHTOLD","BIOSSMANN","CAMI",
  "CONMED","COVIDIEN","DEWIMED","DRAGER","FABIUS","FEHLMEX",
  "GE DATEX-OHMEDA","GE MEDICAL SYSTEMS","GENERAL ELECTRIC","HERGOM",
  "HILL-ROM","IMEBIO","INFINITY","JIECANG","KLS MARTIN",
  "MAQUET","MINDRAY","OLYMPUS","PENLON","PLARRE","POLARIS",
  "RIMSA","SCHARER MEDICAL","SMEW","TRUMPF","WELCH ALLYN"
];
const CAT_PROPIEDAD = [
  "HOSPITAL","PROPIEDAD DEL HOSPITAL","BIOSSMANN","PLARRE","DRAGER",
  "SSA","SSA PUEBLA","IMSS BIENESTAR","DONACIÓN","KBN","SIDYR",
  "REMSA","MEDTRONIC","OTRO"
];
const CAT_PROVEEDOR = [
  "ACUTECH","ATMOSCARE","BIOMEDIC","BIOSSMANN","CAMI","DRAGER","FEHLMEX",
  "IMEBIO","KLS MARTIN","MINDRAY","OLYMPUS","OPE YAXCHILAN","PLARRE",
  "REMSA","SCHARER MEDICAL","STRYKER","OTRO"
];
const CAT_RIESGO = [
  {id:"0",label:"0 - Completamente Operativo"},
  {id:"1",label:"1 - Operativo con limitaciones"},
  {id:"2",label:"2 - Operativo no adecuado"},
  {id:"3",label:"3 - Semi funcional"},
  {id:"4",label:"4 - No funcional"},
  {id:"5",label:"5 - No apto"}
];

// ── METRICS ──
function calcMetrics(data) {
  const N = data.length;
  const vServ = f => f && f !== "1900-01-01" && f.length >= 10;
  const age = e => (e.aMfg && +e.aMfg > 1900) ? YR - +e.aMfg : null;
  const insAge = e => (e.aIns && +e.aIns > 1900) ? YR - +e.aIns : null;
  const hiRisk = e => ["3","4","5"].includes(e.rFun);
  const isOp = e => ["0","1","2"].includes(e.rFun);
  const sixMo = new Date();
  sixMo.setMonth(sixMo.getMonth() - 6);

  const ages = data.map(age).filter(a => a !== null);
  const m1 = ages.length ? (ages.reduce((a,b) => a+b, 0) / ages.length).toFixed(1) : "N/D";
  const over6 = ages.filter(a => a > 6).length;
  const m2 = ages.length ? ((over6 / ages.length) * 100).toFixed(1) : "N/D";
  const badMaint = data.filter(e => !vServ(e.fServ) || new Date(e.fServ) < sixMo).length;
  const m3 = ((badMaint / N) * 100).toFixed(1);
  const pM = {};
  data.forEach(e => { const p = (e.prov && !e.prov.includes("SIN") && e.prov.trim()) ? e.prov.trim() : "SIN PROVEEDOR"; pM[p] = (pM[p]||0)+1; });
  const m4 = Object.entries(pM).sort((a,b) => b[1]-a[1]).map(([name,value]) => ({name,value}));
  const rU = {};
  data.forEach(e => { if (!rU[e.ubi]) rU[e.ubi] = {s:0,c:0}; rU[e.ubi].s += +e.rCar||0; rU[e.ubi].c++; });
  const m5q = Object.entries(rU).map(([name,v]) => ({name, value: +(v.s/v.c).toFixed(2)})).sort((a,b) => b.value-a.value);
  const m5 = (data.reduce((s,e) => s+(+e.rCar||0), 0) / N).toFixed(2);
  const crit = data.filter(hiRisk).length;
  const m6 = ((crit/N)*100).toFixed(1);
  const op = data.filter(isOp).length;
  const m7 = ((op/N)*100).toFixed(1);
  const iA = data.map(insAge).filter(a => a !== null);
  const m8 = iA.length ? (iA.reduce((a,b) => a+b, 0) / iA.length).toFixed(1) : "N/D";
  const hOwn = data.filter(e => ["7","12"].includes(e.prop)).length;
  const m9h = ((hOwn/N)*100).toFixed(1);
  const m9p = (100-parseFloat(m9h)).toFixed(1);
  const sOL = new Set(), sHR = new Set(), sNM = new Set();
  data.forEach((e,i) => { const a=age(e); if(a!==null&&a>6)sOL.add(i); if(hiRisk(e))sHR.add(i); if(!vServ(e.fServ)||new Date(e.fServ)<sixMo)sNM.add(i); });
  const imtS = new Set([...sOL,...sHR,...sNM]);
  const m10 = ((imtS.size/N)*100).toFixed(1);
  const qx = {};
  data.forEach(e => {
    if(!qx[e.ubi]) qx[e.ubi]={rs:0,as:0,c:0,ac:0,cr:0};
    const q=qx[e.ubi]; q.rs+=(+e.rCar||0)+(+e.rFun||0); q.c++;
    const a=age(e); if(a!==null){q.as+=a;q.ac++;} if(hiRisk(e))q.cr++;
  });
  const m11 = Object.entries(qx).map(([name,v]) => {
    const ri = +(v.rs/2/v.c).toFixed(2);
    const sc = +(ri*0.5 + (v.cr/v.c)*0.3 + ((v.ac?v.as/v.ac:0)/10)*0.2).toFixed(3);
    return {name, eq:v.c, riesgo:ri, criticos:v.cr, score:sc};
  }).sort((a,b) => b.score-a.score);
  const rDist = {};
  data.forEach(e => { const k=ESCALA[e.rFun]||"?"; rDist[k]=(rDist[k]||0)+1; });
  const riskChart = Object.entries(rDist).sort((a,b) => b[1]-a[1]).map(([name,value]) => ({name,value}));
  return {N,m1,m2,m3,m4,m5,m5q,m6,m7,m8,m9h,m9p,m10,m11,riskChart,over6,crit,op,badMaint,agesN:ages.length};
}

// ── API ──
async function askClaude(sys, msg) {
  try {
    const r = await fetch("/api/claude", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: sys,
        messages: [{ role: "user", content: msg }]
      })
    });
    const d = await r.json();
    return d.content?.map(b => b.text || "").join("\n") || "Sin respuesta";
  } catch (err) {
    return "Error de conexión: " + err.message;
  }
}

// ── STYLES (Biossmann: white bg, #F37021 orange, #4D4D4D gray) ──
const FN = "'DM Sans', system-ui, sans-serif";
const ORANGE = "#F37021";
const GRAY = "#4D4D4D";
const cs = {
  app: { fontFamily: FN, background: "#F5F7FA", minHeight: "100vh", color: GRAY },
  card: { background: "#fff", borderRadius: 12, border: "1px solid #E0E4EA", margin: "10px 12px", padding: 18, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" },
  inp: { width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #D1D5DB", background: "#fff", color: GRAY, fontSize: 13, fontFamily: FN, outline: "none", boxSizing: "border-box" },
  lbl: { fontSize: 10, fontWeight: 600, color: "#6B7280", marginBottom: 3, display: "block", textTransform: "uppercase", letterSpacing: "0.05em" },
  btn: { background: ORANGE, color: "#fff", border: "none", borderRadius: 8, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FN, display: "inline-flex", alignItems: "center", gap: 6 },
  btn2: { background: "#fff", color: "#6B7280", border: "1px solid #D1D5DB", borderRadius: 8, padding: "7px 14px", fontSize: 12, cursor: "pointer", fontFamily: FN },
};


// ── TAB 1: GUIDED VOICE CHAT (block-based) ──
const RISK_LABELS = {
  "0": "Completamente Operativo", "1": "Operativo con limitaciones",
  "2": "Operativo no adecuado", "3": "Semi funcional",
  "4": "No funcional", "5": "No apto"
};

const HEADER_BLOCK = {
  ask: "Indique el hospital y el nombre del responsable del levantamiento.",
  keys: ["idHospital", "nombre", "apPaterno", "apMaterno"],
  extractPrompt: `Eres un asistente de captura de datos hospitalarios. Extrae la información que el usuario proporcione de forma conversacional.

CAMPOS A EXTRAER (JSON puro sin backticks):
- idHospital: ID numérico o nombre/siglas del hospital (SEDENA, IMSS, ISSSTE, Angeles, etc.)
- nombre: nombre(s) de pila del responsable
- apPaterno: apellido paterno del responsable
- apMaterno: apellido materno del responsable (puede estar vacío)

EJEMPLOS de cómo el usuario puede hablar:
- "Sedena, soy Alejandro Tamez González" → {"idHospital":"SEDENA","nombre":"ALEJANDRO","apPaterno":"TAMEZ","apMaterno":"GONZÁLEZ"}
- "hospital 1596 el responsable es María López" → {"idHospital":"1596","nombre":"MARÍA","apPaterno":"LÓPEZ","apMaterno":""}
- "Selena" → {"idHospital":"SELENA","nombre":"","apPaterno":"","apMaterno":""}
- "yo soy el ingeniero Pedro Ruiz Flores" → {"idHospital":"","nombre":"PEDRO","apPaterno":"RUIZ","apMaterno":"FLORES"}
- "1596, Nestor Galvez" → {"idHospital":"1596","nombre":"NESTOR","apPaterno":"GALVEZ","apMaterno":""}

REGLAS:
- Extrae TODO lo que puedas inferir del texto, aunque no esté en formato estructurado
- Los nombres van en MAYÚSCULAS
- Si solo da un dato (hospital O nombre), extrae ese y deja los demás vacíos ""
- Si dice "soy [nombre]", infiere que es el responsable
- SIEMPRE devuelve JSON, incluso si solo tiene un campo lleno
- JSON puro, sin explicaciones, sin backticks.`
};

const EQUIP_BLOCKS = [
  {
    id: "block1",
    ask: "Indique ubicación, tipo de equipo y marca.",
    keys: ["ubicacion", "tipoEquipo", "marca"],
    extractPrompt: `Eres un asistente de captura de equipos médicos hospitalarios. El usuario habla de forma natural, posiblemente por voz. Extrae del texto estos campos como JSON puro sin backticks:
- ubicacion: normaliza a uno de [${CAT_UBICACION.join(", ")}]. Ej: "quirofano uno"→"QUIRÓFANO 1", "sala uno"→"SALA 1", "expulsión"→"EXPULSIÓN"
- tipoEquipo: normaliza a uno de [${CAT_TIPO.join(", ")}]. Ej: "cauterio/electrocauterizador"→"ELECTROCAUTERIO", "mesa de operaciones"→"MESA QUIRÚRGICA", "lampara"→"LÁMPARA QUIRÚRGICA", "monitor"→"MONITOR DE SIGNOS VITALES", "maquina de anestesia"→"MÁQUINA DE ANESTESIA", "aspirador portátil"→"ASPIRADOR", "succión/succionador"→"SUCCIÓN"
- marca: normaliza a uno de [${CAT_MARCA.join(", ")}]. Ej: "drager/dräger"→"DRAGER", "biosman"→"BIOSSMANN", "conmed aspen"→"CONMED"
Si algo no coincide con el catálogo, pon "OTRO". Si un campo no se menciona, pon "". JSON puro.`
  },
  {
    id: "block2",
    ask: "Indique modelo, número de serie y año de manufactura.",
    keys: ["modelo", "numSerie", "anioManufactura"],
    extractPrompt: `Eres un asistente de captura de equipos médicos. El usuario habla de forma natural. Extrae como JSON puro sin backticks:
- modelo: texto del modelo del equipo
- numSerie: número o código de serie
- anioManufactura: año en formato YYYY. Si dice "dos mil veintitrés"→"2023"
Si dice "no sé" o "sin dato" para algún campo, pon "". JSON puro.`
  },
  {
    id: "block3",
    ask: "Indique año de instalación, propiedad y proveedor de servicio.",
    keys: ["anioInstalacion", "propiedad", "proveedor"],
    extractPrompt: `Eres un asistente de captura de equipos médicos. Extrae como JSON puro sin backticks:
- anioInstalacion: año YYYY
- propiedad: normaliza a uno de [${CAT_PROPIEDAD.join(", ")}]. "del hospital/propio/es del hospital"→"HOSPITAL", "de biossmann"→"BIOSSMANN", "no sé/desconocido"→"OTRO"
- proveedor: normaliza a uno de [${CAT_PROVEEDOR.join(", ")}]. Normaliza errores ortográficos. "no sé/sin dato"→""
Si no coincide con catálogo pon "OTRO". JSON puro.`
  },
  {
    id: "block4",
    ask: "Riesgo por características físicas (0-5), riesgo por funcionamiento (0-5) y fecha del último servicio.\n\nEscala: 0=Operativo, 1=Con limitaciones, 2=No adecuado, 3=Semi funcional, 4=No funcional, 5=No apto",
    keys: ["riesgoCaract", "riesgoFunc", "fechaServicio"],
    extractPrompt: `Eres un asistente de captura. El usuario indica niveles de riesgo y una fecha. Extrae como JSON puro sin backticks:
- riesgoCaract: número 0-5. Si dice "cero"→"0", "funciona bien"→"0", "tiene problemas"→"3", "no sirve"→"4"
- riesgoFunc: número 0-5. Misma lógica.
- fechaServicio: fecha en YYYY-MM-DD. "octubre 2025"→"2025-10-01", "hace 6 meses"→calcular aprox, "no sé/nunca"→""
Si dice dos números seguidos como "cero y cero" o "0 0", el primero es riesgoCaract y el segundo riesgoFunc.
JSON puro.`
  },
  {
    id: "block5",
    ask: "Accesorios presentes y observaciones adicionales.",
    keys: ["accesorios", "observaciones"],
    extractPrompt: `Eres un asistente de captura. Extrae como JSON puro sin backticks:
- accesorios: descripción de accesorios presentes. "ninguno/nada/no tiene"→""
- observaciones: notas adicionales sobre el equipo. "ninguna/nada/todo bien"→""
Si el usuario dice algo como "funciona bien, tiene todos sus cables", separa: accesorios="CABLES COMPLETOS", observaciones="FUNCIONAL".
JSON puro.`
  }
];

function GuidedChat() {
  // Phases: idle → header → equip → confirmEquip → askMore → askLocation → equip → ... → finalReview → sent
  const [phase, setPhase] = useState("idle");
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [blockIdx, setBlockIdx] = useState(0);
  const [header, setHeader] = useState({});
  const [equip, setEquip] = useState({});
  const [allEquips, setAllEquips] = useState([]);
  const [lastUbi, setLastUbi] = useState("");
  const [listening, setListening] = useState(false);
  const endRef = useRef(null);
  const recRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const addBot = (text) => setMsgs((p) => [...p, { from: "bot", text }]);
  const addUser = (text) => setMsgs((p) => [...p, { from: "user", text }]);

  // ── Start ──
  const startNew = () => {
    setMsgs([]);
    const today = new Date().toISOString().split("T")[0];
    setHeader({ fecha: today });
    setEquip({});
    setAllEquips([]);
    setLastUbi("");
    setBlockIdx(0);
    setPhase("header");
    setTimeout(() => {
      addBot(`Fecha del levantamiento: **${today}**\n\n` + HEADER_BLOCK.ask);
    }, 300);
  };

  // ── Voice ──
  const toggleVoice = () => {
    if (listening) { recRef.current?.stop(); setListening(false); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { addBot("Reconocimiento de voz no disponible en este navegador."); return; }
    try {
      const rec = new SR();
      rec.lang = "es-MX";
      rec.continuous = false;
      rec.interimResults = false;
      rec.onresult = (e) => {
        const t = e.results[0][0].transcript;
        setInput(t);
        setTimeout(() => processInput(t), 300);
      };
      rec.onerror = () => setListening(false);
      rec.onend = () => setListening(false);
      recRef.current = rec;
      rec.start();
      setListening(true);
    } catch (e) { addBot("Error al iniciar reconocimiento de voz."); }
  };

  // ── Extract fields via Claude ──
  const extractFields = async (text, prompt, keys) => {
    const res = await askClaude(prompt, `Texto del usuario: "${text}"`);
    try {
      const clean = res.replace(/```json|```/g, "").trim();
      const match = clean.match(/\{[\s\S]*\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        const result = {};
        keys.forEach((k) => {
          if (parsed[k] !== undefined && parsed[k] !== null) result[k] = String(parsed[k]);
        });
        return result;
      }
    } catch (e) { /* fall through */ }
    return null;
  };

  // ── Format extracted values for confirmation ──
  const formatExtracted = (fields) => {
    return Object.entries(fields).map(([k, v]) => {
      if (!v) return null;
      const labels = {
        idHospital: "Hospital", nombre: "Nombre", apPaterno: "Ap. Paterno", apMaterno: "Ap. Materno",
        ubicacion: "Ubicación", tipoEquipo: "Tipo", marca: "Marca", modelo: "Modelo",
        numSerie: "No. Serie", anioManufactura: "Año Mfg", anioInstalacion: "Año Inst",
        propiedad: "Propiedad", proveedor: "Proveedor",
        riesgoCaract: "Riesgo Caract", riesgoFunc: "Riesgo Func", fechaServicio: "Últ. Servicio",
        accesorios: "Accesorios", observaciones: "Observaciones"
      };
      const label = labels[k] || k;
      const display = (k === "riesgoCaract" || k === "riesgoFunc") ? `${v} (${RISK_LABELS[v] || ""})` : v;
      return `• ${label}: **${display}**`;
    }).filter(Boolean).join("\n");
  };

  // ── Full equip summary ──
  const equipSummary = (eq) => {
    const lines = [
      `• Ubicación: ${eq.ubicacion || "—"}`,
      `• Tipo: ${eq.tipoEquipo || "—"}`,
      `• Marca: ${eq.marca || "—"}`,
      `• Modelo: ${eq.modelo || "—"}`,
      `• No. Serie: ${eq.numSerie || "—"}`,
      `• Año Mfg: ${eq.anioManufactura || "—"}`,
      `• Año Inst: ${eq.anioInstalacion || "—"}`,
      `• Propiedad: ${eq.propiedad || "—"}`,
      `• Riesgo Caract: ${eq.riesgoCaract || "—"} (${RISK_LABELS[eq.riesgoCaract] || ""})`,
      `• Riesgo Func: ${eq.riesgoFunc || "—"} (${RISK_LABELS[eq.riesgoFunc] || ""})`,
      `• Últ. Servicio: ${eq.fechaServicio || "—"}`,
      `• Proveedor: ${eq.proveedor || "—"}`,
      `• Accesorios: ${eq.accesorios || "—"}`,
      `• Observaciones: ${eq.observaciones || "—"}`
    ];
    return `**Resumen del equipo:**\n` + lines.join("\n");
  };

  // ── Final summary ──
  const finalSummary = (eqs) => {
    let t = `**Resumen del Levantamiento**\n\n`;
    t += `• Fecha: ${header.fecha || "—"}\n`;
    t += `• Hospital: ${header.idHospital || "—"}\n`;
    t += `• Responsable: ${header.nombre || ""} ${header.apPaterno || ""} ${header.apMaterno || ""}\n\n`;
    t += `**Equipos registrados: ${eqs.length}**\n\n`;
    eqs.forEach((eq, i) => {
      t += `**${i + 1}.** ${eq.tipoEquipo} — ${eq.marca} ${eq.modelo || ""} (${eq.ubicacion})\n`;
      t += `   Serie: ${eq.numSerie || "—"} | Mfg: ${eq.anioManufactura || "—"} | Riesgo: ${eq.riesgoCaract}/${eq.riesgoFunc}\n\n`;
    });
    t += `¿Confirma el envío de este levantamiento?`;
    return t;
  };

  const isYes = (t) => {
    const l = t.toLowerCase().trim();
    return l === "s" || l === "si" || l === "sí" || l.includes("correcto") || l.includes("ok") || l === "yes";
  };

  // ── Main processor ──
  const processInput = async (rawText) => {
    const text = (rawText || input).trim();
    if (!text || busy) return;
    setInput("");
    addUser(text);
    setBusy(true);

    try {
      // ── CONFIRM EQUIP ──
      if (phase === "confirmEquip") {
        if (isYes(text)) {
          const saved = { ...equip };
          const newList = [...allEquips, saved];
          setAllEquips(newList);
          setLastUbi(saved.ubicacion);
          addBot("Equipo registrado correctamente.");
          setTimeout(() => {
            addBot("¿Desea registrar otro equipo?");
            setPhase("askMore");
          }, 400);
        } else {
          // Try to detect if user is giving a correction directly
          addBot("¿Qué dato desea corregir? Puede indicarlo directamente, por ejemplo:\n• \"La marca es DRAGER\"\n• \"Modelo WATOEX65\"\n• \"Riesgo funcionamiento 3\"\n\nO diga **\"repetir todo\"** para capturar este equipo desde el inicio.");
          setPhase("correcting");
        }
        setBusy(false);
        return;
      }

      // ── CORRECTING A FIELD ──
      if (phase === "correcting") {
        const lower = text.toLowerCase();
        if (lower.includes("repetir") || lower.includes("reiniciar") || lower.includes("desde el inicio")) {
          setEquip({});
          setBlockIdx(0);
          setPhase("equip");
          addBot("Se descartarán los datos. Ingrese el equipo nuevamente.");
          setTimeout(() => addBot(EQUIP_BLOCKS[0].ask), 400);
          setBusy(false);
          return;
        }

        // Use Claude to figure out which field the user wants to correct
        const correctionPrompt = `El usuario quiere corregir un dato de un equipo médico. Identifica qué campo quiere cambiar y cuál es el nuevo valor.

Campos posibles y sus claves JSON:
- ubicacion: ubicación/quirófano/sala
- tipoEquipo: tipo de equipo
- marca: marca del equipo
- modelo: modelo
- numSerie: número de serie
- anioManufactura: año de manufactura
- anioInstalacion: año de instalación
- propiedad: propiedad/propietario
- riesgoCaract: riesgo características/riesgo físico (0-5)
- riesgoFunc: riesgo funcionamiento (0-5)
- fechaServicio: fecha último servicio
- proveedor: proveedor de servicio
- accesorios: accesorios
- observaciones: observaciones

Para campos con catálogo, normaliza:
- ubicacion: [${CAT_UBICACION.join(", ")}]
- tipoEquipo: [${CAT_TIPO.join(", ")}]
- marca: [${CAT_MARCA.join(", ")}]
- propiedad: [${CAT_PROPIEDAD.join(", ")}]
- proveedor: [${CAT_PROVEEDOR.join(", ")}]

Responde SOLO con JSON: {"campo":"clave_del_campo","valor":"NUEVO VALOR"}
Si no puedes identificar el campo, responde: {"campo":"","valor":""}`;

        const res = await askClaude(correctionPrompt, text);
        try {
          const clean = res.replace(/```json|```/g, "").trim();
          const match = clean.match(/\{[\s\S]*\}/);
          if (match) {
            const parsed = JSON.parse(match[0]);
            if (parsed.campo && parsed.valor) {
              const labels = {
                ubicacion:"Ubicación", tipoEquipo:"Tipo", marca:"Marca", modelo:"Modelo",
                numSerie:"No. Serie", anioManufactura:"Año Mfg", anioInstalacion:"Año Inst",
                propiedad:"Propiedad", proveedor:"Proveedor",
                riesgoCaract:"Riesgo Caract", riesgoFunc:"Riesgo Func", fechaServicio:"Últ. Servicio",
                accesorios:"Accesorios", observaciones:"Observaciones"
              };
              const updated = { ...equip, [parsed.campo]: parsed.valor };
              setEquip(updated);
              addBot(`${labels[parsed.campo] || parsed.campo} actualizado a: **${parsed.valor}**\n\n` +
                equipSummary(updated) + "\n\n¿Confirma los datos? (o indique otra corrección)");
              setPhase("confirmEquip");
              setBusy(false);
              return;
            }
          }
        } catch (e) { /* fall through */ }

        addBot("No logré identificar la corrección. Indique el campo y valor, por ejemplo: \"La marca es DRAGER\"");
        setBusy(false);
        return;
      }

      // ── ASK MORE ──
      if (phase === "askMore") {
        if (isYes(text)) {
          setEquip({});
          setBlockIdx(0);
          if (lastUbi) {
            addBot(`¿Misma ubicación: ${lastUbi}?`);
            setPhase("askLocation");
          } else {
            setPhase("equip");
            setTimeout(() => addBot(EQUIP_BLOCKS[0].ask), 400);
          }
        } else {
          addBot(finalSummary(allEquips));
          setPhase("finalReview");
        }
        setBusy(false);
        return;
      }

      // ── ASK LOCATION (sticky) ──
      if (phase === "askLocation") {
        if (isYes(text)) {
          setEquip({ ubicacion: lastUbi });
          addBot(`**${lastUbi}**`);
          setBlockIdx(0);
          setPhase("equipSkipUbi");
          setTimeout(() => addBot("Indique tipo de equipo y marca."), 400);
        } else {
          setEquip({});
          setBlockIdx(0);
          setPhase("equip");
          setTimeout(() => addBot(EQUIP_BLOCKS[0].ask), 400);
        }
        setBusy(false);
        return;
      }

      // ── FINAL REVIEW ──
      if (phase === "finalReview") {
        if (isYes(text)) {
          setPhase("sent");
          addBot("**Levantamiento registrado.**\n\nSe registraron **" + allEquips.length + " equipo(s)** para el hospital " + (header.idHospital || "") + ".");
        } else {
          addBot("¿Desea agregar otro equipo o reiniciar el levantamiento?");
          setPhase("askMore");
        }
        setBusy(false);
        return;
      }

      // ── HEADER BLOCK ──
      if (phase === "header") {
        const fields = await extractFields(text, HEADER_BLOCK.extractPrompt, HEADER_BLOCK.keys);
        if (fields) {
          // Merge whatever we got
          const merged = { ...header, ...fields };
          // Remove empty strings from new fields only (keep previously filled)
          HEADER_BLOCK.keys.forEach(k => {
            if (fields[k]) merged[k] = fields[k];
          });
          setHeader(merged);

          // Check what's still missing
          const missing = [];
          if (!merged.idHospital) missing.push("hospital");
          if (!merged.nombre) missing.push("nombre del responsable");

          if (missing.length > 0) {
            const filled = formatExtracted(fields);
            const filledMsg = filled ? filled + "\n\n" : "";
            addBot(filledMsg + "Falta indicar: **" + missing.join("** y **") + "**.");
          } else {
            addBot(formatExtracted(merged) + "\n\nDatos generales registrados. Proceda con el primer equipo.");
            setPhase("equip");
            setBlockIdx(0);
            setEquip({});
            setTimeout(() => addBot(EQUIP_BLOCKS[0].ask), 500);
          }
        } else {
          addBot("No logré interpretar la respuesta. Puede indicar, por ejemplo: \"Hospital SEDENA, soy Alejandro Tamez González\"");
        }
        setBusy(false);
        return;
      }

      // ── EQUIP BLOCKS ──
      if (phase === "equip" || phase === "equipSkipUbi") {
        const block = EQUIP_BLOCKS[blockIdx];
        let prompt = block.extractPrompt;

        // If skipping ubicacion (sticky), adjust block 0
        if (phase === "equipSkipUbi" && blockIdx === 0) {
          prompt = `Eres un asistente de captura de equipos médicos. Extrae del texto conversacional:
- tipoEquipo: debe ser uno de [${CAT_TIPO.join(", ")}]. Normaliza sinónimos: "cauterio"→"ELECTROCAUTERIO", "monitor"→"MONITOR DE SIGNOS VITALES", etc.
- marca: debe ser uno de [${CAT_MARCA.join(", ")}]. Normaliza errores ortográficos.
Si no coincide con catálogo pon "OTRO". JSON puro sin backticks.`;
        }

        const fields = await extractFields(text, prompt, block.keys);

        if (fields && Object.values(fields).filter(Boolean).length > 0) {
          // Merge into equip
          const updated = { ...equip, ...fields };
          setEquip(updated);
          addBot(formatExtracted(fields));

          // Reset to normal equip phase
          if (phase === "equipSkipUbi") setPhase("equip");

          // Advance to next block
          const nextBlock = blockIdx + 1;
          if (nextBlock < EQUIP_BLOCKS.length) {
            setBlockIdx(nextBlock);
            setTimeout(() => addBot(EQUIP_BLOCKS[nextBlock].ask), 400);
          } else {
            // All blocks done → show full summary
            setPhase("confirmEquip");
            setTimeout(() => addBot(equipSummary(updated) + "\n\n¿Confirma los datos?"), 400);
          }
        } else {
          addBot("No logré interpretar la respuesta. Indique los datos solicitados de forma natural.");
        }
        setBusy(false);
        return;
      }

    } catch (err) {
      addBot("Error: " + (err.message || "intenta de nuevo"));
    }
    setBusy(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); processInput(); }
  };

  const formatMsg = (text) => text.split("\n").map((line, i) => {
    let html = line.replace(/\*\*(.*?)\*\*/g, '<strong style="color:#F37021">$1</strong>');
    html = html.replace(/^[•]\s*/g, '<span style="color:#F37021">▸ </span>');
    return <p key={i} style={{ margin: "2px 0", lineHeight: 1.55 }} dangerouslySetInnerHTML={{ __html: html }} />;
  });

  // ── IDLE ──
  if (phase === "idle") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "calc(100vh - 100px)", gap: 20 }}>
        <img src="data:image/png;base64,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" alt="Biossmann" style={{ height: 36 }} />
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#4D4D4D", textAlign: "center" }}>
          Levantamiento de Equipamiento Quirúrgico
        </h2>
        <p style={{ margin: 0, fontSize: 13, color: "#6B7280", textAlign: "center", maxWidth: 380, lineHeight: 1.6 }}>
          Capture datos de equipos médicos mediante voz o texto. El sistema valida y normaliza la información contra catálogos institucionales.
        </p>
        <button onClick={startNew} style={{ ...cs.btn, padding: "12px 28px", fontSize: 14, borderRadius: 8, marginTop: 8 }}>
          Iniciar Levantamiento
        </button>
      </div>
    );
  }

  // ── SENT ──
  if (phase === "sent") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "calc(100vh - 100px)", gap: 16, padding: 20 }}>
        <div style={{ width: 56, height: 56, borderRadius: 28, background: "#E8F5E9", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#4D4D4D", textAlign: "center" }}>
          Levantamiento Registrado
        </h2>
        <p style={{ margin: 0, fontSize: 13, color: "#6B7280", textAlign: "center" }}>
          Hospital: {header.idHospital} — Responsable: {header.nombre} {header.apPaterno} {header.apMaterno}
        </p>
        <p style={{ margin: 0, fontSize: 14, color: "#4D4D4D", fontWeight: 600 }}>
          {allEquips.length} equipo(s) registrado(s)
        </p>
        <div style={{ marginTop: 8, maxWidth: 520, width: "100%", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #E0E4EA" }}>
                {["#", "Ubicación", "Tipo", "Marca", "Modelo", "Riesgo"].map((h) => (
                  <th key={h} style={{ padding: "5px 7px", textAlign: "left", color: "#6B7280" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allEquips.map((eq, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #E8EAED" }}>
                  <td style={{ padding: "5px 7px" }}>{i + 1}</td>
                  <td style={{ padding: "5px 7px" }}>{eq.ubicacion}</td>
                  <td style={{ padding: "5px 7px" }}>{eq.tipoEquipo}</td>
                  <td style={{ padding: "5px 7px" }}>{eq.marca}</td>
                  <td style={{ padding: "5px 7px" }}>{eq.modelo || "—"}</td>
                  <td style={{ padding: "5px 7px" }}>{eq.riesgoCaract}/{eq.riesgoFunc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button onClick={() => setPhase("idle")} style={{ ...cs.btn, padding: "12px 28px", fontSize: 14, borderRadius: 10, marginTop: 12 }}>
          Nuevo Levantamiento
        </button>
      </div>
    );
  }

  // ── CHAT ──
  const totalBlocks = EQUIP_BLOCKS.length;
  const progressLabel = phase === "header" ? "Datos generales"
    : (phase === "equip" || phase === "equipSkipUbi") ? `Equipo #${allEquips.length + 1} — Bloque ${blockIdx + 1}/${totalBlocks}`
    : "";

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 100px)" }}>
      <style>{`
        @keyframes pulse2 { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
        @keyframes dotBlink { 0%,100% { opacity:.2; } 50% { opacity:1; } }
      `}</style>

      <div style={{ flex: 1, overflow: "auto", padding: 12 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.from === "user" ? "flex-end" : "flex-start", marginBottom: 8 }}>
            <div style={{
              maxWidth: "85%", padding: "10px 14px",
              borderRadius: m.from === "user" ? "12px 12px 3px 12px" : "12px 12px 12px 3px",
              background: m.from === "user" ? "#F37021" : "#F0F2F5",
              color: m.from === "user" ? "#fff" : "#4D4D4D", fontSize: 13,
              border: m.from === "user" ? "none" : "1px solid #2a3a4f",
            }}>
              {m.from === "bot" && (
                <div style={{ fontSize: 9, fontWeight: 600, color: "#F37021", marginBottom: 4 }}>Sistema Biossmann</div>
              )}
              <div>{formatMsg(m.text)}</div>
            </div>
          </div>
        ))}
        {busy && (
          <div style={{ display: "flex", marginBottom: 8 }}>
            <div style={{ padding: "10px 14px", borderRadius: "12px 12px 12px 3px", background: "#fff", border: "1px solid #E0E4EA", display: "flex", gap: 5 }}>
              {[0, 1, 2].map((j) => (
                <span key={j} style={{ width: 6, height: 6, borderRadius: "50%", background: "#F37021", animation: `dotBlink 1.4s ${j * 0.2}s infinite` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Progress */}
      {progressLabel && (
        <div style={{ padding: "4px 12px", background: "#F0F2F5", borderTop: "1px solid #E0E4EA", fontSize: 10, color: "#6B7280", display: "flex", justifyContent: "space-between" }}>
          <span>{progressLabel}</span>
          {allEquips.length > 0 && <span style={{ color: "#2E7D32" }}>{allEquips.length} equipo(s) registrado(s)</span>}
        </div>
      )}

      {/* Input */}
      <div style={{ padding: "8px 12px", borderTop: "1px solid #E0E4EA", background: "#F5F7FA" }}>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <button onClick={toggleVoice} style={{
            width: 42, height: 42, borderRadius: "50%", border: "none",
            background: listening ? "#D84315" : "#F37021",
            color: "#fff", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            boxShadow: listening ? "0 0 0 4px rgba(243,112,33,0.3)" : "none",
            animation: listening ? "pulse2 1s infinite" : "none",
          }}>
            {listening ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="4" height="12" rx="1"/><rect x="14" y="6" width="4" height="12" rx="1"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="2" width="6" height="11" rx="3"/><path d="M5 10a7 7 0 0 0 14 0"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
            )}
          </button>
          <input
            style={{ ...cs.inp, flex: 1 }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={listening ? "Escuchando..." : "Escribe tu respuesta..."}
            disabled={busy || listening}
          />
          <button
            style={{ ...cs.btn, padding: "9px 16px", opacity: (busy || !input.trim()) ? 0.5 : 1 }}
            onClick={() => processInput()}
            disabled={busy || !input.trim()}
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}

// ── TAB 2: ANALYTICS CHAT ──
function AnalyticsChat() {
  const M = useMemo(() => calcMetrics(EQUIPOS), []);

  const context = useMemo(() => {
    const mText = `MÉTRICAS (${M.N} equipos):
1.Antigüedad promedio: ${M.m1} años
2.Fuera vida útil(>6a): ${M.m2}% (${M.over6})
3.Mantenimiento vencido: ${M.m3}% (${M.badMaint})
4.Proveedores: ${M.m4.slice(0,8).map(p => p.name+":"+p.value).join(", ")}
5.Riesgo físico promedio: ${M.m5}/5
6.Equipos críticos: ${M.m6}% (${M.crit})
7.Disponibilidad operativa: ${M.m7}% (${M.op}/${M.N})
8.Años desde instalación: ${M.m8}
9.Propiedad Hospital:${M.m9h}% Proveedor:${M.m9p}%
10.IMT: ${M.m10}%
11.Ranking: ${M.m11.slice(0,5).map((q,i) => (i+1)+"."+q.name+"(score:"+q.score+")").join("; ")}`;

    const raw = EQUIPOS.map((e,i) =>
      `[${i}]${e.ubi}|${e.tipo}|${e.marca}|MFG:${e.aMfg}|INS:${e.aIns}|RC:${e.rCar}|RF:${e.rFun}|Serv:${e.fServ}|Prov:${e.prov}|${e.obs}`
    ).join("\n");

    return `Eres analista de equipamiento médico hospitalario. Tienes estos datos:
ESCALA RIESGO: 0=Completamente Operativo, 1=Op.limitaciones, 2=Op.no adecuado, 3=Semi funcional, 4=No funcional, 5=No apto
${mText}
DATOS CRUDOS:
${raw}
Responde en español, conciso, datos exactos. Si amerita gráfica, AL FINAL pon: CHART_DATA:{"type":"bar"|"pie","title":"...","data":[{"name":"...","value":N},...]}`;
  }, [M]);

  const [msgs, setMsgs] = useState([{
    role: "assistant",
    text: `Se dispone de **${M.N} equipos** analizados.\n\nConsultas disponibles:\n• ¿Cuál es el IMT?\n• Ranking de quirófanos por riesgo\n• Equipos con mantenimiento vencido\n• Distribución por proveedor`
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const q = input.trim();
    setInput("");
    setLoading(true);
    setMsgs(p => [...p, { role: "user", text: q }]);
    const res = await askClaude(context, q);
    let text = res, chart = null;
    const cm = res.match(/CHART_DATA:(\{[\s\S]*\})/);
    if (cm) {
      text = res.substring(0, cm.index).trim();
      try { chart = JSON.parse(cm[1]); } catch(e) { /* skip */ }
    }
    setMsgs(p => [...p, { role: "assistant", text, chart }]);
    setLoading(false);
  };

  const renderChart = (ch) => {
    if (!ch?.data?.length) return null;
    const d = ch.data.slice(0, 10);
    const box = { marginTop: 10, background: "#F0F2F5", borderRadius: 8, padding: 12, border: "1px solid #E0E4EA" };
    const tt = { background: "#fff", border: "1px solid #E0E4EA", borderRadius: 6, color: "#4D4D4D", fontSize: 11 };
    if (ch.type === "pie") return (
      <div style={box}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#F37021", marginBottom: 4 }}>{ch.title}</div>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={d} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={72}
              label={({name, percent}) => `${name} ${(percent*100).toFixed(0)}%`}
              fontSize={9} stroke="#fff">
              {d.map((_,i) => <Cell key={i} fill={PIE_C[i % PIE_C.length]} />)}
            </Pie>
            <Tooltip contentStyle={tt} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
    return (
      <div style={box}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#F37021", marginBottom: 4 }}>{ch.title}</div>
        <ResponsiveContainer width="100%" height={Math.max(160, d.length * 30)}>
          <BarChart data={d} layout="vertical" margin={{left:8, right:16, top:4, bottom:4}}>
            <XAxis type="number" tick={{fontSize:9, fill:"#94a3b8"}} />
            <YAxis type="category" dataKey="name" tick={{fontSize:9, fill:"#94a3b8"}} width={100} />
            <Tooltip contentStyle={tt} />
            <Bar dataKey="value" fill="#F37021" radius={[0,4,4,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const fmt = t => t.split("\n").map((l,i) => {
    let h = l.replace(/\*\*(.*?)\*\*/g, '<strong style="color:#F37021">$1</strong>');
    h = h.replace(/^[•●]\s*/, '<span style="color:#F37021">▸ </span>');
    return <p key={i} style={{ margin: "2px 0", lineHeight: 1.5 }} dangerouslySetInnerHTML={{__html: h}} />;
  });

  const quickQ = ["¿Cuál es el IMT?", "Ranking quirófanos", "Equipos reemplazo urgente", "Por proveedor", "Mantenimiento vencido"];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 100px)" }}>
      <div style={{ flex: 1, overflow: "auto", padding: 12 }}>
        {msgs.map((m,i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 8 }}>
            <div style={{
              maxWidth: "88%", padding: "10px 14px",
              borderRadius: m.role === "user" ? "12px 12px 3px 12px" : "12px 12px 12px 3px",
              background: m.role === "user" ? "#F37021" : "#F0F2F5",
              color: m.role === "user" ? "#fff" : "#4D4D4D", fontSize: 12,
              border: m.role === "user" ? "none" : "1px solid #E0E4EA"
            }}>
              {m.role === "assistant" && <div style={{fontSize:9, fontWeight:600, color:"#F37021", marginBottom:4}}>Sistema Biossmann</div>}
              <div>{fmt(m.text)}</div>
              {m.chart && renderChart(m.chart)}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", marginBottom: 8 }}>
            <div style={{ padding: "10px 14px", borderRadius: "12px 12px 12px 3px", background: "#fff", border: "1px solid #E0E4EA", display: "flex", gap: 5 }}>
              {[0,1,2].map(j => <span key={j} style={{width:6, height:6, borderRadius:"50%", background:"#F37021", animation:`blink 1.4s ${j*0.2}s infinite`}} />)}
            </div>
          </div>
        )}
        <style>{`@keyframes blink{0%,100%{opacity:.2}50%{opacity:1}}`}</style>
        <div ref={endRef} />
      </div>

      <div style={{ padding: "8px 12px", borderTop: "1px solid #E0E4EA", background: "#F5F7FA" }}>
        <div style={{ display: "flex", gap: 6 }}>
          <input style={{...cs.inp, flex:1}} value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()} placeholder="Pregunta sobre equipamiento..." />
          <button style={{...cs.btn, padding:"9px 16px"}} onClick={send} disabled={loading}>Enviar</button>
        </div>
        <div style={{ display: "flex", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
          {quickQ.map(q => (
            <button key={q} style={{...cs.btn2, padding:"3px 8px", fontSize:10, borderRadius:16}} onClick={() => setInput(q)}>{q}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── APP ──
export default function App() {
  const [tab, setTab] = useState("form");
  const tabStyle = (active) => ({
    padding: "11px 22px", cursor: "pointer", fontWeight: 600, fontSize: 13, fontFamily: FN,
    border: "none", background: active ? "#fff" : "transparent",
    color: active ? "#F37021" : "#9CA3AF",
    borderBottom: active ? "2px solid #F37021" : "2px solid transparent"
  });

  return (
    <div style={cs.app}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div style={ { background: "#fff", padding: "14px 22px", display: "flex", alignItems: "center", gap: 16, borderBottom: "2px solid #F37021" } }>
        <img src="data:image/png;base64,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" alt="Biossmann" style={ { height: 28 } } />
        <div style={ { width: 1, height: 28, background: "#E0E4EA" } } />
        <div>
          <div style={ { color: "#4D4D4D", fontSize: 14, fontWeight: 600, letterSpacing: "-0.01em" } }>Formulario de Levantamiento de Equipos</div>
        </div>
      </div>
      <div style={{ display: "flex", background: "#F5F7FA", borderBottom: "1px solid #E0E4EA" }}>
        <button style={tabStyle(tab === "form")} onClick={() => setTab("form")}>Levantamiento</button>
        <button style={tabStyle(tab === "chat")} onClick={() => setTab("chat")}>Consultas</button>
      </div>
      {tab === "form" ? <GuidedChat /> : <AnalyticsChat />}
    </div>
  );
}
