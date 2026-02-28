import Map "mo:core/Map";

module {
  type OldUserQuizResult = {
    userId : Text;
    sector : Sector;
    responses : [Nat];
    timestamp : Int;
  };

  type Sector = {
    id : Nat;
    name : Text;
    description : Text;
  };

  type NewUserQuizResult = {
    userId : Text;
    sector : Sector;
    answers : [Nat];
    timestamp : Int;
  };

  type OldActor = {
    jobs : Map.Map<Text, JobRole>;
    userQuizResults : Map.Map<Principal, OldUserQuizResult>;
    userProfiles : Map.Map<Principal, UserProfile>;
  };

  type NewActor = {
    jobs : Map.Map<Text, JobRole>;
    userQuizResults : Map.Map<Principal, NewUserQuizResult>;
    userProfiles : Map.Map<Principal, UserProfile>;
  };

  // Types needed for actor definition
  type JobRole = {
    jobId : Text;
    role : Text;
    description : Text;
    requirements : [Text];
    typicalEducation : Text;
  };

  type UserProfile = {
    name : Text;
    email : Text;
    role : Role;
    profilePicture : ?Text;
    completedAssessments : [SkillAssessment];
    savedJobs : [JobRole];
  };

  type Role = {
    #admin;
    #user;
    #guest;
  };

  type SkillAssessment = {
    id : Text;
    name : Text;
    status : AssessmentStatus;
  };

  type AssessmentStatus = {
    #notStarted;
    #inProgress;
    #completed;
  };

  public func run(old : OldActor) : NewActor {
    // Convert quiz results to new format with answers field
    let newQuizResults = old.userQuizResults.map<Principal, OldUserQuizResult, NewUserQuizResult>(
      func(_principal, oldResult) {
        {
          oldResult with
          answers = oldResult.responses;
        };
      }
    );

    // Return new actor state with converted quiz results
    { old with userQuizResults = newQuizResults };
  };
};
