import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  BarChart3,
  BookOpen,
  CheckCircle2,
  DollarSign,
  Layers,
  Star,
  Telescope,
  TrendingUp,
} from "lucide-react";
import React from "react";
import RoadmapTimeline from "../components/RoadmapTimeline";
import { useGetAvailableRoadmaps } from "../hooks/useQueries";

// Static job data store
const JOB_DATA: Record<
  string,
  {
    role: string;
    sector: string;
    sectorId: bigint;
    description: string;
    marketGrowth: string;
    futureScope: string;
    averageSalary: string;
    salaryRange: string;
    keySkills: string[];
    roadmapSteps: string[];
    beginnerSkills: string[];
    intermediateSkills: string[];
    advancedSkills: string[];
    education: string;
    jobOutlook: string;
  }
> = {
  "software-engineer": {
    role: "Software Engineer",
    sector: "Technology",
    sectorId: BigInt(1),
    description:
      "Software Engineers design, develop, test, and maintain software applications and systems. They work across the full software development lifecycle — from requirements gathering and architecture design to coding, testing, deployment, and ongoing maintenance. They collaborate with product managers, designers, and other engineers to build scalable, reliable software solutions.",
    marketGrowth:
      "The software engineering field is growing at 25% annually, significantly faster than the average for all occupations. Demand is driven by digital transformation across all industries, cloud computing adoption, AI/ML integration, and the continued expansion of mobile and web applications.",
    futureScope:
      "Software engineering will remain one of the most in-demand careers for the foreseeable future. Emerging areas like AI/ML engineering, cloud-native development, Web3, and edge computing are creating new specializations. Remote work has also expanded the global talent market, offering engineers more flexibility and opportunities.",
    averageSalary: "$120,000",
    salaryRange: "$90,000 – $160,000",
    keySkills: [
      "Programming (Python, JavaScript, Java)",
      "Data Structures & Algorithms",
      "System Design",
      "Version Control (Git)",
      "Agile/Scrum",
      "Cloud Platforms (AWS/GCP/Azure)",
      "Testing & Debugging",
      "API Design",
    ],
    roadmapSteps: [
      "Learn programming fundamentals (Python or JavaScript)",
      "Master data structures and algorithms",
      "Build projects and contribute to open source",
      "Learn web development or backend frameworks",
      "Study system design and architecture patterns",
      "Get cloud certifications (AWS/GCP/Azure)",
      "Apply for internships or junior roles",
      "Advance to senior/lead engineer positions",
    ],
    beginnerSkills: [
      "Basic programming syntax",
      "HTML/CSS fundamentals",
      "Git version control",
      "Simple algorithms",
      "Command line basics",
    ],
    intermediateSkills: [
      "Framework proficiency (React, Node.js, Django)",
      "Database design (SQL/NoSQL)",
      "REST API development",
      "Testing methodologies",
      "CI/CD pipelines",
    ],
    advancedSkills: [
      "Distributed systems design",
      "Microservices architecture",
      "Performance optimization",
      "Security best practices",
      "Technical leadership",
    ],
    education:
      "Bachelor's in Computer Science or related field (or equivalent bootcamp/self-taught)",
    jobOutlook: "Excellent — 25% growth projected over next 10 years",
  },
  "data-scientist": {
    role: "Data Scientist",
    sector: "Technology",
    sectorId: BigInt(1),
    description:
      "Data Scientists collect, analyze, and interpret large datasets to help organizations make data-driven decisions. They apply statistical analysis, machine learning, and data visualization techniques to uncover patterns and insights. They work closely with business stakeholders to translate complex findings into actionable recommendations.",
    marketGrowth:
      "Data science is one of the fastest-growing fields with 35% annual growth. The explosion of big data, AI adoption, and the need for evidence-based decision-making across industries is driving unprecedented demand for skilled data scientists.",
    futureScope:
      "As AI and machine learning become central to business strategy, data scientists will play an increasingly critical role. Specializations in NLP, computer vision, and MLOps are emerging. The field is evolving toward more automated ML pipelines, requiring data scientists to focus on higher-level problem framing and model governance.",
    averageSalary: "$125,000",
    salaryRange: "$95,000 – $155,000",
    keySkills: [
      "Python/R Programming",
      "Machine Learning",
      "Statistical Analysis",
      "SQL & Databases",
      "Data Visualization",
      "Deep Learning",
      "Feature Engineering",
      "Business Communication",
    ],
    roadmapSteps: [
      "Learn Python and statistics fundamentals",
      "Master SQL and data manipulation with Pandas",
      "Study machine learning algorithms",
      "Practice with real datasets on Kaggle",
      "Learn deep learning frameworks (TensorFlow/PyTorch)",
      "Build a portfolio of data science projects",
      "Get certified (Google Data Analytics, AWS ML)",
      "Apply for data analyst or junior data scientist roles",
    ],
    beginnerSkills: [
      "Python basics",
      "Excel/spreadsheet analysis",
      "Basic statistics",
      "SQL queries",
      "Data cleaning",
    ],
    intermediateSkills: [
      "Machine learning models",
      "Data visualization (Tableau/Power BI)",
      "Feature engineering",
      "A/B testing",
      "Big data tools (Spark)",
    ],
    advancedSkills: [
      "Deep learning & neural networks",
      "MLOps and model deployment",
      "Advanced NLP/Computer Vision",
      "Causal inference",
      "Research & publication",
    ],
    education:
      "Bachelor's/Master's in Statistics, Mathematics, Computer Science, or related field",
    jobOutlook:
      "Outstanding — 35% growth, ranked #1 best job in multiple surveys",
  },
  "product-manager": {
    role: "Product Manager",
    sector: "Technology",
    sectorId: BigInt(1),
    description:
      "Product Managers define the vision, strategy, and roadmap for a product. They act as the bridge between business, technology, and design teams, prioritizing features based on user needs and business goals. They are responsible for the product lifecycle from ideation to launch and iteration.",
    marketGrowth:
      "Product management is growing at 20% annually as companies increasingly recognize the need for dedicated product leadership. The rise of SaaS, mobile apps, and digital platforms has created massive demand for skilled PMs who can balance user needs with business objectives.",
    futureScope:
      "Product management will continue to evolve with AI-assisted product development, data-driven decision making, and platform thinking. Specializations in AI product management, growth product management, and platform PM roles are emerging as high-value career paths.",
    averageSalary: "$135,000",
    salaryRange: "$100,000 – $170,000",
    keySkills: [
      "Product Strategy",
      "User Research",
      "Data Analysis",
      "Roadmap Planning",
      "Stakeholder Management",
      "Agile/Scrum",
      "A/B Testing",
      "Communication",
    ],
    roadmapSteps: [
      "Develop strong analytical and communication skills",
      "Learn product frameworks (Jobs-to-be-Done, OKRs)",
      "Gain experience in a related role (engineering, design, or business)",
      "Build product intuition through side projects",
      "Get certified (AIPMM, Pragmatic Institute)",
      "Transition to Associate PM or PM role",
      "Build a track record of successful product launches",
      "Advance to Senior PM or Director of Product",
    ],
    beginnerSkills: [
      "User story writing",
      "Basic wireframing",
      "Market research",
      "Stakeholder communication",
      "Agile basics",
    ],
    intermediateSkills: [
      "Product metrics & KPIs",
      "A/B testing design",
      "Competitive analysis",
      "Roadmap prioritization",
      "Cross-functional leadership",
    ],
    advancedSkills: [
      "Product strategy & vision",
      "Platform thinking",
      "P&L ownership",
      "Organizational influence",
      "Go-to-market strategy",
    ],
    education:
      "Bachelor's in Business, Engineering, or related field; MBA often preferred for senior roles",
    jobOutlook:
      "Strong — 20% growth with high compensation and career advancement opportunities",
  },
  doctor: {
    role: "Doctor/Physician",
    sector: "Healthcare",
    sectorId: BigInt(2),
    description:
      "Physicians diagnose and treat illnesses, injuries, and medical conditions. They examine patients, order and interpret diagnostic tests, prescribe medications, and develop treatment plans. They work in hospitals, clinics, private practices, and research institutions, often specializing in specific areas of medicine.",
    marketGrowth:
      "Physician demand is growing at 3% annually, but the overall healthcare sector is expanding rapidly. An aging population, increased chronic disease prevalence, and healthcare access expansion are driving sustained demand for qualified physicians across all specialties.",
    futureScope:
      "Medicine is being transformed by AI diagnostics, telemedicine, precision medicine, and genomics. Physicians who embrace technology and data-driven medicine will lead innovation. Specialties like geriatrics, oncology, and mental health are facing critical shortages and offer strong career prospects.",
    averageSalary: "$275,000",
    salaryRange: "$200,000 – $350,000",
    keySkills: [
      "Clinical diagnosis",
      "Patient communication",
      "Medical knowledge",
      "Procedural skills",
      "Critical thinking",
      "Electronic Health Records (EHR)",
      "Medical ethics",
      "Team collaboration",
    ],
    roadmapSteps: [
      "Complete Bachelor's with pre-med coursework",
      "Pass MCAT and apply to medical school",
      "Complete 4 years of medical school (MD/DO)",
      "Pass USMLE Step 1, 2, and 3 licensing exams",
      "Complete 3-7 year residency program",
      "Complete fellowship for specialization (optional)",
      "Obtain state medical license and board certification",
      "Begin practice or academic medicine career",
    ],
    beginnerSkills: [
      "Biology and chemistry foundations",
      "Patient history taking",
      "Physical examination",
      "Medical terminology",
      "Basic life support",
    ],
    intermediateSkills: [
      "Differential diagnosis",
      "Clinical procedures",
      "Pharmacology",
      "EHR documentation",
      "Care team coordination",
    ],
    advancedSkills: [
      "Complex case management",
      "Subspecialty procedures",
      "Research and publication",
      "Medical leadership",
      "Quality improvement",
    ],
    education:
      "MD or DO degree from accredited medical school; residency and board certification required",
    jobOutlook:
      "Stable — 3% growth with high compensation and strong job security",
  },
  nurse: {
    role: "Registered Nurse",
    sector: "Healthcare",
    sectorId: BigInt(2),
    description:
      "Registered Nurses provide and coordinate patient care, educate patients about health conditions, and offer emotional support. They work across hospitals, clinics, schools, and community health settings, collaborating with physicians and other healthcare professionals to deliver quality patient outcomes.",
    marketGrowth:
      "Nursing is growing at 6% annually with a significant shortage of qualified nurses driving demand. The aging population, healthcare expansion, and retirement of baby boomer nurses are creating exceptional opportunities for new nursing graduates.",
    futureScope:
      "Advanced practice nursing roles (NP, CRNA, CNM) are expanding significantly as healthcare systems rely more on nurses for primary care. Specializations in critical care, oncology, and informatics are in high demand. Travel nursing and telehealth nursing offer flexible, high-paying opportunities.",
    averageSalary: "$80,000",
    salaryRange: "$65,000 – $100,000",
    keySkills: [
      "Patient assessment",
      "Medication administration",
      "Clinical documentation",
      "Patient education",
      "Critical thinking",
      "IV therapy",
      "Care coordination",
      "Compassionate communication",
    ],
    roadmapSteps: [
      "Earn BSN or ADN degree from accredited nursing program",
      "Pass NCLEX-RN licensing exam",
      "Begin in a medical-surgical or general nursing unit",
      "Gain clinical experience across specialties",
      "Pursue BSN if not already completed (RN-to-BSN)",
      "Obtain specialty certifications (CCRN, OCN, etc.)",
      "Consider advanced practice (NP, CNS) with MSN",
      "Advance to charge nurse, manager, or APRN role",
    ],
    beginnerSkills: [
      "Basic patient care",
      "Vital signs monitoring",
      "Medication safety",
      "Documentation basics",
      "Infection control",
    ],
    intermediateSkills: [
      "Complex wound care",
      "IV insertion and management",
      "Patient education programs",
      "Care plan development",
      "Emergency response",
    ],
    advancedSkills: [
      "ICU/specialty care",
      "Clinical leadership",
      "Quality improvement",
      "Nursing research",
      "Advanced assessment",
    ],
    education:
      "BSN (preferred) or ADN; NCLEX-RN licensure required; MSN for advanced practice",
    jobOutlook:
      "Excellent — 6% growth with strong demand and competitive salaries across all settings",
  },
  pharmacist: {
    role: "Pharmacist",
    sector: "Healthcare",
    sectorId: BigInt(2),
    description:
      "Pharmacists dispense prescription medications, counsel patients on drug interactions and side effects, and collaborate with physicians to optimize medication therapy. They work in retail pharmacies, hospitals, clinics, and pharmaceutical companies, ensuring safe and effective use of medications.",
    marketGrowth:
      "Pharmacy is growing at 2% annually, with modest overall growth but strong demand in specialty pharmacy, clinical pharmacy, and pharmaceutical industry roles. The shift toward medication therapy management and clinical pharmacist roles is creating new high-value opportunities.",
    futureScope:
      "Clinical pharmacists are taking on expanded roles in patient care, particularly in chronic disease management and medication reconciliation. Specialty pharmacy, oncology pharmacy, and pharmacogenomics are fast-growing areas. Telepharmacy is expanding access and creating flexible work arrangements.",
    averageSalary: "$132,000",
    salaryRange: "$120,000 – $150,000",
    keySkills: [
      "Pharmacology",
      "Drug interaction screening",
      "Patient counseling",
      "Medication dispensing",
      "Clinical documentation",
      "Pharmacy law & regulations",
      "Compounding",
      "Collaborative care",
    ],
    roadmapSteps: [
      "Complete pre-pharmacy coursework (biology, chemistry)",
      "Pass PCAT and apply to PharmD program",
      "Complete 4-year Doctor of Pharmacy (PharmD) program",
      "Pass NAPLEX and MPJE licensing exams",
      "Complete PGY1 residency (optional but competitive)",
      "Complete PGY2 specialty residency (optional)",
      "Obtain Board Certification (BCPS, BCOP, etc.)",
      "Advance to clinical specialist or pharmacy director",
    ],
    beginnerSkills: [
      "Prescription verification",
      "Drug identification",
      "Patient intake",
      "Basic counseling",
      "Inventory management",
    ],
    intermediateSkills: [
      "Drug therapy monitoring",
      "Medication reconciliation",
      "Clinical pharmacy services",
      "Immunization administration",
      "Insurance billing",
    ],
    advancedSkills: [
      "Specialty pharmacy management",
      "Pharmacokinetics consulting",
      "Antimicrobial stewardship",
      "Clinical research",
      "Pharmacy leadership",
    ],
    education:
      "Doctor of Pharmacy (PharmD) degree; NAPLEX and MPJE state licensure required",
    jobOutlook:
      "Stable — 2% growth with high salaries and expanding clinical roles",
  },
  "health-admin": {
    role: "Healthcare Administrator",
    sector: "Healthcare",
    sectorId: BigInt(2),
    description:
      "Healthcare Administrators manage the operations of hospitals, clinics, nursing homes, and other healthcare facilities. They oversee budgets, staff, compliance, and strategic planning to ensure quality patient care delivery and organizational efficiency.",
    marketGrowth:
      "Healthcare administration is growing at an impressive 28% annually, far outpacing most other occupations. The expansion of healthcare systems, regulatory complexity, and the shift to value-based care are driving unprecedented demand for skilled healthcare managers.",
    futureScope:
      "Healthcare administrators who understand data analytics, healthcare IT, and value-based care models will be in high demand. Specializations in population health management, healthcare informatics, and accountable care organizations represent the future of this field.",
    averageSalary: "$92,000",
    salaryRange: "$70,000 – $120,000",
    keySkills: [
      "Healthcare operations",
      "Budget management",
      "Regulatory compliance",
      "Strategic planning",
      "Staff leadership",
      "Healthcare IT systems",
      "Quality improvement",
      "Policy development",
    ],
    roadmapSteps: [
      "Earn degree in healthcare administration or business",
      "Learn healthcare regulations (HIPAA, Joint Commission)",
      "Gain entry-level experience in healthcare setting",
      "Pursue MHA or MBA with healthcare concentration",
      "Develop financial and operations management skills",
      "Obtain FACHE certification (Fellow, ACHE)",
      "Move into department director or administrator role",
      "Advance to CEO or C-suite of healthcare organization",
    ],
    beginnerSkills: [
      "Healthcare terminology",
      "Medical billing basics",
      "Staff scheduling",
      "Regulatory awareness",
      "Office management",
    ],
    intermediateSkills: [
      "Budget development",
      "Quality metrics analysis",
      "EHR system management",
      "Compliance auditing",
      "Department leadership",
    ],
    advancedSkills: [
      "Strategic planning",
      "Healthcare finance",
      "Board governance",
      "System integration",
      "Population health strategy",
    ],
    education:
      "Bachelor's in Healthcare Administration; MHA or MBA highly preferred for leadership roles",
    jobOutlook:
      "Outstanding — 28% growth, fastest-growing management occupation in healthcare",
  },
  "business-analyst": {
    role: "Business Analyst",
    sector: "Business",
    sectorId: BigInt(5),
    description:
      "Business Analysts bridge the gap between business needs and technology solutions. They gather and document requirements, analyze processes, identify inefficiencies, and recommend improvements. They work with stakeholders across departments to ensure projects deliver measurable business value.",
    marketGrowth:
      "Business analysis is growing at 11% annually as organizations increasingly rely on data-driven decision making and digital transformation initiatives. The role is evolving to include more data analytics and technology skills.",
    futureScope:
      "Business analysts are becoming more technical, with growing demand for skills in data analytics, process automation, and AI implementation. Specializations in digital transformation, agile business analysis, and data-driven BA roles are emerging as high-value career paths.",
    averageSalary: "$90,000",
    salaryRange: "$70,000 – $110,000",
    keySkills: [
      "Requirements gathering",
      "Process modeling",
      "Data analysis",
      "Stakeholder management",
      "SQL",
      "Business process improvement",
      "Documentation",
      "Agile methodology",
    ],
    roadmapSteps: [
      "Build strong analytical and communication skills",
      "Learn business process modeling (BPMN)",
      "Master Excel, SQL, and data visualization tools",
      "Get CBAP or PMI-PBA certification",
      "Gain experience in a business or IT role",
      "Develop domain expertise (finance, healthcare, tech)",
      "Build a portfolio of process improvement projects",
      "Advance to Senior BA or Product Owner roles",
    ],
    beginnerSkills: [
      "Requirements documentation",
      "Process flowcharts",
      "Excel analysis",
      "Stakeholder interviews",
      "Use case writing",
    ],
    intermediateSkills: [
      "SQL queries",
      "Data visualization",
      "Agile/Scrum",
      "Gap analysis",
      "Business case development",
    ],
    advancedSkills: [
      "Enterprise architecture",
      "Change management",
      "Strategic analysis",
      "Digital transformation",
      "Leadership & mentoring",
    ],
    education:
      "Bachelor's in Business, IT, or related field; CBAP certification recommended",
    jobOutlook: "Good — 11% growth with strong demand across all industries",
  },
  entrepreneur: {
    role: "Entrepreneur",
    sector: "Business",
    sectorId: BigInt(5),
    description:
      "Entrepreneurs identify market opportunities and build businesses from the ground up. They develop business models, raise funding, recruit teams, and drive growth from concept to execution. Successful entrepreneurs combine vision, resilience, and business acumen to create lasting value and competitive advantage.",
    marketGrowth:
      "Entrepreneurship opportunities are growing rapidly, fueled by accessible technology, remote work infrastructure, and growing venture capital ecosystems. Startup formation rates are at historic highs, with particular growth in technology, health tech, fintech, and sustainability sectors.",
    futureScope:
      "The entrepreneurial ecosystem is becoming more accessible with no-code tools, AI automation, and global talent networks. Social entrepreneurship, impact investing, and tech-enabled businesses are gaining momentum. Serial entrepreneurship and solopreneurship are also growing as viable career paths.",
    averageSalary: "Variable",
    salaryRange: "Variable",
    keySkills: [
      "Business strategy",
      "Financial planning",
      "Leadership",
      "Sales and marketing",
      "Product development",
      "Fundraising",
      "Risk management",
      "Resilience",
    ],
    roadmapSteps: [
      "Develop core business and technology skills",
      "Identify a market problem worth solving",
      "Validate your idea with potential customers",
      "Build an MVP (Minimum Viable Product)",
      "Secure seed funding (bootstrapping, angels, or accelerators)",
      "Build and lead a founding team",
      "Scale operations and achieve product-market fit",
      "Pursue Series A funding or path to profitability",
    ],
    beginnerSkills: [
      "Business model canvas",
      "Market research",
      "Basic financial literacy",
      "Customer discovery",
      "Networking",
    ],
    intermediateSkills: [
      "Lean startup methodology",
      "Pitch deck creation",
      "Team building",
      "Product-market fit analysis",
      "Growth hacking",
    ],
    advancedSkills: [
      "Venture fundraising strategy",
      "Board management",
      "M&A and exit planning",
      "Organizational scaling",
      "Investor relations",
    ],
    education:
      "No formal requirement; Bachelor's in Business/Engineering helpful; many successful entrepreneurs are self-taught",
    jobOutlook:
      "High potential — success is self-driven; growing ecosystem of support for founders",
  },
  "hr-manager": {
    role: "HR Manager",
    sector: "Business",
    sectorId: BigInt(5),
    description:
      "HR Managers oversee all aspects of human resources including recruitment, onboarding, employee relations, compensation, benefits, compliance, and performance management. They serve as a strategic partner to leadership while advocating for employees and building a healthy organizational culture.",
    marketGrowth:
      "Human resources management is growing at 7% annually, driven by increasing workforce complexity, remote work management challenges, and growing emphasis on diversity, equity, and inclusion initiatives across organizations.",
    futureScope:
      "HR is evolving from administrative function to strategic business partner. People analytics, AI-powered recruiting, employee experience design, and remote workforce management are reshaping the field. HR professionals with data literacy and change management expertise will be most competitive.",
    averageSalary: "$85,000",
    salaryRange: "$65,000 – $110,000",
    keySkills: [
      "Talent acquisition",
      "Employee relations",
      "Compensation & benefits",
      "Labor law compliance",
      "Performance management",
      "Organizational development",
      "HR analytics",
      "Conflict resolution",
    ],
    roadmapSteps: [
      "Earn degree in HR, Business, or Psychology",
      "Start in HR coordinator or generalist role",
      "Learn HRIS systems (Workday, ADP, BambooHR)",
      "Get PHR or SHRM-CP certification",
      "Develop expertise in employment law and compliance",
      "Move into specialist or HR manager role",
      "Pursue SPHR or SHRM-SCP for senior roles",
      "Advance to Director of HR or Chief People Officer",
    ],
    beginnerSkills: [
      "Resume screening",
      "Onboarding processes",
      "Benefits administration",
      "HRIS data entry",
      "Policy documentation",
    ],
    intermediateSkills: [
      "Full-cycle recruiting",
      "Performance review programs",
      "Employee engagement surveys",
      "Labor law application",
      "Training program delivery",
    ],
    advancedSkills: [
      "HR strategy development",
      "Workforce planning",
      "Executive compensation",
      "Organizational design",
      "Cultural transformation",
    ],
    education:
      "Bachelor's in Human Resources, Business, or Psychology; SHRM or HRCI certification preferred",
    jobOutlook:
      "Good — 7% growth with increasing strategic importance of people operations",
  },
  "graphic-designer": {
    role: "Graphic Designer",
    sector: "Arts",
    sectorId: BigInt(4),
    description:
      "Graphic Designers create visual content to communicate messages and ideas. They design logos, marketing materials, websites, packaging, and digital content using typography, color, and imagery. They work with clients and marketing teams to produce compelling visual solutions that meet brand and communication objectives.",
    marketGrowth:
      "Graphic design is growing at 3% annually. While traditional print design is declining, digital design, UX/UI, motion graphics, and brand identity work are expanding rapidly, creating new opportunities for designers who adapt to digital-first workflows.",
    futureScope:
      "The future of graphic design is increasingly digital and interactive. Motion design, 3D visualization, AR/VR experiences, and AI-assisted design tools are reshaping the field. Designers who combine traditional design principles with digital skills and AI tool proficiency will be most competitive.",
    averageSalary: "$65,000",
    salaryRange: "$45,000 – $85,000",
    keySkills: [
      "Adobe Creative Suite",
      "Typography",
      "Color theory",
      "Brand identity",
      "Layout design",
      "Digital illustration",
      "UI/UX basics",
      "Client communication",
    ],
    roadmapSteps: [
      "Learn design fundamentals (color, typography, composition)",
      "Master Adobe Photoshop, Illustrator, and InDesign",
      "Build a diverse design portfolio",
      "Learn Figma for UI/UX design",
      "Study branding and visual identity principles",
      "Freelance or intern to gain real-world experience",
      "Specialize in a niche (branding, motion, UX)",
      "Build client relationships and grow your practice",
    ],
    beginnerSkills: [
      "Basic Adobe tools",
      "Color theory",
      "Typography basics",
      "Simple layouts",
      "Image editing",
    ],
    intermediateSkills: [
      "Brand identity design",
      "Print production",
      "Digital design",
      "Illustration",
      "Presentation design",
    ],
    advancedSkills: [
      "Motion graphics",
      "Art direction",
      "Brand strategy",
      "3D design",
      "Creative leadership",
    ],
    education:
      "Bachelor's in Graphic Design, Visual Arts, or related field; strong portfolio is essential",
    jobOutlook:
      "Moderate — 3% growth, but strong demand for digital and UX-focused designers",
  },
  animator: {
    role: "3D Animator",
    sector: "Arts",
    sectorId: BigInt(4),
    description:
      "3D Animators create animated content for films, video games, television, and digital media. They use specialized software to model, rig, and animate characters and objects, bringing stories and concepts to life with realistic movement and expressive performances.",
    marketGrowth:
      "Animation is growing at 5% annually with strong demand in gaming, streaming entertainment, VR/AR, and digital advertising. The explosion of streaming platforms and mobile gaming has created significant new opportunities for skilled animators.",
    futureScope:
      "Real-time rendering, virtual production, and AI-assisted animation are transforming the field. Animators with expertise in game engines (Unreal, Unity), motion capture, and virtual production workflows will be highly sought after as the metaverse and interactive entertainment expand.",
    averageSalary: "$72,000",
    salaryRange: "$55,000 – $100,000",
    keySkills: [
      "3D software (Maya, Blender, Cinema 4D)",
      "Character rigging",
      "Motion principles",
      "Storytelling",
      "Texture and lighting",
      "Game engine basics",
      "Compositing",
      "Portfolio development",
    ],
    roadmapSteps: [
      "Learn 3D fundamentals with Blender or Maya",
      "Study the 12 principles of animation",
      "Build character rigs and simple animations",
      "Create a demo reel with diverse animation work",
      "Learn a game engine (Unreal or Unity)",
      "Intern or freelance with a studio or agency",
      "Specialize in character, VFX, or motion graphics",
      "Advance to lead animator or animation director",
    ],
    beginnerSkills: [
      "3D modeling basics",
      "Keyframe animation",
      "Basic rigging",
      "Rendering fundamentals",
      "Reference gathering",
    ],
    intermediateSkills: [
      "Character animation",
      "Lip sync",
      "Dynamics and simulation",
      "Motion capture cleanup",
      "Demo reel creation",
    ],
    advancedSkills: [
      "Complex character performance",
      "Pipeline integration",
      "Real-time animation",
      "Animation direction",
      "Team leadership",
    ],
    education:
      "Bachelor's in Animation, Fine Arts, or Computer Graphics; portfolio and demo reel are essential",
    jobOutlook:
      "Good — 5% growth with strong opportunities in gaming, streaming, and VR",
  },
  "content-creator": {
    role: "Content Creator",
    sector: "Arts",
    sectorId: BigInt(4),
    description:
      "Content Creators produce engaging video, audio, written, and visual content for digital platforms including YouTube, TikTok, Instagram, podcasts, and blogs. They build audiences, develop personal brands, and monetize content through advertising, sponsorships, and merchandise.",
    marketGrowth:
      "Content creation is growing at 15% annually as digital media consumption explodes and brands increasingly partner with creators for authentic marketing. The creator economy is valued at over $100 billion and growing rapidly.",
    futureScope:
      "The creator economy will continue to expand with new monetization models, AI-assisted content production, and immersive content formats. Creators who develop strong personal brands and diversified revenue streams across platforms will build sustainable careers.",
    averageSalary: "$65,000",
    salaryRange: "$40,000 – $120,000",
    keySkills: [
      "Video production and editing",
      "Storytelling",
      "Social media strategy",
      "SEO and discoverability",
      "Audience engagement",
      "Brand partnerships",
      "Analytics interpretation",
      "Content scheduling",
    ],
    roadmapSteps: [
      "Choose a niche and define your target audience",
      "Learn video production and editing (Premiere, DaVinci)",
      "Establish consistent publishing on 1-2 platforms",
      "Grow audience through SEO and community engagement",
      "Reach monetization thresholds (YouTube Partner, etc.)",
      "Build brand partnership and sponsorship relationships",
      "Diversify to merchandise, courses, and memberships",
      "Scale with a team and expand to new platforms",
    ],
    beginnerSkills: [
      "Basic video editing",
      "Content ideation",
      "Platform basics",
      "Smartphone filming",
      "Caption writing",
    ],
    intermediateSkills: [
      "Advanced video editing",
      "Thumbnail design",
      "Analytics tracking",
      "Brand pitch writing",
      "Email list building",
    ],
    advancedSkills: [
      "Multi-platform strategy",
      "Team management",
      "Revenue diversification",
      "Brand development",
      "Media production",
    ],
    education:
      "No formal requirement; skills in video production, writing, and marketing are essential",
    jobOutlook:
      "High — 15% growth in creator economy; success depends on niche and audience building",
  },
  architect: {
    role: "Architect",
    sector: "Arts",
    sectorId: BigInt(4),
    description:
      "Architects design buildings, spaces, and built environments that serve functional and aesthetic purposes. They work with clients to understand needs, develop design concepts, create technical drawings, and oversee construction to ensure projects meet safety codes, sustainability goals, and budget requirements.",
    marketGrowth:
      "Architecture is growing at 3% annually, driven by urbanization, sustainable building design, and infrastructure investment. Green architecture, adaptive reuse, and smart building technology are creating new specialization opportunities.",
    futureScope:
      "Sustainable design, parametric architecture, and building information modeling (BIM) are transforming the profession. Architects who specialize in net-zero buildings, mass timber construction, and urban resilience design will lead the next generation of built environment innovation.",
    averageSalary: "$95,000",
    salaryRange: "$75,000 – $130,000",
    keySkills: [
      "Architectural design",
      "AutoCAD and Revit (BIM)",
      "Building codes and regulations",
      "Project management",
      "Client communication",
      "Sustainable design",
      "3D visualization",
      "Construction documentation",
    ],
    roadmapSteps: [
      "Earn NAAB-accredited Bachelor's or Master's in Architecture",
      "Complete required internship hours (AXP program)",
      "Master AutoCAD, Revit, and 3D modeling software",
      "Develop a professional portfolio of design work",
      "Pass all 6 Architect Registration Examinations (ARE)",
      "Obtain state architecture license",
      "Specialize in residential, commercial, or sustainable design",
      "Advance to project architect or principal",
    ],
    beginnerSkills: [
      "Hand drafting and sketching",
      "AutoCAD basics",
      "Design principles",
      "Building materials",
      "Model making",
    ],
    intermediateSkills: [
      "BIM/Revit proficiency",
      "Construction documents",
      "Building codes",
      "Client presentations",
      "Structural systems basics",
    ],
    advancedSkills: [
      "Project leadership",
      "Sustainable certification (LEED)",
      "Parametric design",
      "Contract administration",
      "Business development",
    ],
    education:
      "Professional degree in Architecture (B.Arch or M.Arch); ARE licensure required for independent practice",
    jobOutlook:
      "Steady — 3% growth with premium compensation for licensed architects in major markets",
  },
  "financial-analyst": {
    role: "Financial Analyst",
    sector: "Finance",
    sectorId: BigInt(7),
    description:
      "Financial Analysts evaluate investment opportunities, analyze financial data, and provide recommendations to help businesses and individuals make informed financial decisions. They prepare financial models, reports, and forecasts, and monitor economic trends and market conditions.",
    marketGrowth:
      "Financial analysis is growing at 9% annually, driven by increasing complexity in global financial markets, regulatory requirements, and the need for data-driven financial decision making across all industries.",
    futureScope:
      "Financial analysts are increasingly using AI and machine learning tools for predictive modeling and risk assessment. Specializations in ESG (Environmental, Social, Governance) investing, fintech, and quantitative analysis are growing rapidly. Data literacy is becoming as important as traditional financial skills.",
    averageSalary: "$102,000",
    salaryRange: "$75,000 – $130,000",
    keySkills: [
      "Financial modeling",
      "Excel/VBA",
      "Valuation techniques",
      "Financial statement analysis",
      "Bloomberg/Reuters",
      "SQL",
      "Presentation skills",
      "Industry research",
    ],
    roadmapSteps: [
      "Earn a Bachelor's in Finance, Accounting, or Economics",
      "Master Excel and financial modeling",
      "Learn financial statement analysis",
      "Pursue CFA Level 1 certification",
      "Gain experience through internships",
      "Develop industry expertise (tech, healthcare, energy)",
      "Complete CFA Level 2 and 3",
      "Advance to Senior Analyst or Portfolio Manager",
    ],
    beginnerSkills: [
      "Basic accounting",
      "Excel fundamentals",
      "Financial statement reading",
      "Economic concepts",
      "Research skills",
    ],
    intermediateSkills: [
      "DCF modeling",
      "Comparable company analysis",
      "Industry analysis",
      "Bloomberg terminal",
      "Presentation of findings",
    ],
    advancedSkills: [
      "Complex financial modeling",
      "Portfolio management",
      "Risk assessment",
      "M&A analysis",
      "Quantitative methods",
    ],
    education:
      "Bachelor's in Finance/Accounting; CFA designation highly valued",
    jobOutlook:
      "Good — 9% growth with strong compensation in investment banking and asset management",
  },
  accountant: {
    role: "Accountant/CPA",
    sector: "Finance",
    sectorId: BigInt(7),
    description:
      "Accountants prepare and examine financial records, ensure accuracy and compliance with regulations, and advise on financial planning and tax strategy. CPAs provide the highest level of credentialing and can perform audits, represent clients before the IRS, and provide certified financial statements.",
    marketGrowth:
      "Accounting is growing at 4% annually, with steady demand driven by regulatory complexity, business growth, and the enduring need for financial accuracy and compliance across all industries and organization sizes.",
    futureScope:
      "Automation is transforming routine accounting tasks, elevating the profession toward advisory and analytical roles. Accountants who embrace cloud accounting, data analytics, and advisory services will be most competitive. Forensic accounting, sustainability reporting, and crypto accounting are emerging niches.",
    averageSalary: "$78,000",
    salaryRange: "$60,000 – $100,000",
    keySkills: [
      "Financial reporting (GAAP/IFRS)",
      "Tax preparation and planning",
      "Auditing",
      "Excel and accounting software",
      "Bookkeeping",
      "Regulatory compliance",
      "Financial analysis",
      "Attention to detail",
    ],
    roadmapSteps: [
      "Earn Bachelor's in Accounting or Finance",
      "Complete 150 credit hours for CPA eligibility",
      "Pass all 4 sections of the CPA exam",
      "Gain 1-2 years experience at public accounting firm",
      "Obtain CPA license from state board",
      "Specialize in tax, audit, or advisory services",
      "Consider CMA for management accounting path",
      "Advance to senior accountant, manager, or CFO",
    ],
    beginnerSkills: [
      "Bookkeeping basics",
      "Debits and credits",
      "Excel proficiency",
      "Financial statement preparation",
      "Tax form basics",
    ],
    intermediateSkills: [
      "Full-cycle accounting",
      "Audit procedures",
      "Tax planning",
      "QuickBooks/NetSuite",
      "Internal controls",
    ],
    advancedSkills: [
      "Complex tax strategy",
      "Financial due diligence",
      "SEC reporting",
      "Forensic accounting",
      "Accounting leadership",
    ],
    education:
      "Bachelor's in Accounting; CPA license highly recommended; 150 credit hours required for CPA",
    jobOutlook:
      "Stable — 4% growth with consistent demand and strong career progression to partner or CFO",
  },
  "investment-banker": {
    role: "Investment Banker",
    sector: "Finance",
    sectorId: BigInt(7),
    description:
      "Investment Bankers facilitate capital markets transactions including mergers and acquisitions, IPOs, secondary offerings, and debt financing. They advise corporations and governments on complex financial transactions, valuing companies, structuring deals, and negotiating on behalf of their clients.",
    marketGrowth:
      "Investment banking is growing at 10% annually with strong demand for M&A advisory as global deal volumes remain elevated. Private equity, fintech, and cross-border transactions are driving significant activity in the sector.",
    futureScope:
      "Investment banking is evolving with fintech disruption, algorithmic trading, and data analytics transforming how deals are sourced and executed. Boutique advisory firms are gaining market share from bulge bracket banks. ESG-focused investing and SPAC structures are creating new deal types.",
    averageSalary: "$160,000",
    salaryRange: "$100,000 – $250,000",
    keySkills: [
      "Financial modeling and valuation",
      "M&A transaction management",
      "Capital markets knowledge",
      "Excel/PowerPoint",
      "Deal structuring",
      "Client relationship management",
      "Due diligence",
      "Regulatory knowledge",
    ],
    roadmapSteps: [
      "Earn degree in Finance, Economics, or Business from top institution",
      "Develop financial modeling and valuation skills",
      "Secure investment banking summer analyst internship",
      "Convert internship to full-time analyst role",
      "Complete 2-year analyst program",
      "Pursue MBA or stay for associate promotion",
      "Advance through VP, Director, and MD ranks",
      "Specialize in M&A, leveraged finance, or specific industry",
    ],
    beginnerSkills: [
      "Financial statement analysis",
      "Excel modeling basics",
      "Accounting fundamentals",
      "PowerPoint presentations",
      "Bloomberg navigation",
    ],
    intermediateSkills: [
      "DCF and LBO modeling",
      "Comparable analysis",
      "Deal process management",
      "Pitch book creation",
      "Client communication",
    ],
    advancedSkills: [
      "Complex transaction structuring",
      "Cross-border deal execution",
      "Client origination",
      "Capital markets strategy",
      "Senior client advisory",
    ],
    education:
      "Bachelor's in Finance/Economics from top university; MBA from top business school for career acceleration",
    jobOutlook:
      "Strong — 10% growth with exceptional compensation including performance bonuses",
  },
  "civil-engineer": {
    role: "Civil Engineer",
    sector: "Engineering",
    sectorId: BigInt(6),
    description:
      "Civil Engineers design, build, and maintain infrastructure including roads, bridges, buildings, water systems, and transportation networks. They apply engineering principles to solve complex infrastructure challenges while ensuring safety, sustainability, and cost-effectiveness.",
    marketGrowth:
      "Civil engineering is growing at 5% annually, driven by aging infrastructure replacement, urbanization, and increased investment in sustainable infrastructure and climate resilience projects.",
    futureScope:
      "Civil engineering is being transformed by smart infrastructure, sustainable design, and digital twin technology. Engineers who specialize in green infrastructure, resilient design, and smart city systems will be in high demand as governments invest in climate adaptation and modernization.",
    averageSalary: "$95,000",
    salaryRange: "$70,000 – $120,000",
    keySkills: [
      "Structural analysis",
      "AutoCAD/BIM software",
      "Project management",
      "Environmental regulations",
      "Geotechnical engineering",
      "Construction management",
      "Technical writing",
      "Problem solving",
    ],
    roadmapSteps: [
      "Earn a Bachelor's in Civil Engineering (ABET accredited)",
      "Gain internship experience during studies",
      "Pass the Fundamentals of Engineering (FE) exam",
      "Work as an Engineer-in-Training (EIT)",
      "Accumulate 4 years of professional experience",
      "Pass the Professional Engineering (PE) exam",
      "Specialize in structural, transportation, or environmental engineering",
      "Advance to project manager or principal engineer",
    ],
    beginnerSkills: [
      "Engineering mathematics",
      "AutoCAD basics",
      "Material properties",
      "Technical drawing",
      "Basic surveying",
    ],
    intermediateSkills: [
      "Structural design",
      "Project scheduling",
      "Cost estimation",
      "Environmental compliance",
      "BIM software",
    ],
    advancedSkills: [
      "Complex structural analysis",
      "Project leadership",
      "Sustainable design",
      "Risk management",
      "Expert testimony",
    ],
    education:
      "Bachelor's in Civil Engineering; PE license required for independent practice",
    jobOutlook:
      "Steady — 5% growth with strong demand for infrastructure and sustainability projects",
  },
  "mechanical-engineer": {
    role: "Mechanical Engineer",
    sector: "Engineering",
    sectorId: BigInt(6),
    description:
      "Mechanical Engineers design, analyze, and test mechanical systems and machines. They work on products ranging from medical devices and HVAC systems to aerospace components and industrial machinery, applying physics and materials science principles to solve complex mechanical challenges.",
    marketGrowth:
      "Mechanical engineering is growing at 2% annually, with steady demand in automotive, aerospace, energy, and manufacturing sectors. Emerging opportunities exist in robotics, clean energy, and advanced manufacturing technologies.",
    futureScope:
      "Mechanical engineers are increasingly working at the intersection of hardware and software as robotics, autonomous systems, and smart manufacturing advance. Specializations in renewable energy systems, additive manufacturing, and mechatronics are becoming particularly valuable.",
    averageSalary: "$98,000",
    salaryRange: "$75,000 – $125,000",
    keySkills: [
      "CAD/CAM software (SolidWorks, AutoCAD)",
      "FEA (Finite Element Analysis)",
      "Thermodynamics",
      "Fluid mechanics",
      "Materials science",
      "Manufacturing processes",
      "Product design",
      "Prototyping",
    ],
    roadmapSteps: [
      "Earn ABET-accredited Bachelor's in Mechanical Engineering",
      "Master CAD software (SolidWorks or AutoCAD)",
      "Complete internship in manufacturing or product design",
      "Pass Fundamentals of Engineering (FE) exam",
      "Gain experience as Engineer-in-Training",
      "Pass Professional Engineering (PE) exam",
      "Specialize in robotics, HVAC, automotive, or energy",
      "Advance to senior engineer or engineering manager",
    ],
    beginnerSkills: [
      "Engineering drawing",
      "Basic CAD modeling",
      "Statics and dynamics",
      "Material selection basics",
      "Engineering math",
    ],
    intermediateSkills: [
      "Advanced CAD/CAM",
      "FEA simulation",
      "Product development lifecycle",
      "Manufacturing processes",
      "Tolerance analysis",
    ],
    advancedSkills: [
      "System integration",
      "Failure analysis",
      "R&D leadership",
      "Patent development",
      "Engineering management",
    ],
    education:
      "Bachelor's in Mechanical Engineering; PE license for independent consulting",
    jobOutlook:
      "Stable — 2% growth with consistent demand across manufacturing, energy, and aerospace",
  },
  "electrical-engineer": {
    role: "Electrical Engineer",
    sector: "Engineering",
    sectorId: BigInt(6),
    description:
      "Electrical Engineers design, develop, and test electrical systems, circuits, and power infrastructure. They work on everything from microchips and consumer electronics to power grids and renewable energy systems, ensuring reliable and efficient electrical solutions.",
    marketGrowth:
      "Electrical engineering is growing at 3% annually with strong demand in renewable energy, electric vehicles, semiconductor manufacturing, and smart grid technology. The energy transition is creating significant new opportunities.",
    futureScope:
      "The transition to renewable energy, electrification of transportation, and expansion of smart grid technology are driving massive demand for electrical engineers. Power electronics, battery technology, and embedded systems engineers will be especially valuable in the coming decade.",
    averageSalary: "$103,000",
    salaryRange: "$80,000 – $130,000",
    keySkills: [
      "Circuit design and analysis",
      "Power systems",
      "Embedded systems programming",
      "Signal processing",
      "MATLAB/Simulink",
      "PCB design",
      "Electrical codes (NEC)",
      "Control systems",
    ],
    roadmapSteps: [
      "Earn ABET-accredited Bachelor's in Electrical Engineering",
      "Learn circuit simulation tools (SPICE, MATLAB)",
      "Complete internship in power, electronics, or controls",
      "Pass FE exam and begin EIT work experience",
      "Develop embedded systems or power engineering expertise",
      "Pass PE exam for licensure",
      "Specialize in power, RF, embedded, or control systems",
      "Advance to lead engineer or engineering manager",
    ],
    beginnerSkills: [
      "Circuit theory",
      "Basic electronics",
      "Ohm's Law applications",
      "MATLAB basics",
      "Technical documentation",
    ],
    intermediateSkills: [
      "PCB design",
      "Power systems analysis",
      "Embedded C programming",
      "Signal processing",
      "Lab testing and measurement",
    ],
    advancedSkills: [
      "Power electronics design",
      "FPGA programming",
      "Grid integration",
      "Systems engineering",
      "Research and development",
    ],
    education:
      "Bachelor's in Electrical Engineering; PE license for utility or independent practice",
    jobOutlook:
      "Good — 3% growth with high demand in renewable energy, EVs, and semiconductor industries",
  },
  "aerospace-engineer": {
    role: "Aerospace Engineer",
    sector: "Engineering",
    sectorId: BigInt(6),
    description:
      "Aerospace Engineers design, develop, and test aircraft, spacecraft, satellites, and missiles. They apply principles of aerodynamics, propulsion, structures, and materials to create safe, efficient vehicles for atmospheric and space travel.",
    marketGrowth:
      "Aerospace engineering is growing at 6% annually, driven by commercial space exploration, UAV/drone technology, advanced military systems, and sustainable aviation fuel development. The new space economy is creating exciting new opportunities.",
    futureScope:
      "The commercial space industry, electric aviation, supersonic travel, and UAV/autonomous flight are transforming aerospace. Engineers with expertise in space systems, electric propulsion, and advanced composites will be in high demand as companies like SpaceX, Blue Origin, and electric aviation startups expand.",
    averageSalary: "$118,000",
    salaryRange: "$90,000 – $150,000",
    keySkills: [
      "Aerodynamics and flight mechanics",
      "Propulsion systems",
      "Structural analysis",
      "CAD/CAE tools (CATIA, ANSYS)",
      "Systems engineering",
      "Computational fluid dynamics",
      "Avionics",
      "Project management",
    ],
    roadmapSteps: [
      "Earn ABET-accredited Bachelor's in Aerospace Engineering",
      "Develop proficiency in CAD and simulation tools",
      "Complete internship with aerospace company or research lab",
      "Pass FE exam and begin professional experience",
      "Specialize in aerodynamics, structures, propulsion, or avionics",
      "Pursue Master's for research or advanced design roles",
      "Obtain PE license for independent engineering practice",
      "Advance to lead engineer, chief engineer, or technical fellow",
    ],
    beginnerSkills: [
      "Aerospace fundamentals",
      "MATLAB programming",
      "Technical documentation",
      "Basic CAD",
      "Physics applications",
    ],
    intermediateSkills: [
      "Aerodynamic analysis",
      "Structural FEA",
      "Propulsion system design",
      "Systems integration",
      "Flight testing basics",
    ],
    advancedSkills: [
      "Advanced CFD",
      "Mission systems design",
      "Composite structures",
      "Program management",
      "Technical leadership",
    ],
    education:
      "Bachelor's in Aerospace Engineering; Master's or PhD for research and advanced design roles",
    jobOutlook:
      "Strong — 6% growth with exciting opportunities in commercial space, UAV, and sustainable aviation",
  },
  "supply-chain": {
    role: "Supply Chain Manager",
    sector: "Commerce",
    sectorId: BigInt(3),
    description:
      "Supply Chain Managers oversee the end-to-end flow of goods, information, and finances from raw materials to final customers. They optimize procurement, production planning, warehousing, logistics, and distribution to minimize cost while maximizing service levels and operational efficiency.",
    marketGrowth:
      "Supply chain management is growing at 7% annually, accelerated by the lessons of global supply chain disruptions. Companies are investing heavily in resilient, data-driven supply chain capabilities with strong demand for skilled managers.",
    futureScope:
      "Supply chain is being transformed by AI demand forecasting, blockchain traceability, robotics-driven fulfillment, and nearshoring trends. Professionals with expertise in supply chain technology, risk management, and sustainable sourcing will be in high demand.",
    averageSalary: "$95,000",
    salaryRange: "$80,000 – $130,000",
    keySkills: [
      "Supply chain planning",
      "ERP systems (SAP, Oracle)",
      "Logistics management",
      "Supplier negotiations",
      "Inventory optimization",
      "Data analysis",
      "Risk management",
      "Contract management",
    ],
    roadmapSteps: [
      "Earn degree in supply chain, logistics, or business",
      "Learn ERP systems (SAP, Oracle, NetSuite)",
      "Start in purchasing, logistics, or operations role",
      "Get APICS CSCP or CPSM certification",
      "Develop cross-functional supply chain expertise",
      "Lead process improvement and cost reduction projects",
      "Manage supplier relationships and contracts",
      "Advance to Director of Supply Chain or VP Operations",
    ],
    beginnerSkills: [
      "Inventory basics",
      "Purchase orders",
      "Shipping and logistics",
      "Excel for tracking",
      "Supplier communication",
    ],
    intermediateSkills: [
      "Demand forecasting",
      "ERP system operation",
      "Supplier performance management",
      "Warehousing operations",
      "S&OP processes",
    ],
    advancedSkills: [
      "Supply chain network design",
      "Risk mitigation strategy",
      "Global sourcing",
      "Digital supply chain tools",
      "Executive stakeholder management",
    ],
    education:
      "Bachelor's in Supply Chain, Business, or Logistics; APICS certification strongly recommended",
    jobOutlook:
      "Good — 7% growth with strong demand for resilient, tech-savvy supply chain leaders",
  },
  "ecommerce-specialist": {
    role: "E-Commerce Specialist",
    sector: "Commerce",
    sectorId: BigInt(3),
    description:
      "E-Commerce Specialists manage online storefronts, product listings, digital sales channels, and customer experience for retail businesses. They optimize product pages for conversion, manage marketplace accounts, analyze sales data, and coordinate with marketing and logistics teams to drive online revenue growth.",
    marketGrowth:
      "E-commerce is growing at 15% annually as global online retail continues to expand. Mobile commerce, social commerce, and cross-border e-commerce are driving new growth channels and creating strong demand for specialists who can navigate multi-channel digital retail.",
    futureScope:
      "Live commerce, augmented reality shopping, and AI-powered personalization are the next frontiers of e-commerce. Specialists who can master headless commerce, marketplace optimization across Amazon/TikTok Shop/Shopify, and data-driven merchandising will be highly valuable.",
    averageSalary: "$70,000",
    salaryRange: "$55,000 – $90,000",
    keySkills: [
      "Shopify/Magento/WooCommerce",
      "Marketplace management (Amazon, eBay)",
      "Product page optimization",
      "Conversion rate optimization",
      "Google Analytics and e-commerce tracking",
      "Digital marketing basics",
      "Inventory management",
      "Customer experience design",
    ],
    roadmapSteps: [
      "Learn e-commerce platform fundamentals (Shopify, WooCommerce)",
      "Study digital marketing and SEO basics",
      "Build a test online store with real products",
      "Master Amazon Seller Central or Marketplace tools",
      "Learn Google Analytics 4 for e-commerce tracking",
      "Join e-commerce team or start freelance work",
      "Specialize in marketplace, DTC, or social commerce",
      "Advance to e-commerce manager or director",
    ],
    beginnerSkills: [
      "Product listing creation",
      "Order management",
      "Basic platform navigation",
      "Customer service",
      "Inventory tracking",
    ],
    intermediateSkills: [
      "Conversion optimization",
      "Paid advertising basics",
      "A/B testing",
      "Analytics reporting",
      "Email marketing",
    ],
    advancedSkills: [
      "Multi-channel strategy",
      "International e-commerce",
      "Advanced data analytics",
      "P&L management",
      "Platform API integrations",
    ],
    education:
      "Bachelor's in Business, Marketing, or related field; platform certifications (Shopify, Google) valuable",
    jobOutlook:
      "Excellent — 15% growth with strong demand as retail continues shifting online",
  },
  "marketing-manager": {
    role: "Marketing Manager",
    sector: "Marketing",
    sectorId: BigInt(9),
    description:
      "Marketing Managers lead the development and execution of marketing strategies to build brand awareness, generate leads, and drive revenue. They oversee marketing teams, manage budgets, coordinate campaigns across channels, and analyze performance data to optimize marketing ROI.",
    marketGrowth:
      "Marketing management is growing at 10% annually as companies invest in sophisticated multi-channel marketing strategies. Digital transformation, data-driven marketing, and the growing importance of customer experience are driving demand for skilled marketing leaders.",
    futureScope:
      "Marketing is being transformed by AI personalization, first-party data strategies, and immersive marketing experiences. Marketing managers who combine creative leadership with data analytics proficiency will be most competitive. CMO pathways offer significant earning potential and organizational influence.",
    averageSalary: "$105,000",
    salaryRange: "$80,000 – $140,000",
    keySkills: [
      "Marketing strategy",
      "Digital marketing",
      "Team leadership",
      "Budget management",
      "Brand management",
      "Data analytics",
      "Content strategy",
      "Campaign management",
    ],
    roadmapSteps: [
      "Earn marketing, business, or communications degree",
      "Start in marketing coordinator or specialist role",
      "Develop expertise in digital channels and analytics",
      "Get certified (Google, HubSpot, Meta)",
      "Lead campaigns and build measurable track record",
      "Manage a marketing team or function",
      "Pursue MBA for accelerated leadership path (optional)",
      "Advance to VP Marketing or Chief Marketing Officer",
    ],
    beginnerSkills: [
      "Marketing fundamentals",
      "Social media basics",
      "Content creation",
      "Email marketing",
      "Analytics basics",
    ],
    intermediateSkills: [
      "Campaign management",
      "Paid advertising",
      "Marketing automation",
      "Brand positioning",
      "Cross-channel strategy",
    ],
    advancedSkills: [
      "Marketing strategy development",
      "P&L ownership",
      "Team leadership",
      "Customer journey optimization",
      "Integrated marketing communications",
    ],
    education:
      "Bachelor's in Marketing, Business, or Communications; MBA beneficial for leadership roles",
    jobOutlook:
      "Strong — 10% growth with high compensation for experienced marketing leaders",
  },
  // Education sector
  teacher: {
    role: "K-12 Teacher",
    sector: "Education",
    sectorId: BigInt(8),
    description:
      "K-12 Teachers educate students from kindergarten through 12th grade, developing lesson plans, delivering instruction, assessing student progress, and fostering intellectual and personal growth. They create inclusive classroom environments that support diverse learning needs and inspire lifelong learning.",
    marketGrowth:
      "Teaching is growing at 5% annually, with strong demand in STEM subjects, special education, and bilingual education. Teacher shortages in many regions are creating significant opportunities for qualified educators with competitive compensation packages.",
    futureScope:
      "Education is being transformed by personalized learning technology, hybrid instruction models, and social-emotional learning integration. Teachers who embrace educational technology, data-driven instruction, and culturally responsive teaching will be most effective and sought after in modern classrooms.",
    averageSalary: "$60,000",
    salaryRange: "$45,000 – $75,000",
    keySkills: [
      "Lesson planning",
      "Classroom management",
      "Curriculum development",
      "Assessment design",
      "Student motivation",
      "Communication with parents",
      "Differentiated instruction",
      "Educational technology",
    ],
    roadmapSteps: [
      "Earn Bachelor's degree in Education or subject area",
      "Complete student teaching practicum (semester-long)",
      "Pass state Praxis or equivalent licensure exams",
      "Obtain teaching license from state education board",
      "Secure first teaching position in school or district",
      "Pursue Master's in Education or subject specialization",
      "Specialize in STEM, special education, or ESL",
      "Advance to department head, instructional coach, or administrator",
    ],
    beginnerSkills: [
      "Lesson plan writing",
      "Classroom setup",
      "Basic assessment creation",
      "Student communication",
      "Curriculum reading",
    ],
    intermediateSkills: [
      "Differentiated instruction",
      "Data-driven teaching",
      "Parent-teacher communication",
      "Ed tech integration",
      "Behavior management strategies",
    ],
    advancedSkills: [
      "Curriculum design",
      "Instructional leadership",
      "Mentoring new teachers",
      "Program evaluation",
      "Educational research",
    ],
    education:
      "Bachelor's in Education or subject area with education coursework; state teaching license required",
    jobOutlook:
      "Stable — 5% growth with teacher shortages creating strong opportunities in many regions",
  },
  "curriculum-designer": {
    role: "Curriculum Designer",
    sector: "Education",
    sectorId: BigInt(8),
    description:
      "Curriculum Designers develop educational programs, learning experiences, and instructional materials for schools, universities, and corporate training programs. They apply learning science principles to design engaging, effective curricula that meet educational standards and organizational objectives.",
    marketGrowth:
      "Curriculum and instructional design is growing at 8% annually, with strong demand in corporate learning and development, online education, and K-12 curriculum reform. The e-learning industry expansion is creating significant new opportunities for skilled designers.",
    futureScope:
      "The shift to digital and hybrid learning is transforming instructional design. Specialists in adaptive learning technology, microlearning, gamification, and xAPI learning analytics will be in high demand. AI-powered personalized learning is creating new design paradigms requiring updated skills.",
    averageSalary: "$72,000",
    salaryRange: "$55,000 – $90,000",
    keySkills: [
      "Instructional design (ADDIE, SAM models)",
      "eLearning authoring tools (Articulate, Lectora)",
      "Learning Management Systems (LMS)",
      "Assessment design",
      "Content writing",
      "Learning analytics",
      "UX for learning",
      "Subject matter expert collaboration",
    ],
    roadmapSteps: [
      "Earn degree in Education, Instructional Design, or related field",
      "Gain classroom teaching or training experience",
      "Get certified in instructional design (ATD or similar)",
      "Master eLearning tools (Articulate Storyline, Rise)",
      "Build portfolio of curriculum and course projects",
      "Join university, school district, or corporate L&D team",
      "Move to curriculum coordinator or senior designer role",
      "Advance to Director of Curriculum or Chief Learning Officer",
    ],
    beginnerSkills: [
      "Learning objectives writing",
      "Basic storyboarding",
      "Content organization",
      "Standard document design",
      "SME interviewing",
    ],
    intermediateSkills: [
      "Articulate Storyline/Rise",
      "LMS administration",
      "Multimedia integration",
      "Assessment item writing",
      "Evaluation methodology",
    ],
    advancedSkills: [
      "Learning program strategy",
      "Performance consulting",
      "xAPI and learning analytics",
      "Adaptive learning design",
      "L&D leadership",
    ],
    education:
      "Bachelor's in Education or Instructional Design; Master's in Learning & Development preferred for leadership roles",
    jobOutlook:
      "Good — 8% growth with strong demand in corporate L&D, higher education, and online learning",
  },
  "corporate-trainer": {
    role: "Corporate Trainer",
    sector: "Education",
    sectorId: BigInt(8),
    description:
      "Corporate Trainers design and deliver training programs that develop employee skills, improve performance, and support organizational goals. They facilitate workshops, create e-learning courses, conduct needs assessments, and measure training effectiveness across the workforce.",
    marketGrowth:
      "Corporate training is growing at 10% annually as organizations invest heavily in workforce development, leadership pipeline building, and reskilling for digital transformation. L&D is increasingly viewed as a strategic business function.",
    futureScope:
      "Corporate training is shifting toward personalized, on-demand learning experiences and AI-powered coaching tools. Trainers who can design blended learning programs, measure business impact, and consult on performance improvement will command premium compensation in the evolving L&D landscape.",
    averageSalary: "$78,000",
    salaryRange: "$60,000 – $100,000",
    keySkills: [
      "Facilitation and presentation",
      "Instructional design",
      "Needs assessment",
      "LMS platforms",
      "Training evaluation (Kirkpatrick model)",
      "Adult learning principles",
      "Content development",
      "Stakeholder management",
    ],
    roadmapSteps: [
      "Earn degree in HR, Education, or Organizational Development",
      "Gain teaching, coaching, or facilitation experience",
      "Get CPTD (Certified Professional in Talent Development) certification",
      "Learn LMS platforms (Cornerstone, Workday Learning)",
      "Develop a portfolio of training programs and materials",
      "Join corporate L&D team as trainer or specialist",
      "Specialize in leadership, technical, or compliance training",
      "Advance to L&D Manager or Director of People Development",
    ],
    beginnerSkills: [
      "Presentation skills",
      "Needs analysis basics",
      "Training material creation",
      "LMS navigation",
      "Adult learning principles",
    ],
    intermediateSkills: [
      "Workshop facilitation",
      "eLearning course development",
      "Training program design",
      "Evaluation and measurement",
      "Virtual training delivery",
    ],
    advancedSkills: [
      "Performance consulting",
      "L&D strategy",
      "ROI measurement",
      "Leadership development programs",
      "Organizational change support",
    ],
    education:
      "Bachelor's in HR, Education, or OD; CPTD or ATD certification highly valued",
    jobOutlook:
      "Strong — 10% growth with high demand for skilled L&D professionals in enterprise organizations",
  },
  // Marketing sector
  "digital-marketer": {
    role: "Digital Marketing Specialist",
    sector: "Marketing",
    sectorId: BigInt(9),
    description:
      "Digital Marketing Specialists plan and execute online marketing campaigns across search, social media, email, and display advertising channels. They analyze campaign performance, optimize audience targeting, and use data-driven insights to maximize ROI for marketing investments.",
    marketGrowth:
      "Digital marketing is growing at 14% annually as businesses shift advertising budgets from traditional to digital channels. Mobile marketing, programmatic advertising, and social commerce are driving particularly strong growth in specialist demand.",
    futureScope:
      "AI-powered advertising optimization, privacy-first marketing strategies, and first-party data are reshaping digital marketing. Specialists who master predictive audience modeling, conversion rate optimization, and omnichannel attribution will be most competitive as cookies phase out and AI automates routine campaign tasks.",
    averageSalary: "$72,000",
    salaryRange: "$55,000 – $95,000",
    keySkills: [
      "SEO/SEM",
      "Social media marketing",
      "Google Analytics 4",
      "Email marketing",
      "Content marketing",
      "Paid advertising (Google, Meta)",
      "A/B testing",
      "Data analysis",
    ],
    roadmapSteps: [
      "Study marketing fundamentals and digital channels",
      "Learn Google Analytics and Google Ads platform",
      "Master social media marketing (Meta, LinkedIn, TikTok)",
      "Earn Google Analytics and Meta Blueprint certifications",
      "Build portfolio with real campaigns (own projects or internship)",
      "Join a marketing agency or in-house digital team",
      "Specialize in paid media, SEO, or email marketing",
      "Advance to Digital Marketing Manager or Head of Growth",
    ],
    beginnerSkills: [
      "Social media posting",
      "Basic email newsletters",
      "Google Analytics setup",
      "Content calendar creation",
      "Ad account setup",
    ],
    intermediateSkills: [
      "Paid campaign management",
      "SEO optimization",
      "Marketing automation",
      "Audience segmentation",
      "Performance reporting",
    ],
    advancedSkills: [
      "Attribution modeling",
      "Advanced analytics",
      "Marketing mix optimization",
      "Programmatic advertising",
      "Growth strategy",
    ],
    education:
      "Bachelor's in Marketing or Communications; Google, Meta, and HubSpot certifications highly valuable",
    jobOutlook:
      "Excellent — 14% growth with strong demand across all industries and company sizes",
  },
  "brand-manager": {
    role: "Brand Manager",
    sector: "Marketing",
    sectorId: BigInt(9),
    description:
      "Brand Managers define and manage a brand's identity, positioning, and market presence. They oversee brand strategy, creative direction, product launches, and consumer communications to build brand equity and drive customer loyalty. They collaborate cross-functionally with marketing, product, and sales teams.",
    marketGrowth:
      "Brand management is growing at 10% annually as companies invest in building strong brand differentiation in competitive markets. Purpose-driven branding, brand experience, and social media brand building are creating new dimensions to the traditional brand management role.",
    futureScope:
      "Brand management is evolving with social media, influencer marketing, and real-time consumer engagement reshaping how brands are built and maintained. Brand managers who combine traditional brand strategy with digital fluency, data analytics, and agile campaign execution will lead the most successful brands.",
    averageSalary: "$100,000",
    salaryRange: "$80,000 – $130,000",
    keySkills: [
      "Brand strategy",
      "Consumer insights",
      "Campaign management",
      "Cross-functional leadership",
      "Creative direction",
      "Market research",
      "Budget management",
      "Storytelling",
    ],
    roadmapSteps: [
      "Earn Marketing or Business degree",
      "Start in marketing coordinator or brand assistant role",
      "Develop consumer insights and market research skills",
      "Work on product launches and brand campaigns",
      "Get MBA from top business school (optional but competitive)",
      "Lead brand strategy and creative development",
      "Manage brand P&L and drive measurable brand equity",
      "Advance to Senior Brand Manager or VP of Marketing",
    ],
    beginnerSkills: [
      "Brand guidelines",
      "Consumer research basics",
      "Creative brief writing",
      "Competitive analysis",
      "Social media monitoring",
    ],
    intermediateSkills: [
      "Brand positioning strategy",
      "Integrated campaign management",
      "Consumer segmentation",
      "Agency management",
      "Brand performance metrics",
    ],
    advancedSkills: [
      "Brand architecture strategy",
      "Global brand management",
      "P&L responsibility",
      "Brand M&A evaluation",
      "C-suite brand advisory",
    ],
    education:
      "Bachelor's in Marketing or Business; MBA from top school strongly preferred for senior brand roles",
    jobOutlook:
      "Strong — 10% growth with high compensation and clear path to CMO or general management",
  },
  "seo-specialist": {
    role: "SEO Specialist",
    sector: "Marketing",
    sectorId: BigInt(9),
    description:
      "SEO Specialists optimize websites and digital content to rank higher in search engine results pages. They conduct keyword research, optimize on-page content, improve technical site performance, build backlink profiles, and analyze organic search data to drive sustainable traffic growth.",
    marketGrowth:
      "SEO is growing at 12% annually as businesses increasingly rely on organic search as a primary customer acquisition channel. The complexity of modern SEO, including technical optimization, E-E-A-T signals, and AI-generated content management, is driving demand for skilled specialists.",
    futureScope:
      "AI-powered search (SGE, Bing AI) is transforming SEO, requiring specialists to adapt to answer-engine optimization and conversational search patterns. Technical SEO, structured data, and brand authority building will become more important as AI search changes how results are displayed and consumed.",
    averageSalary: "$65,000",
    salaryRange: "$50,000 – $85,000",
    keySkills: [
      "Keyword research",
      "On-page optimization",
      "Technical SEO",
      "Link building",
      "Google Analytics and Search Console",
      "Content strategy",
      "HTML/CSS basics",
      "Competitor analysis",
    ],
    roadmapSteps: [
      "Learn HTML and web fundamentals",
      "Study SEO fundamentals (Google guidelines, algorithms)",
      "Get Google Analytics 4 and Search Console certified",
      "Practice on personal websites or pro-bono projects",
      "Learn SEO tools (SEMrush, Ahrefs, Screaming Frog)",
      "Join a digital agency or in-house SEO team",
      "Build and document SEO case studies",
      "Advance to SEO Manager or Head of Organic Growth",
    ],
    beginnerSkills: [
      "Keyword basics",
      "Meta tag optimization",
      "Google Search Console setup",
      "Content SEO basics",
      "Site structure understanding",
    ],
    intermediateSkills: [
      "Technical SEO auditing",
      "Link building campaigns",
      "Content gap analysis",
      "Core Web Vitals optimization",
      "Local SEO",
    ],
    advancedSkills: [
      "International SEO strategy",
      "Enterprise SEO management",
      "Algorithm analysis",
      "SEO program management",
      "Conversion optimization",
    ],
    education:
      "Bachelor's in Marketing, Communications, or Computer Science; Google certifications highly valued",
    jobOutlook:
      "Good — 12% growth with strong demand in digital agencies, e-commerce, and enterprise marketing",
  },
  // Science sector
  "research-scientist": {
    role: "Research Scientist",
    sector: "Science",
    sectorId: BigInt(10),
    description:
      "Research Scientists conduct original scientific research to advance human knowledge, develop new products, and solve complex problems. They design experiments, analyze data, publish findings, and collaborate with interdisciplinary teams in universities, government labs, and private industry research centers.",
    marketGrowth:
      "Research science is growing at 8% annually, with strong demand in biotechnology, pharmaceutical R&D, climate science, and materials research. Increased government and private investment in scientific research is creating new opportunities across disciplines.",
    futureScope:
      "AI-assisted research, quantum computing, and advanced imaging technologies are accelerating the pace of scientific discovery. Research scientists who combine deep domain expertise with computational skills and cross-disciplinary collaboration abilities will lead the most impactful research programs.",
    averageSalary: "$98,000",
    salaryRange: "$75,000 – $130,000",
    keySkills: [
      "Experimental design",
      "Data analysis and statistics",
      "Scientific writing",
      "Laboratory techniques",
      "Statistical methods (R, Python)",
      "Literature review",
      "Grant writing",
      "Peer collaboration",
    ],
    roadmapSteps: [
      "Earn Bachelor's degree in relevant science field",
      "Pursue Master's degree with research thesis",
      "Complete PhD program with original research contribution",
      "Secure postdoctoral fellowship position",
      "Write and submit research grants",
      "Publish peer-reviewed research papers",
      "Join research institution, national lab, or industry R&D",
      "Advance to Principal Scientist or Research Director",
    ],
    beginnerSkills: [
      "Lab safety and protocols",
      "Basic data collection",
      "Literature searching",
      "Lab notebook documentation",
      "Statistical basics",
    ],
    intermediateSkills: [
      "Independent experiment design",
      "Advanced data analysis",
      "Scientific writing",
      "Conference presentations",
      "Grant application basics",
    ],
    advancedSkills: [
      "Original hypothesis generation",
      "Research program leadership",
      "Large grant management",
      "Interdisciplinary collaboration",
      "Mentoring junior scientists",
    ],
    education:
      "PhD in relevant science field required for senior roles; postdoctoral experience typically expected",
    jobOutlook:
      "Good — 8% growth with strong demand in biotech, pharma, and government research institutions",
  },
  "environmental-scientist": {
    role: "Environmental Scientist",
    sector: "Science",
    sectorId: BigInt(10),
    description:
      "Environmental Scientists study the natural environment, identify pollution and sustainability problems, and develop solutions to protect ecosystems and human health. They conduct field sampling, analyze environmental data, assess impacts of human activity, and advise on environmental policy and remediation strategies.",
    marketGrowth:
      "Environmental science is growing at 8% annually, driven by climate change response, increasing environmental regulations, and corporate sustainability commitments. Demand is particularly strong in environmental consulting, government agencies, and corporate ESG functions.",
    futureScope:
      "Climate adaptation science, carbon markets, ecosystem services valuation, and circular economy consulting are emerging high-growth areas. Environmental scientists who combine field expertise with GIS mapping, remote sensing, and climate modeling skills will be most competitive in a rapidly evolving field.",
    averageSalary: "$82,000",
    salaryRange: "$65,000 – $105,000",
    keySkills: [
      "Environmental monitoring",
      "GIS mapping and spatial analysis",
      "Data analysis",
      "Regulatory compliance (EPA, NEPA)",
      "Field sampling techniques",
      "Environmental impact assessment",
      "Report writing",
      "Stakeholder communication",
    ],
    roadmapSteps: [
      "Earn Bachelor's in Environmental Science, Biology, or Chemistry",
      "Gain field research experience through internships",
      "Learn EPA and NEPA regulatory frameworks",
      "Get GIS certification (ESRI or similar)",
      "Work for government agency or environmental consulting firm",
      "Specialize in air quality, water resources, or remediation",
      "Pursue Master's in Environmental Management or Policy",
      "Advance to Senior Environmental Consultant or Program Director",
    ],
    beginnerSkills: [
      "Field sampling basics",
      "Environmental regulations overview",
      "Lab analysis fundamentals",
      "Basic GIS",
      "Report writing",
    ],
    intermediateSkills: [
      "Environmental impact assessment",
      "Advanced GIS analysis",
      "Regulatory permitting",
      "Remediation project management",
      "Stakeholder engagement",
    ],
    advancedSkills: [
      "Climate risk modeling",
      "Environmental program leadership",
      "ESG strategy consulting",
      "Policy development",
      "Expert witness testimony",
    ],
    education:
      "Bachelor's in Environmental Science or related field; Master's preferred for government and consulting leadership roles",
    jobOutlook:
      "Good — 8% growth with strong demand driven by environmental regulation and climate action",
  },
  biotechnologist: {
    role: "Biotechnologist",
    sector: "Science",
    sectorId: BigInt(10),
    description:
      "Biotechnologists apply biological systems, living organisms, and molecular biology techniques to develop medical treatments, agricultural products, industrial processes, and scientific tools. They work on cutting-edge research in gene therapy, protein engineering, diagnostics, and sustainable biotechnology applications.",
    marketGrowth:
      "Biotechnology is growing at 11% annually, fueled by mRNA vaccine success, CRISPR gene editing advances, and expanding biologics markets. The convergence of AI with drug discovery and synthetic biology is creating extraordinary growth opportunities in the sector.",
    futureScope:
      "Gene and cell therapies, personalized medicine, synthetic biology, and agricultural biotech represent the most exciting frontiers. Biotechnologists with expertise in CRISPR, bioinformatics, and regulatory affairs will be highly valuable as the industry expands from pharma into food, materials, and industrial applications.",
    averageSalary: "$90,000",
    salaryRange: "$70,000 – $120,000",
    keySkills: [
      "Molecular biology techniques",
      "Cell culture",
      "PCR and sequencing",
      "Bioinformatics",
      "Laboratory safety and compliance",
      "Regulatory affairs basics",
      "Protein analysis",
      "Research design",
    ],
    roadmapSteps: [
      "Earn Bachelor's in Biochemistry, Biology, or Biotechnology",
      "Gain laboratory research experience (undergraduate lab)",
      "Pursue Master's or PhD in biotechnology or molecular biology",
      "Work in pharma or biotech company research lab",
      "Specialize in genomics, protein engineering, or cell therapy",
      "Publish research and build scientific reputation",
      "Gain regulatory affairs and GMP knowledge",
      "Advance to Senior Scientist or R&D Director",
    ],
    beginnerSkills: [
      "Basic lab techniques (pipetting, centrifugation)",
      "PCR fundamentals",
      "Cell culture basics",
      "Lab safety protocols",
      "Scientific documentation",
    ],
    intermediateSkills: [
      "Advanced molecular techniques",
      "Protein expression and purification",
      "Bioinformatics tools",
      "Experimental design",
      "Regulatory compliance basics",
    ],
    advancedSkills: [
      "CRISPR and gene editing",
      "Clinical trial support",
      "GMP manufacturing",
      "Intellectual property strategy",
      "R&D program leadership",
    ],
    education:
      "Bachelor's in Biochemistry or Biotechnology; PhD preferred for independent research roles in industry or academia",
    jobOutlook:
      "Excellent — 11% growth with exceptional demand in pharma, biotech, and agricultural technology",
  },
};

