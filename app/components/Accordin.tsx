import { useState } from 'react';

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  icon?: string;
  score?: string;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpen?: string[];
}

export default function Accordion({ 
  items, 
  allowMultiple = false, 
  defaultOpen = [] 
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>(defaultOpen);

  const toggleItem = (id: string) => {
    setOpenItems(prev => {
      if (allowMultiple) {
        return prev.includes(id) 
          ? prev.filter(item => item !== id)
          : [...prev, id];
      } else {
        return prev.includes(id) ? [] : [id];
      }
    });
  };

  const isOpen = (id: string) => openItems.includes(id);

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md"
        >
          {/* Header */}
          <button
            onClick={() => toggleItem(item.id)}
            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors duration-150 focus:outline-none"
          >
            <div className="flex items-center gap-3">
              {item.icon && (
                <div className="p-2 rounded-lg bg-primary-50">
                  <img 
                    src={item.icon} 
                    alt="" 
                    className="w-4 h-4"
                  />
                </div>
              )}
              <h3 className="font-semibold text-primary-900 text-lg">
                {item.title}
              </h3>
            </div>
            
            <div className="flex items-center gap-3">
              {item.score && (
                <div className="px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-sm font-semibold">
                  {item.score}
                </div>
              )}
              <div className={`transform transition-transform duration-200 ${
                isOpen(item.id) ? 'rotate-180' : 'rotate-0'
              }`}>
                <svg 
                  className="w-5 h-5 text-primary-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M19 9l-7 7-7-7" 
                  />
                </svg>
              </div>
            </div>
          </button>

          {/* Content */}
          <div className={`transition-all duration-300 ease-in-out ${
            isOpen(item.id) 
              ? 'max-h-none opacity-100' 
              : 'max-h-0 opacity-0'
          } ${isOpen(item.id) ? 'overflow-visible' : 'overflow-hidden'}`}>
            <div className="px-6 pb-4 pt-2 border-t border-neutral-100">
              <div className="text-neutral-700 leading-relaxed">
                {item.content}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
