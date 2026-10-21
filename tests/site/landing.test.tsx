import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, statSync } from "node:fs";
import { LandingPage } from "@/modules/site/components/landing/LandingPage";
import { shouldRestoreAtmospherePosition } from "@/modules/site/components/landing/AtmosphereGallery";

describe("LandingPage", () => {
  it("renders the approved message, trust proof and three editable plans", () => {
    render(<LandingPage />);

    expect(
      screen.getByRole("heading", { name: "Aprenda forró começando do zero." }),
    ).toBeInTheDocument();
    expect(screen.getByText("Você não precisa saber dançar e nem levar um par.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "QUERO APRENDER" })).toBeInTheDocument();
    expect(screen.getByText("fazendo gente dançar.")).toBeInTheDocument();
    expect(screen.getByText("pessoas já passaram por aqui.")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Para conhecer o GFB" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Essencial GFB" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "GFB Plus" })).toBeInTheDocument();
  });

  it("uses one continuous location line in the hero", () => {
    const { container } = render(<LandingPage />);
    const eyebrow = container.querySelector("#inicio p");

    expect(eyebrow).toHaveTextContent("ESCOLA DE FORRÓ EM FEIRA DE SANTANA - BA");
    expect(eyebrow?.querySelectorAll("span")).toHaveLength(1);
  });

  it("uses the brand name only where it identifies the institution, method or plans", () => {
    const { container } = render(<LandingPage />);

    expect(screen.getByText(/escola de forró em/i)).toBeInTheDocument();
    expect(screen.getByText(/nossa história em dois números/i)).toBeInTheDocument();
    expect(screen.getByText("NOSSA HISTÓRIA")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Começamos na UEFS. Hoje, fazemos Feira dançar." }),
    ).toBeInTheDocument();
    expect(screen.getByText("POR DENTRO DAS AULAS")).toBeInTheDocument();
    expect(screen.getByText("POR QUE APRENDER AQUI")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Hoje, Tailan, Sthefanie, Luinne e Karine acompanham nossas turmas.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Como foi a primeira aula." }),
    ).toBeInTheDocument();
    expect(screen.getByText(/uma amiga me chamou para conhecer uma aula/i)).toBeInTheDocument();
    expect(container.querySelector("#proxima-turma")).toHaveTextContent(
      "A gente avisa quando a data de início da próxima turma estiver definida.",
    );
    expect(screen.getByRole("table")).toHaveAccessibleName("Horários semanais das turmas");

    expect(screen.getAllByText(/metodologia GFB/i)).not.toHaveLength(0);
    expect(screen.getByRole("heading", { name: "Essencial GFB" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "GFB Plus" })).toBeInTheDocument();
  });

  it("keeps the hero emphasis subtle and the offer on separate lines without extra CTA copy", () => {
    const { container } = render(<LandingPage />);
    const hero = container.querySelector("#inicio");
    const highlights = hero?.querySelectorAll("h1 span");
    const css = readFileSync("src/modules/site/components/landing/Landing.module.css", "utf8");

    expect(highlights).toHaveLength(2);
    expect(highlights?.[0]).toHaveTextContent("forró");
    expect(highlights?.[1]).toHaveTextContent("do zero");
    const zeroHighlight = hero?.querySelector('h1 span[class*="heroZero"]');
    expect(zeroHighlight).toHaveTextContent("do zero.");
    expect(
      screen.getByRole("heading", { name: "Aprenda forró começando do zero." }),
    ).toBeInTheDocument();
    const offer = screen.getByText("Primeira aula por R$ 39.").closest("p");
    expect(offer?.querySelector("br")).toBeInTheDocument();
    expect(offer).toHaveTextContent("Se você decidir continuar, esse valor vira crédito na sua matrícula.");
    expect(screen.getByText("crédito na sua matrícula.").tagName).toBe("STRONG");
    expect(hero).not.toHaveTextContent("Você fala com a equipe pelo WhatsApp. Sem pagamento agora.");
    expect(css).toMatch(/\.heroZero\s*\{[\s\S]*margin-top:\s*0\.16em/);
    expect(css).toMatch(/\.heroZero\s*\{[\s\S]*color:\s*var\(--yellow\)[\s\S]*background:\s*var\(--brown\)/);
    expect(css).toMatch(/\.heroZero:hover\s*\{[\s\S]*color:\s*var\(--brown\)[\s\S]*background:\s*transparent/);
  });

  it("renders complete editorial content without placeholder disclosures", () => {
    const { container } = render(<LandingPage />);

    expect(container.textContent).not.toMatch(/placeholder/i);
    expect(container.textContent).not.toMatch(/imagem ilustrativa|relato real em preparação/i);
    expect(screen.getAllByRole("img").length).toBeGreaterThanOrEqual(8);
  });

  it("exposes the kinetic hooks used by the recognition choreography", () => {
    const { container } = render(<LandingPage />);

    expect(container.querySelector("[data-kinetic-section]")).toBeInTheDocument();
    expect(container.querySelectorAll("[data-kinetic-row]")).toHaveLength(3);
    expect(container.querySelector("[data-kinetic-image]")).toBeInTheDocument();
  });

  it("uses natural beginner language and a visible secondary route for dancers", () => {
    const { container } = render(<LandingPage />);

    expect(screen.getByText("Eu acho que não levo jeito", { selector: "strong" })).toBeInTheDocument();
    expect(screen.getByText("Tenho vergonha de errar", { selector: "strong" })).toBeInTheDocument();
    expect(
      screen.getByText("Eu travo quando começa o forró", { selector: "strong" }),
    ).toBeInTheDocument();
    expect(container.textContent).not.toMatch(/receio de não acompanhar/i);
    expect(container.querySelector("[data-secondary-route]")).toHaveTextContent("Já danço");
    expect(
      screen.getByText("Se você já se pegou pensando alguma dessas coisas, está no lugar certo."),
    ).toBeInTheDocument();
  });

  it("presents one-month outcomes as an accessible carousel", async () => {
    const user = userEvent.setup();
    const { container } = render(<LandingPage />);
    const css = readFileSync("src/modules/site/components/landing/Landing.module.css", "utf8");

    expect(
      screen.getByRole("heading", {
        name: "Em um mês, você já começa a combinar ritmo, bases e movimentos.",
      }),
    ).toBeInTheDocument();
    expect(container.querySelector("[data-learning-carousel]")).toBeInTheDocument();
    expect(screen.getByText(/você reconhece a marcação e entra na dança/i)).toBeInTheDocument();
    expect(container.querySelector("[data-learning-fear]")).not.toBeInTheDocument();
    expect(container.textContent).not.toMatch(/perder a música|receio que começa/i);
    expect(container.textContent).not.toMatch(/não é sobre/i);
    expect(
      screen.getByText(
        "Quando a música começa, você encontra um ponto de partida, liga um movimento ao outro e sabe como voltar se algo sair diferente.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Você aprende a se reorganizar sem parar a dança quando algo não sai como esperava.",
      ),
    ).toBeInTheDocument();
    expect(container.textContent).not.toMatch(/giro simples e chuveirinho/i);
    expect(container.textContent).not.toMatch(/cada slide mostra/i);
    expect(css).toMatch(/\.learningSlide\s*\{[\s\S]*min-height:\s*clamp\(18rem, 30vw, 22rem\)/);
    expect(css).toMatch(/\.learningSlide\s*\{[\s\S]*grid-template-rows:\s*auto auto/);
    expect(css).toMatch(/\.learningSlide\s*\{[\s\S]*align-content:\s*start/);

    await user.click(screen.getByRole("button", { name: "Próximo resultado" }));
    expect(screen.getByRole("button", { name: "Mostrar resultado 2" })).toHaveAttribute(
      "aria-current",
      "true",
    );
  });

  it("turns the atmosphere gallery into an accessible animated carousel", async () => {
    const user = userEvent.setup();
    const { container } = render(<LandingPage />);

    const carousel = container.querySelector("[data-atmosphere-carousel]");
    expect(carousel).toBeInTheDocument();
    expect(carousel?.querySelectorAll("[data-atmosphere-slide]")).toHaveLength(6);
    const loopPreview = carousel?.querySelector("[data-atmosphere-loop-preview]");
    expect(loopPreview).toBeInTheDocument();
    expect(loopPreview).toHaveAttribute("aria-hidden", "true");
    expect(loopPreview).toHaveTextContent("O forró também ocupa a cidade");

    await user.click(screen.getByRole("button", { name: "Próximo registro" }));
    expect(screen.getByRole("button", { name: "Mostrar registro 2" })).toHaveAttribute(
      "aria-current",
      "true",
    );
  });

  it("shows one concise phrase on each atmosphere card", () => {
    const { container } = render(<LandingPage />);
    const carousel = container.querySelector("[data-atmosphere-carousel]");
    const phrases = [
      "O forró também ocupa a cidade",
      "GENTE QUE CELEBRA JUNTO",
      "Gente que continua por perto",
      "A turma começa pelas bases",
      "Uma turma para dançar junto",
      "Orientação de perto na prática",
    ];

    const renderedPhrases = Array.from(
      carousel?.querySelectorAll("[data-atmosphere-slide] figcaption strong") ?? [],
      (caption) => caption.textContent,
    );

    expect(renderedPhrases).toEqual(phrases);
    expect(carousel?.querySelector("[data-atmosphere-support]")).not.toBeInTheDocument();
  });

  it("starts every FAQ item closed and uses a natural opening question", () => {
    render(<LandingPage />);

    expect(screen.getByText("Preciso já ter ritmo para começar?")).toBeInTheDocument();
    screen.getAllByRole("button", { expanded: false }).forEach((button) => {
      expect(button).toHaveAttribute("aria-expanded", "false");
    });
  });

  it("uses named real GFB media without eagerly loading inactive videos", async () => {
    const user = userEvent.setup();
    const { container } = render(<LandingPage />);

    const teamPhoto = screen.getByRole("img", {
      name: /equipe de professores do grupo forró do bom/i,
    });
    expect(teamPhoto.getAttribute("src")).toContain("equipe-professores-gfb.webp");

    const videos = Array.from(
      container.querySelectorAll<HTMLVideoElement>("[data-atmosphere-video]"),
    );
    expect(videos).toHaveLength(3);
    videos.forEach((video) => {
      expect(video).toHaveAttribute("preload", "none");
      expect(video).toHaveAttribute("playsinline");
      expect(video.muted).toBe(true);
      expect(video.querySelector("source")).not.toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Próximo registro" }));
    const activeVideo = container.querySelector<HTMLVideoElement>(
      '[data-atmosphere-slide][data-active="true"] [data-atmosphere-video]',
    );
    expect(activeVideo?.querySelector("source")).toHaveAttribute(
      "src",
      "/media/gfb/comunidade-gfb-encontro-silencioso.mp4",
    );

    const mediaFiles = [
      "public/images/gfb/equipe-professores-gfb.webp",
      "public/images/gfb/comunidade-gfb-confraternizacao.webp",
      "public/media/gfb/comunidade-gfb-encontro-silencioso.mp4",
      "public/media/gfb/comunidade-gfb-encontro-poster.webp",
      "public/media/gfb/turma-iniciante-em-movimento-silencioso.mp4",
      "public/media/gfb/turma-iniciante-em-movimento-poster.webp",
      "public/media/gfb/aula-em-movimento-reel-silencioso.mp4",
      "public/media/gfb/aula-em-movimento-reel-poster.webp",
      "public/images/gfb/historia-gfb-uefs-2017.webp",
      "public/images/gfb/comunidade-gfb-evento-2024.webp",
      "public/images/gfb/turma-gfb-encontro-01.webp",
      "public/images/gfb/turma-gfb-registro-2022.webp",
    ];

    mediaFiles.forEach((path) => expect(existsSync(path)).toBe(true));
    expect(statSync(mediaFiles[2]).size).toBeLessThan(2_000_000);
    expect(statSync(mediaFiles[4]).size).toBeLessThan(5_000_000);
    expect(statSync(mediaFiles[6]).size).toBeLessThan(4_000_000);
  });

  it("presents pricing in a natural entry, essential, and acceleration order", () => {
    const { container } = render(<LandingPage />);

    expect(screen.getByText("O MAIS ESCOLHIDO")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "GFB Plus" })).toBeInTheDocument();
    expect(screen.getByText(/para quem quer acelerar a evolução/i)).toBeInTheDocument();
    expect(container.querySelector("[data-pricing-stage]")).toBeInTheDocument();
    const recommended = container.querySelector("[data-recommended-plan]");
    expect(recommended).toHaveTextContent("Essencial GFB");
    expect(recommended).toHaveTextContent("O MAIS ESCOLHIDO");
    expect(recommended).toHaveTextContent("Acompanhamento da evolução no ritmo da turma");
    expect(recommended).toHaveTextContent("Acesso à plataforma do aluno");
    expect(recommended).toHaveTextContent("O que está incluído?");
    expect(recommended).toHaveTextContent(
      "Vídeos dos passos trabalhados em aula, histórico de observações dos professores e avisos da turma",
    );
    expect(recommended?.querySelector("details")).toBeInTheDocument();
    expect(recommended?.querySelector("summary")).toHaveAttribute(
      "aria-label",
      "Entenda o que está incluído na plataforma do aluno",
    );
    expect(recommended).not.toHaveAttribute("data-mobile-priority");

    const cards = [...container.querySelectorAll("[data-price-card]")];
    expect(cards).toHaveLength(3);
    expect(cards[0]).toHaveAttribute("data-entry-plan", "true");
    expect(cards[0]).toHaveTextContent("Para conhecer o GFB");
    expect(cards[0]).toHaveTextContent("Experimente o método e conheça a turma");
    expect(cards[0]).toHaveTextContent(
      "Se continuar, por mais R$ 40 você garante o primeiro mês no Essencial",
    );
    expect(cards[1]).toHaveTextContent("Essencial GFB");
    expect(cards[2]).toHaveTextContent("GFB Plus");
    expect(cards[2]).toHaveTextContent("R$ 179");
    expect(cards[2]).toHaveTextContent("Um acompanhamento individualizado por mês");
    expect(cards[2]).toHaveTextContent(
      "Professor e horário do acompanhamento são definidos conforme disponibilidade e combinados previamente. Consulte condições.",
    );
    expect(cards[2]).not.toHaveTextContent("R$ 159");
    expect(cards[2]).not.toHaveTextContent(/aula particular inicial/i);
    expect(container.querySelector("[data-mobile-priority]")).not.toBeInTheDocument();
    expect(readFileSync("src/modules/site/components/landing/Landing.module.css", "utf8")).not.toMatch(
      /\[data-mobile-priority="true"\][\s\S]*order:\s*-1/,
    );
    expect(recommended).not.toHaveTextContent("Escolha entre quinta");
    expect(screen.getByText(/a aula inicial abre a porta/i)).toBeInTheDocument();
    expect(
      screen.getByText(/você escolhe o plano e conversa com a equipe pelo WhatsApp/i),
    ).toBeInTheDocument();
    expect(container.textContent).not.toMatch(/Se continuar, os R\$ 39 viram crédito/i);
  });

  it("presents the current four-person teaching team", () => {
    render(<LandingPage />);

    expect(screen.getByText("PROFESSORES")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Tailan" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Sthefanie" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Luinne" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Karine" })).toBeInTheDocument();
    expect(screen.getByText(/11 anos de GFB · professor e fundador/i)).toBeInTheDocument();
    expect(screen.getAllByText(/8 anos de GFB/i)).toHaveLength(2);
    expect(screen.getByText(/3 anos de GFB/i)).toBeInTheDocument();
  });

  it("uses conversational simulated testimonials with a concrete discovery moment", () => {
    const { container } = render(<LandingPage />);

    expect(screen.getByText(/uma amiga me chamou para conhecer uma aula/i)).toBeInTheDocument();
    expect(screen.getByText(/vi alguns vídeos da escola no Instagram/i)).toBeInTheDocument();
    expect(screen.getByText(/cheguei por indicação de uma colega do trabalho/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Como foi a primeira aula." }).closest("section"))
      .not.toHaveTextContent(/Tailan/i);
  });

  it("uses a stronger waitlist invitation and practical pre-class questions", () => {
    const { container } = render(<LandingPage />);

    expect(
      screen.getByRole("heading", { name: "O próximo começo pode ser o seu." }),
    ).toBeInTheDocument();
    const scheduleSection = container.querySelector("#proxima-turma");
    expect(scheduleSection).toBeInTheDocument();
    expect(
      screen.getByRole("group", { name: "Qual horário funciona melhor para você?" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /Quinta-feira às 19h30/i })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /Sábado às 14h/i })).toBeInTheDocument();
    expect(screen.getByText("Estamos ansiosos para ter você conosco.")).toBeInTheDocument();
    expect(screen.getByText("Preciso já ter ritmo para começar?")).toBeInTheDocument();
    expect(
      screen.getByText("Que roupa e calçado eu uso na primeira aula?"),
    ).toBeInTheDocument();
    expect(screen.getByText("E se eu faltar a uma aula?")).toBeInTheDocument();
    expect(screen.getByText(/acesso aos vídeos dos passos trabalhados/i)).toBeInTheDocument();
    expect(screen.getByText("PERGUNTAS FREQUENTES")).toBeInTheDocument();
  });

  it("renders the complete weekly timetable recovered from the production deployment", () => {
    const { container } = render(<LandingPage />);

    const timetable = container.querySelector("#horarios");
    expect(timetable).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Forró cabe na sua semana." }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("table", {
        name: "Horários semanais das turmas",
      }),
    ).toBeInTheDocument();
    expect(timetable?.querySelectorAll("tbody tr")).toHaveLength(5);
    expect(timetable).toHaveTextContent("Segunda-feira19h30—21h30Avançado");
    expect(timetable).toHaveTextContent("Quinta-feira19h30—21h30Iniciante");
    expect(timetable).toHaveTextContent(
      "Sábado14h00—15h30Iniciante15h30—17h00Básico17h00—18h30Intermediário",
    );
  });

  it("uses one responsive depth ScrollTrigger instead of recreating one per image", () => {
    const animationSource = readFileSync(
      "src/modules/site/components/landing/LandingAnimationRuntime.tsx",
      "utf8",
    );

    expect(animationSource).toContain("const depthElements");
    expect(animationSource).toMatch(/gsap\.fromTo\(\s*depthElements,/);
    expect(animationSource).not.toMatch(
      /toArray<HTMLElement>\("\[data-depth\]"\)\.forEach/,
    );
  });

  it("keeps trust numbers static while exposing presentation-only choreography hooks", () => {
    const { container } = render(<LandingPage />);

    expect(container.querySelector("[data-proof-rule]")).toBeInTheDocument();
    expect(container.querySelectorAll("[data-proof-value]")).toHaveLength(2);
    expect(container.querySelector("[data-count-target]")).not.toBeInTheDocument();
    expect(screen.getByText("11 anos")).toBeInTheDocument();
    expect(screen.getByText("+ de 3.000")).toBeInTheDocument();
    expect(container.textContent).not.toMatch(/\+ de 500/);
  });

  it("exposes a sequential narrative for the three beginner steps", () => {
    const { container } = render(<LandingPage />);

    expect(container.querySelector("[data-how-steps]")).toBeInTheDocument();
    expect(container.querySelectorAll("[data-how-step]")).toHaveLength(3);
    expect(container.querySelectorAll("[data-how-rule]")).toHaveLength(3);
    expect(screen.getByRole("heading", { name: "Escolha o dia" })).toBeInTheDocument();
  });

  it("keeps the location focused on address, route and map without the old photo gallery", () => {
    const { container } = render(<LandingPage />);

    expect(container.querySelector("[data-location-gallery]")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ver rota" })).toBeInTheDocument();
    expect(
      screen.getByTitle("Mapa da Escola Criativa em Feira de Santana"),
    ).toBeInTheDocument();
  });

  it("uses the footer text color as the exact logo tint", () => {
    const { container } = render(<LandingPage />);
    const css = readFileSync("src/modules/site/components/landing/Landing.module.css", "utf8");

    expect(container.querySelector("[data-footer-logo]")).toHaveAccessibleName(
      "Grupo Forró do Bom",
    );
    expect(css).toMatch(/\.footerLogo\s*\{[\s\S]*background:\s*var\(--sand\)/);
    expect(css).toMatch(
      /\.footerLogo\s*\{[\s\S]*mask:\s*url\("\/brand\/gfb-monogram\.svg"\)/,
    );
    expect(css).toMatch(/\.footerBrand p\s*\{[\s\S]*color:\s*var\(--sand\)/);
  });

  it("opens and closes FAQ items with aria-expanded", async () => {
    const user = userEvent.setup();
    render(<LandingPage />);

    const trigger = screen.getByRole("button", {
      name: "Vou precisar dançar com pessoas que não conheço?",
    });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(trigger.querySelector("[data-faq-icon]")).toBeInTheDocument();
    expect(
      screen.getByText(/as trocas de pares fazem parte da dinâmica porque ajudam/i),
    ).toBeVisible();
  });

  it("keeps mobile navigation mounted and exposes its visual state", async () => {
    const user = userEvent.setup();
    const { container } = render(<LandingPage />);
    const navigation = container.querySelector("#site-navigation");

    expect(navigation).toHaveAttribute("data-open", "false");
    await user.click(screen.getByRole("button", { name: "Menu" }));
    expect(navigation).toHaveAttribute("data-open", "true");
  });

  it("opens the leveling dialog and exposes the free WhatsApp route", async () => {
    const user = userEvent.setup();
    render(<LandingPage />);

    await user.click(
      screen.getAllByRole("button", { name: "Como funciona o nivelamento?" })[0],
    );

    expect(screen.getByRole("dialog", { name: /como funciona o nivelamento/i })).toBeVisible();
    expect(screen.getByText("Um encontro cuidadoso, não uma prova.")).toBeInTheDocument();
    expect(await screen.findByRole("combobox", { name: "Nível pretendido" })).toBeInTheDocument();
    expect(screen.getAllByRole("listitem").filter((item) => item.closest("dialog"))).toHaveLength(4);
    expect(document.body).toHaveStyle({ overflow: "hidden" });
  });

  it("uses a branded accessible level selector and describes the teacher evaluation", async () => {
    const user = userEvent.setup();
    render(<LandingPage />);

    await user.click(
      screen.getAllByRole("button", { name: "Como funciona o nivelamento?" })[0],
    );

    expect(
      screen.getByText(/um professor vai avaliar uma dança sua/i),
    ).toBeInTheDocument();

  const trigger = await screen.findByRole("combobox", { name: "Nível pretendido" });
  expect(trigger.tagName).toBe("BUTTON");
  await user.click(trigger);

  expect(trigger).toHaveAttribute("aria-expanded", "true");
  expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(3);
    expect(document.querySelector("[data-level-select-popup]")).toBeInTheDocument();
  });

  it("uses the new brand ending and Instagram route", () => {
    const { container } = render(<LandingPage />);

    expect(
      screen.getByRole("heading", { name: "Sua vida pede um Forró do Bom." }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /instagram do grupo forró do bom/i })).toHaveAttribute(
      "href",
      "https://www.instagram.com/dobomforro/",
    );
    expect(screen.getByRole("link", { name: /instagram do grupo forró do bom/i })).not.toHaveTextContent(
      "@dobomforro",
    );
    expect(container.querySelector(`header img`)?.getAttribute("src")).toContain("gfb-logo.svg");
    expect(container.querySelector("[data-footer-logo]")).toHaveAccessibleName(
      "Grupo Forró do Bom",
    );
  });

  it("describes the history on the hero seal", () => {
    const { container } = render(<LandingPage />);

    expect(container.querySelector("[data-hero-stamp]")).toHaveTextContent(
      "11 anos de história",
    );
  });

  it("presents the GFB origin story and uses a real class image in the hero", () => {
    const { container } = render(<LandingPage />);

    expect(
      screen.getByRole("heading", {
        name: "Começamos na UEFS. Hoje, fazemos Feira dançar.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/nasceu em junho de 2015, na uefs/i)).toBeInTheDocument();
    expect(screen.getByText(/mais de 3 mil pessoas já passaram por aqui/i)).toBeInTheDocument();
    expect(screen.getByText("NOSSA HISTÓRIA")).toBeInTheDocument();
    expect(container.textContent).not.toMatch(/atualmente contamos com aproximadamente 200/i);
    expect(container.textContent).not.toMatch(/9 pessoas no começo/i);

    const heroImage = container.querySelector<HTMLImageElement>("#inicio img");
    expect(heroImage?.getAttribute("src")).toContain("turma-gfb-registro-2022.webp");
    expect(existsSync("public/images/gfb/turma-gfb-registro-2022.webp")).toBe(true);
    expect(screen.getByText("Dá para se imaginar aqui no meio.")).toBeInTheDocument();
    expect(
      container.querySelector("#quem-e-o-gfb img")?.getAttribute("src"),
    ).toContain("historia-gfb-uefs-2017.webp");
    const historyImage = container.querySelector("#quem-e-o-gfb img");
    const legacyText = screen.getByText(/mais de 3 mil pessoas já passaram por aqui/i);
    expect(
      historyImage &&
        Boolean(historyImage.compareDocumentPosition(legacyText) & Node.DOCUMENT_POSITION_FOLLOWING),
    ).toBe(true);
  });

  it("adapts the atmosphere stage to portrait Reels and loads only the active video", async () => {
    const user = userEvent.setup();
    const { container } = render(<LandingPage />);
    const carousel = container.querySelector("[data-atmosphere-carousel]");

    expect(carousel?.querySelectorAll("[data-atmosphere-slide]")).toHaveLength(6);
    expect(
      carousel?.querySelectorAll(
        '[data-atmosphere-slide][data-media-orientation="portrait"]',
      ),
    ).toHaveLength(3);
    expect(carousel?.querySelectorAll("[data-atmosphere-video]")).toHaveLength(3);

    await user.click(screen.getByRole("button", { name: "Mostrar registro 6" }));
    expect(carousel).toHaveAttribute("data-active-format", "portrait");
    expect(
      carousel?.querySelector('[data-active="true"] source'),
    ).toHaveAttribute("src", "/media/gfb/aula-em-movimento-reel-silencioso.mp4");
    expect(carousel?.querySelectorAll("source")).toHaveLength(1);
  });

  it("uses lightweight transparent vectors for the new brand applications", () => {
    const logo = readFileSync("public/brand/gfb-logo.svg", "utf8");
    const monogram = readFileSync("public/brand/gfb-monogram.svg", "utf8");

    expect(logo).not.toContain("path:first-of-type{display:none}");
    expect(logo).not.toContain("<style>");
    expect(logo).not.toContain("<image");
    expect(monogram).not.toContain("<image");
    expect(logo).toContain('viewBox="0 0 940 624"');
    expect(monogram).toContain('viewBox="0 0 940 624"');
    expect(statSync("public/brand/gfb-logo.svg").size).toBeLessThan(10 * 1024);
    expect(statSync("public/brand/gfb-monogram.svg").size).toBeLessThan(10 * 1024);
  });

  it("ships a lightweight conventional favicon instead of the full monogram", () => {
    const favicon = readFileSync("src/app/favicon.ico");
    const imageCount = favicon.readUInt16LE(4);
    const dimensions = Array.from({ length: imageCount }, (_, index) => {
      const entryOffset = 6 + index * 16;
      const width = favicon[entryOffset] || 256;
      const height = favicon[entryOffset + 1] || 256;

      return [width, height];
    });
    const layout = readFileSync("src/app/layout.tsx", "utf8");

    expect(favicon.readUInt16LE(0)).toBe(0);
    expect(favicon.readUInt16LE(2)).toBe(1);
    expect(dimensions).toEqual([
      [16, 16],
      [32, 32],
      [48, 48],
    ]);
    expect(favicon.byteLength).toBeLessThan(10 * 1024);
    expect(layout).not.toContain('/brand/gfb-monogram.svg');
  });

  it("builds the leveling selector as one adaptive GSAP word morph", () => {
    const { container } = render(<LandingPage />);
    const morph = container.querySelector("[data-level-morph]");

    expect(morph).toBeInTheDocument();
    expect(morph?.querySelectorAll("[data-level-word]")).toHaveLength(4);
    expect(morph?.querySelectorAll("[data-level-char]").length).toBeGreaterThan(20);
    expect(morph?.querySelectorAll("[data-level-badge]")).toHaveLength(4);
    expect(morph?.querySelectorAll("[data-level-star]")).toHaveLength(11);
    expect(container.querySelector("[data-level-morph-frame]")).toBeInTheDocument();
  });

  it("includes mobile layout safeguards for dense labels and compact carousels", () => {
    render(<LandingPage />);
    const css = readFileSync("src/modules/site/components/landing/Landing.module.css", "utf8");

    expect(
      screen.getByRole("heading", {
        name: "Começamos na UEFS. Hoje, fazemos Feira dançar.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "As aulas começam pelas bases e avançam com a desenvoltura da turma.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Os professores e monitores orientam você de perto. Nas trocas de pares, dá para praticar sem ficar perdido.",
      ),
    ).toBeInTheDocument();
    expect(css).toMatch(/@media \(max-width: 430px\)[\s\S]*\.scheduleTable col:nth-child\(3\)[\s\S]*width:\s*36%/);
    expect(css).toMatch(/\.scheduleLevel[\s\S]*max-width:\s*100%/);
    expect(css).toMatch(/@media \(max-width: 599px\)[\s\S]*\.heroVisual\s*\{[\s\S]*justify-self:\s*center/);
    expect(css).toMatch(/@media \(max-width: 599px\)[\s\S]*\.heroStamp\s*\{[\s\S]*right:/);
    expect(css).toMatch(/\.atmosphereSlide figcaption\s*\{[\s\S]*display:\s*block[\s\S]*text-align:\s*center/);
    expect(css).toMatch(/@media \(max-width: 599px\)[\s\S]*\.atmosphereSlide figcaption strong[\s\S]*white-space:\s*nowrap/);
    expect(css).toMatch(/@media \(max-width: 599px\)[\s\S]*\.planMeta > p:last-child[\s\S]*display:\s*none/);
    expect(css).toMatch(/@media \(max-width: 599px\)[\s\S]*\.finalCtaSection[\s\S]*min-height:\s*0/);
  });

  it("keeps the hero compact and pricing readable on tablet widths", () => {
    const css = readFileSync("src/modules/site/components/landing/Landing.module.css", "utf8");
    expect(css).toMatch(/\.priceCard\s*\{[\s\S]*?container-type:\s*inline-size;/);
    expect(css).toMatch(/\.planPrice\s*\{[\s\S]*?flex-wrap:\s*wrap;/);
    expect(css).toMatch(/\.planPrice strong\s*\{[\s\S]*?18cqi/);
    expect(css).toMatch(
      /@media \(min-width: 768px\) and \(max-width: 1099px\)[\s\S]*?\.heroSection\s*\{[\s\S]*?min-height:\s*0;/,
    );
    expect(css).toMatch(
      /@media \(min-width: 768px\) and \(max-width: 1099px\)[\s\S]*?\.pricingGrid\s*\{[\s\S]*?grid-template-columns:\s*repeat\(2,/,
    );
    expect(css).toMatch(
      /@media \(min-width: 768px\) and \(max-width: 1099px\)[\s\S]*?\.plusPlan\s*\{[\s\S]*?grid-column:\s*1\s*\/\s*-1;/,
    );
    expect(css).toMatch(
      /@media \(min-width: 1100px\)[\s\S]*?\.pricingGrid\s*\{[\s\S]*?grid-template-columns:\s*repeat\(3,/,
    );
  });

  it("keeps mobile carousel controls inside narrow screens", () => {
    const css = readFileSync("src/modules/site/components/landing/Landing.module.css", "utf8");
    const mobileCss = css.slice(css.indexOf("@media (max-width: 430px)"));

    expect(mobileCss).toMatch(
      /\.atmosphereDots\s*\{[\s\S]*?flex:\s*1;[\s\S]*?min-width:\s*0;/,
    );
    expect(mobileCss).toMatch(
      /\.atmosphereDots button\s*\{[\s\S]*?width:\s*auto;[\s\S]*?flex:\s*1;/,
    );
    expect(mobileCss).toMatch(/\.atmosphereArrows\s*\{[\s\S]*?flex:\s*0 0 auto;/);
  });

  it("keeps page scrolling without reserving visible scrollbar space", () => {
    const css = readFileSync("src/app/globals.css", "utf8");

    expect(css).toMatch(/html\s*\{[\s\S]*scrollbar-gutter:\s*auto/);
    expect(css).toMatch(/html\s*\{[\s\S]*overflow-y:\s*auto/);
    expect(css).toMatch(/html\s*\{[\s\S]*scrollbar-width:\s*none/);
    expect(css).toMatch(
      /html::\-webkit\-scrollbar\s*\{[\s\S]*display:\s*none;[\s\S]*width:\s*0/,
    );
  });

  it("caps the sticky conversion bar safe-area padding on tall iPhones", () => {
    const css = readFileSync("src/modules/site/components/landing/Landing.module.css", "utf8");
    const mobileBarRule = css.match(/\.mobileBar\s*\{([^}]*)\}/)?.[1];

    expect(mobileBarRule).toContain(
      "min(env(safe-area-inset-bottom), 1.25rem)",
    );
  });

  it("restores the atmosphere position after a tall mobile slide", () => {
    const css = readFileSync("src/modules/site/components/landing/Landing.module.css", "utf8");

    expect(shouldRestoreAtmospherePosition("portrait", "landscape", true)).toBe(true);
    expect(shouldRestoreAtmospherePosition("portrait", "square", true)).toBe(true);
    expect(shouldRestoreAtmospherePosition("landscape", "portrait", true)).toBe(false);
    expect(shouldRestoreAtmospherePosition("portrait", "landscape", false)).toBe(false);
    expect(shouldRestoreAtmospherePosition("portrait", "portrait", true)).toBe(false);
    expect(css).toMatch(
      /\.atmosphereViewport\s*\{[\s\S]*?scroll-margin-top:\s*calc\(4\.75rem \+ 1rem\);/,
    );
  });

  it("keeps schedule columns separated on narrow screens", () => {
    const css = readFileSync("src/modules/site/components/landing/Landing.module.css", "utf8");
    const mobileCss = css.slice(css.indexOf("@media (max-width: 430px)"));

    expect(mobileCss).toMatch(/\.scheduleTable col:nth-child\(1\)\s*\{[\s\S]*?width:\s*26%;/);
    expect(mobileCss).toMatch(/\.scheduleTable col:nth-child\(2\)\s*\{[\s\S]*?width:\s*38%;/);
    expect(mobileCss).toMatch(/\.scheduleTable col:nth-child\(3\)\s*\{[\s\S]*?width:\s*36%;/);
    expect(mobileCss).toMatch(
      /\.scheduleTime\s*\{[\s\S]*?gap:\s*0\.08rem;[\s\S]*?font-size:\s*0\.78rem;/,
    );
  });

  it("adds complete institutional and payment information to the footer", () => {
    render(<LandingPage />);

    expect(screen.getByRole("link", { name: "Política de privacidade" })).toHaveAttribute(
      "href",
      "/politica-de-privacidade",
    );
    expect(screen.getByRole("link", { name: "Termos de uso" })).toHaveAttribute(
      "href",
      "/termos-de-uso",
    );
    expect(screen.getByText(/não há pagamento on-line nesta página/i)).toBeInTheDocument();
    expect(screen.getByText(/formas de pagamento são confirmadas/i)).toBeInTheDocument();
  });
});
