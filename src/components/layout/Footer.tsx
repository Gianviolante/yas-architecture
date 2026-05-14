// TODO: implementa da get_design_context del footer Figma (node 261:6646)
export default function Footer() {
  return (
    <footer className="border-t border-gray-100 py-12 px-8">
      <div className="max-w-[1440px] mx-auto grid grid-cols-4 gap-8 text-sm text-gray-600">
        <div>
          <p className="font-medium text-black mb-2">YAS Architecture srl</p>
          <p>Via Dè Gracchi, 47</p>
          <p>72100 Brindisi (BR) Italia</p>
          <p>T +39 351 531 7762</p>
          <p>info@yas-arch.com</p>
        </div>
        <div>
          <p className="font-medium text-black mb-2">Contatti</p>
          <p>Informazioni generali</p>
          <p>info@yas-arch.com</p>
          <p>Informazioni commerciali</p>
          <p>sales@yas-arch.org</p>
        </div>
        <div>
          <p className="font-medium text-black mb-2">Studio</p>
          <a href="/team" className="block">Team</a>
          <a href="/progetti" className="block">Progetti</a>
          <a href="/eventi" className="block">Eventi</a>
          <a href="#" className="block">Press</a>
        </div>
        <div>
          <p className="font-medium text-black mb-2">Seguici su</p>
          <div className="flex gap-3">
            <a href="#">Fb</a>
            <a href="#">Ig</a>
            <a href="#">In</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
