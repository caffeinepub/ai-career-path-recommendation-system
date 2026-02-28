import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, Sector, Question, JobRole, Roadmap, UserQuizResult, SkillAssessment } from '../backend';
import { AssessmentStatus, UserRole } from '../backend';

// ─── Profile ────────────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useUpdateUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      email,
      profilePicture,
    }: {
      name: string;
      email: string;
      profilePicture?: string | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateUserProfile(name, email, profilePicture ?? null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// ─── Sectors ────────────────────────────────────────────────────────────────

export function useGetAvailableSectors() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Sector[]>({
    queryKey: ['availableSectors'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAvailableSectors();
    },
    enabled: !!actor && !actorFetching,
  });
}

// ─── Questions ──────────────────────────────────────────────────────────────

export function useGetRandomQuestions(count: number) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Question[]>({
    queryKey: ['randomQuestions', count],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRandomQuestions(BigInt(count));
    },
    enabled: !!actor && !actorFetching,
    staleTime: 5 * 60 * 1000,
  });
}

// ─── Quiz ────────────────────────────────────────────────────────────────────

export function useSubmitQuizAnswers() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      sector,
      answers,
    }: {
      sector: Sector;
      answers: bigint[];
    }): Promise<UserQuizResult> => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitQuizAnswers(sector, answers);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizResult'] });
      queryClient.invalidateQueries({ queryKey: ['recommendedJobs'] });
    },
  });
}

export function useGetQuizResult() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<UserQuizResult | null>({
    queryKey: ['quizResult'],
    queryFn: async () => {
      if (!actor) return null;
      const stored = sessionStorage.getItem('lastQuizResult');
      if (stored) {
        try {
          return JSON.parse(stored) as UserQuizResult;
        } catch {
          return null;
        }
      }
      return null;
    },
    enabled: !!actor && !actorFetching,
  });
}

// ─── Jobs ────────────────────────────────────────────────────────────────────

export function useGetRecommendedJobRoles(sectorId: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<JobRole[]>({
    queryKey: ['recommendedJobs', sectorId?.toString()],
    queryFn: async () => {
      if (!actor || sectorId === null) return [];
      return actor.getRecommendedJobRoles(sectorId);
    },
    enabled: !!actor && !actorFetching && sectorId !== null,
  });
}

// ─── Roadmaps ────────────────────────────────────────────────────────────────

export function useGetAvailableRoadmaps(sectorId: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Roadmap[]>({
    queryKey: ['availableRoadmaps', sectorId?.toString()],
    queryFn: async () => {
      if (!actor || sectorId === null) return [];
      return actor.getAvailableRoadmaps(sectorId);
    },
    enabled: !!actor && !actorFetching && sectorId !== null,
  });
}

// ─── Skill Assessments ───────────────────────────────────────────────────────

export const ALL_ASSESSMENT_CATEGORIES: { id: string; name: string; icon: string; description: string }[] = [
  { id: 'programming', name: 'Programming', icon: '💻', description: 'Test your coding and software development skills' },
  { id: 'communication', name: 'Communication', icon: '🗣️', description: 'Assess your verbal and written communication abilities' },
  { id: 'data-analysis', name: 'Data Analysis', icon: '📊', description: 'Evaluate your data interpretation and analytics skills' },
  { id: 'problem-solving', name: 'Problem Solving', icon: '🧩', description: 'Test your logical reasoning and problem-solving approach' },
  { id: 'leadership', name: 'Leadership', icon: '🏆', description: 'Assess your leadership and team management capabilities' },
  { id: 'arts', name: 'Arts & Design', icon: '🎨', description: 'Evaluate your creative and artistic abilities' },
  { id: 'commerce', name: 'Commerce', icon: '📈', description: 'Test your business and commerce knowledge' },
  { id: 'business', name: 'Business', icon: '💼', description: 'Assess your entrepreneurial and business acumen' },
  { id: 'healthcare', name: 'Healthcare', icon: '🏥', description: 'Evaluate your medical and healthcare knowledge' },
  { id: 'engineering', name: 'Engineering', icon: '⚙️', description: 'Test your engineering and technical skills' },
  { id: 'finance', name: 'Finance', icon: '💰', description: 'Assess your financial literacy and investment knowledge' },
  { id: 'marketing', name: 'Marketing', icon: '📣', description: 'Evaluate your marketing and branding skills' },
];

