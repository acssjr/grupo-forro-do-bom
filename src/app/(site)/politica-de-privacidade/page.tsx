import type { Metadata } from "next";
import { LegalPage } from "@/modules/site/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Política de privacidade | Grupo Forró do Bom",
  description: "Saiba como o Grupo Forró do Bom trata dados de navegação e contatos iniciados pelo site.",
  alternates: { canonical: "/politica-de-privacidade" },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      kicker="PRIVACIDADE"
      title="Política de privacidade"
      summary="Esta política explica quais informações podem ser tratadas durante a navegação e o que acontece quando você inicia uma conversa com o GFB."
    >
      <section>
        <h2>1. Quem é responsável pelo site</h2>
        <p>
          O Grupo Forró do Bom, também identificado como GFB, é uma escola de forró com aulas
          realizadas na Escola Criativa, em Feira de Santana, Bahia. Dúvidas sobre privacidade
          podem ser enviadas pelos canais oficiais indicados na landing page.
        </p>
      </section>

      <section>
        <h2>2. Informações tratadas</h2>
        <p>Dependendo da configuração ativa do site, podemos registrar:</p>
        <ul>
          <li>dados técnicos de navegação, como tipo de dispositivo, navegador e páginas acessadas;</li>
          <li>origem da visita e parâmetros de campanha, como UTMs;</li>
          <li>interações com botões, planos, horários, FAQ, mapa e informações de nivelamento;</li>
          <li>dados fornecidos voluntariamente durante uma conversa iniciada no WhatsApp.</li>
        </ul>
        <p>
          O acompanhamento analítico do site não deve receber nome, telefone, conteúdo das
          mensagens ou outros dados pessoais enviados no atendimento.
        </p>
      </section>

      <section>
        <h2>3. Para que usamos essas informações</h2>
        <p>
          Os dados ajudam a entender a procura por turmas e horários, melhorar a experiência da
          página, medir a efetividade das campanhas e responder pedidos de matrícula, lista
          prioritária ou nivelamento. Quando necessário, o tratamento considera as bases legais
          aplicáveis previstas na Lei Geral de Proteção de Dados.
        </p>
      </section>

      <section>
        <h2>4. WhatsApp e serviços externos</h2>
        <p>
          Ao clicar em um botão de WhatsApp, você deixa este site e passa a utilizar um serviço de
          terceiros. A conversa, os dados do perfil e os arquivos enviados seguem também as regras
          de privacidade do WhatsApp e da Meta. Links para Instagram e Google Maps funcionam da
          mesma forma e estão sujeitos às políticas de cada plataforma.
        </p>
      </section>

      <section>
        <h2>5. Analytics, cookies e tecnologias semelhantes</h2>
        <p>
          Quando o Google Analytics 4 estiver configurado, ele poderá utilizar identificadores e
          tecnologias semelhantes para gerar estatísticas agregadas. Esses dados não são usados
          pelo GFB para enviar ao Analytics o conteúdo das conversas ou identificar diretamente
          uma pessoa.
        </p>
      </section>

      <section>
        <h2>6. Compartilhamento e armazenamento</h2>
        <p>
          Informações podem ser processadas por fornecedores necessários ao funcionamento da
          página, como hospedagem, analytics, mapas e WhatsApp. O GFB não comercializa dados
          pessoais. Os registros são mantidos somente pelo período necessário para atendimento,
          segurança, análise ou cumprimento de obrigações aplicáveis.
        </p>
      </section>

      <section>
        <h2>7. Seus direitos</h2>
        <p>
          Você pode solicitar confirmação do tratamento, acesso, correção, atualização, oposição
          ou exclusão de dados, quando cabível. Para fazer uma solicitação, procure o GFB pelos
          canais oficiais e informe que o assunto é privacidade. Poderemos pedir informações
          mínimas para confirmar a identidade do solicitante.
        </p>
      </section>

      <section>
        <h2>8. Segurança e atualizações</h2>
        <p>
          Adotamos medidas proporcionais para reduzir acessos indevidos e uso inadequado das
          informações. Nenhum sistema, porém, é completamente imune a incidentes. Esta política
          poderá ser atualizada quando o site, as ferramentas ou os processos de atendimento forem
          alterados; a data mais recente permanecerá indicada nesta página.
        </p>
      </section>
    </LegalPage>
  );
}
