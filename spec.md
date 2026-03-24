# Kick-Start Career's

## Current State
Full-stack career recommendation app with Motoko backend storing users, credentials, quiz results, profiles, and admin state. All data maps are non-stable variables.

## Requested Changes (Diff)

### Add
- Nothing new

### Modify
- Redeploy backend fresh to wipe all stored data (users, credentials, profiles, quiz results, admin state)

### Remove
- All existing user data (reset)

## Implementation Plan
- Redeploy the existing backend as-is; non-stable maps will be cleared on canister upgrade
- No code changes needed -- redeployment achieves the reset
