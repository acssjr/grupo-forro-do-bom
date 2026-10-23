"use client";
import Link from "next/link";
import Image from "next/image";
import { Popover } from "@base-ui/react/popover";
import { useState, type ReactNode } from "react";
import { useManagement } from "./ManagementProvider";
import { Icon } from "./Icon";
import { Modal } from "./ui";
import { usePopupMotion } from "./usePopupMotion";
import { AnimatedResultList } from "./AnimatedResultList";
import { useWorkspaceSetting } from "./useWorkspaceSetting";
import s from "./Management.module.css";

function HeaderPopover({ trigger, label, children }: { trigger: ReactNode; label: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { popupRef, actions } = usePopupMotion(open);
  return <Popover.Root open={open} actionsRef={actions} onOpenChange={(next, details) => { if (!next) details.preventUnmountOnClose(); setOpen(next); }}><Popover.Trigger className={label === "Meu perfil" ? s.profile : s.bell} aria-label={label}>{trigger}</Popover.Trigger><Popover.Portal><Popover.Positioner className={s.headerPositioner} align="end" sideOffset={12}><Popover.Popup ref={popupRef} className={`${s.headerPopup} ${s.animatedPopup}`}><Popover.Title className={s.popupTitle}>{label}</Popover.Title>{children}</Popover.Popup></Popover.Positioner></Popover.Portal></Popover.Root>;
}
export function HeaderActions() {
  const { state, notify } = useManagement();
  const [read, saveRead] = useWorkspaceSetting<string[]>("notifications-read", []);
  const [profile, saveProfile] = useWorkspaceSetting("profile", { name: "Tailan", role: "Gestor e professor" });
  const [editing, setEditing] = useState(false);
  const [settings] = useWorkspaceSetting("settings", { name: "Grupo Forró do Bom", absence: "2", reminder: true, overdue: true, content: true });
  const notifications = [
    ...[...state.notices].reverse().filter(n => settings.content && n.published).map(n => ({ id: `notice-${n.id}`, title: n.title, text: "Comunicado publicado · Escola", href: "/gestao/comunicados", icon: "message" as const })),
    ...state.students.filter(p => settings.reminder && p.streak >= Number(settings.absence) && !p.followedAt).map(p => ({ id: `absence-${p.id}-${p.streak}`, title: `${p.name} precisa de acompanhamento`, text: `${p.streak} ausências consecutivas · Alunos`, href: `/gestao/alunos/${p.id}`, icon: "users" as const })),
    ...state.payments.filter(p => settings.overdue && !p.paid && p.due < "2026-10-22").map(p => ({ id: `payment-${p.id}`, title: "Mensalidade em aberto", text: `${state.students.find(x => x.id === p.studentId)?.name ?? "Aluno"} · Financeiro`, href: "/gestao/financeiro?filtro=atraso", icon: "wallet" as const })),
  ];
  const unread = notifications.filter(n => !read.includes(n.id));
  const markRead = (ids: string[]) => { try { saveRead([...new Set([...read, ...ids])]); } catch { notify("Não foi possível salvar a leitura das notificações."); } };
  return <><HeaderPopover label="Notificações" trigger={<><Icon name="bell" size={22} />{unread.length > 0 && <span />}</>}><div className={s.popupHeading}><span>{unread.length} não lidas</span><button className={s.textLink} disabled={!unread.length} onClick={() => markRead(notifications.map(n => n.id))}>Marcar como lidas</button></div><AnimatedResultList signature={notifications.map(n => n.id).join(",")} className={s.notificationList} live>{notifications.length ? notifications.map(n => <Popover.Close nativeButton={false} key={n.id} data-result-id={n.id} render={<Link href={n.href} />} className={`${s.notificationItem} ${read.includes(n.id) ? s.notificationRead : ""}`} onClick={() => markRead([n.id])}><Icon name={n.icon} size={19} /><span><strong>{n.title}</strong><small>{n.text}</small></span>{!read.includes(n.id) && <i />}</Popover.Close>) : <p className={s.muted}>Tudo em dia. Novidades importantes aparecerão aqui.</p>}</AnimatedResultList></HeaderPopover><HeaderPopover label="Meu perfil" trigger={<><Image priority className={s.profilePhoto} src="/brand/gestao/avatar-professor-3d.png" width={80} height={80} alt="" /><span><strong>{profile.name}</strong><small>{profile.role}</small></span></>}><div className={s.profileSummary}><Image src="/brand/gestao/avatar-professor-3d.png" width={64} height={64} alt="Foto ilustrativa do perfil" /><div><strong>{profile.name}</strong><p>{profile.role}</p><span className={s.badge}>Administrador</span></div></div><Popover.Close className={s.popupAction} onClick={() => setEditing(true)}><Icon name="users" size={18} />Editar meu perfil<Icon name="chevron" size={16} /></Popover.Close><Popover.Close nativeButton={false} render={<Link href="/gestao/equipe" />} className={s.popupAction}><Icon name="users" size={18} />Equipe e permissões<Icon name="chevron" size={16} /></Popover.Close><Popover.Close nativeButton={false} render={<Link href="/gestao/configuracoes" />} className={s.popupAction}><Icon name="settings" size={18} />Preferências da escola<Icon name="chevron" size={16} /></Popover.Close></HeaderPopover>{editing && <Modal title="Meu perfil" onClose={() => setEditing(false)}><form onSubmit={e => { e.preventDefault(); const form = new FormData(e.currentTarget); try { saveProfile({ ...profile, name: String(form.get("name")).trim() }); setEditing(false); notify("Perfil atualizado."); } catch { notify("Não foi possível salvar o perfil."); } }}><label className={s.field}>Nome de exibição<input name="name" defaultValue={profile.name} required maxLength={80} /></label><p className={s.muted}>Administrador · Acesso à gestão da escola</p><button className={s.primary}>Salvar perfil</button></form></Modal>}</>;
}
