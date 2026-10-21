export type VisualAsset = {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  position?: string;
};

export const visualAssets = {
  hero: {
    src: "/images/gfb/turma-gfb-registro-2022.webp",
    width: 1080,
    height: 734,
    alt: "Turma do Grupo Forró do Bom reunida depois de uma aula",
    caption: "Dá para se imaginar aqui no meio.",
    position: "50% 50%",
  },
  arrival: {
    src: "/images/gfb/comunidade-gfb-confraternizacao.webp",
    width: 1440,
    height: 1440,
    alt: "Alunos e equipe do Grupo Forró do Bom reunidos e sorrindo",
    caption: "Você chega para aprender e encontra gente para dançar junto",
    position: "50% 50%",
  },
  exchange: {
    src: "/images/gfb/turma-gfb-encontro-01.webp",
    width: 1440,
    height: 1439,
    alt: "Alunos e equipe do Grupo Forró do Bom reunidos depois de um encontro",
    caption: "Gente que aprende, pratica e continua por perto",
  },
  guidance: {
    src: "/media/gfb/aula-em-movimento-reel-poster.webp",
    width: 720,
    height: 1280,
    alt: "Professor acompanhando alunos durante uma aula do GFB",
    caption: "Acompanhamento próximo durante a prática",
  },
  footwork: {
    src: "/images/illustrative/passos-pes.png",
    width: 1536,
    height: 1024,
    alt: "Pés de várias pessoas praticando bases de forró",
    caption: "Bases que ajudam o corpo a encontrar o ritmo",
  },
  turn: {
    src: "/images/illustrative/giro-simples.png",
    width: 1122,
    height: 1402,
    alt: "Dupla praticando um giro simples de forró",
    caption: "Giro simples em movimento",
  },
  monitors: {
    src: "/images/gfb/equipe-professores-gfb.webp",
    width: 1440,
    height: 1390,
    alt: "Equipe de professores do Grupo Forró do Bom",
    caption: "Os professores que acompanham cada turma de perto",
    position: "50% 42%",
  },
  communityEvent: {
    src: "/images/gfb/comunidade-gfb-confraternizacao.webp",
    width: 1440,
    height: 1440,
    alt: "Alunos e equipe do Grupo Forró do Bom reunidos em uma confraternização",
    caption: "Encontros que continuam para além da aula",
    position: "50% 50%",
  },
  history: {
    src: "/images/gfb/historia-gfb-uefs-2017.webp",
    width: 1080,
    height: 810,
    alt: "Aula do Grupo Forró do Bom na UEFS em 2017",
    caption: "Um registro dos primeiros anos do GFB na UEFS",
    position: "50% 50%",
  },
  community: {
    src: "/images/gfb/comunidade-gfb-evento-2024.webp",
    width: 1100,
    height: 960,
    alt: "Comunidade do Grupo Forró do Bom reunida em um evento em Feira de Santana",
    caption: "O forró aproxima pessoas dentro e fora das aulas",
  },
} satisfies Record<string, VisualAsset>;
