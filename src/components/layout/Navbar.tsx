// Figma node Design System: 206:1387 (Desktop) | 255:1751 (Mobile)
// TODO: implementa da get_design_context
export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-[53px] bg-white border-b border-gray-100">
      <nav className="max-w-[1440px] mx-auto px-8 h-full flex items-center justify-between">
        <div className="flex gap-8 text-sm">
          <a href="/progetti">Progetti</a>
          <a href="/studio">Studio</a>
          <a href="/team">Team</a>
          <a href="/eventi">Eventi</a>
        </div>
        <a href="/" className="absolute left-1/2 -translate-x-1/2 font-semibold tracking-widest text-sm">
          YAS
        </a>
        <div className="flex gap-4 items-center text-sm">
          <a href="/contatti">Contatti</a>
          <span>IT</span>
        </div>
      </nav>
    </header>
  );
}
