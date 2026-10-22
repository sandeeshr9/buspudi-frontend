import { Component, type ReactNode } from "react";

interface State { error: Error | null }

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  componentDidCatch(error: Error) { console.error("BusPudi error:", error); }
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="grid min-h-[60vh] place-items-center p-6 text-center">
        <div>
          <p className="font-display text-xl font-bold">Something went wrong</p>
          <p className="mt-1 text-sm text-muted-foreground">{this.state.error.message}</p>
          <button type="button" onClick={() => { this.setState({ error: null }); window.location.assign("/"); }} className="mt-4 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white">Back to home</button>
        </div>
      </div>
    );
  }
}
