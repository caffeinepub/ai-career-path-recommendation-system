import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { UserRole, AssessmentStatus } from '../backend';
import { Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfileSetupModal() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const { mutateAsync: saveProfile, isPending } = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await saveProfile({
        name: name.trim(),
        email: email.trim(),
        role: UserRole.user,
        profilePicture: undefined,
        completedAssessments: [],
        savedJobs: [],
      });
      toast.success('Profile created! Welcome to CareerAI 🎉');
      window.location.href = '/career-kickstart';
    } catch (err) {
      toast.error('Failed to save profile. Please try again.');
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl gradient-purple flex items-center justify-center shadow-purple">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-display font-bold">Welcome to CareerAI!</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Let's set up your profile to get started.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Full Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full h-11 gradient-purple text-white font-semibold shadow-purple hover:shadow-purple-lg transition-all"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Setting up...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Get Started
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
