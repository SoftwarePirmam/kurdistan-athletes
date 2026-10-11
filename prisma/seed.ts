import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

type SeedBlock = {
  page: string;
  key: string;
  label: string;
  type?: string;
  value: string;
  sortOrder: number;
};

const blocks: SeedBlock[] = [
  // Home
  { page: "home", key: "hero_eyebrow", label: "Hero eyebrow", value: "BUILT FOR THE ATHLETES OF KURDISTAN", sortOrder: 10 },
  { page: "home", key: "hero_title", label: "Hero title", value: "YOUR TALENT.\nYOUR FUTURE.", sortOrder: 20 },
  { page: "home", key: "hero_text", label: "Hero text", value: "A platform created to support, connect, and inspire athletes across Kurdistan.", sortOrder: 30 },
  { page: "home", key: "hero_primary_label", label: "Hero primary button", value: "Explore Opportunities", sortOrder: 40 },
  { page: "home", key: "hero_primary_href", label: "Hero primary link", value: "/opportunities", sortOrder: 41 },
  { page: "home", key: "hero_secondary_label", label: "Hero secondary button", value: "Learn More", sortOrder: 50 },
  { page: "home", key: "hero_secondary_href", label: "Hero secondary link", value: "/about", sortOrder: 51 },
  { page: "home", key: "story_label", label: "Story label", value: "01 — THE IDEA", sortOrder: 60 },
  { page: "home", key: "story_title", label: "Story title", value: "A place for athletes\njust getting started.", sortOrder: 70 },
  { page: "home", key: "story_p1", label: "Story paragraph 1", value: "Every athlete starts somewhere. A school field, a local club, a first competition, or the moment someone decides to try.", sortOrder: 80 },
  { page: "home", key: "story_p2", label: "Story paragraph 2", value: "Kurdistan Athletes exists so young people can find encouragement, discover what is possible, and keep moving forward.", sortOrder: 90 },
  { page: "home", key: "paths_label", label: "Paths label", value: "02 — WHERE TO GO NEXT", sortOrder: 100 },
  { page: "home", key: "mission_label", label: "Mission label", value: "03 — WHY IT MATTERS", sortOrder: 110 },
  { page: "home", key: "mission_title", label: "Mission title", value: "Talent deserves\nan opportunity.", sortOrder: 120 },
  { page: "home", key: "mission_p1", label: "Mission paragraph 1", value: "Sport can teach young people how to lead, communicate, work with others, and believe in themselves.", sortOrder: 130 },
  { page: "home", key: "mission_p2", label: "Mission paragraph 2", value: "We want that chance to be visible — and we want the people around an athlete to know they can be part of it.", sortOrder: 140 },
  { page: "home", key: "closing_eyebrow", label: "Closing eyebrow", value: "THIS IS JUST THE BEGINNING", sortOrder: 150 },
  { page: "home", key: "closing_title", label: "Closing title", value: "Your dream deserves\na chance.", sortOrder: 160 },
  { page: "home", key: "closing_text", label: "Closing text", value: "Whether you're an athlete, coach, supporter, or someone discovering a passion for sport, there is a place for you here.", sortOrder: 170 },

  // About
  { page: "about", key: "hero_eyebrow", label: "Hero eyebrow", value: "ABOUT KURDISTAN ATHLETES", sortOrder: 10 },
  { page: "about", key: "hero_title", label: "Hero title", value: "DREAM BIG.\nGO FURTHER.", sortOrder: 20 },
  { page: "about", key: "hero_text", label: "Hero text", value: "Kurdistan Athletes is a youth-focused platform created to inspire young people to discover their potential, invest in sport, and believe that their dreams are worth chasing.", sortOrder: 30 },
  { page: "about", key: "story_label", label: "Story label", value: "01 — OUR STORY", sortOrder: 40 },
  { page: "about", key: "story_title", label: "Story title", value: "A place where\nyoung dreams matter.", sortOrder: 50 },
  { page: "about", key: "story_p1", label: "Story paragraph 1", value: "Every athlete starts somewhere. It could be a school field, a local club, a first competition, or simply the moment someone decides to try.", sortOrder: 60 },
  { page: "about", key: "story_p2", label: "Story paragraph 2", value: "Kurdistan Athletes was created to help young people take that first step and keep moving forward.", sortOrder: 70 },
  { page: "about", key: "story_p3", label: "Story paragraph 3", value: "We want to create a community where young athletes can discover opportunities, find encouragement, learn from others, and feel supported throughout their journey.", sortOrder: 80 },
  { page: "about", key: "mission_label", label: "Mission label", value: "02 — OUR MISSION", sortOrder: 90 },
  { page: "about", key: "mission_title", label: "Mission title", value: "Talent deserves\nan opportunity.", sortOrder: 100 },
  { page: "about", key: "mission_p1", label: "Mission paragraph 1", value: "Our mission is to encourage the youth of Kurdistan to invest in themselves through sport.", sortOrder: 110 },
  { page: "about", key: "mission_p2", label: "Mission paragraph 2", value: "We want to help young people build confidence, discipline, teamwork, resilience, and the courage to pursue goals that may once have felt impossible.", sortOrder: 120 },
  { page: "about", key: "why_label", label: "Why label", value: "03 — WHY SPORT MATTERS", sortOrder: 130 },
  { page: "about", key: "why_title", label: "Why title", value: "Sport is more than\na game.", sortOrder: 140 },
  { page: "about", key: "why_text", label: "Why text", value: "It can teach young people how to lead, communicate, overcome challenges, work with others, and believe in themselves.", sortOrder: 150 },
  { page: "about", key: "value_1_title", label: "Value 1 title", value: "Confidence", sortOrder: 160 },
  { page: "about", key: "value_1_text", label: "Value 1 text", value: "Helping young people trust themselves and recognize what they are capable of.", sortOrder: 161 },
  { page: "about", key: "value_2_title", label: "Value 2 title", value: "Discipline", sortOrder: 170 },
  { page: "about", key: "value_2_text", label: "Value 2 text", value: "Encouraging consistency, commitment, and the determination to keep improving.", sortOrder: 171 },
  { page: "about", key: "value_3_title", label: "Value 3 title", value: "Community", sortOrder: 180 },
  { page: "about", key: "value_3_text", label: "Value 3 text", value: "Creating connections between athletes, coaches, supporters, and opportunities.", sortOrder: 181 },
  { page: "about", key: "value_4_title", label: "Value 4 title", value: "Inspiration", sortOrder: 190 },
  { page: "about", key: "value_4_text", label: "Value 4 text", value: "Inspiring a generation to dream bigger and create their own path forward.", sortOrder: 191 },
  { page: "about", key: "founder_label", label: "Founder label", value: "04 — MEET OUR FOUNDER", sortOrder: 200 },
  { page: "about", key: "founder_title", label: "Founder title", value: "The person behind\nthe vision.", sortOrder: 210 },
  {
    page: "about",
    key: "founder_p1",
    label: "Founder paragraph 1",
    value:
      "Growing up as an athlete, I know what it feels like to chase your dreams without enough support, guidance, or opportunities. That's why I created Kurdistan Athletes, a platform built to connect athletes with coaches, sponsors, and opportunities to grow.",
    sortOrder: 220,
  },
  {
    page: "about",
    key: "founder_p2",
    label: "Founder paragraph 2",
    value:
      "My goal is to make sure no athlete has to chase their dreams alone, and every talented athlete in Kurdistan gets a chance to be seen, supported, and succeed.",
    sortOrder: 230,
  },
  { page: "about", key: "founder_image", label: "Founder image path", type: "image", value: "/images/founder.jpg", sortOrder: 240 },
  { page: "about", key: "closing_eyebrow", label: "Closing eyebrow", value: "THIS IS JUST THE BEGINNING", sortOrder: 250 },
  { page: "about", key: "closing_title", label: "Closing title", value: "Your dream deserves\na chance.", sortOrder: 260 },
  { page: "about", key: "closing_text", label: "Closing text", value: "Whether you're an athlete, coach, supporter, or someone discovering your passion for sport, there is a place for you here.", sortOrder: 270 },

  // Opportunities
  { page: "opportunities", key: "hero_eyebrow", label: "Hero eyebrow", value: "YOUR NEXT STEP STARTS HERE", sortOrder: 10 },
  { page: "opportunities", key: "hero_title", label: "Hero title", value: "TURN YOUR\nPOTENTIAL INTO POSSIBILITY.", sortOrder: 20 },
  { page: "opportunities", key: "hero_text", label: "Hero text", value: "Discover opportunities designed to help young athletes learn, grow, gain experience, and take meaningful steps toward their goals.", sortOrder: 30 },
  { page: "opportunities", key: "intro_label", label: "Intro label", value: "01 — WHAT YOU CAN DISCOVER", sortOrder: 40 },
  { page: "opportunities", key: "intro_title", label: "Intro title", value: "More than a\ncertificate.", sortOrder: 50 },
  { page: "opportunities", key: "intro_text", label: "Intro text", value: "We want opportunities to mean more than simply collecting achievements. They should help athletes build confidence, develop useful skills, meet people, and create experiences they can carry into their future.", sortOrder: 60 },
  { page: "opportunities", key: "list_label", label: "List label", value: "02 — OPPORTUNITIES", sortOrder: 70 },
  { page: "opportunities", key: "card_1_tag", label: "Card 1 tag", value: "RECOGNITION", sortOrder: 80 },
  { page: "opportunities", key: "card_1_title", label: "Card 1 title", value: "Certificates & Recognition", sortOrder: 81 },
  { page: "opportunities", key: "card_1_text", label: "Card 1 text", value: "Take part in selected activities, programs, workshops, or community initiatives and receive certificates recognizing your participation and effort.", sortOrder: 82 },
  { page: "opportunities", key: "card_2_tag", label: "Card 2 tag", value: "EXPERIENCE", sortOrder: 90 },
  { page: "opportunities", key: "card_2_title", label: "Card 2 title", value: "Events & Challenges", sortOrder: 91 },
  { page: "opportunities", key: "card_2_text", label: "Card 2 text", value: "Get involved in athletic events, challenges, and activities designed to encourage teamwork, determination, and personal growth.", sortOrder: 92 },
  { page: "opportunities", key: "card_3_tag", label: "Card 3 tag", value: "LEARNING", sortOrder: 100 },
  { page: "opportunities", key: "card_3_title", label: "Card 3 title", value: "Workshops & Learning", sortOrder: 101 },
  { page: "opportunities", key: "card_3_text", label: "Card 3 text", value: "Discover sessions and educational activities that can help young athletes understand training, teamwork, leadership, and life beyond competition.", sortOrder: 102 },
  { page: "opportunities", key: "card_4_tag", label: "Card 4 tag", value: "CONNECTION", sortOrder: 110 },
  { page: "opportunities", key: "card_4_title", label: "Card 4 title", value: "Meet Coaches & Athletes", sortOrder: 111 },
  { page: "opportunities", key: "card_4_text", label: "Card 4 text", value: "Build connections with people who understand the athletic journey and discover communities where you can learn and grow.", sortOrder: 112 },
  { page: "opportunities", key: "card_5_tag", label: "Card 5 tag", value: "EXPOSURE", sortOrder: 120 },
  { page: "opportunities", key: "card_5_title", label: "Card 5 title", value: "Show Your Potential", sortOrder: 121 },
  { page: "opportunities", key: "card_5_text", label: "Card 5 text", value: "Take part in activities that give young athletes opportunities to demonstrate their skills, commitment, and passion.", sortOrder: 122 },
  { page: "opportunities", key: "card_6_tag", label: "Card 6 tag", value: "COMMUNITY", sortOrder: 130 },
  { page: "opportunities", key: "card_6_title", label: "Card 6 title", value: "Give Back & Inspire", sortOrder: 131 },
  { page: "opportunities", key: "card_6_text", label: "Card 6 text", value: "Help create a stronger sports community by supporting other young people and becoming part of something bigger than yourself.", sortOrder: 132 },
  { page: "opportunities", key: "steps_label", label: "Steps label", value: "03 — HOW IT WORKS", sortOrder: 140 },
  { page: "opportunities", key: "steps_title", label: "Steps title", value: "Start small.\nGo further.", sortOrder: 150 },
  { page: "opportunities", key: "step_1_title", label: "Step 1 title", value: "Join", sortOrder: 160 },
  { page: "opportunities", key: "step_1_text", label: "Step 1 text", value: "Become part of the Kurdistan Athletes community and tell us what you're passionate about.", sortOrder: 161 },
  { page: "opportunities", key: "step_2_title", label: "Step 2 title", value: "Participate", sortOrder: 170 },
  { page: "opportunities", key: "step_2_text", label: "Step 2 text", value: "Discover activities, events, learning opportunities, and ways to get involved.", sortOrder: 171 },
  { page: "opportunities", key: "step_3_title", label: "Step 3 title", value: "Grow", sortOrder: 180 },
  { page: "opportunities", key: "step_3_text", label: "Step 3 text", value: "Gain experience, build skills, make connections, and keep developing as an athlete and as a person.", sortOrder: 181 },
  { page: "opportunities", key: "step_4_title", label: "Step 4 title", value: "Inspire", sortOrder: 190 },
  { page: "opportunities", key: "step_4_text", label: "Step 4 text", value: "Use your journey to encourage another young person to believe they can do it too.", sortOrder: 191 },
  { page: "opportunities", key: "closing_eyebrow", label: "Closing eyebrow", value: "YOUR JOURNEY IS YOURS", sortOrder: 200 },
  { page: "opportunities", key: "closing_title", label: "Closing title", value: "Don't wait for\npermission to dream.", sortOrder: 210 },
  { page: "opportunities", key: "closing_text", label: "Closing text", value: "Your next opportunity could start with one decision: choosing to take the first step.", sortOrder: 220 },

  // Support
  { page: "support", key: "hero_eyebrow", label: "Hero eyebrow", value: "SUPPORT OUR MISSION", sortOrder: 10 },
  { page: "support", key: "hero_title", label: "Hero title", value: "STAND BESIDE\nSOMEONE STARTING OUT.", sortOrder: 20 },
  { page: "support", key: "hero_text", label: "Hero text", value: "Kurdistan Athletes grows when people who believe in young athletes decide to encourage them, open a door, or simply take their ambition seriously.", sortOrder: 30 },
  { page: "support", key: "steps_label", label: "Steps label", value: "01 — HOW YOU CAN HELP", sortOrder: 40 },
  { page: "support", key: "steps_title", label: "Steps title", value: "Support is a\ndecision to show up.", sortOrder: 50 },
  { page: "support", key: "step_1_title", label: "Step 1 title", value: "Encourage", sortOrder: 60 },
  { page: "support", key: "step_1_text", label: "Step 1 text", value: "Share the platform with a young athlete who needs a reason to take the first step.", sortOrder: 61 },
  { page: "support", key: "step_2_title", label: "Step 2 title", value: "Mentor", sortOrder: 70 },
  { page: "support", key: "step_2_text", label: "Step 2 text", value: "Offer time, advice, or a coaching connection to someone building a habit.", sortOrder: 71 },
  { page: "support", key: "step_3_title", label: "Step 3 title", value: "Partner", sortOrder: 80 },
  { page: "support", key: "step_3_text", label: "Step 3 text", value: "If you represent a club, school, or organization, help create a real opportunity.", sortOrder: 81 },
  { page: "support", key: "step_4_title", label: "Step 4 title", value: "Introduce", sortOrder: 90 },
  { page: "support", key: "step_4_text", label: "Step 4 text", value: "Connect us with people who can teach, host, or stand with young athletes.", sortOrder: 91 },
  { page: "support", key: "form_label", label: "Form label", value: "02 — TELL US HOW", sortOrder: 100 },
  { page: "support", key: "form_title", label: "Form title", value: "Ready to\nhelp?", sortOrder: 110 },
  { page: "support", key: "form_text", label: "Form text", value: "Create an account and message us in Contact. Tell us who you are and the kind of support you can offer.", sortOrder: 120 },

  // Ways we help
  { page: "ways", key: "hero_eyebrow", label: "Hero eyebrow", value: "HOW WE SHOW UP", sortOrder: 10 },
  { page: "ways", key: "hero_title", label: "Hero title", value: "HELP THAT MEETS YOU\nWHERE YOU ARE.", sortOrder: 20 },
  { page: "ways", key: "hero_text", label: "Hero text", value: "Helping athletes in Kurdistan grow, connect, and reach their goals starts with practical support — not a promise that someone else will do the work.", sortOrder: 30 },
  { page: "ways", key: "intro_label", label: "Intro label", value: "01 — THE POINT", sortOrder: 40 },
  { page: "ways", key: "intro_title", label: "Intro title", value: "A next step,\nnot a shortcut.", sortOrder: 50 },
  { page: "ways", key: "intro_text", label: "Intro text", value: "We connect young athletes with people, learning, and encouragement. Progress still belongs to the athlete. Our role is to make the path easier to see.", sortOrder: 60 },
  { page: "ways", key: "list_label", label: "List label", value: "02 — HOW WE HELP ATHLETES", sortOrder: 70 },
  { page: "ways", key: "card_1_tag", label: "Card 1 tag", value: "SPONSORSHIP", sortOrder: 80 },
  { page: "ways", key: "card_1_title", label: "Card 1 title", value: "Sponsorship Support", sortOrder: 81 },
  { page: "ways", key: "card_1_text", label: "Card 1 text", value: "We help athletes find sponsorship opportunities and connect with organizations that can support their journey.", sortOrder: 82 },
  { page: "ways", key: "card_2_tag", label: "Card 2 tag", value: "TRAINING", sortOrder: 90 },
  { page: "ways", key: "card_2_title", label: "Card 2 title", value: "Coaching & Training", sortOrder: 91 },
  { page: "ways", key: "card_2_text", label: "Card 2 text", value: "We help athletes discover coaches, training opportunities, and resources that can help them improve.", sortOrder: 92 },
  { page: "ways", key: "card_3_tag", label: "Card 3 tag", value: "CONNECTION", sortOrder: 100 },
  { page: "ways", key: "card_3_title", label: "Card 3 title", value: "Athlete Connections", sortOrder: 101 },
  { page: "ways", key: "card_3_text", label: "Card 3 text", value: "We connect athletes with other athletes, organizations, coaches, and people who can help them move forward.", sortOrder: 102 },
  { page: "ways", key: "card_4_tag", label: "Card 4 tag", value: "GUIDANCE", sortOrder: 110 },
  { page: "ways", key: "card_4_title", label: "Card 4 title", value: "Athlete Support", sortOrder: 111 },
  { page: "ways", key: "card_4_text", label: "Card 4 text", value: "We want athletes to have a place where they can find guidance, encouragement, and support.", sortOrder: 112 },
  { page: "ways", key: "closing_eyebrow", label: "Closing eyebrow", value: "BE PART OF IT", sortOrder: 120 },
  { page: "ways", key: "closing_title", label: "Closing title", value: "Want to be part of\nKurdistan Athletes?", sortOrder: 130 },
  { page: "ways", key: "closing_text", label: "Closing text", value: "Join our community and take the next step in your athletic journey.", sortOrder: 140 },

  // Events
  { page: "events", key: "hero_eyebrow", label: "Hero eyebrow", value: "WHAT'S COMING UP", sortOrder: 10 },
  { page: "events", key: "hero_title", label: "Hero title", value: "UPCOMING\nEVENTS.", sortOrder: 20 },
  { page: "events", key: "hero_text", label: "Hero text", value: "Training days, challenges, workshops, and community gatherings for athletes across Kurdistan.", sortOrder: 30 },
  { page: "events", key: "list_label", label: "List label", value: "01 — UPCOMING", sortOrder: 40 },
  { page: "events", key: "empty_text", label: "Empty state text", value: "No upcoming events are listed yet. Check back soon, or join the community to hear about the next one first.", sortOrder: 50 },
  { page: "events", key: "past_label", label: "Past events label", value: "02 — RECENT", sortOrder: 60 },

  // Contact / site
  { page: "contact", key: "hero_eyebrow", label: "Hero eyebrow", value: "WE WOULD LIKE TO HEAR FROM YOU", sortOrder: 10 },
  { page: "contact", key: "hero_title", label: "Hero title", value: "GET IN\nTOUCH.", sortOrder: 20 },
  { page: "contact", key: "hero_text", label: "Hero text", value: "Create an account to message us. Once you are registered, you can chat with the Kurdistan Athletes team and we will reply here.", sortOrder: 30 },
  { page: "contact", key: "info_title", label: "Info title", value: "Contact Kurdistan Athletes", sortOrder: 40 },
  { page: "contact", key: "info_text", label: "Info text", value: "Whether you're an athlete looking for support, an organization interested in helping, or simply want to reach out, register and start a conversation.", sortOrder: 50 },
  { page: "contact", key: "email", label: "Public email", value: "info@kurdistanathletes.com", sortOrder: 60 },
  { page: "contact", key: "location", label: "Location", value: "Kurdistan Region", sortOrder: 70 },

  // Site-wide
  { page: "site", key: "brand_name", label: "Brand name", value: "KURDISTAN ATHLETES", sortOrder: 10 },
  { page: "site", key: "footer_tagline", label: "Footer tagline", value: "Inspiring the youth. Supporting athletes. Building possibilities.", sortOrder: 20 },
  { page: "site", key: "footer_copyright", label: "Footer copyright", value: "© 2026 Kurdistan Athletes. All rights reserved.", sortOrder: 30 },
];

