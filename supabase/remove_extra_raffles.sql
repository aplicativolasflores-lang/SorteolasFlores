-- Permanently remove the retired sample raffles and the confirmed extra raffle.
-- Related participants, answers, prizes, questions, and winners are deleted by cascade.
begin;

delete from public.sorteos
where id in ('s1', 's2')
   or lower(trim(nombre)) = 'celebremos lo nuestro'
returning id, nombre, slug;

commit;