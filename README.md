# 🤖 AI-Powered Frontend Helper Chatbot

An intelligent design-to-development assistant that transforms UI screenshots into developer guidance, component breakdowns, and ready-to-use code snippets. Upload any UI design and get instant technical recommendations, folder structures, component lists, and framework-specific code.

## 🎯 Project Overview

Create an AI-powered Design → Dev assistant that accepts a screenshot/Figma image, runs lightweight image understanding (OCR + free vision model), automatically breaks the UI into sections (left, right, header, footer, cards, forms), then produces a developer guide: suggested folder structure, exact component list & counts, small ready-to-copy code snippets (not full large code dumps unless requested), a complexity/effort estimate, styling recommendations (MUI props or Tailwind alternatives), and optional framework conversion (React/Next/Vue). The UI is a friendly chatbot with conversation history, snippet library, and a code preview panel.

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 (App Router) with TypeScript
- **UI Library:** Material UI (MUI) v5+ with Icons
- **Code Editor:** Monaco Editor (VS Code editor in browser)
- **OCR:** Tesseract.js (client/server-side text extraction)
- **Vision AI:** HuggingFace Inference (BLIP/Donut models)
- **LLM:** OpenRouter / Groq / Local Ollama support
- **Backend:** Next.js API Routes (serverless-compatible)
- **Deployment:** Vercel (recommended) with serverless functions

## ✨ Features

### 🖼️ Image Analysis

- **Drag & drop** or click-to-upload image interface
- **OCR extraction** using Tesseract.js for visible text
- **AI vision** with HuggingFace models for layout understanding
- **Confidence scoring** and fallback prompting

### 💬 Intelligent Chat Interface

- **Conversational UI** with message bubbles and timestamps
- **Quick action buttons** for common tasks
- **Chat history** with session persistence
- **Mobile-responsive** design across all devices

### 🎯 Smart Analysis & Guidance

- **Page type detection** (Login, Dashboard, Landing, Form, etc.)
- **Component breakdown** with counts and complexity ratings
- **Folder structure** recommendations
- **Code snippets** (3-10 lines) for key components
- **Styling hints** with MUI props and alternatives
- **Accessibility reminders** and best practices
- **Time/effort estimates** for development

### 💻 Code Preview & Management

- **Monaco Editor** integration with syntax highlighting
- **Multi-language support** (TypeScript, JSX, CSS, JSON, etc.)
- **Copy, save, download** functionality
- **Fullscreen mode** for detailed code review
- **Snippet library** with local storage

### 🚀 Code Generation

- **Framework conversion** (React → Next.js → Vue)
- **Component scaffolding** with TypeScript
- **Test file generation** with Jest/Testing Library
- **Package.json creation** with proper dependencies
- **Starter project** download (ZIP format)

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone <repository-url>
cd ai-frontend-helper
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env.local
```

Edit `.env.local` with your API keys:

```env
# Required: HuggingFace for vision analysis
HUGGINGFACE_API_KEY=your_token_here

# Choose one LLM provider:
OPENROUTER_API_KEY=your_key_here
# OR
GROQ_API_KEY=your_key_here
# OR use local Ollama (no key needed)
OLLAMA_BASE_URL=http://localhost:11434
```

### 3. Development

```bash
npm run dev
# Open http://localhost:3000
```

### 4. Production Build

```bash
npm run build
npm start
```

## 🔑 API Keys Setup

### HuggingFace (Required)

1. Go to [HuggingFace](https://huggingface.co/settings/tokens)
2. Create a new token with "Read" permissions
3. Add to `HUGGINGFACE_API_KEY` in `.env.local`

### OpenRouter (Recommended)

1. Sign up at [OpenRouter](https://openrouter.ai/)
2. Get API key from dashboard
3. Add to `OPENROUTER_API_KEY` in `.env.local`

### Groq (Alternative)

1. Sign up at [Groq](https://console.groq.com/)
2. Generate API key
3. Add to `GROQ_API_KEY` in `.env.local`

### Local Ollama (Free Alternative)

1. Install [Ollama](https://ollama.ai/)
2. Run: `ollama serve`
3. Set `OLLAMA_BASE_URL=http://localhost:11434`

