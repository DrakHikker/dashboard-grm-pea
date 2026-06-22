import { useState, useMemo } from "react";

// ─── PALETA ────────────────────────────────────────────────────────────────
const C = {
  bg:        "#0D1B2A",
  surface:   "#132336",
  card:      "#1A3048",
  border:    "#1E3F5A",
  accent:    "#3A86C8",
  accent2:   "#2EC4B6",
  warn:      "#E8A838",
  danger:    "#E05252",
  ok:        "#3DB882",
  textPri:   "#E8F0F8",
  textSec:   "#7FA8C8",
  textMuted: "#4A6A88",
  tab:       "#0F2030",
};

// ─── DADOS MOCK ─────────────────────────────────────────────────────────────
const MILITARES = [
  { id:1, nome:"Cel. Rodrigues",  posto:"Coronel",      unidade:"1ª Cia",  tempo:28, funcao:"Comando",  grm_status:"Regular",   grm_valor:3200, grm_venc:"2026-07-15", pea_aberto:0 },
  { id:2, nome:"Ten-Cel. Faria",  posto:"Ten-Coronel",  unidade:"1ª Cia",  tempo:22, funcao:"Chefia",   grm_status:"Pendente",  grm_valor:2900, grm_venc:"2026-06-25", pea_aberto:1 },
  { id:3, nome:"Maj. Almeida",    posto:"Major",        unidade:"2ª Cia",  tempo:15, funcao:"Chefia",   grm_status:"Vence 3d",  grm_valor:2500, grm_venc:"2026-06-22", pea_aberto:2 },
  { id:4, nome:"Cap. Oliveira",   posto:"Capitão",      unidade:"2ª Cia",  tempo:10, funcao:"Assistência",grm_status:"Regular", grm_valor:2100, grm_venc:"2026-08-01", pea_aberto:0 },
  { id:5, nome:"Cap. Silva",      posto:"Capitão",      unidade:"3ª Cia",  tempo:9,  funcao:"Assistência",grm_status:"Irregular",grm_valor:0,   grm_venc:null,         pea_aberto:1 },
  { id:6, nome:"1º Ten. Costa",   posto:"1º Tenente",   unidade:"3ª Cia",  tempo:6,  funcao:"Execução", grm_status:"Regular",   grm_valor:1800, grm_venc:"2026-07-20", pea_aberto:0 },
  { id:7, nome:"2º Ten. Melo",    posto:"2º Tenente",   unidade:"4ª Cia",  tempo:3,  funcao:"Execução", grm_status:"Inelegível",grm_valor:0,   grm_venc:null,         pea_aberto:0 },
  { id:8, nome:"Sgt. Pereira",    posto:"Sargento",     unidade:"4ª Cia",  tempo:12, funcao:"Execução", grm_status:"Regular",   grm_valor:1500, grm_venc:"2026-07-10", pea_aberto:1 },
];

const PEA_LIST = [
  { id:"PEA-4523", militar:"Cap. Silva",    abertura:"2026-05-15", status:"Em Análise",   nivel:"Jurídico", dias_parado:35, unidade:"3ª Cia" },
  { id:"PEA-4501", militar:"Ten-Cel. Faria",abertura:"2026-06-01", status:"Aprovado",     nivel:"Financeiro",dias_parado:0, unidade:"1ª Cia" },
  { id:"PEA-4489", militar:"Maj. Almeida",  abertura:"2026-05-20", status:"Em Análise",   nivel:"Chefia",   dias_parado:12, unidade:"2ª Cia" },
  { id:"PEA-4466", militar:"Maj. Almeida",  abertura:"2026-04-10", status:"Pendente",     nivel:"Chefia",   dias_parado:70, unidade:"2ª Cia" },
  { id:"PEA-4440", militar:"Sgt. Pereira",  abertura:"2026-06-10", status:"Em Análise",   nivel:"Jurídico", dias_parado:9,  unidade:"4ª Cia" },
];

const DEMANDAS = [
  { id:"D-001", titulo:"Revisão folha GRM Jun/26",      prioridade:"Crítica", prazo:"2026-06-20", responsavel:"Ten-Cel. Faria", status:"Em andamento", dias_rest:-1  },
  { id:"D-002", titulo:"Tramitação PEA-4466 jurídico",  prioridade:"Alta",    prazo:"2026-06-22", responsavel:"Cap. Oliveira",  status:"Em andamento", dias_rest:3   },
  { id:"D-003", titulo:"Atualização cadastro posto",    prioridade:"Média",   prazo:"2026-06-26", responsavel:"1º Ten. Costa",  status:"Pendente",     dias_rest:7   },
  { id:"D-004", titulo:"Relatório semestral GRM",       prioridade:"Alta",    prazo:"2026-06-21", responsavel:"Cel. Rodrigues", status:"Em andamento", dias_rest:2   },
  { id:"D-005", titulo:"Capacitação sistema SIPAC",     prioridade:"Baixa",   prazo:"2026-07-10", responsavel:"2º Ten. Melo",   status:"Pendente",     dias_rest:21  },
  { id:"D-006", titulo:"Auditoria elegibilidade GRM",   prioridade:"Crítica", prazo:"2026-06-19", responsavel:"Maj. Almeida",  status:"Atrasado",     dias_rest:0   },
  { id:"D-007", titulo:"Homologação PEA 2º semestre",   prioridade:"Alta",    prazo:"2026-06-23", responsavel:"Cap. Silva",    status:"Pendente",     dias_rest:4   },
  { id:"D-008", titulo:"Digitalização documentos ant.", prioridade:"Baixa",   prazo:"2026-07-30", responsavel:"Sgt. Pereira",  status:"Pendente",     dias_rest:41  },
];

const GRM_MENSAL = [
  { mes:"Jan", aprovados:112, pendentes:18, irregulares:5 },
  { mes:"Fev", aprovados:119, pendentes:14, irregulares:4 },
  { mes:"Mar", aprovados:121, pendentes:11, irregulares:3 },
  { mes:"Abr", aprovados:118, pendentes:16, irregulares:6 },
  { mes:"Mai", aprovados:125, pendentes:12, irregulares:3 },
  { mes:"Jun", aprovados:108, pendentes:89, irregulares:7 },
];

// ─── HELPERS ────────────────────────────────────────────────────────────────
const priColor = (p) =>
  ({ Crítica: C.danger, Alta: C.warn, Média: C.accent, Baixa: C.ok }[p] || C.textSec);

const grmColor = (s) =>
  ({ Regular: C.ok, Pendente: C.warn, "Vence 3d": C.warn, Irregular: C.danger, Inelegível: C.textMuted }[s] || C.textSec);

const statusIcon = (s) =>
  ({ Regular:"✅", Pendente:"⏳", "Vence 3d":"⚠️", Irregular:"❌", Inelegível:"—" }[s] || "");

const Chip = ({ label, color }) => (
  <span style={{
    display:"inline-block", padding:"2px 9px", borderRadius:12,
    background: color + "22", color, border:`1px solid ${color}55`,
    fontSize:11, fontWeight:700, letterSpacing:.4
  }}>{label}</span>
);

const Card = ({ title, value, sub, color, icon }) => (
  <div style={{
    background: C.card, border:`1px solid ${C.border}`,
    borderRadius:10, padding:"18px 20px", minWidth:140, flex:1,
    borderTop:`3px solid ${color}`,
  }}>
    <div style={{ fontSize:28, marginBottom:2 }}>{icon}</div>
    <div style={{ fontSize:13, color:C.textSec, marginBottom:4 }}>{title}</div>
    <div style={{ fontSize:32, fontWeight:800, color, fontFamily:"'Courier New',monospace" }}>{value}</div>
    {sub && <div style={{ fontSize:11, color:C.textMuted, marginTop:4 }}>{sub}</div>}
  </div>
);

