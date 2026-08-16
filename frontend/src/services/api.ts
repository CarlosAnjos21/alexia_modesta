const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`);
  if (!res.ok) throw new Error(`Erro ao buscar ${path}: ${res.status}`);
  return res.json() as Promise<T>;
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Erro ao enviar para ${path}: ${res.status}`);
  return res.json() as Promise<T>;
}

export async function apiPostForm<T>(path: string, form: FormData): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { method: "POST", body: form });
  if (!res.ok) throw new Error(`Erro ao enviar para ${path}: ${res.status}`);
  return res.json() as Promise<T>;
}
