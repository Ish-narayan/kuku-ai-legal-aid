import { useMemo, useState } from 'react';
import { ArrowRight, Check, ChevronLeft, FileText, Landmark, Languages, Mic, Paperclip, Scale, ShieldCheck, Sparkles } from 'lucide-react';

type Problem = 'deposit' | 'salary' | 'refund';

const copy = {
  en: {
    greeting: 'Namaste! I can help you understand and act on a legal problem. What are you dealing with?',
    subtitle: 'Private, plain-language legal guidance',
    cases: [['Rental deposit','My landlord will not return my deposit','deposit'],['Unpaid salary','My employer stopped my salary','salary'],['Online refund','A seller has not refunded my money','refund']] as [string,string,Problem][],
  },
  hi: {
    greeting: 'नमस्ते! मैं आपकी कानूनी समस्या समझने और कार्रवाई करने में मदद कर सकता हूँ। आपको क्या परेशानी है?',
    subtitle: 'निजी और आसान कानूनी जानकारी',
    cases: [['किराया जमा','मकान मालिक जमा रकम नहीं लौटा रहा','deposit'],['बकाया वेतन','नियोक्ता ने मेरा वेतन रोक दिया','salary'],['ऑनलाइन रिफंड','दुकानदार ने पैसे वापस नहीं किए','refund']] as [string,string,Problem][],
  }
};

const guidance: Record<Problem, {title:string; steps:string[]; evidence:string[]; forum:string; notice:string}> = {
  deposit: { title:'Rental deposit', steps:['Send a written demand with a clear deadline.','Share a detailed account of the deposit and deductions claimed.','If unpaid, consider a formal consumer or civil remedy depending on the facts.'], evidence:['Rental/lease agreement','Payment proof','Move-out photos','WhatsApp, email or letters','Deduction details'], forum:'Local civil court, consumer process, or rent authority if applicable', notice:'I request return of the unpaid rental security deposit of ₹{amount} within {days} days. This amount is due under our rental arrangement dated {date}. Please make payment to {payment} or contact me to resolve it. A copy of this notice should be retained.' },
  salary: { title:'Unpaid salary', steps:['Write to the employer requesting a salary statement and payment.','Keep proof of employment, leave and work completed.','If unresolved, use the appropriate labour payment process or consult a labour lawyer.'], evidence:['Appointment letter','Salary slips','Bank statements','Attendance/work proof','Employer messages'], forum:'Appropriate labour authority or civil remedy, based on the employment facts', notice:'I request payment of outstanding salary of ₹{amount} for the period {date}. Please pay within {days} days or provide a written calculation and reason for the delay. Please retain proof of this communication.' },
  refund: { title:'Online refund', steps:['Raise a ticket and cite the original order and refund timeline.','Send one written escalation demanding the exact amount and deadline.','If unresolved, preserve the evidence and use the National Consumer Helpline or consumer process.'], evidence:['Order/booking receipt','Screenshot of promise','Chat and email records','Proof of payment','Cancellation/refund status'], forum:'NCH/consumer commission where the e-commerce transaction qualifies', notice:'Please refund ₹{amount} for the transaction dated {date}. It remains outstanding despite earlier requests. Please refund the amount within {days} days and provide a written confirmation. This notice is sent to preserve my claim.' }
};

