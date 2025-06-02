# Vivaan Holidays

A modern travel website built with React, Node.js, and MongoDB. Visit us at [vivaanholidays.co.in](https://vivaanholidays.co.in)

## Features

- Domestic and International Tour Packages
- Admin Dashboard for Package Management
- Contact Form with EmailJS Integration
- Firebase Authentication
- Responsive Design
- MongoDB Database Integration

## Tech Stack

### Frontend
- React with TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- EmailJS
- Firebase Authentication

### Backend
- Node.js
- Express
- MongoDB
- Mongoose

## Project Structure

```
├── BACKEND/                 # Backend server
│   ├── src/                # Source files
│   ├── app.js             # Express app
│   └── package.json       # Backend dependencies
│
└── project/               # Frontend application
    ├── src/              # Source files
    ├── public/           # Static files
    └── package.json      # Frontend dependencies
```

## Environment Setup

### Backend (.env)
```
PORT=3000
NODE_ENV=production
MONGODB_URI=your_mongodb_uri
MONGODB_DB_NAME=your_db_name
ALLOWED_ORIGINS=comma_separated_origins
```

### Frontend (.env)
```
VITE_APP_SITE_URL=your_site_url
VITE_APP_API_URL=your_api_url
VITE_APP_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_APP_EMAILJS_ADMIN_TEMPLATE_ID=your_emailjs_admin_template_id
VITE_APP_EMAILJS_CONTACT_TEMPLATE_ID=your_emailjs_contact_template_id
VITE_APP_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/vivaan-holidays.git
cd vivaan-holidays
```

2. Install backend dependencies:
```bash
cd BACKEND
npm install
```

3. Install frontend dependencies:
```bash
cd ../project
npm install
```

4. Create environment files:
- Create `BACKEND/.env` and `project/.env`
- Add the necessary environment variables

## Development

1. Start backend server:
```bash
cd BACKEND
npm run dev
```

2. Start frontend development server:
```bash
cd project
npm run dev
```

## Deployment

Use the provided deployment script:
```bash
chmod +x deploy.sh
sudo ./deploy.sh
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Contact

Vivaan Holidays - [vivaanholidays6@gmail.com](mailto:vivaanholidays6@gmail.com)

Project Link: [https://github.com/your-username/vivaan-holidays](https://github.com/your-username/vivaan-holidays) 