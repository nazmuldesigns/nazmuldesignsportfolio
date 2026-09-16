-- Replace the email below with the exact email used in the login form.
-- This uses the auth user's real UUID, so it avoids assigning the role to the wrong user.

insert into public.user_roles (user_id, role)
select id, 'admin'
from auth.users
where lower(trim(email)) = lower(trim('YOUR_ADMIN_EMAIL@example.com'))
on conflict (user_id)
do update set role = 'admin';

-- Verify that the UUID and role match:
select
  u.id as auth_user_id,
  u.email,
  r.user_id as role_user_id,
  lower(trim(r.role)) as role
from auth.users u
left join public.user_roles r on r.user_id = u.id
where lower(trim(u.email)) = lower(trim('YOUR_ADMIN_EMAIL@example.com'));

-- Fix the existing policy explicitly for authenticated users.
drop policy if exists "Users can view own role" on public.user_roles;
create policy "Users can view own role"
on public.user_roles
for select
to authenticated
using (auth.uid() = user_id);
