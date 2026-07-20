export const metadata = {
  title: "Privacy Policy — YAS Architecture",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-[60px] md:pt-[80px]">
      <div className="page-px py-[40px] md:py-[60px]">
        <h1 className="text-[36px] md:text-[48px] font-bold leading-[1.3] text-black mb-[40px]">
          Privacy Policy
        </h1>

        <div className="max-w-[798px] text-[16px] md:text-[17.5px] leading-[1.6] text-black space-y-6">
          <section>
            <h2 className="text-[24px] font-semibold text-black mb-3">1. Introduzione</h2>
            <p>
              YAS Architecture Associati ("Studio", "noi", "nostro/a") rispetta la tua privacy e è impegnato nella protezione dei tuoi dati personali. Questa Informativa sulla privacy spiega come raccogliamo, utilizziamo e proteggiamo i tuoi dati personali quando visiti il nostro sito web.
            </p>
          </section>

          <section>
            <h2 className="text-[24px] font-semibold text-black mb-3">2. Dati che Raccogliamo</h2>
            <p>Raccogliamo i seguenti tipi di dati personali:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Informazioni di contatto (nome, email, telefono)</li>
              <li>Informazioni sul progetto (descrizione, requisiti)</li>
              <li>Dati di navigazione (cookie, IP, browser)</li>
              <li>Messaggi e comunicazioni che ci invii</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[24px] font-semibold text-black mb-3">3. Come Utilizziamo i Tuoi Dati</h2>
            <p>Utilizziamo i tuoi dati personali per:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Rispondere alle tue richieste di informazioni</li>
              <li>Valutare progetti e proporre soluzioni</li>
              <li>Migliorare il nostro sito web e i servizi</li>
              <li>Conformarsi agli obblighi legali</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[24px] font-semibold text-black mb-3">4. Base Legale</h2>
            <p>
              Il trattamento dei tuoi dati personali si basa sul tuo consenso esplicito fornito tramite il nostro modulo di contatto e la nostra informativa sui cookie.
            </p>
          </section>

          <section>
            <h2 className="text-[24px] font-semibold text-black mb-3">5. Diritti dell'Utente</h2>
            <p>Hai diritto a:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Accedere ai tuoi dati personali</li>
              <li>Rettificare dati inesatti</li>
              <li>Richiedere la cancellazione dei dati</li>
              <li>Opporsi al trattamento dei dati</li>
            </ul>
            <p className="mt-3">
              Per esercitare questi diritti, contattaci a{" "}
              <a href="mailto:studio@yas-arc.com" className="underline hover:opacity-60">
                studio@yas-arc.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-[24px] font-semibold text-black mb-3">6. Contatti</h2>
            <p>
              Per domande sulla nostra Privacy Policy, contattaci a{" "}
              <a href="mailto:studio@yas-arc.com" className="underline hover:opacity-60">
                studio@yas-arc.com
              </a>
            </p>
            <p className="mt-2">
              Piazza Marco Antonio Cavalerio, 21<br />
              72100 Brindisi (BR) Italia
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
