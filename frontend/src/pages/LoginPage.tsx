import React, { useEffect } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, ArrowRight, Brain, Target, TrendingUp } from 'lucide-react';

export default function LoginPage() {
  const { login, clear, loginStatus, identity, isInitializing } = useInternetIdentity();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = '/career-kickstart';
    }
  }, [isAuthenticated]);

  const handleLogin = async () => {
    if (isAuthenticated) {
      window.location.href = '/career-kickstart';
      return;
    }
    try {
      await login();
    } catch (error: unknown) {
      const err = error as Error;
      if (err?.message === 'User is already authenticated') {
        await clear();
        setTimeout(() => login(), 300);
      }
    }
  };

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

  return (
    <div className="min-h-screen flex">
      {/* Left panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/assets/generated/auth-bg.dim_1440x900.png)' }}
        />
        <div className="absolute inset-0 gradient-purple opacity-90" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-2xl">Kick-Start Career's</span>
          </div>

          {/* Main content */}
          <div className="space-y-8">
            <div>
              <h1 className="font-display font-bold text-4xl xl:text-5xl leading-tight mb-4">
                Discover Your
                <br />
                <span className="text-white/80">Perfect Career Path</span>
              </h1>
              <p className="text-white/70 text-lg leading-relaxed max-w-md">
                AI-powered career guidance that analyzes your interests, skills, and goals to recommend
                the ideal career path for you.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              {[
                { icon: Brain, text: 'AI-driven interest analysis & quiz' },
                { icon: Target, text: 'Personalized job recommendations' },
                { icon: TrendingUp, text: 'Detailed career roadmaps & skill paths' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white/80 text-sm font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <p className="text-white/50 text-sm">
            Built with ♥ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'kick-start-careers')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>

      {/* Right panel - Login */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 justify-center">
            <div className="w-9 h-9 rounded-xl gradient-purple flex items-center justify-center shadow-purple">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-foreground">Kick-Start Career's</span>
          </div>

          {/* Header */}
          <div className="text-center lg:text-left">
            <h2 className="font-display font-bold text-3xl text-foreground mb-2">
              Welcome Back
            </h2>
            <p className="text-muted-foreground">
              Sign in to continue your career journey
            </p>
          </div>

          {/* Login card */}
          <div className="bg-white border border-border rounded-2xl p-8 shadow-sm space-y-6">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 gradient-purple rounded-2xl flex items-center justify-center mx-auto shadow-purple">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-lg text-foreground">
                  Sign in with Internet Identity
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Secure, passwordless authentication powered by the Internet Computer
                </p>
              </div>
            </div>

            <Button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="w-full h-12 gradient-purple text-white font-semibold text-base shadow-purple hover:shadow-purple-lg transition-all rounded-xl"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In / Sign Up
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>

            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                New users will be prompted to set up their profile after signing in.
              </p>
            </div>
          </div>

          {/* Features for mobile */}
          <div className="lg:hidden grid grid-cols-3 gap-3">
            {[
              { icon: Brain, label: 'AI Analysis' },
              { icon: Target, label: 'Job Match' },
              { icon: TrendingUp, label: 'Roadmaps' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="text-center p-3 bg-purple-50 rounded-xl">
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
