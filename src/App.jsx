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
    const r = await fetch("https://api.anthropic.com/v1/messages", {
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

// ── TAB 1: GUIDED VOICE CHAT ──
const RISK_LABELS = {
  "0":"Completamente Operativo","1":"Operativo con limitaciones",
  "2":"Operativo no adecuado","3":"Semi funcional",
  "4":"No funcional","5":"No apto"
};

const FIELD_LABELS = {
  idHospital:"Hospital", nombre:"Nombre", apPaterno:"Ap. Paterno", apMaterno:"Ap. Materno",
  ubicacion:"Ubicación", tipoEquipo:"Tipo", marca:"Marca", modelo:"Modelo",
  numSerie:"No. Serie", anioManufactura:"Año Manufactura", anioInstalacion:"Año Instalación",
  propiedad:"Propiedad", proveedor:"Proveedor",
  riesgoCaract:"Riesgo Características", riesgoFunc:"Riesgo Funcionamiento",
  fechaServicio:"Últ. Servicio", accesorios:"Accesorios", observaciones:"Observaciones"
};

const EQUIP_FIELDS = ["ubicacion","tipoEquipo","marca","modelo","numSerie","anioManufactura","anioInstalacion","propiedad","riesgoCaract","riesgoFunc","fechaServicio","proveedor","accesorios","observaciones"];

const BLOCKS = [
  { ask: "Indique ubicación, tipo de equipo y marca.", fields: ["ubicacion","tipoEquipo","marca"] },
  { ask: "Indique modelo, número de serie y año de manufactura.", fields: ["modelo","numSerie","anioManufactura"] },
  { ask: "Indique año de instalación, propiedad y proveedor de servicio.", fields: ["anioInstalacion","propiedad","proveedor"] },
  { ask: "RISK_TABLE", fields: ["riesgoCaract","riesgoFunc","fechaServicio"] },
  { ask: "Accesorios presentes y observaciones adicionales.", fields: ["accesorios","observaciones"] },
];

const RISK_TABLE_MSG = "Indique dos valores de riesgo y la fecha del último servicio:\n1) **Riesgo por características físicas** (estado físico del equipo)\n2) **Riesgo por funcionamiento** (desempeño operativo)\n3) **Fecha del último servicio**";

function RiskTable() {
  const rows = [
    { n: "0", label: "Completamente Operativo", desc: "Funciona adecuadamente, accesorios completos, acorde a necesidades.", color: "#4CAF50" },
    { n: "1", label: "Operativo con limitaciones", desc: "Funciona adecuadamente pero accesorios incompletos o inadecuados.", color: "#8BC34A" },
    { n: "2", label: "Operativo no adecuado", desc: "Funciona correctamente pero no es adecuado para la unidad médica.", color: "#FFC107" },
    { n: "3", label: "Semi funcional", desc: "Parcialmente funcional. Deficiencias estructurales que comprometen operación.", color: "#FF9800" },
    { n: "4", label: "No funcional", desc: "Equipo con daño que impide totalmente su uso.", color: "#F44336" },
    { n: "5", label: "No apto", desc: "Tecnológicamente obsoleto. No funcional. Sin medidas de seguridad.", color: "#B71C1C" },
  ];
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, marginTop: 8, marginBottom: 8 }}>
      <thead>
        <tr style={{ background: "#F0F2F5" }}>
          <th style={{ padding: "4px 6px", textAlign: "center", borderBottom: "1px solid #D1D5DB", width: 30 }}>Escala</th>
          <th style={{ padding: "4px 6px", textAlign: "left", borderBottom: "1px solid #D1D5DB" }}>Estado General</th>
          <th style={{ padding: "4px 6px", textAlign: "left", borderBottom: "1px solid #D1D5DB" }}>Descripción</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(r => (
          <tr key={r.n} style={{ borderBottom: "1px solid #E8EAED" }}>
            <td style={{ padding: "4px 6px", textAlign: "center", fontWeight: 700 }}>{r.n}</td>
            <td style={{ padding: "4px 6px", fontWeight: 600, color: r.color }}>{r.label}</td>
            <td style={{ padding: "4px 6px", color: "#6B7280", fontSize: 10 }}>{r.desc}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Single unified prompt - Claude handles extraction AND corrections in one call
function buildPrompt(phase, blockIdx, header, equip) {
  const catalogInfo = `
CATÁLOGOS (normalizar a estos valores exactos):
- ubicacion: ${CAT_UBICACION.join(", ")}
- tipoEquipo: ${CAT_TIPO.join(", ")}
- marca: ${CAT_MARCA.join(", ")}
- propiedad: ${CAT_PROPIEDAD.join(", ")}
- proveedor: ${CAT_PROVEEDOR.join(", ")}
- riesgoCaract/riesgoFunc: 0,1,2,3,4,5

NORMALIZACIÓN VOZ (errores comunes de dictado):
- "serena/selena" → SEDENA, "imss/ims" → IMSS, "iste/issste" → ISSSTE
- "quirofano/quirófano uno/1" → QUIRÓFANO 1, "sala uno" → SALA 1
- "electrocauterizador/cauterio/bisturí" → ELECTROCAUTERIO
- "mesa de operaciones/mesa quirúrgica" → MESA QUIRÚRGICA
- "lampara/lámparas quirúrgicas" → LÁMPARA QUIRÚRGICA
- "monitor/monitor signos" → MONITOR DE SIGNOS VITALES
- "maquina anestesia" → MÁQUINA DE ANESTESIA
- "aspirador portátil/portable" → ASPIRADOR
- "succión/succionador" → SUCCIÓN
- "drager/dräger/dragger" → DRAGER, "biosman/biossmann" → BIOSSMANN
- "stryker/strynker" → STRYKER, "conmed aspen" → CONMED
- "del hospital/propio" → HOSPITAL, "bismarck" → probablemente BIOSSMANN`;

  if (phase === "header") {
    return `Eres un asistente de captura de datos hospitalarios en México. El usuario habla por voz o texto informal.

${catalogInfo}

ESTADO ACTUAL DEL ENCABEZADO:
${JSON.stringify(header)}

CAMPOS QUE NECESITO: idHospital, nombre, apPaterno, apMaterno

El usuario puede dar todos los datos juntos o solo algunos. También puede corregir datos ya capturados.

RESPONDE SOLO con JSON (sin backticks):
{
  "updates": {"campo1":"valor1", "campo2":"valor2"},
  "message": "breve confirmación de lo que se capturó"
}

REGLAS:
- Extrae TODO lo que puedas del texto
- Nombres en MAYÚSCULAS
- Si dice "soy Alejandro Tamez González" → nombre=ALEJANDRO, apPaterno=TAMEZ, apMaterno=GONZÁLEZ
- Si la primera palabra es una institución (Sedena, IMSS, etc) seguida de un nombre → separa hospital y responsable
- Si corrige algo ("el hospital es X", "no, mi nombre es Y") → actualiza ese campo
- Solo incluye en updates los campos que el usuario mencionó
- message debe ser breve y formal`;
  }

  const block = BLOCKS[blockIdx] || BLOCKS[0];
  const pendingFields = block.fields.filter(f => !equip[f]);

  return `Eres un asistente de captura de equipos médicos. El usuario habla por voz o texto informal.

${catalogInfo}

ENCABEZADO YA CAPTURADO:
${JSON.stringify(header)}

EQUIPO EN CAPTURA (datos hasta ahora):
${JSON.stringify(equip)}

CAMPOS SOLICITADOS EN ESTE BLOQUE: ${block.fields.join(", ")}
CAMPOS AÚN PENDIENTES EN ESTE BLOQUE: ${pendingFields.join(", ")}

El usuario puede:
A) Dar los datos del bloque actual (${pendingFields.join(", ")})
B) Corregir cualquier dato ya capturado del equipo o del encabezado
C) Ambos: dar datos nuevos Y corregir algo

RESPONDE SOLO con JSON (sin backticks):
{
  "blockData": {"campo1":"valor1"},
  "corrections": {"campo1":"valor1"},
  "correctionsTarget": "equip" | "header",
  "message": "breve confirmación"
}

REGLAS:
- blockData: campos del bloque actual que el usuario proporcionó. Solo campos de [${block.fields.join(",")}]
- corrections: campos que el usuario corrige de datos PREVIOS (no del bloque actual). Puede ser vacío {}
- correctionsTarget: "header" si corrige hospital/nombre/apellidos, "equip" si corrige otros campos del equipo
- Si dice "quirófano 1 es para anestesia marca biossmann" → blockData: {ubicacion:"QUIRÓFANO 1", tipoEquipo:"MÁQUINA DE ANESTESIA", marca:"BIOSSMANN"}
- Si dice "el hospital es sedena" y eso no es un campo del bloque actual → corrections: {idHospital:"SEDENA"}, correctionsTarget:"header"
- Si dice "ya te dije ubicaciones quirófano es para anestesia marca biossmann" → interpreta: ubicacion=QUIRÓFANO (normalizar), tipoEquipo=MÁQUINA DE ANESTESIA, marca=BIOSSMANN
- Valores vacíos/no mencionados NO incluir en blockData ni corrections
- "no sé" / "sin dato" / "ninguno" para un campo → valor ""
- message: confirma brevemente qué se capturó, formal y corto

REGLA ESPECIAL PARA RIESGOS (cuando los campos son riesgoCaract, riesgoFunc, fechaServicio):
- riesgoCaract y riesgoFunc son DOS campos SEPARADOS, ambos obligatorios (0-5)
- riesgoCaract = riesgo por CARACTERÍSTICAS FÍSICAS del equipo (estado físico, accesorios)
- riesgoFunc = riesgo por FUNCIONAMIENTO del equipo (desempeño operativo)
- Si dice "cero y cero" o "0 0" → riesgoCaract:"0", riesgoFunc:"0"
- Si dice "funciona bien" → riesgoCaract:"0", riesgoFunc:"0"
- Si dice "no funciona" → riesgoCaract:"4", riesgoFunc:"4"
- Si dice "3 y 2" → riesgoCaract:"3", riesgoFunc:"2"
- Si solo da UN número, asigna ESE número a AMBOS campos
- SIEMPRE incluir ambos campos cuando este bloque está activo`;
}

function GuidedChat() {
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

  const addBot = (text) => setMsgs(p => [...p, { from: "bot", text }]);
  const addUser = (text) => setMsgs(p => [...p, { from: "user", text }]);

  const formatFields = (fields) => {
    return Object.entries(fields).filter(([k,v]) => v).map(([k,v]) => {
      const label = FIELD_LABELS[k] || k;
      const display = (k === "riesgoCaract" || k === "riesgoFunc") ? `${v} (${RISK_LABELS[v]||""})` : v;
      return `${label}: **${display}**`;
    }).join("\n");
  };

  const equipSummary = (eq) => {
    return "**Resumen del equipo:**\n" + EQUIP_FIELDS.map(k => {
      const v = eq[k] || "—";
      const display = (k === "riesgoCaract" || k === "riesgoFunc") ? `${v} (${RISK_LABELS[v]||""})` : v;
      return `${FIELD_LABELS[k]}: ${display}`;
    }).join("\n");
  };

  const finalSummary = (eqs) => {
    let t = `**Resumen del Levantamiento**\n\n`;
    t += `Fecha: ${header.fecha||"—"} | Hospital: ${header.idHospital||"—"} | Responsable: ${header.nombre||""} ${header.apPaterno||""} ${header.apMaterno||""}\n\n`;
    t += `**${eqs.length} equipo(s):**\n\n`;
    eqs.forEach((eq, i) => {
      t += `**${i+1}.** ${eq.tipoEquipo||"?"} — ${eq.marca||"?"} ${eq.modelo||""} (${eq.ubicacion||"?"})\n`;
    });
    t += `\n¿Confirma el envío?`;
    return t;
  };

  const isYes = (t) => { const l = t.toLowerCase().trim(); return l==="s"||l==="si"||l==="sí"||l.includes("correcto")||l.includes("ok")||l==="yes"||l.includes("confirmo"); };
  const isNo = (t) => { const l = t.toLowerCase().trim(); return l==="n"||l==="no"||l.includes("negativo")||l.includes("incorrecto"); };

  // ── Start ──
  const startNew = () => {
    setMsgs([]); setEquip({}); setAllEquips([]); setLastUbi(""); setBlockIdx(0);
    const today = new Date().toISOString().split("T")[0];
    setHeader({ fecha: today });
    setPhase("header");
    setTimeout(() => addBot(`Fecha del levantamiento: **${today}**\n\nIndique el hospital y el nombre del responsable.`), 300);
  };

  // ── Voice ──
  const toggleVoice = () => {
    if (listening) { recRef.current?.stop(); setListening(false); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { addBot("Reconocimiento de voz no disponible en este navegador."); return; }
    try {
      const rec = new SR(); rec.lang = "es-MX"; rec.continuous = false; rec.interimResults = false;
      rec.onresult = (e) => { const t = e.results[0][0].transcript; setInput(t); setTimeout(() => processInput(t), 300); };
      rec.onerror = () => setListening(false);
      rec.onend = () => setListening(false);
      recRef.current = rec; rec.start(); setListening(true);
    } catch (e) { /* skip */ }
  };

  // ── Parse Claude response ──
  const parseJSON = (text) => {
    try {
      const clean = text.replace(/```json|```/g, "").trim();
      const match = clean.match(/\{[\s\S]*\}/);
      return match ? JSON.parse(match[0]) : null;
    } catch { return null; }
  };

  // ── Ask a block (handles risk table specially) ──
  const askBlock = (idx) => {
    const block = BLOCKS[idx];
    if (block.ask === "RISK_TABLE") {
      setMsgs(p => [...p, { from: "bot", text: RISK_TABLE_MSG, riskTable: true }]);
    } else {
      addBot(block.ask);
    }
  };

  // ── Main processor ──
  const processInput = async (rawText) => {
    const text = (rawText || input).trim();
    if (!text || busy) return;
    setInput(""); addUser(text); setBusy(true);

    try {
      // ── YES/NO phases ──
      if (phase === "confirmEquip") {
        if (isYes(text)) {
          const saved = { ...equip };
          setAllEquips(p => [...p, saved]);
          setLastUbi(saved.ubicacion || "");
          addBot("Equipo registrado. ¿Desea registrar otro?");
          setPhase("askMore");
        } else if (isNo(text)) {
          addBot("Indique qué dato corregir. Por ejemplo: \"la marca es DRAGER\"\nO diga **repetir todo** para reiniciar este equipo.");
          setPhase("correcting");
        } else {
          // Might be a direct correction like "la marca es drager"
          setPhase("correcting");
          // Process the same text as a correction
          await handleCorrection(text);
        }
        setBusy(false); return;
      }

      if (phase === "correcting") {
        await handleCorrection(text);
        setBusy(false); return;
      }

      if (phase === "askMore") {
        if (isYes(text)) {
          setEquip({}); setBlockIdx(0);
          if (lastUbi) {
            addBot(`¿Misma ubicación: **${lastUbi}**?`);
            setPhase("askLocation");
          } else {
            setPhase("equip"); setTimeout(() => askBlock(0), 300);
          }
        } else {
          addBot(finalSummary(allEquips));
          setPhase("finalReview");
        }
        setBusy(false); return;
      }

      if (phase === "askLocation") {
        if (isYes(text)) {
          setEquip({ ubicacion: lastUbi }); setBlockIdx(0); setPhase("equip");
          addBot(`**${lastUbi}**`);
          // Skip to block 1 if ubicacion was in block 0
          if (BLOCKS[0].fields.includes("ubicacion")) {
            // Check if block 0 has other pending fields
            const otherFields = BLOCKS[0].fields.filter(f => f !== "ubicacion");
            if (otherFields.length > 0) {
              setTimeout(() => addBot(`Indique ${otherFields.map(f => FIELD_LABELS[f]).join(" y ")}.`), 300);
            } else {
              setBlockIdx(1);
              setTimeout(() => askBlock(1), 300);
            }
          }
        } else {
          setEquip({}); setBlockIdx(0); setPhase("equip");
          setTimeout(() => askBlock(0), 300);
        }
        setBusy(false); return;
      }

      if (phase === "finalReview") {
        if (isYes(text)) {
          setPhase("sent");
          addBot(`**Levantamiento registrado.**\nSe registraron **${allEquips.length} equipo(s)** para ${header.idHospital || "el hospital"}.`);
        } else {
          addBot("¿Desea agregar otro equipo o reiniciar?");
          setPhase("askMore");
        }
        setBusy(false); return;
      }

      // ── HEADER ──
      if (phase === "header") {
        const prompt = buildPrompt("header", 0, header, equip);
        const res = await askClaude(prompt, text);
        const parsed = parseJSON(res);

        if (parsed && parsed.updates && Object.keys(parsed.updates).length > 0) {
          const merged = { ...header };
          Object.entries(parsed.updates).forEach(([k,v]) => { if (v) merged[k] = v; });
          setHeader(merged);

          const missing = [];
          if (!merged.idHospital) missing.push("hospital");
          if (!merged.nombre) missing.push("nombre del responsable");

          if (missing.length > 0) {
            addBot(formatFields(parsed.updates) + "\n\nFalta: **" + missing.join("** y **") + "**.");
          } else {
            addBot(formatFields(merged) + "\n\nDatos registrados. Proceda con el primer equipo.");
            setPhase("equip"); setBlockIdx(0); setEquip({});
            setTimeout(() => askBlock(0), 400);
          }
        } else {
          addBot(parsed?.message || "No logré interpretar. Indique hospital y nombre del responsable.");
        }
        setBusy(false); return;
      }

      // ── EQUIP BLOCKS ──
      if (phase === "equip") {
        const prompt = buildPrompt("equip", blockIdx, header, equip);
        const res = await askClaude(prompt, text);
        const parsed = parseJSON(res);

        if (!parsed) {
          addBot("No logré interpretar. " + BLOCKS[blockIdx].ask);
          setBusy(false); return;
        }

        let updated = { ...equip };
        let hadUpdates = false;
        let confirmMsg = "";

        // Apply corrections to header or equip
        if (parsed.corrections && Object.keys(parsed.corrections).length > 0) {
          if (parsed.correctionsTarget === "header") {
            const newHeader = { ...header };
            Object.entries(parsed.corrections).forEach(([k,v]) => { if (v) newHeader[k] = v; });
            setHeader(newHeader);
            confirmMsg += Object.entries(parsed.corrections).map(([k,v]) => `${FIELD_LABELS[k]||k} corregido: **${v}**`).join("\n") + "\n\n";
          } else {
            Object.entries(parsed.corrections).forEach(([k,v]) => { if (v) { updated[k] = v; hadUpdates = true; } });
            confirmMsg += Object.entries(parsed.corrections).map(([k,v]) => `${FIELD_LABELS[k]||k} corregido: **${v}**`).join("\n") + "\n\n";
          }
        }

        // Apply block data
        if (parsed.blockData && Object.keys(parsed.blockData).length > 0) {
          Object.entries(parsed.blockData).forEach(([k,v]) => { if (v !== undefined) { updated[k] = v; hadUpdates = true; } });
          confirmMsg += formatFields(parsed.blockData);
        }

        if (hadUpdates || confirmMsg) {
          setEquip(updated);
          addBot(confirmMsg || (parsed.message || "Datos registrados."));
        }

        // Check if current block is complete
        const block = BLOCKS[blockIdx];
        const blockComplete = block.fields.every(f => updated[f] !== undefined && updated[f] !== "");
        // Also count "no data" as complete if at least one field was provided
        const blockAttempted = block.fields.some(f => updated[f] !== undefined);

        if (hadUpdates && blockAttempted) {
          // Advance to next block
          const next = blockIdx + 1;
          if (next < BLOCKS.length) {
            setBlockIdx(next);
            setTimeout(() => askBlock(next), 400);
          } else {
            // All done
            setPhase("confirmEquip");
            setTimeout(() => addBot(equipSummary(updated) + "\n\n¿Confirma los datos?"), 400);
          }
        } else if (!hadUpdates) {
          askBlock(blockIdx);
        }

        setBusy(false); return;
      }

    } catch (err) {
      addBot("Error de procesamiento. Intente de nuevo.");
    }
    setBusy(false);
  };

  // ── Handle correction in confirmEquip/correcting phase ──
  const handleCorrection = async (text) => {
    const lower = text.toLowerCase();
    if (lower.includes("repetir") || lower.includes("reiniciar") || lower.includes("desde el inicio")) {
      setEquip({}); setBlockIdx(0); setPhase("equip");
      addBot("Equipo descartado. Ingrese de nuevo.");
      setTimeout(() => askBlock(0), 400);
      return;
    }

    const corrSys = `El usuario quiere corregir un dato de un equipo médico o del encabezado.

DATOS ACTUALES DEL ENCABEZADO: ${JSON.stringify(header)}
DATOS ACTUALES DEL EQUIPO: ${JSON.stringify(equip)}

CATÁLOGOS:
- ubicacion: ${CAT_UBICACION.join(", ")}
- tipoEquipo: ${CAT_TIPO.join(", ")}
- marca: ${CAT_MARCA.join(", ")}
- propiedad: ${CAT_PROPIEDAD.join(", ")}
- proveedor: ${CAT_PROVEEDOR.join(", ")}

Responde JSON (sin backticks): {"target":"header"|"equip","campo":"clave","valor":"VALOR NORMALIZADO"}
Si no identificas la corrección: {"target":"unclear"}`;

    const res = await askClaude(corrSys, text);
    const parsed = parseJSON(res);

    if (parsed && parsed.target !== "unclear" && parsed.campo && parsed.valor) {
      const label = FIELD_LABELS[parsed.campo] || parsed.campo;
      if (parsed.target === "header") {
        setHeader(p => ({ ...p, [parsed.campo]: parsed.valor }));
      } else {
        setEquip(p => ({ ...p, [parsed.campo]: parsed.valor }));
      }
      const updatedEquip = parsed.target === "equip" ? { ...equip, [parsed.campo]: parsed.valor } : equip;
      addBot(`${label} actualizado: **${parsed.valor}**\n\n` + equipSummary(updatedEquip) + "\n\n¿Confirma los datos?");
      setPhase("confirmEquip");
    } else {
      addBot("Indique qué campo corregir y su valor. Ejemplo: \"la marca es DRAGER\"");
    }
  };

  const handleKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); processInput(); } };

  const formatMsg = (text) => text.split("\n").map((line, i) => {
    let html = line.replace(/\*\*(.*?)\*\*/g, '<strong style="color:#F37021">$1</strong>');
    return <p key={i} style={{ margin: "2px 0", lineHeight: 1.55 }} dangerouslySetInnerHTML={{ __html: html }} />;
  });

  // ── SCREENS ──
  if (phase === "idle") {
    return (
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"calc(100vh - 100px)", gap:20, padding:20 }}>
        <img src={document.querySelector('header img, [alt=Biossmann]')?.src || ""} alt="" style={{ height:32, opacity: 0.7 }} />
        <h2 style={{ margin:0, fontSize:20, fontWeight:700, color:"#4D4D4D", textAlign:"center" }}>
          Levantamiento de Equipamiento Quirúrgico
        </h2>
        <p style={{ margin:0, fontSize:13, color:"#6B7280", textAlign:"center", maxWidth:380, lineHeight:1.6 }}>
          Capture datos de equipos médicos mediante voz o texto. El sistema valida y normaliza la información contra catálogos institucionales.
        </p>
        <button onClick={startNew} style={{ ...cs.btn, padding:"12px 28px", fontSize:14, borderRadius:8, marginTop:8 }}>
          Iniciar Levantamiento
        </button>
      </div>
    );
  }

  if (phase === "sent") {
    return (
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"calc(100vh - 100px)", gap:16, padding:20 }}>
        <div style={{ width:56, height:56, borderRadius:28, background:"#E8F5E9", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h2 style={{ margin:0, fontSize:20, fontWeight:700, color:"#4D4D4D" }}>Levantamiento Registrado</h2>
        <p style={{ margin:0, fontSize:13, color:"#6B7280" }}>
          Hospital: {header.idHospital} — {header.nombre} {header.apPaterno} {header.apMaterno}
        </p>
        <p style={{ margin:0, fontSize:14, color:"#4D4D4D", fontWeight:600 }}>{allEquips.length} equipo(s)</p>
        <div style={{ marginTop:8, maxWidth:520, width:"100%", overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11 }}>
            <thead><tr style={{ borderBottom:"1px solid #E0E4EA" }}>
              {["#","Ubicación","Tipo","Marca","Modelo","Riesgo"].map(h => <th key={h} style={{ padding:"5px 7px", textAlign:"left", color:"#6B7280" }}>{h}</th>)}
            </tr></thead>
            <tbody>{allEquips.map((eq,i) => (
              <tr key={i} style={{ borderBottom:"1px solid #E8EAED" }}>
                <td style={{padding:"5px 7px"}}>{i+1}</td>
                <td style={{padding:"5px 7px"}}>{eq.ubicacion}</td>
                <td style={{padding:"5px 7px"}}>{eq.tipoEquipo}</td>
                <td style={{padding:"5px 7px"}}>{eq.marca}</td>
                <td style={{padding:"5px 7px"}}>{eq.modelo||"—"}</td>
                <td style={{padding:"5px 7px"}}>{eq.riesgoCaract}/{eq.riesgoFunc}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        <button onClick={() => setPhase("idle")} style={{ ...cs.btn, padding:"12px 28px", fontSize:14, borderRadius:8, marginTop:12 }}>
          Nuevo Levantamiento
        </button>
      </div>
    );
  }

  // ── CHAT ──
  return (
    <div style={{ display:"flex", flexDirection:"column", height:"calc(100vh - 100px)" }}>
      <style>{`
        @keyframes pulse2{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes dotBlink{0%,100%{opacity:.2}50%{opacity:1}}
      `}</style>

      <div style={{ flex:1, overflow:"auto", padding:12 }}>
        {msgs.map((m,i) => (
          <div key={i} style={{ display:"flex", justifyContent:m.from==="user"?"flex-end":"flex-start", marginBottom:8 }}>
            <div style={{
              maxWidth:"85%", padding:"10px 14px",
              borderRadius: m.from==="user" ? "12px 12px 3px 12px" : "12px 12px 12px 3px",
              background: m.from==="user" ? "#F37021" : "#F0F2F5",
              color: m.from==="user" ? "#fff" : "#4D4D4D", fontSize:13,
              border: m.from==="user" ? "none" : "1px solid #E0E4EA",
            }}>
              {m.from==="bot" && <div style={{ fontSize:9, fontWeight:600, color:"#F37021", marginBottom:4 }}>Sistema Biossmann</div>}
              <div>{formatMsg(m.text)}</div>
              {m.riskTable && <RiskTable />}
            </div>
          </div>
        ))}
        {busy && (
          <div style={{ display:"flex", marginBottom:8 }}>
            <div style={{ padding:"10px 14px", borderRadius:"12px 12px 12px 3px", background:"#F0F2F5", border:"1px solid #E0E4EA", display:"flex", gap:5 }}>
              {[0,1,2].map(j => <span key={j} style={{ width:6, height:6, borderRadius:"50%", background:"#F37021", animation:`dotBlink 1.4s ${j*0.2}s infinite` }} />)}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {(phase==="header"||phase==="equip") && (
        <div style={{ padding:"4px 12px", background:"#F0F2F5", borderTop:"1px solid #E0E4EA", fontSize:10, color:"#6B7280", display:"flex", justifyContent:"space-between" }}>
          <span>{phase==="header" ? "Datos generales" : `Equipo #${allEquips.length+1} — Bloque ${blockIdx+1}/${BLOCKS.length}`}</span>
          {allEquips.length > 0 && <span style={{ color:"#2E7D32" }}>{allEquips.length} registrado(s)</span>}
        </div>
      )}

      <div style={{ padding:"8px 12px", borderTop:"1px solid #E0E4EA", background:"#fff" }}>
        <div style={{ display:"flex", gap:6, alignItems:"center" }}>
          <button onClick={toggleVoice} style={{
            width:42, height:42, borderRadius:"50%", border:"none",
            background: listening ? "#D84315" : "#F37021",
            color:"#fff", fontSize:18, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
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
            style={{ ...cs.inp, flex:1 }}
            value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={listening ? "Escuchando..." : "Escribe o dicta tu respuesta..."}
            disabled={busy || listening}
          />
          <button
            style={{ ...cs.btn, padding:"9px 16px", opacity:(busy||!input.trim())?0.5:1 }}
            onClick={() => processInput()}
            disabled={busy || !input.trim()}
          >Enviar</button>
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
