-- Deploy orpg:2.functions to pg
BEGIN;

-- Fonctions relatives à l’utilisateur
CREATE FUNCTION add_user(u json) RETURNS "user" AS $$
	INSERT INTO "user"
	(nickname,password,mail,firstname,lastname,birthdate)
	VALUES
	(
		u->>'nickname',
		u->>'password',
		u->>'mail',
		u->>'firstname',
		u->>'lastname',
		(u->>'birthdate')::date
        -- role by default is 'member'
	)
	RETURNING *;
$$ LANGUAGE sql SECURITY DEFINER;

-- Vérification de l'utilisateur et de ses droits
CREATE OR REPLACE FUNCTION verify_user(json) RETURNS json AS $$
DECLARE
	-- plpgsql permet de déclarer des variables
	user_found json;
BEGIN
	SELECT json_build_object(
		'id',id,
		'nickname',nickname,
		'mail',mail,
		'firstname',firstname,
		'lastname',lastname,
		'birthdate',birthdate,
		'password',password,
		'role',role -- là on vérifie le rôle
	) INTO user_found -- INTO user_found permet d'insérer le résultat du SELECT dans la variable
	FROM "user"
	WHERE nickname = $1->>'nickname';
	
	IF user_found IS NOT NULL
	THEN
		-- je retourne la variable
		return user_found;
	ELSE
		return null;
	END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour récupérer aléatoirement un événement combat ou rencontre, avec plus de chance d'avoir un combat
CREATE OR REPLACE FUNCTION get_random_monster() RETURNS SETOF "monster" AS $$
DECLARE
    random_number NUMERIC := RANDOM();
BEGIN
    IF random_number < 0.6 THEN
        -- Monstre commun aléatoire
        RETURN QUERY SELECT * FROM "monster" WHERE coin_min = 0 ORDER BY RANDOM() LIMIT 1;
    ELSIF random_number < 0.9 THEN
        -- Monstre rare aléatoire
        RETURN QUERY SELECT * FROM "monster" WHERE coin_min = 5 ORDER BY RANDOM() LIMIT 1;
    ELSE
        -- Monstre épique aléatoire
        RETURN QUERY SELECT * FROM "monster" WHERE coin_min = 10 ORDER BY RANDOM() LIMIT 1;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour récupérer une réplique de monstre aléatoirement
CREATE OR REPLACE FUNCTION get_replica_of_monster() RETURNS SETOF "quote" AS $$
    SELECT * 
    FROM "quote"
    WHERE id = (
        SELECT "quote_id"
        FROM "monster_has_quote"
        ORDER BY random()
        LIMIT 1
    );
$$ LANGUAGE sql SECURITY DEFINER;

-- Fonction pour récupérer un personnage non joueur aléatoirement
CREATE FUNCTION get_random_npc() RETURNS SETOF "npc" AS $$
    SELECT *
    FROM "npc"
    ORDER BY random()
    LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

-- Fonction pour récupérer la réplique du personnage non joueur 
CREATE OR REPLACE FUNCTION get_replica_of_npc(int) RETURNS "quote" AS $$
    SELECT * 
    FROM "quote"
    WHERE id = (
        SELECT "quote_id"
        FROM "npc_has_quote"
        WHERE quote_id = $1
    );
$$ LANGUAGE sql SECURITY DEFINER;


-- VOIR SI ON AJOUTE : 
-- Fonction pour récupérer une réplique aléatoire d'un personnage non joueur (qui serait non personnalisé). 

-- Fonction pour ajouter/créer un nouveau personnage
CREATE FUNCTION add_character(u json) RETURNS "character" AS $$
	INSERT INTO "character"
	(nickname, purse, moral, strength, dexterity, intelligence, user_id, class_id, weapon_id, armor_id, intro_is_played)
	VALUES
	(
        u->>'nickname',
		(u->>'purse')::int,
		(u->>'moral')::int,
		(u->>'strength')::int,
		(u->>'dexterity')::int,
		(u->>'intelligence')::int,
        (u->>'user_id')::int,
        (u->>'class_id')::int,
        (u->>'weapon_id')::int,
        (u->>'armor_id')::int,
        (u->>'intro_is_played')::boolean
	)
	RETURNING *;
