import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ChatInput from "@/components/ChatInput";

// ─── Helpers ────────────────────────────────────────────────────────────────

function renderInput(overrides = {}) {
  const props = {
    sendMessage: vi.fn(),
    status: "ready",
    onStop: vi.fn(),
    onRegenerate: vi.fn(),
    canRegenerate: false,
    ...overrides,
  };
  render(<ChatInput {...props} />);
  return props;
}

function getInput() {
  return screen.getByLabelText("Website URL input");
}

function getSendButton() {
  return screen.getByLabelText("Send message");
}

// ─── Tests ──────────────────────────────────────────────────────────────────

describe("ChatInput", () => {
  it("renders the URL input and send button", () => {
    renderInput();
    expect(getInput()).toBeInTheDocument();
    expect(getSendButton()).toBeInTheDocument();
  });

  it("submits a valid URL and normalizes it", () => {
    const sendMessage = vi.fn();
    renderInput({ sendMessage });

    fireEvent.change(getInput(), { target: { value: "example.com" } });
    fireEvent.click(getSendButton());

    expect(sendMessage).toHaveBeenCalledWith({
      text: "Analyze https://example.com/",
    });
  });

  it("submits a full https URL normalized", () => {
    const sendMessage = vi.fn();
    renderInput({ sendMessage });

    fireEvent.change(getInput(), { target: { value: "https://vercel.com" } });
    fireEvent.click(getSendButton());

    expect(sendMessage).toHaveBeenCalledWith({
      text: "Analyze https://vercel.com/",
    });
  });

  it("sends non-URL text directly without validation", () => {
    const sendMessage = vi.fn();
    renderInput({ sendMessage });

    fireEvent.change(getInput(), { target: { value: "What is SEO?" } });
    fireEvent.click(getSendButton());

    expect(sendMessage).toHaveBeenCalledWith({ text: "What is SEO?" });
  });

  it("does not submit when input is empty", () => {
    const sendMessage = vi.fn();
    renderInput({ sendMessage });

    fireEvent.click(getSendButton());

    expect(sendMessage).not.toHaveBeenCalled();
  });

  it("shows a loading state when status is streaming", () => {
    renderInput({ status: "streaming" });
    expect(screen.getByLabelText("Stop generation")).toBeInTheDocument();
  });

  it("shows a stop button during streaming", () => {
    const onStop = vi.fn();
    renderInput({ status: "streaming", onStop });

    fireEvent.click(screen.getByLabelText("Stop generation"));
    expect(onStop).toHaveBeenCalled();
  });

  it("shows a regenerate button when canRegenerate is true", () => {
    const onRegenerate = vi.fn();
    renderInput({ canRegenerate: true, onRegenerate });

    fireEvent.click(screen.getByText("↻ Regenerate"));
    expect(onRegenerate).toHaveBeenCalled();
  });

  it("clears input after successful submission", () => {
    const sendMessage = vi.fn();
    renderInput({ sendMessage });

    fireEvent.change(getInput(), { target: { value: "example.com" } });
    fireEvent.click(getSendButton());

    expect(getInput()).toHaveValue("");
  });

  it("submits non-URL text directly without validation", () => {
    const sendMessage = vi.fn();
    renderInput({ sendMessage });

    fireEvent.change(getInput(), { target: { value: "What is SEO?" } });
    fireEvent.click(getSendButton());

    expect(sendMessage).toHaveBeenCalledWith({ text: "What is SEO?" });
  });
});