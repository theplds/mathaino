
-- Μαθαίνω! Security release 0.6.68. No production child records are changed.
-- Authenticated family members may answer exercises; parent PIN gates profile
-- mutations and access to detailed answer history on the server.
create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

create table if not exists private.parent_unlocks(
  user_id uuid not null references auth.users(id) on delete cascade,
  session_id uuid not null,
  expires_at timestamptz not null,
  primary key(user_id,session_id)
);
alter table private.parent_unlocks enable row level security;
revoke all on private.parent_unlocks from public, anon, authenticated;

create or replace function private.parent_access_ok()
returns boolean
language sql stable security definer set search_path = ''
as $body$
  select (select auth.uid()) is not null
     and (select auth.jwt()->>'session_id') is not null
     and exists(
       select 1 from private.parent_unlocks u
       where u.user_id=(select auth.uid())
         and u.session_id=nullif((select auth.jwt()->>'session_id'),'')::uuid
         and u.expires_at>now()
     )
     and exists(
       select 1 from public.parent_pins p
       where p.user_id=(select auth.uid())
     )
     and exists(
       select 1 from auth.sessions s
       where s.user_id=(select auth.uid())
         and s.id=nullif((select auth.jwt()->>'session_id'),'')::uuid
     );
$body$;
revoke all on function private.parent_access_ok() from public, anon;
grant execute on function private.parent_access_ok() to authenticated;

create or replace function public.parent_pin_check(p_pin text)
returns boolean language plpgsql security definer set search_path = ''
as $body$
declare r public.parent_pins%rowtype;
        sid uuid;
begin
 if auth.uid() is null then return false; end if;
 sid:=nullif(auth.jwt()->>'session_id','')::uuid;
 if sid is null then return false; end if;
 select * into r from public.parent_pins where user_id=auth.uid() for update;
 if not found then return false; end if;
 if r.locked_until > now() then return false; end if;
 if r.pin_hash=extensions.crypt(p_pin,r.pin_hash) then
   update public.parent_pins set failures=0,locked_until=null where user_id=auth.uid();
   insert into private.parent_unlocks(user_id,session_id,expires_at)
   values(auth.uid(),sid,now()+interval '10 minutes')
   on conflict (user_id,session_id) do update set expires_at=excluded.expires_at;
   return true;
 end if;
 update public.parent_pins set
   failures=case when failures>=4 then 0 else failures+1 end,
   locked_until=case when failures>=4 then now()+interval '15 minutes' else null end
 where user_id=auth.uid();
 return false;
end;
$body$;

create or replace function public.parent_pin_set(p_pin text)
returns void language plpgsql security definer set search_path = ''
as $body$
declare sid uuid;
begin
 if auth.uid() is null then raise exception 'Sign in required'; end if;
 sid:=nullif(auth.jwt()->>'session_id','')::uuid;
 if sid is null then raise exception 'Valid session required'; end if;
 if p_pin !~ '^[0-9]{4}$' then raise exception 'PIN must be four digits'; end if;
 -- Initial setup is permitted once for the signed-in account, never overwrite.
 if exists(select 1 from public.parent_pins where user_id=auth.uid()) then
   raise exception 'PIN already configured';
 end if;
 insert into public.parent_pins(user_id,pin_hash)
 values(auth.uid(),extensions.crypt(p_pin,extensions.gen_salt('bf',10)));
 insert into private.parent_unlocks(user_id,session_id,expires_at)
 values(auth.uid(),sid,now()+interval '10 minutes')
 on conflict(user_id,session_id) do update set expires_at=excluded.expires_at;
end;
$body$;

create or replace function public.parent_pin_revoke()
returns void language plpgsql security definer set search_path = ''
as $body$
begin
 if auth.uid() is not null and nullif(auth.jwt()->>'session_id','') is not null then
   delete from private.parent_unlocks
   where user_id=auth.uid()
     and session_id=nullif(auth.jwt()->>'session_id','')::uuid;
 end if;
end;
$body$;

revoke all on function public.parent_pin_check(text) from public, anon;
revoke all on function public.parent_pin_set(text) from public, anon;
revoke all on function public.parent_pin_revoke() from public, anon;
grant execute on function public.parent_pin_check(text) to authenticated;
grant execute on function public.parent_pin_set(text) to authenticated;
grant execute on function public.parent_pin_revoke() to authenticated;

drop policy if exists children_insert on public.children;
create policy children_insert on public.children for insert to authenticated
with check (
 (select private.parent_access_ok()) and exists(
 select 1 from public.family_members m
 where m.family_id=children.family_id
   and m.user_id=(select auth.uid()))
);

drop policy if exists children_update on public.children;
create policy children_update on public.children for update to authenticated
using (
 (select private.parent_access_ok()) and exists(
 select 1 from public.family_members m
 where m.family_id=children.family_id
   and m.user_id=(select auth.uid()))
)
with check (
 (select private.parent_access_ok()) and exists(
 select 1 from public.family_members m
 where m.family_id=children.family_id
   and m.user_id=(select auth.uid()))
);

drop policy if exists children_delete on public.children;
create policy children_delete on public.children for delete to authenticated
using (
 (select private.parent_access_ok()) and exists(
 select 1 from public.family_members m
 where m.family_id=children.family_id
   and m.user_id=(select auth.uid()))
);

drop policy if exists answer_events_read on public.answer_events;
create policy answer_events_read on public.answer_events for select to authenticated
using (
 (select private.parent_access_ok()) and exists(
 select 1 from public.children c
 join public.family_members m on m.family_id=c.family_id
 where c.id=answer_events.child_id and m.user_id=(select auth.uid()))
);
