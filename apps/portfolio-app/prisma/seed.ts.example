import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import "dotenv/config";

// In Prisma 7, with the new config system, the client picks up the 
// connection strings from the environment variables automatically 
// if they match the names used in prisma.config.ts (DATABASE_URL/DIRECT_URL).
// Initializing with an empty constructor should work now that we've pushed the schema.
const prisma = new PrismaClient();

async function main() {
  const guidePath = path.join(__dirname, '../../ALL OCR OCR extracted images for Life Insurance AZ 2026/ULTIMATE_AZ_2026_STUDY_GUIDE.md');
  const content = fs.readFileSync(guidePath, 'utf-8');

  const qBlocks = content.split('---').filter(b => b.trim().length > 0);

  console.log(`Found ${qBlocks.length} potential question blocks. Parsing...`);

  let count = 0;
  for (const block of qBlocks) {
    const qMatch = block.match(/## ❓ Q\d+: ([\s\S]*?)\n/);
    if (!qMatch) continue;

    const qText = qMatch[1].trim();
    const optionsRaw = block.match(/- (?:✅ \[x\]|    \[ \]) (.*)/g);
    if (!optionsRaw) continue;

    const options = optionsRaw.map(o => o.replace(/- (?:✅ \[x\]|    \[ \]) /, '').trim());
    const ansMatch = block.match(/- ✅ \[x\] \*\*(.*?)\*\*/);
    const answer = ansMatch ? ansMatch[1].trim() : options[0];

    const explMatch = block.match(/> 💡 \*\*Explanation:\*\* ([\s\S]*)$/);
    const explanation = explMatch ? explMatch[1].trim() : null;

    try {
        await prisma.question.create({
            data: {
              text: qText,
              options,
              answer,
              explanation,
              category: 'General',
            }
          });
          count++;
          if (count % 50 === 0) console.log(`Uploaded ${count} questions...`);
    } catch (err) {
        console.error(`Error uploading question ${count + 1}:`, err);
    }
  }

  console.log(`Successfully uploaded ${count} questions to Supabase! 🎉`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
