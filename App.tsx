import { useState, useEffect } from 'react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

type UserRole = 'landing' | 'trainee' | 'trainer' | 'admin';
type Page = 
  | 'landing'
  | 'login'
  | 'dashboard'
  | 'my-learning'
  | 'assessments'
  | 'competency'
  | 'skill-gaps'
  | 'recommendations'
  | 'learning-path'
  | 'certificates'
  | 'notifications'
  | 'profile'
  | 'course'
  | 'assessment-quiz'
  | 'trainer-dashboard'
  | 'trainer-matching'
  | 'admin-dashboard';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'trainee' | 'trainer' | 'admin';
  avatar?: string;
}

interface Course {
  id: string;
  title: string;
  instructor: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  skills: string[];
  prerequisites: string[];
  modules: Module[];
  relevance?: number;
  progress?: number;
}

interface Module {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
}

interface Assessment {
  id: string;
  title: string;
  course: string;
  questions: number;
  duration: string;
  completed: boolean;
  score?: number;
}

interface SkillCompetency {
  skill: string;
  score: number;
  status: 'Strong' | 'Developing' | 'Needs Improvement' | 'Priority Gap';
  subskills?: Subskill[];
}

interface Subskill {
  name: string;
  score: number;
  assessments: number;
  status: 'Strong' | 'Developing' | 'Weak';
}

interface SkillGap {
  skill: string;
  overallScore: number;
  primaryGap: string;
  primaryGapScore: number;
  secondaryGap: string;
  secondaryGapScore: number;
  reason: string;
  recommendedCourse: string;
  courseRelevance: number;
}

interface Recommendation {
  id: string;
  course: string;
  skillGap: string;
  relevance: number;
  priority: 'High' | 'Medium' | 'Low';
}

interface Certificate {
  id: string;
  title: string;
  issuedDate: string;
  expiryDate?: string;
  issuer: string;
}

interface Trainer {
  id: string;
  name: string;
  title: string;
  expertise: string[];
  certifications: string[];
  availability: 'Available' | 'Limited' | 'Unavailable';
  matchScore: number;
  learnerOutcomes: number;
  reason: string[];
}

interface TraineePerformance {
  id: string;
  name: string;
  skill: string;
  score: number;
  priority: 'High' | 'Medium' | 'Low';
  assessmentsCompleted: number;
  lastActive: string;
}

interface OrganizationSkill {
  skill: string;
  averageScore: number;
  traineesCount: number;
  trend: 'up' | 'down' | 'stable';
}

interface TrainingEffectiveness {
  course: string;
  beforeScore: number;
  afterScore: number;
  improvement: number;
  participants: number;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const mockUser: User = {
  id: '1',
  name: 'Rahul Kumar',
  email: 'rahul.kumar@skillsphere.org',
  role: 'trainee',
};

const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Python Fundamentals',
    instructor: 'Dr. Priya Sharma',
    difficulty: 'Beginner',
    duration: '8 weeks',
    skills: ['Python Basics', 'Data Structures', 'Functions'],
    prerequisites: ['Basic Computer Knowledge'],
    progress: 75,
    modules: [
      { id: '1', title: 'Introduction to Python', duration: '2 hours', completed: true },
      { id: '2', title: 'Variables and Data Types', duration: '3 hours', completed: true },
      { id: '3', title: 'Control Structures', duration: '4 hours', completed: true },
      { id: '4', title: 'Functions and Modules', duration: '4 hours', completed: false },
      { id: '5', title: 'Data Structures', duration: '5 hours', completed: false },
    ],
  },
  {
    id: '2',
    title: 'SQL Fundamentals',
    instructor: 'Prof. Amit Patel',
    difficulty: 'Beginner',
    duration: '6 weeks',
    skills: ['SQL Basics', 'Joins', 'Aggregations'],
    prerequisites: ['Basic Database Concepts'],
    progress: 45,
    modules: [
      { id: '1', title: 'Introduction to Databases', duration: '2 hours', completed: true },
      { id: '2', title: 'SELECT Statements', duration: '3 hours', completed: true },
      { id: '3', title: 'JOINs and Relationships', duration: '4 hours', completed: false },
      { id: '4', title: 'Aggregation Functions', duration: '3 hours', completed: false },
      { id: '5', title: 'Subqueries', duration: '4 hours', completed: false },
    ],
  },
  {
    id: '3',
    title: 'Cloud Computing Basics',
    instructor: 'Dr. Rajesh Verma',
    difficulty: 'Intermediate',
    duration: '10 weeks',
    skills: ['Cloud Concepts', 'AWS Basics', 'Azure Fundamentals'],
    prerequisites: ['Networking Basics', 'Operating Systems'],
    progress: 20,
    modules: [
      { id: '1', title: 'Cloud Computing Overview', duration: '3 hours', completed: true },
      { id: '2', title: 'AWS Core Services', duration: '5 hours', completed: false },
      { id: '3', title: 'Azure Fundamentals', duration: '5 hours', completed: false },
      { id: '4', title: 'Cloud Security', duration: '4 hours', completed: false },
      { id: '5', title: 'Cost Management', duration: '3 hours', completed: false },
    ],
  },
];

