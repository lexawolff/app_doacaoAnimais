-- Criar a tabela de animais
create table public.animais (
  id uuid default gen_random_uuid() primary key,
  nome text not null,
  descricao text not null,
  local text not null,
  status text not null default 'Disponível',
  tipo text not null,
  imagem_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS (Row Level Security)
alter table public.animais enable row level security;

-- Criar política para permitir leitura pública
create policy "Permitir leitura pública de animais"
  on public.animais for select
  using (true);

-- Criar política para permitir inserção apenas para usuários autenticados
create policy "Permitir inserção de animais para usuários autenticados"
  on public.animais for insert
  with check (auth.role() = 'authenticated');

-- Criar política para permitir atualização apenas para usuários autenticados
create policy "Permitir atualização de animais para usuários autenticados"
  on public.animais for update
  using (auth.role() = 'authenticated');

-- Criar política para permitir deleção apenas para usuários autenticados
create policy "Permitir deleção de animais para usuários autenticados"
  on public.animais for delete
  using (auth.role() = 'authenticated'); 