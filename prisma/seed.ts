import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const services = [
  { slug: "ub-registration", title: "UB Online Registration", category: "University", description: "Undergraduate and postgraduate registration support.", priceXaf: 0 },
  { slug: "clearances-attestations", title: "Clearances & Attestations", category: "University", description: "Clearances, school attendance, results and completion of studies.", priceXaf: 0 },
  { slug: "urgent-transcript", title: "Urgent Transcript", category: "University", description: "Guidance and follow-up for time-sensitive transcript requests.", priceXaf: 0 },
  { slug: "result-confirmation", title: "Result Confirmation", category: "Documents", description: "Assistance with official confirmation of academic results.", priceXaf: 0 },
  { slug: "wes-overseas-mailing", title: "WES & Overseas Mailing", category: "Documents", description: "WES verification assistance and mailing documents abroad.", priceXaf: 0 },
  { slug: "certificate-collection", title: "Certificate Collection", category: "Documents", description: "Support with certificate collection from UB or GCE Board.", priceXaf: 0 },
  { slug: "id-passport-assistance", title: "ID & Passport Assistance", category: "Identity", description: "Guidance for national identity cards and biometric passports.", priceXaf: 0 },
  { slug: "certification-errands", title: "Certification & Errands", category: "Other", description: "Document certification, nationality procedures and school errands.", priceXaf: 0 }
];

async function main() {
  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: { title: service.title, description: service.description, category: service.category },
      create: service
    });
  }
  console.log("Seeded service catalog. Set actual service prices from the admin/database before enabling checkout.");
}

main().finally(async () => prisma.$disconnect());
