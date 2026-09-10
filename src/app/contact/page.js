import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Contact Us | Dostan Machines",
};

export default function ContactPage() {
  return (
    <div className="px-[2rem] py-[6rem]">
      <h1 className="text-3xl leading-tight sm:text-4xl lg:text-5xl">
        Contact Us
      </h1>

      <div className="mt-[2rem] flex flex-col items-start gap-4 text-sm">
        <a
          href="tel:+918510027111"
          className="underline transition-colors hover:text-accent"
        >
          +91 8510027111 | +91 9266767144
        </a>
        <a
          href="mailto:dostanmachines@gmail.com"
          className="transition-colors hover:text-accent"
        >
          dostanmachines@gmail.com
        </a>
        <span className="max-w-xs underline">
          Plot No. 181, Udyog Kendra-1, Ecotech-III, Greater Noida, Gautam
          Buddha Nagar, Uttar Pradesh – 201306
        </span>
      </div>

      <ContactForm />
    </div>
  );
}
