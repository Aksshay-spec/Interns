# How to Share TutoApp with ChatGPT & AI Assistants

## Quick Summary to Paste

Copy this into ChatGPT to start conversations about this project:

---

I'm working on **TutoApp**, a full-stack educational platform built with:
- **Frontend**: React 19 + Vite, TailwindCSS, React Router, React Query
- **Backend**: Node.js/Express, MongoDB/Mongoose, JWT auth, Nodemailer

It supports 4 user roles: Admin, Tenant (Organizations), Tutor, Student.

Key files:
- Main README: `/README.md`
- API docs: `/API_DOCUMENTATION.md`
- Dev guide: `/DEVELOPMENT_GUIDE.md`
- Project instructions: `/.instructions.md`

---

## How to Paste Your Codebase

### Option 1: Share Project Structure (Recommended for Initial Setup)
Copy and paste the project structure from `README.md` and this overview:

```
TutoApp is organized as:
- Client/: React frontend with role-specific components
- server/: Express.js backend with MongoDB models
```

### Option 2: Share Specific Files
When working on a feature, share relevant files:

**For frontend work:**
```
Show me:
1. Client/src/pages/[role]/[page].jsx (the page to modify)
2. Client/src/services/[feature].api.js (API calls)
3. Client/src/hooks/[role]/useXxx.js (custom hook)
4. Relevant component from Client/src/components/
```

**For backend work:**
```
Show me:
1. server/routes/[feature].routes.js (endpoints)
2. server/controllers/[feature].controller.js (logic)
3. server/models/[entity].model.js (schema)
4. Relevant mail template if needed
```

### Option 3: Copy-Paste File Content
For specific files, copy the entire content and paste with header:

```
# File: server/controllers/student.controller.js

[file content here]
```

## Best Practices When Asking for Help

### DO:
✅ Mention the user role (admin, student, tutor, tenant)
✅ State if it's frontend or backend or both
✅ Include the current file you're working on
✅ Share error messages exactly as they appear
✅ Describe what you want to achieve
✅ Reference the API_DOCUMENTATION.md for endpoint details

### Example Good Questions:
```
"I want to add a 'Mark Attendance' feature for tutors. 
The endpoint POST /tutor/class/:classId/mark-attendance exists.
I'm building the frontend component in TutorMarkAttendance.jsx.
Where should the API call go, and what should the component state look like?"
```

```
"The student enrollment endpoint keeps returning 400.
Error: 'Validation failed'.
The request body is: { classId: 'xxx' }
Backend route is POST /student/enroll/:classId
What validation might be failing?"
```

### DON'T:
❌ Share entire project without context
❌ Ask to build a feature without explaining the user role
❌ Expect ChatGPT to know your code structure without showing it
❌ Paste huge files without explaining what you need
❌ Ask vague questions like "this doesn't work"

## Workflow for Adding a New Feature

When asking ChatGPT to add a feature, provide:

1. **Context**: "I want to let [role] [do something]"
2. **Current files**: Show relevant backend routes and controller
3. **Frontend location**: "I'll add it in Client/src/pages/[role]/NewFeature.jsx"
4. **Integration points**: "It should call the [feature] API and update [list] component"
5. **Reference docs**: "See API_DOCUMENTATION.md for endpoint details"

Example:
```
I want to let Tenants (organizations) view a list of their tutors.

Backend is complete:
- Route: GET /tenant/:tenantId/tutors (returns array of tutors)
- Controller: Already in tenant.controller.js

I need to build:
- Frontend page: Client/src/pages/tenant/TutorsList.jsx
- API service: should be added to Client/src/services/tenant.api.js
- Hook: if complex, should go in Client/src/hooks/tenant/

Can you show me the frontend components following the existing patterns?
```

## File References to Share

When mentioning files, use these standard references:

**API Endpoints**: Look in `API_DOCUMENTATION.md`

**Database Schema**: Check `server/models/[entity].model.js`

**API Samples**: Check `Client/src/services/[feature].api.js`

**Component Patterns**: Look at similar role components

**Email Templates**: Check `server/templates/[event].template.js`

## Common Patterns to Reference

When asking about patterns, mention:

```
"Following the pattern used in [existing-component],..."

"Similar to how [role] components are structured,"

"Using React Query like in [existing-hook],"
```

Examples:
- "Following the pattern in AdminDashboard.jsx"
- "Similar structure to StudentLayout.jsx"  
- "Using the same form pattern as TutorCreateClass"

## What to Do Before Asking ChatGPT

1. **Read the relevant doc**:
   - Adding API? → Read API_DOCUMENTATION.md
   - Changing structure? → Read DEVELOPMENT_GUIDE.md
   - Not sure about folder? → Read README.md

2. **Find similar code**:
   - Search for similar component
   - Check if pattern already exists
   - Reference it in your question

3. **Provide context**:
   - Copy relevant file snippet (not the whole file)
   - Show error messages
   - Explain what you tried

## Tips for Better Responses

### Frame specific problems:
```
❌ "How do I add a feature?"
✅ "I need to add email notification when admin approves tenant.
    How should I modify the approval endpoint in admin.controller.js
    and which template file should I create?"
```

### Ask for specific help:
```
❌ "The frontend doesn't work"
✅ "The useQuery hook in TutorCreateClass.jsx isn't updating the classes list
    after creating a new class. Should I invalidate the query cache?
    Here's my hook code: [paste code]"
```

### Include file excerpts, not entire files:
```
✅ Best practice:
"Here's the relevant part of StudentEnroll.jsx (lines 15-35):
[small code snippet]

I want to add loading state. Where should I add it?"
```

## Using This in VS Code with GitHub Copilot

If using GitHub Copilot in VS Code:
1. The `.instructions.md` file is automatically read by Copilot
2. Press `Ctrl+I` in any file to get context-aware suggestions
3. Copilot will understand the project structure from the instructions
4. Ask follow-up questions about specific files open in editor

## Summary Checklist

Before using ChatGPT, ensure you have:

- [ ] Read README.md for project overview
- [ ] Read API_DOCUMENTATION.md for endpoints
- [ ] Read DEVELOPMENT_GUIDE.md for patterns
- [ ] Identified which user role is involved
- [ ] Identified if it's frontend, backend, or both
- [ ] Prepared relevant file snippets to share
- [ ] Formulated specific question with context
