import './globals.css';

export const metadata = {
  title: 'Fit Log',
  description: 'Workout and Fitness Management App',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#09090b] text-white antialiased">
        {children}
      </body>
    </html>
  );
}