"use client";

import { Select } from "@base-ui/react/select";
import { useRef } from "react";
import { Icon } from "./Icon";
import s from "./Management.module.css";

type Option = { value: string; label: string; disabled?: boolean };
export function SchoolSelect({ label, options, value, defaultValue, onChange, name, required = false }: { label: string; options: Option[]; value?: string; defaultValue?: string; onChange?: (value: string) => void; name?: string; required?: boolean }) {
  const container = useRef<HTMLDivElement>(null);
  const portal = useRef<HTMLElement | null>(null);
  return <div className={s.selectRoot} ref={container}>
    <Select.Root<string> items={options} value={value} defaultValue={defaultValue ?? options[0]?.value} onValueChange={(next) => onChange?.(next ?? "")} onOpenChange={(open) => { if (open) portal.current = container.current?.closest("dialog") ?? container.current?.closest("main") ?? document.body; }} name={name} required={required} modal={false}>
      <Select.Trigger className={s.selectTrigger} aria-label={label}><Select.Value /><Select.Icon className={s.selectChevron}><Icon name="chevron" size={16} /></Select.Icon></Select.Trigger>
      <Select.Portal container={portal}><Select.Positioner className={s.selectPositioner} align="start" sideOffset={7} alignItemWithTrigger={false}><Select.Popup className={s.selectPopup}><Select.List>{options.map((option) => <Select.Item className={s.selectOption} key={option.value} value={option.value} disabled={option.disabled}><Select.ItemText>{option.label}</Select.ItemText><Select.ItemIndicator><Icon name="check" size={16} /></Select.ItemIndicator></Select.Item>)}</Select.List></Select.Popup></Select.Positioner></Select.Portal>
    </Select.Root>
  </div>;
}