// Mini bar chart
const BarChart = ({ data }) => {
  const max = Math.max(...data.map(d => d.aprovados + d.pendentes + d.irregulares));
  return (
    <div style={{ display:"flex", alignItems:"flex-end", gap:8, height:100, padding:"8px 0" }}>
      {data.map(d => {
        const total = d.aprovados + d.pendentes + d.irregulares;
        const h = (total / max) * 90;
        const ap = (d.aprovados / total) * h;
        const pe = (d.pendentes / total) * h;
        const ir = (d.irregulares / total) * h;
        return (
          <div key={d.mes} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
            <div style={{ width:"100%", display:"flex", flexDirection:"column-reverse", height:90, justifyContent:"flex-start" }}>
              <div style={{ height:ap, background:C.ok,     borderRadius:"2px 2px 0 0", minHeight:2 }} title={`Aprovados: ${d.aprovados}`}/>
              <div style={{ height:pe, background:C.warn,   minHeight: d.pendentes ? 2 : 0 }} title={`Pendentes: ${d.pendentes}`}/>
              <div style={{ height:ir, background:C.danger, minHeight: d.irregulares ? 2 : 0 }} title={`Irreg: ${d.irregulares}`}/>
            </div>
            <span style={{ fontSize:10, color:C.textMuted }}>{d.mes}</span>
          </div>
        );
      })}
    </div>
  );
};

// Progress bar
const ProgressBar = ({ value, max, color }) => (
  <div style={{ background:C.bg, borderRadius:4, height:6, overflow:"hidden", width:"100%" }}>
    <div style={{ width:`${Math.min((value/max)*100,100)}%`, height:"100%", background:color, borderRadius:4, transition:"width .6s" }}/>
  </div>
);

// ─── TABELA DE SOLDO (da imagem anexada) ────────────────────────────────────
const TABELA_SOLDO = [
  { pg:"Coronel",         soldo:12505.00, diaria:250.10 },
  { pg:"Tenente-Coronel", soldo:12285.00, diaria:245.70 },
  { pg:"Major",           soldo:12108.00, diaria:242.16 },
  { pg:"Capitão",         soldo:9976.00,  diaria:199.52 },
  { pg:"1º Tenente",      soldo:9004.00,  diaria:180.08 },
  { pg:"2º Tenente",      soldo:8179.00,  diaria:163.58 },
  { pg:"Subtenente",      soldo:6737.00,  diaria:134.74 },
  { pg:"1º Sargento",     soldo:5988.00,  diaria:119.76 },
  { pg:"2º Sargento",     soldo:5209.00,  diaria:104.18 },
  { pg:"3º Sargento",     soldo:4177.00,  diaria:83.54  },
  { pg:"Cabo",            soldo:2869.00,  diaria:57.38  },
  { pg:"Soldado EP",      soldo:1927.00,  diaria:38.54  },
  { pg:"Soldado EV",      soldo:1177.00,  diaria:23.54  },
  { pg:"Reserva",         soldo:0,        diaria:0      },
];

// ─── TABS ────────────────────────────────────────────────────────────────────
const TABS = [
  { id:"overview",  label:"📊 Visão Geral" },
  { id:"grm",       label:"🎖️ GRM / PEA" },
  { id:"demandas",  label:"📋 Demandas" },
  { id:"alertas",   label:"🔔 Alertas" },
  { id:"quadro_gr", label:"📄 Quadro GR" },
  { id:"tutorial",  label:"📚 Tutorial" },
];

