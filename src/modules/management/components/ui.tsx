"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { seedProfiles, avatarPosition, type AvatarGender, type AvatarAge } from "@/modules/management/domain/profiles";
import { useManagement } from "./ManagementProvider";
import { Icon } from "./Icon";
import s from "./Management.module.css";

export function Avatar({ name, large = false, age, gender, choice }: { name: string; large?: boolean; age?: number; gender?: AvatarGender; choice?: AvatarAge | "auto" }) {
  const { state } = useManagement();
  const student = state.students.find((person) => person.name === name);
  const seed = student ? seedProfiles[student.id] : name === "Tailan Cavalcante" ? { age: 35, avatarGender: "male" as const } : undefined;
  const style = gender ?? student?.avatarGender ?? seed?.avatarGender ?? "neutral";
  const selectedAge = age ?? student?.age ?? seed?.age;
  return <span className={`${s.avatar} ${s.avatarPortrait} ${large ? s.avatarLarge : ""} ${style === "neutral" ? s.avatarNeutral : ""}`} aria-hidden="true" style={style === "neutral" ? undefined : avatarPosition(selectedAge, style, choice ?? student?.avatarChoice)}>{style === "neutral" && <Icon name="users" size={large ? 30 : 18} />}</span>;
}

export function Badge({ children, kind = "neutral" }: { children: ReactNode; kind?: "neutral" | "yellow" | "green" | "red" }) { return <span className={`${s.badge} ${s[`badge_${kind}`]}`}>{children}</span>; }
export function Empty({ title, text, children }: { title: string; text: string; children?: ReactNode }) { return <div className={s.empty}><Icon name="search" size={26} /><h3>{title}</h3><p>{text}</p>{children}</div>; }
export function PageTitle({ title, description, children }: { title: ReactNode; description: string; children?: ReactNode }) { return <header className={s.pageTitle} data-motion-region="heading"><div><h1>{title}</h1><p>{description}</p></div>{children && <div className={s.titleActions}>{children}</div>}</header>; }
export function Modal({ title, onClose, children, wide = false, footer }: { title: string; onClose: () => void; children: ReactNode; wide?: boolean; footer?: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const root = document.documentElement;
    const previous = root.style.overflow;
    const bodyPrevious = document.body.style.overflow;
    root.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    ref.current?.showModal();
    return () => { root.style.overflow = previous; document.body.style.overflow = bodyPrevious; };
  }, []);
  return <dialog ref={ref} className={`${s.dialog} ${wide ? s.dialogWide : ""}`} onCancel={(event) => { event.preventDefault(); onClose(); }} onClick={(event) => { if (event.target === event.currentTarget) { const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose(); } }} aria-labelledby="management-dialog-title"><header><h2 id="management-dialog-title">{title}</h2><button className={s.iconButton} onClick={onClose} aria-label="Fechar janela" title="Fechar"><Icon name="close" /></button></header><div className={s.dialogBody}>{children}</div>{footer && <footer className={s.dialogFooter}>{footer}</footer>}</dialog>;
}
