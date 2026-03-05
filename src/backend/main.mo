import Iter "mo:core/Iter";
import Text "mo:core/Text";
import List "mo:core/List";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Time "mo:core/Time";

import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";


actor {
  include MixinStorage();

  let jobs = Map.empty<Text, JobRole>();
  let userQuizResults = Map.empty<Principal, UserQuizResult>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Persistent state + authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type JobRole = {
    jobId : Text;
    role : Text;
    description : Text;
    requirements : [Text];
    typicalEducation : Text;
  };

  public type Question = {
    id : Nat;
    text : Text;
    answers : [Text];
  };

  public type AssessmentStatus = {
    #notStarted;
    #inProgress;
    #completed;
  };

  public type SkillAssessment = {
    id : Text;
    name : Text;
    status : AssessmentStatus;
  };

  public type UserProfile = {
    name : Text;
    email : Text;
    role : AccessControl.UserRole;
    profilePicture : ?Text;
    completedAssessments : [SkillAssessment];
    savedJobs : [JobRole];
  };

  module UserProfile {
    public func compareByName(profile1 : UserProfile, profile2 : UserProfile) : Order.Order {
      Text.compare(profile1.name, profile2.name);
    };
  };

  public type Sector = {
    id : Nat;
    name : Text;
    description : Text;
  };

  public type Roadmap = {
    id : Nat;
    name : Text;
    steps : [Text];
  };

  public type UserInterest = {
    sector : Sector;
    quizResponses : [Nat];
  };

  public type UserQuizResult = {
    userId : Text;
    sector : Sector;
    answers : [Nat];
    timestamp : Int;
  };

  // Submits quiz answers and stores the results for later dashboard display.
  // This function is called when the quiz browser form is submitted.
  public shared ({ caller }) func submitQuizAnswers(sector : Sector, answers : [Nat]) : async UserQuizResult {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit quiz answers");
    };

    let result : UserQuizResult = {
      userId = debug_show (caller);
      sector;
      answers;
      timestamp = Time.now();
    };

    userQuizResults.add(caller, result);
    result;
  };

  // Required profile functions per instructions

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get their profile");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Get recommended job roles — only authenticated users can view recommendations
  public query ({ caller }) func getRecommendedJobRoles(sectorId : Nat) : async [JobRole] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get job recommendations");
    };

    let filteredJobs = jobs.values().filter(
      func(job) { job.jobId == sectorId.toText() }
    ).toArray();

    let sortedJobs = filteredJobs.sort(
      func(a, b) {
        Text.compare(a.role, b.role);
      }
    );

    sortedJobs.sliceToArray(0, if (sortedJobs.size() > 5) { 5 } else {
      sortedJobs.size();
    });
  };

  // Get random questions — only authenticated users can access quiz questions
  public query ({ caller }) func getRandomQuestions(count : Nat) : async [Question] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access quiz questions");
    };

    let allQuestions = List.fromArray<Question>([
      {
        id = 1;
        text = "What interests you most?";
        answers = ["Technology", "Healthcare", "Arts", "Business"];
      },
      {
        id = 2;
        text = "What is your preferred work environment?";
        answers = ["Office", "Remote", "Field", "Laboratory"];
      },
    ]);

    let numQuestions = if (allQuestions.size() > count) { count } else {
      allQuestions.size();
    };
    allQuestions.sliceToArray(0, numQuestions);
  };

  // Update user profile — only authenticated users can update their own profile
  public shared ({ caller }) func updateUserProfile(
    name : Text,
    email : Text,
    profilePicture : ?Text,
  ) : async UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update profiles");
    };

    let profile = {
      name;
      email;
      role = switch (AccessControl.getUserRole(accessControlState, caller)) {
        case (#admin) { #admin };
        case (#user) { #user };
        case (#guest) { #guest };
      };
      profilePicture;
      completedAssessments = [];
      savedJobs = [];
    };

    userProfiles.add(caller, profile);
    profile;
  };

  // Get available roadmaps — only authenticated users can view roadmaps
  public query ({ caller }) func getAvailableRoadmaps(sectorId : Nat) : async [Roadmap] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view roadmaps");
    };

    let roadmaps = List.empty<Roadmap>();

    if (sectorId == 1) {
      roadmaps.add({
        id = 1;
        name = "Software Development";
        steps = ["Learn Programming", "Build Projects", "Gain Experience", "Advance Your Career"];
      });
    };

    if (sectorId == 2) {
      roadmaps.add({
        id = 2;
        name = "Healthcare Professional";
        steps = ["Obtain Degree", "Complete Certification", "Gain Experience", "Specialize"];
      });
    };

    roadmaps.toArray();
  };

  // Get available sectors — accessible to any authenticated user (shown after login, before quiz)
  public query ({ caller }) func getAvailableSectors() : async [Sector] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view sectors");
    };

    [
      {
        id = 1;
        name = "Technology";
        description = "Interest in technology and computers";
      },
      {
        id = 2;
        name = "Healthcare";
        description = "Interest in healthcare and helping people";
      },
      {
        id = 3;
        name = "Commercial";
        description = "Interest in commercial fields";
      },
    ];
  };
};

