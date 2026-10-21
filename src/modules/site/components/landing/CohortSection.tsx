"use client";

import { useState } from "react";
import { cohortConfig, siteConfig, type ScheduleKey } from "@/config/site";
import { whatsappMessages } from "@/modules/site/content/siteContent";
import { WhatsAppLink } from "@/shared/ui/WhatsAppLink";
import { trackEvent } from "@/modules/site/lib/analytics";
import styles from "@/modules/site/components/landing/Landing.module.css";

export function CohortSection() {
  const [schedule, setSchedule] = useState<ScheduleKey>("thursday");
  const schedulePresentation = {
    thursday: { day: "Quinta-feira", time: "19h30" },
    saturday: { day: "Sábado", time: "14h" },
  } as const;

  if (cohortConfig.status === "open") {
    const message =
      cohortConfig.schedule === "saturday"
        ? whatsappMessages.saturday
        : whatsappMessages.thursday;

    return (
      <section id="proxima-turma" className={styles.cohortSection} aria-labelledby="cohort-title">
        <div data-reveal>
          <p className={styles.kicker}>PRÓXIMA TURMA</p>
          <h2 id="cohort-title">Uma nova turma vai começar.</h2>
        </div>
        <dl className={styles.cohortDetails} data-reveal>
          <div>
            <dt>Data de início</dt>
            <dd>{cohortConfig.startDate || "Data a confirmar"}</dd>
          </div>
          <div>
            <dt>Horário</dt>
            <dd>{siteConfig.schedules[cohortConfig.schedule]}</dd>
          </div>
          {cohortConfig.availableSpots ? (
            <div>
              <dt>Vagas disponíveis</dt>
              <dd>{cohortConfig.availableSpots}</dd>
            </div>
          ) : null}
          <div>
            <dt>Local</dt>
            <dd>Escola Criativa, Cidade Nova</dd>
          </div>
        </dl>
        <WhatsAppLink
          className={styles.primaryButtonDark}
          message={message}
          tracking={{
            ctaLocation: "cohort_open",
            userIntent: "beginner",
            schedule: cohortConfig.schedule,
          }}
        >
          Quero começar
        </WhatsAppLink>
      </section>
    );
  }

  const selectedMessage =
    schedule === "thursday" ? whatsappMessages.thursday : whatsappMessages.saturday;

  return (
    <section id="proxima-turma" className={styles.cohortSection} aria-labelledby="cohort-title">
      <div className={styles.cohortCopy} data-reveal>
        <p className={styles.kicker}>PRÓXIMA TURMA</p>
        <p className={styles.cohortWelcome}>Estamos ansiosos para ter você conosco.</p>
        <h2 id="cohort-title">O próximo começo pode ser o seu.</h2>
        <p>
          Escolha o horário que melhor se adapta à sua rotina e entre na lista prioritária.
          A gente avisa quando a data de início da próxima turma estiver definida. E não vai
          demorar. ;)
        </p>
      </div>

      <div className={styles.scheduleChooser} data-reveal>
        <fieldset>
          <legend>Qual horário funciona melhor para você?</legend>
          {(Object.keys(siteConfig.schedules) as ScheduleKey[]).map((key) => (
            <label
              key={key}
              className={schedule === key ? styles.scheduleSelected : ""}
              data-schedule-option
            >
              <input
                type="radio"
                name="schedule"
                value={key}
                checked={schedule === key}
                onChange={() => {
                  setSchedule(key);
                  trackEvent("schedule_interest_selected", {
                    schedule: key,
                    user_intent: "waitlist",
                  });
                }}
              />
              <span className={styles.scheduleRadioMark} aria-hidden="true" />
              <span className={styles.scheduleOptionCopy}>
                <strong>{schedulePresentation[key].day}</strong>
                <small>às {schedulePresentation[key].time}</small>
              </span>
              <span className={styles.scheduleChoiceState} aria-hidden="true">
                {schedule === key ? "Escolhido" : "Escolher"}
              </span>
            </label>
          ))}
        </fieldset>
        <WhatsAppLink
          className={styles.primaryButtonDark}
          message={selectedMessage}
          tracking={{
            ctaLocation: "waitlist",
            userIntent: "waitlist",
            schedule,
            intentEvent: "waitlist_clicked",
          }}
        >
          Quero prioridade na próxima turma
        </WhatsAppLink>
      </div>
    </section>
  );
}
