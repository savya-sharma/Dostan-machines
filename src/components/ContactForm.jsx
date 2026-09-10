"use client";

import { useState } from "react";

const FIELDS = [
  { name: "name", label: "Full Name", type: "text" },
  { name: "email", label: "Email Address", type: "email" },
  { name: "phone", label: "Phone Number", type: "tel" },
];

const EMPTY = { name: "", email: "", phone: "", message: "" };

export default function ContactForm() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    const next = {};
    if (!values.name.trim()) next.name = "Please enter your name.";
    if (!values.email.trim()) next.email = "Please enter your email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
      next.email = "Please enter a valid email.";
    if (!values.phone.trim()) next.phone = "Please enter your phone number.";
    if (!values.message.trim()) next.message = "Please enter a message.";
    return next;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setStatus("success");
    setValues(EMPTY);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-[3rem] flex max-w-xl flex-col gap-5">
      {FIELDS.map((field) => (
        <div key={field.name} className="flex flex-col gap-1.5">
          <label htmlFor={field.name} className="text-sm font-medium text-ink">
            {field.label}
          </label>
          <input
            id={field.name}
            name={field.name}
            type={field.type}
            value={values[field.name]}
            onChange={handleChange}
            className="rounded-md border border-line/40 bg-transparent px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-accent"
          />
          {errors[field.name] && (
            <span className="text-xs text-accent">{errors[field.name]}</span>
          )}
        </div>
      ))}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-sm font-medium text-ink">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={values.message}
          onChange={handleChange}
          className="resize-none rounded-md border border-line/40 bg-transparent px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-accent"
        />
        {errors.message && <span className="text-xs text-accent">{errors.message}</span>}
      </div>

      <button
        type="submit"
        className="mt-2 self-start rounded-full bg-ink px-8 py-3 text-sm font-bold uppercase tracking-wide text-surface transition-opacity hover:opacity-90"
      >
        Send Message
      </button>

      {status === "success" && (
        <p className="text-sm text-accent">
          Thanks for reaching out — we&apos;ll get back to you shortly.
        </p>
      )}
    </form>
  );
}
