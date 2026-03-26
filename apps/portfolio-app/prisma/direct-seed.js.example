const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function main() {
  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
  console.log("Connecting to Supabase via PG driver...");
  
  const client = new Client({
    connectionString: connectionString,
  });

  try {
    await client.connect();
    console.log("✅ Connected!");

    const guidePath = path.join(__dirname, '../../ALL OCR OCR extracted images for Life Insurance AZ 2026/ULTIMATE_AZ_2026_STUDY_GUIDE.md');
    const content = fs.readFileSync(guidePath, 'utf-8');

    // Split by horizontal rules
    const qBlocks = content.split('---').filter(b => b.includes('## ❓ Q'));
    console.log(`Found ${qBlocks.length} question blocks. Parsing...`);

    let count = 0;
    for (const block of qBlocks) {
      // Robust Parsing without multiline literal regex
      const lines = block.split('\n');
      
      let qText = "";
      const options = [];
      let answer = "";
      let explanation = "";
      
      let inExplanation = false;

      for (let line of lines) {
        line = line.trim();
        if (line.startsWith('## ❓ Q')) {
          qText = line.split(':').slice(1).join(':').trim();
        } else if (line.startsWith('- ✅ [x]')) {
          const opt = line.replace('- ✅ [x]', '').replace(/\*\*/g, '').trim();
          options.push(opt);
          answer = opt;
        } else if (line.startsWith('- [ ]')) {
          options.push(line.replace('- [ ]', '').trim());
        } else if (line.startsWith('-     [ ]')) {
          options.push(line.replace('-     [ ]', '').trim());
        } else if (line.startsWith('> 💡 **Explanation:**')) {
          explanation = line.replace('> 💡 **Explanation:**', '').trim();
          inExplanation = true;
        } else if (inExplanation && line.startsWith('>')) {
          explanation += " " + line.replace('>', '').trim();
        }
      }

      if (!qText || options.length === 0) continue;

      // Insert using raw SQL
      const query = `
        INSERT INTO "Question" (text, options, answer, explanation, category)
        VALUES ($1, $2, $3, $4, $5)
      `;
      const values = [qText, options, answer, explanation.trim(), 'General'];

      await client.query(query, values);
      count++;
      if (count % 50 === 0) console.log(`Uploaded ${count} questions...`);
    }

    console.log(`\n🎉 SUCCESS! Uploaded ${count} questions to your Supabase database.`);
  } catch (err) {
    console.error("❌ Seeding failed!");
    console.error(err);
  } finally {
    await client.end();
  }
}

main();
