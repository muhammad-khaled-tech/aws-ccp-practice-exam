import { useState, useEffect, useMemo, useCallback, useRef } from "react";

// Inject CSS variables for the dark AWS theme
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
    :root {
      --bg: #0a0e14;
      --s1: #111827;
      --s2: #1a2236;
      --s3: #243044;
      --s4: #2d3d57;
      --aws: #FF9900;
      --txt: #e2e8f0;
      --t2: #94a3b8;
      --t3: #64748b;
      --ok: #22c55e;
      --ok-bg: rgba(34,197,94,0.12);
      --ok-b: rgba(34,197,94,0.3);
      --err: #ef4444;
      --err-bg: rgba(239,68,68,0.12);
      --err-b: rgba(239,68,68,0.3);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0a0e14; font-family: var(--font-sans); }
    
    /* Custom Range Slider Styling */
    input[type=range] {
      -webkit-appearance: none;
      width: 100%;
      background: transparent;
      cursor: pointer;
    }
    input[type=range]:focus {
      outline: none;
    }
    input[type=range]::-webkit-slider-runnable-track {
      width: 100%;
      height: 6px;
      background: var(--s3);
      border-radius: 3px;
      border: none;
    }
    input[type=range]::-webkit-slider-thumb {
      -webkit-appearance: none;
      height: 16px;
      width: 16px;
      border-radius: 50%;
      background: var(--aws);
      margin-top: -5px;
      box-shadow: 0 0 8px rgba(255, 153, 0, 0.4);
      transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.15s ease;
    }
    input[type=range]::-webkit-slider-thumb:hover {
      transform: scale(1.25);
      box-shadow: 0 0 12px rgba(255, 153, 0, 0.8);
    }
    input[type=range]::-moz-range-track {
      width: 100%;
      height: 6px;
      background: var(--s3);
      border-radius: 3px;
      border: none;
    }
    input[type=range]::-moz-range-thumb {
      height: 16px;
      width: 16px;
      border-radius: 50%;
      background: var(--aws);
      border: none;
      box-shadow: 0 0 8px rgba(255, 153, 0, 0.4);
      transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.15s ease;
    }
    input[type=range]::-moz-range-thumb:hover {
      transform: scale(1.25);
      box-shadow: 0 0 12px rgba(255, 153, 0, 0.8);
    }

    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.6} }
    
    /* Modern Scrollbars */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: var(--s1); }
    ::-webkit-scrollbar-thumb { background: var(--s3); border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: var(--aws); }
    
    /* Preset Buttons */
    .preset-btn {
      position: relative;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .preset-btn::after {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      border-radius: 7px;
      border: 1px solid transparent;
      transition: all 0.3s ease;
      pointer-events: none;
    }
    .preset-btn.active::after {
      border-color: var(--aws);
      box-shadow: inset 0 0 0 1px var(--aws);
    }
    .preset-btn:hover {
      border-color: var(--aws) !important;
      background: rgba(255,153,0,0.08) !important;
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0,0,0,0.4);
    }
    .preset-btn:active {
      transform: translateY(0);
    }
    
    /* Service Chips */
    .srv-chip {
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .srv-chip:hover {
      transform: translateY(-1px) scale(1.03);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    }
    .srv-chip:active {
      transform: translateY(0) scale(1);
    }
    
    /* Accordions */
    .accordion-hdr { transition: background 0.2s ease, border-color 0.2s ease; }
    .accordion-hdr:hover { background: var(--s3) !important; }
    
    /* Status Filters */
    .status-btn {
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      border-radius: 6px;
      position: relative;
    }
    .status-btn.active {
      background: var(--aws) !important;
      color: #000 !important;
      box-shadow: 0 0 12px rgba(255, 153, 0, 0.4);
    }
    .status-btn:not(.active):hover {
      background: rgba(255, 255, 255, 0.05) !important;
      color: #fff !important;
    }
    .status-btn .count-badge {
      transition: all 0.2s ease;
    }
    .status-btn.active .count-badge {
      background: rgba(0, 0, 0, 0.15) !important;
      color: #000 !important;
    }
    .status-btn:not(.active) .count-badge {
      background: var(--s3) !important;
      color: var(--t2) !important;
    }
    
    /* Launch Button */
    .launch-btn-custom {
      background: linear-gradient(135deg, #FF9900 0%, #FF5500 100%) !important;
      border: none !important;
      color: #000 !important;
      font-weight: 900 !important;
      box-shadow: 0 4px 15px rgba(255, 153, 0, 0.4) !important;
      position: relative;
      overflow: hidden;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
    }
    .launch-btn-custom:not(:disabled):hover {
      box-shadow: 0 6px 20px rgba(255, 153, 0, 0.6) !important;
      transform: translateY(-2px);
    }
    .launch-btn-custom:not(:disabled):active {
      transform: translateY(1px);
    }
    .launch-btn-custom:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      box-shadow: none !important;
    }
    .dom-toggle-btn:hover { background: rgba(255,255,255,0.05) !important; }
  `;
  document.head.appendChild(style);
}



import RAW_CCP from "./questions.json";
import RAW_AIF from "./aif_c01.json";

const MAPPED_AIF = RAW_AIF.map(q => ({
  id: q.id,
  q: q.question,
  o: q.options,
  c: q.correct,
  du: q.discussion_url || null,
  dc: q.domain_category || "General",
  sc: q.service_category || "General"
}));

const EXAMS = {
  ccp: {
    id: "ccp",
    title: "AWS Certified Cloud Practitioner (CLF-C02)",
    questions: RAW_CCP,
    pKey: "aws_ccp_p_v1",
    fKey: "aws_ccp_f_v1",
    domains: [
      "Domain 1: Cloud Concepts",
      "Domain 2: Security and Compliance",
      "Domain 3: Cloud Technology and Services",
      "Domain 4: Billing, Pricing, and Support"
    ],
    dm: {
      "Domain 1: Cloud Concepts":{pct:"24%",c:"#3b82f6",e:"☁️"},
      "Domain 2: Security and Compliance":{pct:"30%",c:"#a855f7",e:"🔒"},
      "Domain 3: Cloud Technology and Services":{pct:"34%",c:"#22c55e",e:"⚡"},
      "Domain 4: Billing, Pricing, and Support":{pct:"12%",c:"#f59e0b",e:"💳"},
    },
    infoText: (
      <>
        <strong style={{color:"var(--aws)"}}>Pass score: 700/1000</strong> (≈70%). The exam has 65 questions, 90 minutes. Focus on Security + Technology — they are <strong style={{color:"var(--aws)"}}>64%</strong> of the exam.
      </>
    ),
    presets: {
      security: {
        label: "🛡️ Security Master",
        desc: "IAM, Cognito, KMS, Shield, WAF, GuardDuty, Macie, Inspector, Artifact, Secrets Manager",
        terms: ["iam", "cognito", "kms", "shield", "waf", "guardduty", "macie", "inspector", "artifact", "secrets manager"]
      },
      infra: {
        label: "🏗️ Core Infrastructure",
        desc: "EC2, ECS, EKS, Lambda, S3, EBS, EFS, Glacier, VPC, Route 53, ELB",
        terms: ["ec2", "ecs", "eks", "lambda", "s3", "ebs", "efs", "glacier", "vpc", "route 53", "elb"]
      },
      db: {
        label: "📊 Databases & Analytics",
        desc: "RDS, DynamoDB, Redshift, Aurora, ElastiCache, Athena, EMR, Glue, Kinesis",
        terms: ["rds", "dynamodb", "redshift", "aurora", "elasticache", "athena", "emr", "glue", "kinesis", "neptune", "keyspaces"]
      },
      billing: {
        label: "💰 Billing & Cost",
        desc: "Budgets, Cost Explorer, Pricing Calculator, Consolidated Billing, Free Tier",
        terms: ["budget", "cost explorer", "pricing calculator", "consolidated billing", "free tier", "economics", "savings plans"]
      }
    }
  },
  aif: {
    id: "aif",
    title: "AWS Certified AI Practitioner (AIF-C01)",
    questions: MAPPED_AIF,
    pKey: "aws_aif_p_v1",
    fKey: "aws_aif_f_v1",
    domains: [
      "Domain 1: Fundamentals of AI and ML",
      "Domain 2: Fundamentals of Generative AI",
      "Domain 3: Applications of Foundation Models",
      "Domain 4: Guidelines for Responsible AI",
      "Domain 5: Security, Compliance, and Governance"
    ],
    dm: {
      "Domain 1: Fundamentals of AI and ML":{pct:"20%",c:"#3b82f6",e:"🤖"},
      "Domain 2: Fundamentals of Generative AI":{pct:"24%",c:"#a855f7",e:"🧠"},
      "Domain 3: Applications of Foundation Models":{pct:"28%",c:"#22c55e",e:"🏗️"},
      "Domain 4: Guidelines for Responsible AI":{pct:"14%",c:"#f59e0b",e:"⚖️"},
      "Domain 5: Security, Compliance, and Governance":{pct:"14%",c:"#ef4444",e:"🛡️"}
    },
    infoText: (
      <>
        <strong style={{color:"var(--aws)"}}>Pass score: 700/1000</strong> (≈70%). The exam has 65 questions, 90 minutes. Focus on Applications of Foundation Models — it is <strong style={{color:"var(--aws)"}}>28%</strong> of the exam.
      </>
    ),
    presets: {
      sagemaker: { label: "🧠 SageMaker", desc: "SageMaker Studio, JumpStart, Data Wrangler, Feature Store, Clarify", terms: ["sagemaker"] },
      genai: { label: "✨ Generative AI", desc: "Bedrock, Claude, Titan, Stable Diffusion, Prompt Engineering, RAG", terms: ["bedrock", "claude", "titan", "prompt", "rag", "foundation model"] },
      security: { label: "🛡️ AI Security", desc: "Macie, GuardDuty, KMS, IAM, Compliance, Responsible AI", terms: ["macie", "guardduty", "kms", "iam", "compliance", "responsible", "privacy"] },
      services: { label: "☁️ AI Services", desc: "Rekognition, Comprehend, Polly, Transcribe, Lex, Translate", terms: ["rekognition", "comprehend", "polly", "transcribe", "lex", "translate"] }
    }
  }
};



async function sGet(k){try{const r=await window.storage.get(k);return r?.value??null}catch{return null}}
async function sSet(k,v){try{await window.storage.set(k,typeof v==="string"?v:JSON.stringify(v))}catch{}}
function fmt(s){const m=Math.floor(s/60),sec=s%60;return`${m}:${sec.toString().padStart(2,"0")}`}

function highlightText(text, search) {
  if (!search) return <span>{text}</span>;
  const escaped = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  const regex = new RegExp("(" + escaped + ")", "gi");
  const parts = text.split(regex);
  return (
    <span>
      {parts.map((part, i) => 
        regex.test(part) ? (
          <mark key={i} style={{ background: "rgba(255, 153, 0, 0.25)", color: "var(--aws)", fontWeight: "bold", borderRadius: 2, padding: "0 2px" }}>{part}</mark>
        ) : (
          part
        )
      )}
    </span>
  );
}

function ExamEngine({ examConfig, onSwitch }) {
  const { id: EXAM_ID, title: EXAM_TITLE, questions: RAW, pKey: P_KEY, fKey: F_KEY, domains: DOMAINS, dm: DM, presets: PRESETS } = examConfig;

  const [tab,setTab]=useState("study");
  const [screen,setScreen]=useState("dash");
  const [prog,setProg]=useState({});
  const [flags,setFlags]=useState({});
  const [session,setSession]=useState(null);
  const [qi,setQi]=useState(0);
  const [ans,setAns]=useState({});
  const [sub,setSub]=useState({});
  const [sFlags,setSFlags]=useState({});
  const [visited,setVisited]=useState({});
  const [tLeft,setTLeft]=useState(0);
  const [paused,setPaused]=useState(false);
  const [seqStart,setSeqStart]=useState(1);
  const [seqN,setSeqN]=useState(65);
  const [seqT,setSeqT]=useState(90);
  const [seqUnlim,setSeqUnlim]=useState(false);
  const [seqMode,setSeqMode]=useState("instant");
  const [randN,setRandN]=useState(65);
  const [randT,setRandT]=useState(90);
  const [randUnlim,setRandUnlim]=useState(false);
  const [randMode,setRandMode]=useState("deferred");
  const [custDoms,setCustDoms]=useState([]);
  const [custSrvs,setCustSrvs]=useState([]);
  const [custN,setCustN]=useState(65);
  const [custT,setCustT]=useState(90);
  const [custUnlim,setCustUnlim]=useState(false);
  const [custMode,setCustMode]=useState("instant");
  const [custSrchFilter,setCustSrchFilter]=useState("");
  const [custStatus,setCustStatus]=useState("all");
  const [expandedDoms,setExpandedDoms]=useState({0:true,1:false,2:false,3:false});
  const [srch,setSrch]=useState("");
  const [bStat,setBStat]=useState("all");
  const [bDom,setBDom]=useState("all");
  const [bSrv,setBSrv]=useState("all");
  const [expQ,setExpQ]=useState(null);
  const [browseLimit,setBrowseLimit]=useState(30);
  const [showAudit,setShowAudit]=useState(false);
  const timerRef=useRef(null);
  const submitRef=useRef(null);
  const qs=RAW;

  useEffect(()=>{
    (async()=>{
      const [pStr,fStr]=await Promise.all([sGet(P_KEY),sGet(F_KEY)]);
      if(pStr)try{setProg(JSON.parse(pStr))}catch{}
      if(fStr)try{setFlags(JSON.parse(fStr))}catch{}
    })();
  },[]);

  useEffect(()=>{if(Object.keys(prog).length)sSet(P_KEY,prog)},[prog]);
  useEffect(()=>{if(Object.keys(flags).length)sSet(F_KEY,flags)},[flags]);

  useEffect(()=>{
    if(screen!=="exam"||!session?.isTimed||paused)return;
    timerRef.current=setInterval(()=>{
      setTLeft(t=>{
        if(t<=1){clearInterval(timerRef.current);if(submitRef.current)submitRef.current();return 0}
        return t-1;
      });
    },1000);
    return()=>clearInterval(timerRef.current);
  },[screen,session,paused]);

  const handleSubmit=useCallback(()=>{
    if(!session)return;
    clearInterval(timerRef.current);
    const upd={};
    for(const q of session.questions){
      const sel=ans[q.id]||[];
      if(sel.length>0){
        const ok=q.c.length===sel.length&&q.c.every(c=>sel.includes(c));
        upd[q.id]={answered:true,correct:ok,selected:sel};
      }
    }
    if(Object.keys(upd).length)setProg(prev=>({...prev,...upd}));
    setScreen("report");
  },[session,ans]);
  useEffect(()=>{submitRef.current=handleSubmit},[handleSubmit]);

  const uniqueSrvs=useMemo(()=>[...new Set(qs.map(q=>q.sc))].sort(),[]);
  const srvCounts=useMemo(()=>{const m={};qs.forEach(q=>{m[q.sc]=(m[q.sc]||0)+1});return m},[]);
  const domCounts=useMemo(()=>{const m={};qs.forEach(q=>{m[q.dc]=(m[q.dc]||0)+1});return m},[]);
  const srvDomMap=useMemo(()=>{const m={};qs.forEach(q=>{if(!m[q.sc])m[q.sc]=q.dc});return m},[]);
  const filteredSrvs=useMemo(()=>{
    let s=uniqueSrvs;
    if(custSrchFilter){const t=custSrchFilter.toLowerCase();s=s.filter(srv=>srv.toLowerCase().includes(t))}
    return s;
  },[uniqueSrvs,custSrchFilter]);
  const mistakes=useMemo(()=>qs.filter(q=>prog[q.id]?.answered&&!prog[q.id]?.correct),[prog]);
  const custPool=useMemo(()=>{
    let p=qs;
    if(custSrvs.length>0)p=p.filter(q=>custSrvs.includes(q.sc));
    else if(custDoms.length>0)p=p.filter(q=>custDoms.includes(q.dc));
    if(custStatus==="unsolved")p=p.filter(q=>!prog[q.id]?.answered);
    else if(custStatus==="wrong")p=p.filter(q=>prog[q.id]?.answered&&!prog[q.id]?.correct);
    else if(custStatus==="flagged")p=p.filter(q=>flags[q.id]);
    return p;
  },[custDoms,custSrvs,custStatus,prog,flags]);

  const poolBreakdown = useMemo(() => {
    const counts = {};
    DOMAINS.forEach(d => { counts[d] = 0; });
    custPool.forEach(q => {
      if (counts[q.dc] !== undefined) {
        counts[q.dc]++;
      }
    });
    return counts;
  }, [custPool]);

  const getDomainState = useCallback((domainName) => {
    const domainServices = uniqueSrvs.filter(s => srvDomMap[s] === domainName);
    const selectedCount = domainServices.filter(s => custSrvs.includes(s)).length;
    if (selectedCount === 0) return "unchecked";
    if (selectedCount === domainServices.length) return "checked";
    return "indeterminate";
  }, [uniqueSrvs, srvDomMap, custSrvs]);

  const toggleDomain = useCallback((domainName) => {
    const domainServices = uniqueSrvs.filter(s => srvDomMap[s] === domainName);
    const state = getDomainState(domainName);
    if (state === "checked") {
      setCustSrvs(prev => prev.filter(s => srvDomMap[s] !== domainName));
      setCustDoms(prev => prev.filter(d => d !== domainName));
    } else {
      setCustSrvs(prev => {
        const filtered = prev.filter(s => srvDomMap[s] !== domainName);
        return [...filtered, ...domainServices];
      });
      setCustDoms(prev => prev.includes(domainName) ? prev : [...prev, domainName]);
    }
  }, [uniqueSrvs, srvDomMap, getDomainState]);

  const toggleService = useCallback((srv) => {
    const dom = srvDomMap[srv];
    let newSrvs;
    if (custSrvs.includes(srv)) {
      newSrvs = custSrvs.filter(x => x !== srv);
    } else {
      newSrvs = [...custSrvs, srv];
    }
    setCustSrvs(newSrvs);
    
    const domainServices = uniqueSrvs.filter(s => srvDomMap[s] === dom);
    const selectedInDom = domainServices.filter(s => newSrvs.includes(s));
    
    if (selectedInDom.length === domainServices.length) {
      setCustDoms(prev => prev.includes(dom) ? prev : [...prev, dom]);
    } else if (selectedInDom.length === 0) {
      setCustDoms(prev => prev.filter(d => d !== dom));
    } else {
      setCustDoms(prev => prev.filter(d => d !== dom));
    }
  }, [custSrvs, srvDomMap, uniqueSrvs]);

  const applyPreset = useCallback((presetKey) => {
    const preset = PRESETS[presetKey];
    if (!preset) return;
    const matchedSrvs = uniqueSrvs.filter(s => {
      const sLow = s.toLowerCase();
      return preset.terms.some(t => sLow.includes(t));
    });
    setCustSrvs(matchedSrvs);
    
    const matchedDoms = [];
    DOMAINS.forEach(d => {
      const domServices = uniqueSrvs.filter(s => srvDomMap[s] === d);
      const selectedInDom = domServices.filter(s => matchedSrvs.includes(s));
      if (selectedInDom.length === domServices.length && domServices.length > 0) {
        matchedDoms.push(d);
      }
    });
    setCustDoms(matchedDoms);
  }, [uniqueSrvs, srvDomMap]);

  useEffect(() => {
    if (custSrchFilter) {
      const t = custSrchFilter.toLowerCase();
      setExpandedDoms(prev => {
        const next = { ...prev };
        DOMAINS.forEach((d, idx) => {
          const domServices = uniqueSrvs.filter(s => srvDomMap[s] === d);
          if (domServices.some(s => s.toLowerCase().includes(t))) {
            next[idx] = true;
          }
        });
        return next;
      });
    }
  }, [custSrchFilter, uniqueSrvs, srvDomMap]);
  const browseFiltered=useMemo(()=>{
    let p=qs;
    if(srch){const t=srch.toLowerCase();p=p.filter(q=>q.q.toLowerCase().includes(t)||q.sc.toLowerCase().includes(t)||Object.values(q.o).some(v=>v.toLowerCase().includes(t)))}
    if(bStat==="correct")p=p.filter(q=>prog[q.id]?.correct);
    else if(bStat==="wrong")p=p.filter(q=>prog[q.id]?.answered&&!prog[q.id]?.correct);
    else if(bStat==="unanswered")p=p.filter(q=>!prog[q.id]?.answered);
    if(bDom!=="all")p=p.filter(q=>q.dc===bDom);
    if(bSrv!=="all")p=p.filter(q=>q.sc===bSrv);
    return p;
  },[srch,bStat,bDom,bSrv,prog]);

  const totalAns=useMemo(()=>Object.values(prog).filter(p=>p.answered).length,[prog]);
  const totalCorr=useMemo(()=>Object.values(prog).filter(p=>p.correct).length,[prog]);
  const accuracy=totalAns>0?Math.round(totalCorr/totalAns*100):0;

  const statsData=useMemo(()=>{
    const domS={};
    for(const d of DOMAINS){
      const dqs=qs.filter(q=>q.dc===d);
      const dAns=dqs.filter(q=>prog[q.id]?.answered);
      const dCorr=dqs.filter(q=>prog[q.id]?.correct);
      domS[d]={total:dqs.length,answered:dAns.length,correct:dCorr.length,acc:dAns.length>0?Math.round(dCorr.length/dAns.length*100):0};
    }
    const srvMap={};
    for(const q of qs){
      if(!srvMap[q.sc])srvMap[q.sc]={t:0,c:0};
      if(prog[q.id]?.answered){srvMap[q.sc].t++;if(prog[q.id]?.correct)srvMap[q.sc].c++;}
    }
    const weakest=Object.entries(srvMap).filter(([,v])=>v.t>=2).map(([s,v])=>({s,acc:Math.round(v.c/v.t*100),t:v.t})).sort((a,b)=>a.acc-b.acc).slice(0,8);
    return{domS,weakest};
  },[prog]);

  const startSession=useCallback((sess)=>{
    setSession(sess);setAns({});setSub({});setSFlags({});setVisited({});setQi(0);
    setTLeft(sess.isTimed?sess.time:0);setPaused(false);setScreen("exam");
  },[]);

  const handleSelect=useCallback((qid,letter,maxC)=>{
    if(session?.studyMode&&sub[qid])return;
    setAns(prev=>{
      const curr=prev[qid]||[];
      if(maxC>1){
        if(curr.includes(letter))return{...prev,[qid]:curr.filter(l=>l!==letter)};
        if(curr.length>=maxC)return prev;
        return{...prev,[qid]:[...curr,letter]};
      }
      return{...prev,[qid]:[letter]};
    });
    if(session?.studyMode&&maxC===1){
      setTimeout(()=>setSub(prev=>({...prev,[qid]:true})),120);
    }
  },[session,sub]);

  const launchSeq=()=>{
    const s=Math.max(1,seqStart)-1;
    const available=qs.length-s;
    const count=Math.min(seqN,available);
    const q=qs.slice(s,s+count);
    if(!q.length)return;
    startSession({type:"seq",label:`Q#${seqStart}–${seqStart+q.length-1}`,questions:q,isTimed:!seqUnlim,time:seqT*60,studyMode:seqMode==="instant"});
  };
  const launchRand=()=>{
    const q=[...qs].sort(()=>Math.random()-.5).slice(0,randN);
    startSession({type:"rand",label:`Random ${randN}Q`,questions:q,isTimed:!randUnlim,time:randT*60,studyMode:randMode==="instant"});
  };
  const launchCust=()=>{
    if(!custPool.length)return;
    const q=[...custPool].sort(()=>Math.random()-.5).slice(0,Math.min(custN,custPool.length));
    startSession({type:"cust",label:`Custom ${q.length}Q`,questions:q,isTimed:!custUnlim,time:custT*60,studyMode:custMode==="instant"});
  };
  const launchMistakes=()=>{
    if(!mistakes.length)return;
    const q=[...mistakes].sort(()=>Math.random()-.5).slice(0,50);
    startSession({type:"err",label:`Mistakes (${q.length}Q)`,questions:q,isTimed:false,time:0,studyMode:true});
  };

  const reportStats=useMemo(()=>{
    if(!session)return null;
    let correct=0;const dC={},dT={};
    const items=session.questions.map(q=>{
      const sel=ans[q.id]||[];
      const ok=q.c.length===sel.length&&q.c.every(c=>sel.includes(c));
      if(ok){correct++;dC[q.dc]=(dC[q.dc]||0)+1}
      dT[q.dc]=(dT[q.dc]||0)+1;
      return{q,sel,ok};
    });
    const pct=Math.round(correct/session.questions.length*100);
    return{total:session.questions.length,correct,pct,passed:pct>=70,dC,dT,items};
  },[session,ans]);

  const handleResetProg=()=>{
    if(!confirm("Clear all progress?"))return;
    setProg({});setFlags({});sSet(P_KEY,"{}");sSet(F_KEY,"{}");
  };

  const cq=session?.questions[qi];

  // Track visited questions for skipped detection
  useEffect(()=>{
    if(cq&&session){
      setVisited(prev=>{if(prev[cq.id])return prev;return{...prev,[cq.id]:true}});
    }
  },[cq,session]);

  if(screen==="exam"&&session&&cq){
    const isMulti=cq.c.length>1;
    const curAns=ans[cq.id]||[];
    const isSubd=!!sub[cq.id];
    const answered=Object.keys(ans).length;
    const urgent=tLeft>0&&tLeft<300;
    return(
      <div style={S.examWrap}>
        <div style={S.examHdr}>
          <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
            <button style={{...S.btnSm,fontSize:13}} onClick={()=>{if(confirm("Exit?"))setScreen("dash")}}>← Exit</button>
            <span style={{fontSize:13,fontWeight:700,color:"#fff",background:"var(--s2)",border:"1px solid var(--s3)",padding:"5px 10px",borderRadius:6,textTransform:"uppercase",letterSpacing:.5}}>{session.label}</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
            <span style={{fontSize:13,color:"var(--t2)",fontFamily:"monospace"}}>Answered: <strong style={{color:"#fff"}}>{answered}</strong>/{session.questions.length}</span>
            {session.isTimed&&<div style={{...S.timer,background:urgent?"rgba(239,68,68,.15)":"var(--s2)",borderColor:urgent?"rgba(239,68,68,.4)":"var(--s3)",color:urgent?"var(--err)":"var(--aws)",animation:urgent?"pulse 1s infinite":"none"}}>{urgent?"⚠":"⏱"} {fmt(tLeft)}</div>}
            <button style={{...S.btnSm,background:"var(--ok)",borderColor:"var(--ok)",color:"#000",padding:"7px 14px",fontWeight:900}} onClick={handleSubmit}>Submit ✓</button>
          </div>
        </div>
        <div style={S.examBody}>
          <div>
            <div style={S.qCard}>
              <div style={{...S.domBar,background:DM[cq.dc]?.c||"var(--aws)"}}/>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10,flexWrap:"wrap",marginBottom:10}}>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  <span style={S.qTag}>Q#{cq.id}</span>
                  <span style={{...S.qTag,color:DM[cq.dc]?.c||"var(--aws)",borderColor:(DM[cq.dc]?.c||"var(--aws)")+"44"}}>{DM[cq.dc]?.e} {cq.dc.split(": ")[1]||cq.dc}</span>
                  <span style={{...S.qTag,color:"var(--aws)",borderColor:"rgba(255,153,0,.25)"}}>{cq.sc}</span>
                </div>
                <div style={{display:"flex",gap:6}}>
                  <button style={{...S.btnSm,padding:"5px 10px",fontSize:12,background:sFlags[cq.id]?"rgba(245,158,11,.2)":"var(--s2)",borderColor:sFlags[cq.id]?"rgba(245,158,11,.5)":"var(--s3)",color:sFlags[cq.id]?"#f59e0b":"var(--t2)"}} onClick={()=>setSFlags(prev=>({...prev,[cq.id]:!prev[cq.id]}))}>
                    {sFlags[cq.id]?"⚑ Flagged":"⚐ Flag"}
                  </button>
                  {(curAns.length>0||isSubd)&&<button style={{...S.btnSm,padding:"5px 10px",fontSize:12}} onClick={()=>{setAns(prev=>{const c={...prev};delete c[cq.id];return c});setSub(prev=>{const c={...prev};delete c[cq.id];return c})}}>↺</button>}
                </div>
              </div>
              {isMulti&&<div style={S.multiNotice}>✦ Select TWO answers</div>}
              <div style={S.qText}>{cq.q}</div>
              {Object.entries(cq.o).map(([letter,text])=>{
                const isSel=curAns.includes(letter);
                const isCorr=cq.c.includes(letter);
                let bg="var(--s2)",bc="var(--s4)",col="var(--t2)",lbg="var(--s3)",lbc="var(--s4)",lcol="#fff";
                if(session.studyMode&&isSubd){
                  if(isCorr){bg="var(--ok-bg)";bc="var(--ok-b)";col="var(--ok)";lbg="var(--ok)";lbc="var(--ok)";lcol="#000"}
                  else if(isSel){bg="var(--err-bg)";bc="var(--err-b)";col="var(--err)";lbg="var(--err)";lbc="var(--err)";lcol="#fff"}
                  else{bg="var(--s2)";col="var(--t3)";bc="var(--s4)"}
                }else if(isSel){bg="rgba(255,153,0,.1)";bc="var(--aws)";col="var(--aws)";lbg="var(--aws)";lbc="var(--aws)";lcol="#000"}
                return(
                  <button key={letter} onClick={()=>handleSelect(cq.id,letter,cq.c.length)}
                    style={{width:"100%",textAlign:"left",padding:"14px 16px",borderRadius:10,border:`1px solid ${bc}`,background:bg,color:col,cursor:(session.studyMode&&isSubd)?"default":"pointer",display:"flex",alignItems:"flex-start",gap:12,fontSize:16,lineHeight:1.5,marginBottom:8,fontFamily:"monospace",opacity:(session.studyMode&&isSubd&&!isCorr&&!isSel)?.35:1}}>
                    <span style={{width:24,height:24,borderRadius:5,background:lbg,border:`1px solid ${lbc}`,fontSize:14,fontWeight:900,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontFamily:"monospace",color:lcol,marginTop:1}}>{letter}</span>
                    <span style={{flex:1,textAlign:"left"}}>{text}</span>
                  </button>
                );
              })}
              {session.studyMode&&isMulti&&!isSubd&&(
                <button disabled={curAns.length===0} onClick={()=>setSub(prev=>({...prev,[cq.id]:true}))}
                  style={{background:"var(--aws)",color:"#000",border:"none",padding:"10px 20px",borderRadius:8,fontSize:14,fontWeight:900,cursor:curAns.length===0?"not-allowed":"pointer",opacity:curAns.length===0?.3:1,marginTop:14,transition:"all .15s",textTransform:"uppercase",letterSpacing:.5}}>
                  Confirm: {curAns.length>0?curAns.join(" + "):"select answers first"}
                </button>
              )}
              {session.studyMode&&isSubd&&(
                <div style={{marginTop:20,padding:16,background:"var(--s2)",border:"1px solid var(--s3)",borderRadius:10}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8,flexWrap:"wrap"}}>
                    {cq.c.every(c=>curAns.includes(c))
                      ?<span style={S.correctBadge}>✓ Correct</span>
                      :<span style={S.wrongBadge}>✗ Incorrect</span>
                    }
                    <span style={{fontSize:14,color:"var(--t2)",fontFamily:"monospace"}}>Answer: <strong style={{color:"var(--ok)"}}>{cq.c.join(", ")}</strong></span>
                    {cq.cv&&<span style={{fontSize:13,color:"var(--t3)"}}>Community: <strong style={{color:"var(--aws)"}}>{cq.cv}</strong></span>}
                  </div>
                  {cq.du&&<a href={cq.du} target="_blank" rel="noopener noreferrer" style={{fontSize:13,color:"var(--aws)",textDecoration:"none",fontWeight:700}}>↗ ExamTopics Discussion</a>}
                </div>
              )}
            </div>
            <div style={S.navBar}>
              <button style={S.navBtn} disabled={qi===0} onClick={()=>setQi(i=>i-1)}>← Prev</button>
              <span style={{fontSize:13,color:"var(--t2)",fontFamily:"monospace",fontWeight:700}}>{qi+1} / {session.questions.length}</span>
              {qi<session.questions.length-1
                ?<button style={{...S.navBtn,background:"var(--aws)",borderColor:"var(--aws)",color:"#000"}} onClick={()=>setQi(i=>i+1)}>Next →</button>
                :<button style={{...S.navBtn,background:"var(--ok)",borderColor:"var(--ok)",color:"#000",fontWeight:900}} onClick={handleSubmit}>Submit ✓</button>
              }
            </div>
          </div>
          <div style={S.sidebar}>
            <div style={{fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:"var(--aws)",marginBottom:10}}>📋 Navigator</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:4,maxHeight:280,overflowY:"auto"}}>
              {session.questions.map((q,i)=>{
                const sel=ans[q.id]||[];
                const hasAns=sel.length>0;
                const isSubd2=!!sub[q.id];
                const isCorr=q.c.length===sel.length&&q.c.every(c=>sel.includes(c));
                const isFlagged=sFlags[q.id];
                const isVisited=visited[q.id];
                const isSkipped=isVisited&&!hasAns;
                let bg="var(--s2)",bc="var(--s4)",col="var(--t2)",bs="solid";
                if(i===qi){bc="#fff"}
                if(session.studyMode&&isSubd2){
                  if(isCorr){bg="var(--ok-bg)";bc="var(--ok-b)";col="var(--ok)"}
                  else{bg="var(--err-bg)";bc="var(--err-b)";col="var(--err)"}
                }
                else if(isFlagged&&hasAns){bg="rgba(245,158,11,.15)";bc="rgba(245,158,11,.5)";col="#f59e0b"}
                else if(isFlagged){bg="rgba(245,158,11,.1)";bc="rgba(245,158,11,.4)";col="#f59e0b";bs="dashed"}
                else if(hasAns){bg="rgba(59,130,246,.12)";bc="rgba(59,130,246,.5)";col="#3b82f6"}
                else if(isSkipped){bg="rgba(100,116,139,.08)";bc="rgba(100,116,139,.4)";col="#94a3b8";bs="dashed"}
                return<button key={i} onClick={()=>setQi(i)} style={{width:"100%",aspectRatio:1,borderRadius:6,border:`1px ${bs} ${bc}`,background:bg,color:col,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"monospace",outline:i===qi?"2px solid #fff":"none",outlineOffset:1}}>{i+1}</button>;
              })}
            </div>
            {/* Legend */}
            <div style={{marginTop:10,display:"flex",flexDirection:"column",gap:4}}>
              {[
                ["rgba(59,130,246,.12)","rgba(59,130,246,.5)","#3b82f6","solid","Done"],
                ["rgba(245,158,11,.15)","rgba(245,158,11,.5)","#f59e0b","solid","Flagged"],
                ["rgba(100,116,139,.08)","rgba(100,116,139,.4)","#94a3b8","dashed","Skipped"],
                ...(session.studyMode?[
                  ["var(--ok-bg)","var(--ok-b)","var(--ok)","solid","Correct"],
                  ["var(--err-bg)","var(--err-b)","var(--err)","solid","Wrong"],
                ]:[]),
              ].map(([lbg,lbc,lcol,lstyle,lbl])=>(
                <div key={lbl} style={{display:"flex",alignItems:"center",gap:6}}>
                  <div style={{width:12,height:12,borderRadius:3,background:lbg,border:`1px ${lstyle} ${lbc}`,flexShrink:0}}/>
                  <span style={{fontSize:10,color:lcol,fontWeight:600,textTransform:"uppercase",letterSpacing:.5}}>{lbl}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if(screen==="report"&&session&&reportStats){
    const{total,correct,pct,passed,dC,dT,items}=reportStats;
    const circ=2*Math.PI*42;
    const missed=items.filter(i=>!i.ok);
    return(
      <div style={{...S.app,padding:0}}>
        <div style={{maxWidth:1000,margin:"0 auto",padding:"24px 20px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20,flexWrap:"wrap",gap:10}}>
            <div>
              <div style={{fontSize:13,fontWeight:700,color:"var(--aws)",textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>{session.label} — Complete</div>
              <h2 style={{fontSize:23,fontWeight:900,color:"#fff",textTransform:"uppercase"}}>Results</h2>
            </div>
            <button style={S.btnSm} onClick={()=>setScreen("dash")}>← Dashboard</button>
          </div>
          <div style={{...S.card,display:"flex",justifyContent:"space-between",alignItems:"center",gap:20,marginBottom:16,flexWrap:"wrap"}}>
            <div>
              <div style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:13,fontWeight:700,padding:"4px 12px",borderRadius:6,marginBottom:12,background:passed?"var(--ok-bg)":"var(--err-bg)",border:`1px solid ${passed?"var(--ok-b)":"var(--err-b)"}`,color:passed?"var(--ok)":"var(--err)"}}>
                {passed?"✓ PASSED (≥70%)":"✗ BELOW PASSING (70%)"}
              </div>
              <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
                {[["Correct",`${correct}/${total}`],["Answered",items.filter(i=>i.sel.length>0).length],["Missed",missed.length]].map(([l,v],k)=>(
                  <div key={k}><div style={{fontSize:12,color:"var(--t3)",textTransform:"uppercase",fontWeight:700,marginBottom:2}}>{l}</div><strong style={{fontSize:23,color:k===2?"var(--err)":"#fff",fontFamily:"monospace"}}>{v}</strong></div>
                ))}
              </div>
            </div>
            <div style={{position:"relative",width:100,height:100,flexShrink:0}}>
              <svg width="100" height="100" viewBox="0 0 100 100" style={{transform:"rotate(-90deg)"}}>
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="8"/>
                <circle cx="50" cy="50" r="42" fill="none" stroke={passed?"#22c55e":"#ef4444"} strokeWidth="8" strokeDasharray={circ} strokeDashoffset={circ*(1-pct/100)} strokeLinecap="round"/>
              </svg>
              <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                <span style={{fontSize:25,fontWeight:900,color:"#fff",fontFamily:"monospace"}}>{pct}%</span>
                <span style={{fontSize:11,color:"var(--t3)",textTransform:"uppercase",letterSpacing:1}}>Score</span>
              </div>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
            <div style={S.card}>
              <div style={{fontSize:14,fontWeight:700,color:"var(--aws)",textTransform:"uppercase",marginBottom:12}}>Domain Breakdown</div>
              {Object.entries(dT).map(([d,t])=>{
                const c2=dC[d]||0;const sc2=t>0?Math.round(c2/t*100):0;
                return(
                  <div key={d} style={{background:"var(--s2)",borderRadius:8,borderLeft:`3px solid ${DM[d]?.c||"var(--aws)"}`,padding:14,marginBottom:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                      <span style={{color:"#fff",fontWeight:700,fontSize:14}}>{DM[d]?.e} {d.split(": ")[1]}</span>
                      <span style={{color:DM[d]?.c,fontWeight:900,fontFamily:"monospace"}}>{c2}/{t} ({sc2}%)</span>
                    </div>
                    <div style={{background:"var(--s3)",height:6,borderRadius:3,overflow:"hidden"}}>
                      <div style={{width:`${sc2}%`,height:"100%",background:DM[d]?.c||"var(--aws)",borderRadius:3,transition:"width .3s"}}/>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={S.card}>
              <div style={{fontSize:14,fontWeight:700,color:"var(--aws)",textTransform:"uppercase",marginBottom:12}}>Actions</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {[
                  ["↺ Retry Same","var(--aws-s2)",()=>{setAns({});setSub({});setSFlags({});setQi(0);setTLeft(session.isTimed?session.time:0);setScreen("exam")}],
                  ["✗ Retry Mistakes","rgba(239,68,68,.15)",()=>{if(!missed.length){alert("No mistakes!");return}startSession({type:"err",label:`Retry (${missed.length}Q)`,questions:missed.map(i=>i.q),isTimed:false,time:0,studyMode:true})}],
                  ["↓ Export","var(--s2)",()=>{
                    const wrongItems = items.filter(i => !i.ok);
                    const flaggedItems = items.filter(i => sFlags[i.q.id] || flags[i.q.id]);
                    const formatQ = (i, includeFlagged = false) => ({
                      id: i.q.id,
                      question: i.q.q,
                      options: i.q.o,
                      yourAnswer: i.sel,
                      correctAnswer: i.q.c,
                      isCorrect: i.ok,
                      ...(includeFlagged ? { isFlagged: !!(sFlags[i.q.id] || flags[i.q.id]) } : {}),
                      domain: i.q.dc,
                      service: i.q.sc,
                      explanationUrl: i.q.du || null
                    });
                    const blob=new Blob([JSON.stringify({
                      exam: EXAM_ID,
                      label: session.label,
                      date: new Date().toISOString(),
                      score: `${pct}%`,
                      passed,
                      correct,
                      total,
                      allQuestions: items.map(i => formatQ(i, true)),
                      wrongQuestions: wrongItems.map(i => formatQ(i, true)),
                      flaggedQuestions: flaggedItems.map(i => formatQ(i, true))
                    },null,2)],{type:"application/json"});
                    const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=EXAM_ID+"_exam_analysis.json";a.click();
                  }],
                  ["🏠 Dashboard","var(--s2)",()=>{setSession(null);setScreen("dash")}]
                ].map(([label,bg,fn],i)=>(
                  <button key={i} onClick={fn} style={{padding:10,borderRadius:9,fontSize:14,fontWeight:700,cursor:"pointer",border:"1px solid var(--s4)",background:bg,color:"#fff",transition:"all .15s",textTransform:"uppercase",letterSpacing:.5}}>{label}</button>
                ))}
              </div>
              <button onClick={()=>setShowAudit(a=>!a)} style={{width:"100%",padding:10,marginTop:10,borderRadius:9,fontSize:14,fontWeight:700,cursor:"pointer",border:"1px solid var(--s4)",background:"var(--s2)",color:"var(--t2)",textTransform:"uppercase",letterSpacing:.5}}>
                {showAudit?"▲ Hide Audit":"▼ Show Full Audit"}
              </button>
            </div>
          </div>
          
          <div style={{...S.card, marginBottom: 16}}>
            <div style={{fontSize:14,fontWeight:700,color:"var(--aws)",textTransform:"uppercase",marginBottom:14}}>Question Map</div>
            <div style={{display:"flex",gap:12,marginBottom:12,flexWrap:"wrap"}}>
              {[
                ["var(--ok-bg)","var(--ok-b)","var(--ok)","solid","Correct"],
                ["var(--err-bg)","var(--err-b)","var(--err)","solid","Wrong"],
                ["rgba(100,116,139,.08)","rgba(100,116,139,.4)","#94a3b8","dashed","Skipped"],
                ["transparent","rgba(245,158,11,.8)","#f59e0b","dashed","Flagged (Border)"]
              ].map(([lbg,lbc,lcol,lstyle,lbl])=>(
                <div key={lbl} style={{display:"flex",alignItems:"center",gap:6}}>
                  <div style={{width:16,height:16,borderRadius:4,background:lbg,border:`2px ${lstyle} ${lbc}`}}/>
                  <span style={{fontSize:12,color:lcol,fontWeight:700}}>{lbl}</span>
                </div>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(40px, 1fr))",gap:8}}>
              {items.map((item, i) => {
                const isFlagged = sFlags[item.q.id] || flags[item.q.id];
                const isSkipped = item.sel.length === 0;
                const isCorr = item.ok;
                let bg, bc, col, bs="solid", bw="1px";
                if (isSkipped) { bg="rgba(100,116,139,.08)"; bc="rgba(100,116,139,.4)"; col="#94a3b8"; bs="dashed"; }
                else if (isCorr) { bg="var(--ok-bg)"; bc="var(--ok-b)"; col="var(--ok)"; }
                else { bg="var(--err-bg)"; bc="var(--err-b)"; col="var(--err)"; }

                if (isFlagged) { bs="dashed"; bc="rgba(245,158,11,.8)"; bw="2px"; }
                
                return (
                  <div key={i} title={isFlagged ? "Flagged" : ""} onClick={()=>{
                      setShowAudit(true);
                      setTimeout(() => {
                        const el = document.getElementById(`audit-q-${item.q.id}`);
                        if(el) el.scrollIntoView({behavior: "smooth", block: "center"});
                      }, 100);
                    }} style={{aspectRatio:1,borderRadius:6,border:`${bw} ${bs} ${bc}`,background:bg,color:col,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,fontFamily:"monospace", cursor:"pointer"}}>
                    {i+1}
                  </div>
                )
              })}
            </div>
          </div>
          {showAudit&&(
            <div style={{...S.card}}>
              <div style={{fontSize:14,fontWeight:700,color:"var(--aws)",textTransform:"uppercase",marginBottom:14}}>Question Audit ({items.length} questions)</div>
              {/* Audit summary badges */}
              <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
                {[
                  ["✓ Correct",items.filter(i=>i.ok).length,"var(--ok-bg)","var(--ok-b)","var(--ok)"],
                  ["✗ Wrong",items.filter(i=>!i.ok&&(i.sel.length>0)).length,"var(--err-bg)","var(--err-b)","var(--err)"],
                  ["— Skipped",items.filter(i=>i.sel.length===0).length,"var(--s2)","var(--s3)","var(--t3)"],
                  ["⚑ Flagged",items.filter(i=>sFlags[i.q.id]||flags[i.q.id]).length,"rgba(245,158,11,.12)","rgba(245,158,11,.3)","#f59e0b"],
                ].map(([label,count,bg,bc,col])=>(
                  <span key={label} style={{fontSize:12,fontWeight:700,padding:"4px 10px",borderRadius:5,background:bg,border:`1px solid ${bc}`,color:col}}>{label}: {count}</span>
                ))}
              </div>
              {items.map((item,i)=>{
                const wasFlagged=sFlags[item.q.id]||flags[item.q.id];
                const wasSkipped=item.sel.length===0;
                let leftBorderColor=item.ok?"var(--ok)":"var(--err)";
                if(wasSkipped)leftBorderColor="var(--t3)";
                return(
                <div id={`audit-q-${item.q.id}`} key={item.q.id} style={{padding:"14px 0 14px 12px",borderBottom:"1px solid var(--s3)",borderLeft:`3px solid ${leftBorderColor}`,marginBottom:2}}>
                  <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10,flexWrap:"wrap"}}>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:5,flexWrap:"wrap"}}>
                        <span style={{fontSize:12,fontWeight:700,color:"#fff",fontFamily:"monospace"}}>#{i+1} (Q{item.q.id})</span>
                        <span style={{fontSize:12,fontWeight:700,padding:"2px 7px",borderRadius:4,background:wasSkipped?"var(--s2)":(item.ok?"var(--ok-bg)":"var(--err-bg)"),border:`1px solid ${wasSkipped?"var(--s3)":(item.ok?"var(--ok-b)":"var(--err-b)")}`,color:wasSkipped?"var(--t3)":(item.ok?"var(--ok)":"var(--err)")}}>{wasSkipped?"— Skipped":(item.ok?"✓ Correct":"✗ Wrong")}</span>
                        {wasFlagged&&<span style={{fontSize:12,fontWeight:700,padding:"2px 7px",borderRadius:4,background:"rgba(245,158,11,.12)",border:"1px solid rgba(245,158,11,.3)",color:"#f59e0b"}}>⚑ Flagged</span>}
                        <span style={{fontSize:12,color:"var(--t3)"}}>{item.q.sc}</span>
                      </div>
                      <p style={{fontSize:15,color:"#fff",lineHeight:1.5,marginBottom:6}}>{item.q.q}</p>
                      <div style={{fontSize:14,color:"var(--t2)",fontFamily:"monospace"}}>
                        Your: <strong style={{color:wasSkipped?"var(--t3)":(item.ok?"var(--ok)":"var(--err)")}}>{item.sel.join(", ")||"— (not answered)"}</strong>
                        {" · "}Correct: <strong style={{color:"var(--ok)"}}>{item.q.c.join(", ")}</strong>
                      </div>
                    </div>
                    {item.q.du&&<a href={item.q.du} target="_blank" rel="noopener noreferrer" style={{fontSize:12,color:"var(--aws)",textDecoration:"none",fontWeight:700,whiteSpace:"nowrap"}}>Discussion ↗</a>}
                  </div>
                </div>
              );})}
            </div>
          )}
        </div>
      </div>
    );
  }

  return(
    <div style={S.app}>
      <div style={S.hdr}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:36,height:36,background:"rgba(255,153,0,.15)",border:"1px solid rgba(255,153,0,.3)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:21}}>🎓</div>
          <div>
            <h1 style={{fontSize:16,fontWeight:900,color:"#fff",letterSpacing:1,textTransform:"uppercase"}}>{EXAM_TITLE}</h1>
            <p style={{fontSize:12,color:"var(--t3)",letterSpacing:2,textTransform:"uppercase",marginTop:1}}>{RAW.length} Questions · Practice & Exam Simulator</p>
          </div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button style={{...S.btnSm,color:"var(--t2)",background:"var(--s2)",borderColor:"var(--s3)",display:"flex",alignItems:"center",gap:4}} onClick={onSwitch}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" /></svg>
            Switch Exam
          </button>
          <button style={{...S.btnSm,color:"var(--err)",background:"rgba(239,68,68,.1)",borderColor:"rgba(239,68,68,.3)"}} onClick={handleResetProg}>Clear Progress</button>
        </div>
      </div>
      <div style={{background:"var(--s2)",borderBottom:"1px solid var(--s3)",padding:"8px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",fontSize:13,fontFamily:"monospace",color:"var(--t2)",flexWrap:"wrap",gap:6}}>
        <span>● DATABASE: <strong style={{color:"#fff"}}>{RAW.length} QUESTIONS</strong> loaded</span>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {[["Solved",`${totalAns}/${RAW.length}`],["Accuracy",`${accuracy}%`,accuracy>=70?"var(--ok)":"var(--aws)"],["Mistakes",mistakes.length,"var(--err)"],["Flags",Object.values(flags).filter(Boolean).length,"#f59e0b"]].map(([l,v,c],i)=>(
            <span key={i} style={{background:"var(--s1)",border:"1px solid var(--s3)",padding:"3px 8px",borderRadius:5,fontSize:13}}>{l}: <strong style={{color:c||"#fff"}}>{v}</strong></span>
          ))}
        </div>
      </div>
      <div style={{maxWidth:1200,margin:"0 auto",padding:"24px 20px"}}>
        <div style={{display:"flex",gap:2,background:"var(--s2)",border:"1px solid var(--s3)",padding:3,borderRadius:10,width:"fit-content",marginBottom:24}}>
          {["study","browse","stats"].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{padding:"8px 18px",borderRadius:8,fontSize:14,fontWeight:700,textTransform:"uppercase",letterSpacing:.5,cursor:"pointer",border:"none",background:tab===t?"var(--aws)":"transparent",color:tab===t?"#000":"var(--t2)",transition:"all .15s"}}>
              {t==="study"?"📚 Study":t==="browse"?"🔍 Browse":"📊 Stats"}
            </button>
          ))}
        </div>
        {tab==="study"&&(
          <div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(320px, 1fr))",gap:16,marginBottom:16}}>
              {[
                {id:"01",title:"Sequential Study",sub:`Q#1 to Q#${RAW.length} in order`,desc:"Study questions in curriculum order. Perfect for systematic reading or picking up where you left off.",body:(
                  <>
                    <div style={S.label}>Starting Question</div>
                    <div style={S.inpBox}><span style={{fontSize:12,color:"var(--t3)",fontWeight:700,textTransform:"uppercase"}}>Range: 1–{RAW.length}</span><input type="number" min="1" max={RAW.length} value={seqStart} onChange={e=>setSeqStart(Math.max(1,Math.min(RAW.length,+e.target.value||1)))} style={{background:"transparent",border:"none",outline:"none",color:"#fff",fontWeight:900,fontSize:17,textAlign:"right",width:60,fontFamily:"monospace"}}/></div>
                    <div style={S.label}>Count</div>
                    <div style={S.rangeWrap}><input type="range" min="5" max={RAW.length} step="5" value={seqN} onChange={e=>setSeqN(+e.target.value)} style={{width:"100%",accentColor:"var(--aws)",cursor:"pointer",height:4}}/><span style={S.rangeVal}>{seqN}</span></div>
                    <div style={S.label}>Time Limit</div>
                    {seqUnlim?<div style={S.unlimInfo}>∞ Self-paced</div>:<div style={S.rangeWrap}><input type="range" min="10" max="200" step="10" value={seqT} onChange={e=>setSeqT(+e.target.value)} style={{width:"100%",accentColor:"var(--aws)",cursor:"pointer",height:4}}/><span style={S.rangeVal}>{seqT}m</span></div>}
                    <div style={{textAlign:"right",marginTop:4}}><button style={{...S.btnSm,marginTop:0,fontSize:12,padding:"4px 8px",background:seqUnlim?"rgba(255,153,0,.15)":"var(--s2)",borderColor:seqUnlim?"var(--aws)":"var(--s3)",color:seqUnlim?"var(--aws)":"var(--t2)"}} onClick={()=>setSeqUnlim(u=>!u)}>{seqUnlim?"Unlimited ON":"Set Unlimited"}</button></div>
                    <div style={S.label}>Feedback Mode</div>
                    <div style={S.seg}><button style={{...S.segBtn,background:seqMode==="instant"?"var(--aws)":"transparent",color:seqMode==="instant"?"#000":"var(--t2)"}} onClick={()=>setSeqMode("instant")}>Instant</button><button style={{...S.segBtn,background:seqMode==="deferred"?"var(--aws)":"transparent",color:seqMode==="deferred"?"#000":"var(--t2)"}} onClick={()=>setSeqMode("deferred")}>At End</button></div>
                    <button style={S.launchBtn} onClick={launchSeq}>▶ Launch Sequence</button>
                  </>
                )},
                {id:"02",title:"Random Exam",sub:"Simulates real test",desc:`Randomized from all ${RAW.length}. Use "At End" mode for a realistic exam simulation experience.`,body:(
                  <>
                    <div style={S.label}>Question Count</div>
                    <div style={S.rangeWrap}><input type="range" min="5" max={RAW.length} step="5" value={randN} onChange={e=>setRandN(+e.target.value)} style={{width:"100%",accentColor:"var(--aws)",cursor:"pointer",height:4}}/><span style={S.rangeVal}>{randN}</span></div>
                    <div style={S.label}>Time Limit</div>
                    {randUnlim?<div style={S.unlimInfo}>∞ Self-paced</div>:<div style={S.rangeWrap}><input type="range" min="10" max="200" step="10" value={randT} onChange={e=>setRandT(+e.target.value)} style={{width:"100%",accentColor:"var(--aws)",cursor:"pointer",height:4}}/><span style={S.rangeVal}>{randT}m</span></div>}
                    <div style={{textAlign:"right",marginTop:4}}><button style={{...S.btnSm,marginTop:0,fontSize:12,padding:"4px 8px",background:randUnlim?"rgba(255,153,0,.15)":"var(--s2)",borderColor:randUnlim?"var(--aws)":"var(--s3)",color:randUnlim?"var(--aws)":"var(--t2)"}} onClick={()=>setRandUnlim(u=>!u)}>{randUnlim?"Unlimited ON":"Set Unlimited"}</button></div>
                    <div style={S.label}>Feedback Mode</div>
                    <button style={S.launchBtn} onClick={launchRand}>▶ Launch Exam</button>
                  </>
                )}
              ].map(({id,title,sub,desc,body})=>(
                <div key={id} style={S.card}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
                    <div style={{width:32,height:32,borderRadius:8,background:"rgba(255,153,0,.1)",border:"1px solid rgba(255,153,0,.2)",color:"var(--aws)",fontSize:14,fontWeight:900,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"monospace",flexShrink:0}}>{id}</div>
                    <div><div style={{fontSize:15,fontWeight:900,color:"#fff",textTransform:"uppercase",letterSpacing:.5,fontFamily:"var(--font-display)"}}>{title}</div><div style={{fontSize:12,color:"var(--t3)",textTransform:"uppercase",letterSpacing:1}}>{sub}</div></div>
                  </div>
                  <p style={{fontSize:14,color:"var(--t2)",lineHeight:1.7,marginBottom:14}}>{desc}</p>
                  <div style={{height:1,background:"var(--s3)",margin:"14px 0"}}/>
                  {body}
                </div>
              ))}
            </div>

            {/* Redesigned Custom Focus Section */}
            <div style={{...S.card, display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(400px, 1fr))", gap:24, marginBottom:16, background:"linear-gradient(135deg, var(--s1) 0%, rgba(20,30,48,0.4) 100%)", border:"1px solid var(--s3)", boxShadow:"0 10px 30px rgba(0,0,0,0.3)"}}>
              {/* Left Column: Targeting */}
              <div style={{display:"flex", flexDirection:"column", gap:16}}>
                <div>
                  <div style={{display:"flex", alignItems:"center", gap:10, marginBottom:8}}>
                    <div style={{width:32,height:32,borderRadius:8,background:"rgba(255,153,0,.15)",border:"1px solid rgba(255,153,0,.3)",color:"var(--aws)",fontSize:14,fontWeight:900,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"monospace",flexShrink:0}}>03</div>
                    <div>
                      <h3 style={{fontSize:15,fontWeight:900,color:"#fff",textTransform:"uppercase",letterSpacing:.5,fontFamily:"var(--font-display)"}}>Custom Focus</h3>
                      <p style={{fontSize:12,color:"var(--t3)",textTransform:"uppercase",letterSpacing:1}}>Domain & Service Targeting</p>
                    </div>
                  </div>
                  <p style={{fontSize:14,color:"var(--t2)",lineHeight:1.6}}>Select an exam preset, filter by status, or click individual domains/services to customize your practice pool.</p>
                </div>

                {/* Presets Grid */}
                <div>
                  <div style={{...S.label, marginTop:0, marginBottom:8}}>Select Exam Presets</div>
                  <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:8}}>
                    {Object.entries(PRESETS).map(([key, preset]) => {
                      const terms = preset.terms;
                      const presetServices = uniqueSrvs.filter(s => {
                        const sLow = s.toLowerCase();
                        return terms.some(t => sLow.includes(t));
                      });
                      const isActive = presetServices.length > 0 && presetServices.every(s => custSrvs.includes(s));
                      
                      return (
                        <button key={key} className={`preset-btn ${isActive ? 'active' : ''}`} onClick={() => applyPreset(key)} style={{
                          display:"flex",
                          flexDirection:"column",
                          alignItems:"flex-start",
                          textAlign:"left",
                          padding:"12px 14px",
                          borderRadius:8,
                          border: isActive ? "1px solid var(--aws)" : "1px solid var(--s3)",
                          background: isActive ? "rgba(255,153,0,0.06)" : "var(--s2)",
                          cursor:"pointer",
                          position:"relative"
                        }}>
                          <div style={{display:"flex", justifyContent:"space-between", width:"100%", alignItems:"center", marginBottom:4}}>
                            <span style={{fontSize:13, fontWeight:800, color: isActive ? "var(--aws)" : "#fff"}}>{preset.label}</span>
                            {isActive && (
                              <span style={{fontSize:13, color:"var(--aws)", fontWeight:"bold"}}>✓</span>
                            )}
                          </div>
                          <span style={{fontSize:11.5, color: isActive ? "var(--t2)" : "var(--t3)", lineHeight:1.3}}>{preset.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Question Status Filters */}
                <div>
                  <div style={{...S.label, marginTop:0, marginBottom:8}}>Filter by Question Status</div>
                  <div style={{display:"flex", gap:6, background:"var(--s2)", border:"1px solid var(--s3)", padding:3, borderRadius:8, width:"fit-content", flexWrap:"wrap"}}>
                    {[
                      { id: "all", label: "All Questions", count: qs.length },
                      { id: "unsolved", label: "Unsolved", count: qs.length - totalAns },
                      { id: "wrong", label: "Mistakes", count: mistakes.length },
                      { id: "flagged", label: "Flagged", count: Object.values(flags).filter(Boolean).length }
                    ].map(item => {
                      const active = custStatus === item.id;
                      return (
                        <button key={item.id} className={`status-btn ${active ? 'active' : ''}`} onClick={() => setCustStatus(item.id)} style={{
                          padding:"8px 14px",
                          fontSize:12.5,
                          fontWeight:700,
                          cursor:"pointer",
                          border:"none",
                          background: "transparent",
                          color: "var(--t2)",
                          display:"flex",
                          alignItems:"center",
                          gap:6
                        }}>
                          {item.label}
                          <span className="count-badge" style={{
                            fontSize:11,
                            padding:"1px 5px",
                            borderRadius:4,
                            fontWeight:"bold"
                          }}>{item.count}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Domains & Services Accordion List with Search */}
                <div>
                  <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8, flexWrap:"wrap", gap:6}}>
                    <div style={{...S.label, marginTop:0, marginRight:"auto"}}>Target AWS Domains & Services</div>
                    <input placeholder="🔍 Filter services..." value={custSrchFilter} onChange={e=>setCustSrchFilter(e.target.value)}
                      style={{
                        background:"var(--s2)",
                        border:"1px solid var(--s3)",
                        borderRadius:6,
                        padding:"6px 10px",
                        color:"#fff",
                        fontSize:13,
                        outline:"none",
                        width:160,
                        fontFamily:"monospace"
                      }} />
                  </div>

                  {/* Active Selection Info */}
                  {(custDoms.length > 0 || custSrvs.length > 0) && (
                    <div style={{display:"flex", flexWrap:"wrap", gap:6, marginBottom:10, alignItems:"center"}}>
                      <span style={{fontSize:12, color:"var(--t3)"}}>Active Filters:</span>
                      {custDoms.map(d=>(
                        <span key={d} style={{display:"inline-flex", alignItems:"center", gap:4, fontSize:11, fontWeight:700, background:`${DM[d]?.c}22`, border:`1px solid ${DM[d]?.c}44`, color:DM[d]?.c, padding:"2px 6px", borderRadius:4}}>
                          {DM[d]?.e} {d.split(": ")[1].substring(0,10)}...
                          <button onClick={()=>toggleDomain(d)} style={{border:"none", background:"none", color:DM[d]?.c, cursor:"pointer", fontWeight:"bold", padding:0, fontSize:13}}>×</button>
                        </span>
                      ))}
                      {custSrvs.map(s=>(
                        <span key={s} style={{display:"inline-flex", alignItems:"center", gap:4, fontSize:11, fontWeight:700, background:"rgba(255,153,0,0.1)", border:"1px solid rgba(255,153,0,0.3)", color:"var(--aws)", padding:"2px 6px", borderRadius:4}}>
                          {s}
                          <button onClick={()=>toggleService(s)} style={{border:"none", background:"none", color:"var(--aws)", cursor:"pointer", fontWeight:"bold", padding:0, fontSize:13}}>×</button>
                        </span>
                      ))}
                      <button onClick={()=>{setCustDoms([]); setCustSrvs([]);}} style={{border:"none", background:"none", color:"var(--err)", cursor:"pointer", fontSize:11, fontWeight:700, padding:0, marginLeft:4}}>Clear All ×</button>
                    </div>
                  )}

                  {/* Accordions Container */}
                  <div style={{maxHeight:360, overflowY:"auto", paddingRight:4}}>
                    {DOMAINS.map((d, idx) => {
                      const meta = DM[d];
                      const domState = getDomainState(d);
                      const isOpen = !!expandedDoms[idx];
                      
                      const domServices = uniqueSrvs.filter(s => srvDomMap[s] === d);
                      const matchedServices = domServices.filter(s => filteredSrvs.includes(s));
                      
                      if (custSrchFilter && matchedServices.length === 0) return null;
                      
                      const selectedCount = domServices.filter(s => custSrvs.includes(s)).length;
                      
                      return (
                        <div key={d} style={{border:"1px solid var(--s3)", borderRadius:8, marginBottom:8, overflow:"hidden", background:"var(--s1)"}}>
                          {/* Accordion Header */}
                          <div className="accordion-hdr" style={{
                            display:"flex",
                            alignItems:"center",
                            justifyContent:"space-between",
                            padding:"10px 14px",
                            background:"var(--s2)",
                            cursor:"pointer",
                            userSelect:"none"
                          }} onClick={() => setExpandedDoms(prev => ({...prev, [idx]: !prev[idx]}))}>
                            
                            <div style={{display:"flex", alignItems:"center", flex:1, minWidth:0}} onClick={(e) => {
                              e.stopPropagation();
                              toggleDomain(d);
                            }}>
                              {/* Custom Checkbox */}
                              <div style={{
                                width: 14,
                                height: 14,
                                borderRadius: 4,
                                border: `2px solid ${domState !== "unchecked" ? meta.c : "var(--s4)"}`,
                                background: domState === "checked" ? meta.c : domState === "indeterminate" ? `${meta.c}33` : "transparent",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "all 0.15s ease",
                                marginRight: 10,
                                flexShrink: 0
                              }}>
                                {domState === "checked" && (
                                  <svg viewBox="0 0 24 24" width="8" height="8" stroke="#000" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                  </svg>
                                )}
                                {domState === "indeterminate" && (
                                  <div style={{ width: 6, height: 2, background: meta.c, borderRadius: 1 }} />
                                )}
                              </div>
                              
                              <span style={{fontSize:17, marginRight:8}}>{meta.e}</span>
                              <div style={{minWidth:0, flex:1, marginRight:10}}>
                                <div style={{fontSize:13, fontWeight:700, color:"#fff", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", fontFamily:"var(--font-display)"}}>
                                  {d.split(": ")[1]}
                                </div>
                                <div style={{fontSize:11, color:"var(--t3)", marginTop:1}}>
                                  {selectedCount} of {domServices.length} services selected · {domCounts[d]} Qs
                                </div>
                              </div>
                            </div>
                            
                            <span style={{fontSize:15, color:"var(--t3)"}}>{isOpen ? "▲" : "▼"}</span>
                          </div>
                          
                          {/* Services List Body */}
                          {isOpen && (
                            <div style={{padding:10, borderTop:"1px solid var(--s3)", background:"rgba(10,14,20,0.3)"}}>
                              <div style={{display:"flex", gap:8, marginBottom:8}}>
                                <button className="dom-toggle-btn" style={{
                                  background:"transparent",
                                  border:"1px solid var(--s3)",
                                  borderRadius:4,
                                  color:"var(--t2)",
                                  fontSize:11,
                                  padding:"2px 6px",
                                  cursor:"pointer",
                                  fontWeight:700
                                }} onClick={() => {
                                  setCustSrvs(prev => {
                                    const filtered = prev.filter(s => srvDomMap[s] !== d);
                                    return [...filtered, ...domServices];
                                  });
                                  setCustDoms(prev => prev.includes(d) ? prev : [...prev, d]);
                                }}>Select All</button>
                                <button className="dom-toggle-btn" style={{
                                  background:"transparent",
                                  border:"1px solid var(--s3)",
                                  borderRadius:4,
                                  color:"var(--t2)",
                                  fontSize:11,
                                  padding:"2px 6px",
                                  cursor:"pointer",
                                  fontWeight:700
                                }} onClick={() => {
                                  setCustSrvs(prev => prev.filter(s => srvDomMap[s] !== d));
                                  setCustDoms(prev => prev.filter(x => x !== d));
                                }}>Clear All</button>
                              </div>
                              
                              <div style={{display:"flex", flexWrap:"wrap", gap:5}}>
                                {matchedServices.map(s => {
                                  const active = custSrvs.includes(s);
                                  return (
                                    <button key={s} className="srv-chip" onClick={() => toggleService(s)} style={{
                                      fontSize:12,
                                      fontWeight:600,
                                      padding:"3px 6px",
                                      borderRadius:5,
                                      cursor:"pointer",
                                      border: active ? `1px solid ${meta.c}` : "1px solid var(--s3)",
                                      color: active ? "#fff" : "var(--t2)",
                                      background: active ? `${meta.c}22` : "var(--s2)",
                                      display:"inline-flex",
                                      alignItems:"center",
                                      gap:4,
                                      transition:"all 0.15s"
                                    }}>
                                      <div style={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: 2,
                                        border: `1px solid ${active ? meta.c : "var(--t3)"}`,
                                        background: active ? meta.c : "transparent",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                      }}>
                                        {active && (
                                          <svg viewBox="0 0 24 24" width="6" height="6" stroke="#000" strokeWidth="5" fill="none">
                                            <polyline points="20 6 9 17 4 12" />
                                          </svg>
                                        )}
                                      </div>
                                      {highlightText(s, custSrchFilter)}
                                      <span style={{color:"var(--t3)", fontSize:10}}>({srvCounts[s]})</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Settings, Preview & Launch */}
              <div style={{display:"flex", flexDirection:"column", gap:14, background:"rgba(10,14,20,0.4)", padding:16, borderRadius:10, border:"1px solid var(--s3)", justifyContent:"space-between"}}>
                <div>
                  <div style={{fontSize:13, fontWeight:900, color:"var(--aws)", textTransform:"uppercase", letterSpacing:.5, marginBottom:10, fontFamily:"var(--font-display)"}}>Configure custom session</div>
                  
                  {/* Pool size info */}
                  <div style={{background:"var(--s2)", border:"1px solid rgba(255,153,0,.2)", borderRadius:8, padding:"8px 12px", display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10}}>
                    <div style={{textAlign:"left"}}>
                      <div style={{fontSize:12, color:"var(--t3)", textTransform:"uppercase", fontWeight:700}}>Matching Pool</div>
                      <div style={{fontSize:11, color:"var(--t2)", marginTop:1}}>Available questions matching filters</div>
                    </div>
                    <span style={{fontSize:19, fontWeight:900, color:"#fff", fontFamily:"monospace"}}>{custPool.length} <span style={{fontSize:13, color:"var(--t3)"}}>Q</span></span>
                  </div>

                  {/* Live Breakdown visual stacked bar chart */}
                  <div style={{background:"var(--s2)", border:"1px solid var(--s3)", borderRadius:8, padding:10, marginBottom:12}}>
                    <div style={{fontSize:11, fontWeight:700, color:"var(--t3)", textTransform:"uppercase", letterSpacing:.5, marginBottom:6, textAlign:"left"}}>Pool Makeup Breakdown</div>
                    {custPool.length > 0 ? (
                      <div>
                        <div style={{
                          display:"flex",
                          height:10,
                          borderRadius:5,
                          overflow:"hidden",
                          background:"var(--s3)",
                          marginBottom:8
                        }}>
                          {DOMAINS.map(d => {
                            const count = poolBreakdown[d] || 0;
                            if (count === 0) return null;
                            return (
                              <div key={d} style={{
                                width: `${(count / custPool.length) * 100}%`,
                                background: DM[d]?.c,
                                height: "100%",
                                transition: "width 0.3s ease"
                              }} />
                            );
                          })}
                        </div>
                        <div style={{display:"grid", gridTemplateColumns:"1fr", gap:5, marginTop:8}}>
                          {DOMAINS.map(d => {
                            const count = poolBreakdown[d] || 0;
                            const pct = custPool.length > 0 ? Math.round((count / custPool.length) * 100) : 0;
                            return (
                              <div key={d} style={{
                                display:"flex",
                                alignItems:"center",
                                justifyContent:"space-between",
                                gap:8,
                                fontSize:12,
                                color: count > 0 ? "var(--txt)" : "var(--t3)",
                                padding:"5px 8px",
                                borderRadius:6,
                                background: count > 0 ? "rgba(255,255,255,0.02)" : "transparent",
                                border: count > 0 ? "1px solid var(--s3)" : "1px solid transparent",
                                transition: "all 0.2s"
                              }}>
                                <div style={{display:"flex", alignItems:"center", gap:6, minWidth:0, flex:1}}>
                                  <div style={{width:8, height:8, borderRadius:"50%", background: DM[d]?.c, flexShrink:0, boxShadow: count > 0 ? `0 0 6px ${DM[d]?.c}` : "none"}} />
                                  <div style={{overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", fontWeight: count > 0 ? 600 : 400}}>
                                    {d.split(": ")[1]}
                                  </div>
                                </div>
                                <div style={{display:"flex", alignItems:"center", gap:6, flexShrink:0}}>
                                  <div style={{width:40, height:4, background:"var(--s3)", borderRadius:2, overflow:"hidden"}}><div style={{width:`${pct}%`, height:"100%", background: DM[d]?.c, borderRadius:2}} /></div>
                                  <span style={{fontFamily:"monospace", fontWeight:700, color: count > 0 ? DM[d]?.c : "var(--t3)", minWidth:28, textAlign:"right"}}>{pct}%</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div style={{fontSize:11, color:"var(--t3)", textAlign:"center", padding:"6px 0"}}>Select services or domains to view breakdown</div>
                    )}
                  </div>

                  {/* Question Count slider */}
                  <div style={S.label}>Question Count ({Math.min(custN, custPool.length || 5)}Q)</div>
                  <div style={S.rangeWrap}>
                    <input type="range" min={custPool.length === 0 ? 0 : 1} max={Math.max(1, custPool.length)} step={1} value={Math.min(custN, custPool.length || 5)} onChange={e=>setCustN(+e.target.value)} style={{width:"100%"}}/>
                    <span style={S.rangeVal}>{Math.min(custN, custPool.length || 5)}</span>
                  </div>

                  {/* Timer settings */}
                  <div style={S.label}>Time Limit</div>
                  {custUnlim ? (
                    <div style={S.unlimInfo}>∞ Self-paced (no time limit)</div>
                  ) : (
                    <div style={S.rangeWrap}>
                      <input type="range" min="10" max="200" step="10" value={custT} onChange={e=>setCustT(+e.target.value)} style={{width:"100%"}}/>
                      <span style={S.rangeVal}>{custT}m</span>
                    </div>
                  )}
                  <div style={{textAlign:"right",marginTop:4}}>
                    <button style={{...S.btnSm,marginTop:0,fontSize:12,padding:"4px 8px",background:custUnlim?"rgba(255,153,0,.15)":"var(--s2)",borderColor:custUnlim?"var(--aws)":"var(--s3)",color:custUnlim?"var(--aws)":"var(--t2)"}} onClick={()=>setCustUnlim(u=>!u)}>
                      {custUnlim ? "Timer: OFF" : "Timer: ON"}
                    </button>
                  </div>

                  {/* Feedback Mode */}
                  <div style={S.label}>Feedback Mode</div>
                  <div style={S.seg}>
                    <button style={{...S.segBtn,background:custMode==="instant"?"var(--aws)":"transparent",color:custMode==="instant"?"#000":"var(--t2)"}} onClick={()=>setCustMode("instant")}>Instant</button>
                    <button style={{...S.segBtn,background:custMode==="deferred"?"var(--aws)":"transparent",color:custMode==="deferred"?"#000":"var(--t2)"}} onClick={()=>setCustMode("deferred")}>At End</button>
                  </div>
                </div>

                <button className="launch-btn-custom" style={{...S.launchBtn, marginTop: 10}} onClick={launchCust} disabled={custPool.length === 0}>
                  🚀 Launch Custom Focus ({Math.min(custN, custPool.length || 5)} Qs)
                </button>
              </div>
            </div>
            <div style={{...S.card,background:"rgba(239,68,68,.05)",borderColor:"rgba(239,68,68,.2)"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{fontSize:31}}>🎯</div>
                  <div>
                    <div style={{fontSize:15,fontWeight:900,color:"#fff",textTransform:"uppercase",letterSpacing:.5}}>Mistake Drill</div>
                    <div style={{fontSize:13,color:"var(--t2)",marginTop:2}}>Retry all {mistakes.length} questions you have gotten wrong — shuffled, instant feedback, no timer.</div>
                  </div>
                </div>
                <button style={{...S.btnSm,background:"rgba(239,68,68,.15)",borderColor:"rgba(239,68,68,.4)",color:"var(--err)",padding:"10px 20px",opacity:mistakes.length===0?.4:1,cursor:mistakes.length===0?"not-allowed":"pointer"}} disabled={mistakes.length===0} onClick={launchMistakes}>
                  {mistakes.length===0?"No mistakes yet ✓":`▶ Drill ${mistakes.length} Mistakes`}
                </button>
              </div>
            </div>
          </div>
        )}

        {tab==="browse"&&(
          <div>
            <div style={{background:"rgba(255,153,0,.05)",border:"1px solid rgba(255,153,0,.2)",borderRadius:10,padding:"14px 16px",fontSize:14,color:"var(--t2)",lineHeight:1.7,marginBottom:16}}>Browse all {RAW.length} questions. Filter by domain, service, or status. Click any question to reveal the answer.</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:16}}>
              <input placeholder="🔍 Search questions, services, options..." value={srch} onChange={e=>{setSrch(e.target.value);setBrowseLimit(30)}} style={{background:"var(--s2)",border:"1px solid var(--s3)",borderRadius:8,padding:"8px 12px",color:"#fff",fontSize:15,width:280,outline:"none",fontFamily:"monospace"}}/>
              {[["bStat",bStat,setBStat,[["all","All Status"],["unanswered","Unanswered"],["correct","Correct"],["wrong","Wrong"]]],["bDom",bDom,setBDom,[["all","All Domains"],...DOMAINS.map(d=>[d,d.split(": ")[1]])]],["bSrv",bSrv,setBSrv,[["all","All Services"],...uniqueSrvs.map(s=>[s,s])]]].map(([k,val,setFn,opts])=>(
                <select key={k} value={val} onChange={e=>{setFn(e.target.value);setBrowseLimit(30)}} style={{background:"var(--s2)",border:"1px solid var(--s3)",borderRadius:8,padding:"8px 12px",color:"#fff",fontSize:14,outline:"none",cursor:"pointer",fontFamily:"monospace"}}>
                  {opts.map(([v,l])=><option key={v} value={v}>{l}</option>)}
                </select>
              ))}
            </div>
            <div style={{fontSize:13,color:"var(--t2)",marginBottom:12,fontFamily:"monospace",display:"flex",alignItems:"center",gap:8}}>
              Showing <strong style={{color:"#fff"}}>{Math.min(browseLimit,browseFiltered.length)}</strong> of <strong style={{color:"#fff"}}>{browseFiltered.length}</strong> questions
              {(srch||bStat!=="all"||bDom!=="all"||bSrv!=="all")&&<button style={{...S.btnSm,marginTop:0,fontSize:12,padding:"3px 8px"}} onClick={()=>{setSrch("");setBStat("all");setBDom("all");setBSrv("all")}}>Clear filters ×</button>}
            </div>
            {browseFiltered.slice(0,browseLimit).map(q=>{
              const st=prog[q.id]?.answered?(prog[q.id]?.correct?"correct":"wrong"):"unanswered";
              const isExp=expQ===q.id;
              return(
                <div key={q.id} onClick={()=>setExpQ(isExp?null:q.id)} style={{background:"var(--s1)",border:"1px solid var(--s3)",borderRadius:10,padding:14,marginBottom:8,cursor:"pointer",transition:"all .15s",borderColor:isExp?"rgba(255,153,0,.2)":"var(--s3)"}}>
                  <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12}}>
                    <div style={{display:"flex",gap:6,alignItems:"flex-start",flex:1}}>
                      <div style={{width:8,height:8,borderRadius:"50%",flexShrink:0,marginTop:5,background:st==="correct"?"var(--ok)":st==="wrong"?"var(--err)":"var(--s4)"}}/>
                      <div>
                        <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:4}}>
                          <span style={{fontSize:12,color:"var(--t3)",fontFamily:"monospace"}}>Q#{q.id}</span>
                          <span style={{fontSize:12,color:DM[q.dc]?.c||"var(--aws)",background:`${DM[q.dc]?.c||"var(--aws)"}22`,padding:"1px 6px",borderRadius:3,fontWeight:700}}>{q.dc.split(": ")[1]}</span>
                          <span style={{fontSize:12,color:"var(--t2)",background:"var(--s3)",padding:"1px 6px",borderRadius:3}}>{q.sc}</span>
                          {q.c.length>1&&<span style={{fontSize:12,color:"var(--aws)",background:"rgba(255,153,0,.1)",padding:"1px 6px",borderRadius:3,fontWeight:700}}>Choose 2</span>}
                        </div>
                        <div style={{fontSize:15,color:"#fff",fontWeight:600,lineHeight:1.5}}>{q.q}</div>
                      </div>
                    </div>
                    <span style={{fontSize:17,color:"var(--t3)",flexShrink:0}}>{isExp?"▲":"▼"}</span>
                  </div>
                  {isExp&&(
                    <div onClick={e=>e.stopPropagation()} style={{marginTop:12,paddingTop:12,borderTop:"1px solid var(--s3)"}}>
                      {Object.entries(q.o).map(([l,t])=>{
                        const isC=q.c.includes(l);
                        return(
                          <div key={l} style={{display:"flex",gap:8,alignItems:"flex-start",padding:"7px 10px",borderRadius:7,marginBottom:5,background:isC?"var(--ok-bg)":"var(--s2)",border:`1px solid ${isC?"var(--ok-b)":"var(--s4)"}`,fontSize:15,color:isC?"var(--ok)":"var(--t2)"}}>
                            <span style={{fontWeight:900,fontFamily:"monospace",flexShrink:0,color:isC?"var(--ok)":"var(--t3)"}}>{l}{isC?" ✓":""}</span>
                            <span>{t}</span>
                          </div>
                        );
                      })}
                      <div style={{fontSize:13,color:"var(--t3)",marginTop:6,fontFamily:"monospace"}}>
                        Correct: <strong style={{color:"var(--ok)"}}>{q.c.join(", ")}</strong>
                        {q.cv&&<> · Community: <strong style={{color:"var(--aws)"}}>{q.cv}</strong></>}
                        {q.du&&<> · <a href={q.du} target="_blank" rel="noopener noreferrer" style={{color:"var(--aws)",textDecoration:"none"}}>Discussion ↗</a></>}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            {browseFiltered.length>browseLimit&&(
              <button style={{...S.launchBtn,background:"var(--s2)"}} onClick={()=>setBrowseLimit(l=>l+30)}>Load 30 more ({browseFiltered.length-browseLimit} remaining)</button>
            )}
          </div>
        )}

        {tab==="stats"&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <div>
              <div style={{...S.card,marginBottom:16}}>
                <div style={{fontSize:14,fontWeight:700,color:"var(--aws)",textTransform:"uppercase",marginBottom:14}}>Overall Progress</div>
                <div style={{display:"flex",gap:20,marginBottom:16}}>
                  {[["Attempted",`${totalAns}/${RAW.length}`,"#fff"],["Correct",`${totalCorr}/${RAW.length}`,"var(--ok)"],["Accuracy",`${accuracy}%`,accuracy>=70?"var(--ok)":"var(--aws)"]].map(([l,v,c])=>(
                    <div key={l}><div style={{fontSize:12,color:"var(--t3)",textTransform:"uppercase",fontWeight:700,marginBottom:3}}>{l}</div><div style={{fontSize:23,fontWeight:900,color:c,fontFamily:"monospace"}}>{v}</div></div>
                  ))}
                </div>
                <div style={{background:"var(--s3)",height:8,borderRadius:4,overflow:"hidden"}}>
                  <div style={{width:`${totalAns/RAW.length*100}%`,height:"100%",background:"var(--aws)",borderRadius:4,transition:"width .3s"}}/>
                </div>
                <div style={{fontSize:12,color:"var(--t3)",marginTop:4}}>{RAW.length-totalAns} unanswered remaining</div>
              </div>
              <div style={S.card}>
                <div style={{fontSize:14,fontWeight:700,color:"var(--aws)",textTransform:"uppercase",marginBottom:14}}>Domain Accuracy</div>
                {statsData&&DOMAINS.map(d=>{
                  const ds=statsData.domS[d];
                  return(
                    <div key={d} style={{background:"var(--s2)",borderRadius:10,borderLeft:`3px solid ${DM[d]?.c||"var(--aws)"}`,padding:14,marginBottom:10}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                        <div><span style={{fontSize:15}}>{DM[d]?.e}</span> <strong style={{fontSize:14,color:"#fff"}}>{d.split(": ")[1]}</strong> <span style={{fontSize:12,color:"var(--t3)"}}>({DM[d]?.pct} of exam)</span></div>
                        <div style={{textAlign:"right"}}><strong style={{fontSize:16,color:ds.acc>=70?"var(--ok)":"var(--aws)",fontFamily:"monospace"}}>{ds.acc}%</strong><div style={{fontSize:12,color:"var(--t3)"}}>{ds.correct}/{ds.answered}</div></div>
                      </div>
                      <div style={{background:"var(--s3)",height:6,borderRadius:3,overflow:"hidden"}}>
                        <div style={{width:`${ds.acc}%`,height:"100%",background:DM[d]?.c||"var(--aws)",borderRadius:3,transition:"width .3s"}}/>
                      </div>
                      <div style={{fontSize:12,color:"var(--t3)",marginTop:4}}>{ds.answered}/{ds.total} attempted</div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <div style={{...S.card,marginBottom:16}}>
                <div style={{fontSize:14,fontWeight:700,color:"var(--err)",textTransform:"uppercase",marginBottom:12}}>⚠ Weakest Services</div>
                <div style={{fontSize:13,color:"var(--t2)",marginBottom:12}}>Services with lowest accuracy (min 2 attempts). Use Custom Focus to drill them.</div>
                {statsData?.weakest.length?statsData.weakest.map((w,i)=>(
                  <div key={w.s} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 10px",background:"var(--s2)",borderRadius:7,marginBottom:6,fontSize:14}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,flex:1}}>
                      <span style={{fontSize:13,color:"var(--t3)",fontFamily:"monospace",width:16}}>{i+1}.</span>
                      <span style={{color:"#fff",flex:1}}>{w.s}</span>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{width:80,height:5,background:"var(--s3)",borderRadius:3,overflow:"hidden"}}><div style={{width:`${w.acc}%`,height:"100%",background:w.acc<50?"var(--err)":w.acc<70?"var(--aws)":"var(--ok)",borderRadius:3}}/></div>
                      <span style={{fontSize:14,fontWeight:900,color:w.acc<50?"var(--err)":w.acc<70?"var(--aws)":"var(--ok)",fontFamily:"monospace",width:36,textAlign:"right"}}>{w.acc}%</span>
                      <span style={{fontSize:12,color:"var(--t3)"}}>({w.t})</span>
                    </div>
                  </div>
                )):<div style={{fontSize:14,color:"var(--t3)",textAlign:"center",padding:20}}>Answer at least 2 questions per service to see weak areas</div>}
                {statsData?.weakest.length>0&&(
                  <button style={{...S.launchBtn,background:"rgba(239,68,68,.1)",borderColor:"rgba(239,68,68,.3)",color:"var(--err)"}} onClick={()=>{
                    if(!statsData.weakest.length)return;
                    setCustSrvs(statsData.weakest.slice(0,3).map(w=>w.s));setCustDoms([]);setCustN(65);setCustUnlim(true);setCustMode("instant");setTab("study");
                  }}>→ Auto-target Top 3 Weak Services</button>
                )}
              </div>
              <div style={S.card}>
                <div style={{fontSize:14,fontWeight:700,color:"var(--aws)",textTransform:"uppercase",marginBottom:12}}>Exam Info</div>
                {DOMAINS.map((d)=>(
                  <div key={d} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:"1px solid var(--s3)",fontSize:14}}>
                    <span style={{color:"#fff"}}>{d}</span><span style={{fontWeight:900,color:DM[d]?.c||"var(--aws)",fontFamily:"monospace"}}>{DM[d]?.pct||"0%"}</span>
                  </div>
                ))}
                <div style={{background:"rgba(255,153,0,.05)",border:"1px solid rgba(255,153,0,.2)",borderRadius:10,padding:"14px 16px",fontSize:14,color:"var(--t2)",lineHeight:1.7,marginTop:12}}>
                  {examConfig.infoText}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const S={
  app:{minHeight:"100vh",background:"var(--bg)",color:"var(--txt)",fontFamily:"var(--font-sans)",fontSize:16},
  hdr:{background:"var(--s1)",borderBottom:"1px solid var(--s3)",padding:"12px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:50},
  card:{background:"var(--s1)",border:"1px solid var(--s3)",borderRadius:14,padding:20},
  label:{fontSize:12,fontWeight:700,color:"var(--t3)",textTransform:"uppercase",letterSpacing:.5,marginBottom:5,marginTop:10},
  inpBox:{background:"var(--s2)",border:"1px solid var(--s3)",borderRadius:8,padding:"8px 12px",display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10},
  rangeWrap:{background:"var(--s2)",border:"1px solid var(--s3)",borderRadius:8,padding:"8px 12px",display:"flex",alignItems:"center",gap:10,marginBottom:5},
  rangeVal:{background:"var(--s1)",border:"1px solid var(--s3)",borderRadius:5,padding:"2px 8px",fontSize:14,fontWeight:900,color:"#fff",fontFamily:"monospace",whiteSpace:"nowrap",minWidth:40,textAlign:"center"},
  seg:{display:"grid",gridTemplateColumns:"1fr 1fr",background:"var(--s2)",border:"1px solid var(--s3)",borderRadius:8,padding:3,gap:2,marginTop:5},
  segBtn:{padding:7,fontSize:13,fontWeight:700,textTransform:"uppercase",borderRadius:6,cursor:"pointer",border:"none",transition:"all .15s",letterSpacing:.5},
  unlimInfo:{border:"1px dashed var(--s4)",borderRadius:7,padding:10,fontSize:13,color:"var(--t3)",textAlign:"center",marginTop:5},
  launchBtn:{padding:12,width:"100%",borderRadius:10,fontSize:14,fontWeight:900,textTransform:"uppercase",cursor:"pointer",border:"1px solid var(--aws)",background:"var(--aws)",color:"#000",transition:"all .15s",display:"flex",alignItems:"center",justifyContent:"center",gap:6,letterSpacing:.5,marginTop:14},
  btnSm:{padding:"8px 14px",width:"auto",fontSize:13,fontWeight:700,textTransform:"uppercase",cursor:"pointer",border:"1px solid var(--s4)",background:"var(--s2)",color:"#fff",transition:"all .15s",display:"inline-flex",alignItems:"center",gap:5,letterSpacing:.5,borderRadius:9,marginTop:0,fontFamily:"monospace"},
  examWrap:{display:"flex",flexDirection:"column",minHeight:"100vh",background:"var(--bg)",fontFamily:"var(--font-sans)",fontSize:16},
  examHdr:{background:"var(--s1)",borderBottom:"1px solid var(--s3)",padding:"10px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap",position:"sticky",top:0,zIndex:50},
  examBody:{flex:1,maxWidth:1200,margin:"0 auto",width:"100%",padding:20,display:"grid",gridTemplateColumns:"1fr 280px",gap:16,alignItems:"start"},
  qCard:{background:"var(--s1)",border:"1px solid var(--s3)",borderRadius:14,padding:24,position:"relative",overflow:"hidden"},
  domBar:{position:"absolute",top:0,left:0,width:3,height:"100%",borderRadius:"2px 0 0 2px"},
  qTag:{display:"inline-flex",alignItems:"center",gap:5,fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:.5,padding:"4px 10px",borderRadius:5,background:"var(--s2)",border:"1px solid var(--s3)",color:"var(--t2)"},
  multiNotice:{display:"inline-flex",alignItems:"center",gap:6,background:"rgba(255,153,0,.1)",border:"1px solid rgba(255,153,0,.3)",color:"var(--aws)",fontSize:13,fontWeight:700,padding:"6px 12px",borderRadius:7,marginBottom:14,textTransform:"uppercase",letterSpacing:.5},
  qText:{fontSize:18,fontWeight:700,color:"#fff",lineHeight:1.6,margin:"14px 0 18px"},
  navBar:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,marginTop:16},
  navBtn:{padding:"10px 20px",borderRadius:9,fontSize:14,fontWeight:700,cursor:"pointer",border:"1px solid var(--s4)",background:"var(--s1)",color:"#fff",transition:"all .15s",display:"flex",alignItems:"center",gap:5,textTransform:"uppercase",letterSpacing:.5,whiteSpace:"nowrap",fontFamily:"monospace"},
  sidebar:{background:"var(--s1)",border:"1px solid var(--s3)",borderRadius:14,padding:16,position:"sticky",top:80},
  timer:{display:"flex",alignItems:"center",gap:6,padding:"7px 14px",borderRadius:8,fontSize:16,fontWeight:900,fontFamily:"monospace"},
  correctBadge:{fontSize:13,fontWeight:700,color:"var(--ok)",background:"var(--ok-bg)",border:"1px solid var(--ok-b)",padding:"3px 10px",borderRadius:5,textTransform:"uppercase"},
  wrongBadge:{fontSize:13,fontWeight:700,color:"var(--err)",background:"var(--err-bg)",border:"1px solid var(--err-b)",padding:"3px 10px",borderRadius:5,textTransform:"uppercase"},
};


export default function App() {
  const [examId, setExamId] = useState(null);

  // Check if they have an active exam from a previous session (optional)
  useEffect(() => {
    async function load() {
      try {
        const lastExam = await window.storage.get("aws_last_exam");
        if (lastExam?.value) {
          setExamId(lastExam.value);
        }
      } catch {}
    }
    load();
  }, []);

  const selectExam = async (id) => {
    setExamId(id);
    try {
      await window.storage.set("aws_last_exam", id);
    } catch {}
  };

  if (!examId) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#0f172a", color: "white", padding: "20px" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "30px", fontWeight: "bold" }}>Select Your Exam</h1>
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", justifyContent: "center" }}>
          {Object.values(EXAMS).map(exam => (
            <div 
              key={exam.id} 
              onClick={() => selectExam(exam.id)}
              style={{
                background: "#1e293b",
                border: "1px solid #334155",
                borderRadius: "12px",
                padding: "30px",
                cursor: "pointer",
                width: "300px",
                transition: "all 0.2s ease",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
              }}
              onMouseOver={(e) => e.currentTarget.style.borderColor = "#3b82f6"}
              onMouseOut={(e) => e.currentTarget.style.borderColor = "#334155"}
            >
              <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "10px", color: "#60a5fa" }}>{exam.id.toUpperCase()}</h2>
              <p style={{ color: "#94a3b8" }}>{exam.title}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <ExamEngine key={examId} examConfig={EXAMS[examId]} onSwitch={() => selectExam(null)} />
  );
}
