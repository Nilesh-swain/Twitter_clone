# TODO: Fix Bookmark UI Update Issue

## Task Description
Fix the UI update issue for bookmarking posts. Currently, when a user bookmarks a post, the UI does not change immediately like it does for reposts and likes. The issue is that the AuthContext uses useState for user data, preventing optimistic updates in mutations from working properly.

## Steps to Complete

### 1. Modify AuthContext.jsx to use useQuery for user data ✅
- Replace useState for user with useQuery using queryKey ["authUser"] ✅
- Update checkAuthStatus to use query ✅
- Adjust login, signup, logout to invalidate or update the query ✅
- Ensure user data is fetched and managed via React Query ✅

### 2. Test Bookmark Functionality
- Verify that bookmarking a post updates the UI immediately
- Check that unbookmarking also updates immediately
- Ensure the saved posts page reflects changes

### 3. Verify Other Features Still Work
- Confirm repost and like optimistic updates still function
- Test login, signup, logout
- Check overall app stability

### 4. Final Testing
- Run the app and perform end-to-end testing of bookmark feature
- Ensure no regressions in other functionalities
