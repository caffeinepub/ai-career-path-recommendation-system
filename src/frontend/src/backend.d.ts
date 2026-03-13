import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface SkillAssessment {
    id: string;
    status: AssessmentStatus;
    name: string;
}
export interface Sector {
    id: bigint;
    name: string;
    description: string;
}
export interface UserQuizResult {
    userId: string;
    answers: Array<bigint>;
    sector: Sector;
    timestamp: bigint;
}
export interface JobRole {
    role: string;
    jobId: string;
    description: string;
    typicalEducation: string;
    requirements: Array<string>;
}
export interface Question {
    id: bigint;
    answers: Array<string>;
    text: string;
}
export interface Roadmap {
    id: bigint;
    name: string;
    steps: Array<string>;
}
export interface UserProfile {
    completedAssessments: Array<SkillAssessment>;
    name: string;
    role: UserRole;
    email: string;
    savedJobs: Array<JobRole>;
    profilePicture?: string;
}
export enum AssessmentStatus {
    notStarted = "notStarted",
    completed = "completed",
    inProgress = "inProgress"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    authenticateUser(username: string, password: string): Promise<boolean>;
    changePassword(username: string, oldPassword: string, newPassword: string): Promise<boolean>;
    getAvailableRoadmaps(sectorId: bigint): Promise<Array<Roadmap>>;
    getAvailableSectors(): Promise<Array<Sector>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getRandomQuestions(count: bigint): Promise<Array<Question>>;
    getRecommendedJobRoles(sectorId: bigint): Promise<Array<JobRole>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    register(username: string, password: string): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitQuizAnswers(sector: Sector, answers: Array<bigint>): Promise<UserQuizResult>;
    updateUserProfile(name: string, email: string, profilePicture: string | null): Promise<UserProfile>;
    usernameExists(username: string): Promise<boolean>;
}
