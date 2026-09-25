"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSubmit } from "@formspree/react";
import { isSubmissionError } from "@formspree/core";
import gsap from "gsap";
import {
  ChevronDown,
  Loader2,
  CircleCheck,
  CircleAlert,
  ArrowUpRight,
} from "lucide-react";
import { MACHINES, findMachineBySlug } from "@/lib/machines";

// This project has no existing environment-variable convention (no .env
// files, no other NEXT_PUBLIC_* usage), so the form ID is set directly
// here rather than introducing one just for this.
const FORMSPREE_FORM_ID = "xoevwqln";

const ENQUIRY_TYPES = [
  { value: "individual", label: "Individual Machinery" },
  { value: "turnkey", label: "Turnkey Plant Solution" },
  { value: "expansion", label: "Plant Expansion / Upgrade" },
  { value: "custom", label: "Custom Solution" },
];

// The fields shown per enquiry type — progressive disclosure. Only the
// active type's fields are rendered and validated. Each field's runtime
// state/error key is namespaced as `${enquiryType}_${field.name}` so the
// same short label (e.g. "location") can be reused across flows without
// values leaking between them.
const FLOW_FIELDS = {
  individual: [
    {
      name: "capacity",
      label: "Production Capacity / Requirement",
      type: "text",
      numeric: true,
    },
    {
      name: "details",
      label: "Requirement Details",
      type: "textarea",
      required: true,
    },
  ],
  turnkey: [
    { name: "plantType", label: "Plant / Project Type", type: "text" },
    {
      name: "capacity",
      label: "Required Production Capacity",
      type: "text",
      numeric: true,
    },
    { name: "location", label: "Project Location", type: "text" },
    { name: "stage", label: "Current Project Stage", type: "text" },
    { name: "timeline", label: "Expected Project Timeline", type: "text" },
    {
      name: "details",
      label: "Requirement Details",
      type: "textarea",
      required: true,
    },
  ],
  expansion: [
    {
      name: "existingPlant",
      label: "Existing Plant / Facility",
      type: "text",
    },
    {
      name: "currentCapacity",
      label: "Current Production Capacity",
      type: "text",
      numeric: true,
    },
    {
      name: "additionalCapacity",
      label: "Required Additional Capacity",
      type: "text",
      numeric: true,
    },
    { name: "location", label: "Project Location", type: "text" },
    {
      name: "requirement",
      label: "Expansion / Upgrade Requirement",
      type: "text",
    },
    {
      name: "details",
      label: "Requirement Details",
      type: "textarea",
      required: true,
    },
  ],
  custom: [
    {
      name: "requirement",
      label: "Project / Solution Requirement",
      type: "text",
    },
    {
      name: "productionRequirement",
      label: "Production Requirement",
      type: "text",
      numeric: true,
    },
    { name: "location", label: "Project Location", type: "text" },
    {
      name: "details",
      label: "Requirement Details",
      type: "textarea",
      required: true,
    },
  ],
};

const CONTACT_FIELDS = [
  { name: "name", label: "Full Name", type: "text", autoComplete: "name" },
  {
    name: "company",
    label: "Company Name",
    type: "text",
    autoComplete: "organization",
  },
  { name: "email", label: "Email Address", type: "email", autoComplete: "email" },
  {
    name: "phone",
    label: "Phone / WhatsApp Number",
    type: "tel",
    autoComplete: "tel",
  },
  { name: "country", label: "Country", type: "text", autoComplete: "country-name" },
];

const EMPTY_FLOW_VALUES = Object.fromEntries(
  Object.entries(FLOW_FIELDS).flatMap(([flowKey, fields]) =>
    fields.map((field) => [`${flowKey}_${field.name}`, ""])
  )
);

const EMPTY = {
  enquiryType: "",
  machine: "",
  name: "",
  company: "",
  email: "",
  phone: "",
  country: "",
  ...EMPTY_FLOW_VALUES,
};

// Shared visual treatment for every text input, textarea, and select: a
// restrained underline field (no boxed/rounded chrome) that reads as
// technical/editorial rather than generic SaaS, with a deliberate,
// smooth border transition on hover/focus and a clear invalid state.
const fieldControlClasses =
  "w-full border-0 border-b border-line/30 bg-transparent px-0.5 py-2.5 text-sm text-ink outline-none transition-colors duration-300 ease-out placeholder:text-line/60 hover:border-ink/40 focus:border-ink aria-invalid:border-accent aria-invalid:hover:border-accent";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidPhone(value) {
  // Allows digits, spaces, and common separators (+, -, (), .), and
  // requires the actual digit count to look like a real phone number
  // (7-15 digits, per the international E.164 range) rather than
  // rejecting or accepting based on formatting alone.
  if (!/^[+\d\s().-]+$/.test(value)) return false;
  const digitCount = value.replace(/\D/g, "").length;
  return digitCount >= 7 && digitCount <= 15;
}

