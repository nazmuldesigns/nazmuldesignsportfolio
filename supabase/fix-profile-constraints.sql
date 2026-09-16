-- Run once in Supabase SQL Editor.
-- This fixes profile upserts and removes duplicate rows for the same auth user.

-- Keep the newest profile row for each user.
delete from public.profiles older
using public.profiles newer
where older.user_id = newer.user_id
  and older.created_at < newer.created_at;

-- Make user_id unique so future upserts can safely use onConflict('user_id').
create unique index if not exists profiles_user_id_unique
on public.profiles (user_id);

-- Ensure the authenticated owner can insert and update their profile.
drop policy if exists "Users can insert own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;

create policy "Users can insert own profile"
on public.profiles for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update own profile"
on public.profiles for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
