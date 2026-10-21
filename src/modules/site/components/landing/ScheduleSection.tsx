import { weeklySchedule } from "@/modules/site/content/siteContent";
import styles from "@/modules/site/components/landing/Landing.module.css";

const levelClassName = {
  Iniciante: styles.scheduleLevelBeginner,
  Básico: styles.scheduleLevelBasic,
  Intermediário: styles.scheduleLevelIntermediate,
  Avançado: styles.scheduleLevelAdvanced,
} as const;

function formatTime(time: string) {
  return time.replace(":", "h");
}

export function ScheduleSection() {
  return (
    <section
      id="horarios"
      className={styles.scheduleSection}
      aria-labelledby="schedule-title"
    >
      <header className={styles.scheduleHeader} data-reveal>
        <div>
          <p className={styles.kicker}>GRADE DE HORÁRIOS</p>
          <h2 id="schedule-title">Forró cabe na sua semana.</h2>
        </div>
        <p>
          Consulte os horários regulares e encontre a turma que acompanha o seu momento na dança.
        </p>
      </header>

      <div className={styles.scheduleCadence} aria-hidden="true" data-reveal>
        {weeklySchedule.map(({ day, shortDay }) => (
          <span key={day}>
            <strong>{shortDay}</strong>
            <small>{day}</small>
          </span>
        ))}
      </div>

      <div className={styles.scheduleTableFrame} data-reveal>
        <table className={styles.scheduleTable}>
          <caption>Horários semanais das turmas</caption>
          <colgroup>
            <col />
            <col />
            <col />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">Dia</th>
              <th scope="col">Horário</th>
              <th scope="col">Turma</th>
            </tr>
          </thead>
          {weeklySchedule.map(({ day, classes }) => (
            <tbody key={day}>
              {classes.map(({ start, end, level }, index) => (
                <tr key={`${day}-${start}`}>
                  {index === 0 ? (
                    <th scope="rowgroup" rowSpan={classes.length}>
                      {day}
                    </th>
                  ) : null}
                  <td>
                    <span className={styles.scheduleTime}>
                      <time dateTime={start}>{formatTime(start)}</time>
                      <span aria-hidden="true">—</span>
                      <time dateTime={end}>{formatTime(end)}</time>
                    </span>
                  </td>
                  <td>
                    <span className={`${styles.scheduleLevel} ${levelClassName[level]}`}>
                      {level}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          ))}
        </table>
        <p className={styles.scheduleLocationNote}>
          <span aria-hidden="true">●</span>
          Todas as aulas acontecem na Escola Criativa, na Cidade Nova.
        </p>
      </div>
    </section>
  );
}
