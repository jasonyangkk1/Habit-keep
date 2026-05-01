'use client'
import { useState, useEffect, useRef } from 'react'
import s from './page.module.css'

// ── 常數 ─────────────────────────────────────────────────────────────────────
const MOOD_LIST   = [{score:1,label:'很不開心'},{score:2,label:'不開心'},{score:3,label:'無感'},{score:4,label:'開心'},{score:5,label:'超開心'}]
const WEEK_DAYS   = ['一','二','三','四','五','六','日']
const MONTH_NAMES = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
const WEEK_OPTS   = [1,2,3,4,5,6,7]
const DEFAULT_HABITS = [
  {id:1,name:'喝水 2000ml',weeklyGoal:7},
  {id:2,name:'閱讀 30 分鐘',weeklyGoal:5},
  {id:3,name:'冥想',weeklyGoal:3},
  {id:4,name:'早睡 11 點前',weeklyGoal:7},
]
const DEFAULT_BAD_HABITS = []
const EMPTY_DAY = () => ({
  tasks:[{text:'',done:false},{text:'',done:false},{text:'',done:false}],
  mood:0, moodNote:'', diary:'',
  gratitude:['','',''],
  meals:{breakfast:'',lunch:'',dinner:'',snack:''},
  weight:'', bodyFat:'', bowel:'',
  saved:false,
})

// ── 心情臉孔 ──────────────────────────────────────────────────────────────────
function MoodFace({score,active}) {
  const c = active ? '#fff' : 'var(--text3)'
  const sw = 1.5
  const mouths = {
    1: <path d="M9 15.5 Q12 13 15 15.5" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round"/>,
    2: <path d="M9 15 Q12 13.5 15 15"   fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round"/>,
    3: <line x1="9" y1="15" x2="15" y2="15" stroke={c} strokeWidth={sw} strokeLinecap="round"/>,
    4: <path d="M9 14 Q12 16.5 15 14"   fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round"/>,
    5: <path d="M8.5 13.5 Q12 17.5 15.5 13.5" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round"/>,
  }
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="9"  cy="10" r="1.2" fill={c}/>
      <circle cx="15" cy="10" r="1.2" fill={c}/>
      {mouths[score]}
    </svg>
  )
}

// ── 工具 ─────────────────────────────────────────────────────────────────────
// 用本地時間避免時區偏移（台灣 +8 用 toISOString 會差一天）
function todayISO() {
  const d=new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}
function toISODate(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}
function getDaysInMonth(y,m) { return new Date(y,m+1,0).getDate() }
function getFirstDOW(y,m) { const d=new Date(y,m,1).getDay(); return d===0?7:d }
function getWeekDates(offset=0) {
  const now=new Date(),dow=now.getDay()===0?7:now.getDay()
  const mon=new Date(now); mon.setDate(now.getDate()-dow+1+offset*7)
  return Array.from({length:7},(_,i)=>{ const d=new Date(mon); d.setDate(mon.getDate()+i); return d })
}
function formatTW(iso) {
  const d=new Date(iso+'T00:00:00'), wd=['日','一','二','三','四','五','六']
  return { date:`${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')}`, weekday:`週${wd[d.getDay()]}` }
}
function shiftDate(iso,n) {
  const [y,m,dd]=iso.split('-').map(Number)
  const d=new Date(y,m-1,dd+n)
  return toISODate(d)
}
function lsGet(k,fb=null) { try { const v=localStorage.getItem(k); return v!=null?JSON.parse(v):fb } catch { return fb } }
function lsSet(k,v) { try { localStorage.setItem(k,JSON.stringify(v)) } catch {} }
function calcMonthProgress(habitId,allChecks,weeklyGoal) {
  const now=new Date(), y=now.getFullYear(), m=now.getMonth()
  const days=getDaysInMonth(y,m), monthlyGoal=Math.round(weeklyGoal*days/7)
  let achieved=0
  for(let d=1;d<=days;d++) {
    const iso=`${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
    if((allChecks[iso]||{})[habitId]) achieved++
  }
  return {achieved,monthlyGoal}
}

// ── Icons ─────────────────────────────────────────────────────────────────────
const ICONS = {
  today:    <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  habits:   <svg viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
  history:  <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  stats:    <svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  settings: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
}

function LineChart({data,color='var(--text)',yMin,yMax}) {
  if(!data||data.length<2) return <div className={s.chartEmpty}>資料不足，請先填寫紀錄</div>
  const W=320,H=90,pl=28,pr=8,pt=8,pb=18,iW=W-pl-pr,iH=H-pt-pb
  const vals=data.map(d=>d.v),lo=yMin??Math.min(...vals),hi=yMax??Math.max(...vals),rng=hi-lo||1
  const px=i=>pl+(i/(data.length-1))*iW, py=v=>pt+iH-((v-lo)/rng)*iH
  const pts=data.map((d,i)=>`${px(i)},${py(d.v)}`).join(' ')
  const area=`M${px(0)},${py(data[0].v)}`+data.slice(1).map((d,i)=>` L${px(i+1)},${py(d.v)}`).join('')+` L${px(data.length-1)},${H-pb} L${px(0)},${H-pb}Z`
  return (
    <svg className={s.chartSvg} viewBox={`0 0 ${W} ${H}`}>
      {[lo,(lo+hi)/2,hi].map((v,i)=><text key={i} x={pl-4} y={py(v)+4} fontSize="9" fill="var(--text4)" textAnchor="end">{Number.isInteger(v)?v:v.toFixed(1)}</text>)}
      <line x1={pl} y1={H-pb} x2={W-pr} y2={H-pb} stroke="var(--sep)" strokeWidth="0.5"/>
      <path d={area} fill={color} fillOpacity="0.07"/>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round"/>
      {data.map((d,i)=><circle key={i} cx={px(i)} cy={py(d.v)} r="2.5" fill={color}/>)}
      {[0,data.length-1].map(i=><text key={i} x={px(i)} y={H-pb+12} fontSize="9" fill="var(--text4)" textAnchor="middle">{data[i].label}</text>)}
    </svg>
  )
}

function MiniCal({onSelect}) {
  const [y,setY]=useState(new Date().getFullYear())
  const [m,setM]=useState(new Date().getMonth())
  const days=getDaysInMonth(y,m),first=getFirstDOW(y,m),today=todayISO()
  return (
    <div>
      <div className={s.miniCalNav}>
        <button className={s.calNavBtn} onClick={()=>m===0?(setY(yy=>yy-1),setM(11)):setM(mm=>mm-1)}>‹</button>
        <span className={s.miniCalMonth}>{y} 年 {MONTH_NAMES[m]}</span>
        <button className={s.calNavBtn} onClick={()=>m===11?(setY(yy=>yy+1),setM(0)):setM(mm=>mm+1)}>›</button>
      </div>
      <div className={s.miniCalGrid}>
        {WEEK_DAYS.map(d=><div key={d} className={s.miniCalDayLabel}>{d}</div>)}
        {Array.from({length:first-1},(_,i)=><div key={`e${i}`} className={`${s.miniCalDay} ${s.miniCalDayEmpty}`}/>)}
        {Array.from({length:days},(_,i)=>{
          const day=i+1, iso=`${y}-${String(m+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
          const isToday=iso===today, isPast=iso<today
          return <div key={day} className={`${s.miniCalDay} ${isToday?s.miniCalDayToday:''} ${isPast?s.miniCalDayPast:''}`} onClick={()=>!isPast&&onSelect(iso)}>{day}</div>
        })}
      </div>
    </div>
  )
}

