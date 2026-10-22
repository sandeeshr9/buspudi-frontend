import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useApp();
  const dark = resolvedTheme === "dark";
  return (
    <Button variant="ghost" size="icon" onClick={() => setTheme(dark ? "light" : "dark")} aria-label={dark ? "Switch to light theme" : "Switch to dark theme"} title="Toggle theme">
      {dark ? <Sun /> : <Moon />}
    </Button>
  );
}
