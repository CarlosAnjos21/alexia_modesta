export function fmtPreco(v: number): string {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
