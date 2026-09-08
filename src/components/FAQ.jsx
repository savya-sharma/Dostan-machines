import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    value: "machinery",
    question: "What types of machinery does DOSTAN manufacture?",
    answer:
      "We manufacture food and dairy processing machinery, including pasteurizers, homogenizers, continuous freezers, cooling towers, and plate heat exchangers.",
  },
  {
    value: "custom-design",
    question: "Can DOSTAN design machinery according to our production requirements?",
    answer:
      "Yes. Every machine is engineered around your specific production goals, product type, and capacity.",
  },
  {
    value: "installation",
    question: "Does DOSTAN provide installation and commissioning?",
    answer:
      "Yes, our team handles installation and commissioning on-site until your line reaches successful production.",
  },
  {
    value: "industries",
    question: "What industries does DOSTAN serve?",
    answer:
      "We primarily serve the food, dairy, and beverage processing industries, along with related manufacturing sectors.",
  },
  {
    value: "contact",
    question: "How can I discuss my machinery requirements with DOSTAN?",
    answer:
      "You can reach our team directly through the contact details in the footer to discuss your requirements.",
  },
];

export default function FAQ() {
  return (
    <div id="faq" className="px-[2rem] py-[6rem]">
      <div className="flex flex-col gap-8 sm:flex-row">
        <h1 className="text-3xl leading-tight sm:w-1/4 sm:text-4xl lg:text-5xl">
          Frequent Ask Questions
        </h1>

        <Accordion defaultValue={["machinery"]} className="max-w-lg">
          {FAQS.map((faq) => (
            <AccordionItem key={faq.value} value={faq.value}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