## 📱 Usage Guide

### 1. Upload Image

- **Drag & drop** any UI screenshot or design
- **Click upload** button for file picker
- Supports: PNG, JPG, JPEG, WebP (max 10MB)

### 2. AI Analysis

- **Automatic OCR** extracts visible text
- **Vision AI** describes layout and components
- **Smart parsing** identifies UI patterns

### 3. Get Guidance

- **Page type** detection (Login, Dashboard, etc.)
- **Component list** with complexity scores
- **Folder structure** recommendations
- **Code snippets** for key components

### 4. Code Management

- **Preview** generated code in Monaco Editor
- **Copy** snippets to clipboard
- **Save** to snippet library
- **Download** files or full project

## 🏗️ Project Structure

```
ai-frontend-helper/
├── 📁 app/                   # Next.js App Router
│   ├── layout.tsx           # Root layout
│   ├── page.tsx            # Home page
│   ├── globals.css         # Global styles
│   └── api/                # API routes
│       ├── vision/         # Image analysis
│       ├── generate-guidance/  # AI guidance
│       └── generate-code/  # Code generation
├── 📁 components/           # React components
│   ├── Header.tsx          # Top navigation
│   ├── Sidebar.tsx         # Chat history & snippets
│   ├── ChatPanel.tsx       # Main chat interface
│   ├── MessageBubble.tsx   # Chat messages
│   ├── CodePreview.tsx     # Monaco editor wrapper
│   ├── ImageUpload.tsx     # File upload component
│   └── ui/                 # Utility components
├── 📁 lib/                 # Utilities & types
│   ├── types.ts           # TypeScript definitions
│   ├── theme.ts           # MUI theme config
│   ├── utils.ts           # Helper functions
│   ├── prompts.ts         # LLM prompt templates
│   └── api-clients/       # External API clients
├── 📁 hooks/               # Custom React hooks
└── 📁 public/             # Static assets
```

## 🔌 API Endpoints

### POST `/api/vision`

Analyzes uploaded images using OCR and vision AI.

**Request:**

```javascript
const formData = new FormData();
formData.append("image", file);

fetch("/api/vision", {
  method: "POST",
  body: formData,
});
```

**Response:**

```json
{
  "success": true,
  "ocr": {
    "text": "Login Email Password",
    "confidence": 0.95
  },
  "vision": {
    "description": "A login form with email and password fields",
    "confidence": 0.85
  },
  "merged": "Combined description with detected elements"
}
```

### POST `/api/generate-guidance`

Generates development guidance from image analysis.

**Request:**

```json
{
  "description": "Login form with email/password fields",
  "framework": "next",
  "options": {
    "complexity": "medium",
    "includeAccessibility": true
  }
}
```

**Response:**

```json
{
  "success": true,
  "guidance": {
    "pageType": "Login",
    "folderStructure": { "components/": ["Form components"] },
    "components": [
      {
        "name": "LoginForm",
        "count": 1,
        "description": "Email/password form",
        "complexity": 3
      }
    ],
    "codeSnippets": [...],
    "complexity": 3,
    "estimatedTime": "2-4 hours",
    "accessibility": ["Add ARIA labels", "Focus management"],
    "recommendations": ["Input validation", "Error handling"]
  }
}
```

### POST `/api/generate-code`

Generates complete code files and project structure.

**Request:**

```json
{
  "guidance": {
    /* guidance object */
  },
  "targetFramework": "next",
  "includeTests": true,
  "includeStyles": true
}
```

**Response:**

```json
{
  "success": true,
  "files": [
    {
      "path": "components/LoginForm.tsx",
      "content": "// Generated component code",
      "type": "component"
    }
  ],
  "downloadId": "uuid-here",
  "downloadUrl": "/api/download/uuid-here"
}
```

## 🎨 Customization

### Theme Configuration

Edit `lib/theme.ts` to customize MUI theme:

```typescript
export const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#dc004e" },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});
```

### LLM Prompts

Modify `lib/prompts.ts` to customize AI behavior:

```typescript
export const GUIDANCE_PROMPT = `
You are an expert frontend developer...
Analyze this UI and provide structured guidance...
`;
```

