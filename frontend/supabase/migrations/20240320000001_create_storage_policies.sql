-- Habilitar RLS no storage
alter table storage.objects enable row level security;

-- Criar bucket se não existir
insert into storage.buckets (id, name, public)
values ('fotos', 'fotos', true)
on conflict (id) do nothing;

-- Política para permitir leitura pública de arquivos
create policy "Permitir leitura pública de arquivos"
on storage.objects for select
using ( bucket_id = 'fotos' );

-- Política para permitir upload de arquivos por usuários autenticados
create policy "Permitir upload de arquivos por usuários autenticados"
on storage.objects for insert
with check (
  bucket_id = 'fotos'
  and auth.role() = 'authenticated'
);

-- Política para permitir atualização de arquivos por usuários autenticados
create policy "Permitir atualização de arquivos por usuários autenticados"
on storage.objects for update
using (
  bucket_id = 'fotos'
  and auth.role() = 'authenticated'
);

-- Política para permitir deleção de arquivos por usuários autenticados
create policy "Permitir deleção de arquivos por usuários autenticados"
on storage.objects for delete
using (
  bucket_id = 'fotos'
  and auth.role() = 'authenticated'
); 