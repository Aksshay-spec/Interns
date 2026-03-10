# Development Guide & Best Practices

## Frontend Folder Structure

### Components Organization
```
components/
├── admin/           # Admin-only components
│   ├── AdminHeader.jsx
│   ├── AdminSidebar.jsx
│   └── AdminFooter.jsx
├── tenant/          # Tenant-only components
├── tutor/           # Tutor-only components
├── student/         # Student-only components
├── common/          # Shared across roles
│   ├── Loader.jsx
│   └── Unauthorized.jsx
└── ui/              # Reusable base UI components
    ├── button.jsx   # Base button variants
    ├── input.jsx    # Form input
    ├── card.jsx     # Card container
    ├── dialog.jsx   # Modal dialog
    ├── dropdown-menu.jsx
    ├── select.jsx
    ├── table.jsx
    ├── pagination.jsx
    ├── label.jsx
    └── sheet.jsx    # Sidebar/drawer
```

### Services Layer
**Purpose**: Centralized API calls for consistency

**File**: `Client/src/services/api.js` - Base axios instance with:
- Base URL configuration
- Request/response interceptors
- Token attachment to headers
- Error handling

**Feature APIs**: `admin.api.js`, `student.api.js`, etc.
```javascript
// Pattern:
import { api } from './api.js';

export const getUsers = (page, limit) => 
  api.get('/admin/users', { params: { page, limit } });

export const createClass = (data) => 
  api.post('/tutor/class', data);
```

### Custom Hooks
**Location**: `Client/src/hooks/[role]/`
**Purpose**: Encapsulate complex logic, data fetching, state management

**Common pattern**:
```javascript
export const useGetClasses = () => {
  return useQuery({
    queryKey: ['classes'],
    queryFn: () => getClasses(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

### Pages Organization
**Location**: `Client/src/pages/[role]/`
**Purpose**: Primary route components for each role

**Each role has its own folder with pages like:**
- Dashboard
- Profile
- Settings
- Feature-specific pages

### Layouts
**Location**: `Client/src/layouts/`
**Purpose**: Page wrappers with headers, sidebars, footers

**Files**:
- `AdminLayout.jsx` - Wraps admin pages
- `TenantLayout.jsx` - Wraps organization pages
- `TutorLayout.jsx` - Wraps instructor pages
- `StudentLayout.jsx` - Wraps student pages

Use in routes:
```javascript
<Route element={<AdminLayout />}>
  <Route path="/admin/dashboard" element={<AdminDashboard />} />
</Route>
```

## Backend Folder Structure

### Controllers
**Location**: `server/controllers/[feature].controller.js`
**Pattern**:
```javascript
export const getUsers = async (req, res) => {
  try {
    // 1. Validate input
    // 2. Call model/service
    // 3. Handle response
    res.status(200).json({ users: data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

### Middleware Stack
Applied in order:
1. **CORS** - Allow cross-origin requests
2. **bodyParser** - Parse JSON requests
3. **Authentication** - Verify JWT token (if protected route)
4. **Role Check** - Verify user role (if role-specific route)
5. **Controller** - Handle request

**Example route**:
```javascript
// routes/admin.routes.js
router.get('/users', authMiddleware, roleMiddleware('admin'), getUsers);
```

### Models
**Location**: `server/models/[entity].model.js`
**Pattern**: Mongoose schemas with validation

**Key fields to include**:
- `createdAt`, `updatedAt` (timestamps)
- `status` (if applicable)
- `isActive` (for soft deletes)

### Email System

**Location**: `server/services/mail/`

**Flow**:
1. Controller determines event (registration, approval, etc.)
2. Calls `mailService.sendMail()`
3. Loads template from `server/templates/[event].template.js`
4. Sends email via Nodemailer

**Example handler**:
```javascript
// In controller after approving tenant
const emailContent = tenantApprovedTemplate(tenant);
await mailService.sendMail(tenant.email, 'Registration Approved', emailContent);
```

## Common Development Patterns

### Form Handling (React)
```javascript
import { useForm } from 'react-hook-form';

export const CustomForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      await createItem(data);
      toast.success('Created successfully');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name', { required: 'Name is required' })} />
      {errors.name && <span>{errors.name.message}</span>}
    </form>
  );
};
```

### Data Fetching (React)
```javascript
// Using React Query for server state
const { data, isLoading, error } = useQuery({
  queryKey: ['items', id],
  queryFn: () => getItem(id),
});

if (isLoading) return <Loader />;
if (error) return <div>Error: {error.message}</div>;
return <div>{data.name}</div>;
```

### Error Handling (Backend)
```javascript
const handleApiError = (err, res) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: 'Validation failed' });
  }
  if (err.code === 11000) {
    return res.status(400).json({ message: 'Duplicate entry' });
  }
  return res.status(500).json({ message: 'Internal server error' });
};
```

## Testing Workflow

### Frontend
```bash
cd Client
npm run dev        # Start dev server
npm run build      # Check build errors
npm run lint       # Check code quality
```

### Backend
```bash
cd server
npm run dev        # Start with hot reload
```

### Manual API Testing
Use tools like:
- Postman
- Thunder Client (VS Code extension)
- cURL commands

## Performance Tips

### Frontend
- Use React Query to cache API responses
- Lazy load components with `React.lazy()`
- Implement pagination for large lists
- Use `useMemo()` for expensive calculations

### Backend
- Index frequently queried fields in MongoDB
- Use pagination to avoid loading large datasets
- Cache computed results
- Implement request validation early

## Code Style

### Naming Conventions
- Components: PascalCase (UserProfile, AdminDashboard)
- Variables/functions: camelCase (getUser, isActive)
- Constants: UPPER_SNAKE_CASE (MAX_ITEMS, DEFAULT_PAGE_SIZE)
- Files: Match component name or descriptive camelCase

### Folder Organization
- Keep related code together
- One main component per file
- Group by feature/role, not by type
- Use index.js for re-exports if needed

### Comments
```javascript
// ✅ Good: Explains why
// Fetch in sequence to respect rate limits
const users = await getUsers();

// ❌ Avoid: Obvious comments
// Get users
const users = await getUsers();
```

## Debugging Tips

### Frontend
- Use React DevTools browser extension
- Check network tab for API calls
- Use console for logging
- Set breakpoints in VS Code debugger

### Backend
- Use `console.log()` for quick debugging
- Use `nodemon` for development (auto-reload)
- Check server logs for errors
- Use MongoDB Compass to inspect data

## Troubleshooting Checklist

**API call not working?**
- Check Authorization header has valid token
- Verify endpoint URL matches routes
- Check request body format
- Look at server logs for error

**Component not rendering?**
- Check if route is protected correctly
- Verify data is loaded (not in loading state)
- Check browser console for errors
- Inspect React DevTools component tree

**Authentication issues?**
- Verify token stored in localStorage/sessionStorage
- Check token expiration
- Verify auth.middleware is applied
- Test with hardcoded token in Postman

**Database errors?**
- Verify MongoDB connection string
- Check if schema matches data being inserted
- Look for validation errors in models
- Use MongoDB Compass to inspect collections
