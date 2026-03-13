import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import type { Sector } from "../backend";
import {
  useGetRandomQuestions,
  useSubmitQuizAnswers,
} from "../hooks/useQueries";

// Comprehensive question bank per sector
const SECTOR_QUESTIONS: Record<string, { text: string; answers: string[] }[]> =
  {
    "1": [
      {
        text: "How comfortable are you with learning new programming languages?",
        answers: [
          "Very comfortable",
          "Somewhat comfortable",
          "Neutral",
          "Not comfortable",
        ],
      },
      {
        text: "Do you enjoy solving complex logical puzzles?",
        answers: ["Love it", "Enjoy it", "It's okay", "Not really"],
      },
      {
        text: "How interested are you in building software applications?",
        answers: [
          "Extremely interested",
          "Very interested",
          "Somewhat interested",
          "Not interested",
        ],
      },
      {
        text: "Do you prefer working with data and analytics?",
        answers: [
          "Yes, love data",
          "Somewhat",
          "Neutral",
          "Prefer other areas",
        ],
      },
      {
        text: "How do you feel about cybersecurity and protecting systems?",
        answers: [
          "Passionate about it",
          "Interested",
          "Neutral",
          "Not my area",
        ],
      },
      {
        text: "Are you interested in artificial intelligence and machine learning?",
        answers: ["Extremely", "Very much", "Somewhat", "Not really"],
      },
      {
        text: "Do you enjoy designing user interfaces and experiences?",
        answers: ["Love design", "Enjoy it", "It's okay", "Prefer backend"],
      },
      {
        text: "How interested are you in cloud computing and infrastructure?",
        answers: ["Very interested", "Interested", "Neutral", "Not interested"],
      },
      {
        text: "Do you like working on mobile app development?",
        answers: ["Yes, love it", "Interested", "Neutral", "Prefer web"],
      },
      {
        text: "How do you feel about working in agile/scrum teams?",
        answers: ["Love teamwork", "Enjoy it", "Neutral", "Prefer solo"],
      },
      {
        text: "Are you interested in blockchain and Web3 technologies?",
        answers: ["Very interested", "Somewhat", "Neutral", "Not interested"],
      },
      {
        text: "Do you enjoy automating repetitive tasks?",
        answers: ["Love automation", "Yes", "Sometimes", "Not really"],
      },
      {
        text: "How comfortable are you with mathematics and algorithms?",
        answers: ["Very comfortable", "Comfortable", "Neutral", "Challenging"],
      },
      {
        text: "Are you interested in game development?",
        answers: ["Passionate", "Interested", "Neutral", "Not my thing"],
      },
      {
        text: "Do you prefer frontend, backend, or full-stack development?",
        answers: ["Frontend", "Backend", "Full-stack", "DevOps/Infrastructure"],
      },
    ],
    "2": [
      {
        text: "How passionate are you about helping people with their health?",
        answers: [
          "Extremely passionate",
          "Very passionate",
          "Somewhat",
          "Not sure",
        ],
      },
      {
        text: "Are you comfortable working in high-pressure medical environments?",
        answers: [
          "Very comfortable",
          "Comfortable",
          "Somewhat",
          "Not comfortable",
        ],
      },
      {
        text: "Do you have interest in medical research and innovation?",
        answers: ["Very interested", "Interested", "Neutral", "Not interested"],
      },
      {
        text: "How do you feel about patient care and bedside manner?",
        answers: [
          "Love patient interaction",
          "Enjoy it",
          "Neutral",
          "Prefer lab work",
        ],
      },
      {
        text: "Are you interested in mental health and psychology?",
        answers: ["Very interested", "Interested", "Somewhat", "Not my area"],
      },
      {
        text: "Do you prefer clinical work or administrative healthcare roles?",
        answers: ["Clinical", "Administrative", "Both", "Research"],
      },
      {
        text: "How interested are you in public health and epidemiology?",
        answers: ["Very interested", "Interested", "Neutral", "Not interested"],
      },
      {
        text: "Are you drawn to surgical or procedural specialties?",
        answers: ["Very drawn", "Somewhat", "Neutral", "Prefer non-surgical"],
      },
      {
        text: "Do you enjoy working with medical technology and devices?",
        answers: ["Love it", "Enjoy it", "Neutral", "Prefer direct care"],
      },
      {
        text: "How do you feel about long shifts and irregular hours?",
        answers: [
          "Fine with it",
          "Can manage",
          "Prefer regular hours",
          "Not ideal",
        ],
      },
      {
        text: "Are you interested in nutrition and preventive medicine?",
        answers: ["Very interested", "Interested", "Neutral", "Not interested"],
      },
      {
        text: "Do you want to specialize in pediatrics or geriatrics?",
        answers: ["Pediatrics", "Geriatrics", "Both", "Neither"],
      },
      {
        text: "How comfortable are you with continuous learning and certifications?",
        answers: ["Love learning", "Comfortable", "Neutral", "Challenging"],
      },
      {
        text: "Are you interested in telemedicine and digital health?",
        answers: [
          "Very interested",
          "Interested",
          "Neutral",
          "Prefer in-person",
        ],
      },
      {
        text: "Do you prefer working in hospitals, clinics, or community health?",
        answers: ["Hospitals", "Clinics", "Community", "Research institutions"],
      },
    ],
    "3": [
      {
        text: "How interested are you in retail and e-commerce?",
        answers: ["Very interested", "Interested", "Neutral", "Not interested"],
      },
      {
        text: "Do you enjoy negotiating deals and managing suppliers?",
        answers: ["Love it", "Enjoy it", "It's okay", "Not really"],
      },
      {
        text: "How comfortable are you with inventory and supply chain management?",
        answers: [
          "Very comfortable",
          "Comfortable",
          "Neutral",
          "Not comfortable",
        ],
      },
      {
        text: "Are you interested in international trade and import/export?",
        answers: ["Very interested", "Interested", "Neutral", "Not interested"],
      },
      {
        text: "Do you enjoy analysing consumer trends and buying patterns?",
        answers: ["Love it", "Enjoy it", "Neutral", "Not my thing"],
      },
      {
        text: "How interested are you in logistics and distribution?",
        answers: ["Very interested", "Interested", "Neutral", "Not interested"],
      },
      {
        text: "Do you prefer working in physical stores or online platforms?",
        answers: [
          "Physical stores",
          "Online platforms",
          "Both",
          "Wholesale/B2B",
        ],
      },
      {
        text: "How do you feel about managing a sales team?",
        answers: [
          "Love leading",
          "Open to it",
          "Prefer individual",
          "Not sure",
        ],
      },
      {
        text: "Are you interested in product sourcing and procurement?",
        answers: ["Very interested", "Interested", "Neutral", "Not interested"],
      },
      {
        text: "How comfortable are you with pricing strategy and margin management?",
        answers: [
          "Very comfortable",
          "Comfortable",
          "Neutral",
          "Still learning",
        ],
      },
      {
        text: "Do you enjoy customer relationship management?",
        answers: ["Love it", "Enjoy it", "Neutral", "Prefer backend ops"],
      },
      {
        text: "How interested are you in sustainable and ethical trade practices?",
        answers: ["Very interested", "Interested", "Neutral", "Not a priority"],
      },
      {
        text: "Are you comfortable with data-driven merchandising decisions?",
        answers: [
          "Very comfortable",
          "Comfortable",
          "Neutral",
          "Prefer instinct",
        ],
      },
      {
        text: "Do you enjoy working across multiple product categories?",
        answers: ["Love variety", "Enjoy it", "Prefer focus", "No preference"],
      },
      {
        text: "How important is fast-paced decision-making to you in commerce?",
        answers: [
          "Love the pace",
          "Can manage",
          "Prefer steady pace",
          "Need more time",
        ],
      },
    ],
    "4": [
      {
        text: "How passionate are you about visual design and aesthetics?",
        answers: [
          "Extremely passionate",
          "Very passionate",
          "Somewhat",
          "Not sure",
        ],
      },
      {
        text: "Do you enjoy creating original artwork or creative content?",
        answers: ["Love it", "Enjoy it", "Occasionally", "Not really"],
      },
      {
        text: "How interested are you in film, photography, or video production?",
        answers: ["Very interested", "Interested", "Neutral", "Not interested"],
      },
      {
        text: "Are you drawn to performing arts such as music, dance, or theatre?",
        answers: [
          "Very drawn",
          "Somewhat drawn",
          "Neutral",
          "Prefer behind the scenes",
        ],
      },
      {
        text: "Do you enjoy writing, storytelling, or content creation?",
        answers: ["Love it", "Enjoy it", "Neutral", "Not my strength"],
      },
      {
        text: "How comfortable are you with digital art tools (e.g., Photoshop, Illustrator)?",
        answers: ["Very comfortable", "Comfortable", "Learning", "Not yet"],
      },
      {
        text: "Are you interested in animation or motion graphics?",
        answers: ["Very interested", "Interested", "Neutral", "Not interested"],
      },
      {
        text: "Do you prefer working in a studio, on set, or remotely?",
        answers: ["Studio", "On set", "Remote", "No preference"],
      },
      {
        text: "How important is creative freedom in your ideal career?",
        answers: [
          "Essential",
          "Very important",
          "Somewhat important",
          "Can work within constraints",
        ],
      },
      {
        text: "Are you interested in art direction or creative strategy for brands?",
        answers: [
          "Very interested",
          "Interested",
          "Neutral",
          "Prefer pure art",
        ],
      },
      {
        text: "Do you enjoy collaborating with other creatives on projects?",
        answers: [
          "Love collaboration",
          "Enjoy it",
          "Sometimes",
          "Prefer solo work",
        ],
      },
      {
        text: "How interested are you in the business side of the creative industry?",
        answers: [
          "Very interested",
          "Interested",
          "Neutral",
          "Just the art please",
        ],
      },
      {
        text: "Are you drawn to UX/UI design or product design?",
        answers: ["Very drawn", "Somewhat", "Neutral", "Prefer fine art"],
      },
      {
        text: "How do you feel about tight deadlines in creative projects?",
        answers: [
          "Thrive under pressure",
          "Can manage",
          "Prefer flexibility",
          "Find it stressful",
        ],
      },
      {
        text: "Do you want to build a personal brand as a creative professional?",
        answers: ["Absolutely", "Interested", "Maybe", "Not important"],
      },
    ],
    "5": [
      {
        text: "How interested are you in starting or running your own business?",
        answers: ["Very interested", "Interested", "Neutral", "Not interested"],
      },
      {
        text: "Do you enjoy strategic planning and goal setting?",
        answers: ["Love it", "Enjoy it", "It's okay", "Not really"],
      },
      {
        text: "How comfortable are you with leadership and managing people?",
        answers: [
          "Very comfortable",
          "Comfortable",
          "Neutral",
          "Still developing",
        ],
      },
      {
        text: "Are you interested in operations management and process improvement?",
        answers: ["Very interested", "Interested", "Neutral", "Not interested"],
      },
      {
        text: "Do you enjoy analysing business performance using data?",
        answers: ["Love data", "Enjoy it", "Neutral", "Prefer people skills"],
      },
      {
        text: "How interested are you in human resources and organisational culture?",
        answers: ["Very interested", "Interested", "Neutral", "Not interested"],
      },
      {
        text: "Do you prefer working in large corporations or startups?",
        answers: [
          "Large corporation",
          "Startup",
          "SME/Mid-size",
          "Any environment",
        ],
      },
      {
        text: "How comfortable are you with presenting to stakeholders?",
        answers: [
          "Very comfortable",
          "Comfortable",
          "Neutral",
          "Need practice",
        ],
      },
      {
        text: "Are you interested in business development and partnerships?",
        answers: ["Very interested", "Interested", "Neutral", "Not interested"],
      },
      {
        text: "How do you feel about managing budgets and financial performance?",
        answers: ["Love it", "Comfortable", "Neutral", "Prefer to delegate"],
      },
      {
        text: "Do you enjoy project management and coordinating cross-functional teams?",
        answers: ["Love it", "Enjoy it", "Neutral", "Not my preference"],
      },
      {
        text: "How interested are you in corporate strategy and consulting?",
        answers: ["Very interested", "Interested", "Neutral", "Not interested"],
      },
      {
        text: "Are you drawn to change management and organisational transformation?",
        answers: ["Very drawn", "Interested", "Neutral", "Prefer stability"],
      },
      {
        text: "Do you want to work in a specific industry or be a generalist?",
        answers: [
          "Specific industry",
          "Generalist",
          "Still exploring",
          "Either works",
        ],
      },
      {
        text: "How important is networking and relationship building to your career?",
        answers: [
          "Extremely important",
          "Very important",
          "Somewhat",
          "Prefer to let work speak",
        ],
      },
    ],
    "6": [
      {
        text: "Which engineering discipline interests you most?",
        answers: [
          "Civil/Structural",
          "Mechanical",
          "Electrical/Electronics",
          "Chemical/Process",
        ],
      },
      {
        text: "How comfortable are you with mathematics and physics?",
        answers: ["Very comfortable", "Comfortable", "Neutral", "Challenging"],
      },
      {
        text: "Do you enjoy hands-on building, prototyping, or lab work?",
        answers: ["Love it", "Enjoy it", "Neutral", "Prefer design/theory"],
      },
      {
        text: "Are you interested in sustainable engineering and green technologies?",
        answers: ["Very interested", "Interested", "Neutral", "Not a priority"],
      },
      {
        text: "How interested are you in design and CAD software?",
        answers: ["Very interested", "Interested", "Neutral", "Not interested"],
      },
      {
        text: "Do you prefer working on large infrastructure projects or small devices?",
        answers: [
          "Large infrastructure",
          "Small devices",
          "Both",
          "Software systems",
        ],
      },
      {
        text: "How comfortable are you with technical documentation and reports?",
        answers: [
          "Very comfortable",
          "Comfortable",
          "Neutral",
          "Find it tedious",
        ],
      },
      {
        text: "Are you interested in robotics and automation?",
        answers: ["Very interested", "Interested", "Neutral", "Not interested"],
      },
      {
        text: "Do you enjoy failure analysis and problem-solving under constraints?",
        answers: [
          "Love the challenge",
          "Enjoy it",
          "Neutral",
          "Prefer design phase",
        ],
      },
      {
        text: "How interested are you in project and site management?",
        answers: [
          "Very interested",
          "Interested",
          "Neutral",
          "Prefer technical work",
        ],
      },
      {
        text: "Are you drawn to research and development or production/manufacturing?",
        answers: ["R&D", "Manufacturing", "Both", "Consulting"],
      },
      {
        text: "How do you feel about working in regulated industries (e.g., aerospace, nuclear)?",
        answers: [
          "Excited by it",
          "Fine with it",
          "Neutral",
          "Prefer less regulation",
        ],
      },
      {
        text: "Do you want to pursue professional accreditation (e.g., CEng)?",
        answers: [
          "Definitely",
          "Considering it",
          "Maybe later",
          "Not necessary",
        ],
      },
      {
        text: "How interested are you in IoT and embedded systems?",
        answers: ["Very interested", "Interested", "Neutral", "Not interested"],
      },
      {
        text: "Do you prefer working in a team of engineers or independently?",
        answers: ["Team", "Independently", "Mix of both", "Leading a team"],
      },
    ],
    "7": [
      {
        text: "How interested are you in investment banking or capital markets?",
        answers: ["Very interested", "Interested", "Neutral", "Not interested"],
      },
      {
        text: "Do you enjoy analysing financial statements and company performance?",
        answers: ["Love it", "Enjoy it", "It's okay", "Not really"],
      },
      {
        text: "How comfortable are you with financial modelling and spreadsheets?",
        answers: [
          "Very comfortable",
          "Comfortable",
          "Neutral",
          "Still learning",
        ],
      },
      {
        text: "Are you interested in personal financial planning and wealth management?",
        answers: ["Very interested", "Interested", "Neutral", "Not interested"],
      },
      {
        text: "Do you prefer working with corporate clients or individual investors?",
        answers: [
          "Corporate clients",
          "Individual investors",
          "Both",
          "Institutional",
        ],
      },
      {
        text: "How interested are you in risk management and compliance?",
        answers: ["Very interested", "Interested", "Neutral", "Not interested"],
      },
      {
        text: "Are you drawn to accounting and auditing roles?",
        answers: ["Very drawn", "Somewhat", "Neutral", "Prefer front-office"],
      },
      {
        text: "How do you feel about working in fast-paced trading environments?",
        answers: [
          "Love the energy",
          "Can manage",
          "Prefer steady pace",
          "Not for me",
        ],
      },
      {
        text: "Are you interested in FinTech and digital finance innovation?",
        answers: ["Very interested", "Interested", "Neutral", "Not interested"],
      },
      {
        text: "How comfortable are you with economic analysis and forecasting?",
        answers: ["Very comfortable", "Comfortable", "Neutral", "Challenging"],
      },
      {
        text: "Do you enjoy tax planning and advisory work?",
        answers: ["Love it", "Open to it", "Neutral", "Not my preference"],
      },
      {
        text: "How interested are you in ESG (Environmental, Social, Governance) investing?",
        answers: ["Very interested", "Interested", "Neutral", "Not interested"],
      },
      {
        text: "Are you comfortable working towards professional qualifications (e.g., CFA, ACCA)?",
        answers: [
          "Definitely",
          "Willing to",
          "Considering it",
          "Prefer experience-based",
        ],
      },
      {
        text: "Do you want to specialise in a financial sub-sector or be a generalist?",
        answers: [
          "Specialise",
          "Generalist",
          "Still exploring",
          "Either works",
        ],
      },
      {
        text: "How important is earning potential when choosing a finance career?",
        answers: [
          "Top priority",
          "Very important",
          "Important",
          "Not the main driver",
        ],
      },
    ],
    "8": [
      {
        text: "How passionate are you about teaching and mentoring others?",
        answers: [
          "Extremely passionate",
          "Very passionate",
          "Somewhat",
          "Still exploring",
        ],
      },
      {
        text: "Do you enjoy designing learning materials and curriculum?",
        answers: ["Love it", "Enjoy it", "Neutral", "Not really"],
      },
      {
        text: "How interested are you in early childhood or primary education?",
        answers: [
          "Very interested",
          "Interested",
          "Neutral",
          "Prefer older students",
        ],
      },
      {
        text: "Are you drawn to higher education, lecturing, or academic research?",
        answers: ["Very drawn", "Interested", "Neutral", "Prefer K-12"],
      },
      {
        text: "How comfortable are you with classroom management and student engagement?",
        answers: [
          "Very comfortable",
          "Comfortable",
          "Neutral",
          "Still developing",
        ],
      },
      {
        text: "Are you interested in special education or inclusive learning?",
        answers: ["Very interested", "Interested", "Neutral", "Not my focus"],
      },
      {
        text: "Do you enjoy using technology and digital tools in teaching?",
        answers: ["Love EdTech", "Enjoy it", "Neutral", "Prefer traditional"],
      },
      {
        text: "How interested are you in education policy and administration?",
        answers: [
          "Very interested",
          "Interested",
          "Neutral",
          "Prefer classroom",
        ],
      },
      {
        text: "Are you drawn to corporate training and professional development?",
        answers: [
          "Very drawn",
          "Interested",
          "Neutral",
          "Prefer school setting",
        ],
      },
      {
        text: "How do you feel about continuous professional development for teachers?",
        answers: [
          "Love learning",
          "Embrace it",
          "Neutral",
          "Find it demanding",
        ],
      },
      {
        text: "Do you want to work in private, public, or international schools?",
        answers: ["Private", "Public", "International", "Higher education"],
      },
      {
        text: "Are you interested in education research and publishing?",
        answers: ["Very interested", "Interested", "Neutral", "Not interested"],
      },
      {
        text: "How important is making a social impact through education?",
        answers: [
          "Extremely important",
          "Very important",
          "Important",
          "Somewhat important",
        ],
      },
      {
        text: "Do you enjoy coaching and extracurricular leadership?",
        answers: [
          "Love it",
          "Enjoy it",
          "Occasionally",
          "Prefer academic focus",
        ],
      },
      {
        text: "Are you comfortable with student assessments and data-driven teaching?",
        answers: [
          "Very comfortable",
          "Comfortable",
          "Neutral",
          "Prefer holistic approach",
        ],
      },
    ],
    "9": [
      {
        text: "How passionate are you about brand building and storytelling?",
        answers: [
          "Extremely passionate",
          "Very passionate",
          "Somewhat",
          "Not sure",
        ],
      },
      {
        text: "Do you enjoy creating digital content (social media, blogs, videos)?",
        answers: ["Love it", "Enjoy it", "Occasionally", "Not really"],
      },
      {
        text: "How interested are you in search engine optimisation (SEO) and paid ads?",
        answers: ["Very interested", "Interested", "Neutral", "Not interested"],
      },
      {
        text: "Are you drawn to market research and consumer psychology?",
        answers: [
          "Very drawn",
          "Interested",
          "Neutral",
          "Prefer creative side",
        ],
      },
      {
        text: "Do you enjoy analysing campaign performance and marketing metrics?",
        answers: ["Love data", "Enjoy it", "Neutral", "Prefer creative work"],
      },
      {
        text: "How interested are you in public relations and media outreach?",
        answers: ["Very interested", "Interested", "Neutral", "Not interested"],
      },
      {
        text: "Do you prefer B2B or B2C marketing?",
        answers: ["B2B", "B2C", "Both", "Still exploring"],
      },
      {
        text: "How comfortable are you with marketing automation and CRM tools?",
        answers: ["Very comfortable", "Comfortable", "Learning", "Not yet"],
      },
      {
        text: "Are you interested in influencer marketing and social media strategy?",
        answers: ["Very interested", "Interested", "Neutral", "Not interested"],
      },
      {
        text: "Do you enjoy event planning and experiential marketing?",
        answers: ["Love it", "Enjoy it", "Neutral", "Prefer digital"],
      },
      {
        text: "How important is creativity vs. analytics in your ideal marketing role?",
        answers: [
          "Mostly creative",
          "Mostly analytical",
          "Equal balance",
          "Depends on the project",
        ],
      },
      {
        text: "Are you interested in global marketing and cross-cultural campaigns?",
        answers: ["Very interested", "Interested", "Neutral", "Prefer local"],
      },
      {
        text: "Do you want to specialise in a specific channel (email, social, PPC)?",
        answers: [
          "Yes, specialise",
          "Generalist marketer",
          "Still exploring",
          "Depends on role",
        ],
      },
      {
        text: "How do you feel about working to aggressive growth and revenue targets?",
        answers: [
          "Thrive on targets",
          "Can manage",
          "Prefer collaborative goals",
          "Find it stressful",
        ],
      },
      {
        text: "Are you drawn to startup marketing or established brand marketing?",
        answers: [
          "Startup",
          "Established brand",
          "Agency side",
          "Either works",
        ],
      },
    ],
    "10": [
      {
        text: "Which scientific area interests you most?",
        answers: [
          "Biology/Life sciences",
          "Chemistry",
          "Physics",
          "Environmental science",
        ],
      },
      {
        text: "Do you enjoy conducting experiments and laboratory work?",
        answers: ["Love it", "Enjoy it", "Neutral", "Prefer fieldwork"],
      },
      {
        text: "How comfortable are you with statistical analysis and data interpretation?",
        answers: ["Very comfortable", "Comfortable", "Neutral", "Challenging"],
      },
      {
        text: "Are you interested in medical or pharmaceutical research?",
        answers: ["Very interested", "Interested", "Neutral", "Not interested"],
      },
      {
        text: "Do you enjoy writing research papers and publishing findings?",
        answers: ["Love it", "Enjoy it", "Neutral", "Find it tedious"],
      },
      {
        text: "How interested are you in climate change and environmental sustainability?",
        answers: ["Very interested", "Interested", "Neutral", "Not my focus"],
      },
      {
        text: "Are you drawn to applied science (industry) or pure research (academia)?",
        answers: ["Applied/Industry", "Pure/Academic", "Both", "Not sure yet"],
      },
      {
        text: "How comfortable are you with scientific computing and programming?",
        answers: ["Very comfortable", "Comfortable", "Learning", "Not yet"],
      },
      {
        text: "Do you enjoy working with microscopes, spectrometers, or other instruments?",
        answers: [
          "Love lab equipment",
          "Enjoy it",
          "Neutral",
          "Prefer computational work",
        ],
      },
      {
        text: "Are you interested in genetics, genomics, or biotechnology?",
        answers: ["Very interested", "Interested", "Neutral", "Not interested"],
      },
      {
        text: "How do you feel about long-term multi-year research projects?",
        answers: [
          "Excited",
          "Fine with it",
          "Prefer shorter cycles",
          "Not ideal",
        ],
      },
      {
        text: "Do you want to work in government, academia, or the private sector?",
        answers: [
          "Government/Public",
          "Academia",
          "Private sector",
          "NGO/Non-profit",
        ],
      },
      {
        text: "How interested are you in interdisciplinary science (e.g., bioinformatics)?",
        answers: [
          "Very interested",
          "Interested",
          "Neutral",
          "Prefer single discipline",
        ],
      },
      {
        text: "Are you drawn to science communication and public outreach?",
        answers: [
          "Very drawn",
          "Interested",
          "Neutral",
          "Prefer research only",
        ],
      },
      {
        text: "How important is making breakthrough discoveries in your science career?",
        answers: [
          "Core motivation",
          "Very important",
          "Important",
          "Happy with applied impact",
        ],
      },
    ],
    default: [
      {
        text: "What type of work environment do you prefer?",
        answers: [
          "Office/Corporate",
          "Remote/Flexible",
          "Field/Outdoor",
          "Creative Studio",
        ],
      },
      {
        text: "How do you prefer to work?",
        answers: [
          "Independently",
          "In a team",
          "Mix of both",
          "Leading a team",
        ],
      },
      {
        text: "What motivates you most in a career?",
        answers: [
          "Financial reward",
          "Making an impact",
          "Creative expression",
          "Intellectual challenge",
        ],
      },
      {
        text: "How important is work-life balance to you?",
        answers: [
          "Extremely important",
          "Very important",
          "Somewhat important",
          "Career comes first",
        ],
      },
      {
        text: "What type of problems do you enjoy solving?",
        answers: [
          "Technical problems",
          "People problems",
          "Creative challenges",
          "Strategic challenges",
        ],
      },
      {
        text: "How do you feel about continuous learning?",
        answers: ["Love it", "Enjoy it", "It's necessary", "Prefer stability"],
      },
      {
        text: "What is your preferred communication style?",
        answers: [
          "Written",
          "Verbal/Presentations",
          "Visual/Design",
          "Data/Analytics",
        ],
      },
      {
        text: "How do you handle ambiguity and uncertainty?",
        answers: [
          "Thrive in it",
          "Manage well",
          "Prefer structure",
          "Need clear direction",
        ],
      },
      {
        text: "What type of impact do you want to make?",
        answers: [
          "Social impact",
          "Economic impact",
          "Technological impact",
          "Cultural impact",
        ],
      },
      {
        text: "How important is job security to you?",
        answers: [
          "Very important",
          "Important",
          "Somewhat",
          "Willing to take risks",
        ],
      },
      {
        text: "Do you prefer working with people, data, or things?",
        answers: ["People", "Data", "Things/Objects", "Ideas/Concepts"],
      },
      {
        text: "What is your ideal career growth path?",
        answers: [
          "Technical expert",
          "Management/Leadership",
          "Entrepreneurship",
          "Research/Academia",
        ],
      },
      {
        text: "How do you feel about travel for work?",
        answers: [
          "Love to travel",
          "Occasional travel is fine",
          "Prefer local",
          "No travel",
        ],
      },
      {
        text: "What industry excites you most?",
        answers: ["Technology", "Healthcare", "Finance", "Creative/Media"],
      },
      {
        text: "How do you prefer to measure success?",
        answers: [
          "Revenue/Profit",
          "Lives impacted",
          "Innovation created",
          "Knowledge gained",
        ],
      },
    ],
  };