function getInitialValues(searchParams) {
  const preselected = findMachineBySlug(searchParams.get("machine"));
  if (!preselected) return EMPTY;
  return { ...EMPTY, enquiryType: "individual", machine: preselected.name };
}

// Finds the FLOW_FIELDS entry a namespaced state key (`${flowKey}_${name}`)
// belongs to, so a single field can be re-validated on its own.
function findFlowField(key) {
  for (const [flowKey, fields] of Object.entries(FLOW_FIELDS)) {
    const prefix = `${flowKey}_`;
    if (!key.startsWith(prefix)) continue;
    const field = fields.find((f) => f.name === key.slice(prefix.length));
    if (field) return field;
  }
  return null;
}

// Single source of truth for a field's validity, used both for full
// submit-time validation and for live-clearing a single field's error as
// the user corrects it.
function getFieldError(name, values) {
  switch (name) {
    case "enquiryType":
      return values.enquiryType
        ? undefined
        : "Please select what you're looking for.";
    case "machine":
      return values.enquiryType === "individual" && !values.machine
        ? "Please select a machine."
        : undefined;
    case "name":
      return values.name.trim() ? undefined : "Please enter your full name.";
    case "company":
      return values.company.trim()
        ? undefined
        : "Please enter your company name.";
    case "email":
      if (!values.email.trim()) return "Please enter your email address.";
      if (!EMAIL_REGEX.test(values.email.trim()))
        return "Please enter a valid email address.";
      return undefined;
    case "phone":
      if (!values.phone.trim())
        return "Please enter your phone or WhatsApp number.";
      if (!isValidPhone(values.phone.trim()))
        return "Please enter a valid phone number.";
      return undefined;
    case "country":
      return values.country.trim()
        ? undefined
        : "Please enter your country.";
    default: {
      const field = findFlowField(name);
      if (!field) return undefined;
      const value = (values[name] ?? "").trim();
      if (field.required && !value) return "Please tell us more.";
      if (field.numeric && value && !/\d/.test(value))
        return "Please include a number (e.g. 500 LPH).";
      return undefined;
    }
  }
}

// Builds a clean, human-readable payload for Formspree — only the active
// enquiry type's fields, keyed by their visible labels rather than the
// internal namespaced state keys, so the email notification reads clearly.
function buildSubmissionPayload(values) {
  const enquiryTypeLabel =
    ENQUIRY_TYPES.find((type) => type.value === values.enquiryType)?.label ??
    values.enquiryType;

  const payload = {
    _subject: "New Quotation Request — DOSTAN MACHINES",
    "Enquiry Type": enquiryTypeLabel,
  };

  if (values.enquiryType === "individual") {
    payload["Selected Machinery"] = values.machine;
  }

  const fields = FLOW_FIELDS[values.enquiryType] || [];
  fields.forEach((field) => {
    const key = `${values.enquiryType}_${field.name}`;
    if (values[key]) payload[field.label] = values[key];
  });

  payload["Full Name"] = values.name;
  payload["Company Name"] = values.company;
  payload["Email Address"] = values.email;
  payload["Phone / WhatsApp Number"] = values.phone;
  payload["Country"] = values.country;

  return payload;
}

