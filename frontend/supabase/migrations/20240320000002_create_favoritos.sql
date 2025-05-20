-- Criar a tabela de favoritos
create table public.favoritos (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  animal_id uuid references public.animais(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, animal_id)
);

-- Habilitar RLS (Row Level Security)
alter table public.favoritos enable row level security;

-- Criar política para permitir leitura apenas para o próprio usuário
create policy "Permitir leitura de favoritos para o próprio usuário"
  on public.favoritos for select
  using (auth.uid() = user_id);

-- Criar política para permitir inserção apenas para usuários autenticados
create policy "Permitir inserção de favoritos para usuários autenticados"
  on public.favoritos for insert
  with check (auth.uid() = user_id);

-- Criar política para permitir deleção apenas para o próprio usuário
create policy "Permitir deleção de favoritos para o próprio usuário"
  on public.favoritos for delete
  using (auth.uid() = user_id); 