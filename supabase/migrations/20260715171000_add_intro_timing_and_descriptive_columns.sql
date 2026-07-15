drop view if exists public.analysis_responses;

alter table public.participants
  add column introduction_reading_time_ms integer,
  add column introduction_completed_at timestamptz,
  add constraint participants_introduction_time_range
    check (
      introduction_reading_time_ms is null
      or introduction_reading_time_ms between 0 and 86400000
    );

alter table public.vignette_responses
  rename column iv2 to directedness;
alter table public.vignette_responses
  rename column iv2_jitter_v to directedness_jitter_v;
alter table public.vignette_responses
  rename column iv3 to data_access;
alter table public.vignette_responses
  rename column iv3_jitter_v to data_access_jitter_v;
alter table public.vignette_responses
  rename column iv4 to visibility;
alter table public.vignette_responses
  rename column iv4_jitter_v to visibility_jitter_v;
alter table public.vignette_responses
  rename column q3 to q3_future_input_seeking;
alter table public.vignette_responses
  rename column q4 to q4_future_reliance;
alter table public.vignette_responses
  rename column q5 to q5_positive_relationship;

create view public.analysis_responses
with (security_invoker = true)
as
select
  r.pid as "Participant ID",
  p.assignment_slot as "Counterbalance Assignment Slot",
  p.introduction_reading_time_ms as "Introduction Reading Time (ms)",
  r.vignette_number as "Vignette Position",
  r.vignette_id as "Vignette ID",
  r.task_type as "Task Type",
  r.task_type_jitter_v as "Task Type Jitter Version",
  r.directedness as "Directedness",
  r.directedness_jitter_v as "Directedness Jitter Version",
  r.data_access as "Data Access",
  r.data_access_jitter_v as "Data Access Jitter Version",
  r.visibility as "Visibility",
  r.visibility_jitter_v as "Visibility Jitter Version",
  r.full_vignette_text as "Full Vignette Text",
  r.q1_seek_input as "Q1 - Seek Sam's Input",
  r.q2_incorporate as "Q2 - Incorporate Sam's Input",
  r.q3_future_input_seeking as "Q3 - Future Input Seeking",
  r.q4_future_reliance as "Q4 - Future Reliance on Sam",
  r.q5_positive_relationship as "Q5 - Positive Working Relationship",
  r.time_spent_ms as "Vignette Reading and Response Time (ms)",
  r.submitted_at as "Vignette Submitted At"
from public.vignette_responses r
join public.participants p on p.pid = r.pid
order by r.pid, r.vignette_number;

revoke all on table public.analysis_responses from anon, authenticated;
grant select on table public.analysis_responses to service_role;
