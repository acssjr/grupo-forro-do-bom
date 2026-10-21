export const whatsappMessages = {
  beginner:
    "Olá! Quero começar no Grupo Forró do Bom e gostaria de saber sobre a próxima turma iniciante.",
  thursday: "Olá! Tenho interesse na próxima turma de quinta-feira, às 19h30.",
  saturday: "Olá! Tenho interesse na próxima turma de sábado, às 14h.",
  plan: (planName: string) =>
    `Olá! Tenho interesse no plano ${planName} do Grupo Forró do Bom.`,
  leveling: (level: string) =>
    `Olá! Já danço e quero agendar um nivelamento gratuito para o nível ${level}.`,
} as const;

export const navigationItems = [
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#o-que-aprende", label: "O que você aprende" },
  { href: "#planos", label: "Planos" },
  { href: "#nivelamento", label: "Nivelamento" },
] as const;

export const recognitionItems = [
  "Eu acho que não levo jeito",
  "Tenho vergonha de errar",
  "Eu travo quando começa o forró",
] as const;

export const gfbHistory = {
  kicker: "NOSSA HISTÓRIA",
  title: "Começamos na UEFS. Hoje, fazemos Feira dançar.",
  origin:
    "O Grupo Forró do Bom nasceu em junho de 2015, na UEFS, por iniciativa de Tailan Cavalcante. O que começou com nove pessoas brincando de dançar cresceu até se tornar uma escola reconhecida em Feira de Santana e região.",
  legacy:
    "Mais de 3 mil pessoas já passaram por aqui. Ao longo dessa história, o grupo ajudou a formar professores e dançarinos e, em um de seus marcos, chegou a reunir aproximadamente 200 alunos ativos.",
  closing: "Uma história construída com gente que chegou para aprender e ficou pela dança.",
} as const;

export const atmosphereFrames = [
  {
    kind: "image",
    orientation: "landscape",
    label: "O forró também ocupa a cidade",
    asset: "community",
  },
  {
    kind: "video",
    orientation: "portrait",
    label: "GENTE QUE CELEBRA JUNTO",
    src: "/media/gfb/comunidade-gfb-encontro-silencioso.mp4",
    poster: "/media/gfb/comunidade-gfb-encontro-poster.webp",
    alt: "Encontro com alunos e equipe do Grupo Forró do Bom",
    caption: "A dança aproxima e a convivência ganha espaço dentro e fora das aulas.",
  },
  {
    kind: "image",
    orientation: "square",
    label: "Gente que continua por perto",
    asset: "exchange",
  },
  {
    kind: "video",
    orientation: "portrait",
    label: "A turma começa pelas bases",
    src: "/media/gfb/turma-iniciante-em-movimento-silencioso.mp4",
    poster: "/media/gfb/turma-iniciante-em-movimento-poster.webp",
    alt: "Registro em vídeo de uma turma iniciante do Grupo Forró do Bom",
    caption: "Um registro da evolução construída em aula, do primeiro passo à dança em grupo.",
  },
  {
    kind: "image",
    orientation: "landscape",
    label: "Uma turma para dançar junto",
    asset: "arrival",
  },
  {
    kind: "video",
    orientation: "portrait",
    label: "Orientação de perto na prática",
    src: "/media/gfb/aula-em-movimento-reel-silencioso.mp4",
    poster: "/media/gfb/aula-em-movimento-reel-poster.webp",
    alt: "Alunos do Grupo Forró do Bom dançando durante uma aula",
    caption: "Um registro próximo de quem está aprendendo, praticando e dançando junto.",
  },
] as const;

export const beginnerSteps = [
  {
    number: "01",
    title: "Escolha o dia",
    text: "Quinta, às 19h30, ou sábado, às 14h. Você entra no início de uma nova turma.",
  },
  {
    number: "02",
    title: "Participe da primeira aula por R$ 39.",
    text: "Conheça o método, as pessoas e o ritmo da aula antes de decidir.",
  },
  {
    number: "03",
    title: "Se quiser continuar, use o valor como crédito.",
    text: "Os R$ 39 são abatidos da sua matrícula no plano escolhido.",
  },
] as const;

