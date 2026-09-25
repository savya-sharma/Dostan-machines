// Re-exports the canonical machine catalogue (src/data/machines.js) under
// this project's existing @/lib import path, so components that already
// import from here (e.g. QuotationForm) keep working unchanged.
export { MACHINES, findMachineBySlug, slugifyMachineName } from "@/data/machines";