async function main() {
  for (const block of blocks) {
    await prisma.contentBlock.upsert({
      where: { page_key: { page: block.page, key: block.key } },
      update: {
        label: block.label,
        type: block.type ?? "text",
        value: block.value,
        sortOrder: block.sortOrder,
      },
      create: {
        page: block.page,
        key: block.key,
        label: block.label,
        type: block.type ?? "text",
        value: block.value,
        sortOrder: block.sortOrder,
      },
    });
  }

  await prisma.setting.upsert({
    where: { key: "site_email" },
    update: { value: "info@kurdistanathletes.com" },
    create: { key: "site_email", value: "info@kurdistanathletes.com" },
  });

  const eventCount = await prisma.event.count();
  if (eventCount === 0) {
    const inTwoWeeks = new Date();
    inTwoWeeks.setDate(inTwoWeeks.getDate() + 14);
    inTwoWeeks.setHours(16, 0, 0, 0);

    const inOneMonth = new Date();
    inOneMonth.setDate(inOneMonth.getDate() + 30);
    inOneMonth.setHours(10, 0, 0, 0);

    await prisma.event.createMany({
      data: [
        {
          title: "Open Training Day",
          summary:
            "A community training session for young athletes to meet coaches, train together, and learn what Kurdistan Athletes is about.",
          location: "Erbil",
          startsAt: inTwoWeeks,
          ctaLabel: "Join Us",
          ctaHref: "/register",
          published: true,
        },
        {
          title: "Athlete Workshop",
          summary:
            "A practical workshop on discipline, mindset, and how to find the next opportunity in your sport.",
          location: "Kurdistan Region",
          startsAt: inOneMonth,
          ctaLabel: "Get Involved",
          ctaHref: "/contact",
          published: true,
        },
      ],
    });
  }

  const adminEmail = (process.env.ADMIN_EMAIL || "admin@kurdistanathletes.com").toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "ChangeThisPassword123!";
  const adminName = process.env.ADMIN_NAME || "Kurdistan Athletes Admin";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: adminName,
      passwordHash,
      role: Role.ADMIN,
    },
    create: {
      name: adminName,
      email: adminEmail,
      passwordHash,
      role: Role.ADMIN,
    },
  });

  console.log(`Seed complete. Admin: ${adminEmail}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
