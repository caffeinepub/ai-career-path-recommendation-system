import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { useLocalAuth } from "./hooks/useLocalAuth";
import { useGetCallerUserProfile } from "./hooks/useQueries";

import Layout from "./components/Layout";
import ProfileSetupModal from "./components/ProfileSetupModal";
import AssessmentTestPage from "./pages/AssessmentTestPage";
import CareerKickStartPage from "./pages/CareerKickStartPage";
import DashboardPage from "./pages/DashboardPage";
import JobDescriptionPage from "./pages/JobDescriptionPage";
import JobSearchPage from "./pages/JobSearchPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import QuizQuestionsPage from "./pages/QuizQuestionsPage";
import SectorSelectionPage from "./pages/SectorSelectionPage";
import SkillAssessmentPage from "./pages/SkillAssessmentPage";

const rootRoute = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <Outlet />
      <Toaster richColors position="top-right" />
    </>
  );
}

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const authenticatedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "authenticated",
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { identity, isInitializing } = useLocalAuth();
  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched,
  } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const showProfileSetup =
    isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    window.location.href = "/login";
    return null;
  }

  return (
    <>
      <Layout>
        <Outlet />
      </Layout>
      {showProfileSetup && <ProfileSetupModal />}
    </>
  );
}

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => {
    window.location.href = "/login";
    return null;
  },
});

const careerKickStartRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/career-kickstart",
  component: CareerKickStartPage,
});

const sectorSelectionRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/quiz/sector-selection",
  component: SectorSelectionPage,
});

const quizQuestionsRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/quiz/questions",
  component: QuizQuestionsPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/dashboard",
  component: DashboardPage,
});

const jobSearchRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/job-search",
  component: JobSearchPage,
});

const jobDescriptionRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/job/$jobId",
  component: JobDescriptionPage,
});

const skillAssessmentRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/skill-assessment",
  component: SkillAssessmentPage,
});

const assessmentTestRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/skill-assessment/$assessmentId",
  component: AssessmentTestPage,
});

const profileRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/profile",
  component: ProfilePage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  authenticatedRoute.addChildren([
    careerKickStartRoute,
    sectorSelectionRoute,
    quizQuestionsRoute,
    dashboardRoute,
    jobSearchRoute,
    jobDescriptionRoute,
    skillAssessmentRoute,
    assessmentTestRoute,
    profileRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
