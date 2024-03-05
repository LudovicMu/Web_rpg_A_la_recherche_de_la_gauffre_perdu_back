-- Revert orpg:1.create_tables from pg

BEGIN;

DROP TABLE IF EXISTS 
"character_has_event",
"npc_has_quote",
"monster_has_quote",
"character",
"event",
"quote",
"npc",
"monster",
"class",
"weapon",
"armor", 
"user" CASCADE;

DROP TYPE IF EXISTS "enum_event", "enum_role" CASCADE;

DROP DOMAIN IF EXISTS "domain_nickname", "domain_mail" CASCADE;

COMMIT;
