export const metadata = {
  title: "Cookie Policy — YAS Architecture",
};

export default function CoockieSolutionPage() {
  return (
    <div className="pt-[60px] md:pt-[80px]">
      <div className="page-px py-[40px] md:py-[60px]">
        <h1 className="text-[36px] md:text-[48px] font-bold leading-[1.3] text-black mb-[40px]">
          Cookie Policy
        </h1>

        <div className="max-w-[798px] text-[16px] md:text-[17.5px] leading-[1.6] text-black space-y-6">
          <section>
            <h2 className="text-[24px] font-semibold text-black mb-3">Cosa sono i Cookie?</h2>
            <p>
              I cookie sono piccoli file di testo memorizzati sul tuo dispositivo quando visiti il nostro sito web. Ci aiutano a migliorare la tua esperienza di navigazione.
            </p>
          </section>

          <section>
            <h2 className="text-[24px] font-semibold text-black mb-3">Tipi di Cookie che Utilizziamo</h2>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li><strong>Cookie Essenziali:</strong> Necessari per il funzionamento del sito (sicurezza, sessioni)</li>
              <li><strong>Cookie Analitici:</strong> Ci aiutano a capire come usi il nostro sito (Google Analytics)</li>
              <li><strong>Cookie di Preferenza:</strong> Ricordano le tue impostazioni e preferenze</li>
              <li><strong>Cookie di Marketing:</strong> Utilizzati per personalizzare annunci e contenuti</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[24px] font-semibold text-black mb-3">Come Gestire i Cookie</h2>
            <p>Puoi controllare i cookie nelle seguenti modalità:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Tramite il nostro banner di consenso al primo accesso</li>
              <li>Tramite le impostazioni del tuo browser web</li>
              <li>Tramite la pagina di gestione delle preferenze Cookie</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[24px] font-semibold text-black mb-3">Cookie di Terze Parti</h2>
            <p>
              Il nostro sito utilizza servizi di terze parti come Google Analytics. Ti consigliamo di consultare le loro politiche sulla privacy:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-60">
                  Google Analytics Privacy Policy
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-[24px] font-semibold text-black mb-3">Modifiche a Questa Policy</h2>
            <p>
              Potremmo aggiornare questa Cookie Policy periodicamente. Ti consigliamo di controllarla regolarmente per rimanere informato su come utilizziamo i cookie.
            </p>
          </section>

          <section>
            <h2 className="text-[24px] font-semibold text-black mb-3">Contatti</h2>
            <p>
              Per domande sui cookie o sulla nostra Cookie Policy, contattaci a{" "}
              <a href="mailto:studio@yas-arc.com" className="underline hover:opacity-60">
                studio@yas-arc.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