export const weeklySchedule = [
  {
    day: "Segunda-feira",
    shortDay: "SEG",
    classes: [
      { start: "19:30", end: "21:30", level: "Avançado" },
    ],
  },
  {
    day: "Quinta-feira",
    shortDay: "QUI",
    classes: [
      { start: "19:30", end: "21:30", level: "Iniciante" },
    ],
  },
  {
    day: "Sábado",
    shortDay: "SÁB",
    classes: [
      { start: "14:00", end: "15:30", level: "Iniciante" },
      { start: "15:30", end: "17:00", level: "Básico" },
      { start: "17:00", end: "18:30", level: "Intermediário" },
    ],
  },
] as const;

export const learningItems = [
  {
    label: "COMEÇAR",
    title: "Você reconhece a marcação e entra na dança.",
    text: "O dois pra lá e dois pra cá dá ao corpo um ponto de partida quando o forró começa.",
  },
  {
    label: "CONTINUAR",
    title: "Você liga um movimento ao outro com mais naturalidade.",
    text: "A base frontal e os deslocamentos ajudam você a manter a dança acontecendo.",
  },
  {
    label: "SE ALGO SAIR DIFERENTE",
    title: "Você encontra o ritmo de novo e continua.",
    text: "Você aprende a se reorganizar sem parar a dança quando algo não sai como esperava.",
  },
] as const;

export const differences = [
  {
    title: "11 anos de experiência",
    text: "Tempo de prática acompanhando pessoas que chegaram com histórias e ritmos diferentes.",
  },
  {
    title: "Progressão com conteúdo próprio",
    text: "Cada encontro traz algo completo e, ao mesmo tempo, prepara o corpo para o próximo passo.",
  },
  {
    title: "A turma orienta o ritmo",
    text: "A evolução acompanha a desenvoltura real dos participantes, sem correr por uma ementa.",
  },
  {
    title: "Professores e monitores por perto",
    text: "Há gente observando, demonstrando e ajudando quando uma dúvida aparece.",
  },
  {
    title: "Você pode chegar sem par",
    text: "As trocas fazem parte da dinâmica e ajudam todo mundo a desenvolver a dança.",
  },
] as const;

export const teamStories = [
  {
    title: "Tailan",
    meta: "11 anos de GFB · professor e fundador",
    text: "Professor e fundador do Grupo Forró do Bom.",
  },
  {
    title: "Sthefanie",
    meta: "8 anos de GFB",
    text: "",
  },
  {
    title: "Luinne",
    meta: "8 anos de GFB",
    text: "",
  },
  {
    title: "Karine",
    meta: "3 anos de GFB",
    text: "",
  },
] as const;

export const plans = [
  {
    name: "Para conhecer o GFB",
    role: "Primeiro passo",
    price: "R$ 39",
    cadence: "primeira aula",
    benefit: "Experimente o método e conheça a turma.",
    items: [
      "Primeira aula no início de uma nova turma",
      "O valor vira crédito se você decidir continuar",
    ],
    cta: "Quero conhecer",
    badge: "CONHEÇA O GFB",
    entry: true,
    recommended: false,
    acceleration: false,
    note: "Se continuar, por mais R$ 40 você garante o primeiro mês no Essencial.",
    platform: null,
  },
  {
    name: "Essencial GFB",
    role: "Para criar constância",
    price: "R$ 79",
    cadence: "por mês",
    benefit: "O melhor equilíbrio entre acompanhamento, prática e investimento.",
    items: [
      "Uma aula por semana com progressão contínua",
      "Acompanhamento da evolução no ritmo da turma",
      "Conteúdos completos em cada encontro",
      "Professores e monitores acompanhando a turma",
      "Trocas de pares para desenvolver a dança",
      "Acesso à plataforma do aluno",
    ],
    cta: "Escolher Essencial",
    badge: "O MAIS ESCOLHIDO",
    entry: false,
    recommended: true,
    acceleration: false,
    note: "A rotina certa para evoluir sem precisar fazer duas aulas por semana.",
    platform: {
      prompt: "O que está incluído?",
      description:
        "Vídeos dos passos trabalhados em aula, histórico de observações dos professores e avisos da turma.",
    },
  },
  {
    name: "GFB Plus",
    role: "Para acelerar",
    price: "R$ 179",
    cadence: "por mês",
    benefit: "Para quem quer acelerar a evolução com mais prática e atenção individual.",
    items: [
      "Tudo o que está no Essencial",
      "Participação nas turmas de quinta e sábado",
      "Duas oportunidades semanais para praticar, corrigir e fixar",
      "Um acompanhamento individualizado por mês",
      "Observação individual da movimentação",
      "Correções pontuais de postura, pisada, ritmo e estética",
    ],
    note:
      "Professor e horário do acompanhamento são definidos conforme disponibilidade e combinados previamente. Consulte condições.",
    cta: "Escolher Plus",
    badge: "MAIS PRÁTICA",
    entry: false,
    recommended: false,
    acceleration: true,
    platform: null,
  },
] as const;

