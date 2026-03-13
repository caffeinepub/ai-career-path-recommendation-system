import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Brain,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Sparkles,
  Target,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocalAuth } from "../hooks/useLocalAuth";

function validatePassword(pw: string) {
  return {
    hasUpper: /[A-Z]/.test(pw),
    hasNumber: /[0-9]/.test(pw),
    hasSpecial: /[^A-Za-z0-9]/.test(pw),
    hasLength: pw.length >= 8,
  };
}

export default function LoginPage() {
  const { login, register, changePassword, isAuthenticated, isInitializing } =
    useLocalAuth();

  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Sign In state
  const [siUsername, setSiUsername] = useState("");
  const [siPassword, setSiPassword] = useState("");
  const [siError, setSiError] = useState("");
  const [siLoading, setSiLoading] = useState(false);
  const [siShowPw, setSiShowPw] = useState(false);

  // Sign Up state
  const [suUsername, setSuUsername] = useState("");
  const [suPassword, setSuPassword] = useState("");
  const [suConfirm, setSuConfirm] = useState("");
  const [suError, setSuError] = useState("");
  const [suLoading, setSuLoading] = useState(false);
  const [suShowPw, setSuShowPw] = useState(false);

  // Forgot / Change password state
  const [fpUsername, setFpUsername] = useState("");
  const [fpOldPw, setFpOldPw] = useState("");
  const [fpNewPw, setFpNewPw] = useState("");
  const [fpConfirmPw, setFpConfirmPw] = useState("");
  const [fpError, setFpError] = useState("");
  const [fpSuccess, setFpSuccess] = useState("");
  const [fpLoading, setFpLoading] = useState(false);
  const [fpShowOld, setFpShowOld] = useState(false);
  const [fpShowNew, setFpShowNew] = useState(false);

  const pwRules = validatePassword(suPassword);
  const fpNewRules = validatePassword(fpNewPw);

  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = "/career-kickstart";
    }
  }, [isAuthenticated]);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSiError("");
    if (!siUsername.trim()) {
      setSiError("Username is required.");
      return;
    }
    if (!siPassword) {
      setSiError("Password is required.");
      return;
    }
    setSiLoading(true);
    const res = await login(siUsername.trim(), siPassword);
    setSiLoading(false);
    if (!res.success) {
      setSiError(res.error || "Login failed.");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuError("");
    if (!suUsername.trim()) {
      setSuError("Username is required.");
      return;
    }
    if (suUsername.trim().length < 3) {
      setSuError("Username must be at least 3 characters.");
      return;
    }
    if (!suPassword) {
      setSuError("Password is required.");
      return;
    }
    const rules = validatePassword(suPassword);
    if (!rules.hasLength) {
      setSuError("Password must be at least 8 characters.");
      return;
    }
    if (!rules.hasUpper) {
      setSuError("Password must include at least one uppercase letter.");
      return;
    }
    if (!rules.hasNumber) {
      setSuError("Password must include at least one number.");
      return;
    }
    if (!rules.hasSpecial) {
      setSuError("Password must include at least one special character.");
      return;
    }
    if (suPassword !== suConfirm) {
      setSuError("Passwords do not match.");
      return;
    }
    setSuLoading(true);
    const res = await register(suUsername.trim(), suPassword);
    setSuLoading(false);
    if (!res.success) {
      setSuError(res.error || "Registration failed.");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setFpError("");
    setFpSuccess("");
    if (!fpUsername.trim()) {
      setFpError("Username is required.");
      return;
    }
    if (!fpOldPw) {
      setFpError("Current password is required.");
      return;
    }
    const rules = validatePassword(fpNewPw);
    if (!rules.hasLength) {
      setFpError("New password must be at least 8 characters.");
      return;
    }
    if (!rules.hasUpper) {
      setFpError("New password must include at least one uppercase letter.");
      return;
    }
    if (!rules.hasNumber) {
      setFpError("New password must include at least one number.");
      return;
    }
    if (!rules.hasSpecial) {
      setFpError("New password must include at least one special character.");
      return;
    }
    if (fpNewPw !== fpConfirmPw) {
      setFpError("New passwords do not match.");
      return;
    }
    setFpLoading(true);
    const res = await changePassword(fpUsername.trim(), fpOldPw, fpNewPw);
    setFpLoading(false);
    if (!res.success) {
      setFpError(res.error || "Failed to change password.");
    } else {
      setFpSuccess("Password changed successfully! You can now sign in.");
      setFpOldPw("");
      setFpNewPw("");
      setFpConfirmPw("");
    }
  };

  const RuleRow = ({
    met,
    label,
  }: {
    met: boolean;
    label: string;
  }) => (
    <div className="flex items-center gap-1.5 text-xs">
      {met ? (
        <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
      ) : (
        <XCircle className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
      )}
      <span className={met ? "text-green-600" : "text-muted-foreground"}>
        {label}
      </span>
    </div>
  );

  if (showForgotPassword) {
    return (
      <div className="min-h-screen flex">
        {/* Left panel */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 gradient-purple" />
          <div className="relative z-10 flex flex-col justify-between p-12 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-2xl">
                Kick-Start Career's
              </span>
            </div>
            <div className="space-y-8">
              <div>
                <h1 className="font-display font-bold text-4xl xl:text-5xl leading-tight mb-4">
                  Reset Your
                  <br />
                  <span className="text-white/80">Password</span>
                </h1>
                <p className="text-white/70 text-lg leading-relaxed max-w-md">
                  Enter your current password to set a new one.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div
          className="flex-1 flex items-center justify-center p-6 sm:p-12"
          style={{ background: "oklch(97% 0.02 280)" }}
        >
          <div className="w-full max-w-md space-y-6">
            <div className="lg:hidden flex items-center gap-2 justify-center">
              <div className="w-9 h-9 rounded-xl gradient-purple flex items-center justify-center shadow-purple">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-foreground">
                Kick-Start Career's
              </span>
            </div>
            <div className="text-center lg:text-left">
              <h2 className="font-display font-bold text-3xl text-foreground mb-1">
                Change Password
              </h2>
              <p className="text-muted-foreground text-sm">
                Enter your current password to set a new one
              </p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="fp-username">Username</Label>
                  <Input
                    id="fp-username"
                    type="text"
                    placeholder="Your username"
                    value={fpUsername}
                    onChange={(e) => setFpUsername(e.target.value)}
                    data-ocid="forgot_password.input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="fp-old">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="fp-old"
                      type={fpShowOld ? "text" : "password"}
                      placeholder="Your current password"
                      value={fpOldPw}
                      onChange={(e) => setFpOldPw(e.target.value)}
                      className="pr-10"
                      data-ocid="forgot_password.input"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setFpShowOld(!fpShowOld)}
                      tabIndex={-1}
                    >
                      {fpShowOld ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="fp-new">New Password</Label>
                  <div className="relative">
                    <Input
                      id="fp-new"
                      type={fpShowNew ? "text" : "password"}
                      placeholder="New password"
                      value={fpNewPw}
                      onChange={(e) => setFpNewPw(e.target.value)}
                      className="pr-10"
                      data-ocid="forgot_password.input"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setFpShowNew(!fpShowNew)}
                      tabIndex={-1}
                    >
                      {fpShowNew ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {fpNewPw && (
                    <div className="mt-2 space-y-1 p-3 bg-muted/50 rounded-lg">
                      <RuleRow
                        met={fpNewRules.hasLength}
                        label="At least 8 characters"
                      />
                      <RuleRow
                        met={fpNewRules.hasUpper}
                        label="One uppercase letter (A-Z)"
                      />
                      <RuleRow
                        met={fpNewRules.hasNumber}
                        label="One number (0-9)"
                      />
                      <RuleRow
                        met={fpNewRules.hasSpecial}
                        label="One special character (!@#$...)"
                      />
                    </div>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="fp-confirm">Confirm New Password</Label>
                  <Input
                    id="fp-confirm"
                    type="password"
                    placeholder="Re-enter new password"
                    value={fpConfirmPw}
                    onChange={(e) => setFpConfirmPw(e.target.value)}
                    data-ocid="forgot_password.input"
                  />
                </div>
                {fpError && (
                  <p
                    className="text-sm text-destructive"
                    data-ocid="forgot_password.error_state"
                  >
                    {fpError}
                  </p>
                )}
                {fpSuccess && (
                  <p
                    className="text-sm text-green-600"
                    data-ocid="forgot_password.success_state"
                  >
                    {fpSuccess}
                  </p>
                )}
                <Button
                  type="submit"
                  disabled={fpLoading}
                  className="w-full h-11 bg-primary text-primary-foreground font-semibold shadow-purple hover:opacity-90 transition-all rounded-xl"
                  data-ocid="forgot_password.submit_button"
                >
                  {fpLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Changing...
                    </>
                  ) : (
                    "Change Password"
                  )}
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  <button
                    type="button"
                    className="text-primary font-medium hover:underline"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setFpError("");
                      setFpSuccess("");
                    }}
                    data-ocid="forgot_password.cancel_button"
                  >
                    Back to Sign In
                  </button>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 gradient-purple" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-2xl">
              Kick-Start Career's
            </span>
          </div>

          <div className="space-y-8">
            <div>
              <h1 className="font-display font-bold text-4xl xl:text-5xl leading-tight mb-4">
                Discover Your
                <br />
                <span className="text-white/80">Perfect Career Path</span>
              </h1>
              <p className="text-white/70 text-lg leading-relaxed max-w-md">
                AI-powered career guidance that analyzes your interests, skills,
                and goals to recommend the ideal career path for you.
              </p>
            </div>
            <div className="space-y-4">
              {[
                { icon: Brain, text: "AI-driven interest analysis & quiz" },
                { icon: Target, text: "Personalized job recommendations" },
                {
                  icon: TrendingUp,
                  text: "Detailed career roadmaps & skill paths",
                },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white/80 text-sm font-medium">
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - Form */}
      <div
        className="flex-1 flex items-center justify-center p-6 sm:p-12"
        style={{ background: "oklch(97% 0.02 280)" }}
      >
        <div className="w-full max-w-md space-y-6">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 justify-center">
            <div className="w-9 h-9 rounded-xl gradient-purple flex items-center justify-center shadow-purple">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-foreground">
              Kick-Start Career's
            </span>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="font-display font-bold text-3xl text-foreground mb-1">
              Welcome to{" "}
              <span style={{ color: "oklch(60% 0.22 285)" }}>Career's</span>
            </h2>
            <p className="text-muted-foreground text-sm">
              Create an account or sign in to continue your journey
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
            <Tabs
              value={tab}
              onValueChange={(v) => setTab(v as "signin" | "signup")}
            >
              <TabsList className="w-full mb-6">
                <TabsTrigger
                  value="signin"
                  className="flex-1"
                  data-ocid="auth.tab"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="flex-1"
                  data-ocid="auth.tab"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>

              {/* SIGN IN */}
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="si-username">Username</Label>
                    <Input
                      id="si-username"
                      type="text"
                      placeholder="Enter your username"
                      value={siUsername}
                      onChange={(e) => setSiUsername(e.target.value)}
                      autoComplete="username"
                      data-ocid="auth.input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="si-password">Password</Label>
                      <button
                        type="button"
                        className="text-xs text-primary hover:underline"
                        onClick={() => setShowForgotPassword(true)}
                        data-ocid="auth.link"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Input
                        id="si-password"
                        type={siShowPw ? "text" : "password"}
                        placeholder="Enter your password"
                        value={siPassword}
                        onChange={(e) => setSiPassword(e.target.value)}
                        autoComplete="current-password"
                        className="pr-10"
                        data-ocid="auth.input"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setSiShowPw(!siShowPw)}
                        tabIndex={-1}
                      >
                        {siShowPw ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  {siError && (
                    <p
                      className="text-sm text-destructive"
                      data-ocid="auth.error_state"
                    >
                      {siError}
                    </p>
                  )}
                  <Button
                    type="submit"
                    disabled={siLoading}
                    className="w-full h-11 bg-primary text-primary-foreground font-semibold shadow-purple hover:opacity-90 transition-all rounded-xl"
                    data-ocid="auth.submit_button"
                  >
                    {siLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      className="text-primary font-medium hover:underline"
                      onClick={() => setTab("signup")}
                    >
                      Create one
                    </button>
                  </p>
                </form>
              </TabsContent>

              {/* SIGN UP */}
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="su-username">Username</Label>
                    <Input
                      id="su-username"
                      type="text"
                      placeholder="Choose a username (min 3 chars)"
                      value={suUsername}
                      onChange={(e) => setSuUsername(e.target.value)}
                      autoComplete="username"
                      data-ocid="auth.input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="su-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="su-password"
                        type={suShowPw ? "text" : "password"}
                        placeholder="Create a strong password"
                        value={suPassword}
                        onChange={(e) => setSuPassword(e.target.value)}
                        autoComplete="new-password"
                        className="pr-10"
                        data-ocid="auth.input"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setSuShowPw(!suShowPw)}
                        tabIndex={-1}
                      >
                        {suShowPw ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {suPassword && (
                      <div className="mt-2 space-y-1 p-3 bg-muted/50 rounded-lg">
                        <RuleRow
                          met={pwRules.hasLength}
                          label="At least 8 characters"
                        />
                        <RuleRow
                          met={pwRules.hasUpper}
                          label="One uppercase letter (A-Z)"
                        />
                        <RuleRow
                          met={pwRules.hasNumber}
                          label="One number (0-9)"
                        />
                        <RuleRow
                          met={pwRules.hasSpecial}
                          label="One special character (!@#$...)"
                        />
                      </div>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="su-confirm">Confirm Password</Label>
                    <Input
                      id="su-confirm"
                      type="password"
                      placeholder="Re-enter your password"
                      value={suConfirm}
                      onChange={(e) => setSuConfirm(e.target.value)}
                      autoComplete="new-password"
                      data-ocid="auth.input"
                    />
                  </div>
                  {suError && (
                    <p
                      className="text-sm text-destructive"
                      data-ocid="auth.error_state"
                    >
                      {suError}
                    </p>
                  )}
                  <Button
                    type="submit"
                    disabled={suLoading}
                    className="w-full h-11 bg-primary text-primary-foreground font-semibold shadow-purple hover:opacity-90 transition-all rounded-xl"
                    data-ocid="auth.submit_button"
                  >
                    {suLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">
                    Already have an account?{" "}
                    <button
                      type="button"
                      className="text-primary font-medium hover:underline"
                      onClick={() => setTab("signin")}
                    >
                      Sign in
                    </button>
                  </p>
                </form>
              </TabsContent>
            </Tabs>
          </div>

          {/* Mobile features */}
          <div className="lg:hidden grid grid-cols-3 gap-3">
            {[
              { icon: Brain, label: "AI Analysis" },
              { icon: Target, label: "Job Match" },
              { icon: TrendingUp, label: "Roadmaps" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="text-center p-3 bg-purple-50 rounded-xl"
              >
                <Icon className="w-5 h-5 text-primary mx-auto mb-1" />
                <p className="text-xs font-medium text-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
