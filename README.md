# SwapX - Peer Learning Platform

A modern peer learning platform built with React, TypeScript, and Vite. SwapX enables users to teach and learn skills from the community with features like skill proofing, session scheduling, trust-based ratings, community notes, and more.

## 🚀 Tech Stack

- **Frontend Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **UI Components**: ShadCN UI
- **State Management**: Zustand (with localStorage persistence)
- **Backend**: Supabase (PostgreSQL database, Authentication, Storage, Realtime)
- **Authentication**: Supabase Auth UI (Email, Google OAuth)
- **Data Fetching**: TanStack Query (React Query)
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Theme**: Custom palette with light/dark mode support
- **Date Handling**: date-fns

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd grow-share
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_KEY=your_supabase_anon_key
   ```
   
   Get your Supabase credentials from: https://supabase.com/dashboard
   
   **Optional variables:**
   ```env
   VITE_API_URL=http://localhost:3000/api
   VITE_JITSI_DOMAIN=meet.jit.si
   ```

4. **Start the development server**
   ```bash
npm run dev
```

   The app will be available at `http://localhost:8080` (or next available port)

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm start` / `npm run preview` - Preview production build
- `npm run lint` - Run ESLint


## 🛣️ Routes

### Public Routes
- `/` - Landing page
- `/auth/login` - Login page
- `/auth/signup` - Signup page

### Protected Routes
- `/home` - Discover people and skills (People page)
- `/dashboard` - User dashboard (Home)
- `/profile` - Your own profile
- `/profile/:id` - User profile view (other users)
- `/profile/setup` - Profile setup (first time setup)
- `/explore` - AI-powered people matching with skill-based ranking
- `/chat/:connectionId?` - WhatsApp-style chat interface
- `/meeting/:id?` - Schedule or start meetings
- `/proofs/upload` - Upload skill proofs (Upload)
- `/proofs/:id` - View proof details
- `/rate/:sessionId` - Rate session after meeting
- `/notes` - Community notes (shared by others)
- `/notes/:id` - View note detail
- `/mynotes` - Your personal notes
- `/savednotes` - Your bookmarked notes
- `/reels` - Video reels (coming soon)
- `/news` - News & blogs
- `/news/:id` - News/blog detail view
- `/groups` - Group discussions list
- `/groups/:id` - Group chat interface
- `/groups/:id/members` - Group members view
- `/connections` - Connection and privacy settings

## 🎯 Features

### Core Features
- ✅ **Supabase Integration**: Full backend integration with PostgreSQL database, authentication, storage, and real-time features
- ✅ **User Authentication**: Supabase Auth with email/password and Google OAuth support
- ✅ **Profile Management**: Complete profile setup with skills, skills to learn, occupation, avatar, and bio
- ✅ **AI-Powered Matching**: Intelligent people matching based on skills you want to learn with rating as secondary factor
- ✅ **Skill Proofing**: Upload and manage proof documents (PDF, images, videos) for skills you teach
- ✅ **Proof Storage**: Proofs stored in Supabase Storage and displayed on profile
- ✅ **WhatsApp-style Chat**: Real-time messaging with message status, typing indicators, and last seen
- ✅ **Meeting Scheduling**: Schedule meetings (online/offline) with automatic chat message integration
- ✅ **Meeting Display**: Scheduled meetings displayed on Home page with quick access to chat
- ✅ **Session Rating System**: Mutual ratings after sessions
- ✅ **Trust Score Tracking**: User ratings and trust scores
- ✅ **Connection Management**: Request, accept, and manage connections with real-time sync
- ✅ **Comprehensive Notification System**: Real-time notifications with cross-component synchronization
- ✅ **Skills to Learn**: Manage and display skills you want to learn on your profile

### Community Features
- ✅ Community Notes - Share and discover notes from the community
- ✅ Personal Notes - Create and manage your own notes
- ✅ Like and bookmark notes
- ✅ Group Discussions - Create and join group chats
- ✅ Group Chat Interface - WhatsApp-style group messaging
- ✅ Reels (coming soon)
- ✅ News & Blogs (coming soon)

### Dashboard
- ✅ Statistics (Total Sessions, Average Rating, Trust Score)
- ✅ Badges earned
- ✅ Connection requests (received/sent)
- ✅ Active connections
- ✅ Scheduled meetings

### Settings & Preferences
- ✅ Connection Settings with privacy controls
- ✅ Availability Settings - Set weekly schedule with time slots
- ✅ Notification preferences
- ✅ Communication preferences
- ✅ Theme toggle (light/dark mode)

### Notifications System
- ✅ Real-time notifications for connection requests (sent/received/accepted)
- ✅ Message notifications (when chat is not open)
- ✅ Meeting scheduled and reminder notifications
- ✅ Notification badge with unread count
- ✅ Mark notifications as read (individual or all)
- ✅ Auto-mark related notifications as read
- ✅ Cross-component synchronization via event system
- ✅ Notification persistence in localStorage

### UI/UX
- ✅ Responsive design (mobile-first)
- ✅ Dark/Light theme toggle
- ✅ Accessible UI (ARIA labels, keyboard navigation)
- ✅ Toast notifications
- ✅ Loading states
- ✅ Error handling

## 🎨 Theme

The app supports both light and dark themes with:
- Custom color palette
- Smooth theme transitions
- Theme persistence (localStorage)
- System preference detection

## 🔐 Authentication

Authentication is handled via Supabase Auth with multiple providers:
- **Email/Password**: Traditional email and password authentication
- **Google OAuth**: Sign in with Google account
- **Session Management**: Automatic session management with Supabase
- **Protected Routes**: AuthGate component protects routes requiring authentication
- **Profile Setup Flow**: Redirects to profile setup after signup
- **Auto-logout**: Session expiration handling
- **Real-time Auth State**: React hook (`useAuthUser`) for auth state management

## 📱 Navigation Structure

**Navbar Items (in order):**
1. Home - Dashboard
2. People - Discover skills
3. Chats - WhatsApp-style messaging
4. Reels - Video content
5. Notes - Community notes
6. News & Blogs - Articles and blogs
7. Group Discussion - Group chats and discussions
8. Upload - Upload skill proofs

**My Account Menu:**
- Profile
- Your Notes
- Connection Settings
- Availability Settings
- Sign out

## 🌐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Supabase project URL | **Required** |
| `VITE_SUPABASE_KEY` | Supabase anon/public key | **Required** |
| `VITE_API_URL` | Backend API URL | Optional |
| `VITE_JITSI_DOMAIN` | Jitsi Meet domain | Optional |

**Get your Supabase credentials:**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to Settings → API
4. Copy the Project URL and anon public key

## 🔄 State Management

- **Zustand** for global state (auth, user data) with localStorage persistence
- **Supabase** for server state (profiles, connections, messages, proofs, notes)
- **TanStack Query** for server state caching and management
- **React Router** for navigation state
- **Local Storage** for client-side caching and offline support
- **Supabase Realtime** for real-time updates (messages, connections)
- **Event System** for cross-component synchronization:
  - `connectionRequestsUpdated` - Triggers when connection requests change
  - `chatsUpdated` - Triggers when chats are modified
  - `notificationsUpdated` - Triggers when notifications change
  - `bookmarksUpdated` - Triggers when bookmarks change
  - `groupsUpdated` - Triggers when groups are modified
  - `meetingsUpdated` - Triggers when meetings are scheduled

## 💬 Chat Features

### One-on-One Chats
- WhatsApp-style interface
- **Real-time Messaging**: Supabase Realtime for instant message delivery
- Message status indicators (sent, delivered, read)
- Typing indicators
- Last seen status with profile navigation
- Date separators
- Message context menu (copy, reply, forward, star, delete)
- Emoji picker
- File attachments
- Connection request system (must connect before chatting)
- Archive/unarchive chats
- Mute/unmute chats
- **Call History**: View call details with recorded lectures, notes, subjects, and topics
- **Call Details View**: Expandable call history with full call information
- Auto-mark message notifications as read when chat is opened
- Real-time synchronization across all pages
- Message persistence in Supabase and localStorage

### Group Discussions
- Create groups with custom names, descriptions, and tags
- Search groups by name, description, or tags
- Group chat interface with multiple participants
- Message sender identification with avatars
- **Anonymous Messaging**: Option to send messages anonymously or with your name
- Group member management
- Message operations (copy, star, delete)
- File attachments in group messages
- Real-time message updates
- Group list auto-updates with last message
- Date separators and timestamps
- Emoji picker for messages

## 📝 Notes System

- **Community Notes**: Browse notes shared by others
- **Personal Notes**: Create and manage your own notes
- Like and bookmark functionality
- Tag system
- Full note detail view
- Search and filter (coming soon)

## 🎯 AI-Powered People Matching

The Explore page uses an intelligent matching algorithm to rank profiles:

- **Skill-Based Matching**: Profiles are ranked by how well they can teach skills you want to learn
- **Skill Normalization**: Handles synonyms, abbreviations, and variations (e.g., "js" = "javascript")
- **Soft String Matching**: Uses Levenshtein distance and prefix matching for fuzzy skill matching
- **Weighted Scoring**: 70% skill similarity + 30% rating
- **Real-time Updates**: Results update as you type your desired skills
- **Profile Integration**: Desired skills are saved to your profile and synced across the app

## 🎭 UI Components

Built with ShadCN UI components:
- Buttons, Cards, Forms
- Dialogs, Dropdowns, Popovers
- Inputs, Labels, Textareas
- Navigation, Tabs, Separators
- Switch, Checkbox, Radio
- Calendar, Date Picker
- Avatar, Badge
- Toast, Sonner
- And many more...

## 📱 Responsive Design

The app is built mobile-first and fully responsive:
- Mobile navigation drawer
- Responsive grid layouts
- Touch-friendly interactions
- Optimized for all screen sizes
- Adaptive UI components

## ♿ Accessibility

- Semantic HTML
- ARIA labels and roles
- Keyboard navigation support
- Focus management
- Screen reader friendly
- High contrast support

## 🗄️ Data Persistence

### Supabase (Primary Storage)
- **User Profiles**: Stored in `profiles` table (skills, skills_to_learn, desired_skills, bio, avatar, etc.)
- **Connections**: Stored in `connections` table (connection requests and status)
- **Chat Messages**: Stored in `messages` table with real-time updates
- **Proofs**: Stored in `proofs` table with files in Supabase Storage
- **Notes**: Stored in `notes` table (public and private notes)
- **Authentication**: Managed by Supabase Auth

### Local Storage (Client-side Caching)
- **Theme Preference**: User's theme choice
- **Chats**: Client-side caching for offline support
- **Notifications**: Notification history and read status
- **Bookmarked Notes**: User's bookmarked notes
- **Scheduled Meetings**: Meeting schedule for Home page display
- **Connection Requests**: Client-side caching
- **Groups**: Group discussions and messages

### Database Schema
- **profiles**: User profiles with skills, bio, avatar, rating
- **connections**: Connection requests and accepted connections
- **messages**: Chat messages with real-time support
- **proofs**: Skill proof documents with file URLs
- **notes**: Community and personal notes

## 🔧 Development

### Code Style
- ESLint for code quality
- TypeScript for type safety
- Prettier (if configured)

### Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🚀 Deployment

1. **Set up Supabase**
   - Create a Supabase project at https://supabase.com
   - Run database migrations from `supabase/migrations/`
   - Create storage bucket named `proofs` and set it to public
   - Configure authentication providers (Email, Google OAuth)

2. **Configure environment variables**
   - Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_KEY` in your hosting platform
   - For Vercel/Netlify: Add these in the environment variables section

