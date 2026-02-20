import 'dotenv/config';
import prisma from '../lib/prisma';
import { MOCK_RECIPES } from '../data/mock/recipes';

async function main() {
    console.log('Seeding recipes...');

    for (const recipe of MOCK_RECIPES) {
        // Parse rcpSno as BigInt for Prisma if necessary (schema uses BigInt for rcpSno usually)
        // Let's check schema.prisma first to be sure about types.

        await prisma.recipe.upsert({
            where: { rcpSno: BigInt(recipe.rcpSno) },
            update: {
                rcpTtl: recipe.rcpTtl,
                ckgNm: recipe.ckgNm,
                rgtrId: recipe.rgtrId,
                rgtrNm: recipe.rgtrNm,
                inqCnt: recipe.inqCnt,
                rcmmCnt: recipe.rcmmCnt,
                srapCnt: recipe.srapCnt,
                ckgMthActoNm: recipe.ckgMthActoNm,
                ckgStaActoNm: recipe.ckgStaActoNm,
                ckgMtrlActoNm: recipe.ckgMtrlActoNm,
                ckgKndActoNm: recipe.ckgKndActoNm,
                ckgIpdc: recipe.ckgIpdc,
                ckgMtrlCn: recipe.ckgMtrlCn,
                ckgInbunNm: recipe.ckgInbunNm,
                ckgDodfNm: recipe.ckgDodfNm,
                ckgTimeNm: recipe.ckgTimeNm,
                rcpImgUrl: recipe.rcpImgUrl,
            },
            create: {
                rcpSno: BigInt(recipe.rcpSno),
                rcpTtl: recipe.rcpTtl,
                ckgNm: recipe.ckgNm,
                rgtrId: recipe.rgtrId,
                rgtrNm: recipe.rgtrNm,
                inqCnt: recipe.inqCnt,
                rcmmCnt: recipe.rcmmCnt,
                srapCnt: recipe.srapCnt,
                ckgMthActoNm: recipe.ckgMthActoNm,
                ckgStaActoNm: recipe.ckgStaActoNm,
                ckgMtrlActoNm: recipe.ckgMtrlActoNm,
                ckgKndActoNm: recipe.ckgKndActoNm,
                ckgIpdc: recipe.ckgIpdc,
                ckgMtrlCn: recipe.ckgMtrlCn,
                ckgInbunNm: recipe.ckgInbunNm,
                ckgDodfNm: recipe.ckgDodfNm,
                ckgTimeNm: recipe.ckgTimeNm,
                rcpImgUrl: recipe.rcpImgUrl,
            },
        });
    }

    console.log(`Seeded ${MOCK_RECIPES.length} recipes.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
