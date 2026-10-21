"use client";
import { useState } from "react";
import { Icon } from "./Icon";
import { SchoolSelect } from "./SchoolSelect";
import s from "./Management.module.css";

/** Inline school calendar: avoids the browser date/time picker inside scheduling. */
export function AvailabilityPicker({ value, onChange, now }: { value: string; onChange: (value: string) => void; now: number }) {
  const initial = new Date(now + 86400000);
  const [month, setMonth] = useState(() => new Date(initial.getFullYear(), initial.getMonth(), 1));
  const date = value.slice(0, 10);
  const time = value.slice(11) || "19:30";
  const start = (month.getDay() + 6) % 7;
  const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const today = new Date(now).toLocaleDateString("sv-SE");
  const choose = (day: number) => {
    const next = `${month.getFullYear()}-${String(month.getMonth()+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
    onChange(`${next}T${time}`);
  };
  const changeTime = (next: string) => onChange(`${date || initial.toLocaleDateString("sv-SE")}T${next}`);
  return <fieldset className={s.releaseCalendar}><legend>Data e hora da liberação</legend><header><strong>{month.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}</strong><div><button type="button" className={s.iconButton} aria-label="Mês anterior da liberação" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth()-1, 1))}><Icon name="back" size={17} /></button><button type="button" className={s.iconButton} aria-label="Próximo mês da liberação" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth()+1, 1))}><Icon name="arrow" size={17} /></button></div></header><div className={s.releaseDays}>{["Seg","Ter","Qua","Qui","Sex","Sáb","Dom"].map(day => <span key={day}>{day}</span>)}{Array.from({length:start},(_,i)=><span key={`empty-${i}`} />)}{Array.from({length:count},(_,i)=>{const day=i+1;const iso=`${month.getFullYear()}-${String(month.getMonth()+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;return <button key={iso} type="button" disabled={iso<today} aria-label={`Liberar em ${day} de ${month.toLocaleDateString("pt-BR",{month:"long"})} de ${month.getFullYear()}`} aria-pressed={date===iso} onClick={()=>choose(day)}>{day}</button>})}</div><div className={s.releaseTime}><SchoolSelect label="Hora da liberação" value={time.slice(0,2)} onChange={hour=>changeTime(`${hour}:${time.slice(3)}`)} options={Array.from({length:24},(_,i)=>({value:String(i).padStart(2,"0"),label:`${String(i).padStart(2,"0")} h`}))} /><span>:</span><SchoolSelect label="Minuto da liberação" value={time.slice(3)} onChange={minute=>changeTime(`${time.slice(0,2)}:${minute}`)} options={["00","15","30","45"].map(value=>({value,label:`${value} min`}))} /></div><p className={s.fieldHelp}>{date ? `Liberação em ${new Date(`${date}T12:00`).toLocaleDateString("pt-BR")} às ${time}.` : "Selecione um dia no calendário."}</p></fieldset>;
}
