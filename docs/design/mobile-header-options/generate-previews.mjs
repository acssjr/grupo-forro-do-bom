import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

// Design studies, not browser screenshots. Existing logo, avatar, font and content.
const out='docs/design/mobile-header-options';
const fontfile=path.resolve('.impeccable/mocks/mobile-header/makking.ttf');
const font='GFB Makking Preview';
const scale=2, W=430, H=560;
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;');
const text=async(str,x,y,size=14,color='#101010',bold=false)=>({input:await sharp({text:{text:`<span foreground="${color}"${bold?' weight="bold"':''}>${esc(str)}</span>`,font:`${font} ${size}`,fontfile,dpi:144,rgba:true}}).png().toBuffer(),left:x*scale,top:y*scale});
const asset=async(file,x,y,w,h=w)=>({input:await sharp(file).resize(w*scale,h*scale,{fit:'contain'}).png().toBuffer(),left:x*scale,top:y*scale});
const avatar=async(x,y)=>({input:await sharp('public/brand/gestao/avatar-professor-3d.png').resize(72,72).composite([{input:Buffer.from('<svg width="72" height="72"><circle cx="36" cy="36" r="36" fill="white"/></svg>'),blend:'dest-in'}]).png().toBuffer(),left:x*scale,top:y*scale});
const bell=(x,y,color)=>`<g transform="translate(${x} ${y})" stroke="${color}" stroke-width="1.7" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M5 17h16c-3-3-3-5-3-9a6 6 0 0 0-12 0c0 4 0 6-3 9h2m6 4h4"/><circle cx="22" cy="2" r="3" fill="#f6c300" stroke="none"/></g>`;
const arrow=(x,y)=>`<path d="M${x} ${y}h10m-4-4 4 4-4 4" fill="none" stroke="#777365" stroke-width="1.4" stroke-linecap="round"/>`;
const icon=(x,y,type)=>`<g transform="translate(${x} ${y})" fill="none" stroke="#8e812c" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">${type===0?'<circle cx="7" cy="5" r="3"/><path d="M1 17v-2a6 6 0 0 1 12 0v2m1-15a3 3 0 0 1 0 6m3 9v-3a5 5 0 0 0-2-4"/>':type===1?'<rect x="0" y="3" width="18" height="14" rx="2"/><path d="M0 7h18M3 12h5"/>':'<path d="M9 3C5 0 2 1 0 2v15c3-1 6-1 9 2 3-3 6-3 9-2V2c-2-1-5-2-9 1v16"/>'}</g>`;
const previews=[];
for(let index=1;index<=3;index++){
 const layers=[]; let svg=`<svg xmlns="http://www.w3.org/2000/svg" width="860" height="1120" viewBox="0 0 430 560"><rect width="430" height="560" fill="#f1f2f4"/>`;
 let rowY;
 if(index===1){
  svg+='<rect width="430" height="80" fill="#101010"/><path d="M0 106q0-26 26-26h378q26 0 26 26" fill="#f1f2f4"/><path d="M95 24v32" stroke="#ffffff30"/>'+bell(324,27,'#ececf0');
  layers.push(await asset('public/brand/gfb-logo.svg',20,16,64,44));
  layers.push(await text('Plataforma',107,25,12,'#f4f4f7',true),await text('de gestão',107,42,12,'#c2c2c9'));
  layers.push(await avatar(374,21));
  layers.push(await text('Quinta-feira, 22 de outubro',20,103,12,'#74767c'),await text('Boa tarde, Tailan.',20,132,28,'#101010',true),await asset('public/brand/gestao/greeting-sun.png',341,124,43));
  layers.push(await text('Aqui está uma visão geral da escola.',20,175,13,'#5c6067'));rowY=214;
 }else if(index===2){
  svg+='<rect width="430" height="111" fill="#fff"/><path d="M20 76h390M0 111h430" stroke="#e0e2e6"/>'+bell(324,26,'#32363c');
  layers.push(await asset('public/brand/gfb-logo-dark.svg',20,13,66,45),await avatar(374,19));
  layers.push(await text('Forró do Bom',100,22,16,'#101010',true),await text('Plataforma de gestão',100,45,11,'#666a72'));
  layers.push(await text('Visão geral',20,87,13,'#101010',true),await text('Quinta, 22 de outubro',262,88,11,'#72757c'));
  layers.push(await text('Boa tarde, Tailan.',20,135,28,'#101010',true),await asset('public/brand/gestao/greeting-sun.png',341,125,43),await text('Aqui está uma visão geral da escola.',20,178,13,'#5c6067'));rowY=214;
 }else{
  svg+='<rect width="430" height="218" fill="#101010"/><path d="M20 77h390" stroke="#ffffff1b"/><path d="M0 238q0-24 24-24h382q24 0 24 24" fill="#f1f2f4"/>'+bell(324,26,'#ececf0');
  layers.push(await asset('public/brand/gfb-logo.svg',20,15,64,44),await avatar(374,19));
  layers.push(await text('Plataforma de gestão',104,29,13,'#ededf2',true));
  layers.push(await text('Boa tarde,',20,98,25,'#f8f8fa'),await text('Tailan.',20,128,32,'#f6c300',true),await asset('public/brand/gestao/greeting-sun.png',326,102,64));
  layers.push(await text('Quinta-feira, 22 de outubro',20,180,12,'#c4c4cb'));rowY=236;
 }
 const rows=[['3 alunos precisam de acompanhamento','Duas ou mais faltas seguidas'],['2 cobranças em atraso','R$ 158,00 a conferir no financeiro'],['1 aula com conteúdo em rascunho','Revise os materiais antes de publicar']];
 for(let j=0;j<3;j++){
  const y=rowY+j*65;
  svg+=`<rect x="20" y="${y}" width="390" height="55" rx="12" fill="#faf9f3" stroke="#e4e2d8"/>`+icon(34,y+17,j)+arrow(381,y+28);
  layers.push(await text(rows[j][0],61,y+10,12,'#33362e',true),await text(rows[j][1],61,y+31,11,'#73756c'));
 }
 const my=rowY+211;
 svg+=`<rect x="20" y="${my}" width="190" height="126" rx="13" fill="#1e614b"/><rect x="220" y="${my}" width="190" height="126" rx="13" fill="#d7ae25"/>`;
 layers.push(await text('Alunos ativos',32,my+14,12,'#f7f5d9',true),await text('Turmas em movimento',232,my+14,12,'#332700'),await text('82',32,my+45,38,'#fff1bb',true),await text('5',232,my+45,38,'#332700',true));
 svg+='</svg>';
 const file=path.join(out,`opcao-${index}.png`);
 await sharp(Buffer.from(svg)).composite(layers).png().toFile(file);previews.push(file);
}
const labels=['1 · Barra compacta','2 · Cabeçalho claro','3 · Saudação integrada'];
const plates=[];
for(let i=0;i<3;i++){plates.push({input:await sharp(previews[i]).resize(430,560).png().toBuffer(),left:20+i*450,top:60});const l=await sharp({text:{text:`<span foreground="#eeeeef" weight="bold">${labels[i]}</span>`,font:`${font} 17`,fontfile,dpi:72,rgba:true}}).png().toBuffer();plates.push({input:l,left:20+i*450,top:23});}
await sharp({create:{width:1370,height:640,channels:4,background:'#242429'}}).composite(plates).png().toFile(path.join(out,'comparativo.png'));
fs.writeFileSync(path.join(out,'README.md'),'# Três estudos do topo mobile\n\nEstudos gráficos de composição, não capturas de navegador. Dimensão de referência: 430 px. Assets existentes: logo GFB, avatar, sol e fonte Makking. Paleta preservada.\n\n1. Barra escura compacta: identidade em duas linhas, utilidades à direita e saudação em área clara.\n2. Cabeçalho claro: nome e plataforma em destaque, contexto em segunda linha e saudação abaixo.\n3. Saudação integrada: marca, utilidades e boas-vindas no mesmo topo escuro, com área operacional clara abaixo.\n\nNenhum redesenho completo foi escolhido ou aplicado. A identificação Plataforma de gestão já foi adicionada ao topo existente. Tipografia e composição dependem de conferência no navegador quando houver acesso.\n');
console.log(previews.join('\n'));