// ── 主 App ───────────────────────────────────────────────────────────────────
export default function App() {
  const [tab,setTab]=useState(0)
  const [toast,setToast]=useState('')

  const [activeDate,setActiveDate]=useState(todayISO())
  const [showDatePicker,setShowDatePicker]=useState(false)
  const [dpYear,setDpYear]=useState(new Date().getFullYear())
  const [dpMonth,setDpMonth]=useState(new Date().getMonth())

  const [dailyData,setDailyData]=useState({})
  const dailyRef=useRef({})

  const [allHabitChecks,setAllHabitChecks]=useState({})
  const checksRef=useRef({})

  const [habitList,setHabitList]=useState(DEFAULT_HABITS)
  const habitRef=useRef(DEFAULT_HABITS)

  // ── 不良習慣 ─────────────────────────────────────────────────────────────────
  const [badHabitList,setBadHabitList]=useState(DEFAULT_BAD_HABITS)
  const badHabitRef=useRef(DEFAULT_BAD_HABITS)
  const [allBadChecks,setAllBadChecks]=useState({})
  const badChecksRef=useRef({})

  const [habitTab,setHabitTab]=useState(0) // 0=好習慣 1=不良習慣

  const [weekOffset,setWeekOffset]=useState(0)
  const [showMgmt,setShowMgmt]=useState(false)
  const [newHabitName,setNewHabitName]=useState('')
  const [newHabitGoal,setNewHabitGoal]=useState(7)
  const [dragIdx,setDragIdx]=useState(null)
  const [dragOverIdx,setDragOverIdx]=useState(null)

  const [postponeIdx,setPostponeIdx]=useState(null)

  const [calYear,setCalYear]=useState(new Date().getFullYear())
  const [calMonth,setCalMonth]=useState(new Date().getMonth())
  const [history,setHistory]=useState([])

  const saveTimer=useRef(null)
  const todayFull=todayISO()

  // ── 初始化 ──────────────────────────────────────────────────────────────────
  useEffect(()=>{
    const hl=lsGet('habit_list',null); if(hl){ setHabitList(hl); habitRef.current=hl }
    const bhl=lsGet('bad_habit_list',null); if(bhl){ setBadHabitList(bhl); badHabitRef.current=bhl }
    const dd=lsGet('daily_data',null); if(dd){ setDailyData(dd); dailyRef.current=dd }
    const ahc=lsGet('all_habit_checks',null); if(ahc){ setAllHabitChecks(ahc); checksRef.current=ahc }
    const abc=lsGet('all_bad_checks',null); if(abc){ setAllBadChecks(abc); badChecksRef.current=abc }
  },[])

  // 歷史紀錄從 localStorage 讀取
  useEffect(()=>{
    if(tab!==2) return
    const dd=lsGet('daily_data',{})
    const records=Object.entries(dd)
      .filter(([,v])=>v.saved||v.diary||v.mood>0||v.tasks.some(t=>t.text)||v.weight||v.bodyFat)
      .map(([date,v])=>({
        id:date, date,
        moodScore:v.mood||null,
        moodNote:v.moodNote||'',
        gratitude:v.gratitude?.filter(Boolean).map((g,i)=>`${i+1}. ${g}`).join('\n')||'',
        todos:v.tasks?.filter(t=>t.text).map((t,i)=>`${i+1}. ${t.text}${t.done?' ✓':''}`).join('\n')||'',
        diary:v.diary||'',
        weight:parseFloat(v.weight)||null,
        bodyFat:parseFloat(v.bodyFat)||null,
        bowel:parseInt(v.bowel)||null,
        meals:v.meals?Object.entries(v.meals).filter(([,val])=>val).map(([k,val])=>`${{breakfast:'早餐',lunch:'午餐',dinner:'晚餐',snack:'點心'}[k]}: ${val}`).join('\n'):'',
      }))
    setHistory(records)
  },[tab])

  // ── 資料讀寫 ─────────────────────────────────────────────────────────────────
  function getDay(iso) { return dailyRef.current[iso] || EMPTY_DAY() }

  function writeDay(iso,patch) {
    const next={...getDay(iso),...patch}
    const updated={...dailyRef.current,[iso]:next}
    dailyRef.current=updated
    setDailyData({...updated})
    lsSet('daily_data',updated)
    return next
  }

  function scheduleSave(iso) {
    clearTimeout(saveTimer.current)
    saveTimer.current=setTimeout(()=>doSave(iso),2000)
  }

  async function doSave(iso) {
    writeDay(iso,{saved:true})
  }

  function showToast(msg){ setToast(''); setTimeout(()=>{ setToast(msg); setTimeout(()=>setToast(''),2400) },10) }

  // ── 事項 ─────────────────────────────────────────────────────────────────────
  function updateTask(iso,idx,patch) {
    const cur=getDay(iso)
    const tasks=cur.tasks.map((t,i)=>i===idx?{...t,...patch}:t)
    writeDay(iso,{tasks}); scheduleSave(iso)
  }

  function handlePostpone(taskIdx,targetDate) {
    const cur=getDay(activeDate)
    const text=cur.tasks[taskIdx].text.trim()
    if(!text){ setPostponeIdx(null); return }
    const srcTasks=cur.tasks.map((t,i)=>i===taskIdx?{text:'',done:false}:t)
    writeDay(activeDate,{tasks:srcTasks}); scheduleSave(activeDate)
    const tgt=getDay(targetDate), emptyIdx=tgt.tasks.findIndex(t=>!t.text.trim())
    if(emptyIdx!==-1){ const dstTasks=tgt.tasks.map((t,i)=>i===emptyIdx?{text,done:false}:t); writeDay(targetDate,{tasks:dstTasks}); scheduleSave(targetDate) }
    setPostponeIdx(null); showToast(`已移至 ${targetDate.slice(5)}`)
  }

  // ── 好習慣 ───────────────────────────────────────────────────────────────────
  function saveHabitList(list){ habitRef.current=list; setHabitList(list); lsSet('habit_list',list) }
  function toggleHabit(id,iso){
    const cur=checksRef.current[iso]||{}
    const updated={...checksRef.current,[iso]:{...cur,[id]:!cur[id]}}
    checksRef.current=updated; setAllHabitChecks({...updated}); lsSet('all_habit_checks',updated)
    scheduleSave(iso)
  }
  function addHabit(){ if(!newHabitName.trim()) return; saveHabitList([...habitRef.current,{id:Date.now(),name:newHabitName.trim(),weeklyGoal:newHabitGoal}]); setNewHabitName(''); setNewHabitGoal(7) }
  function deleteHabit(id){ saveHabitList(habitRef.current.filter(h=>h.id!==id)) }
  function updateHabitName(id,name){ saveHabitList(habitRef.current.map(h=>h.id===id?{...h,name}:h)) }
  function updateHabitGoal(id,g){ saveHabitList(habitRef.current.map(h=>h.id===id?{...h,weeklyGoal:g}:h)) }
  function onDragStart(i){ setDragIdx(i) }
  function onDragOver(e,i){ e.preventDefault(); setDragOverIdx(i) }
  function onDrop(e,i){ e.preventDefault(); if(dragIdx===null||dragIdx===i){ setDragIdx(null); setDragOverIdx(null); return }; const list=[...habitRef.current]; const [m]=list.splice(dragIdx,1); list.splice(i,0,m); saveHabitList(list); setDragIdx(null); setDragOverIdx(null) }

  // ── 不良習慣 ─────────────────────────────────────────────────────────────────
  function saveBadHabitList(list){ badHabitRef.current=list; setBadHabitList(list); lsSet('bad_habit_list',list) }
  function toggleBadHabit(id,iso){
    const cur=badChecksRef.current[iso]||{}
    const updated={...badChecksRef.current,[iso]:{...cur,[id]:!cur[id]}}
    badChecksRef.current=updated; setAllBadChecks({...updated}); lsSet('all_bad_checks',updated)
  }
  function addBadHabit(){ if(!newHabitName.trim()) return; saveBadHabitList([...badHabitRef.current,{id:Date.now(),name:newHabitName.trim(),weeklyGoal:newHabitGoal}]); setNewHabitName(''); setNewHabitGoal(7) }
  function deleteBadHabit(id){ saveBadHabitList(badHabitRef.current.filter(h=>h.id!==id)) }
  function updateBadHabitName(id,name){ saveBadHabitList(badHabitRef.current.map(h=>h.id===id?{...h,name}:h)) }
  function updateBadHabitGoal(id,g){ saveBadHabitList(badHabitRef.current.map(h=>h.id===id?{...h,weeklyGoal:g}:h)) }

  // ── Date picker ──────────────────────────────────────────────────────────────
  const dpDays=getDaysInMonth(dpYear,dpMonth), dpFirst=getFirstDOW(dpYear,dpMonth)

  // ── 日曆頁 ───────────────────────────────────────────────────────────────────
  const daysInCal=getDaysInMonth(calYear,calMonth), firstDOW=getFirstDOW(calYear,calMonth)
  const sortedHistory=[...history].sort((a,b)=>b.date.localeCompare(a.date))

  // ── 週 ───────────────────────────────────────────────────────────────────────
  const weekDates=getWeekDates(weekOffset)
  const wS=weekDates[0],wE=weekDates[6]
  const weekLabel=`${wS.getMonth()+1}/${wS.getDate()} – ${wE.getMonth()+1}/${wE.getDate()}`

  // ── 統計 ─────────────────────────────────────────────────────────────────────
  const moodData  =history.filter(r=>r.moodScore).slice().reverse().map(r=>({v:r.moodScore,label:r.date.slice(5)}))
  const weightData=history.filter(r=>r.weight).slice().reverse().map(r=>({v:r.weight,label:r.date.slice(5)}))
  const bfData    =history.filter(r=>r.bodyFat).slice().reverse().map(r=>({v:r.bodyFat,label:r.date.slice(5)}))
  const bowelData =history.filter(r=>r.bowel).slice().reverse().map(r=>({v:r.bowel,label:r.date.slice(5)}))

  // ── ===== 頁面 ===== ──────────────────────────────────────────────────────────
  const aDay=getDay(activeDate)
  const {date:dateLabel,weekday}=formatTW(activeDate)
  const isToday=activeDate===todayFull

  // ═══════════════════════════════════════════════════════════
  // Page 0: 今日
  // ═══════════════════════════════════════════════════════════
  const PageToday=(
    <>
      <div className={s.todayHeader}>

        {/* ── 日期列：< 置中日期 > ── */}
        <div className={s.todayDateRow}>
          {/* Fix 1: 左箭頭用 < > 文字，尺寸夠大好點按 */}
          <button className={s.dateArrow} onClick={()=>{
            const d=shiftDate(activeDate,-1)
            setActiveDate(d)
            setDpYear(new Date(d+'T00:00:00').getFullYear())
            setDpMonth(new Date(d+'T00:00:00').getMonth())
          }}>&lt;</button>

          <button className={s.datePickerBtn} onClick={()=>setShowDatePicker(v=>!v)}>
            <span className={s.datePickerText}>{dateLabel}</span>
            <span className={s.weekdayLabel}>{weekday}</span>
            <span className={`${s.datePickerChevron} ${showDatePicker?s.datePickerChevronOpen:''}`}>▾</span>
          </button>

          
          <button
            className={s.dateArrow}
            onClick={()=>{
              const d=shiftDate(activeDate,1)
              setActiveDate(d)
              setDpYear(new Date(d+'T00:00:00').getFullYear())
              setDpMonth(new Date(d+'T00:00:00').getMonth())
            }}
          >&gt;</button>
        </div>

        {/* 同步狀態 */}
        <div className={s.syncRow}>
          <span className={`${s.syncDot} ${aDay.saved?s.syncDotSaved:''}`}/>
          <span className={`${s.syncText} ${aDay.saved?s.syncTextSaved:''}`}>{aDay.saved?'已儲存':'自動儲存'}</span>
        </div>

        {/* Fix 2: 展開月曆 — 格式比照「紀錄」頁：藍灰圓+反白數字 */}
        {showDatePicker&&(
          <div className={s.dpDropdown}>
            <div className={s.dpNav}>
              <span className={s.dpMonthLabel}>{dpYear} 年 {MONTH_NAMES[dpMonth]}</span>
              <div className={s.dpNavBtns}>
                <button className={s.dpNavBtn} onClick={()=>dpMonth===0?(setDpYear(y=>y-1),setDpMonth(11)):setDpMonth(m=>m-1)}>‹</button>
                <button className={s.dpNavBtn} onClick={()=>dpMonth===11?(setDpYear(y=>y+1),setDpMonth(0)):setDpMonth(m=>m+1)}>›</button>
              </div>
            </div>
            <div className={s.dpGrid}>
              {WEEK_DAYS.map(d=><div key={d} className={s.dpDayLabel}>{d}</div>)}
              {Array.from({length:dpFirst-1},(_,i)=><div key={`e${i}`} className={`${s.dpDay} ${s.dpDayEmpty}`}/>)}
              {Array.from({length:dpDays},(_,i)=>{
                const day=i+1
                const iso=`${dpYear}-${String(dpMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
                const dd=getDay(iso)
                // 有任何資料視為「有紀錄」→ 藍灰圓底
                const hasDraft=dd.saved||dd.tasks.some(t=>t.text)||dd.diary||dd.mood>0
                const isSelected=iso===activeDate
                const isT=iso===todayFull
                return (
                  <div
                    key={day}
                    className={[
                      s.dpDay,
                      isSelected ? s.dpDaySelected : (hasDraft ? s.dpDayHasData : (isT ? s.dpDayToday : '')),
                    ].join(' ')}
                    onClick={()=>{setActiveDate(iso);setShowDatePicker(false)}}
                  >{day}</div>
                )
              })}
            </div>
            {activeDate!==todayFull&&(
              <div style={{padding:'4px 0 8px',textAlign:'center'}}>
                <button className={s.dpNavBtn} style={{padding:'4px 14px',borderRadius:10,fontSize:12}} onClick={()=>{setActiveDate(todayFull);setShowDatePicker(false)}}>回到今天</button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className={s.scroll}>
        <div className={s.sectionLabel}>今日事今日畢</div>
        <div className={s.card}>
          {aDay.tasks.map((t,i)=>(
            <div key={i} className={s.taskRow}>
              <span className={s.taskNum}>{i+1}</span>
              <div className={`${s.taskCheck} ${t.done?s.taskCheckDone:''}`} onClick={()=>updateTask(activeDate,i,{done:!t.done})}/>
              <input className={`${s.taskInput} ${t.done?s.taskInputDone:''}`} type="text" placeholder={`事項 ${i+1}`} value={t.text} onChange={e=>updateTask(activeDate,i,{text:e.target.value})}/>
              {t.text.trim()&&!t.done&&<button className={s.postponeBtn} onClick={()=>setPostponeIdx(i)}>改天做</button>}
            </div>
          ))}
        </div>

        <div className={s.sectionLabel}>習慣打卡</div>
        {habitList.length===0
          ?<div className={s.card}><div style={{padding:'14px',fontSize:14,color:'var(--text4)',textAlign:'center'}}>前往習慣頁面新增</div></div>
          :<div className={s.habitGrid}>
            {habitList.map(h=>{
              const done=!!(allHabitChecks[activeDate]||{})[h.id]
              return (
                <div key={h.id} className={s.habitCell} onClick={()=>toggleHabit(h.id,activeDate)}>
                  <div className={`${s.habitCheck} ${done?s.habitCheckDone:''}`}/>
                  <span className={`${s.habitCellName} ${done?s.habitCellNameDone:''}`}>{h.name}</span>
                </div>
              )
            })}
          </div>
        }

        <div className={s.sectionLabel}>飲食記錄</div>
        <div className={s.card}>
          {[{key:'breakfast',label:'早餐'},{key:'lunch',label:'午餐'},{key:'dinner',label:'晚餐'},{key:'snack',label:'點心'}].map(r=>(
            <div key={r.key} className={s.mealRow}>
              <span className={s.mealLabel}>{r.label}</span>
              <input
                className={s.mealInput}
                type="text"
                placeholder={`${r.label}內容…`}
                value={(aDay.meals||{})[r.key]||''}
                onChange={e=>{const m={...(aDay.meals||{}),[r.key]:e.target.value};writeDay(activeDate,{meals:m});scheduleSave(activeDate)}}
              />
            </div>
          ))}
        </div>

        <div className={s.sectionLabel}>身體紀錄</div>
        <div className={s.card}>
          <div className={s.bodyOneRow}>
            {[
              {label:'體重',unit:'kg',val:aDay.weight,key:'weight',mode:'decimal'},
              {label:'體脂',unit:'%',val:aDay.bodyFat,key:'bodyFat',mode:'decimal'},
              {label:'排便',unit:'次',val:aDay.bowel,key:'bowel',mode:'numeric'},
            ].map((r,i)=>(
              <div key={i} className={s.bodyField}>
                <span className={s.bodyLabel}>{r.label}</span>
                <input className={s.bodyInput} type="number" inputMode={r.mode} step={r.mode==='decimal'?'0.1':'1'} placeholder="--" value={r.val} onChange={e=>{writeDay(activeDate,{[r.key]:e.target.value});scheduleSave(activeDate)}}/>
                <span className={s.bodyUnit}>{r.unit}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={s.sectionLabel}>心情</div>
        <div className={s.card}>
          <div className={s.moodWrap}>
            <div className={s.moodRow}>
              {MOOD_LIST.map(m=>{ const active=aDay.mood===m.score; return (
                <button key={m.score} className={s.moodBtn} onClick={()=>{writeDay(activeDate,{mood:m.score});scheduleSave(activeDate)}}>
                  <div className={`${s.moodFace} ${active?s.moodFaceActive:''}`}><MoodFace score={m.score} active={active}/></div>
                  <span className={`${s.moodLabel} ${active?s.moodLabelActive:''}`}>{m.label}</span>
                </button>
              )})}
            </div>
            <textarea className={s.moodTextarea} rows={2} placeholder="今天的心情……" value={aDay.moodNote} onChange={e=>{writeDay(activeDate,{moodNote:e.target.value});scheduleSave(activeDate)}}/>
          </div>
        </div>

        <div className={s.sectionLabel}>日記</div>
        <div className={s.card}>
          <div className={s.diaryWrap}>
            <textarea className={s.diaryTextarea} rows={6} placeholder="今天的日記……" value={aDay.diary} onChange={e=>{writeDay(activeDate,{diary:e.target.value});scheduleSave(activeDate)}}/>
            <hr className={s.gratitudeDivider}/>
            <div className={s.gratitudeLabel}>感恩事項</div>
            <div className={s.gratitudeItems}>
              {[0,1,2].map(i=>(
                <div key={i} className={s.gratitudeRow}>
                  <span className={s.gratitudeNum}>{i+1}</span>
                  <input className={s.gratitudeInput} type="text" placeholder={`感謝事項 ${i+1}`} value={aDay.gratitude[i]||''} onChange={e=>{ const g=[...aDay.gratitude]; g[i]=e.target.value; writeDay(activeDate,{gratitude:g}); scheduleSave(activeDate) }}/>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {postponeIdx!==null&&(
        <div className={s.overlay} onClick={e=>{if(e.target===e.currentTarget)setPostponeIdx(null)}}>
          <div className={s.sheet}>
            <div className={s.sheetHandle}/>
            <div className={s.sheetHeader}>
              <span className={s.sheetTitle}>選擇改天的日期</span>
              <button className={s.sheetDone} onClick={()=>setPostponeIdx(null)}>取消</button>
            </div>
            <div className={s.miniCalWrap}><MiniCal onSelect={iso=>handlePostpone(postponeIdx,iso)}/></div>
          </div>
        </div>
      )}
    </>
  )

  // ═══════════════════════════════════════════════════════════
  // Page 1: 習慣（好習慣 / 不良習慣切換）
  // ═══════════════════════════════════════════════════════════
  const curList     = habitTab===0 ? habitList     : badHabitList
  const curChecksRef= habitTab===0 ? checksRef     : badChecksRef
  const curChecks   = habitTab===0 ? allHabitChecks: allBadChecks

  const PageHabits=(
    <>
      <div className={s.pageHeader}>
        <span className={s.pageHeaderTitle}>習慣</span>
        <button className={s.headerAction} onClick={()=>{ setNewHabitName(''); setNewHabitGoal(habitTab===0?7:3); setShowMgmt(true) }}>管理</button>
      </div>

      {/* Segmented Control */}
      <div className={s.segWrap}>
        <div className={s.segCtrl}>
          <button className={`${s.segBtn} ${habitTab===0?s.segBtnActive:''}`} onClick={()=>setHabitTab(0)}>好習慣</button>
          <button className={`${s.segBtn} ${habitTab===1?s.segBtnActiveBad:''}`} onClick={()=>setHabitTab(1)}>不良習慣</button>
        </div>
      </div>

      <div className={s.scroll}>
        <div className={s.weekNav}>
          <span className={s.weekLabel}>{weekLabel}</span>
          <div className={s.weekNavBtns}>
            <button className={s.calNavBtn} onClick={()=>setWeekOffset(w=>w-1)}>‹</button>
            {weekOffset!==0&&<button className={s.calNavBtn} style={{fontSize:10,width:34,borderRadius:8}} onClick={()=>setWeekOffset(0)}>本週</button>}
            <button className={s.calNavBtn} onClick={()=>setWeekOffset(w=>w+1)}>›</button>
          </div>
        </div>
        <div className={s.weekGrid}>
          <div className={s.weekHead}>
            <div/>
            {weekDates.map((d,i)=>{ const iso=toISODate(d),isT=iso===todayFull; return (
              <div key={i} style={{textAlign:'center'}}>
                <div className={`${s.weekHeadLabel} ${isT?s.weekHeadToday:''}`}>{WEEK_DAYS[i]}</div>
                <div className={`${s.weekHeadDate} ${isT?s.weekHeadToday:''}`}>{d.getMonth()+1}/{d.getDate()}</div>
              </div>
            )})}
          </div>
          {curList.map(h=>{
            const {achieved,monthlyGoal}=calcMonthProgress(h.id,curChecksRef.current,h.weeklyGoal||7)
            const metGood=habitTab===0&&achieved>=monthlyGoal
            const exceededBad=habitTab===1&&achieved>monthlyGoal
            return (
              <div key={h.id} className={s.habitWeekRow}>
                <div className={s.habitWeekLeft}>
                  <span className={s.habitWeekName}>{h.name}</span>
                  <span className={`${s.habitProgressTag} ${metGood?s.habitProgressTagMet:''} ${exceededBad?s.habitProgressTagBad:''}`}>{achieved}/{monthlyGoal}</span>
                </div>
                {weekDates.map((d,di)=>{
                  const iso=toISODate(d),isT=iso===todayFull
                  const done=!!(curChecksRef.current[iso]||{})[h.id]
                  const doneCls=habitTab===0?s.weekDotDone:s.weekDotBad
                  return (
                    <div key={di} className={s.weekCell}>
                      <div
                        className={`${s.weekDot} ${done?doneCls:''} ${isT&&!done?s.weekDotToday:''}`}
                        onClick={()=>habitTab===0?toggleHabit(h.id,iso):toggleBadHabit(h.id,iso)}
                      />
                    </div>
                  )
                })}
              </div>
            )
          })}
          {curList.length===0&&<div style={{fontSize:14,color:'var(--text4)',textAlign:'center',padding:'24px 0'}}>點右上角「管理」新增</div>}
        </div>
      </div>

      {/* Fix 3: 管理視窗 — 固定三段式，新增欄鎖底不超出 */}
      {showMgmt&&(
        <div className={s.overlay} onClick={e=>{if(e.target===e.currentTarget)setShowMgmt(false)}}>
          <div className={s.mgmtSheet}>
            {/* 把手 */}
            <div className={s.sheetHandle}/>
            {/* 標題（鎖頂） */}
            <div className={s.sheetHeader} style={{flexShrink:0}}>
              <span className={s.sheetTitle}>{habitTab===0?'好習慣管理':'不良習慣管理'}</span>
              <button className={s.sheetDone} onClick={()=>setShowMgmt(false)}>完成</button>
            </div>
            {/* 清單（獨立滾動） */}
            <div className={s.mgmtList}>
              {curList.length===0&&<div style={{padding:'20px',fontSize:13,color:'var(--text4)',textAlign:'center'}}>尚未新增任何項目</div>}
              {habitTab===0
                ? habitList.map((h,i)=>(
                    <div key={h.id} className={`${s.mgmtRow} ${dragIdx===i?s.dragging:''} ${dragOverIdx===i?s.dragOver:''}`}
                      draggable onDragStart={()=>onDragStart(i)} onDragOver={e=>onDragOver(e,i)} onDrop={e=>onDrop(e,i)} onDragEnd={()=>{setDragIdx(null);setDragOverIdx(null)}}>
                      <span className={s.dragHandle}>⠿</span>
                      <div className={s.mgmtContent}>
                        <input className={s.mgmtNameInput} value={h.name} onChange={e=>updateHabitName(h.id,e.target.value)}/>
                        <div className={s.mgmtGoalRow}>
                          <span className={s.mgmtGoalLabel}>每週目標</span>
                          <select className={s.mgmtGoalSelect} value={h.weeklyGoal||7} onChange={e=>updateHabitGoal(h.id,parseInt(e.target.value))}>
                            {WEEK_OPTS.map(n=><option key={n} value={n}>{n} 次</option>)}
                          </select>
                        </div>
                      </div>
                      <button className={s.delBtn} onClick={()=>deleteHabit(h.id)}>
                        <svg className={s.delIcon} viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                    </div>
                  ))
                : badHabitList.map((h)=>(
                    <div key={h.id} className={s.mgmtRow}>
                      <div className={s.mgmtContent}>
                        <input className={s.mgmtNameInput} value={h.name} onChange={e=>updateBadHabitName(h.id,e.target.value)}/>
                        <div className={s.mgmtGoalRow}>
                          <span className={s.mgmtGoalLabel}>每週上限</span>
                          <select className={s.mgmtGoalSelect} value={h.weeklyGoal||3} onChange={e=>updateBadHabitGoal(h.id,parseInt(e.target.value))}>
                            {WEEK_OPTS.map(n=><option key={n} value={n}>{n} 次</option>)}
                          </select>
                        </div>
                      </div>
                      <button className={s.delBtn} onClick={()=>deleteBadHabit(h.id)}>
                        <svg className={s.delIcon} viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                    </div>
                  ))
              }
            </div>
            {/* 新增欄（鎖底） */}
            <div className={s.mgmtAddRow}>
              <input
                className={s.addInput}
                type="text"
                placeholder={habitTab===0?'新習慣名稱…':'新不良習慣名稱…'}
                value={newHabitName}
                onChange={e=>setNewHabitName(e.target.value)}
                onKeyDown={e=>{if(e.key==='Enter') habitTab===0?addHabit():addBadHabit()}}
              />
              <select
                className={s.mgmtGoalSelect}
                value={newHabitGoal}
                onChange={e=>setNewHabitGoal(parseInt(e.target.value))}
                style={{flexShrink:0}}
              >
                {WEEK_OPTS.map(n=><option key={n} value={n}>{n}次/週</option>)}
              </select>
              <button className={s.addBtn} onClick={()=>habitTab===0?addHabit():addBadHabit()}>新增</button>
            </div>
          </div>
        </div>
      )}
    </>
  )

  // ═══════════════════════════════════════════════════════════
  // Page 2: 紀錄
  // ═══════════════════════════════════════════════════════════
  const PageHistory=(
    <>
      <div className={s.pageHeader}><span className={s.pageHeaderTitle}>紀錄</span></div>
      <div className={s.calWrap}>
        <div className={s.calNav}>
          <span className={s.calMonthLabel}>{calYear} 年 {MONTH_NAMES[calMonth]}</span>
          <div className={s.calNavBtns}>
            <button className={s.calNavBtn} onClick={()=>calMonth===0?(setCalYear(y=>y-1),setCalMonth(11)):setCalMonth(m=>m-1)}>‹</button>
            <button className={s.calNavBtn} onClick={()=>calMonth===11?(setCalYear(y=>y+1),setCalMonth(0)):setCalMonth(m=>m+1)}>›</button>
          </div>
        </div>
        <div className={s.calGrid}>
          {WEEK_DAYS.map(d=><div key={d} className={s.calDayLabel}>{d}</div>)}
          {Array.from({length:firstDOW-1},(_,i)=><div key={`e${i}`} className={`${s.calDay} ${s.calDayEmpty}`}/>)}
          {Array.from({length:daysInCal},(_,i)=>{
            const day=i+1, iso=`${calYear}-${String(calMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
            const hasData=history.some(r=>r.date===iso)
            const scrollToCard=()=>{ if(!hasData) return; const el=document.getElementById(`record-${iso}`); if(el) el.scrollIntoView({behavior:'smooth',block:'start'}) }
            return <div key={day} className={[s.calDay,iso===todayFull?s.calDayToday:'',hasData?s.calDayHasData:''].join(' ')} onClick={scrollToCard}><span className={s.calDayNum}>{day}</span></div>
          })}
        </div>
      </div>
      <div className={s.dayList}>
        {sortedHistory.length===0&&<div className={s.dayEmpty}>尚無紀錄</div>}
        {sortedHistory.map(r=>{
          const moodItem=MOOD_LIST.find(m=>m.score===r.moodScore)
          return (
            <div key={r.id||r.date} id={`record-${r.date}`} className={s.dayCard}>
              <div className={s.dayCardHeader}>
                <span className={s.dayCardDate}>{r.date}</span>
                {moodItem&&<span className={s.dayCardMood}>{moodItem.label}{r.moodNote?` — ${r.moodNote}`:''}</span>}
              </div>
              <div className={s.dayCardTags}>
                {r.weight&&<span className={s.dayCardTag}>{r.weight} kg</span>}
                {r.bodyFat&&<span className={s.dayCardTag}>體脂 {r.bodyFat}%</span>}
                {r.bowel&&<span className={s.dayCardTag}>排便 {r.bowel} 次</span>}
              </div>
              {(r.todos||r.gratitude||r.diary||r.meals)&&(
                <>
                  <div className={s.dayCardDivider}/>
                  <div className={s.dayCardBody}>
                    {r.meals&&(
                      <div className={s.dayCardSection}>
                        <div className={s.dayCardLabel}>飲食記錄</div>
                        <div className={s.dayCardText}>{r.meals}</div>
                      </div>
                    )}
                    {r.todos&&(
                      <div className={s.dayCardSection}>
                        <div className={s.dayCardLabel}>今日事今日畢</div>
                        <div className={s.dayCardText}>{r.todos}</div>
                      </div>
                    )}
                    {r.gratitude&&(
                      <div className={s.dayCardSection}>
                        <div className={s.dayCardLabel}>感恩</div>
                        <div className={s.dayCardText}>{r.gratitude}</div>
                      </div>
                    )}
                    {r.diary&&(
                      <div className={s.dayCardSection}>
                        <div className={s.dayCardLabel}>日記</div>
                        <div className={s.dayCardText}>{r.diary}</div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>
    </>
  )

  // ═══════════════════════════════════════════════════════════
  // Page 3: 統計
  // ═══════════════════════════════════════════════════════════
  const PageStats=(
    <>
      <div className={s.pageHeader}><span className={s.pageHeaderTitle}>統計</span></div>
      <div className={s.scroll}>
        <div className={s.sectionLabel}>心情趨勢</div>
        <div className={s.chartCard}><div className={s.chartTitle}>心情分數</div><div className={s.chartSub}>1 很不開心 — 5 超開心</div><LineChart data={moodData} color="var(--green)" yMin={1} yMax={5}/></div>
        <div className={s.sectionLabel}>體重</div>
        <div className={s.chartCard}><div className={s.chartTitle}>體重（kg）</div><LineChart data={weightData} color="var(--text2)"/></div>
        <div className={s.sectionLabel}>體脂率</div>
        <div className={s.chartCard}><div className={s.chartTitle}>體脂率（%）</div><LineChart data={bfData} color="var(--text3)"/></div>
        <div className={s.sectionLabel}>排便次數</div>
        <div className={s.chartCard}><div className={s.chartTitle}>排便次數（次/天）</div><LineChart data={bowelData} color="#5B8DB8"/></div>
      </div>
    </>
  )

  // ═══════════════════════════════════════════════════════════
  // Page 4: 設定
  // ═══════════════════════════════════════════════════════════
  const PageSettings=(
    <>
      <div className={s.pageHeader}><span className={s.pageHeaderTitle}>設定</span></div>
      <div className={s.scroll}>
        <div className={s.sectionLabel}>關於</div>
        <div className={s.settingGroup}>
          <div className={s.settingRow} style={{flexDirection:'column',alignItems:'flex-start',gap:4}}>
            <p style={{fontSize:14,color:'var(--text3)',lineHeight:1.8,margin:0}}>所有資料儲存於你的裝置本機。<br/>停止輸入 2 秒後自動儲存。<br/>清除瀏覽器資料前請注意備份。</p>
          </div>
          <div className={s.settingRow}><span className={s.settingLabel}>加入主畫面</span><span className={s.settingValue}>Safari › 分享 › 加入</span></div>
        </div>
      </div>
    </>
  )

  const PAGES=[PageToday,PageHabits,PageHistory,PageStats,PageSettings]
  const TABS=[{key:'today',label:'今日'},{key:'habits',label:'習慣'},{key:'history',label:'紀錄'},{key:'stats',label:'統計'},{key:'settings',label:'設定'}]

  return (
    <div className={s.phone}>
      <div style={{paddingBottom:82}}>{PAGES[tab]}</div>
      <nav className={s.tabbar}>
        {TABS.map((t,i)=>(
          <button key={t.key} className={`${s.tab} ${tab===i?s.tabActive:''}`} onClick={()=>setTab(i)}>
            {ICONS[t.key]}
            <span className={s.tabLabel}>{t.label}</span>
          </button>
        ))}
      </nav>
      {toast&&<div key={toast+Date.now()} className={s.toast}>{toast}</div>}
    </div>
  )
}