function prefersReducedMotion() {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function RequiredMark() {
  return (
    <span className="text-accent/80" aria-hidden="true">
      *
    </span>
  );
}

// A thin numbered rule marking the start of a form section — a restrained
// editorial/technical accent (reuses the site's existing, otherwise-unused
// mono font token) rather than new copy: purely decorative, so it never
// touches field content or structure.
function SectionDivider({ index }) {
  return (
    <div className="flex items-center gap-4" aria-hidden="true">
      <span className="font-mono text-xs tracking-wide text-line/70">
        {index}
      </span>
      <span className="h-px flex-1 bg-line/15" />
    </div>
  );
}

// Wraps a single field's label + control + error message. Owns the
// restrained "invalid" micro-interaction: the first time this field's
// error appears, the field nudges horizontally and the message eases in
// — never the whole form, and never more than once per new error.
function FieldShell({ name, label, required, error, children }) {
  const wrapperRef = useRef(null);
  const errorRef = useRef(null);
  const hadErrorRef = useRef(Boolean(error));

  useEffect(() => {
    const hadError = hadErrorRef.current;
    hadErrorRef.current = Boolean(error);
    if (!error || hadError || prefersReducedMotion()) return;

    if (wrapperRef.current) {
      gsap.fromTo(
        wrapperRef.current,
        { x: 0 },
        {
          x: 6,
          duration: 0.045,
          repeat: 3,
          yoyo: true,
          ease: "power1.inOut",
          clearProps: "x",
        }
      );
    }
    if (errorRef.current) {
      gsap.fromTo(
        errorRef.current,
        { opacity: 0, y: -4 },
        { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" }
      );
    }
  }, [error]);

  return (
    <div ref={wrapperRef} className="group flex flex-col gap-2">
      <label
        htmlFor={name}
        className="text-xs font-medium uppercase tracking-wide text-ink/60 transition-colors duration-200 group-focus-within:text-ink"
      >
        {label} {required && <RequiredMark />}
      </label>
      {children}
      {error && (
        <span ref={errorRef} id={`${name}-error`} className="text-xs text-accent">
          {error}
        </span>
      )}
    </div>
  );
}

function FlowFields({ enquiryType, values, errors, onChange }) {
  const fields = FLOW_FIELDS[enquiryType] || [];
  const shortFields = fields.filter((field) => field.type !== "textarea");
  const longFields = fields.filter((field) => field.type === "textarea");

  return (
    <>
      {shortFields.length > 0 && (
        <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
          {shortFields.map((field) => {
            const key = `${enquiryType}_${field.name}`;
            return (
              <FieldShell
                key={key}
                name={key}
                label={field.label}
                required={field.required}
                error={errors[key]}
              >
                <input
                  id={key}
                  name={key}
                  type="text"
                  value={values[key] ?? ""}
                  onChange={onChange}
                  aria-invalid={Boolean(errors[key])}
                  aria-describedby={errors[key] ? `${key}-error` : undefined}
                  className={fieldControlClasses}
                />
              </FieldShell>
            );
          })}
        </div>
      )}

      {longFields.map((field) => {
        const key = `${enquiryType}_${field.name}`;
        return (
          <FieldShell
            key={key}
            name={key}
            label={field.label}
            required={field.required}
            error={errors[key]}
          >
            <textarea
              id={key}
              name={key}
              rows={4}
              value={values[key] ?? ""}
              onChange={onChange}
              aria-invalid={Boolean(errors[key])}
              aria-describedby={errors[key] ? `${key}-error` : undefined}
              className={`resize-none ${fieldControlClasses}`}
            />
          </FieldShell>
        );
      })}
    </>
  );
}

function StatusPanel({ status }) {
  const ref = useRef(null);

  useEffect(() => {
    if (status !== "succeeded" && status !== "error") return;
    if (!ref.current || prefersReducedMotion()) return;
    gsap.fromTo(
      ref.current,
      { opacity: 0, y: 12, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "power3.out" }
    );
  }, [status]);

  if (status !== "succeeded" && status !== "error") return null;

  const isSuccess = status === "succeeded";
  const Icon = isSuccess ? CircleCheck : CircleAlert;

  return (
    <div
      ref={ref}
      role={isSuccess ? "status" : "alert"}
      aria-live={isSuccess ? "polite" : "assertive"}
      className={`flex items-start gap-3 border-l-2 bg-ink/[0.03] py-4 pl-5 pr-6 ${
        isSuccess ? "border-ink" : "border-accent"
      }`}
    >
      <Icon
        className={`mt-0.5 h-5 w-5 shrink-0 ${isSuccess ? "text-ink" : "text-accent"}`}
        aria-hidden="true"
      />
      <p className="text-sm leading-relaxed text-ink/80">
        {isSuccess
          ? "Thank you — your quotation request has been received. Our team will review your requirement and get back to you shortly."
          : "Something went wrong while sending your request. Please try again, or reach us directly on WhatsApp."}
      </p>
    </div>
  );
}

export default function QuotationForm() {
  const searchParams = useSearchParams();
  const [values, setValues] = useState(() => getInitialValues(searchParams));
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState("idle"); // idle | submitting | succeeded | error
  const submit = useSubmit(FORMSPREE_FORM_ID);

  function handleChange(e) {
    const { name, value } = e.target;
    const nextValues = { ...values, [name]: value };
    setValues(nextValues);

    // Only ever clears/updates an error that's already visible (i.e. the
    // user already attempted to submit once) — typing never introduces a
    // new error on a field the user hasn't tried submitting yet.
    setErrors((prev) => {
      if (!(name in prev)) return prev;
      const error = getFieldError(name, nextValues);
      if (!error) {
        const { [name]: _removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [name]: error };
    });
  }

  function validate() {
    const fieldNames = [
      "enquiryType",
      "name",
      "company",
      "email",
      "phone",
      "country",
    ];
    if (values.enquiryType === "individual") fieldNames.push("machine");
    (FLOW_FIELDS[values.enquiryType] || []).forEach((field) =>
      fieldNames.push(`${values.enquiryType}_${field.name}`)
    );

    const next = {};
    fieldNames.forEach((name) => {
      const error = getFieldError(name, values);
      if (error) next[name] = error;
    });
    return next;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitStatus === "submitting") return;

    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setSubmitStatus("submitting");
    const result = await submit(buildSubmissionPayload(values));

    if (isSubmissionError(result)) {
      setSubmitStatus("error");
      return;
    }

    setSubmitStatus("succeeded");
    setValues(EMPTY);
    setErrors({});
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mt-[3rem] flex max-w-2xl flex-col gap-10"
    >
      <div className="flex flex-col gap-5">
        <SectionDivider index="01" />
        <fieldset className="flex flex-col gap-2">
          <legend className="text-xs font-semibold uppercase tracking-wide text-ink/70">
            What are you looking for?
          </legend>
          <div className="mt-1 flex flex-wrap gap-3">
            {ENQUIRY_TYPES.map((type) => (
              <label
                key={type.value}
                className="flex cursor-pointer items-center gap-2 rounded-[0.7rem] border border-ink/20 px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-ink transition-all duration-200 ease-out hover:border-ink/50 has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-surface"
              >
                <input
                  type="radio"
                  name="enquiryType"
                  value={type.value}
                  checked={values.enquiryType === type.value}
                  onChange={handleChange}
                  className="sr-only"
                />
                {type.label}
              </label>
            ))}
          </div>
          {errors.enquiryType && (
            <span className="text-xs text-accent">{errors.enquiryType}</span>
          )}
        </fieldset>
      </div>

      {values.enquiryType && (
        <div className="flex flex-col gap-6">
          <SectionDivider index="02" />

          {values.enquiryType === "individual" && (
            <FieldShell
              name="machine"
              label={values.machine ? "Selected Machinery" : "Select Machinery"}
              required
              error={errors.machine}
            >
              <div className="relative">
                <select
                  id="machine"
                  name="machine"
                  value={values.machine}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.machine)}
                  aria-describedby={errors.machine ? "machine-error" : undefined}
                  className={`appearance-none pr-7 ${fieldControlClasses}`}
                >
                  <option value="">Select a machine</option>
                  {MACHINES.map((machine) => (
                    <option key={machine.slug} value={machine.name}>
                      {machine.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-0.5 top-1/2 h-4 w-4 -translate-y-1/2 text-line/70 transition-colors duration-200 group-focus-within:text-ink"
                  aria-hidden="true"
                />
              </div>
            </FieldShell>
          )}

          <FlowFields
            enquiryType={values.enquiryType}
            values={values}
            errors={errors}
            onChange={handleChange}
          />
        </div>
      )}

      <div className="flex flex-col gap-6">
        <SectionDivider index="03" />
        <div className="flex flex-col gap-2">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-ink/70">
            Contact Details
          </h2>
          <div className="mt-1 grid gap-x-6 gap-y-5 sm:grid-cols-2">
            {CONTACT_FIELDS.map((field) => (
              <FieldShell
                key={field.name}
                name={field.name}
                label={field.label}
                required
                error={errors[field.name]}
              >
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  autoComplete={field.autoComplete}
                  value={values[field.name]}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors[field.name])}
                  aria-describedby={
                    errors[field.name] ? `${field.name}-error` : undefined
                  }
                  className={fieldControlClasses}
                />
              </FieldShell>
            ))}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={submitStatus === "submitting"}
        className="group mt-2 flex w-fit items-center gap-2.5 self-start rounded-[0.7rem] bg-ink px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-surface transition-all duration-200 ease-out hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
      >
        <span>
          {submitStatus === "submitting"
            ? "Sending…"
            : "Request a Turnkey Quotation"}
        </span>
        {submitStatus === "submitting" ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <ArrowUpRight
            className="h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        )}
      </button>

      <StatusPanel status={submitStatus} />
    </form>
  );
}
