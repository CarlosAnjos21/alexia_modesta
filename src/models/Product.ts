import vestidoPollyLarissa from "../assets/imagesProducts/PollyLarissa.png";

export interface Variant {
  cor: string;
  tamanho: string;
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
  bege: "#d8c3a5",
  marrom: "#5c4030",
  caramelo: "#9c6b3e",
  verde: "#1f8a6f",
  amarelo: "#d9b84a",
  azul: "#3e63a6",
  rosa: "#d98ba0",
  terracota: "#b5622e",
};

function makeProduct(
  id: number,
  categoria: string,
  nome: string,
  preco: number,
  img: string,
  variantes: [string, string, number][],
  desc: string,
): Product {
  return {
    id,
    categoria,
    nome,
    preco,
    desc,
    img,
    variantes: variantes.map(([cor, tamanho, estoque]) => ({
      cor,
      tamanho,
      estoque,
    })),
  };
}

export const PRODUTOS: Product[] = [
  makeProduct(
    1,
    "vestidos",
    "Vestido Mídi Polly Larissa",
    219.9,
    vestidoPollyLarissa,
    [
      ["verde", "38/42", 5],
      ["amarelo", "38/42", 3],
      ["marrom", "38/42", 4],
    ],
    "Tecido super fluido, caimento leve e fechamento em zíper.",
  ),
  makeProduct(
    2,
    "vestidos",
    "Vestido Alfaiataria Premium",
    249.9,
    "vestalfaiataria",
    [
      ["azul", "38/42", 4],
      ["caramelo", "38/42", 3],
      ["amarelo", "38/42", 2],
    ],
    "Cumprimento mídi, tecido encorpado e caimento estruturado.",
  ),
  makeProduct(
    3,
    "vestidos",
    "Vestido Chemise Botões",
    199.9,
    "vestchemise",
    [["rosa", "38/42", 6]],
    "Modelagem chemise com botões frontais e cinto de amarrar.",
  ),
  makeProduct(
    4,
    "saias",
    "Saia Alfaiataria Premium",
    139.9,
    "saiaalfaiataria",
    [
      ["preto", "M", 4],
      ["preto", "G", 3],
    ],
    "Corte reto em alfaiataria premium, cós alto.",
  ),
  makeProduct(
    5,
    "saias",
    "Saia de Cetim",
    129.9,
    "saiacetim",
    [
      ["bege", "M", 3],
      ["bege", "G", 2],
    ],
    "Caimento fluido em cetim, comprimento midi.",
  ),
  makeProduct(
    6,
    "saias",
    "Saia Mídi Evasê Alfaiataria Premium",
    159.9,
    "saiaevase",
    [
      ["bege", "M", 3],
      ["bege", "G", 3],
      ["verde", "M", 2],
      ["verde", "G", 1],
      ["marrom", "M", 2],
      ["marrom", "G", 2],
      ["azul", "M", 1],
      ["azul", "G", 1],
    ],
    "Modelagem evasê com pregas frontais e cós estruturado com botões dourados.",
  ),
  makeProduct(
    7,
    "saias",
    "Saia Alfaiataria Importada",
    169.9,
    "saiaimportada",
    [
      ["bege", "M", 2],
      ["bege", "G", 2],
    ],
    "Tecido importado de alfaiataria com caimento estruturado.",
  ),
  makeProduct(
    8,
    "blusas",
    "Blusa Poliamida Forrada",
    89.9,
    "blusapoliamida",
    [["azul", "Único", 8]],
    "Frente toda forrada, tecido leve.",
  ),
  makeProduct(
    9,
    "blusas",
    "Blusa Assimétrica",
    84.9,
    "blusaassimetrica",
    [["preto", "Único", 6]],
    "Corte assimétrico com barra em detalhe rendado.",
  ),
  makeProduct(
    10,
    "blusas",
    "Blusa de Crepe",
    94.9,
    "blusacrepe",
    [["terracota", "Único", 5]],
    "Tecido crepe leve com gola em recorte discreto.",
  ),
];