export const ASSESSMENT_QUESTIONS: Record<string, { text: string; answers: string[]; correct: number }[]> = {
  programming: [
    { text: 'What does HTML stand for?', answers: ['HyperText Markup Language', 'High Tech Modern Language', 'Hyper Transfer Markup Language', 'Home Tool Markup Language'], correct: 0 },
    { text: 'Which data structure uses LIFO?', answers: ['Queue', 'Stack', 'Array', 'Tree'], correct: 1 },
    { text: 'What is a variable in programming?', answers: ['A fixed value', 'A named storage location', 'A function', 'A loop'], correct: 1 },
    { text: 'What does CSS stand for?', answers: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style System', 'Colorful Style Sheets'], correct: 1 },
    { text: 'Which language is primarily used for web styling?', answers: ['Python', 'Java', 'CSS', 'C++'], correct: 2 },
  ],
  communication: [
    { text: 'What is active listening?', answers: ['Listening while multitasking', 'Fully concentrating on the speaker', 'Waiting for your turn to speak', 'Taking notes only'], correct: 1 },
    { text: 'Which is a key element of effective communication?', answers: ['Speaking loudly', 'Clarity and conciseness', 'Using complex vocabulary', 'Avoiding eye contact'], correct: 1 },
    { text: 'What is non-verbal communication?', answers: ['Written messages', 'Body language and gestures', 'Phone calls', 'Emails'], correct: 1 },
    { text: 'What does empathy in communication mean?', answers: ['Agreeing with everything', 'Understanding others\' feelings', 'Speaking faster', 'Using formal language'], correct: 1 },
    { text: 'What is the purpose of feedback in communication?', answers: ['To criticize', 'To confirm understanding', 'To end conversation', 'To show authority'], correct: 1 },
  ],
  'data-analysis': [
    { text: 'What is a dataset?', answers: ['A single data point', 'A collection of related data', 'A chart', 'A database software'], correct: 1 },
    { text: 'What does mean represent in statistics?', answers: ['Most frequent value', 'Middle value', 'Average value', 'Highest value'], correct: 2 },
    { text: 'What is data visualization?', answers: ['Storing data', 'Graphical representation of data', 'Deleting data', 'Encrypting data'], correct: 1 },
    { text: 'What is a correlation?', answers: ['Causation between variables', 'Relationship between variables', 'Difference between variables', 'Sum of variables'], correct: 1 },
    { text: 'What tool is commonly used for data analysis?', answers: ['Photoshop', 'Excel/Python', 'Word', 'PowerPoint'], correct: 1 },
  ],
  'problem-solving': [
    { text: 'What is the first step in problem solving?', answers: ['Finding a solution', 'Identifying the problem', 'Implementing a fix', 'Testing solutions'], correct: 1 },
    { text: 'What is brainstorming?', answers: ['A type of storm', 'Generating multiple ideas freely', 'Criticizing ideas', 'Selecting one idea'], correct: 1 },
    { text: 'What does root cause analysis mean?', answers: ['Analyzing tree roots', 'Finding the underlying cause of a problem', 'Surface-level problem fixing', 'Ignoring symptoms'], correct: 1 },
    { text: 'What is critical thinking?', answers: ['Being negative', 'Objective analysis and evaluation', 'Accepting all information', 'Quick decision making'], correct: 1 },
    { text: 'What is an iterative approach to problem solving?', answers: ['Solving once and done', 'Repeatedly refining solutions', 'Avoiding problems', 'Delegating problems'], correct: 1 },
  ],
  leadership: [
    { text: 'What is a key trait of a good leader?', answers: ['Micromanagement', 'Empathy and vision', 'Avoiding decisions', 'Working alone'], correct: 1 },
    { text: 'What is delegation in leadership?', answers: ['Doing all tasks yourself', 'Assigning tasks to team members', 'Avoiding responsibilities', 'Criticizing team'], correct: 1 },
    { text: 'What is transformational leadership?', answers: ['Maintaining status quo', 'Inspiring change and growth', 'Transactional rewards only', 'Authoritarian control'], correct: 1 },
    { text: 'What does accountability mean in leadership?', answers: ['Blaming others', 'Taking responsibility for outcomes', 'Avoiding challenges', 'Hiding mistakes'], correct: 1 },
    { text: 'What is emotional intelligence in leadership?', answers: ['Being emotional', 'Understanding and managing emotions', 'Ignoring feelings', 'Being strict'], correct: 1 },
  ],
  arts: [
    { text: 'What are the primary colors?', answers: ['Red, Green, Blue', 'Red, Yellow, Blue', 'Orange, Purple, Green', 'Black, White, Gray'], correct: 1 },
    { text: 'What is composition in art?', answers: ['Musical notes', 'Arrangement of visual elements', 'Color mixing', 'Brush technique'], correct: 1 },
    { text: 'What is typography?', answers: ['Type of photography', 'Art of arranging text', 'Drawing technique', 'Color theory'], correct: 1 },
    { text: 'What is perspective in drawing?', answers: ['Point of view', 'Technique to show depth and distance', 'Color shading', 'Line thickness'], correct: 1 },
    { text: 'What is the golden ratio used for?', answers: ['Mathematics only', 'Aesthetically pleasing proportions', 'Color selection', 'Font sizing'], correct: 1 },
  ],
  commerce: [
    { text: 'What is supply and demand?', answers: ['A store name', 'Economic principle of availability and desire', 'A type of contract', 'A business model'], correct: 1 },
    { text: 'What is a balance sheet?', answers: ['A weighing scale', 'Financial statement of assets and liabilities', 'A budget plan', 'A sales report'], correct: 1 },
    { text: 'What is GDP?', answers: ['General Data Protection', 'Gross Domestic Product', 'Global Development Plan', 'Government Data Policy'], correct: 1 },
    { text: 'What is inflation?', answers: ['Deflation of currency', 'Rise in general price levels', 'Economic growth', 'Stock market rise'], correct: 1 },
    { text: 'What is a market economy?', answers: ['Government-controlled economy', 'Economy driven by supply and demand', 'Barter system', 'Planned economy'], correct: 1 },
  ],
  business: [
    { text: 'What is a business plan?', answers: ['A daily schedule', 'A document outlining business goals and strategies', 'A financial report', 'A marketing brochure'], correct: 1 },
    { text: 'What is ROI?', answers: ['Return on Investment', 'Rate of Inflation', 'Revenue of Industry', 'Risk of Investment'], correct: 0 },
    { text: 'What is a startup?', answers: ['An old company', 'A newly established business', 'A government agency', 'A non-profit'], correct: 1 },
    { text: 'What is market research?', answers: ['Shopping research', 'Gathering information about target market', 'Financial analysis', 'Product testing'], correct: 1 },
    { text: 'What is a SWOT analysis?', answers: ['A security test', 'Strengths, Weaknesses, Opportunities, Threats analysis', 'A financial model', 'A marketing strategy'], correct: 1 },
  ],
  healthcare: [
    { text: 'What is the primary role of a doctor?', answers: ['Administrative work', 'Diagnosing and treating patients', 'Research only', 'Teaching'], correct: 1 },
    { text: 'What does EMR stand for?', answers: ['Emergency Medical Response', 'Electronic Medical Record', 'External Medical Review', 'Enhanced Medical Research'], correct: 1 },
    { text: 'What is preventive healthcare?', answers: ['Treating existing diseases', 'Preventing diseases before they occur', 'Emergency care', 'Surgical procedures'], correct: 1 },
    { text: 'What is a clinical trial?', answers: ['A court case', 'Research study testing medical treatments', 'A hospital visit', 'A medical exam'], correct: 1 },
    { text: 'What is telemedicine?', answers: ['TV medical shows', 'Remote healthcare via technology', 'Traditional medicine', 'Alternative medicine'], correct: 1 },
  ],
  engineering: [
    { text: 'What is the engineering design process?', answers: ['Random trial and error', 'Systematic approach to solving problems', 'Building without planning', 'Copying existing designs'], correct: 1 },
    { text: 'What does CAD stand for?', answers: ['Computer Aided Design', 'Creative Art Drawing', 'Calculated Architecture Design', 'Computer Analysis Data'], correct: 0 },
    { text: 'What is a prototype?', answers: ['Final product', 'Preliminary model for testing', 'A blueprint', 'A specification document'], correct: 1 },
    { text: 'What is structural integrity?', answers: ['Building aesthetics', 'Ability of structure to withstand loads', 'Interior design', 'Material cost'], correct: 1 },
    { text: 'What is thermodynamics?', answers: ['Study of heat and energy', 'Study of water', 'Study of electricity', 'Study of light'], correct: 0 },
  ],
  finance: [
    { text: 'What is compound interest?', answers: ['Simple interest', 'Interest on principal and accumulated interest', 'Fixed interest rate', 'Government interest'], correct: 1 },
    { text: 'What is diversification in investing?', answers: ['Investing in one stock', 'Spreading investments to reduce risk', 'Selling all assets', 'Borrowing money'], correct: 1 },
    { text: 'What is a budget?', answers: ['A wish list', 'A financial plan for income and expenses', 'A bank account', 'A credit card'], correct: 1 },
    { text: 'What is liquidity?', answers: ['Water in finance', 'Ease of converting assets to cash', 'Debt level', 'Profit margin'], correct: 1 },
    { text: 'What is a stock?', answers: ['Inventory', 'Ownership share in a company', 'A type of bond', 'A savings account'], correct: 1 },
  ],
  marketing: [
    { text: 'What is a target audience?', answers: ['Everyone', 'Specific group of potential customers', 'Competitors', 'Employees'], correct: 1 },
    { text: 'What is brand identity?', answers: ['Company logo only', 'Visual and emotional representation of a brand', 'Product quality', 'Sales strategy'], correct: 1 },
    { text: 'What is SEO?', answers: ['Sales Executive Officer', 'Search Engine Optimization', 'Social Engagement Online', 'Strategic Email Outreach'], correct: 1 },
    { text: 'What is a call-to-action (CTA)?', answers: ['A phone call', 'Prompt encouraging user action', 'A marketing budget', 'A product feature'], correct: 1 },
    { text: 'What is content marketing?', answers: ['Advertising only', 'Creating valuable content to attract customers', 'Cold calling', 'Print advertising'], correct: 1 },
  ],
};

export function useUpdateAssessmentResult() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      assessmentId,
      assessmentName,
      score,
    }: {
      assessmentId: string;
      assessmentName: string;
      score: number;
    }) => {
      if (!actor) throw new Error('Actor not available');
      const profile = await actor.getCallerUserProfile();
      if (!profile) throw new Error('Profile not found');

      const existingAssessments = profile.completedAssessments.filter(
        (a: SkillAssessment) => a.id !== assessmentId
      );

      const updatedAssessment: SkillAssessment = {
        id: assessmentId,
        name: assessmentName,
        status: AssessmentStatus.completed,
      };

      const updatedProfile: UserProfile = {
        ...profile,
        completedAssessments: [...existingAssessments, updatedAssessment],
      };

      return actor.saveCallerUserProfile(updatedProfile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}
