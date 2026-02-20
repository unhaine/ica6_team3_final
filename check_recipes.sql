SELECT count(*) as recipes_with_ingredients FROM "Recipe" WHERE "ckg_mtrl_cn" IS NOT NULL;
SELECT rcp_ttl, ckg_mtrl_cn FROM "Recipe" LIMIT 5;