const mockAssessments: Assessment[] = [
  { id: '1', title: 'Python Basics Quiz', course: 'Python Fundamentals', questions: 20, duration: '30 min', completed: true, score: 85 },
  { id: '2', title: 'Python Intermediate', course: 'Python Fundamentals', questions: 25, duration: '45 min', completed: false },
  { id: '3', title: 'SQL Fundamentals Test', course: 'SQL Fundamentals', questions: 20, duration: '30 min', completed: true, score: 62 },
  { id: '4', title: 'SQL Joins Assessment', course: 'SQL Fundamentals', questions: 15, duration: '25 min', completed: false },
  { id: '5', title: 'Cloud Concepts Quiz', course: 'Cloud Computing Basics', questions: 20, duration: '30 min', completed: false },
];

const mockCompetencies: SkillCompetency[] = [
  {
    skill: 'Python',
    score: 82,
    status: 'Strong',
    subskills: [
      { name: 'Python Basics', score: 92, assessments: 3, status: 'Strong' },
      { name: 'Data Structures', score: 78, assessments: 2, status: 'Developing' },
      { name: 'Functions', score: 85, assessments: 2, status: 'Strong' },
    ],
  },
  {
    skill: 'SQL',
    score: 48,
    status: 'Needs Improvement',
    subskills: [
      { name: 'SQL Basics', score: 82, assessments: 2, status: 'Strong' },
      { name: 'SQL Joins', score: 34, assessments: 1, status: 'Weak' },
      { name: 'Normalization', score: 46, assessments: 2, status: 'Weak' },
      { name: 'Indexing', score: 28, assessments: 1, status: 'Weak' },
    ],
  },
  {
    skill: 'Cloud Computing',
    score: 34,
    status: 'Priority Gap',
    subskills: [
      { name: 'Cloud Concepts', score: 52, assessments: 1, status: 'Developing' },
      { name: 'AWS Basics', score: 28, assessments: 1, status: 'Weak' },
      { name: 'Cloud Networking', score: 22, assessments: 1, status: 'Weak' },
    ],
  },
  {
    skill: 'Data Analysis',
    score: 65,
    status: 'Developing',
    subskills: [
      { name: 'Statistics', score: 72, assessments: 2, status: 'Developing' },
      { name: 'Data Visualization', score: 58, assessments: 1, status: 'Developing' },
    ],
  },
];

const mockSkillGaps: SkillGap[] = [
  {
    skill: 'SQL',
    overallScore: 48,
    primaryGap: 'SQL Joins',
    primaryGapScore: 34,
    secondaryGap: 'Indexing',
    secondaryGapScore: 28,
    reason: 'The trainee performed below the competency threshold (60%) in questions mapped to JOIN operations and database indexing concepts.',
    recommendedCourse: 'SQL Fundamentals',
    courseRelevance: 94,
  },
  {
    skill: 'Cloud Computing',
    overallScore: 34,
    primaryGap: 'Cloud Networking',
    primaryGapScore: 22,
    secondaryGap: 'AWS Basics',
    secondaryGapScore: 28,
    reason: 'The trainee scored significantly below threshold in cloud infrastructure and networking concepts, indicating a fundamental gap in cloud architecture understanding.',
    recommendedCourse: 'Cloud Computing Basics',
    courseRelevance: 89,
  },
];

const mockRecommendations: Recommendation[] = [
  { id: '1', course: 'SQL Fundamentals', skillGap: 'SQL Joins', relevance: 94, priority: 'High' },
  { id: '2', course: 'Cloud Computing Basics', skillGap: 'Cloud Networking', relevance: 89, priority: 'High' },
  { id: '3', course: 'Advanced Python', skillGap: 'Data Structures', relevance: 72, priority: 'Medium' },
  { id: '4', course: 'Data Visualization with Python', skillGap: 'Data Visualization', relevance: 68, priority: 'Medium' },
];

const mockCertificates: Certificate[] = [
  { id: '1', title: 'Python Programming Certificate', issuedDate: '2024-01-15', issuer: 'SkillSphere Academy' },
  { id: '2', title: 'Database Fundamentals', issuedDate: '2024-02-20', issuer: 'SkillSphere Academy' },
  { id: '3', title: 'Introduction to Cloud Computing', issuedDate: '2024-03-10', issuer: 'SkillSphere Academy' },
  { id: '4', title: 'Data Analysis Basics', issuedDate: '2024-04-05', issuer: 'SkillSphere Academy' },
];

const mockTrainers: Trainer[] = [
  {
    id: '1',
    name: 'Dr. Priya Sharma',
    title: 'Senior Python Instructor',
    expertise: ['Python', 'Data Science', 'Machine Learning'],
    certifications: ['AWS Certified', 'Python Institute PCAP'],
    availability: 'Available',
    matchScore: 94,
    learnerOutcomes: 92,
    reason: ['Python expertise', 'High learner outcomes', 'Available for mentoring', 'Industry experience'],
  },
  {
    id: '2',
    name: 'Prof. Amit Patel',
    title: 'Database Systems Expert',
    expertise: ['SQL', 'Database Design', 'Data Modeling'],
    certifications: ['Oracle Certified', 'Microsoft SQL Server'],
    availability: 'Available',
    matchScore: 91,
    learnerOutcomes: 88,
    reason: ['SQL expertise', 'Database certification', 'Available for mentoring', 'Strong teaching record'],
  },
  {
    id: '3',
    name: 'Dr. Rajesh Verma',
    title: 'Cloud Architecture Specialist',
    expertise: ['Cloud Computing', 'AWS', 'Azure'],
    certifications: ['AWS Solutions Architect', 'Azure Administrator'],
    availability: 'Limited',
    matchScore: 87,
    learnerOutcomes: 85,
    reason: ['Cloud expertise', 'Multiple certifications', 'Industry experience'],
  },
];

