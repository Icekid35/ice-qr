export default function manifest() {
  return {
   "name": "QR Attendance Tracking",
   "short_name": "QR Attendance",
   "description": "A Progressive Web App for tracking student attendance with QR codes.",
   "start_url": "/",
   "display": "standalone",
   "background_color": "#ffffff",
   "theme_color": "#4CAF50",
   icons: [
     {
       src: '/icon-192x192.png',
       sizes: '192x192',
       type: 'image/png',
     },
     {
       src: '/icon-512x512.png',
       sizes: '512x512',
       type: 'image/png',
     },
   ],
 }
}