"use client";

import { type FormEvent, useState } from "react";

type Props = {
  formspreeFormId: string | null;
};

export function WishlistForm({ formspreeFormId }: Props) {
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  if (!formspreeFormId) {
    return (
      <div className="ui-panel max-w-md">
        <p className="ui-text-body-sm text-secondary-ui">
          Form is not configured. Create a form at Formspree, then set{" "}
          <code className="rounded bg-elevated px-1.5 py-0.5 font-mono text-xs text-primary-ui">
            NEXT_PUBLIC_FORMSPREE_WISHLIST_ID
          </code>{" "}
          in your environment to your form ID (the value after{" "}
          <span className="whitespace-nowrap font-mono text-xs">/f/</span>).
        </p>
      </div>
    );
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch(`https://formspree.io/f/${formspreeFormId}`, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      const body: { error?: string } = await res.json().catch(() => ({}));

      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
        setErrorMessage(
          typeof body.error === "string" && body.error.length > 0
            ? body.error
            : "Something went wrong. Try again later.",
        );
      }
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Check your connection and try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="ui-card max-w-md space-y-4 text-center">
        <p className="ui-text-title">You are on the list</p>
        <p className="ui-text-body-sm text-secondary-ui">
          Thanks — we will reach out by email.
        </p>
        <button
          type="button"
          className="ui-btn-secondary w-full"
          onClick={() => setStatus("idle")}
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="ui-card max-w-md space-y-4">
      <input type="hidden" name="_subject" value="QR Menu wish list request" />
      <div>
        <label
          htmlFor="owner-name"
          className="mb-1.5 block ui-text-body-sm text-secondary-ui"
        >
          Your name
        </label>
        <input
          id="owner-name"
          name="name"
          type="text"
          required
          className="ui-input"
          autoComplete="name"
        />
      </div>
      <div>
        <label
          htmlFor="owner-email"
          className="mb-1.5 block ui-text-body-sm text-secondary-ui"
        >
          Email
        </label>
        <input
          id="owner-email"
          name="email"
          type="email"
          required
          className="ui-input"
          autoComplete="email"
        />
      </div>
      <div>
        <label
          htmlFor="restaurant"
          className="mb-1.5 block ui-text-body-sm text-secondary-ui"
        >
          Restaurant name
        </label>
        <input
          id="restaurant"
          name="restaurant_name"
          type="text"
          required
          className="ui-input"
          autoComplete="organization"
        />
      </div>
      <div>
        <label
          htmlFor="phone"
          className="mb-1.5 block ui-text-body-sm text-secondary-ui"
        >
          Phone
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          className="ui-input"
          autoComplete="tel"
        />
      </div>
      <div>
        <label
          htmlFor="message"
          className="mb-1.5 block ui-text-body-sm text-secondary-ui"
        >
          Anything else?{" "}
          <span className="font-normal text-muted-ui">(optional)</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className="ui-input min-h-24 resize-y"
        />
      </div>
      {status === "error" ? (
        <p className="ui-error" role="alert">
          {errorMessage}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="ui-btn-primary w-full disabled:opacity-50"
      >
        {status === "submitting" ? "Sending…" : "Request onboarding"}
      </button>
    </form>
  );
}
