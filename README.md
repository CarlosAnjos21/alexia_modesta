# Alexia Modesta

E-commerce fullstack de moda feminina evangélica — vitrine de produtos com variantes (cor/tamanho/estoque), carrinho persistente e checkout finalizado via WhatsApp, sem gateway de pagamento.

Monorepo com **frontend React + TypeScript** (arquitetura MVC) e **backend Express + PostgreSQL**, com fallback automático para catálogo mockado caso a API esteja offline.

---

## Sumário

- [Arquitetura](#arquitetura)
- [Stack técnica](#stack-técnica)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Modelo de dados](#modelo-de-dados)
- [API — endpoints](#api--endpoints)
- [Fluxo de checkout via WhatsApp](#fluxo-de-checkout-via-whatsapp)
- [Como rodar localmente](#como-rodar-localmente)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Decisões de design](#decisões-de-design)
- [Roadmap](#roadmap)

---

## Arquitetura

```
┌──────────────────────┐        HTTP/JSON        ┌───────────────────────┐
│      Frontend         │ ───────────────────────▶ │       Backend          │
│  React 19 + Vite 8    │ ◀─────────────────────── │  Express 4 + node:pg  │
│  (porta 5173)         │                          │  (porta 4000)          │
└──────────────────────┘                          └───────────┬───────────┘
        │  fallback local se a API falhar                       │
        ▼                                                        ▼
  DEFAULT_PRODUTOS/                                        PostgreSQL
  DEFAULT_CATEGORIES                                  (products, product_variants,
  (CatalogContext)                                          categories)
```

O frontend nunca fica "quebrado": o `CatalogContext` tenta buscar categorias e produtos da API e, em caso de erro de rede, recai silenciosamente em um catálogo padrão embutido no código — útil tanto para demonstração offline quanto para resiliência em produção.

## Stack técnica

**Frontend**

- React 19 + TypeScript, bundling com Vite 8
- React Router 7 (SPA com rotas para home, categoria e admin)
- Tailwind CSS 4 (via `@tailwindcss/vite`), com paleta de marca (`champagne`, `rose`, `bronze`, `charcoal`) e tipografia serifada (Cormorant Garamond) + sans (Plus Jakarta Sans)
- lucide-react / react-icons para iconografia
- ESLint 10 + typescript-eslint, oxlint como linter complementar

**Backend**

- Node.js com ES Modules, Express 4
- PostgreSQL via `pg` (Pool + client transacional)
- Multer para upload de imagens de produto (disco local, filtro de mimetype, limite de 5 MB)
- CORS liberado, tratamento de erro centralizado em middleware

**Sem framework de estado global** (Redux/Zustand): todo o estado é resolvido com Context API + hooks customizados, o que é coerente para o tamanho do domínio (catálogo + carrinho).

## Estrutura do projeto

```
alexia_modesta/
├── backend/
│   └── src/
│       ├── controllers/     # regras de request/response (thin controllers)
│       ├── models/          # acesso a dados (queries SQL cruas via pg)
│       ├── routes/          # definição de endpoints Express
│       ├── middleware/      # upload.js (multer)
│       ├── db/              # pool.js, schema.sql, seed.js
│       ├── app.js           # composição do Express app
│       └── index.js         # bootstrap (dotenv + listen)
│
└── frontend/
    └── src/
        ├── models/          # tipos de domínio (Product, Category, CartItem)
        ├── controllers/     # Context Providers + hooks (regra de negócio)
        ├── views/           # componentes de apresentação reutilizáveis
        ├── pages/           # componentes de rota (Home, Category, Admin)
        └── services/        # cliente HTTP (api.ts)
```

O frontend segue **MVC adaptado a React**:

- **Model** → interfaces em `models/` (`Product`, `Category`, `CartItem`), sem lógica.
- **Controller** → `controllers/`, onde vive o estado e as regras: `CatalogContext` (busca/fallback de catálogo), `CartContext` + `useCart` (carrinho persistido em `localStorage`), `useProductFilter` (busca/filtro por categoria e termo), `useCreateProduct` (submissão do formulário admin), `useScrollReveal` (IntersectionObserver para animações de entrada).
- **View** → `views/` e `pages/`, componentes "burros" que consomem os contexts via hooks (`useCatalogContext`, `useCartContext`) e não fazem fetch diretamente.

O backend segue **MVC clássico**: `routes` → `controllers` (validação e shape de request/response) → `models` (SQL). Nenhum ORM: queries parametrizadas escritas à mão, com transações explícitas (`BEGIN`/`COMMIT`/`ROLLBACK`) para operações multi-tabela.

## Modelo de dados

```sql
categories (id TEXT PK, label TEXT)

products (
  id SERIAL PK,
  categoria TEXT REFERENCES categories(id) ON DELETE RESTRICT,
  nome TEXT, preco NUMERIC(10,2), descricao TEXT,
  img TEXT, criado_em TIMESTAMPTZ DEFAULT now()
)

product_variants (
  id SERIAL PK,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  cor TEXT, tamanho TEXT, estoque INTEGER DEFAULT 0
)
```

Pontos relevantes:

- `ON DELETE RESTRICT` em `products.categoria` impede apagar uma categoria com produtos vinculados; `ON DELETE CASCADE` em `product_variants` remove variantes junto do produto.
- Índices em `products.categoria` e `product_variants.product_id` para as queries de listagem/filtro mais frequentes.
- A leitura de produtos agrega variantes com `json_agg` + `json_build_object`, retornando o array `variantes` já no formato consumido pelo frontend — evita N+1 queries.
- A criação de produto é transacional: insere o produto, insere cada variante em loop e só faz `COMMIT` se tudo suceder; qualquer falha dispara `ROLLBACK`.

## API — endpoints

| Método | Rota                | Descrição                                                                                     |
| ------ | ------------------- | --------------------------------------------------------------------------------------------- |
| GET    | `/api/categorias`   | Lista todas as categorias                                                                     |
| POST   | `/api/categorias`   | Cria categoria (`{ id, label }`)                                                              |
| GET    | `/api/produtos`     | Lista produtos; aceita `?categoria=` e `?q=` (busca por nome/descrição)                       |
| GET    | `/api/produtos/:id` | Detalhe de um produto com suas variantes                                                      |
| POST   | `/api/produtos`     | Cria produto (`multipart/form-data`: campos + `imagem` + `variantes` como JSON stringificado) |

Uploads de imagem ficam em `backend/uploads/` e são servidos estaticamente em `/uploads/:arquivo`.

## Fluxo de checkout via WhatsApp

Não há gateway de pagamento integrado. O carrinho (`CartDrawer`) monta a mensagem de pedido no cliente — itens, cor, tamanho, forma de pagamento e valor total — e redireciona para `https://wa.me/<numero>?text=...`, abrindo a conversa já preenchida no WhatsApp da loja.

Regras de precificação aplicadas antes de gerar a mensagem:

- **PIX**: desconto de 5% quando o total do carrinho é ≥ R$ 200.
- **Cartão parcelado em 3x ou mais**: acréscimo de 5% sobre o total.

O carrinho em si é persistido em `localStorage` (`useCart`), sobrevivendo a reloads da página.

## Como rodar localmente

Pré-requisitos: Node.js 18+, PostgreSQL rodando localmente (ou acessível via `DATABASE_URL`).

```bash
# 1. instalar dependências de frontend e backend
npm run install:all

# 2. configurar variáveis de ambiente
cp backend/.env.example backend/.env
cp .env.example frontend/.env      # VITE_API_URL e VITE_WHATSAPP_NUMBER

# 3. criar schema e popular dados de exemplo
npm --prefix backend run db:migrate
npm --prefix backend run db:seed

# 4. subir os dois serviços (em terminais separados)
npm run dev:backend     # http://localhost:4000
npm run dev:frontend    # http://localhost:5173
```

Sem backend rodando, o frontend ainda funciona normalmente com o catálogo de fallback embutido — útil para desenvolver a UI isoladamente.

## Variáveis de ambiente

**`backend/.env`**

```
DATABASE_URL=postgresql://usuario:senha@localhost:5432/alexia_modesta
PORT=4000
```

**`frontend/.env`**

```
VITE_API_URL=http://localhost:4000
VITE_WHATSAPP_NUMBER=5585999999999   # formato internacional, somente números
```

## Decisões de design

- **Sem ORM no backend**: queries SQL diretas via `pg` para manter controle total sobre as agregações (`json_agg`) e transações — trade-off consciente de menos abstração por mais previsibilidade em um domínio pequeno.
- **Fallback de catálogo no frontend**: garante que a vitrine nunca fique vazia/quebrada mesmo com API fora do ar, e permite demonstrar o projeto sem infraestrutura de banco.
- **Checkout via WhatsApp em vez de gateway de pagamento**: reduz custo e complexidade de compliance para um catálogo de nicho, mantendo o atendimento humano no fechamento da venda.
- **MVC em ambas as pontas**: separação de camadas (dados / regra de negócio / apresentação) tanto no Express quanto no React, facilitando a leitura do código e futura extração de serviços.

## Roadmap

- [ ] Autenticação para a área administrativa (`/admin` hoje é uma rota pública)
- [ ] Edição e remoção de produtos existentes (hoje só há criação)
- [ ] Testes automatizados (unitários nos hooks/controllers e de integração na API)
- [ ] Paginação na listagem de produtos
