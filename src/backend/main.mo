import Map "mo:core/Map";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import List "mo:core/List";



actor {
  type UserId = Nat;
  type Results = { #ok; #err : Text };
  type PasswordHash = Text;

  type UserRole = { #admin; #user; #guest };

  type StoredUser = {
    id : ?UserId;
    username : Text;
    email : Text;
    passwordHash : PasswordHash;
  };

  type UserProfile = {
    id : ?UserId;
    username : Text;
    email : Text;
  };

  type CallerProfile = {
    name : Text;
    email : Text;
  };

  type UpdateUserProfile = {
    username : Text;
    email : Text;
    passwordHash : Text;
  };

  type CreateUserProfile = {
    username : Text;
    email : Text;
    password : Text;
  };

  // Ares AI Chatbot types
  type AresFitnessProfile = {
    weightKg : ?Float;
    heightCm : ?Float;
    goal : ?Text;
    experienceLevel : ?Text;
    dietType : ?Text;
    personalityMode : Text;
    lastWorkoutDate : ?Text;
    missedDaysCount : Nat;
    currentWeekCompletedDays : [Text];
    onboardingComplete : Bool;
  };

  type ChatMessage = {
    id : Text;
    sender : Text;
    message : Text;
    timestamp : Int;
    mode : Text;
  };

  // Ares state
  let aresFitnessProfiles = Map.empty<Principal, AresFitnessProfile>();
  let aresChatHistories = Map.empty<Principal, List.List<ChatMessage>>();

  // Access control state
  let roles = Map.empty<Principal, UserRole>();
  var firstAdminSet = false;

  let users = Map.empty<Text, StoredUser>();
  var nextUserId = 0;

  let callerProfiles = Map.empty<Principal, CallerProfile>();

  // Access control helpers
  func getRole(caller : Principal) : UserRole {
    switch (roles.get(caller)) {
      case (?role) { role };
      case (null) { #guest };
    };
  };

  func isAdmin(caller : Principal) : Bool {
    switch (getRole(caller)) {
      case (#admin) { true };
      case (_) { false };
    };
  };

  func hasPermission(caller : Principal, required : UserRole) : Bool {
    let role = getRole(caller);
    switch (required) {
      case (#guest) { true };
      case (#user) {
        switch (role) {
          case (#admin) { true };
          case (#user) { true };
          case (#guest) { false };
        };
      };
      case (#admin) {
        switch (role) {
          case (#admin) { true };
          case (_) { false };
        };
      };
    };
  };

  func deterministicHash(inputText : Text) : PasswordHash {
    Text.fromIter(inputText.toIter().reverse());
  };

  // MixinAuthorization public endpoints
  public shared ({ caller }) func assignRole(user : Principal, role : UserRole) : async () {
    if (not isAdmin(caller)) {
      Runtime.trap("Unauthorized: Only admins can assign roles");
    };
    roles.add(user, role);
  };

  public query ({ caller }) func getMyRole() : async UserRole {
    getRole(caller);
  };

  // Profile endpoints
  public query ({ caller }) func getCallerUserProfile() : async ?CallerProfile {
    if (not hasPermission(caller, #user)) {
      Runtime.trap("Unauthorized: Only users can get their own profile");
    };
    callerProfiles.get(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : CallerProfile) : async () {
    if (not hasPermission(caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save their own profile");
    };
    callerProfiles.add(caller, profile);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?CallerProfile {
    if (caller != user and not isAdmin(caller)) {
      Runtime.trap("Unauthorized: Only users can view their own profile");
    };
    callerProfiles.get(user);
  };

  public query ({ caller }) func getUsers() : async [UserProfile] {
    if (not hasPermission(caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can list all users");
    };
    users.values().toArray().map(func(u : StoredUser) : UserProfile {
      { id = u.id; username = u.username; email = u.email };
    });
  };

  public query ({ caller }) func getUserById(id : UserId) : async ?UserProfile {
    if (not hasPermission(caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can look up users by ID");
    };
    let found = users.values().toArray().find(func(u : StoredUser) : Bool {
      u.id == ?id
    });
    switch (found) {
      case (null) { null };
      case (?u) { ?{ id = u.id; username = u.username; email = u.email } };
    };
  };

  public query ({ caller }) func getUserByEmail(email : Text) : async ?UserProfile {
    if (not hasPermission(caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can look up users by email");
    };
    switch (users.get(email)) {
      case (null) { null };
      case (?u) { ?{ id = u.id; username = u.username; email = u.email } };
    };
  };

  public shared ({ caller }) func deleteUser(id : UserId) : async Results {
    if (not hasPermission(caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can delete users");
    };

    let usersToDelete = users.filter(
      func(_email : Text, user : StoredUser) : Bool {
        switch (user.id) {
          case (?userId) { userId == id };
          case (null) { false };
        };
      }
    );

    if (usersToDelete.isEmpty()) {
      return #err("User not found");
    };

    for ((email, _) in usersToDelete.entries()) {
      users.remove(email);
    };
    #ok;
  };

  public shared ({ caller }) func updateUser(id : UserId, profile : UpdateUserProfile) : async Results {
    if (not hasPermission(caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can update user records");
    };

    let usersToUpdate = users.filter(
      func(_email : Text, user : StoredUser) : Bool {
        switch (user.id) {
          case (?userId) { userId == id };
          case (null) { false };
        };
      }
    );

    if (usersToUpdate.isEmpty()) {
      return #err("User not found");
    };

    for ((email, _) in usersToUpdate.entries()) {
      users.remove(email);
    };

    let updatedUser : StoredUser = {
      id = ?id;
      username = profile.username;
      email = profile.email;
      passwordHash = profile.passwordHash;
    };

    users.add(profile.email, updatedUser);
    #ok;
  };

  public shared ({ caller }) func register(createUserProfile : CreateUserProfile) : async Results {
    let { username; email; password } = createUserProfile;
    if (username.size() == 0 or username.chars().all(func(char) { char == ' ' })) {
      return #err("Username cannot be empty");
    };
    if (username.contains(#char(' '))) {
      return #err("Username cannot contain spaces");
    };
    if (username.size() < 2) {
      return #err("Username must have at least 2 characters");
    };
    if (not email.contains(#text("@"))) {
      return #err("Invalid email address");
    };
    if (users.get(email) != null) {
      return #err("An account with this email already exists");
    };

    let passwordHash = deterministicHash(password);
    let userId = nextUserId;
    nextUserId += 1;

    let newUser : StoredUser = {
      id = ?userId;
      username;
      email;
      passwordHash;
    };

    users.add(email, newUser);

    // First registered user becomes admin
    if (not firstAdminSet) {
      roles.add(caller, #admin);
      firstAdminSet := true;
    } else {
      roles.add(caller, #user);
    };

    #ok;
  };

  public shared func login(email : Text, password : Text) : async Results {
    switch (users.get(email)) {
      case (null) { #err("User does not exist") };
      case (?user) {
        let passwordHash = deterministicHash(password);
        if (user.passwordHash != passwordHash) {
          return #err("Invalid credentials! Please try again.");
        };
        #ok;
      };
    };
  };

  // ── Ares AI Chatbot Methods ──────────────────────────────────────────────

  public query ({ caller }) func getAresFitnessProfile() : async ?AresFitnessProfile {
    aresFitnessProfiles.get(caller);
  };

  public shared ({ caller }) func saveAresFitnessProfile(profile : AresFitnessProfile) : async () {
    aresFitnessProfiles.add(caller, profile);
  };

  public query ({ caller }) func getAresChatHistory() : async [ChatMessage] {
    switch (aresChatHistories.get(caller)) {
      case (null) { [] };
      case (?msgs) {
        let arr = msgs.toArray();
        let size = arr.size();
        // Cap at 100, return newest first
        let start = if (size > 100) { size - 100 } else { 0 };
        let sliced = arr.sliceToArray(start, size);
        sliced.reverse()
      };
    };
  };

  public shared ({ caller }) func addAresChatMessage(msg : ChatMessage) : async () {
    let existing = switch (aresChatHistories.get(caller)) {
      case (?msgs) { msgs };
      case (null) { List.empty<ChatMessage>() };
    };
    existing.add(msg);
    // Cap at 100 messages — drop oldest if over limit
    if (existing.size() > 100) {
      let arr = existing.toArray();
      let trimmed = List.fromArray<ChatMessage>(arr.sliceToArray(arr.size() - 100, arr.size()));
      aresChatHistories.add(caller, trimmed);
    } else {
      aresChatHistories.add(caller, existing);
    };
  };

  public shared ({ caller }) func clearAresChatHistory() : async () {
    aresChatHistories.remove(caller);
  };

  public shared ({ caller }) func logWorkoutCompleted(date : Text) : async () {
    let base : AresFitnessProfile = switch (aresFitnessProfiles.get(caller)) {
      case (?p) { p };
      case (null) {
        {
          weightKg = null;
          heightCm = null;
          goal = null;
          experienceLevel = null;
          dietType = null;
          personalityMode = "strict";
          lastWorkoutDate = null;
          missedDaysCount = 0;
          currentWeekCompletedDays = [];
          onboardingComplete = false;
        };
      };
    };
    let updated : AresFitnessProfile = {
      base with
      lastWorkoutDate = ?date;
      missedDaysCount = 0;
      currentWeekCompletedDays = base.currentWeekCompletedDays.concat([date]);
    };
    aresFitnessProfiles.add(caller, updated);
  };

  public shared ({ caller }) func logWorkoutSkipped() : async () {
    let base : AresFitnessProfile = switch (aresFitnessProfiles.get(caller)) {
      case (?p) { p };
      case (null) {
        {
          weightKg = null;
          heightCm = null;
          goal = null;
          experienceLevel = null;
          dietType = null;
          personalityMode = "strict";
          lastWorkoutDate = null;
          missedDaysCount = 0;
          currentWeekCompletedDays = [];
          onboardingComplete = false;
        };
      };
    };
    let updated : AresFitnessProfile = {
      base with
      missedDaysCount = base.missedDaysCount + 1;
    };
    aresFitnessProfiles.add(caller, updated);
  };
};
