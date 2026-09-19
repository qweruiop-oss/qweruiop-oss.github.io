create table public.test_drive_history (
  id uuid primary key default gen_random_uuid(),
  model text not null,
  store text not null,
  date date not null,
  time text not null,
  name text not null,
  phone text not null,
  created_at timestamptz not null default now()
);

alter table public.test_drive_history enable row level security;

create policy "Anyone can submit a test drive request"
on public.test_drive_history
for insert
to anon, authenticated
with check (true);

-- 管理员读取需要登录 Supabase Auth 后再开启此策略。
-- 不要把 service_role key 放到 GitHub Pages 前端。
create policy "Authenticated admins can read requests"
on public.test_drive_history
for select
to authenticated
using (true);