// Default job data for unknown job IDs
const DEFAULT_JOB = {
  role: "Career Professional",
  sector: "General",
  sectorId: BigInt(1),
  description:
    "This career path offers diverse opportunities for growth and development. Professionals in this field apply specialized knowledge and skills to solve complex problems and create value for organizations and society.",
  marketGrowth:
    "This field is experiencing steady growth driven by industry demand and technological advancement.",
  futureScope:
    "Strong future prospects with emerging specializations and evolving skill requirements.",
  averageSalary: "$75,000",
  salaryRange: "$55,000 – $100,000",
  keySkills: [
    "Communication",
    "Problem solving",
    "Analytical thinking",
    "Teamwork",
    "Continuous learning",
  ],
  roadmapSteps: [
    "Build foundational knowledge and skills",
    "Gain practical experience through internships",
    "Obtain relevant certifications",
    "Build a professional network",
    "Advance to senior roles",
  ],
  beginnerSkills: [
    "Core fundamentals",
    "Basic tools",
    "Communication",
    "Time management",
    "Research skills",
  ],
  intermediateSkills: [
    "Advanced techniques",
    "Project management",
    "Specialization",
    "Leadership basics",
    "Industry knowledge",
  ],
  advancedSkills: [
    "Expert-level skills",
    "Strategic thinking",
    "Mentoring",
    "Innovation",
    "Executive presence",
  ],
  education:
    "Bachelor's degree in relevant field; professional certifications recommended",
  jobOutlook: "Positive — steady demand with opportunities for advancement",
};

