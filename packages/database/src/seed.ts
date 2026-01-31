import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const adminPassword = await hash("ILoveVerita", 12);
  const admin = await prisma.user.upsert({
    where: { email: "shub@verita-ai.com" },
    update: { passwordHash: adminPassword },
    create: {
      email: "shub@verita-ai.com",
      passwordHash: adminPassword,
      name: "Shubham",
      role: "ADMIN",
    },
  });
  console.log("Created admin user:", admin.email);

  // Create ops user
  const opsPassword = await hash("verita123", 12);
  const opsUser = await prisma.user.upsert({
    where: { email: "ops@verita.ai" },
    update: { passwordHash: opsPassword },
    create: {
      email: "ops@verita.ai",
      passwordHash: opsPassword,
      name: "Ops Team",
      role: "OPS",
    },
  });
  console.log("Created ops user:", opsUser.email);

  // Create a sample published job for testing
  const sampleJob = await prisma.job.upsert({
    where: { slug: "ai-data-annotator" },
    update: {},
    create: {
      title: "AI Data Annotator",
      slug: "ai-data-annotator",
      status: "PUBLISHED",
      payMin: 15,
      payMax: 25,
      payType: "HOURLY",
      timeCommitment: "10-20 hours/week",
      remoteWorldwide: true,
      allowedCountries: [],
      shortDescription: "Help train AI models by providing high-quality data annotations for machine learning projects.",
      fullDescription: `We're looking for detail-oriented individuals to join our data annotation team. You'll be working on cutting-edge AI projects, helping to label and categorize data that will be used to train machine learning models.

This is a flexible, remote position that allows you to work from anywhere in the world. You'll be part of a global team of annotators contributing to the future of AI technology.`,
      responsibilities: `• Review and annotate various types of data including text, images, and audio
• Follow detailed annotation guidelines to ensure consistency
• Meet quality standards and accuracy targets
• Communicate with team leads about edge cases or unclear instructions
• Complete tasks within specified timeframes`,
      requirements: `• Strong attention to detail
• Excellent reading comprehension skills
• Reliable internet connection
• Ability to follow detailed instructions
• Available for at least 10 hours per week
• Good time management skills`,
      niceToHave: `• Previous experience in data annotation or labeling
• Background in linguistics, psychology, or related fields
• Familiarity with AI/ML concepts
• Experience with annotation tools like Label Studio or Prodigy`,
      tools: ["Label Studio", "Google Docs", "Slack"],
      skillTags: ["Data Annotation", "Attention to Detail", "Remote Work"],
      publishedAt: new Date(),
      createdById: admin.id,
    },
  });
  console.log("Created sample job:", sampleJob.title);

  // Create Video Annotation Specialist job (PUBLISHED)
  const videoJob = await prisma.job.upsert({
    where: { slug: "video-annotation-specialist" },
    update: {},
    create: {
      title: "Video Annotation Specialist",
      slug: "video-annotation-specialist",
      status: "PUBLISHED",
      payMin: 18,
      payMax: 30,
      payType: "HOURLY",
      timeCommitment: "15-25 hours/week",
      remoteWorldwide: true,
      allowedCountries: [],
      shortDescription: "Annotate video content for autonomous vehicle and robotics AI training projects.",
      fullDescription: `Join our team of video annotation specialists working on cutting-edge autonomous vehicle and robotics projects. You'll be labeling objects, tracking movements, and segmenting scenes in video footage.

This role is critical to training AI systems that need to understand the visual world in motion. Your annotations will directly contribute to making self-driving cars and robots safer and more capable.`,
      responsibilities: `• Annotate objects in video frames (vehicles, pedestrians, road signs, etc.)
• Track object movements across video sequences
• Perform semantic segmentation on video content
• Maintain high accuracy standards (95%+ required)
• Document edge cases and ambiguous scenarios
• Participate in calibration sessions to ensure annotation consistency`,
      requirements: `• Strong spatial reasoning abilities
• Experience with video editing or frame-by-frame analysis
• Attention to detail and patience for repetitive tasks
• Reliable high-speed internet connection
• Ability to work 15+ hours per week consistently
• Basic understanding of 3D space and perspectives`,
      niceToHave: `• Experience with CVAT, Supervisely, or similar video annotation tools
• Background in film, animation, or visual effects
• Knowledge of autonomous vehicle technology
• Previous QA or testing experience`,
      tools: ["CVAT", "Supervisely", "Slack", "Notion"],
      skillTags: ["Video Annotation", "Computer Vision", "Autonomous Vehicles", "Detail-Oriented"],
      publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      createdById: admin.id,
    },
  });
  console.log("Created sample job:", videoJob.title);

  // Create QA Reviewer job (PUBLISHED)
  const qaJob = await prisma.job.upsert({
    where: { slug: "qa-reviewer" },
    update: {},
    create: {
      title: "QA Reviewer",
      slug: "qa-reviewer",
      status: "PUBLISHED",
      payMin: 20,
      payMax: 35,
      payType: "HOURLY",
      timeCommitment: "20-30 hours/week",
      remoteWorldwide: true,
      allowedCountries: [],
      shortDescription: "Review and quality-check AI training data to ensure accuracy and consistency across projects.",
      fullDescription: `We're seeking experienced QA Reviewers to ensure the highest quality of our AI training datasets. You'll be reviewing work from our annotation team, identifying errors, and providing constructive feedback.

This senior role requires strong analytical skills and the ability to maintain consistent quality standards across large datasets. You'll work closely with project managers and annotation teams to continuously improve our processes.`,
      responsibilities: `• Review completed annotations for accuracy and guideline compliance
• Identify patterns of errors and provide feedback to annotators
• Calibrate with other QA reviewers to maintain consistency
• Generate quality reports and metrics
• Participate in guideline development and improvement
• Escalate complex edge cases to project managers
• Train new annotators on quality standards`,
      requirements: `• 1+ years of experience in data annotation or QA
• Excellent analytical and problem-solving skills
• Strong written communication for providing feedback
• Ability to maintain objectivity and consistency
• Experience with quality metrics and reporting
• Available for at least 20 hours per week`,
      niceToHave: `• Experience leading or managing annotation teams
• Background in machine learning or data science
• Statistical analysis skills
• Experience with multiple annotation domains (text, image, video)`,
      tools: ["Label Studio", "Google Sheets", "Slack", "Loom"],
      skillTags: ["Quality Assurance", "Data Review", "Leadership", "Analytics"],
      publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      createdById: admin.id,
    },
  });
  console.log("Created sample job:", qaJob.title);

  // Create Audio Transcription Expert job (DRAFT)
  const audioJob = await prisma.job.upsert({
    where: { slug: "audio-transcription-expert" },
    update: {},
    create: {
      title: "Audio Transcription Expert",
      slug: "audio-transcription-expert",
      status: "DRAFT",
      payMin: 15,
      payMax: 28,
      payType: "HOURLY",
      timeCommitment: "10-20 hours/week",
      remoteWorldwide: true,
      allowedCountries: [],
      shortDescription: "Transcribe and annotate audio content for speech recognition AI training.",
      fullDescription: `Help train the next generation of speech recognition AI by providing accurate transcriptions and annotations of audio content. You'll work with various types of audio including conversations, podcasts, and voice commands.

This role requires excellent listening skills and the ability to accurately capture speech, including handling accents, background noise, and multiple speakers.`,
      responsibilities: `• Transcribe audio recordings with high accuracy
• Annotate speaker changes and non-speech sounds
• Mark timestamps for key segments
• Handle multiple accents and dialects
• Flag poor quality audio or unclear speech
• Follow specific transcription style guides`,
      requirements: `• Native or near-native English proficiency
• Excellent listening and typing skills (60+ WPM)
• Good quality headphones
• Quiet working environment
• Attention to detail
• Ability to work with various audio qualities`,
      niceToHave: `• Experience with transcription tools like Otter.ai or Rev
• Familiarity with phonetic notation
• Knowledge of multiple languages
• Background in linguistics or language studies`,
      tools: ["Otter.ai", "Descript", "Google Docs", "Slack"],
      skillTags: ["Transcription", "Audio", "Speech Recognition", "Languages"],
      publishedAt: null,
      createdById: admin.id,
    },
  });
  console.log("Created sample job:", audioJob.title);

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
