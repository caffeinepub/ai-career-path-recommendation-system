# Specification

## Summary
**Goal:** Fix the "failed to submit quiz" error so that quiz submission works correctly end-to-end.

**Planned changes:**
- Audit and fix the `submitQuizAnswers` mutation in `frontend/src/hooks/useQueries.ts` to ensure the data shape (sector, answers array, question IDs) matches what the backend expects.
- Audit and fix the corresponding backend handler in `backend/main.mo` to correctly receive and store the submitted quiz data.
- Resolve any type mismatches, missing fields, or incorrect Candid encoding between the frontend (`QuizQuestionsPage.tsx`) and backend.
- Handle existing quiz submission data for the same user gracefully (overwrite or append).
- Navigate the user to the Dashboard on successful submission.
- Show a meaningful error message if submission fails for a legitimate reason (e.g., unauthenticated) instead of a generic failure.

**User-visible outcome:** Users can complete the quiz and submit it without encountering the "failed to submit quiz" error, and are redirected to the Dashboard upon success.