export default function JobDescriptionPage() {
  const pathParts = window.location.pathname.split("/");
  const jobId = decodeURIComponent(pathParts[pathParts.length - 1] || "");

  const job = JOB_DATA[jobId] || {
    ...DEFAULT_JOB,
    role: jobId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
  };

  const { data: roadmaps } = useGetAvailableRoadmaps(job.sectorId);

  // Merge backend roadmap steps with local data
  const roadmapSteps =
    roadmaps && roadmaps.length > 0 && roadmaps[0].steps.length > 0
      ? roadmaps[0].steps
      : job.roadmapSteps;

  const sectorColors: Record<string, string> = {
    Technology: "bg-blue-100 text-blue-700",
    Healthcare: "bg-green-100 text-green-700",
    Business: "bg-indigo-100 text-indigo-700",
    Finance: "bg-yellow-100 text-yellow-700",
    Engineering: "bg-gray-100 text-gray-700",
    Arts: "bg-pink-100 text-pink-700",
    Commerce: "bg-orange-100 text-orange-700",
    Education: "bg-teal-100 text-teal-700",
    Marketing: "bg-rose-100 text-rose-700",
    Science: "bg-cyan-100 text-cyan-700",
    General: "bg-purple-100 text-purple-700",
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => window.history.back()}
          className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        {/* Job Header */}
        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 mb-6 shadow-xs animate-fade-in">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 gradient-purple rounded-2xl flex items-center justify-center shadow-purple shrink-0">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <h1 className="font-display font-bold text-2xl sm:text-3xl text-foreground mb-1">
                    {job.role}
                  </h1>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      variant="secondary"
                      className={
                        sectorColors[job.sector] ||
                        "bg-purple-100 text-purple-700"
                      }
                    >
                      {job.sector}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {job.education}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p
                    className="font-display font-bold text-2xl"
                    style={{ color: "oklch(38% 0.22 278)" }}
                  >
                    {job.averageSalary}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    avg. salary/year
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-green-600 font-bold text-lg">
                <TrendingUp className="w-4 h-4" />
                {job.jobOutlook.split("—")[0].trim()}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Job Outlook
              </p>
            </div>
            <div className="text-center">
              <p className="font-bold text-lg text-foreground">
                {job.salaryRange}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Salary Range
              </p>
            </div>
            <div className="text-center">
              <p
                className="font-bold text-lg"
                style={{ color: "oklch(60% 0.22 285)" }}
              >
                {job.sector}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Industry</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* 1. Job Description */}
          <Card className="border border-border shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 font-display text-lg">
                <div className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-primary" />
                </div>
                Job Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {job.description}
              </p>
            </CardContent>
          </Card>

          {/* 2. Market Growth */}
          <Card className="border border-border shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 font-display text-lg">
                <div className="w-7 h-7 bg-green-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-green-600" />
                </div>
                Job Growth in Market
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {job.marketGrowth}
              </p>
            </CardContent>
          </Card>

          {/* 3. Future Scope */}
          <Card className="border border-border shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 font-display text-lg">
                <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Telescope className="w-4 h-4 text-blue-600" />
                </div>
                Future Scope
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {job.futureScope}
              </p>
            </CardContent>
          </Card>

          {/* 4. Average Salary */}
          <Card className="border border-border shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 font-display text-lg">
                <div className="w-7 h-7 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-yellow-600" />
                </div>
                Average Salary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6 flex-wrap">
                <div>
                  <p
                    className="font-display font-bold text-3xl"
                    style={{ color: "oklch(38% 0.22 278)" }}
                  >
                    {job.averageSalary}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Average annual salary
                  </p>
                </div>
                <div className="h-12 w-px bg-border hidden sm:block" />
                <div>
                  <p className="font-semibold text-foreground">
                    {job.salaryRange}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Typical salary range
                  </p>
                </div>
                <div className="h-12 w-px bg-border hidden sm:block" />
                <div>
                  <p className="font-semibold text-green-600 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    {job.jobOutlook.split("—")[0].trim()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Job outlook
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 5. Roadmap */}
          <Card className="border border-border shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 font-display text-lg">
                <div className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Layers className="w-4 h-4 text-primary" />
                </div>
                Career Roadmap
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RoadmapTimeline steps={roadmapSteps} />
            </CardContent>
          </Card>

          {/* 6. Key Skills */}
          <Card className="border border-border shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 font-display text-lg">
                <div className="w-7 h-7 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Star className="w-4 h-4 text-purple-600" />
                </div>
                Key Skills Required
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {job.keySkills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="bg-primary/10 text-primary border-0 text-xs py-1 px-3"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 7. Skill Levels */}
          <Card className="border border-border shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 font-display text-lg">
                <div className="w-7 h-7 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                </div>
                Skills by Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-3 gap-4">
                {/* Beginner */}
                <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <h4 className="font-semibold text-sm text-green-700">
                      Beginner
                    </h4>
                  </div>
                  <ul className="space-y-1.5">
                    {job.beginnerSkills.map((skill) => (
                      <li
                        key={skill}
                        className="flex items-start gap-1.5 text-xs text-green-800"
                      >
                        <CheckCircle2 className="w-3 h-3 text-green-500 mt-0.5 shrink-0" />
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Intermediate */}
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <h4 className="font-semibold text-sm text-blue-700">
                      Intermediate
                    </h4>
                  </div>
                  <ul className="space-y-1.5">
                    {job.intermediateSkills.map((skill) => (
                      <li
                        key={skill}
                        className="flex items-start gap-1.5 text-xs text-blue-800"
                      >
                        <CheckCircle2 className="w-3 h-3 text-blue-500 mt-0.5 shrink-0" />
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Advanced */}
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <h4 className="font-semibold text-sm text-primary">
                      Advanced
                    </h4>
                  </div>
                  <ul className="space-y-1.5">
                    {job.advancedSkills.map((skill) => (
                      <li
                        key={skill}
                        className="flex items-start gap-1.5 text-xs text-purple-800"
                      >
                        <CheckCircle2 className="w-3 h-3 text-primary mt-0.5 shrink-0" />
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Button
            asChild
            className="bg-primary text-primary-foreground font-semibold shadow-purple hover:shadow-purple-lg hover:opacity-90 transition-all"
          >
            <a href="/skill-assessment">Take Skill Assessment</a>
          </Button>
          <Button
            variant="outline"
            asChild
            className="border-primary/30 text-primary hover:bg-primary/5"
          >
            <a href="/job-search">Explore More Jobs</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