const mockTraineePerformance: TraineePerformance[] = [
  { id: '1', name: 'Rahul Kumar', skill: 'SQL Joins', score: 34, priority: 'High', assessmentsCompleted: 8, lastActive: '2 hours ago' },
  { id: '2', name: 'Sneha Patel', skill: 'Cloud Networking', score: 28, priority: 'High', assessmentsCompleted: 12, lastActive: '1 day ago' },
  { id: '3', name: 'Arjun Singh', skill: 'Python Functions', score: 45, priority: 'Medium', assessmentsCompleted: 15, lastActive: '3 hours ago' },
  { id: '4', name: 'Meera Reddy', skill: 'Data Visualization', score: 52, priority: 'Medium', assessmentsCompleted: 10, lastActive: '5 hours ago' },
  { id: '5', name: 'Vikram Joshi', skill: 'Database Normalization', score: 38, priority: 'High', assessmentsCompleted: 6, lastActive: '2 days ago' },
];

const mockOrgSkills: OrganizationSkill[] = [
  { skill: 'Python', averageScore: 78, traineesCount: 450, trend: 'up' },
  { skill: 'SQL', averageScore: 51, traineesCount: 380, trend: 'stable' },
  { skill: 'Cloud Computing', averageScore: 42, traineesCount: 312, trend: 'up' },
  { skill: 'Cybersecurity', averageScore: 69, traineesCount: 220, trend: 'up' },
  { skill: 'Data Analysis', averageScore: 65, traineesCount: 340, trend: 'stable' },
];

const mockTrainingEffectiveness: TrainingEffectiveness[] = [
  { course: 'Python Fundamentals', beforeScore: 45, afterScore: 78, improvement: 33, participants: 120 },
  { course: 'SQL Fundamentals', beforeScore: 38, afterScore: 65, improvement: 27, participants: 95 },
  { course: 'Cloud Basics', beforeScore: 32, afterScore: 58, improvement: 26, participants: 85 },
  { course: 'Data Analysis', beforeScore: 42, afterScore: 71, improvement: 29, participants: 110 },
];

const mockQuizQuestions = [
  {
    id: 1,
    question: 'Which keyword is used to define a function in Python?',
    options: ['def', 'func', 'function', 'lambda'],
    correct: 0,
  },
  {
    id: 2,
    question: 'What is the correct SQL syntax to select all columns from a table named "users"?',
    options: ['SELECT * FROM users', 'SELECT ALL FROM users', 'GET * FROM users', 'SELECT users'],
    correct: 0,
  },
  {
    id: 3,
    question: 'Which SQL JOIN returns all records when there is a match in either left or right table?',
    options: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL OUTER JOIN'],
    correct: 3,
  },
  {
    id: 4,
    question: 'In Python, what data type is used to store a sequence of characters?',
    options: ['int', 'float', 'str', 'char'],
    correct: 2,
  },
  {
    id: 5,
    question: 'Which cloud service model provides the most control over the underlying infrastructure?',
    options: ['SaaS', 'PaaS', 'IaaS', 'FaaS'],
    correct: 2,
  },
];

// ============================================================================
// UTILITY COMPONENTS
// ============================================================================

function ProgressBar({ value, color = 'bg-blue-600', height = 'h-2' }: { value: number; color?: string; height?: string }) {
  return (
    <div className={`w-full bg-gray-200 rounded ${height}`}>
      <div
        className={`${color} ${height} rounded progress-bar`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Strong: 'badge-success',
    Developing: 'badge-info',
    'Needs Improvement': 'badge-warning',
    'Priority Gap': 'badge-danger',
    Weak: 'badge-danger',
    High: 'badge-danger',
    Medium: 'badge-warning',
    Low: 'badge-info',
    Available: 'badge-success',
    Limited: 'badge-warning',
    Unavailable: 'badge-danger',
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[status] || 'badge-info'}`}>
      {status}
    </span>
  );
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white border border-gray-200 rounded-lg card-hover transition-smooth ${className}`}>
      {children}
    </div>
  );
}

function Button({
  children,
  onClick,
  variant = 'primary',
  className = '',
  disabled = false,
  type = 'button',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
}) {
  const baseStyles = 'px-4 py-2 rounded-md font-medium transition-smooth disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-[#1F5F95] text-white hover:bg-[#184a75]',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

function Input({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',
}: {
  label?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}) {
  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#1F5F95] focus:ring-1 focus:ring-[#1F5F95]"
      />
    </div>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
    </div>
  );
}

// ============================================================================
// PAGE COMPONENTS
// ============================================================================