export const testimonialThemes = [
  {
    title: "Mariana",
    role: "aluna iniciante",
    text: "Uma amiga me chamou para conhecer uma aula. Fui sozinha e com aquela vergonha do primeiro dia, mas a turma me recebeu bem. Quando a aula terminou, eu já queria voltar.",
  },
  {
    title: "Lucas",
    role: "aluno",
    text: "Vi alguns vídeos da escola no Instagram e resolvi experimentar. O que me deixou tranquilo foi ver que tinha mais gente aprendendo e que errar fazia parte da aula.",
  },
  {
    title: "Camila",
    role: "aluna",
    text: "Cheguei por indicação de uma colega do trabalho. Depois das primeiras aulas, comecei a aceitar convites para dançar que antes eu recusava. Hoje o forró faz parte da minha semana.",
  },
] as const;

export const levelingSteps = [
  "Você conta em qual nível pretende ingressar: básico, intermediário ou avançado.",
  "O encontro gratuito é agendado pelo WhatsApp. Um professor vai avaliar uma dança sua e propor exercícios compatíveis com o nível escolhido.",
  "Observamos ritmo, musicalidade, bases, passos, condução, resposta à condução e repertório. Finalizações e enfeites entram conforme o nível.",
  "Ao final, o professor indica a turma mais adequada. A entrada acontece no início da próxima turma desse nível.",
] as const;

export const faqItems = [
  {
    question: "Preciso já ter ritmo para começar?",
    answer:
      "Não. Ritmo também se aprende. A turma começa pelas bases, repete o necessário e avança conforme a desenvoltura das pessoas.",
  },
  {
    question: "Vou precisar dançar com pessoas que não conheço?",
    answer:
      "As trocas de pares fazem parte da dinâmica porque ajudam a desenvolver a dança. Você pode chegar sem par e participar no seu ritmo.",
  },
  {
    question: "Sou tímido. Vou precisar me expor na frente da turma?",
    answer:
      "A proposta é aprender em grupo, com demonstração e prática orientada. Você não precisa chegar pronto nem provar que sabe dançar.",
  },
  {
    question: "Que roupa e calçado eu uso na primeira aula?",
    answer:
      "Escolha roupas confortáveis, que deixem o corpo se mover, e um calçado firme no pé. Se estiver em dúvida sobre o que você já tem, confirme com a equipe pelo WhatsApp.",
  },
  {
    question: "E se eu faltar a uma aula?",
    answer:
      "Não há reposição de aula, mas todos os alunos têm acesso aos vídeos dos passos trabalhados. Assim, você entende o que foi visto e pode praticar durante a semana, sozinho ou com um par.",
  },
  {
    question: "Posso fazer a primeira aula e decidir o plano depois?",
    answer:
      "Sim. A primeira aula custa R$ 39 para você conhecer o método e o ambiente. Se decidir continuar, esse valor vira crédito na matrícula.",
  },
  {
    question: "Eu já sei alguns passos. Preciso começar do zero?",
    answer:
      "Não necessariamente. O nivelamento gratuito ajuda a entender se a sua dança se encaixa no básico, intermediário ou avançado dentro da metodologia GFB.",
  },
  {
    question: "Quanto tempo leva para eu conseguir dançar uma música?",
    answer:
      "Não existe um prazo igual para todo mundo. No primeiro mês você começa pelas bases que ajudam o corpo a entender o ritmo e montar a dança com mais segurança.",
  },
] as const;
