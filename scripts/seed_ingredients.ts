
import prisma from '../lib/prisma';

async function main() {
    console.log('Starting ingredient normalization...');

    // 1. Get all unique ingredient names from RecipeIngredient
    // Note: We use raw query or findMany distinct because RecipeIngredient might have duplicates across recipes
    const ingredients = await prisma.recipeIngredient.findMany({
        select: { ingName: true },
        distinct: ['ingName'],
    });

    console.log(`Found ${ingredients.length} unique ingredients in recipes.`);

    // 2. Insert into IngredientRef
    let createdCount = 0;
    for (const ing of ingredients) {
        const name = ing.ingName.trim();
        if (!name) continue;

        // Try to create, skip if exists
        try {
            await prisma.ingredientRef.upsert({
                where: { name },
                update: {},
                create: { name }
            });
            createdCount++;
        } catch (e) {
            console.warn(`Skipping duplicate or error for ${name}:`, e);
        }
    }
    console.log(`Ensured ${createdCount} IngredientRef entries.`);

    // 3. Update RecipeIngredient foreign keys
    console.log('Updating RecipeIngredient links...');
    // Fetch all refs for mapping
    const refs = await prisma.ingredientRef.findMany();
    const refMap = new Map(refs.map(r => [r.name, r.id]));

    // We can't do a bulk update easily with different IDs, so we might need raw query or loop.
    // Raw query is faster for bulk updates if logic is simple:
    // UPDATE "RecipeIngredient" ri SET "ingredient_ref_id" = ir.id FROM "ingredient_refs" ir WHERE ri.ing_name = ir.name;

    const updateCount = await prisma.$executeRaw`
    UPDATE "RecipeIngredient" 
    SET "ingredient_ref_id" = ir.id 
    FROM "ingredient_refs" ir 
    WHERE "RecipeIngredient".ing_name = ir.name
  `;
    console.log(`Updated ${updateCount} RecipeIngredient rows.`);

    // 4. Update GroceryItem foreign keys
    console.log('Updating GroceryItem links...');
    const groceryUpdateCount = await prisma.$executeRaw`
    UPDATE "GroceryItem" 
    SET "ingredient_ref_id" = ir.id 
    FROM "ingredient_refs" ir 
    WHERE "GroceryItem".name = ir.name
  `;
    console.log(`Updated ${groceryUpdateCount} GroceryItem rows.`);

    console.log('Done!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
