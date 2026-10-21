import type { Metadata } from "next";
import { LegalPage } from "@/modules/site/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Termos de uso | Grupo Forró do Bom",
  description: "Condições de uso da landing page e informações sobre aulas, planos e atendimento do GFB.",
  alternates: { canonical: "/termos-de-uso" },
};

export default function TermsPage() {
  return (
    <LegalPage
      kicker="CONDIÇÕES DE USO"
      title="Termos de uso"
      summary="Estes termos organizam o uso da página e esclarecem como funcionam as informações comerciais apresentadas pelo Grupo Forró do Bom."
    >
      <section>
        <h2>1. Objetivo da página</h2>
        <p>
          Esta landing page apresenta o GFB, seus planos, horários, metodologia, localização e
          processo de nivelamento. Ela também permite iniciar conversas sobre primeira aula,
          matrícula e lista prioritária. A página não funciona como checkout, área do aluno ou
          contrato de matrícula.
        </p>
      </section>

      <section>
        <h2>2. Turmas e entrada de novos alunos</h2>
        <p>
          As turmas são progressivas. Por isso, novos iniciantes entram no início de uma nova turma,
          e não em qualquer encontro já em andamento. Datas, disponibilidade e eventual número de
          vagas são confirmados pela equipe no atendimento.
        </p>
      </section>

      <section>
        <h2>3. Primeira aula e crédito</h2>
        <p>
          A primeira aula de uma nova turma custa R$ 39. Quando o aluno decide continuar, esse valor
          é convertido em crédito na matrícula, de acordo com o plano escolhido e as condições
          confirmadas pela equipe antes do fechamento.
        </p>
      </section>

      <section>
        <h2>4. Planos e benefícios</h2>
        <p>
          Os cards descrevem a configuração atual dos planos. A aula particular do GFB Plus é um
          benefício inicial, sujeito a agendamento, e não uma aula mensal recorrente. Horários,
          acompanhamento e demais benefícios são confirmados no WhatsApp no momento da matrícula.
        </p>
      </section>

      <section>
        <h2>5. Nivelamento</h2>
        <p>
          O nivelamento é um encontro gratuito para orientar alunos que já dançam. Ele não é uma
          competição nem garante ingresso no nível solicitado. O professor considera os critérios
          da metodologia GFB e indica a turma mais adequada ao momento da pessoa.
        </p>
      </section>

      <section>
        <h2>6. Faltas e vídeos de apoio</h2>
        <p>
          Não há reposição automática de aulas. Alunos têm acesso aos vídeos dos passos trabalhados
          para acompanhar o conteúdo e praticar durante a semana, sozinhos ou com um par. Esse
          material é de apoio e não substitui integralmente a experiência orientada em aula.
        </p>
      </section>

      <section>
        <h2>7. Pagamento e contratação</h2>
        <p>
          Não há pagamento on-line nesta página. Formas de pagamento, vencimentos e demais
          condições são apresentados pela equipe durante o atendimento no WhatsApp e devem ser
          compreendidos antes da confirmação da matrícula.
        </p>
      </section>

      <section>
        <h2>8. Conteúdo e propriedade intelectual</h2>
        <p>
          Marca, identidade visual, textos, fotografias, vídeos de apoio e materiais didáticos do
          GFB não podem ser copiados, redistribuídos ou explorados comercialmente sem autorização.
          O uso normal da página e o compartilhamento do link permanecem permitidos.
        </p>
      </section>

      <section>
        <h2>9. Links externos e disponibilidade</h2>
        <p>
          WhatsApp, Instagram e Google Maps são serviços externos e podem ter regras próprias ou
          períodos de indisponibilidade. O GFB poderá atualizar textos, planos e funcionalidades da
          landing para manter as informações corretas, preservando as condições já formalizadas
          com cada aluno.
        </p>
      </section>

      <section>
        <h2>10. Contato</h2>
        <p>
          Dúvidas sobre estes termos, matrícula ou informações exibidas na página podem ser
          encaminhadas pelos canais oficiais do Grupo Forró do Bom disponíveis na landing page.
        </p>
      </section>
    </LegalPage>
  );
}