// ─── TAB: VISÃO GERAL ────────────────────────────────────────────────────────
function TabOverview() {
  const grmPend   = MILITARES.filter(m => m.grm_status === "Pendente" || m.grm_status === "Irregular" || m.grm_status === "Vence 3d").length;
  const peaAberto = PEA_LIST.filter(p => p.status !== "Aprovado").length;
  const atrasadas = DEMANDAS.filter(d => d.dias_rest < 0 || d.status === "Atrasado").length;
  const criticas  = DEMANDAS.filter(d => d.prioridade === "Crítica").length;
  const pctGRM    = Math.round((MILITARES.filter(m=>m.grm_status==="Regular").length / MILITARES.length)*100);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      {/* Cards */}
      <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
        <Card title="Total Militares"   value={MILITARES.length} sub="Ativos no sistema"      color={C.accent}  icon="🪖"/>
        <Card title="GRM com pendência" value={grmPend}          sub="Requer ação imediata"   color={C.warn}    icon="⚠️"/>
        <Card title="PEA em Aberto"     value={peaAberto}        sub="Aguardando tramitação"  color={C.accent2} icon="📁"/>
        <Card title="Demandas Atrasadas"value={atrasadas}        sub="Prazo vencido"          color={C.danger}  icon="🚨"/>
        <Card title="Demandas Críticas" value={criticas}         sub="Prazo < 24h"            color={C.danger}  icon="⏱️"/>
      </div>

      <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
        {/* GRM por posto */}
        <div style={{ flex:2, minWidth:280, background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:18 }}>
          <div style={{ fontSize:13, fontWeight:700, color:C.textSec, marginBottom:12, letterSpacing:.5 }}>GRM — HISTÓRICO SEMESTRAL</div>
          <BarChart data={GRM_MENSAL}/>
          <div style={{ display:"flex", gap:16, marginTop:8 }}>
            {[{l:"Regular", c:C.ok},{l:"Pendente",c:C.warn},{l:"Irregular",c:C.danger}].map(x=>(
              <span key={x.l} style={{ fontSize:11, color:x.c, display:"flex", alignItems:"center", gap:4 }}>
                <span style={{ width:10, height:10, borderRadius:2, background:x.c, display:"inline-block" }}/>
                {x.l}
              </span>
            ))}
          </div>
        </div>

        {/* KPIs */}
        <div style={{ flex:1, minWidth:220, background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:18, display:"flex", flexDirection:"column", gap:14 }}>
          <div style={{ fontSize:13, fontWeight:700, color:C.textSec, letterSpacing:.5 }}>KPIs PRINCIPAIS</div>

          {[
            { label:"GRM Regularizadas",     value:pctGRM, max:100, unit:"%",  color:C.ok,     meta:"> 90%" },
            { label:"PEA p/ prazo (< 15d)",  value:8,      max:peaAberto, unit:"", color:C.accent2,meta:"meta: 15d" },
            { label:"Demandas no prazo",      value:DEMANDAS.filter(d=>d.dias_rest>0).length, max:DEMANDAS.length, unit:"", color:C.accent, meta:`${DEMANDAS.length} total` },
          ].map(k => (
            <div key={k.label}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                <span style={{ fontSize:12, color:C.textSec }}>{k.label}</span>
                <span style={{ fontSize:12, color:k.color, fontWeight:700 }}>{k.unit?`${k.value}${k.unit}`:`${k.value}/${k.max}`}</span>
              </div>
              <ProgressBar value={k.value} max={k.max} color={k.color}/>
              <div style={{ fontSize:10, color:C.textMuted, marginTop:3 }}>Meta: {k.meta}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabela rápida militares */}
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:18 }}>
        <div style={{ fontSize:13, fontWeight:700, color:C.textSec, marginBottom:12, letterSpacing:.5 }}>SITUAÇÃO POR MILITAR</div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
            <thead>
              <tr style={{ color:C.textMuted, textAlign:"left" }}>
                {["Militar","Posto","Unidade","GRM","Valor","Vencimento","PEA"].map(h=>(
                  <th key={h} style={{ padding:"6px 10px", borderBottom:`1px solid ${C.border}`, fontWeight:600, whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MILITARES.map((m, i) => (
                <tr key={m.id} style={{ background: i%2===0 ? "transparent" : C.bg+"44" }}>
                  <td style={{ padding:"7px 10px", color:C.textPri, fontWeight:600 }}>{m.nome}</td>
                  <td style={{ padding:"7px 10px", color:C.textSec }}>{m.posto}</td>
                  <td style={{ padding:"7px 10px", color:C.textSec }}>{m.unidade}</td>
                  <td style={{ padding:"7px 10px" }}>
                    <Chip label={`${statusIcon(m.grm_status)} ${m.grm_status}`} color={grmColor(m.grm_status)}/>
                  </td>
                  <td style={{ padding:"7px 10px", color:C.ok, fontFamily:"monospace" }}>
                    {m.grm_valor ? `R$ ${m.grm_valor.toLocaleString("pt-BR")}` : "—"}
                  </td>
                  <td style={{ padding:"7px 10px", color:m.grm_venc ? C.textSec : C.textMuted }}>
                    {m.grm_venc || "—"}
                  </td>
                  <td style={{ padding:"7px 10px" }}>
                    {m.pea_aberto > 0
                      ? <Chip label={`${m.pea_aberto} aberto(s)`} color={C.warn}/>
                      : <span style={{ color:C.textMuted }}>—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── TAB: GRM / PEA ─────────────────────────────────────────────────────────
function TabGRM() {
  const [filtroUnidade, setFiltroUnidade] = useState("Todas");
  const [filtroStatus, setFiltroStatus] = useState("Todos");
  const unidades = ["Todas", ...new Set(PEA_LIST.map(p => p.unidade))];
  const statuses = ["Todos", "Em Análise", "Pendente", "Aprovado"];

  const peas = PEA_LIST.filter(p =>
    (filtroUnidade === "Todas" || p.unidade === filtroUnidade) &&
    (filtroStatus  === "Todos" || p.status  === filtroStatus)
  );

  const peaStatusColor = s => ({ "Em Análise":C.warn, Pendente:C.accent, Aprovado:C.ok }[s] || C.textSec);
  const nivelColor     = n => ({ Chefia:C.accent, Jurídico:C.warn, Financeiro:C.accent2 }[n] || C.textSec);

  const tempoMedio = Math.round(PEA_LIST.filter(p=>p.status!=="Aprovado").reduce((a,b)=>a+b.dias_parado,0)/PEA_LIST.filter(p=>p.status!=="Aprovado").length);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      {/* KPI row */}
      <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
        {[
          { label:"PEA em tramitação", v:PEA_LIST.filter(p=>p.status!=="Aprovado").length, c:C.warn,    icon:"📁" },
          { label:"PEA aprovados",     v:PEA_LIST.filter(p=>p.status==="Aprovado").length,  c:C.ok,     icon:"✅" },
          { label:"Parados > 30 dias", v:PEA_LIST.filter(p=>p.dias_parado>30).length,       c:C.danger, icon:"🚨" },
          { label:"Tempo médio análise",v:`${tempoMedio}d`,                                  c:tempoMedio>15?C.danger:C.ok, icon:"⏱️" },
        ].map(k=>(
          <div key={k.label} style={{ flex:1, minWidth:130, background:C.card, border:`1px solid ${C.border}`, borderTop:`3px solid ${k.c}`, borderRadius:10, padding:"14px 16px" }}>
            <div style={{ fontSize:22 }}>{k.icon}</div>
            <div style={{ fontSize:11, color:C.textSec, margin:"4px 0" }}>{k.label}</div>
            <div style={{ fontSize:28, fontWeight:800, color:k.c, fontFamily:"monospace" }}>{k.v}</div>
          </div>
        ))}
      </div>

      {/* Filtros PEA */}
      <div style={{ display:"flex", gap:10, alignItems:"center" }}>
        <span style={{ fontSize:12, color:C.textMuted }}>Filtrar:</span>
        {[["Unidade", unidades, filtroUnidade, setFiltroUnidade],
          ["Status",  statuses, filtroStatus,  setFiltroStatus]].map(([label, opts, val, set])=>(
          <select key={label} value={val} onChange={e=>set(e.target.value)}
            style={{ background:C.card, color:C.textSec, border:`1px solid ${C.border}`, borderRadius:6, padding:"5px 10px", fontSize:12, cursor:"pointer" }}>
            {opts.map(o=><option key={o}>{o}</option>)}
          </select>
        ))}
      </div>

      {/* Tabela PEA */}
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:18 }}>
        <div style={{ fontSize:13, fontWeight:700, color:C.textSec, marginBottom:12, letterSpacing:.5 }}>PROCESSOS DE EXERCÍCIOS ANTERIORES</div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
            <thead>
              <tr style={{ color:C.textMuted }}>
                {["Nº Processo","Militar","Unidade","Abertura","Nível Atual","Status","Dias Parado"].map(h=>(
                  <th key={h} style={{ padding:"6px 10px", textAlign:"left", borderBottom:`1px solid ${C.border}`, fontWeight:600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {peas.map((p, i) => (
                <tr key={p.id} style={{ background: i%2===0 ? "transparent" : C.bg+"44" }}>
                  <td style={{ padding:"8px 10px", color:C.accent, fontFamily:"monospace", fontWeight:700 }}>{p.id}</td>
                  <td style={{ padding:"8px 10px", color:C.textPri }}>{p.militar}</td>
                  <td style={{ padding:"8px 10px", color:C.textSec }}>{p.unidade}</td>
                  <td style={{ padding:"8px 10px", color:C.textSec }}>{p.abertura}</td>
                  <td style={{ padding:"8px 10px" }}><Chip label={p.nivel} color={nivelColor(p.nivel)}/></td>
                  <td style={{ padding:"8px 10px" }}><Chip label={p.status} color={peaStatusColor(p.status)}/></td>
                  <td style={{ padding:"8px 10px" }}>
                    <span style={{ color: p.dias_parado>30?C.danger:p.dias_parado>10?C.warn:C.ok, fontWeight:700, fontFamily:"monospace" }}>
                      {p.dias_parado > 0 ? `${p.dias_parado}d` : "—"}
                      {p.dias_parado > 30 && " 🚨"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* GRM Elegibilidade */}
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:18 }}>
        <div style={{ fontSize:13, fontWeight:700, color:C.textSec, marginBottom:12, letterSpacing:.5 }}>ELEGIBILIDADE GRM</div>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          {MILITARES.map(m => {
            const elegivel = m.tempo >= 5 && ["Comando","Chefia"].includes(m.funcao);
            return (
              <div key={m.id} style={{
                background: C.bg, border:`1px solid ${elegivel ? C.ok+"55" : C.border}`,
                borderLeft:`3px solid ${elegivel ? C.ok : C.textMuted}`,
                borderRadius:8, padding:"10px 14px", minWidth:150,
              }}>
                <div style={{ fontSize:12, color:C.textPri, fontWeight:600 }}>{m.nome}</div>
                <div style={{ fontSize:11, color:C.textMuted }}>{m.funcao} • {m.tempo}a serviço</div>
                <div style={{ marginTop:5 }}>
                  {elegivel
                    ? <Chip label="✅ Elegível"   color={C.ok}/>
                    : <Chip label="✖ Não elegível" color={C.textMuted}/>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── TAB: DEMANDAS ───────────────────────────────────────────────────────────
function TabDemandas() {
  const [filtroPri, setFiltroPri] = useState("Todas");
  const [filtroSt,  setFiltroSt]  = useState("Todos");
  const pris = ["Todas","Crítica","Alta","Média","Baixa"];
  const sts  = ["Todos","Em andamento","Pendente","Atrasado"];

  const demandas = DEMANDAS.filter(d=>
    (filtroPri==="Todas" || d.prioridade===filtroPri) &&
    (filtroSt ==="Todos" || d.status===filtroSt)
  ).sort((a,b) => {
    const p = {Crítica:1,Alta:2,Média:3,Baixa:4};
    return p[a.prioridade] - p[b.prioridade];
  });

  const urgImpact = [
    { label:"Crítica",  urg:4, imp:4, count:DEMANDAS.filter(d=>d.prioridade==="Crítica").length },
    { label:"Alta",     urg:3, imp:3, count:DEMANDAS.filter(d=>d.prioridade==="Alta").length },
    { label:"Média",    urg:2, imp:2, count:DEMANDAS.filter(d=>d.prioridade==="Média").length },
    { label:"Baixa",    urg:1, imp:1, count:DEMANDAS.filter(d=>d.prioridade==="Baixa").length },
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      {/* Matriz de Prioridade */}
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:18 }}>
        <div style={{ fontSize:13, fontWeight:700, color:C.textSec, marginBottom:12, letterSpacing:.5 }}>MATRIZ DE PRIORIDADE — URGÊNCIA × IMPACTO</div>
        <div style={{ position:"relative", height:180, border:`1px solid ${C.border}`, borderRadius:8, background:C.bg, overflow:"hidden" }}>
          {/* Quadrantes */}
          {[
            { top:"5%",left:"5%",    label:"CRÍTICO",  c:C.danger+"22" },
            { top:"5%",left:"52%",   label:"PLANEJADO", c:C.accent+"11" },
            { top:"52%",left:"5%",   label:"URGENTE",   c:C.warn+"22"   },
            { top:"52%",left:"52%",  label:"BAIXO",     c:C.textMuted+"11" },
          ].map(q=>(
            <div key={q.label} style={{
              position:"absolute", top:q.top, left:q.left, width:"44%", height:"44%",
              background:q.c, border:`1px solid ${C.border}`, borderRadius:4,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:10, color:C.textMuted, fontWeight:700, letterSpacing:1
            }}>{q.label}</div>
          ))}
          {/* Bolhas */}
          {urgImpact.map(u=>(
            <div key={u.label} style={{
              position:"absolute",
              left: `${8 + (u.urg-1)*22}%`,
              top:  `${70 - (u.imp-1)*22}%`,
              width:  u.count * 14 + 20,
              height: u.count * 14 + 20,
              borderRadius:"50%",
              background: priColor(u.label) + "55",
              border:`2px solid ${priColor(u.label)}`,
              display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
              transform:"translate(-50%,-50%)", cursor:"default",
              transition:"transform .2s"
            }}>
              <span style={{ fontSize:16, fontWeight:800, color:priColor(u.label) }}>{u.count}</span>
              <span style={{ fontSize:9,  color:priColor(u.label), fontWeight:700 }}>{u.label}</span>
            </div>
          ))}
          <div style={{ position:"absolute", bottom:4, left:"50%", fontSize:9, color:C.textMuted, transform:"translateX(-50%)" }}>URGÊNCIA →</div>
          <div style={{ position:"absolute", left:4, top:"50%", fontSize:9, color:C.textMuted, transform:"translateY(-50%) rotate(-90deg)" }}>IMPACTO ↑</div>
        </div>
      </div>

      {/* Filtros */}
      <div style={{ display:"flex", gap:10, alignItems:"center" }}>
        <span style={{ fontSize:12, color:C.textMuted }}>Filtrar:</span>
        {[["Prioridade",pris,filtroPri,setFiltroPri],["Status",sts,filtroSt,setFiltroSt]].map(([l,opts,val,set])=>(
          <select key={l} value={val} onChange={e=>set(e.target.value)}
            style={{ background:C.card, color:C.textSec, border:`1px solid ${C.border}`, borderRadius:6, padding:"5px 10px", fontSize:12 }}>
            {opts.map(o=><option key={o}>{o}</option>)}
          </select>
        ))}
      </div>

      {/* Lista de demandas */}
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:18 }}>
        <div style={{ fontSize:13, fontWeight:700, color:C.textSec, marginBottom:12, letterSpacing:.5 }}>
          DEMANDAS ADMINISTRATIVAS
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {demandas.map(d => (
            <div key={d.id} style={{
              background: C.bg, border:`1px solid ${C.border}`,
              borderLeft:`4px solid ${priColor(d.prioridade)}`,
              borderRadius:8, padding:"12px 14px",
              display:"flex", alignItems:"center", gap:14, flexWrap:"wrap"
            }}>
              <div style={{ flex:2, minWidth:200 }}>
                <div style={{ fontSize:12, color:C.textPri, fontWeight:600 }}>{d.titulo}</div>
                <div style={{ fontSize:11, color:C.textMuted, marginTop:2 }}>{d.id} • {d.responsavel}</div>
              </div>
              <Chip label={d.prioridade} color={priColor(d.prioridade)}/>
              <div style={{ fontSize:11, color:C.textSec }}>📅 {d.prazo}</div>
              <div style={{
                fontSize:12, fontWeight:700, fontFamily:"monospace",
                color: d.dias_rest < 0 ? C.danger : d.dias_rest <= 3 ? C.warn : C.ok
              }}>
                {d.dias_rest < 0 ? `${Math.abs(d.dias_rest)}d ATRASADO 🚨` : d.dias_rest === 0 ? "VENCE HOJE ⚠️" : `+${d.dias_rest}d`}
              </div>
              <Chip label={d.status} color={d.status==="Atrasado"?C.danger:d.status==="Em andamento"?C.accent:C.textMuted}/>
            </div>
          ))}
        </div>
      </div>

      {/* Gantt simplificado */}
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:18 }}>
        <div style={{ fontSize:13, fontWeight:700, color:C.textSec, marginBottom:12, letterSpacing:.5 }}>CRONOGRAMA — JUN/2026</div>
        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
          {DEMANDAS.filter(d=>d.status!=="Concluído").slice(0,6).map(d=>{
            const pct = Math.max(5, Math.min(100, ((30-(d.dias_rest+10))/30)*100));
            return (
              <div key={d.id} style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:160, fontSize:11, color:C.textSec, textAlign:"right", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{d.titulo}</div>
                <div style={{ flex:1, background:C.bg, borderRadius:4, height:18, overflow:"hidden" }}>
                  <div style={{
                    width:`${pct}%`, height:"100%",
                    background: priColor(d.prioridade) + "88",
                    borderRight:`2px solid ${priColor(d.prioridade)}`,
                    borderRadius:4, transition:"width .5s",
                    display:"flex", alignItems:"center", paddingLeft:6
                  }}>
                    <span style={{ fontSize:9, color:C.textPri, whiteSpace:"nowrap" }}>{d.prazo}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── TAB: ALERTAS ────────────────────────────────────────────────────────────
function TabAlertas() {
  const [enviados, setEnviados] = useState([]);

  const alertas = [
    { id:"A1", tipo:"danger", icon:"🚨", titulo:"PEA #4466 parado há 70 dias",     desc:"Maj. Almeida — 4ª Cia. Nível Chefia sem tramitação.",     acao:"Cap. Oliveira" },
    { id:"A2", tipo:"danger", icon:"🚨", titulo:"PEA #4523 parado há 35 dias",     desc:"Cap. Silva — 3ª Cia. Aguardando nível Jurídico.",           acao:"Adjunto Jurídico" },
    { id:"A3", tipo:"warn",   icon:"⚠️", titulo:"GRM do Maj. Almeida vence em 3d", desc:"Valor: R$ 2.500. Prazo: 22/06/2026.",                       acao:"Ten-Cel. Faria" },
    { id:"A4", tipo:"warn",   icon:"⚠️", titulo:"GRM do Ten-Cel. Faria pendente",  desc:"Aguarda documentação. Mês referência Jun/26.",              acao:"Ten-Cel. Faria" },
    { id:"A5", tipo:"danger", icon:"🚨", titulo:"Demanda D-001 atrasada 1 dia",    desc:"Revisão folha GRM Jun/26. Resp: Ten-Cel. Faria.",           acao:"Ten-Cel. Faria" },
    { id:"A6", tipo:"warn",   icon:"⚠️", titulo:"Demanda D-004 vence em 2 dias",   desc:"Relatório semestral GRM. Resp: Cel. Rodrigues.",            acao:"Cel. Rodrigues"  },
    { id:"A7", tipo:"info",   icon:"ℹ️",  titulo:"PEA #4489 há 12d no nível Chefia",desc:"Maj. Almeida — 2ª Cia. Dentro do prazo, atenção.",         acao:"Chefia Imediata" },
  ];

  const colorMap = { danger:C.danger, warn:C.warn, info:C.accent };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:18 }}>
        <div style={{ fontSize:13, fontWeight:700, color:C.textSec, marginBottom:4, letterSpacing:.5 }}>🔔 PAINEL DE NOTIFICAÇÕES</div>
        <div style={{ fontSize:11, color:C.textMuted, marginBottom:16 }}>Atualizado automaticamente a cada 4h • {alertas.length} alertas ativos</div>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {alertas.map(a => {
            const cor = colorMap[a.tipo];
            const enviado = enviados.includes(a.id);
            return (
              <div key={a.id} style={{
                background: cor + "12", border:`1px solid ${cor}44`,
                borderLeft:`4px solid ${cor}`, borderRadius:8,
                padding:"12px 16px", display:"flex", alignItems:"flex-start", gap:12
              }}>
                <span style={{ fontSize:18 }}>{a.icon}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:C.textPri }}>{a.titulo}</div>
                  <div style={{ fontSize:11, color:C.textSec, marginTop:2 }}>{a.desc}</div>
                  <div style={{ fontSize:11, color:C.textMuted, marginTop:2 }}>Responsável: {a.acao}</div>
                </div>
                <button
                  onClick={() => setEnviados(p => [...p, a.id])}
                  disabled={enviado}
                  style={{
                    background: enviado ? C.ok+"22" : cor+"22",
                    border:`1px solid ${enviado ? C.ok : cor}`,
                    borderRadius:6, padding:"6px 12px",
                    color: enviado ? C.ok : cor,
                    fontSize:11, fontWeight:700, cursor: enviado ? "default" : "pointer",
                    whiteSpace:"nowrap", transition:"all .2s"
                  }}>
                  {enviado ? "✅ Enviado" : "📧 Notificar"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Resumo de alertas */}
      <div style={{ display:"flex", gap:12 }}>
        {[
          { label:"Críticos 🚨", count:alertas.filter(a=>a.tipo==="danger").length, c:C.danger },
          { label:"Atenção ⚠️",  count:alertas.filter(a=>a.tipo==="warn").length,   c:C.warn   },
          { label:"Info ℹ️",     count:alertas.filter(a=>a.tipo==="info").length,    c:C.accent },
          { label:"Notificados ✅",count:enviados.length,                             c:C.ok     },
        ].map(r=>(
          <div key={r.label} style={{
            flex:1, background:C.card, border:`1px solid ${C.border}`, borderTop:`3px solid ${r.c}`,
            borderRadius:10, padding:"14px 16px", textAlign:"center"
          }}>
            <div style={{ fontSize:26, fontWeight:800, color:r.c, fontFamily:"monospace" }}>{r.count}</div>
            <div style={{ fontSize:11, color:C.textSec, marginTop:4 }}>{r.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── TAB: QUADRO DE AUTORIZAÇÃO GR ──────────────────────────────────────────
const newLinhaGR = () => ({
  id: Date.now(),
  pg: "2º Sargento",
  efetivo_p: 1,
  efetivo_e: 1,
  duracao: 1,
});

function TabQuadroGR() {
  const fmtBRL = (v) =>
    Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  // ── Cabeçalho do documento ──
  const [cabecalho, setCabecalho] = useState({
    om: "9º BPE",
    fiscalizacao: "Fisc Adm/9º BEd",
    num_evento: "1",
    natureza: "Emprego Operacional",
    evento: "Escolta de Preso",
    periodo_ini: "2026-03-03",
    periodo_fim: "2026-03-03",
    descricao: "A fim de escoltar preso, conforme determinação do comandante no 9º Bed.",
    local: "Três Lagoas - MS",
    cidade_data: "Campo Grande-MS, 16 de março de 2026",
    nome_cmd: "FULANO DE TAL",
    posto_cmd: "Ten Cel",
    cargo_cmd: "Comandante do 9º Batalhão",
  });

  const setField = (f, v) => setCabecalho(p => ({ ...p, [f]: v }));

  // ── Linhas da tabela ──
  const [linhas, setLinhas] = useState([
    { id:1, pg:"2º Sargento", efetivo_p:1, efetivo_e:1, duracao:1 },
    { id:2, pg:"Cabo",        efetivo_p:1, efetivo_e:1, duracao:1 },
    { id:3, pg:"Soldado EP",  efetivo_p:2, efetivo_e:1, duracao:1 },
  ]);

  const addLinha = () => setLinhas(p => [...p, newLinhaGR()]);
  const removeLinha = (id) => setLinhas(p => p.filter(l => l.id !== id));
  const updateLinha = (id, field, val) =>
    setLinhas(p => p.map(l => l.id === id ? { ...l, [field]: val } : l));

  // ── Cálculos ──
  const getDiaria = (pg) => TABELA_SOLDO.find(t => t.pg === pg)?.diaria ?? 0;

  const linhasCalc = linhas.map(l => {
    const diaria = getDiaria(l.pg);
    const valor_unit = diaria;
    const subtotal = valor_unit * Number(l.efetivo_e) * Number(l.duracao);
    return { ...l, diaria, subtotal };
  });

  const totalGeral = linhasCalc.reduce((a, b) => a + b.subtotal, 0);

  // ── Estilos reutilizáveis ──
  const inp = (extra = {}) => ({
    background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6,
    color: C.textPri, fontSize: 12, padding: "5px 8px", width: "100%",
    outline: "none", ...extra
  });

  const thS = { padding: "8px 10px", background: C.surface, color: C.textSec,
    fontSize: 11, fontWeight: 700, textAlign: "left", borderBottom: `1px solid ${C.border}`,
    whiteSpace: "nowrap", letterSpacing: .4 };

  const tdS = (extra = {}) => ({
    padding: "7px 8px", borderBottom: `1px solid ${C.border}+"33"`,
    fontSize: 12, color: C.textPri, verticalAlign: "middle", ...extra
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

      {/* ── CABEÇALHO EDITÁVEL ── */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.textSec, marginBottom: 16, letterSpacing: .5 }}>
          ✏️ CABEÇALHO DO DOCUMENTO
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 12 }}>
          {[
            ["OM (Organização Militar)", "om"],
            ["Nº de Ordem / Fiscalização", "fiscalizacao"],
            ["Nº do Evento", "num_evento"],
            ["Natureza do Evento", "natureza"],
            ["Descrição do Evento", "evento"],
            ["Local do Evento", "local"],
            ["Cidade / Data do Documento", "cidade_data"],
            ["Nome do Comandante", "nome_cmd"],
            ["Posto do Comandante", "posto_cmd"],
            ["Cargo do Comandante", "cargo_cmd"],
          ].map(([label, field]) => (
            <div key={field}>
              <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 4 }}>{label}</div>
              <input value={cabecalho[field]} onChange={e => setField(field, e.target.value)} style={inp()} />
            </div>
          ))}
          <div>
            <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 4 }}>Período — Início</div>
            <input type="date" value={cabecalho.periodo_ini} onChange={e => setField("periodo_ini", e.target.value)} style={inp()} />
          </div>
          <div>
            <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 4 }}>Período — Fim</div>
            <input type="date" value={cabecalho.periodo_fim} onChange={e => setField("periodo_fim", e.target.value)} style={inp()} />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 4 }}>Descrição Detalhada do Evento</div>
            <textarea value={cabecalho.descricao} onChange={e => setField("descricao", e.target.value)}
              rows={2} style={{ ...inp(), resize: "vertical" }} />
          </div>
        </div>
      </div>

      {/* ── TABELA DE PARTICIPANTES EDITÁVEL ── */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.textSec, letterSpacing: .5 }}>
            👥 PARTICIPANTES E VALORES (2% do Soldo/dia)
          </div>
          <button onClick={addLinha} style={{
            background: C.accent + "22", border: `1px solid ${C.accent}`,
            borderRadius: 8, padding: "6px 14px", color: C.accent,
            fontSize: 12, fontWeight: 700, cursor: "pointer"
          }}>+ Adicionar Linha</button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr>
                {["P/Graduação","Efetivo P/Grad","Efetivo Real","Duração (dias)","Diária (R$)","Subtotal (R$)",""].map(h => (
                  <th key={h} style={thS}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {linhasCalc.map((l, i) => (
                <tr key={l.id} style={{ background: i % 2 === 0 ? "transparent" : C.bg + "44" }}>
                  {/* P/G select */}
                  <td style={tdS()}>
                    <select value={l.pg} onChange={e => updateLinha(l.id, "pg", e.target.value)}
                      style={{ ...inp(), minWidth: 140 }}>
                      {TABELA_SOLDO.map(t => (
                        <option key={t.pg} value={t.pg}>{t.pg}</option>
                      ))}
                    </select>
                  </td>
                  {/* Efetivo P/Grad */}
                  <td style={tdS({ textAlign: "center" })}>
                    <input type="number" min={0} value={l.efetivo_p}
                      onChange={e => updateLinha(l.id, "efetivo_p", e.target.value)}
                      style={{ ...inp(), width: 60, textAlign: "center" }} />
                  </td>
                  {/* Efetivo real */}
                  <td style={tdS({ textAlign: "center" })}>
                    <input type="number" min={0} value={l.efetivo_e}
                      onChange={e => updateLinha(l.id, "efetivo_e", e.target.value)}
                      style={{ ...inp(), width: 60, textAlign: "center" }} />
                  </td>
                  {/* Duração */}
                  <td style={tdS({ textAlign: "center" })}>
                    <input type="number" min={1} value={l.duracao}
                      onChange={e => updateLinha(l.id, "duracao", e.target.value)}
                      style={{ ...inp(), width: 60, textAlign: "center" }} />
                  </td>
                  {/* Diária automática */}
                  <td style={tdS({ color: C.accent2, fontFamily: "monospace", textAlign: "right" })}>
                    {fmtBRL(l.diaria)}
                  </td>
                  {/* Subtotal */}
                  <td style={tdS({ color: C.ok, fontWeight: 700, fontFamily: "monospace", textAlign: "right" })}>
                    {fmtBRL(l.subtotal)}
                  </td>
                  {/* Remover */}
                  <td style={tdS({ textAlign: "center" })}>
                    <button onClick={() => removeLinha(l.id)}
                      disabled={linhas.length === 1}
                      style={{
                        background: "none", border: `1px solid ${C.danger}55`,
                        borderRadius: 6, color: linhas.length === 1 ? C.textMuted : C.danger,
                        padding: "3px 8px", cursor: linhas.length === 1 ? "default" : "pointer", fontSize: 11
                      }}>✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={5} style={{ padding: "10px 8px", textAlign: "right", fontSize: 12, color: C.textSec, fontWeight: 700, borderTop: `2px solid ${C.border}` }}>
                  TOTAL GERAL A SER PAGO:
                </td>
                <td style={{ padding: "10px 8px", color: C.warn, fontWeight: 800, fontFamily: "monospace", fontSize: 16, borderTop: `2px solid ${C.border}` }}>
                  {fmtBRL(totalGeral)}
                </td>
                <td style={{ borderTop: `2px solid ${C.border}` }} />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* ── TABELA DE SOLDO (referência) ── */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.textSec, marginBottom: 12, letterSpacing: .5 }}>
          📊 TABELA DE REFERÊNCIA — P/G × SOLDO × DIÁRIA (2%)
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr>
                {["P/Graduação", "Soldo Mensal (R$)", "Diária — 2% (R$)"].map(h => (
                  <th key={h} style={thS}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TABELA_SOLDO.map((t, i) => (
                <tr key={t.pg} style={{ background: i % 2 === 0 ? "transparent" : C.bg + "44" }}>
                  <td style={tdS({ color: C.textPri, fontWeight: 600 })}>{t.pg}</td>
                  <td style={tdS({ color: C.accent2, fontFamily: "monospace" })}>{fmtBRL(t.soldo)}</td>
                  <td style={tdS({ color: C.ok,    fontFamily: "monospace", fontWeight: 700 })}>{fmtBRL(t.diaria)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── PRÉ-VISUALIZAÇÃO DO DOCUMENTO ── */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.textSec, marginBottom: 16, letterSpacing: .5 }}>
          🖨️ PRÉ-VISUALIZAÇÃO DO QUADRO OFICIAL
        </div>
        <div style={{
          background: "#fff", color: "#1a1a1a", borderRadius: 8,
          padding: "28px 32px", fontFamily: "Times New Roman, serif",
          fontSize: 13, lineHeight: 1.7
        }}>
          <div style={{ textAlign: "center", fontWeight: 700, fontSize: 14, marginBottom: 4 }}>
            Quadro de Autorização de Pagamento de GR pela OM
          </div>
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <strong>OM:</strong> {cabecalho.om}
          </div>

          {/* Tabela principal */}
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, marginBottom: 12 }}>
            <thead>
              <tr style={{ background: "#d4edda" }}>
                {["Nº de Ordem","Nº/Natureza do Evento","Evento","Período","P/Grad","Efetivo","Duração (dias)","2% do Soldo (R$)","Estimativa (R$)"].map(h=>(
                  <th key={h} style={{ border:"1px solid #888", padding:"4px 6px", textAlign:"center", fontWeight:700, fontSize:10 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {linhasCalc.map((l, i) => (
                <tr key={l.id}>
                  {i === 0 && (
                    <>
                      <td rowSpan={linhas.length} style={{ border:"1px solid #888", padding:"4px 6px", textAlign:"center", fontSize:10 }}>
                        {cabecalho.fiscalizacao}
                      </td>
                      <td rowSpan={linhas.length} style={{ border:"1px solid #888", padding:"4px 6px", textAlign:"center", fontSize:10 }}>
                        Nº {cabecalho.num_evento} {cabecalho.natureza}
                      </td>
                      <td rowSpan={linhas.length} style={{ border:"1px solid #888", padding:"4px 6px", textAlign:"center", fontSize:10 }}>
                        {cabecalho.evento}
                      </td>
                      <td rowSpan={linhas.length} style={{ border:"1px solid #888", padding:"4px 6px", textAlign:"center", fontSize:10 }}>
                        {cabecalho.periodo_ini} a {cabecalho.periodo_fim}
                      </td>
                    </>
                  )}
                  <td style={{ border:"1px solid #888", padding:"4px 6px", textAlign:"center", fontSize:10 }}>{l.pg}</td>
                  <td style={{ border:"1px solid #888", padding:"4px 6px", textAlign:"center", fontSize:10 }}>{l.efetivo_e}</td>
                  <td style={{ border:"1px solid #888", padding:"4px 6px", textAlign:"center", fontSize:10 }}>{l.duracao}</td>
                  <td style={{ border:"1px solid #888", padding:"4px 6px", textAlign:"right",  fontSize:10 }}>{fmtBRL(l.diaria)}</td>
                  <td style={{ border:"1px solid #888", padding:"4px 6px", textAlign:"right",  fontSize:10, fontWeight:700 }}>{fmtBRL(l.subtotal)}</td>
                </tr>
              ))}
              <tr>
                <td colSpan={8} style={{ border:"1px solid #888", padding:"4px 8px", textAlign:"right", fontWeight:700, fontSize:11 }}>
                  Total a ser pago no evento {cabecalho.num_evento}
                </td>
                <td style={{ border:"1px solid #888", padding:"4px 6px", textAlign:"right", fontWeight:700, fontSize:11 }}>
                  {fmtBRL(totalGeral)}
                </td>
              </tr>
            </tbody>
          </table>

          <table style={{ width:"40%", borderCollapse:"collapse", marginBottom:16, fontSize:11 }}>
            <tbody>
              <tr>
                <td style={{ border:"1px solid #888", padding:"4px 8px", fontWeight:700 }}>Total geral a ser pago</td>
                <td style={{ border:"1px solid #888", padding:"4px 8px", textAlign:"right", fontWeight:700 }}>{fmtBRL(totalGeral)}</td>
              </tr>
            </tbody>
          </table>

          <div style={{ marginBottom:8 }}>
            <strong>Legenda:</strong><br/>
            (a) Nº de Ordem da proposta.<br/>
            (b) Identificação do evento.
          </div>

          <div style={{ marginBottom:8 }}>
            <strong>Descrição detalhada do evento:</strong><br/>
            Evento Nº {cabecalho.num_evento}: {cabecalho.descricao}<br/>
            Local: {cabecalho.local}
          </div>

          <div style={{ marginTop:24, textAlign:"center" }}>
            <div>{cabecalho.cidade_data}</div>
            <div style={{ marginTop:40, fontWeight:700 }}>{cabecalho.nome_cmd} — {cabecalho.posto_cmd}</div>
            <div>{cabecalho.cargo_cmd}</div>
          </div>
        </div>
      </div>

    </div>
  );
}

// ─── TAB: TUTORIAL ───────────────────────────────────────────────────────────
function TabTutorial() {
  const [step, setStep] = useState(0);

  const steps = [
    {
      icon:"🏠", titulo:"Visão Geral",
      desc:"A aba Visão Geral é o painel principal. Aqui você encontra os KPIs mais importantes de uma só vez.",
      itens:[
        "📊 Cards de totais — militares, GRM pendentes, PEA abertos e demandas atrasadas",
        "📈 Gráfico de barras GRM — mostra a evolução mensal (verde = regular, amarelo = pendente, vermelho = irregular)",
        "🎯 Barra de KPIs — compara o resultado atual com a meta esperada",
        "📋 Tabela resumida — situação de cada militar com status de GRM e PEA",
      ],
      dica:"💡 Use esta aba para a reunião diária de gestão. Uma leitura rápida de 2 minutos já identifica as prioridades do dia."
    },
    {
      icon:"🎖️", titulo:"Aba GRM / PEA",
      desc:"Controle detalhado dos pagamentos de GRM e tramitação dos processos PEA.",
      itens:[
        "🔽 Filtro por Unidade — selecione '2ª Cia' para ver apenas os processos daquela unidade",
        "🔽 Filtro por Status — filtre por 'Em Análise' para focar nos processos ativos",
        "🚨 Dias Parado > 30 dias aparece em VERMELHO — ação imediata necessária",
        "✅ Elegibilidade GRM — painel visual com cor verde (elegível) e cinza (não elegível)",
      ],
      dica:"💡 Processo com 'Nível: Jurídico' parado há mais de 30 dias deve ser escalado à chefia imediatamente."
    },
    {
      icon:"📋", titulo:"Aba Demandas",
      desc:"Gerencie todas as demandas administrativas com controle visual de prioridade e prazo.",
      itens:[
        "🔵 Matriz de Prioridade — bolhas maiores = mais demandas; posição indica urgência vs. impacto",
        "🔽 Filtros combinados — filtre por prioridade E status ao mesmo tempo",
        "🗓️ Cronograma Gantt — barra colorida mostra o andamento e prazo de cada demanda",
        "🚨 Dias Atrasados aparece em VERMELHO com '🚨'; dia do vencimento aparece em AMARELO",
      ],
      dica:"💡 Ordene sempre pelo filtro 'Crítica' primeiro, resolva essas, depois passe para 'Alta'."
    },
    {
      icon:"🔔", titulo:"Aba Alertas",
      desc:"Central de notificações proativas. Nenhuma pendência crítica passa despercebida.",
      itens:[
        "🚨 Alertas CRÍTICOS (vermelho) — requerem ação em até 24h",
        "⚠️ Alertas de ATENÇÃO (amarelo) — prazo se aproximando, iniciar ação",
        "ℹ️ Alertas INFORMATIVOS (azul) — monitoramento, sem urgência imediata",
        "📧 Botão 'Notificar' — simula disparo de e-mail ao responsável; fica verde após envio",
      ],
      dica:"💡 Verifique esta aba ao início de cada expediente. Meta: zero alertas críticos ao fim do dia."
    },
    {
      icon:"✏️", titulo:"Como editar os dados",
      desc:"Os dados do dashboard são alimentados por tabelas. Veja como atualizar cada seção:",
      itens:[
        "📁 Dados de militares → edite a tabela MILITARES no arquivo de configuração (campo: nome, posto, tempo_servico, funcao, grm_status)",
        "📁 Processos PEA → edite a tabela PEA_LIST (campos: id, militar, abertura, status, nivel, dias_parado)",
        "📁 Demandas → edite a tabela DEMANDAS (campos: titulo, prioridade, prazo, responsavel, status, dias_rest)",
        "📁 Histórico GRM → edite a tabela GRM_MENSAL (campos: mes, aprovados, pendentes, irregulares)",
      ],
      dica:"💡 Em Power BI: abra o Editor de Consultas > selecione a tabela > edite as linhas diretamente ou conecte à sua fonte de dados (Excel, SQL Server, SharePoint)."
    },
    {
      icon:"🔗", titulo:"Integração com Power BI",
      desc:"Para implantar este dashboard no Power BI, siga este passo a passo:",
      itens:[
        "1️⃣ Exporte suas planilhas de controle para Excel ou SharePoint",
        "2️⃣ No Power BI Desktop, clique em 'Obter Dados' > Excel/SharePoint",
        "3️⃣ Use o Power Query para aplicar as transformações (campos calculados, dias_restantes)",
        "4️⃣ Crie as visuais: cartão, gráfico de barras, tabela, matriz — conforme este layout",
        "5️⃣ Publique no Power BI Service e agende atualização automática (a cada 4h)",
      ],
      dica:"💡 Use o tema de cores: Fundo #0D1B2A, Destaque #3A86C8, Alerta #E8A838, Crítico #E05252."
    },
  ];

  const s = steps[step];
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:20 }}>
        <div style={{ fontSize:13, fontWeight:700, color:C.textSec, marginBottom:16, letterSpacing:.5 }}>📚 TUTORIAL — COMO USAR O DASHBOARD</div>

        {/* Step indicators */}
        <div style={{ display:"flex", gap:6, marginBottom:20, flexWrap:"wrap" }}>
          {steps.map((st, i) => (
            <button key={i} onClick={() => setStep(i)} style={{
              background: i===step ? C.accent : C.bg,
              border:`1px solid ${i===step ? C.accent : C.border}`,
              borderRadius:20, padding:"4px 12px", cursor:"pointer",
              fontSize:11, color: i===step ? "#fff" : C.textSec, fontWeight:i===step?700:400,
              transition:"all .2s"
            }}>{st.icon} {i+1}</button>
          ))}
        </div>

        {/* Content */}
        <div style={{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:10, padding:24 }}>
          <div style={{ fontSize:32, marginBottom:8 }}>{s.icon}</div>
          <div style={{ fontSize:18, fontWeight:800, color:C.textPri, marginBottom:8 }}>{s.titulo}</div>
          <div style={{ fontSize:13, color:C.textSec, marginBottom:20, lineHeight:1.6 }}>{s.desc}</div>

          <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:20 }}>
            {s.itens.map((item, i) => (
              <div key={i} style={{
                background:C.card, border:`1px solid ${C.border}`,
                borderRadius:8, padding:"10px 14px",
                fontSize:12, color:C.textPri, lineHeight:1.6
              }}>{item}</div>
            ))}
          </div>

          <div style={{
            background:C.accent+"18", border:`1px solid ${C.accent}44`,
            borderRadius:8, padding:"12px 16px",
            fontSize:12, color:C.accent, lineHeight:1.6
          }}>{s.dica}</div>
        </div>

        {/* Nav */}
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:16 }}>
          <button onClick={() => setStep(p => Math.max(0,p-1))} disabled={step===0}
            style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:8,
              padding:"8px 18px", color:step===0?C.textMuted:C.textSec, cursor:step===0?"default":"pointer", fontSize:12 }}>
            ← Anterior
          </button>
          <span style={{ fontSize:12, color:C.textMuted, alignSelf:"center" }}>
            {step+1} / {steps.length}
          </span>
          <button onClick={() => setStep(p => Math.min(steps.length-1,p+1))} disabled={step===steps.length-1}
            style={{ background:step===steps.length-1?C.card:C.accent, border:`1px solid ${step===steps.length-1?C.border:C.accent}`,
              borderRadius:8, padding:"8px 18px",
              color:step===steps.length-1?C.textMuted:"#fff", cursor:step===steps.length-1?"default":"pointer", fontSize:12, fontWeight:700 }}>
            Próximo →
          </button>
        </div>
      </div>

      {/* Legenda de cores */}
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:18 }}>
        <div style={{ fontSize:13, fontWeight:700, color:C.textSec, marginBottom:12, letterSpacing:.5 }}>LEGENDA DE CORES E ÍCONES</div>
        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          {[
            { c:C.danger, l:"Crítico / Atrasado / Irregular" },
            { c:C.warn,   l:"Atenção / Pendente / Vencendo" },
            { c:C.ok,     l:"Regular / Concluído / No prazo" },
            { c:C.accent, l:"Informativo / Média prioridade" },
            { c:C.accent2,l:"PEA / Processo em tramitação"  },
            { c:C.textMuted,l:"Inativo / Inelegível / Baixo" },
          ].map(x=>(
            <div key={x.l} style={{ display:"flex", alignItems:"center", gap:8, fontSize:12, color:C.textSec }}>
              <div style={{ width:14, height:14, borderRadius:3, background:x.c, flexShrink:0 }}/>
              {x.l}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ROOT ────────────────────────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabContent = {
    overview:  <TabOverview/>,
    grm:       <TabGRM/>,
    demandas:  <TabDemandas/>,
    alertas:   <TabAlertas/>,
    quadro_gr: <TabQuadroGR/>,
    tutorial:  <TabTutorial/>,
  };

  return (
    <div style={{
      minHeight:"100vh", background:C.bg, color:C.textPri,
      fontFamily:"'Segoe UI', system-ui, -apple-system, sans-serif",
      padding:"0 0 40px"
    }}>
      {/* Header */}
      <div style={{
        background:C.surface, borderBottom:`1px solid ${C.border}`,
        padding:"14px 24px", display:"flex", alignItems:"center", justifyContent:"space-between",
        position:"sticky", top:0, zIndex:100
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <div style={{
            background:`linear-gradient(135deg, ${C.accent}, ${C.accent2})`,
            borderRadius:8, width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:18, flexShrink:0
          }}>🎯</div>
          <div>
            <div style={{ fontSize:15, fontWeight:800, color:C.textPri, letterSpacing:.5 }}>
              DASHBOARD GERENCIAL — GRM / PEA / DEMANDAS
            </div>
            <div style={{ fontSize:11, color:C.textMuted }}>Atualizado: 19/06/2026 às 14:30 • Próx. atualização em 4h</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <span style={{ background:C.danger+"22", border:`1px solid ${C.danger}44`, borderRadius:6, padding:"4px 10px", fontSize:11, color:C.danger }}>
            🚨 {DEMANDAS.filter(d=>d.dias_rest<0).length} atrasadas
          </span>
          <span style={{ background:C.warn+"22", border:`1px solid ${C.warn}44`, borderRadius:6, padding:"4px 10px", fontSize:11, color:C.warn }}>
            ⚠️ {MILITARES.filter(m=>m.grm_status==="Pendente"||m.grm_status==="Vence 3d").length} GRM
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        background:C.tab, borderBottom:`1px solid ${C.border}`,
        display:"flex", padding:"0 24px", overflowX:"auto"
      }}>
        {TABS.map(t => (
          <button key={t.id} onClick={()=>setActiveTab(t.id)}
            style={{
              background:"none", border:"none", borderBottom:`3px solid ${activeTab===t.id ? C.accent : "transparent"}`,
              padding:"12px 18px", cursor:"pointer",
              color: activeTab===t.id ? C.accent : C.textSec,
              fontWeight: activeTab===t.id ? 700 : 400,
              fontSize:13, whiteSpace:"nowrap", transition:"all .2s",
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding:"20px 24px", maxWidth:1200, margin:"0 auto" }}>
        {tabContent[activeTab]}
      </div>
    </div>
  );
}