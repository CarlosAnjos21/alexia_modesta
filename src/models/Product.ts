export interface Variant {
  cor: string;
  estoque: number;
}

export interface Product {
  id: number;
  categoria: string;
  nome: string;
  preco: number;
  desc: string;
  img: string;
  variantes: Variant[];
}

export const COLORS: Record<string, string> = {
  preto: "#1c1c1c",
  branco: "#f4f4f2",
  azul: "#3e63dd",
  vermelho: "#c94a3d",
  verde: "#3f7d57",
};

function makeProduct(
  id: number,
  categoria: string,
  nome: string,
  preco: number,
  seed: string,
  cores: [string, number][],
  desc: string,
): Product {
  return {
    id,
    categoria,
    nome,
    preco,
    desc,
    img: `https://picsum.photos/seed/${seed}/640/640`,
    variantes: cores.map(([cor, estoque]) => ({ cor, estoque })),
  };
}

export const PRODUTOS: Product[] = [
  makeProduct(
    1,
    "tenis",
    "Runner Aero 2",
    429.9,
    "aero2",
    [
      ["preto", 8],
      ["branco", 3],
      ["azul", 0],
    ],
    "Tênis leve para corrida com entressola responsiva e cabedal em malha respirável.",
  ),
  makeProduct(
    2,
    "tenis",
    "Trail Force X",
    519.9,
    "trailx",
    [
      ["preto", 5],
      ["verde", 6],
    ],
    "Solado com garras profundas para trilhas técnicas e proteção contra impacto.",
  ),
  makeProduct(
    3,
    "tenis",
    "Urban Slip",
    289.0,
    "urbslip",
    [
      ["branco", 12],
      ["preto", 9],
    ],
    "Modelo sem cadarço, fácil de calçar, para o dia a dia na cidade.",
  ),
  makeProduct(
    4,
    "vestuario",
    "Jaqueta Corta-Vento",
    249.9,
    "jaqueta",
    [
      ["preto", 4],
      ["azul", 2],
    ],
    "Impermeável leve, dobra no bolso interno, ideal para viagens.",
  ),
  makeProduct(
    5,
    "vestuario",
    "Camiseta Essential",
    79.9,
    "camiseta",
    [
      ["branco", 20],
      ["preto", 15],
      ["vermelho", 7],
    ],
    "Algodão pima, corte reto, gramatura média para uso diário.",
  ),
  makeProduct(
    6,
    "vestuario",
    "Calça Jogger Tech",
    189.9,
    "jogger",
    [
      ["preto", 10],
      ["verde", 0],
    ],
    "Tecido com leve elasticidade e bolsos com zíper para o trajeto.",
  ),
  makeProduct(
    7,
    "eletronicos",
    "Fone Bluetooth Nimbus",
    349.0,
    "fone",
    [
      ["preto", 14],
      ["branco", 6],
    ],
    "Cancelamento de ruído ativo e 30h de bateria com estojo.",
  ),
  makeProduct(
    8,
    "eletronicos",
    "Smartwatch Pulse",
    599.0,
    "watch",
    [
      ["preto", 3],
      ["azul", 1],
    ],
    "Monitor cardíaco, GPS integrado e tela AMOLED de alto brilho.",
  ),
  makeProduct(
    9,
    "eletronicos",
    "Caixa de Som Orbit",
    219.9,
    "caixa",
    [
      ["preto", 9],
      ["vermelho", 4],
    ],
    "Som 360°, resistente à água (IPX6) e 12h de autonomia.",
  ),
  makeProduct(
    10,
    "casa",
    "Luminária Arco",
    159.9,
    "luminaria",
    [
      ["preto", 6],
      ["branco", 6],
    ],
    "Estrutura em metal com haste ajustável e luz quente regulável.",
  ),
  makeProduct(
    11,
    "casa",
    "Jogo de Panelas Cerâmica",
    389.0,
    "panelas",
    [["branco", 5]],
    "Revestimento cerâmico antiaderente, sem PTFE, 5 peças.",
  ),
  makeProduct(
    12,
    "casa",
    "Tapete Nordic",
    229.0,
    "tapete",
    [
      ["branco", 3],
      ["azul", 2],
    ],
    "Fibra macia de baixo pelo, antiderrapante, 1,50 x 2,00m.",
  ),
  makeProduct(
    13,
    "beleza",
    "Sérum Vitamina C",
    99.9,
    "serum",
    [["branco", 18]],
    "Fórmula antioxidante para uniformizar o tom da pele.",
  ),
  makeProduct(
    14,
    "beleza",
    "Kit Escova Modeladora",
    179.9,
    "escova",
    [
      ["preto", 7],
      ["vermelho", 2],
    ],
    "Cerâmica com íons negativos, reduz o frizz em uma passada.",
  ),
  makeProduct(
    15,
    "livros",
    "Cartas para um Jovem Dev",
    54.9,
    "livro1",
    [["branco", 25]],
    "Reflexões práticas sobre carreira, código e paciência.",
  ),
  makeProduct(
    16,
    "livros",
    "Atlas de Arquitetura de Software",
    89.9,
    "livro2",
    [["preto", 11]],
    "Panorama ilustrado de padrões e decisões arquiteturais.",
  ),
];