$$ LANGUAGE sql SECURITY DEFINER;

CREATE FUNCTION update_character(u json) RETURNS "character" AS $$
    UPDATE "character" SET 
        nickname = u->>'nickname',
        purse = (u->>'purse')::int,
        moral = (u->>'moral')::int,
        strength = (u->>'strength')::int,
        dexterity = (u->>'dexterity')::int,
        intelligence = (u->>'intelligence')::int,
        weapon_id = (u->>'weapon_id')::int,
        armor_id = (u->>'armor_id')::int
    WHERE
        id = (u->>'id')::int
    RETURNING *;
$$ LANGUAGE sql SECURITY DEFINER;

-- Vérification de l'utilisateur et de ses droits
CREATE FUNCTION update_user(u json) RETURNS "user" AS $$
    UPDATE "user" SET
		nickname = u->>'nickname',
		password = u->>'password',
		mail = u->>'mail',
		firstname = u->>'firstname',
		lastname = u->>'lastname',
		birthdate = (u->>'birthdate')::date
        -- role by default is 'member'
	WHERE 
        id = (u->>'id')::int
    RETURNING *;
$$ LANGUAGE sql SECURITY DEFINER;

-- Fonction pour ajouter une nouvelle class (pas utilisé dans le mvp)
CREATE FUNCTION add_class_by_id(class_id int) RETURNS "character" AS $$
	INSERT INTO "character" (class_id)
	VALUES($1)
	RETURNING *;
$$ LANGUAGE sql SECURITY DEFINER; 

-- Fonction pour modifier, mettre à jour un monstre
CREATE FUNCTION update_monster(u json) RETURNS "monster" AS $$
    UPDATE "monster" SET 
        label = u->>'label',
        description = u->>'description',
        life_point = (u->>'life_point')::int,
        physical_damage = (u->>'physical_damage')::int,
        magical_damage = (u->>'magical_damage')::int,
        escape = (u->>'escape')::int
    RETURNING *;
$$ LANGUAGE sql SECURITY DEFINER;

-- Fonction pour récupérer aléatoirement un événement combat ou rencontre, avec plus de chance d'avoir un combat
CREATE OR REPLACE FUNCTION get_random_event() RETURNS SETOF "event" AS $$
DECLARE
    random_number NUMERIC := RANDOM();
BEGIN
    IF random_number <= 1 THEN
        -- Utiliser le type "battle" pour les résultats de la table "monster"
        RETURN QUERY SELECT * FROM "event" WHERE type = 'battle' ORDER BY RANDOM() LIMIT 1;
    ELSE
        -- Utiliser le type "encounter" pour les résultats de la table "npc"
        RETURN QUERY SELECT * FROM "event" WHERE type = 'encounter' ORDER BY RANDOM() LIMIT 1;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour récupérer aléatoirement une arme
CREATE OR REPLACE FUNCTION get_random_weapon(character_class_id INT) RETURNS SETOF "weapon" AS $$
    SELECT w.*
    FROM "weapon" w
    JOIN "character" c ON c.class_id = w.type 
    WHERE c.class_id = character_class_id
    ORDER BY RANDOM()
    LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

-- Fonction pour récupérer aléatoirement une armure
CREATE OR REPLACE FUNCTION get_random_armor(character_class_id INT) RETURNS SETOF "armor" AS $$
    SELECT a.*
    FROM "armor" a
    JOIN "character" c ON c.class_id = a.type
    WHERE c.class_id = character_class_id
    ORDER BY RANDOM()
    LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

COMMIT;

