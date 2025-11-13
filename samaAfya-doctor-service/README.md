# SamaAfya Doctor Service

Mock API service for doctor-related operations using JSON Server.

## Features

- Mock API endpoints for doctors, patients, and tracking codes
- MFA simulation with console logging
- Email simulation with MailDev integration

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the service:
```bash
npm run dev
```

## MailDev Integration

MailDev is fully integrated for email simulation during development. MFA codes and tracking codes are automatically sent via email to MailDev.

### Installation

All dependencies are included. Install with:
```bash
npm install
```

### Usage

1. Start the API server with MailDev integration:
```bash
npm run dev
```

2. In another terminal, start MailDev web interface:
```bash
npm run maildev
```

3. Or start both together:
```bash
npm run dev:full
```

### Features

- **Automatic Email Sending**: MFA codes are sent when doctors log in, tracking codes when generated
- **Web Interface**: View all emails at http://localhost:1080
- **SMTP Server**: Runs on localhost:1025
- **HTML & Text Emails**: Professional email templates included
- **No External Emails**: All emails are captured locally for development

### Email Types

1. **MFA Codes**: Sent during doctor login with 6-digit codes
2. **Tracking Codes**: Sent when generating patient tracking codes

### Testing

Use the test credentials in the doctor login forms to see email sending in action.

## API Endpoints

- `GET /doctors` - List all doctors
- `POST /doctors` - Create doctor
- `PATCH /doctors/:id` - Update doctor
- `GET /patients` - List all patients
- `GET /trackingCodes` - List all tracking codes
- `POST /trackingCodes` - Create tracking code

## Development

The service uses JSON Server for mock data persistence. Data is stored in `db.json`.