export default function QuizQuestionsPage() {
  const params = new URLSearchParams(window.location.search);
  const sectorIdStr = params.get("sectorId") || "1";
  const sectorName = params.get("sectorName") || "Technology";
  const sectorDescription =
    params.get("sectorDescription") || "Interest in technology and computers";

  const sectorId = BigInt(sectorIdStr);

  // Build the full Sector object required by the backend
  const sector: Sector = {
    id: sectorId,
    name: sectorName,
    description: sectorDescription,
  };

  const { data: backendQuestions, isLoading } = useGetRandomQuestions(15);
  const { mutateAsync: submitQuiz, isPending: isSubmitting } =
    useSubmitQuizAnswers();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  // Use sector-specific questions or default
  const localQuestions =
    SECTOR_QUESTIONS[sectorIdStr] || SECTOR_QUESTIONS.default;

  // Merge backend questions with local ones — prefer local for richer content
  const allQuestions = React.useMemo(() => {
    void backendQuestions;
    return localQuestions.slice(0, 15);
  }, [backendQuestions, localQuestions]);

  const totalQuestions = allQuestions.length;
  const currentQuestion = allQuestions[currentIndex];
  const progress = ((currentIndex + 1) / totalQuestions) * 100;
  const selectedAnswer = answers[currentIndex];

  const handleAnswer = (answerIndex: number) => {
    setAnswers((prev) => ({ ...prev, [currentIndex]: answerIndex }));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    const answersBigInt = allQuestions.map((_, i) => BigInt(answers[i] ?? 0));
    try {
      const result = await submitQuiz({ sector, answers: answersBigInt });
      // Store result for dashboard
      sessionStorage.setItem(
        "lastQuizResult",
        JSON.stringify({
          userId: result.userId,
          sector: { ...result.sector, id: result.sector.id.toString() },
          answers: result.answers.map((a) => a.toString()),
          timestamp: result.timestamp.toString(),
        }),
      );
      sessionStorage.setItem("selectedSectorId", sectorIdStr);
      toast.success("Quiz submitted! Generating your recommendations...");
      window.location.href = "/dashboard";
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred";
      // Show a meaningful error — strip verbose canister trap prefix if present
      const displayMessage = message.includes("Unauthorized")
        ? "You must be logged in to submit the quiz."
        : "Failed to submit quiz. Please try again.";
      toast.error(displayMessage);
    }
  };

  const isLastQuestion = currentIndex === totalQuestions - 1;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-2xl mx-auto px-4">
          <Skeleton className="h-4 w-full mb-8 rounded-full" />
          <Skeleton className="h-48 w-full rounded-2xl mb-6" />
          <div className="space-y-3">
            {Array.from({ length: 4 }, (_, i) => `skeleton-${i}`).map((key) => (
              <Skeleton key={key} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 gradient-purple rounded-lg flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium text-sm text-foreground">
                Interest Quiz
              </span>
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              {currentIndex + 1} / {totalQuestions}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {Math.round(progress)}% complete
          </p>
        </div>

        {/* Question Card */}
        {currentQuestion && (
          <Card
            className="border-2 border-border shadow-sm mb-6 animate-fade-in"
            key={currentIndex}
          >
            <CardContent className="p-6 sm:p-8">
              <div className="mb-6">
                <span
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "oklch(60% 0.22 285)" }}
                >
                  Question {currentIndex + 1}
                </span>
                <h2 className="font-display font-bold text-xl text-foreground mt-2 leading-relaxed">
                  {currentQuestion.text}
                </h2>
              </div>

              <div className="space-y-3">
                {currentQuestion.answers.map((answer, idx) => (
                  <button
                    type="button"
                    key={answer}
                    onClick={() => handleAnswer(idx)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-150 flex items-center gap-3 ${
                      selectedAnswer === idx
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:border-primary/40 hover:bg-accent/50"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                        selectedAnswer === idx
                          ? "border-primary bg-primary"
                          : "border-muted-foreground/40"
                      }`}
                    >
                      {selectedAnswer === idx && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        selectedAnswer === idx
                          ? "text-primary"
                          : "text-foreground"
                      }`}
                    >
                      {answer}
                    </span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentIndex === 0}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>

          {isLastQuestion ? (
            <Button
              onClick={handleSubmit}
              disabled={selectedAnswer === undefined || isSubmitting}
              className="bg-primary text-primary-foreground font-semibold px-8 h-11 shadow-purple hover:shadow-purple-lg hover:opacity-90 transition-all rounded-xl"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Submit Quiz
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={selectedAnswer === undefined}
              className="bg-primary text-primary-foreground font-semibold px-8 h-11 shadow-purple hover:shadow-purple-lg hover:opacity-90 transition-all rounded-xl"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>

        {/* Answer progress dots */}
        <div className="flex justify-center gap-1.5 mt-6 flex-wrap">
          {allQuestions.map((q, i) => (
            <button
              type="button"
              key={q.text}
              onClick={() => setCurrentIndex(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === currentIndex
                  ? "bg-primary scale-125"
                  : answers[i] !== undefined
                    ? "bg-primary/40"
                    : "bg-border"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
