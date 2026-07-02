import './globals.css';

export const metadata = {
  title: 'iPhone Chat Quote Generator',
  description: 'Generate beautiful iPhone style chat quotes easily.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
