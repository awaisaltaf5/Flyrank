import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Home from "@/app/page";

// Helper: dismiss the landing screen by clicking "Get Started"
function dismissLandingScreen() {
  const getStartedButton = screen.queryByText("Get Started");
  if (getStartedButton) {
    fireEvent.click(getStartedButton);
  }
}

// ─── Mock ai/react ──────────────────────────────────────────────────────────

const mockSendMessage = vi.fn();
const mockRegenerate = vi.fn();
const mockStop = vi.fn();
const mockClearError = vi.fn();
const mockSetMessages = vi.fn();

let mockMessages = [];
let mockStatus = "ready";
let mockError = null;

vi.mock("@ai-sdk/react", () => ({
  useChat: () => ({
    messages: mockMessages,
    sendMessage: mockSendMessage,
    status: mockStatus,
    stop: mockStop,
    error: mockError,
    regenerate: mockRegenerate,
    clearError: mockClearError,
    setMessages: mockSetMessages,
  }),
}));

// ─── Tests ──────────────────────────────────────────────────────────────────

describe("App primary user flow", () => {
  beforeEach(() => {
    mockMessages = [];
    mockStatus = "ready";
    mockError = null;
    mockSendMessage.mockClear();
    mockRegenerate.mockClear();
    mockStop.mockClear();
    mockClearError.mockClear();
    mockSetMessages.mockClear();
  });

  it("shows the landing screen first with MetaSpark AI branding", () => {
    render(<Home />);
    expect(screen.getByText("MetaSpark AI")).toBeInTheDocument();
    expect(screen.getByText("Get Started")).toBeInTheDocument();
  });

  it("shows the welcome screen after clicking Get Started", () => {
    render(<Home />);
    fireEvent.click(screen.getByText("Get Started"));
    expect(screen.getByText("AI Website Metadata Analyzer")).toBeInTheDocument();
    expect(screen.getByText("Analyze vercel.com")).toBeInTheDocument();
  });

  it("shows preset suggestion buttons on the welcome screen", async () => {
    render(<Home />);
    dismissLandingScreen();
    expect(screen.getByText("Analyze vercel.com")).toBeInTheDocument();
    expect(screen.getByText("Analyze github.com")).toBeInTheDocument();
    expect(screen.getByText("Analyze react.dev")).toBeInTheDocument();
    expect(screen.getByText("Analyze nextjs.org")).toBeInTheDocument();
  });

  it("triggers analysis when a preset suggestion is clicked", async () => {
    render(<Home />);
    dismissLandingScreen();
    const button = screen.getByText("Analyze vercel.com");
    fireEvent.click(button);
    expect(mockSendMessage).toHaveBeenCalledWith({
      text: "Analyze https://vercel.com",
    });
  });

  it("shows an error when the API returns an error", async () => {
    mockError = { message: "Service unavailable" };
    mockMessages = [
      {
        id: "1",
        role: "user",
        parts: [{ type: "text", text: "Analyze https://example.com" }],
      },
    ];

    render(<Home />);
    dismissLandingScreen();
    expect(screen.getByText("Service unavailable")).toBeInTheDocument();
  });

  it("shows a retry button when there is an error", async () => {
    mockError = { message: "Service unavailable" };
    mockMessages = [
      {
        id: "1",
        role: "user",
        parts: [{ type: "text", text: "Analyze https://example.com" }],
      },
    ];

    render(<Home />);
    dismissLandingScreen();
    const retryButton = screen.getByText("Retry");
    fireEvent.click(retryButton);
    expect(mockClearError).toHaveBeenCalled();
  });

  it("shows loading state while analyzing", async () => {
    mockStatus = "streaming";
    mockMessages = [
      {
        id: "1",
        role: "user",
        parts: [{ type: "text", text: "Analyze https://example.com" }],
      },
    ];

    render(<Home />);
    dismissLandingScreen();
    expect(screen.getByText("Analyzing")).toBeInTheDocument();
  });

  it("shows a no-results state when assistant returns empty content", async () => {
    mockStatus = "ready";
    mockMessages = [
      {
        id: "1",
        role: "user",
        parts: [{ type: "text", text: "Analyze https://example.com" }],
      },
      {
        id: "2",
        role: "assistant",
        parts: [],
      },
    ];

    render(<Home />);
    dismissLandingScreen();
    expect(screen.getByText(/No metadata was found/)).toBeInTheDocument();
  });
});