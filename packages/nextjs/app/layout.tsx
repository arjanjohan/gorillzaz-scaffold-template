import "@rainbow-me/rainbowkit/styles.css";
import { ScaffoldMoveAppWithProviders } from "~~/components/ScaffoldMoveAppWithProviders";
import { ThemeProvider } from "~~/components/ThemeProvider";
import "~~/styles/globals.css";
import { getMetadata } from "~~/utils/scaffold-move/getMetadata";

export const metadata = getMetadata({
  title: "Gorilla Moverz Community Collection",
  description: "The most gorillish community collection on Movement",
});

const ScaffoldMoveApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning>
      <body>
        <ThemeProvider enableSystem={false} defaultTheme="dark">
          <ScaffoldMoveAppWithProviders>{children}</ScaffoldMoveAppWithProviders>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default ScaffoldMoveApp;
