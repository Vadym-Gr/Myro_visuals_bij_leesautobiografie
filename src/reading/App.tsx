import Navigation, { type NavItem } from '@/components/Navigation';
import LittlePrinceSection from '@/components/sections/LittlePrinceSection';
import HarryPotterSection from '@/components/sections/HarryPotterSection';
import ShadowsSection from '@/components/sections/ShadowsSection';
import RulesSection from '@/components/sections/RulesSection';
import { SceneProgressContext } from '@/hooks/useScrollProgress';
import { useScenePlayback } from '@/hooks/useScenePlayback';

const navItems: NavItem[] = [
  { id: 'little-prince', number: '01', title: 'De kleine prins' },
  { id: 'harry-potter', number: '02', title: 'Harry Potter' },
  { id: 'shadows', number: '03', title: 'Schaduwen van vergeten voorouders' },
  { id: 'rules', number: '04', title: 'De regels van alles' },
];
const scenes = [LittlePrinceSection, HarryPotterSection, ShadowsSection, RulesSection];

function App() {
  const { activeIndex, progress, navigate, canNavigate, isPaused, togglePaused } = useScenePlayback(scenes.length);
  const Scene = activeIndex < scenes.length ? scenes[activeIndex] : undefined;

  return (
    <div data-paused={isPaused} className="scene-player relative w-full bg-[#05060a]">
      <Navigation items={navItems} activeIndex={activeIndex} canNavigate={canNavigate} onNavigate={navigate} />
      <main>
        <SceneProgressContext.Provider value={progress}>
          {Scene ? <Scene /> : (
            <div className="flex h-dvh flex-col items-center justify-center gap-5 px-6 text-center">
              <h1 className="font-display text-3xl">Visuals bij leesautobiografie</h1>
              <p className="font-serif-c text-xl text-white/60">Een interactief literair kunstproject</p>
              <p className="font-serif-c text-lg text-white/70">v. Myroslav Hryshchenko</p>
              <div className="flex flex-col items-center gap-3 sm:flex-row">
                <button className="rounded-full border border-white/30 px-6 py-3 hover:bg-white/10" onClick={() => navigate(0)}>
                  Opnieuw beleven
                </button>
                <a
                  href="./index.html"
                  className="rounded-full border border-white/30 px-6 py-3 text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                >
                  <span aria-hidden="true">← </span>Terug naar de homepage
                </a>
              </div>
            </div>
          )}
        </SceneProgressContext.Provider>
      </main>
      {Scene && (
        <div className="absolute bottom-6 left-1/2 z-20 w-52 -translate-x-1/2 text-center">
          <div role="progressbar" aria-label="Voortgang van de animatie" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)} className="mb-3 h-0.5 overflow-hidden rounded bg-white/20">
            <div className="h-full origin-left bg-white/70" style={{ transform: `scaleX(${progress})` }} />
          </div>
          <button
            type="button"
            onClick={togglePaused}
            aria-label={isPaused ? 'Automatisch afspelen hervatten' : 'Automatisch afspelen pauzeren'}
            className="mb-2 min-h-11 rounded-full border border-white/30 bg-black/30 px-5 py-2 text-xs text-white/90 backdrop-blur-sm hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            {isPaused ? 'Verder afspelen' : 'Pauzeren'}
          </button>
          {progress === 1 ? (
            <button className="text-xs text-white/80 hover:text-white" onClick={() => navigate(activeIndex + 1)}>
              {activeIndex === scenes.length - 1 ? 'Afronden' : 'Volgend hoofdstuk'} →
            </button>
          ) : (
            <p className="text-xs text-white/60">{isPaused ? 'Neem rustig de tijd om te lezen' : 'De hoofdstukken spelen automatisch af'}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
