# Tela de acesso da gestão

Rota: `/gestao/login`.

## Direção visual

Composição fornecida pelo usuário: painel ilustrado à esquerda e formulário à direita, superfícies brancas, dourado/amarelo e vidro translúcido com beam perimetral. Formulário primeiro no mobile. Tipografia Makking da gestão, foco neutro, usuário e senha com rótulos explícitos; mostrar/ocultar senha; checkbox personalizado e já marcado. Sem login social.

A primeira direção de imagem foi rejeitada por realismo excessivo. A arte aplicada é uma edição da referência cartoon enviada pelo usuário, preservando mesa, personagem de cabeça grande, olhos simples, chapéu, gesto, cadeira e planta. Notebook substituído por sanfona; paleta trocada para branco/dourado; texto gerado removido. PNG e proveniência em public/images/management/.

## Limite funcional atual

A tela não é autenticação de produção. Ainda não existe serviço de credenciais, sessão ou recuperação de senha, e as rotas da gestão ainda não são protegidas. Enviar o formulário não concede acesso nem aceita uma senha fictícia: a interface informa que a administração precisa ativar a autenticação.

O checkbox está pré-marcado conforme solicitado. Neste estágio, só guarda o nome de usuário no navegador; nunca a senha. A semântica de sessão persistente deve ser conectada ao backend com cookie HttpOnly/Secure quando a autenticação for implementada.

O layout do painel foi movido para o segmento catch-all para que o login fique fora da navegação administrativa. Provider e armazenamento das telas existentes foram preservados.

## Publicação verificada em 21/10/2026

- https://gfblp-main.vercel.app/ : HTTP 200, LP publicada.
- https://gfblp-main.vercel.app/gestao : HTTP 404, gestão ainda não publicada.
- Repositório GitHub atual: acssjr/grupo-forro-do-bom. Origin atualizado.
- Associação Vercel preservada: mesmo projectId e projectName gfb_lp-main. Renomear o repositório não renomeou o projeto nem seu domínio.
- O último deployment registrado no GitHub está marcado como success. Isso não prova um novo deploy das alterações locais.
- Não houve push ou publicação neste trabalho.

Referências oficiais de integração:
https://docs.github.com/en/repositories/creating-and-managing-repositories/renaming-a-repository
https://vercel.com/docs/git/vercel-for-github

Validação:21 verificações Chromium de campos, checkbox, memória de usuário, senha não persistida, ajuda, responsividade 320–1440, movimento reduzido e preservação da gestão; build e lint aprovados.
