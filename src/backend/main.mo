import Iter "mo:core/Iter";
import Text "mo:core/Text";
import List "mo:core/List";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Char "mo:core/Char";
import Nat32 "mo:core/Nat32";

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
  let userCredentials = Map.empty<Text, UserCredentials>();

  // Persistent state + authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserCredentials = {
    username : Text;
    passwordHash : Text;
    userPrincipal : Principal;
  };

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

  // djb2 hash for passwords
  func hashPassword(password : Text) : Text {
    var h : Nat32 = 5381;
    for (c in password.chars()) {
      h := h *% 33 +% c.toNat32();
    };
    h.toText();
  };

  // Register a new user with username and password
  public shared ({ caller }) func register(username : Text, password : Text) : async Bool {
    if (userCredentials.get(username) != null) {
      return false; // Username already taken
    };

    let creds : UserCredentials = {
      username;
      passwordHash = hashPassword(password);
      userPrincipal = caller;
    };

    userCredentials.add(username, creds);

    // Initialize default profile
    let defaultProfile : UserProfile = {
      name = username;
      email = "";
      role = #user;
      profilePicture = null;
      completedAssessments = [];
      savedJobs = [];
    };
    userProfiles.add(caller, defaultProfile);

    // Grant user role directly via the state map
    accessControlState.userRoles.add(caller, #user);

    true;
  };

  // Authenticate user with username and password
  public query func authenticateUser(username : Text, password : Text) : async Bool {
    switch (userCredentials.get(username)) {
      case null { false };
      case (?creds) {
        creds.passwordHash == hashPassword(password);
      };
    };
  };

  // Check if username exists
  public query func usernameExists(username : Text) : async Bool {
    userCredentials.get(username) != null;
  };

  // Get principal for a username (used by frontend after successful auth)
  public query func getPrincipalForUsername(username : Text) : async ?Principal {
    switch (userCredentials.get(username)) {
      case null { null };
      case (?creds) { ?creds.userPrincipal };
    };
  };

  // Change password for an existing user (requires correct current password)
  public shared ({ caller }) func changePassword(username : Text, oldPassword : Text, newPassword : Text) : async Bool {
    switch (userCredentials.get(username)) {
      case null { false };
      case (?creds) {
        if (creds.passwordHash != hashPassword(oldPassword)) {
          return false;
        };
        if (creds.userPrincipal != caller) {
          return false;
        };
        let updated : UserCredentials = {
          username;
          passwordHash = hashPassword(newPassword);
          userPrincipal = caller;
        };
        userCredentials.add(username, updated);
        true;
      };
    };
  };

  // Claim admin if no admin has been assigned yet
  public shared ({ caller }) func claimFirstAdmin() : async Bool {
    if (caller.isAnonymous()) { return false };
    if (accessControlState.adminAssigned) { return false };
    accessControlState.userRoles.add(caller, #admin);
    accessControlState.adminAssigned := true;
    // Update user profile role too
    switch (userProfiles.get(caller)) {
      case null {};
      case (?profile) {
        let updated : UserProfile = {
          name = profile.name;
          email = profile.email;
          role = #admin;
          profilePicture = profile.profilePicture;
          completedAssessments = profile.completedAssessments;
          savedJobs = profile.savedJobs;
        };
        userProfiles.add(caller, updated);
      };
    };
    true;
  };

  // Get all users (admin only)
  public query ({ caller }) func getAllUsers() : async [UserProfile] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all users");
    };
    userProfiles.values().toArray();
  };

  // Submits quiz answers and stores the results for later dashboard display.
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

  public query ({ caller }) func getAvailableRoadmaps(sectorId : Nat) : async [Roadmap] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view roadmaps");
    };

    let roadmaps = List.empty<Roadmap>();

    if (sectorId == 1) {
      roadmaps.add({
        id = 1;
        name = "Software Development";
        steps = [
          "Learn programming fundamentals (Python or JavaScript)",
          "Master data structures and algorithms",
          "Build personal projects and contribute to open source",
          "Learn web/backend frameworks",
          "Study system design and cloud platforms",
          "Apply for internships or junior roles",
          "Advance to senior/lead engineer",
        ];
      });
    };

    if (sectorId == 2) {
      roadmaps.add({
        id = 2;
        name = "Healthcare Professional";
        steps = [
          "Complete pre-med or nursing prerequisite courses",
          "Earn relevant degree (MD/BSN/PharmD)",
          "Pass licensing exams (USMLE/NCLEX)",
          "Complete clinical rotations or residency",
          "Obtain board certification",
          "Begin practice in hospital or clinic",
          "Pursue specialization or advanced practice",
        ];
      });
    };

    if (sectorId == 3) {
      roadmaps.add({
        id = 3;
        name = "Commerce & Trade";
        steps = [
          "Earn degree in business, logistics, or supply chain",
          "Learn inventory and ERP systems",
          "Gain internship in retail or e-commerce",
          "Develop supplier and vendor relationship skills",
          "Get APICS or supply chain certification",
          "Advance to operations or category manager",
          "Lead cross-functional supply chain teams",
        ];
      });
    };

    if (sectorId == 4) {
      roadmaps.add({
        id = 4;
        name = "Arts & Creative";
        steps = [
          "Master design fundamentals (color, typography, composition)",
          "Build proficiency in Adobe Creative Suite or 3D tools",
          "Create a diverse portfolio of creative work",
          "Freelance or intern to gain real-world experience",
          "Develop a personal creative style or niche",
          "Collaborate on professional productions or agencies",
          "Advance to art director or creative lead",
        ];
      });
    };

    if (sectorId == 5) {
      roadmaps.add({
        id = 5;
        name = "Business & Management";
        steps = [
          "Earn degree in business administration or management",
          "Develop analytical and communication skills",
          "Gain cross-functional experience in operations or finance",
          "Pursue MBA or professional certifications (PMP, CBAP)",
          "Build leadership and team management skills",
          "Advance to manager or director level",
          "Move into executive or C-suite roles",
        ];
      });
    };

    if (sectorId == 6) {
      roadmaps.add({
        id = 6;
        name = "Engineering";
        steps = [
          "Earn ABET-accredited engineering degree",
          "Pass Fundamentals of Engineering (FE) exam",
          "Gain internship and early career experience",
          "Work as Engineer-in-Training (EIT)",
          "Pass Professional Engineering (PE) exam",
          "Specialize in a sub-discipline",
          "Advance to project manager or principal engineer",
        ];
      });
    };

    if (sectorId == 7) {
      roadmaps.add({
        id = 7;
        name = "Finance & Banking";
        steps = [
          "Earn degree in finance, economics, or accounting",
          "Master Excel, financial modeling, and Bloomberg",
          "Complete internship at bank or financial firm",
          "Pursue CFA Level 1 certification",
          "Gain experience in analysis or advisory",
          "Complete CFA Levels 2 and 3",
          "Advance to senior analyst, portfolio manager, or CFO",
        ];
      });
    };

    if (sectorId == 8) {
      roadmaps.add({
        id = 8;
        name = "Education";
        steps = [
          "Earn bachelor's degree in education or subject area",
          "Complete student teaching practicum",
          "Pass state licensure exams",
          "Start as classroom teacher or trainer",
          "Pursue master's degree in education leadership",
          "Specialize in curriculum design or educational technology",
          "Advance to administrator, coach, or director of education",
        ];
      });
    };

    if (sectorId == 9) {
      roadmaps.add({
        id = 9;
        name = "Marketing & Branding";
        steps = [
          "Earn marketing or communications degree",
          "Learn digital tools (Google Analytics, Meta Ads, SEMrush)",
          "Build portfolio through internships or personal projects",
          "Get Google and Meta certifications",
          "Join a marketing team or agency",
          "Specialize in SEO, brand, content, or paid media",
          "Advance to marketing manager or CMO",
        ];
      });
    };

    if (sectorId == 10) {
      roadmaps.add({
        id = 10;
        name = "Science & Research";
        steps = [
          "Earn bachelor's degree in a science field",
          "Gain research lab experience as undergraduate",
          "Pursue master's or PhD program",
          "Complete postdoctoral fellowship",
          "Publish research in peer-reviewed journals",
          "Secure research grants and lead projects",
          "Advance to principal scientist or research director",
        ];
      });
    };

    roadmaps.toArray();
  };

  public query ({ caller }) func getAvailableSectors() : async [Sector] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view sectors");
    };

    [
      { id = 1; name = "Technology"; description = "Software, AI, cybersecurity, and digital innovation" },
      { id = 2; name = "Healthcare"; description = "Medicine, nursing, public health, and wellness" },
      { id = 3; name = "Commerce"; description = "Trade, retail, e-commerce, and supply chain" },
      { id = 4; name = "Arts"; description = "Design, media, entertainment, and creative fields" },
      { id = 5; name = "Business"; description = "Management, entrepreneurship, and strategy" },
      { id = 6; name = "Engineering"; description = "Civil, mechanical, electrical, and chemical engineering" },
      { id = 7; name = "Finance"; description = "Banking, investment, accounting, and economics" },
      { id = 8; name = "Education"; description = "Teaching, training, curriculum design, and research" },
      { id = 9; name = "Marketing"; description = "Branding, digital marketing, PR, and advertising" },
      { id = 10; name = "Science"; description = "Research, biology, chemistry, and environmental science" },
    ];
  };
};
