
export interface NavItem {
  id: string;
  number: string;
  title: string;
}

interface NavigationProps {
  items: NavItem[];
  activeIndex: number;
  canNavigate: (index: number) => boolean;
  onNavigate: (index: number) => void;
}

export default function Navigation({ items, activeIndex, canNavigate, onNavigate }: NavigationProps) {
  return (
    <>
      {/* Top bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 sm:px-10 sm:py-5 flex items-center justify-between pointer-events-none">
        <a href="./index.html" aria-label="Terug naar de homepage" className="font-display text-xs sm:text-sm tracking-[0.25em] text-white/70 uppercase pointer-events-auto hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">
          Visuals bij leesautobiografie
        </a>
        <div className="hidden md:flex gap-6 lg:gap-8 pointer-events-auto">
          {items.map((item, i) => (
            <button
              key={item.id}
              onClick={() => onNavigate(i)}
              disabled={!canNavigate(i)}
              aria-current={activeIndex === i ? 'step' : undefined}
              className={`group disabled:opacity-25 disabled:cursor-not-allowed flex items-center gap-2 text-xs lg:text-sm tracking-wide transition-all duration-500 ${
                activeIndex === i ? 'text-white' : 'text-white/40 hover:text-white/70'
              }`}
            >
              <span className="font-display tabular-nums">{item.number}</span>
              <span className="hidden lg:inline font-serif-c italic">{item.title}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Side dots */}
      <div className="fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4">
        {items.map((item, i) => (
          <button
            key={item.id}
            onClick={() => onNavigate(i)}
              disabled={!canNavigate(i)}
              aria-current={activeIndex === i ? 'step' : undefined}
            aria-label={item.title}
            className="group disabled:opacity-25 disabled:cursor-not-allowed relative flex items-center"
          >
            <span
              className={`block rounded-full transition-all duration-500 ${
                activeIndex === i
                  ? 'w-3 h-3 bg-white ring-4 ring-white/20'
                  : 'w-2 h-2 bg-white/30 group-hover:bg-white/60'
              }`}
            />
            <span className="absolute right-6 whitespace-nowrap text-xs font-serif-c italic text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full">
              {item.number} — {item.title}
            </span>
          </button>
        ))}
      </div>
    </>
  );
}
