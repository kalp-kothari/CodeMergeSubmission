import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Create/update Event
  const event = await prisma.event.upsert({
    where: { slug: 'codemerge-v2' },
    update: {},
    create: {
      name: 'CodeMerge V2.0',
      slug: 'codemerge-v2',
      description: 'CodeMerge V2.0 — Inter-college hackathon',
    },
  });
  console.log(`✅ Event: ${event.name} (${event.id})`);

  // 2. Create/update Round
  const round = await prisma.round.upsert({
    where: {
      eventId_slug: {
        eventId: event.id,
        slug: 'ppt-round-1',
      },
    },
    update: {},
    create: {
      eventId: event.id,
      name: 'PPT Round 1',
      slug: 'ppt-round-1',
      submissionOpen: new Date('2026-09-01T00:00:00.000Z'),
      // 06 September 2026, 09:00 PM IST = 06 September 2026, 15:30 UTC
      submissionDeadline: new Date('2026-09-06T15:30:00.000Z'),
      allowedFileTypes: ['pdf', 'pptx'],
      maxFileSize: 10 * 1024 * 1024, // 10 MB
      domains: [
        'Web Development',
        'Artificial Intelligence / Machine Learning',
        'Cybersecurity',
        'Blockchain',
        'Other',
      ],
    },
  });
  console.log(`✅ Round: ${round.name} (${round.id})`);

  // 3. Seed teams — replace with actual team list
  const teamNames = [
  "Square Algorithm",
  "Novice Squad",
  "TASIE",
  "UpJar",
  "Codedex",
  "4 Bit",
  "Brain bytes",
  "ctrl Z squad",
  "Byte me",
  "ZERO RESPONSE TIME",
  "Fantastic four",
  "Tech Titans",
  "Team Ektara",
  "Flux",
  "Super Kings",
  "Syntax Samurai",
  "Bionic",
  "PowerBank",
  "Sentinels",
  "Hack-Forge",
  "Royals",
  "ANTIMATTER",
  "CodingOG's",
  "TEAM X",
  "Code nexus",
  "Krypta-X",
  "AquaSentinels",
  "NAST SQUAD",
  "BlankSpace",
  "TEAM CYBER BROS",
  "Error 404",
  "Code Chaos",
  "FinalCommit",
  "Innovexa",
  "Nova",
  "Team Compact",
  "CODE RED",
  "Cat in the Box",
  "BS Cube",
  "404 Reboot",
  "Hackends",
  "Coder Dumplings",
  "Commit happens",
  "Bytestorm",
  "Los Blancos",
  "Assemblers",
  "COSMOS",
  "Noobs",
  "TechTubbies",
  "NeuroNova",
  "TEAM RUDRA",
  "LogicForge",
  "The Last Braincell",
  "ZYPHER SECURITY",
  "Alpha Coders",
  "Vishal and Co",
  "Vibe",
  "Barbie Girls",
  "AMPV Team",
  "InnovateX",
  "Rookie Coders",
  "Mavericks",
  "NexByte",
  "CODE BUSTER'S",
  "Elevate.exe",
  "Karikku",
  "Future Forge",
  "Hawk Coders",
  "Panthers",
  "SUSTAINX",
  "SRK Codes",
  "Team 404",
  "Team biteforce",
  "Test Dummy",
];

  for (const teamName of teamNames) {
    const team = await prisma.team.upsert({
      where: {
        eventId_teamName: {
          eventId: event.id,
          teamName,
        },
      },
      update: {},
      create: {
        eventId: event.id,
        teamName,
        isEligible: true,
      },
    });
    console.log(`  ✅ Team: ${team.teamName}`);
  }

  console.log(`\n🎉 Seeding complete!`);
  console.log(`   Event: ${event.name}`);
  console.log(`   Round: ${round.name}`);
  console.log(`   Teams: ${teamNames.length}`);
  console.log(`   Deadline: 06 September 2026, 09:00 PM IST`);
  console.log(`\n📝 To add/modify teams, edit this file and run: npm run db:seed`);
  console.log(`📝 Create admin user in Supabase Auth Dashboard.`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
