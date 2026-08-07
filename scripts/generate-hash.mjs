import bcrypt from "bcryptjs";

const password = process.argv[2];
if (!password) {
  console.error("Usage: node scripts/generate-hash.mjs <votre_mot_de_passe>");
  process.exit(1);
}

const hash = await bcrypt.hash(password, 12);
console.log("\nAjoutez cette ligne dans votre .env.local :\n");
console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);
