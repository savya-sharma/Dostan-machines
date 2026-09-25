// Single source of truth for the business WhatsApp number. Update here only —
// every WhatsApp link in the app should be built through the helpers below.
export const WHATSAPP_NUMBER = "919266767144";

const DEFAULT_MESSAGE =
  "Hi DOSTAN Machines, I'd like to discuss my machinery requirement.";

export function getWhatsAppLink(message = DEFAULT_MESSAGE) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function getMachineWhatsAppLink(machineName) {
  return getWhatsAppLink(
    `Hi DOSTAN Machines, I'd like to enquire about the ${machineName}.`
  );
}
