# SwapX - Peer Learning Platform

A modern peer learning platform built with React, TypeScript, and Vite. SwapX enables users to teach and learn skills from the community with features like skill proofing, session scheduling, trust-based ratings, community notes, and more.

## 🚀 Tech Stack

- **Frontend Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **UI Components**: ShadCN UI
- **State Management**: Zustand (with localStorage persistence)
- **Animations**: Framer Motion
- **Data Fetching**: TanStack Query (React Query)
- **Charts**: Recharts
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
   
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:3000/api
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_KEY=your_supabase_anon_key
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

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── ui/             # ShadCN UI components
│   ├── Layout.tsx      # Main layout with navigation
│   ├── ThemeProvider.tsx
│   ├── ThemeToggle.tsx
│   ├── ProfileCard.tsx
│   └── ProfileModal.tsx
├── pages/              # Page components
│   ├── auth/           # Authentication pages
│   │   ├── Login.tsx
│   │   └── Signup.tsx
│   ├── proofs/         # Proof upload
│   │   └── upload.tsx
│   ├── Landing.tsx     # Landing page
│   ├── Home.tsx        # Discover people/skills
│   ├── Dashboard.tsx   # User dashboard
│   ├── Profile.tsx     # User profile view
│   ├── ProfileSetup.tsx # Profile setup
│   ├── Chat.tsx        # WhatsApp-style chat
│   ├── MeetingScheduler.tsx # Schedule meetings
│   ├── Rating.tsx      # Rate sessions
│   ├── Notes.tsx       # Community notes
│   ├── NoteDetail.tsx  # Note detail view
│   ├── MyNotes.tsx     # User's personal notes
│   ├── Reels.tsx       # Video reels
│   ├── News.tsx        # News & blogs
│   ├── GroupDiscussion.tsx # Group discussions list
│   ├── GroupDetail.tsx # Group chat interface
│   ├── ConnectionSettings.tsx # Connection settings
│   ├── ProofViewer.tsx # View proofs
│   └── NotFound.tsx    # 404 page
├── stores/             # Zustand stores
│   └── useAuthStore.ts # Authentication store
├── hooks/              # Custom hooks
├── lib/                # Utilities
├── App.tsx             # Main app component with routing
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## 🛣️ Routes

### Public Routes
- `/` - Landing page
- `/auth/login` - Login page
- `/auth/signup` - Signup page

### Protected Routes
- `/home` - Discover people and skills (People page)
- `/dashboard` - User dashboard (Home)
- `/profile/setup` - Profile setup (first time setup)
- `/profile/:id` - User profile view
- `/chat/:connectionId?` - WhatsApp-style chat interface
- `/meeting/:id?` - Schedule or start meetings
- `/proofs/upload` - Upload skill proofs (Upload)
- `/proof` - View proof details
- `/rate/:sessionId` - Rate session after meeting
- `/notes` - Community notes (shared by others)
- `/notes/:id` - View note detail
- `/my-notes` - Your personal notes
- `/reels` - Video reels (coming soon)
- `/news` - News & blogs
- `/groups` - Group discussions list
- `/groups/:id` - Group chat interface
- `/connection-settings` - Connection and privacy settings

## 🎯 Features

### Core Features
- ✅ User authentication and authorization
- ✅ Profile management with skills, occupation, and avatar selection
- ✅ Skill proofing (PDF uploads)
- ✅ WhatsApp-style chat interface with message status, typing indicators
- ✅ Meeting scheduling (online/offline) with Jitsi integration
- ✅ Session rating system (mutual ratings)
- ✅ Trust score tracking
- ✅ Connection request system

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
- ✅ Notification preferences
- ✅ Communication preferences
- ✅ Theme toggle (light/dark mode)

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

Authentication is handled via Zustand store with localStorage persistence:
- User session management
- Protected routes
- Auto-logout on token expiry (when backend is integrated)
- Profile setup flow after signup

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
- Sign out

## 🌐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API URL | Yes |
| `VITE_SUPABASE_URL` | Supabase project URL | Optional |
| `VITE_SUPABASE_KEY` | Supabase anonymous key | Optional |
| `VITE_JITSI_DOMAIN` | Jitsi Meet domain | Optional |

## 🔄 State Management

- **Zustand** for global state (auth, user data) with localStorage persistence
- **TanStack Query** for server state management
- **React Router** for navigation state
- **Local Storage** for notes and settings persistence

## 💬 Chat Features

### One-on-One Chats
- WhatsApp-style interface
- Message status indicators (sent, delivered, read)
- Typing indicators
- Last seen status
- Date separators
- Message context menu (copy, reply, forward, star, delete)
- Emoji picker
- File attachments
- Connection request system
- Archive/unarchive chats
- Call history

### Group Discussions
- Create groups with custom names, descriptions, and tags
- Search groups by name, description, or tags
- Group chat interface with multiple participants
- Message sender identification with avatars
- Group member management
- Message operations (copy, star, delete)
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

- **Authentication**: Zustand store with localStorage
- **User Notes**: localStorage
- **Group Discussions**: localStorage (groups, messages, members)
- **Connection Settings**: localStorage
- **Theme Preference**: localStorage

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

1. **Build for production**
   ```bash
   npm run build
   ```

2. **Preview production build**
   ```bash
   npm run preview
   ```

3. **Deploy**
   - The `dist/` folder contains the production build
   - Deploy to Vercel, Netlify, or any static hosting service

## 📝 License

MIT License

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## 📧 Support

For support, email support@swapx.dev or open an issue in the repository.

---

**Built with ❤️ for peer learning**
