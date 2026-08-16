export interface Variant {
  id?: number;
  cor: string;
  tamanho: string;
  estoque: number;
}

export interface Product {
  id: number;
  categoria: string;
  nome: string;
  preco: number;
  desc?: string;
  descricao?: string;
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
  champanhe: "#E5D3B3",
  rosé: "#D9A0A0",
  nude: "#E3C8B4",
  "off-white": "#F5F2EC",
};
