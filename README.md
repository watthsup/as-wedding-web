# Wedding RSVP Application

A beautiful and modern wedding RSVP website built with React Router v7, featuring an elegant design, image slideshow, countdown timer, and secure form submission to Google Sheets.

## ✨ Features

- 🎨 **Beautiful Wedding Design** - Elegant cream color palette with smooth animations
- 📸 **Image Slideshow** - Automatic photo slideshow with manual navigation
- ⏰ **Countdown Timer** - Real-time countdown to the wedding day
- 📝 **RSVP Form** - Secure form with validation and Google Sheets integration
- 🛡️ **Security Features** - Rate limiting, input validation, and bot protection
- 🚀 **Modern Tech Stack** - React Router v7, TypeScript, Tailwind CSS, Framer Motion
- 📱 **Responsive Design** - Works perfectly on all devices
- 🐳 **Docker Ready** - Containerized for easy deployment

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ 
- pnpm (recommended) or npm
- Docker (optional, for containerized deployment)

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd rsvp-aun-wedding
```

2. **Install dependencies:**
```bash
pnpm install
# or
npm install
```

3. **Configure the application:**
Edit `app/configs.ts` to customize your wedding details:
```typescript
export const config = {
  name: "Your Names",
  weddingDate: "2025-11-22T09:00:00",
  location: "Your Location",
  venue: {
    name: "Venue Name",
    address: "Venue Address",
  },
  appScriptUrl: "your-google-apps-script-url",
};
```

## 🛠️ Development

Start the development server with hot reload:

```bash
pnpm run dev
# or
npm run dev
```

Your application will be available at `http://localhost:5173`.

## 🏗️ Building for Production

Create a production build:

```bash
pnpm run build
# or
npm run build
```

Start the production server:

```bash
pnpm run start
# or
npm run start
```

The application will be available at `http://localhost:3000`.

## 🐳 Docker Deployment

### Build Docker Image

```bash
docker build -t wedding-rsvp .
```

### Run Docker Container

```bash
# Run in foreground
docker run -p 3000:3000 wedding-rsvp

# Run in background
docker run -d -p 3000:3000 --name wedding-rsvp-app wedding-rsvp
```

### Docker Management Commands

```bash
# View running containers
docker ps

# View container logs
docker logs wedding-rsvp-app

# Stop container
docker stop wedding-rsvp-app

# Remove container
docker rm wedding-rsvp-app

# Remove image
docker rmi wedding-rsvp
```

## 📊 Google Sheets Integration

### Setup Google Apps Script

1. Create a new Google Sheet
2. Go to **Extensions** > **Apps Script**
3. Replace the default code with:

```javascript
const SHEET_NAME = 'Responses';

function doGet() {
  return ContentService.createTextOutput(
    JSON.stringify({ 
      status: 'ok', 
      message: 'RSVP endpoint is working. Use POST to submit data.',
      timestamp: new Date().toISOString()
    })
  ).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    if (!e.postData || !e.postData.contents) {
      throw new Error('No POST data received');
    }
    
    const data = JSON.parse(e.postData.contents);
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      sheet.getRange(1, 1, 1, 6).setValues([[
        'Timestamp', 'First Name', 'Last Name', 
        'Guests', 'Attending', 'Full Name'
      ]]);
    }
    
    const { 
      first_name, 
      last_name, 
      people_amount, 
      is_accepted 
    } = data;
    
    sheet.appendRow([
      new Date(),
      first_name,
      last_name,
      people_amount,
      is_accepted ? 'Yes' : 'No',
      `${first_name} ${last_name}`
    ]);
    
    return ContentService.createTextOutput(
      JSON.stringify({ status: 'success' })
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ 
        status: 'error', 
        message: error.toString() 
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. **Deploy as Web App:**
   - Click **Deploy** > **New deployment**
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Click **Deploy**

5. **Copy the Web App URL** and update `appScriptUrl` in `app/configs.ts`

## 🛡️ Security Features

The application includes several security measures:

- **Rate Limiting**: 3 submissions per minute per user
- **Input Validation**: Regex patterns for names, length limits
- **Suspicious Activity Detection**: Blocks common spam patterns
- **Duplicate Prevention**: Prevents duplicate submissions
- **CORS Handling**: Proper handling of cross-origin requests

## 🎨 Customization

### Colors
Edit the color palette in `app/configs.ts`:
```typescript
colors: {
  primary: "#F5F1EB",    // Main background
  secondary: "#F9F7F4",  // Cards background
  accent: "#E8E0D6",     // Borders
  text: "#8B7355",       // Main text
  // ... more colors
}
```

### Images
Replace images in the `public/` directory:
- `1.jpg` to `8.jpg` - Slideshow images
- `main-image.jpg` - Main hero image
- `favicon.ico` - Browser icon

### Content
Update wedding details in `app/configs.ts` and text content in `app/routes/home.tsx`.

## 📱 Deployment Platforms

This application can be deployed to various platforms:

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker-based Platforms
- **Railway**: Connect your GitHub repository
- **Fly.io**: Use `flyctl deploy`
- **Google Cloud Run**: Deploy the Docker image
- **AWS ECS**: Use the Docker image
- **DigitalOcean App Platform**: Connect repository or use Docker

### Traditional Hosting
- Build the application with `pnpm run build`
- Upload the `build/` directory and `package.json`
- Run `pnpm install --prod` on the server
- Start with `pnpm run start`

## 📋 Project Structure

```
├── app/
│   ├── components/          # React components
│   │   └── RSVPForm.tsx    # Main RSVP form
│   ├── hooks/              # Custom React hooks
│   ├── routes/             # Page routes
│   ├── assets/             # Static assets
│   ├── configs.ts          # Configuration file
│   └── root.tsx            # Root component
├── public/                 # Public assets
├── build/                  # Production build output
├── Dockerfile             # Docker configuration
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ using React Router v7, TypeScript, and Tailwind CSS.