### Component Styling

Use MUI's `sx` prop for custom styling:

```tsx
<Box
  sx={{
    bgcolor: "background.paper",
    borderRadius: 2,
    p: 3,
    boxShadow: 1,
  }}
>
  Content here
</Box>
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**

   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Deploy
   vercel --prod
   ```

2. **Environment Variables**

   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Add all keys from `.env.example`

3. **Custom Domain** (Optional)
   - Add domain in Vercel dashboard
   - Update DNS records as instructed

### Alternative Platforms

**Netlify:**

```bash
npm run build
# Deploy dist/ folder to Netlify
```

**Railway:**

```bash
# Connect GitHub repo to Railway
# Set environment variables in dashboard
```

**Docker:**

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🧪 Testing

### Unit Tests

```bash
npm run test              # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report
```

### E2E Tests (Optional)

```bash
npm run test:e2e          # Cypress tests
npm run test:e2e:open     # Open Cypress UI
```

### API Testing

```bash
# Test vision endpoint
curl -X POST http://localhost:3000/api/vision \
  -F "image=@sample.png"

# Test guidance endpoint
curl -X POST http://localhost:3000/api/generate-guidance \
  -H "Content-Type: application/json" \
  -d '{"description":"Login form","framework":"next"}'
```

## 🔧 Development Scripts

```bash
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint errors
npm run type-check      # TypeScript type checking
npm run format          # Format code with Prettier
```

## 📊 Performance Optimization

### Image Processing

- **Compression**: Images auto-compressed before upload
- **Caching**: Vision API responses cached for 1 hour
- **Progressive loading**: Large images loaded progressively

### Code Splitting

- **Dynamic imports**: Monaco Editor loaded on-demand
- **Route splitting**: Each page bundle separately
- **Component lazy loading**: Heavy components load when needed

### Bundle Analysis

```bash
npm run build:analyze    # Analyze bundle size
npm run lighthouse      # Performance audit
```

## 🐛 Troubleshooting

### Common Issues

**1. API Key Errors**

```
Error: HuggingFace API key not configured
```

**Solution:** Add `HUGGINGFACE_API_KEY` to `.env.local`

**2. Image Upload Fails**

```
Error: File too large
```

**Solution:** Check file size < 10MB, supported formats: PNG, JPG, WebP

**3. Monaco Editor Not Loading**

```
Loading editor...
```

**Solution:** Check internet connection, Monaco loads from CDN

**4. OCR Poor Quality**

```
Confidence: 0.2
```

**Solution:** Use higher resolution images, ensure good contrast

### Debug Mode

```bash
# Enable debug logging
DEBUG=true npm run dev

# View API logs
tail -f .next/trace
```

## 🤝 Contributing

### Development Setup

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Make changes and test
4. Commit: `git commit -m 'Add amazing feature'`
5. Push: `git push origin feature/amazing-feature`
6. Open Pull Request

### Code Standards

- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb configuration
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks

### Testing Requirements

- Unit tests for all utilities
- Integration tests for API routes
- E2E tests for critical flows

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **HuggingFace** for vision models
- **Tesseract.js** for OCR capabilities
- **Material-UI** for component library
- **Monaco Editor** for code editing
- **Next.js** for framework
- **Vercel** for hosting platform

## 📞 Support

- **Documentation**: [Wiki](wiki-url)
- **Issues**: [GitHub Issues](issues-url)
- **Discussions**: [GitHub Discussions](discussions-url)
- **Discord**: [Community Server](discord-url)

---

## 🎉 Getting Started Checklist

- [ ] Clone repository
- [ ] Install dependencies (`npm install`)
- [ ] Copy environment file (`cp .env.example .env.local`)
- [ ] Add HuggingFace API key
- [ ] Add LLM provider key (OpenRouter/Groq)
- [ ] Start development server (`npm run dev`)
- [ ] Upload test image
- [ ] Generate first component guidance
- [ ] Save snippet to library
- [ ] Deploy to Vercel

**Ready to transform your UI designs into code!** 🚀

Built with ❤️ using Next.js, TypeScript, and AI
