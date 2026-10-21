"use client";

import type { RefObject } from "react";
import { Select } from "@base-ui/react/select";
import styles from "@/modules/site/components/landing/Landing.module.css";

export type Level = "básico" | "intermediário" | "avançado";
const options = (["básico", "intermediário", "avançado"] as const).map((value) => ({
  value,
  label: value[0].toUpperCase() + value.slice(1),
}));

export function LevelSelect({ level, onChange, dialogRef }: {
  level: Level;
  onChange: (value: Level) => void;
  dialogRef: RefObject<HTMLDialogElement | null>;
}) {
  return (
    <Select.Root
      items={options}
      value={level}
      onValueChange={(value) => {
        if (value) onChange(value);
      }}
    >
      <Select.Label className={styles.levelSelectLabel}>Nível pretendido</Select.Label>
      <Select.Trigger className={styles.levelSelectTrigger}>
        <span className={styles.levelSelectCurrent} aria-hidden="true">
          Sua escolha
        </span>
        <Select.Value className={styles.levelSelectValue} />
        <Select.Icon className={styles.levelSelectIcon}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal container={dialogRef}>
        <Select.Positioner
          className={styles.levelSelectPositioner}
          alignItemWithTrigger={false}
          align="start"
          sideOffset={7}
        >
          <Select.Popup className={styles.levelSelectPopup} data-level-select-popup>
            <p className={styles.levelSelectHeading}>Onde sua dança está hoje?</p>
            <Select.List className={styles.levelSelectList}>
              {options.map((option, index) => (
                <Select.Item
                  key={option.value}
                  value={option.value}
                  className={styles.levelSelectItem}
                >
                  <span className={styles.levelSelectNumber} aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <Select.ItemText className={styles.levelSelectItemText}>
                    {option.label}
                  </Select.ItemText>
                  <Select.ItemIndicator className={styles.levelSelectIndicator}>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="m5 12 4 4L19 6" />
                    </svg>
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}
