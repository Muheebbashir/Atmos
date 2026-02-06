import sql from "../lib/db.js";

/**
 * Migration: Add isPremium column to songs and albums tables
 * This allows marking songs and albums as premium content
 */

async function runMigration() {
  try {
    console.log("🚀 Starting migration: Adding isPremium columns...");

    await sql`
      ALTER TABLE songs 
      ADD COLUMN IF NOT EXISTS isPremium BOOLEAN DEFAULT FALSE
    `;
    console.log("✅ Added isPremium column to songs table");

    await sql`
      ALTER TABLE albums 
      ADD COLUMN IF NOT EXISTS isPremium BOOLEAN DEFAULT FALSE
    `;
    console.log("✅ Added isPremium column to albums table");

    console.log("🎉 Migration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

runMigration();