export default function App(){
  const [lang,setLang]=useState<'en'|'hi'>('en');
  const [problem,setProblem]=useState<Problem|null>(null);
  const [step,setStep]=useState(0);
  const [amount,setAmount]=useState('');
  const [date,setDate]=useState('');
  const [days,setDays]=useState('7');
  const [drafted,setDrafted]=useState(false);
  const c=copy[lang];
  const selected=problem ? guidance[problem] : null;

  const notice=useMemo(()=>selected ? selected.notice.replace('{amount}',amount||'____').replace('{days}',days).replace('{date}',date||'________').replace('{payment}','the account details in my records') : '',[selected,amount,date,days]);

  function choose(p:Problem){ setProblem(p); setStep(1); }
  function reset(){ setProblem(null); setStep(0); setAmount(''); setDate(''); setDrafted(false); }

  return <div className="app">
    <aside className="sidebar">
      <div className="brand"><div className="brandmark"><Scale size={21}/></div><span>Nyaya AI</span></div>
      <button className="new-case" onClick={reset}><span>+</span> New case</button>
      <div className="side-label">RECENT</div>
      {problem && <div className="recent active"><div className="dot"/><div><b>{selected?.title}</b><small>In progress</small></div></div>}
      <div className="privacy"><ShieldCheck size={18}/><span><b>Private by design</b><small>Your details stay in this browser</small></span></div>
    </aside>

    <main>
      <header><div className="mobile-brand"><Scale size={20}/> Nyaya AI</div><div className="header-actions"><button className="lang" onClick={()=>setLang(lang==='en'?'hi':'en')}><Languages size={16}/>{lang==='en'?'हिंदी':'English'}</button><button className="avatar">U</button></div></header>

      <div className="workspace">
        <section className="chat">
          {step===0 ? <>
            <div className="assistant"><div className="ai-avatar"><Sparkles size={16}/></div><div className="bubble">{c.greeting}</div></div>
            <div className="cards">{c.cases.map(([title,example,p])=><button key={p} className="problem-card" onClick={()=>choose(p)}><div className="card-icon">{p==='deposit'?<Landmark size={20}/>:p==='salary'?<FileText size={20}/>:<ShieldCheck size={20}/>}</div><div><b>{title}</b><span>{example}</span></div><ArrowRight size={18}/></button>)}</div>
          </> : <>
            <div className="assistant"><div className="ai-avatar"><Sparkles size={16}/></div><div className="bubble">{lang==='en'?`Let's build your ${selected?.title.toLowerCase()} case. I'll keep this general and ask only for details needed for a notice.`:`मैं आपका ${selected?.title} केस तैयार करता हूँ। मैं सामान्य जानकारी दूँगा और केवल जरूरी विवरण पूछूँगा।`}</div></div>
            <div className="form-card">
              <div className="progress"><button onClick={()=>setStep(step>0?step-1:0)}><ChevronLeft size={16}/></button><div className="progress-track"><span style={{width:`${step===1?'33%':step===2?'66%':'100%'}`}}/></div><small>Step {step} of 3</small></div>
              {step===1 && <><h2>{lang==='en'?'How much is at stake?':'कितनी रकम विवादित है?'}</h2><label>{lang==='en'?'Amount owed (₹)':'बकाया रकम (₹)'}</label><input type="number" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="e.g. 25000"/><label>{lang==='en'?'When did the problem begin?':'समस्या कब शुरू हुई?'}</label><input type="date" value={date} onChange={e=>setDate(e.target.value)}/><button className="primary" disabled={!amount||!date} onClick={()=>setStep(2)}>Continue <ArrowRight size={17}/></button></>}
              {step===2 && <><h2>{lang==='en'?'What evidence do you have?':'आपके पास कौन सा सबूत है?'}</h2><div className="checklist">{selected?.evidence.map((item,i)=><label key={item}><input type="checkbox" defaultChecked={i<2}/><span><Check size={14}/></span>{item}</label>)}</div><button className="primary" onClick={()=>setStep(3)}>Prepare my next steps <ArrowRight size={17}/></button></>}
              {step===3 && <><div className="complete"><div><Check size={20}/></div><h2>{lang==='en'?'Your case summary is ready':'आपका केस सारांश तैयार है'}</h2></div><div className="summary-grid"><div><small>{lang==='en'?'Issue':'मुद्दा'}</small><b>{selected?.title}</b></div><div><small>{lang==='en'?'Amount':'रकम'}</small><b>₹{amount||'—'}</b></div></div><div className="next-box"><b>{lang==='en'?'Recommended next steps':'सुझाए गए अगले कदम'}</b><ol>{selected?.steps.map(s=><li key={s}>{s}</li>)}</ol></div><button className="primary" onClick={()=>setDrafted(true)}><FileText size={17}/> Draft legal notice</button></>}
            </div>
            {drafted && <div className="draft"><div className="draft-head"><b>Notice draft</b><span>For review</span></div><p>{notice}</p><div className="draft-actions"><button onClick={()=>navigator.clipboard?.writeText(notice)}>Copy text</button><button onClick={()=>window.print()}>Print / save PDF</button></div></div>}
          </>}
        </section>

        {problem && <aside className="right-panel"><h3>{lang==='en'?'Case guide':'केस मार्गदर्शिका'}</h3><div className="guide-status"><span/><b>{lang==='en'?'In progress':'प्रगति में'}</b></div><div className="guide-section"><small>{lang==='en'?'Possible forum':'संभावित मंच'}</small><p>{selected?.forum}</p></div><div className="guide-section"><small>{lang==='en'?'Deadline to act':'कार्रवाई की समय सीमा'}</small><p>{lang==='en'?'Send written demand first; 7–15 days is a reasonable starting deadline.':'पहले लिखित मांग भेजें; 7–15 दिन उचित प्रारंभिक समय सीमा हैं।'}</p></div><div className="warning"><ShieldCheck size={17}/><span><b>{lang==='en'?'Not legal advice':'कानूनी सलाह नहीं'}</b><small>{lang==='en'?'Consult a licensed lawyer for filing or deadlines.':'दाखिल या समय-सीमा के लिए वकील से सलाह लें।'}</small></span></div></aside>}
      </div>

      <div className="composer"><button title="Attach evidence"><Paperclip size={18}/></button><input placeholder={lang==='en'?'Describe what happened…':'अपनी समस्या लिखें…'} /><button className="mic" title="Voice input"><Mic size={18}/></button><button className="send"><ArrowRight size={18}/></button></div>
    </main>
  </div>
}
