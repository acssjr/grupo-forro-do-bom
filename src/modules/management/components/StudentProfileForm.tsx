"use client";

import { useState } from "react";
import { cohorts } from "@/modules/management/domain/demo";
import { seedProfiles, type AvatarGender, type AvatarAge } from "@/modules/management/domain/profiles";
import type { Student } from "@/modules/management/domain/model";
import { useManagement } from "./ManagementProvider";
import { SchoolSelect } from "./SchoolSelect";
import { Avatar } from "./ui";
import s from "./Management.module.css";

export function StudentProfileForm({ student, onSaved }: { student?: Student; onSaved?: () => void }) {
  const { dispatch, notify } = useManagement();
  const seed = student ? seedProfiles[student.id] : undefined;
  const [name, setName] = useState(student?.name ?? "");
  const [age, setAge] = useState(String(student?.age ?? seed?.age ?? ""));
  const [gender, setGender] = useState<AvatarGender>(student?.avatarGender ?? seed?.avatarGender ?? "neutral");
  const [choice, setChoice] = useState<AvatarAge | "auto">(student?.avatarChoice ?? "auto");
  const [cohortId, setCohortId] = useState(student?.cohortIds[0] ?? cohorts[0].id);
  return <form className={s.studentProfileForm} onSubmit={(event) => {
    event.preventDefault();
    const cohort = cohorts.find((item) => item.id === cohortId);
    if (!cohort || !name.trim() || !age) return;
    const profile = { name: name.trim(), age: Number(age), avatarGender: gender, avatarChoice: choice };
    if (student) dispatch({ type: "student", student: { ...student, ...profile } });
    else dispatch({ type: "add-student", student: { id: crypto.randomUUID(), ...profile, cohortIds: [cohort.id], level: cohort.level, plan: "Primeira aula", active: false, attendance: 0, streak: 0, note: "", followup: "" } });
    notify(student ? "Perfil atualizado." : "Cadastro criado. Ative o acesso na ficha quando desejar.");
    onSaved?.();
  }}>
    <div className={s.profilePreview}><Avatar name={name || "Novo aluno"} age={age ? Number(age) : undefined} gender={gender} choice={choice} large /><div><strong>Perfil do aluno</strong><p>O avatar acompanha a idade informada. Você também pode escolher outra faixa.</p></div></div>
    <label className={s.field}>Nome completo<input name="name" required value={name} onChange={(event) => setName(event.target.value)} maxLength={80} autoComplete="off" /></label>
    <div className={s.profileFields}><label className={s.field}>Idade<input name="age" type="number" min={1} max={120} required value={age} onChange={(event) => setAge(event.target.value)} inputMode="numeric" /></label><label className={s.field}>Estilo do avatar<SchoolSelect label="Estilo do avatar" value={gender} onChange={(value) => setGender(value as AvatarGender)} options={[{ value: "neutral", label: "Neutro" }, { value: "male", label: "Masculino" }, { value: "female", label: "Feminino" }]} /></label></div>
    <label className={s.field}>Foto de perfil<SchoolSelect label="Faixa do avatar" value={choice} onChange={(value) => setChoice(value as AvatarAge | "auto")} options={[{ value: "auto", label: "Automática pela idade" }, { value: "young", label: "Jovem" }, { value: "adult", label: "Adulto" }, { value: "mature", label: "Maduro" }]} /></label>
    {!student && <><label className={s.field}>Turma<SchoolSelect label="Turma do novo aluno" name="cohort" value={cohortId} onChange={setCohortId} required options={cohorts.map((item) => ({ value: item.id, label: `${item.code} · ${item.name}` }))} /></label><p className={s.fieldHelp}>Plano inicial: Primeira aula.</p></>}
    <div className={s.profileFormActions}><button className={s.primary} type="submit">{student ? "Salvar perfil" : "Criar cadastro"}</button></div>
  </form>;
}