function LandingPage({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#1F5F95] rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">SkillSphere</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-600 hover:text-gray-900">Features</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">About</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Contact</a>
            </nav>
            <Button onClick={onLogin}>Sign In</Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            SkillSphere
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Turn training into measurable competency.
          </p>
          <p className="text-gray-500 mb-12">
            Identify skill gaps, personalize learning, connect trainees with suitable trainers, 
            and measure progress with our comprehensive competency-based learning platform.
          </p>
          <div className="flex justify-center space-x-4">
            <Button onClick={onLogin} className="px-8 py-3">
              Get Started
            </Button>
            <Button variant="outline" className="px-8 py-3">
              Learn More
            </Button>
          </div>
        </div>

        {/* Preview */}
        <div className="mt-16">
          <Card className="overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              </div>
            </div>
            <div className="p-8 bg-white">
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-100 rounded w-full"></div>
                  <div className="h-3 bg-gray-100 rounded w-5/6"></div>
                  <div className="h-2 bg-gray-200 rounded w-full"></div>
                  <div className="h-2 bg-[#1F5F95] rounded w-2/3"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-3 bg-gray-100 rounded w-full"></div>
                  <div className="h-3 bg-gray-100 rounded w-4/5"></div>
                  <div className="h-2 bg-gray-200 rounded w-full"></div>
                  <div className="h-2 bg-[#1F5F95] rounded w-1/2"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-100 rounded w-full"></div>
                  <div className="h-3 bg-gray-100 rounded w-3/4"></div>
                  <div className="h-2 bg-gray-200 rounded w-full"></div>
                  <div className="h-2 bg-[#1F5F95] rounded w-1/3"></div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Features */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <Card className="p-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-[#1F5F95]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Track Competency</h3>
            <p className="text-gray-600 text-sm">
              Measure skill levels across multiple domains with detailed competency profiles and progress tracking.
            </p>
          </Card>
          <Card className="p-6">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-[#2E8B57]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Identify Gaps</h3>
            <p className="text-gray-600 text-sm">
              Automatically detect skill gaps and receive personalized learning recommendations to improve.
            </p>
          </Card>
          <Card className="p-6">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect with Trainers</h3>
            <p className="text-gray-600 text-sm">
              Get matched with qualified trainers based on your specific learning needs and goals.
            </p>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-[#1F5F95] rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">S</span>
              </div>
              <span className="text-sm text-gray-600">© 2024 SkillSphere. All rights reserved.</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700">Privacy</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700">Terms</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function LoginPage({ onLogin }: { onLogin: (role: UserRole) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo, just login as trainee
    onLogin('trainee');
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#1F5F95] rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">Welcome to SkillSphere</h1>
          <p className="text-gray-500 mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="your.email@organization.org"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="w-4 h-4 text-[#1F5F95] border-gray-300 rounded" />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <a href="#" className="text-sm text-[#1F5F95] hover:underline">Forgot password?</a>
          </div>
          <Button type="submit" className="w-full">Sign In</Button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center mb-4">Or sign in as:</p>
          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" onClick={() => onLogin('trainee')} className="text-sm">Trainee</Button>
            <Button variant="outline" onClick={() => onLogin('trainer')} className="text-sm">Trainer</Button>
            <Button variant="outline" onClick={() => onLogin('admin')} className="text-sm">Admin</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function Sidebar({ currentPage, onPageChange, user, onLogout }: {
  currentPage: Page;
  onPageChange: (page: Page) => void;
  user: User;
  onLogout: () => void;
}) {
  const traineeMenu = [
    { id: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'my-learning', label: 'My Learning', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { id: 'assessments', label: 'Assessments', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { id: 'competency', label: 'My Competency', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { id: 'skill-gaps', label: 'Skill Gaps', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
    { id: 'recommendations', label: 'Recommendations', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
    { id: 'learning-path', label: 'Learning Path', icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' },
    { id: 'certificates', label: 'Certificates', icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' },
    { id: 'profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  ];

  const menu = user.role === 'trainee' ? traineeMenu : [];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-[#1F5F95] rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="text-lg font-semibold text-gray-900">SkillSphere</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menu.map((item) => (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id as Page)}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-smooth ${
              currentPage === item.id
                ? 'bg-blue-50 text-[#1F5F95]'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
            </svg>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600">
              {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
            <p className="text-xs text-gray-500 truncate capitalize">{user.role}</p>
          </div>
        </div>
        <Button variant="outline" onClick={onLogout} className="w-full text-sm">
          Sign Out
        </Button>
      </div>
    </aside>
  );
}

function Header({ currentPage }: { currentPage: Page }) {
  const pageTitles: Record<string, string> = {
    dashboard: 'Dashboard',
    'my-learning': 'My Learning',
    assessments: 'Assessments',
    competency: 'Competency Profile',
    'skill-gaps': 'Skill Gap Analysis',
    recommendations: 'Learning Recommendations',
    'learning-path': 'Learning Path',
    certificates: 'Certificates',
    profile: 'Profile',
    course: 'Course Details',
    'assessment-quiz': 'Assessment',
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold text-gray-900">
        {pageTitles[currentPage] || currentPage.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </h1>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-64 px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#1F5F95]"
          />
          <svg className="w-4 h-4 text-gray-400 absolute right-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button className="relative p-2 text-gray-500 hover:text-gray-700">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>
    </header>
  );
}

function TraineeDashboard({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const overallCompetency = Math.round(
    mockCompetencies.reduce((acc, c) => acc + c.score, 0) / mockCompetencies.length
  );

  const stats = [
    { label: 'Courses in Progress', value: '3', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { label: 'Assessments', value: '8', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { label: 'Skill Gaps', value: '2', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
    { label: 'Certificates', value: '4', icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Good morning, {mockUser.name.split(' ')[0]}</h2>
          <p className="text-gray-500 mt-1">Here's your learning overview</p>
        </div>
        <Card className="px-6 py-4">
          <div className="text-center">
            <p className="text-sm text-gray-500">Your overall competency</p>
            <p className="text-3xl font-bold text-[#1F5F95]">{overallCompetency}%</p>
          </div>
        </Card>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-[#1F5F95]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Competency */}
      <Card className="p-6">
        <SectionTitle title="My Competency" subtitle="Current skill levels across domains" />
        <div className="space-y-4">
          {mockCompetencies.map((comp, index) => (
            <div key={index}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">{comp.skill}</span>
                <div className="flex items-center space-x-2">
                  <StatusBadge status={comp.status} />
                  <span className="text-sm font-medium text-gray-900 w-12 text-right">{comp.score}%</span>
                </div>
              </div>
              <ProgressBar
                value={comp.score}
                color={comp.score >= 70 ? 'bg-green-600' : comp.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Skill Gaps */}
      <Card className="p-6">
        <SectionTitle title="Skill Gaps" subtitle="Areas requiring attention" />
        <div className="space-y-4">
          {mockSkillGaps.map((gap, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">{gap.primaryGap}</span>
                  <StatusBadge status="High" />
                </div>
                <p className="text-sm text-gray-500 mt-1">{gap.skill} • {gap.primaryGapScore}% competency</p>
              </div>
              <Button variant="outline" onClick={() => onNavigate('skill-gaps')}>
                View Details
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Recommendations */}
      <Card className="p-6">
        <SectionTitle title="Recommended Learning" subtitle="Personalized course suggestions" />
        <div className="space-y-3">
          {mockRecommendations.slice(0, 3).map((rec, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">{rec.course}</span>
                  <StatusBadge status={rec.priority} />
                </div>
                <p className="text-sm text-gray-500 mt-1">Addresses: {rec.skillGap} • {rec.relevance}% relevance</p>
              </div>
              <Button variant="primary" onClick={() => onNavigate('course')}>
                View Course
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Progress Chart */}
      <Card className="p-6">
        <SectionTitle title="Your Progress" subtitle="Competency trend over time" />
        <div className="h-48 flex items-end justify-between space-x-2 px-4">
          {[45, 52, 48, 55, 58, 62, 65, 68].map((value, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-[#1F5F95] rounded-t transition-smooth"
                style={{ height: `${(value / 100) * 160}px` }}
              ></div>
              <span className="text-xs text-gray-500 mt-2">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'][index]}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function MyLearningPage() {
  return (
    <div className="p-6 space-y-6">
      <SectionTitle title="My Learning" subtitle="Track your course progress" />
      
      <div className="grid gap-4">
        {mockCourses.map((course) => (
          <Card key={course.id} className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    course.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                    course.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {course.difficulty}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-3">Instructor: {course.instructor} • {course.duration}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {course.skills.map((skill, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">{skill}</span>
                  ))}
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-1">
                    <ProgressBar value={course.progress || 0} />
                  </div>
                  <span className="text-sm font-medium text-gray-700 w-12">{course.progress}%</span>
                </div>
              </div>
              <Button>Continue</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function AssessmentsPage({ onStartQuiz }: { onStartQuiz: () => void }) {
  return (
    <div className="p-6 space-y-6">
      <SectionTitle title="Assessments" subtitle="Complete your pending assessments" />
      
      <div className="grid gap-4">
        {mockAssessments.map((assessment) => (
          <Card key={assessment.id} className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-lg font-semibold text-gray-900">{assessment.title}</h3>
                  {assessment.completed && (
                    <span className="badge-success px-2 py-1 rounded-full text-xs font-medium">Completed</span>
                  )}
                </div>
                <p className="text-sm text-gray-500">{assessment.course} • {assessment.questions} questions • {assessment.duration}</p>
                {assessment.completed && assessment.score !== undefined && (
                  <p className="text-sm text-gray-600 mt-2">Score: <span className="font-medium">{assessment.score}%</span></p>
                )}
              </div>
              {assessment.completed ? (
                <Button variant="outline">Review</Button>
              ) : (
                <Button onClick={onStartQuiz}>Start Assessment</Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function CompetencyPage() {
  return (
    <div className="p-6 space-y-6">
      <SectionTitle title="Competency Profile" subtitle="Detailed skill assessment" />
      
      {/* Overall */}
      <Card className="p-6">
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-2">Overall Competency Score</p>
          <p className="text-4xl font-bold text-[#1F5F95]">
            {Math.round(mockCompetencies.reduce((acc, c) => acc + c.score, 0) / mockCompetencies.length)}%
          </p>
        </div>
      </Card>

      {/* Skills */}
      {mockCompetencies.map((comp, index) => (
        <Card key={index} className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{comp.skill}</h3>
            <StatusBadge status={comp.status} />
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-600">Overall Score</span>
              <span className="text-sm font-medium text-gray-900">{comp.score}%</span>
            </div>
            <ProgressBar
              value={comp.score}
              color={comp.score >= 70 ? 'bg-green-600' : comp.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}
              height="h-3"
            />
          </div>

          {/* Subskills Table */}
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Skill Breakdown</h4>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 font-medium text-gray-600">Subskill</th>
                  <th className="text-center py-2 font-medium text-gray-600">Score</th>
                  <th className="text-center py-2 font-medium text-gray-600">Status</th>
                  <th className="text-center py-2 font-medium text-gray-600">Evidence</th>
                </tr>
              </thead>
              <tbody>
                {comp.subskills?.map((sub, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="py-3 text-gray-900">{sub.name}</td>
                    <td className="py-3 text-center">
                      <span className={`font-medium ${sub.score >= 70 ? 'text-green-600' : sub.score >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {sub.score}%
                      </span>
                    </td>
                    <td className="py-3 text-center">
                      <StatusBadge status={sub.status} />
                    </td>
                    <td className="py-3 text-center text-gray-500">{sub.assessments} Assessment{sub.assessments !== 1 ? 's' : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ))}
    </div>
  );
}

function SkillGapsPage() {
  return (
    <div className="p-6 space-y-6">
      <SectionTitle title="Skill Gap Analysis" subtitle="Detailed diagnostic report" />
      
      {mockSkillGaps.map((gap, index) => (
        <Card key={index} className="p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{gap.skill}</h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Overall: </span>
                <span className={`text-lg font-bold ${gap.overallScore >= 60 ? 'text-green-600' : 'text-red-600'}`}>
                  {gap.overallScore}%
                </span>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Primary Gap</p>
                <p className="text-lg font-semibold text-gray-900">{gap.primaryGap}</p>
                <p className="text-2xl font-bold text-red-600 mt-2">{gap.primaryGapScore}%</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Secondary Gap</p>
                <p className="text-lg font-semibold text-gray-900">{gap.secondaryGap}</p>
                <p className="text-2xl font-bold text-orange-600 mt-2">{gap.secondaryGapScore}%</p>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Why?</h4>
              <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">{gap.reason}</p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-[#1F5F95] mb-2">Recommended Intervention</h4>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{gap.recommendedCourse}</p>
                  <p className="text-sm text-gray-600">Relevance: {gap.courseRelevance}%</p>
                </div>
                <Button>View Course</Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function RecommendationsPage() {
  return (
    <div className="p-6 space-y-6">
      <SectionTitle title="Learning Recommendations" subtitle="Personalized courses based on your skill gaps" />
      
      <Card className="overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Course</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Skill Gap</th>
              <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase">Relevance</th>
              <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase">Priority</th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mockRecommendations.map((rec) => (
              <tr key={rec.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <span className="font-medium text-gray-900">{rec.course}</span>
                </td>
                <td className="px-6 py-4 text-gray-600">{rec.skillGap}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`font-medium ${rec.relevance >= 90 ? 'text-green-600' : rec.relevance >= 70 ? 'text-yellow-600' : 'text-gray-600'}`}>
                    {rec.relevance}%
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <StatusBadge status={rec.priority} />
                </td>
                <td className="px-6 py-4 text-right">
                  <Button>View Course</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function LearningPathPage() {
  return (
    <div className="p-6 space-y-6">
      <SectionTitle title="Learning Path" subtitle="Your personalized learning journey" />
      
      <Card className="p-6">
        <div className="relative">
          {/* Timeline */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          
          <div className="space-y-8">
            {[
              { title: 'Python Fundamentals', status: 'completed', date: 'Completed Jan 2024' },
              { title: 'SQL Fundamentals', status: 'in-progress', date: 'In Progress', progress: 45 },
              { title: 'Cloud Computing Basics', status: 'in-progress', date: 'In Progress', progress: 20 },
              { title: 'Data Analysis with Python', status: 'recommended', date: 'Recommended' },
              { title: 'Advanced SQL', status: 'recommended', date: 'Recommended' },
            ].map((item, index) => (
              <div key={index} className="relative flex items-start space-x-4">
                <div className={`w-4 h-4 rounded-full border-2 ${
                  item.status === 'completed' ? 'bg-green-600 border-green-600' :
                  item.status === 'in-progress' ? 'bg-[#1F5F95] border-[#1F5F95000' :
                  'bg-white border-gray-300'
                }`}></div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{item.title}</h4>
                  <p className="text-sm text-gray-500">{item.date}</p>
                  {item.progress !== undefined && (
                    <div className="mt-2 w-48">
                      <ProgressBar value={item.progress} height="h-1.5" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

function CertificatesPage() {
  return (
    <div className="p-6 space-y-6">
      <SectionTitle title="Certificates" subtitle="Your earned certifications" />
      
      <div className="grid md:grid-cols-2 gap-4">
        {mockCertificates.map((cert) => (
          <Card key={cert.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <span className="badge-success px-2 py-1 rounded-full text-xs font-medium">Active</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{cert.title}</h3>
            <p className="text-sm text-gray-500 mb-4">Issued by {cert.issuer}</p>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Issued: {cert.issuedDate}</span>
              <Button variant="outline" className="text-sm">Download</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ProfilePage() {
  return (
    <div className="p-6 space-y-6">
      <SectionTitle title="Profile" subtitle="Manage your account settings" />
      
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6 md:col-span-1">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-medium text-gray-600">
                {mockUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{mockUser.name}</h3>
            <p className="text-sm text-gray-500">{mockUser.email}</p>
            <p className="text-sm text-gray-500 capitalize">{mockUser.role}</p>
            <Button variant="outline" className="mt-4 w-full">Change Photo</Button>
          </div>
        </Card>
        
        <Card className="p-6 md:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Input label="First Name" value="Rahul" />
              <Input label="Last Name" value="Kumar" />
            </div>
            <Input label="Email" value={mockUser.email} />
            <Input label="Organization" value="SkillSphere Academy" />
            <Input label="Phone" value="+91 98765 43210" />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#1F5F95]"
                rows={4}
                defaultValue="Passionate learner focused on developing technical skills in Python, SQL, and Cloud Computing."
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="secondary">Cancel</Button>
              <Button>Save Changes</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function CourseDetailPage({ onBack }: { onBack: () => void }) {
  const course = mockCourses[0];
  
  return (
    <div className="p-6 space-y-6">
      <Button variant="outline" onClick={onBack} className="mb-4">← Back to Learning</Button>
      
      <Card className="p-6">
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              course.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
              course.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {course.difficulty}
            </span>
            <span className="text-sm text-gray-500">{course.duration}</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h1>
          <p className="text-gray-600">Instructor: {course.instructor}</p>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Skills Covered</h3>
          <div className="flex flex-wrap gap-2">
            {course.skills.map((skill, i) => (
              <span key={i} className="px-3 py-1 bg-blue-50 text-[#1F5F95] rounded-full text-sm">{skill}</span>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Prerequisites</h3>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            {course.prerequisites.map((prereq, i) => (
              <li key={i}>{prereq}</li>
            ))}
          </ul>
        </div>

        <div className="flex items-center space-x-3">
          <Button className="flex-1">Start Course</Button>
          <Button variant="outline">Add to Wishlist</Button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Modules</h3>
        <div className="space-y-3">
          {course.modules.map((module, index) => (
            <div
              key={module.id}
              className={`flex items-center justify-between p-4 rounded-lg border ${
                module.completed ? 'border-green-200 bg-green-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  module.completed ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {module.completed ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{module.title}</p>
                  <p className="text-sm text-gray-500">{module.duration}</p>
                </div>
              </div>
              {module.completed ? (
                <span className="text-sm text-green-600 font-medium">Completed</span>
              ) : (
                <Button variant="outline" className="text-sm">Start</Button>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function AssessmentQuizPage({ onComplete }: { onComplete: () => void }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    if (selectedAnswer !== null) {
      setAnswers([...answers, selectedAnswer]);
      if (currentQuestion < mockQuizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        onComplete();
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const question = mockQuizQuestions[currentQuestion];

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Assessment</h2>
          <p className="text-sm text-gray-500">Question {currentQuestion + 1} of {mockQuizQuestions.length}</p>
        </div>
        <div className={`px-4 py-2 rounded-lg font-mono ${timeLeft < 300 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-700'}`}>
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <ProgressBar value={((currentQuestion + 1) / mockQuizQuestions.length) * 100} height="h-2" />
      </div>

      {/* Question */}
      <Card className="p-6 mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">{question.question}</h3>
        
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <label
              key={index}
              className={`flex items-center p-4 border rounded-lg cursor-pointer transition-smooth ${
                selectedAnswer === index
                  ? 'border-[#1F5F95] bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="answer"
                checked={selectedAnswer === index}
                onChange={() => setSelectedAnswer(index)}
                className="w-4 h-4 text-[#1F5F95] border-gray-300 focus:ring-[#1F5F95]"
              />
              <span className="ml-3 text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="secondary"
          onClick={() => {
            if (currentQuestion > 0) {
              setCurrentQuestion(currentQuestion - 1);
              setSelectedAnswer(answers[currentQuestion - 1] || null);
            }
          }}
          disabled={currentQuestion === 0}
        >
          Previous
        </Button>
        <Button onClick={handleNext} disabled={selectedAnswer === null}>
          {currentQuestion === mockQuizQuestions.length - 1 ? 'Submit' : 'Next'}
        </Button>
      </div>
    </div>
  );
}

function TrainerDashboard() {
  const stats = [
    { label: 'Active Trainees', value: '156' },
    { label: 'Courses', value: '8' },
    { label: 'Pending Assessments', value: '23' },
    { label: 'Avg Competency', value: '67%' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Trainer Dashboard</h2>
        <Button>View All Reports</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="p-4">
            <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Trainee Performance */}
      <Card className="p-6">
        <SectionTitle title="Trainees Needing Attention" subtitle="Priority interventions required" />
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Skill Gap</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Score</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Priority</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Assessments</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mockTraineePerformance.map((trainee) => (
              <tr key={trainee.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <span className="font-medium text-gray-900">{trainee.name}</span>
                  <p className="text-xs text-gray-500">{trainee.lastActive}</p>
                </td>
                <td className="px-4 py-3 text-gray-600">{trainee.skill}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`font-medium ${trainee.score < 50 ? 'text-red-600' : 'text-yellow-600'}`}>
                    {trainee.score}%
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <StatusBadge status={trainee.priority} />
                </td>
                <td className="px-4 py-3 text-center text-gray-600">{trainee.assessmentsCompleted}</td>
                <td className="px-4 py-3 text-right">
                  <Button variant="outline" className="text-sm">Contact</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Performance Chart */}
      <Card className="p-6">
        <SectionTitle title="Trainee Performance Trend" subtitle="Average competency over time" />
        <div className="h-48 flex items-end justify-between space-x-2 px-4">
          {[52, 55, 58, 56, 60, 63, 65, 67].map((value, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-[#2E8B57] rounded-t transition-smooth"
                style={{ height: `${(value / 100) * 160}px` }}
              ></div>
              <span className="text-xs text-gray-500 mt-2">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'][index]}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function TrainerMatchingPage() {
  return (
    <div className="p-6 space-y-6">
      <SectionTitle title="Recommended Trainers" subtitle="Matched based on your learning needs" />
      
      <div className="grid gap-4">
        {mockTrainers.map((trainer) => (
          <Card key={trainer.id} className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-lg font-medium text-gray-600">
                    {trainer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{trainer.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{trainer.title}</p>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-2xl font-bold text-[#1F5F95]">{trainer.matchScore}%</span>
                    <span className="text-sm text-gray-500">Match</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {trainer.expertise.map((exp, i) => (
                      <span key={i} className="px-2 py-1 bg-blue-50 text-[#1F5F95] rounded text-xs">{exp}</span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {trainer.certifications.map((cert, i) => (
                      <span key={i} className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs">✓ {cert}</span>
                    ))}
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <StatusBadge status={trainer.availability} />
                    <span className="text-sm text-gray-500">Learner outcomes: {trainer.learnerOutcomes}%</span>
                  </div>
                  <div className="space-y-1">
                    {trainer.reason.map((r, i) => (
                      <p key={i} className="text-sm text-gray-600">✓ {r}</p>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Button>View Profile</Button>
                <Button variant="outline">Request Session</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function AdminDashboard() {
  const stats = [
    { label: 'Total Trainees', value: '1,247' },
    { label: 'Active Trainers', value: '48' },
    { label: 'Courses', value: '32' },
    { label: 'Avg Competency', value: '62%' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h2>
        <Button>Generate Report</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="p-4">
            <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Organization Skills */}
      <Card className="p-6">
        <SectionTitle title="Organization Skill Overview" subtitle="Average competency by skill domain" />
        <div className="space-y-4">
          {mockOrgSkills.map((skill, index) => (
            <div key={index}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">{skill.skill}</span>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm ${skill.trend === 'up' ? 'text-green-600' : skill.trend === 'down' ? 'text-red-600' : 'text-gray-500'}`}>
                    {skill.trend === 'up' ? '↑' : skill.trend === 'down' ? '↓' : '→'}
                  </span>
                  <span className="text-sm font-medium text-gray-900 w-16 text-right">{skill.averageScore}%</span>
                  <span className="text-xs text-gray-500 w-20 text-right">{skill.traineesCount} trainees</span>
                </div>
              </div>
              <ProgressBar
                value={skill.averageScore}
                color={skill.averageScore >= 70 ? 'bg-green-600' : skill.averageScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'}
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Critical Gaps */}
      <Card className="p-6">
        <SectionTitle title="Critical Skill Gaps" subtitle="Skills requiring organizational intervention" />
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Skill</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Trainees Affected</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Priority</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-900">Cloud Computing</td>
              <td className="px-4 py-3 text-center text-gray-600">312</td>
              <td className="px-4 py-3 text-center"><StatusBadge status="High" /></td>
              <td className="px-4 py-3 text-right"><Button variant="outline" className="text-sm">Plan Training</Button></td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-900">SQL</td>
              <td className="px-4 py-3 text-center text-gray-600">241</td>
              <td className="px-4 py-3 text-center"><StatusBadge status="High" /></td>
              <td className="px-4 py-3 text-right"><Button variant="outline" className="text-sm">Plan Training</Button></td>
            </tr>
          </tbody>
        </table>
      </Card>

      {/* Training Effectiveness */}
      <Card className="p-6">
        <SectionTitle title="Training Effectiveness" subtitle="Before and after competency comparison" />
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Course</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Before</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">After</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Improvement</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Participants</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mockTrainingEffectiveness.map((training, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{training.course}</td>
                <td className="px-4 py-3 text-center text-gray-600">{training.beforeScore}%</td>
                <td className="px-4 py-3 text-center text-gray-600">{training.afterScore}%</td>
                <td className="px-4 py-3 text-center">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm font-medium">
                    +{training.improvement}%
                  </span>
                </td>
                <td className="px-4 py-3 text-center text-gray-600">{training.participants}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');

  const handleLogin = (role: UserRole) => {
    if (role === 'trainee') {
      setCurrentPage('dashboard');
    } else if (role === 'trainer') {
      setCurrentPage('trainer-dashboard');
    } else if (role === 'admin') {
      setCurrentPage('admin-dashboard');
    } else {
      setCurrentPage('landing');
    }
  };

  const handleLogout = () => {
    setCurrentPage('landing');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onLogin={() => setCurrentPage('login')} />;
      case 'login':
        return <LoginPage onLogin={handleLogin} />;
      case 'dashboard':
        return <TraineeDashboard onNavigate={setCurrentPage} />;
      case 'my-learning':
        return <MyLearningPage />;
      case 'assessments':
        return <AssessmentsPage onStartQuiz={() => setCurrentPage('assessment-quiz')} />;
      case 'competency':
        return <CompetencyPage />;
      case 'skill-gaps':
        return <SkillGapsPage />;
      case 'recommendations':
        return <RecommendationsPage />;
      case 'learning-path':
        return <LearningPathPage />;
      case 'certificates':
        return <CertificatesPage />;
      case 'profile':
        return <ProfilePage />;
      case 'course':
        return <CourseDetailPage onBack={() => setCurrentPage('my-learning')} />;
      case 'assessment-quiz':
        return <AssessmentQuizPage onComplete={() => setCurrentPage('assessments')} />;
      case 'trainer-dashboard':
        return <TrainerDashboard />;
      case 'trainer-matching':
        return <TrainerMatchingPage />;
      case 'admin-dashboard':
        return <AdminDashboard />;
      default:
        return <TraineeDashboard onNavigate={setCurrentPage} />;
    }
  };

  // Landing and login pages don't have sidebar/header
  if (currentPage === 'landing' || currentPage === 'login') {
    return renderPage();
  }

  // Authenticated pages have sidebar and header
  return (
    <div className="flex min-h-screen bg-[#F5F7FA]">
      <Sidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        user={mockUser}
        onLogout={handleLogout}
      />
      <div className="flex-1 flex flex-col">
        <Header currentPage={currentPage} />
        <main className="flex-1 overflow-y-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
