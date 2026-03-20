"use client"

import { useState } from "react"

interface FAQItem {
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    question: "Qu'est-ce qu'Outreach Machine et a qui s'adresse-t-il ?",
    answer:
      "Outreach Machine est un outil d'automatisation d'emails a froid construit pour Uprising Studio. Il est parfait pour les equipes commerciales, les agences et les startups qui souhaitent automatiser leur prospection tout en gardant un controle humain.",
  },
  {
    question: "Comment fonctionne la generation d'emails avec Claude AI ?",
    answer:
      "Notre plateforme utilise l'API Claude d'Anthropic pour generer des emails ultra-personnalises a partir des informations de vos leads. Chaque email est unique et adapte au contexte du prospect.",
  },
  {
    question: "Puis-je integrer Outreach Machine avec mes outils existants ?",
    answer:
      "Oui ! Outreach Machine s'integre avec Brevo (anciennement Sendinblue) pour l'envoi SMTP gratuit. Vous pouvez aussi importer vos leads via CSV depuis n'importe quel CRM ou spreadsheet.",
  },
  {
    question: "Comment fonctionne la validation humaine ?",
    answer:
      "Avant tout envoi, vous pouvez revoir et modifier chaque email genere par l'IA. Cela vous permet de garder un controle total sur vos communications et d'assurer la qualite de chaque message.",
  },
  {
    question: "Mes donnees sont-elles securisees ?",
    answer:
      "Absolument. Nous utilisons des mesures de securite de niveau entreprise incluant le chiffrement de bout en bout. Vos donnees de leads et vos emails restent confidentiels.",
  },
  {
    question: "Comment commencer avec Outreach Machine ?",
    answer:
      "C'est simple ! Inscrivez-vous gratuitement, importez vos premiers leads via CSV ou saisie manuelle, configurez votre prompt IA, et commencez a generer des emails personnalises en quelques minutes.",
  },
]

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  return (
    <div className="w-full flex justify-center items-start">
      <div className="flex-1 px-4 md:px-12 py-16 md:py-20 flex flex-col lg:flex-row justify-start items-start gap-6 lg:gap-12">
        {/* Left Column - Header */}
        <div className="w-full lg:flex-1 flex flex-col justify-center items-start gap-4 lg:py-5">
          <div className="w-full flex flex-col justify-center text-[#49423D] font-semibold leading-tight md:leading-[44px] font-sans text-4xl tracking-tight">
            Questions frequentes
          </div>
          <div className="w-full text-[#605A57] text-base font-normal leading-7 font-sans">
            Tout ce que vous devez savoir sur
            <br className="hidden md:block" />
            Outreach Machine et son fonctionnement.
          </div>
        </div>

        {/* Right Column - FAQ Items */}
        <div className="w-full lg:flex-1 flex flex-col justify-center items-center">
          <div className="w-full flex flex-col">
            {faqData.map((item, index) => {
              const isOpen = openItems.includes(index)

              return (
                <div key={index} className="w-full border-b border-[rgba(73,66,61,0.16)] overflow-hidden">
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full px-5 py-[18px] flex justify-between items-center gap-5 text-left hover:bg-[rgba(73,66,61,0.02)] transition-colors duration-200"
                    aria-expanded={isOpen}
                  >
                    <div className="flex-1 text-[#49423D] text-base font-medium leading-6 font-sans">
                      {item.question}
                    </div>
                    <div className="flex justify-center items-center">
                      <ChevronDownIcon
                        className={`w-6 h-6 text-[rgba(73,66,61,0.60)] transition-transform duration-300 ease-in-out ${
                          isOpen ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </div>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-5 pb-[18px] text-[#605A57] text-sm font-normal leading-6 font-sans">
                      {item.answer}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
