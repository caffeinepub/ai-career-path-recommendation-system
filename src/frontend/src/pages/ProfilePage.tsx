import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Award,
  Briefcase,
  CheckCircle2,
  Edit3,
  Loader2,
  Mail,
  Save,
  Shield,
  User,
  X,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { AssessmentStatus } from "../backend";
import {
  useGetCallerUserProfile,
  useUpdateUserProfile,
} from "../hooks/useQueries";

export default function ProfilePage() {
  const { data: userProfile, isLoading } = useGetCallerUserProfile();
  const { mutateAsync: updateProfile, isPending: isSaving } =
    useUpdateUserProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name);
      setEmail(userProfile.email);
    }
  }, [userProfile]);

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      toast.error("Name and email are required");
      return;
    }
    try {
      await updateProfile({ name: name.trim(), email: email.trim() });
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const handleCancel = () => {
    if (userProfile) {
      setName(userProfile.name);
      setEmail(userProfile.email);
    }
    setIsEditing(false);
  };

  const getInitials = (n: string) =>
    n
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const completedAssessments = (userProfile?.completedAssessments || []).filter(
    (a) => a.status === AssessmentStatus.completed,
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <Skeleton className="h-40 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-background py-10 flex items-center justify-center">
        <div className="text-center">
          <User className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h2 className="font-display font-semibold text-lg text-foreground mb-2">
            Profile not found
          </h2>
          <p className="text-muted-foreground text-sm mb-4">
            Please complete your profile setup first.
          </p>
          <Button asChild className="gradient-purple text-white shadow-purple">
            <a href="/career-kickstart">Go to Home</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Page header */}
        <div className="animate-fade-in">
          <h1 className="font-display font-bold text-3xl text-foreground mb-1">
            My Profile
          </h1>
          <p className="text-muted-foreground">
            Manage your personal information and view your progress
          </p>
        </div>

        {/* Profile card */}
        <Card className="border border-border shadow-xs animate-fade-in">
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-start gap-5 flex-wrap">
              {/* Avatar */}
              <div className="relative">
                <Avatar className="w-20 h-20">
                  <AvatarFallback className="gradient-purple text-white text-2xl font-display font-bold">
                    {getInitials(userProfile.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <CheckCircle2 className="w-3 h-3 text-white" />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <h2 className="font-display font-bold text-xl text-foreground">
                      {userProfile.name}
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      {userProfile.email}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        variant="secondary"
                        className="bg-primary/10 text-primary border-0 text-xs capitalize"
                      >
                        <Shield className="w-3 h-3 mr-1" />
                        {userProfile.role}
                      </Badge>
                      {completedAssessments.length > 0 && (
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-700 border-0 text-xs"
                        >
                          <Award className="w-3 h-3 mr-1" />
                          {completedAssessments.length} assessments
                        </Badge>
                      )}
                    </div>
                  </div>
                  {!isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className="border-primary/30 text-primary hover:bg-primary/5 shrink-0"
                    >
                      <Edit3 className="w-3.5 h-3.5 mr-1.5" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Edit form */}
            {isEditing && (
              <>
                <Separator className="my-6" />
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground text-sm">
                    Edit Information
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="profile-name"
                        className="text-sm font-medium flex items-center gap-1.5"
                      >
                        <User className="w-3.5 h-3.5 text-muted-foreground" />
                        Full Name
                      </Label>
                      <Input
                        id="profile-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="profile-email"
                        className="text-sm font-medium flex items-center gap-1.5"
                      >
                        <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                        Email Address
                      </Label>
                      <Input
                        id="profile-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your email"
                        className="h-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="gradient-purple text-white shadow-purple hover:shadow-purple-lg transition-all"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={handleCancel}
                      disabled={isSaving}
                      className="text-muted-foreground"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Completed Assessments */}
        <Card className="border border-border shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 font-display text-lg">
              <div className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center">
                <Award className="w-4 h-4 text-primary" />
              </div>
              Skill Assessments
              {completedAssessments.length > 0 && (
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary border-0 ml-auto"
                >
                  {completedAssessments.length} completed
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {completedAssessments.length === 0 ? (
              <div className="text-center py-8">
                <Award className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-3">
                  No assessments completed yet. Take your first assessment to
                  validate your skills.
                </p>
                <Button
                  asChild
                  size="sm"
                  className="gradient-purple text-white shadow-purple hover:shadow-purple-lg transition-all"
                >
                  <a href="/skill-assessment">Start Assessment</a>
                </Button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                {completedAssessments.map((assessment) => (
                  <div
                    key={assessment.id}
                    className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-100"
                  >
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {assessment.name}
                      </p>
                      <p className="text-xs text-green-600">Completed</p>
                    </div>
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="text-xs text-muted-foreground hover:text-primary shrink-0 px-2"
                    >
                      <a href={`/skill-assessment/${assessment.id}`}>Retake</a>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Saved Jobs */}
        <Card className="border border-border shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 font-display text-lg">
              <div className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-primary" />
              </div>
              Saved Jobs
              {userProfile.savedJobs.length > 0 && (
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary border-0 ml-auto"
                >
                  {userProfile.savedJobs.length} saved
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userProfile.savedJobs.length === 0 ? (
              <div className="text-center py-8">
                <Briefcase className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-3">
                  No saved jobs yet. Explore careers and save the ones that
                  interest you.
                </p>
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="border-primary/30 text-primary hover:bg-primary/5"
                >
                  <a href="/job-search">Browse Jobs</a>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {userProfile.savedJobs.map((job) => (
                  <div
                    key={job.jobId}
                    className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl border border-border"
                  >
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <Briefcase className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {job.role}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {job.description}
                      </p>
                    </div>
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="text-xs text-primary hover:bg-primary/5 shrink-0 px-2"
                    >
                      <a href={`/job/${encodeURIComponent(job.jobId)}`}>View</a>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick links */}
        <Card className="border border-border shadow-xs bg-primary/5">
          <CardContent className="p-5">
            <p className="font-semibold text-sm text-foreground mb-3">
              Quick Actions
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                asChild
                size="sm"
                className="gradient-purple text-white shadow-purple hover:shadow-purple-lg transition-all"
              >
                <a href="/quiz/sector-selection">Retake Quiz</a>
              </Button>
              <Button
                asChild
                size="sm"
                variant="outline"
                className="border-primary/30 text-primary hover:bg-primary/5"
              >
                <a href="/skill-assessment">Take Assessment</a>
              </Button>
              <Button
                asChild
                size="sm"
                variant="outline"
                className="border-primary/30 text-primary hover:bg-primary/5"
              >
                <a href="/job-search">Browse Jobs</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