3. **Build for production**
   ```bash
   npm run build
   ```

4. **Preview production build**
   ```bash
   npm run preview
   ```

5. **Deploy**
   - The `dist/` folder contains the production build
   - Deploy to Vercel, Netlify, or any static hosting service
   - Make sure to set environment variables in your hosting platform

## 📚 Database Setup

### Running Migrations

1. **Using Supabase Dashboard**:
   - Go to SQL Editor in your Supabase dashboard
   - Run the migration files from `supabase/migrations/` in order

2. **Using Supabase CLI** (if installed):
   ```bash
   cd grow-share
   supabase link --project-ref your-project-ref
   supabase db push
   ```

### Required Migrations
- `0001_init.sql` - Initial database schema
- `0004_add_skills_to_learn.sql` - Skills to learn column
- `0005_add_desired_skills.sql` - Desired skills column
- `0006_create_proofs_table.sql` - Proofs table and storage setup

See `PROOF_UPLOAD_SETUP.md` for detailed proof upload setup instructions.

## 🔒 Security Features

- **Row Level Security (RLS)**: All Supabase tables have RLS policies enabled
- **Authentication Required**: Protected routes require authentication
- **Secure File Uploads**: Proof files uploaded to Supabase Storage with secure random filenames
- **User Data Isolation**: Users can only access their own data and public data
- **Input Validation**: All user inputs are validated before saving

## 🧪 Testing

1. **Test Authentication**: Sign up and sign in with email or Google
2. **Test Profile Setup**: Complete your profile with skills and skills to learn
3. **Test Proof Upload**: Upload proof documents for your skills
4. **Test Chat**: Send messages to connected users
5. **Test Meeting Scheduling**: Schedule a meeting and verify it appears in chat and home page
6. **Test People Matching**: Use the Explore page to find people based on skills you want to learn

## 📝 License

MIT License

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## 📧 Support

For support, email support@swapx.dev or open an issue in the repository.

## 🔗 Repository

GitHub: https://github.com/aryamansingh04/SwapX

---

**Built with ❤️ for peer learning**
