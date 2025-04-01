
# QR Attendance Tracking PWA

A Progressive Web Application (PWA) for attendance tracking using QR codes. This application allows students to mark their attendance by scanning a QR code and entering their matric number and name. Admins can manage class sessions, track attendance, and generate reports.

## Features

### Student Features:
- **Submit Attendance Once Per Day**: Students can only submit attendance once per day for each course.
- **QR Code Scanning**: Scan a static QR code with the PWA or any QR code scanner app.
- **Local Storage**: After submitting their attendance, the student’s details (matric number and name) are saved in the local storage to prevent multiple entries on the same day for that course.

### Admin Features:
- **Class Management**: Admins can create new classes with start and stop times.
- **Attendance Tracking**: View attendance records for each class.
- **Export Attendance**: Export attendance lists to PDF.
- **Print QR Code**: Print the QR code for the class, which students can scan to submit attendance.

### Access Control:
- **Students**: Can only submit attendance once per day for each course.
- **Admins**: Can view and download attendance records.

## Technology Stack

- **Frontend**: React, Next.js, Tailwind CSS
- **Backend**: Node.js, Prisma
- **Database**: Neon PostgreSQL

- **PDF Generation**: PDF-lib for exporting attendance lists

## Installation

### Prerequisites
- Node.js and npm installed
- Neon PostgreSQL account (for database setup)
- Google OAuth credentials for authentication

### Steps to Set Up:

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your `.env` file:
   - Add the required environment variables (e.g., database connection string, Google OAuth credentials).

4. Set up Prisma:
   - Run migrations to set up the database schema.
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Access the app at `http://ice-qr.vercel.app` and start using it!

## Usage

2. **Create a Class**: Admins can create new classes with start and end times.
3. **QR Code Generation**: Once a class is created, admins can generate and print a QR code for students.
4. **Track Attendance**: Students can scan the QR code and input their matric number and name to mark their attendance.

## Export Attendance
- Admins can download the attendance report for any class and export it as a PDF.

## Contributing

If you'd like to contribute, feel free to fork the repository and submit a pull request. Please make sure to follow the coding standards and write tests where necessary.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- Prisma for database management
- Tailwind CSS for styling
- PDF-lib for generating PDFs


