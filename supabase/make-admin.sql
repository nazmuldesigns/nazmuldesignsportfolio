-- Run this in Supabase SQL Editor after creating the user in Authentication.
-- Replace the email with the exact email used to log in.

insert into public.user_roles (user_id, role)
select id, 'admin'
from auth.users
where email = 'YOUR_ADMIN_EMAIL@example.com'
on conflict (user_id)
do update set role = 'admin';

-- Verify the role:
select u.email, r.role
from auth.users u
join public.user_roles r on r.user_id = u.id
where u.email = 'YOUR_ADMIN_EMAIL@example.com';
