import type { Metadata } from 'next'
import Link from 'next/link'
import { siteContent } from '@/lib/site-content'

export const metadata: Metadata = {
  title: 'Polityka Prywatności i RODO',
  description:
    'Zasady przetwarzania danych osobowych (RODO) oraz wykorzystywania plików cookies w serwisie Maleszyk.Media.',
}

export default function PrivacyPolicyPage() {
  const email = siteContent.aboutMe.contact.email
  const phone = siteContent.aboutMe.contact.phone

  return (
    <main className="section-dark-bg min-h-screen px-6 py-28 text-warm-white/90 sm:py-32 lg:px-20">
      <div className="mx-auto max-w-4xl">
        {/* Breadcrumb / Back button */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-khaki transition-colors hover:text-warm-white"
          >
            <span aria-hidden="true">←</span> Wróć do strony głównej
          </Link>
        </div>

        {/* Header */}
        <header className="mb-12 border-b border-warm-gray/15 pb-8">
          <span className="font-mono text-xs uppercase tracking-widest text-khaki">
            Ochrona danych i prywatność
          </span>
          <h1 className="mt-2 font-bebas text-4xl uppercase tracking-wide text-warm-white sm:text-5xl lg:text-6xl">
            Polityka Prywatności i Informacja RODO
          </h1>
          <p className="mt-3 font-mono text-xs text-warm-gray sm:text-sm">
            Ostatnia aktualizacja: {new Date().toLocaleDateString('pl-PL', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </header>

        {/* Content sections */}
        <div className="space-y-10 font-inter text-sm leading-relaxed text-warm-white/80 sm:text-base">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="font-bebas text-2xl uppercase tracking-wide text-warm-white sm:text-3xl">
              1. Administrator Danych Osobowych
            </h2>
            <p>
              Administratorem Twoich danych osobowych w rozumieniu Rozporządzenia Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. (RODO) jest:
            </p>
            <div className="rounded-sm border border-warm-gray/15 bg-white/[0.02] p-4 font-mono text-xs text-warm-white/90 sm:text-sm">
              <p className="font-semibold text-khaki">Maleszyk.Media — Przemysław Maleszyk</p>
              <p className="mt-1">E-mail do kontaktu: <a href={`mailto:${email}`} className="text-khaki hover:underline">{email}</a></p>
              <p>Telefon: <a href={`tel:${phone.replace(/\s/g, '')}`} className="text-khaki hover:underline">{phone}</a></p>
              <p>Działalność realizowana na terenie: Rzeczpospolita Polska oraz projekty międzynarodowe</p>
            </div>
            <p className="text-xs text-warm-gray sm:text-sm">
              W sprawach związanych z ochroną danych osobowych możesz skontaktować się bezpośrednio pod adresem e-mail wskazanym powyżej.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="font-bebas text-2xl uppercase tracking-wide text-warm-white sm:text-3xl">
              2. Jakie dane zbieramy i skąd je posiadamy?
            </h2>
            <p>
              Dane pozyskujemy bezpośrednio od Ciebie, kiedy:
            </p>
            <ul className="list-inside list-disc space-y-1 pl-2 text-warm-white/75">
              <li>Kontaktujesz się ze mną przez pocztę e-mail, telefon, WhatsApp lub formularze / wiadomości w mediach społecznościowych,</li>
              <li>Przesyłasz zapytanie o ofertę, wycenę projektu wideo lub rezerwację terminu sesji,</li>
              <li>Zawierasz ze mną umowę na realizację usług fotograficznych, wideo lub montażowych.</li>
            </ul>
            <p>
              Zakres przetwarzanych danych może obejmować: imię i nazwisko, adres e-mail, numer telefonu, treść wiadomości, ewentualnie dane firmy (w tym NIP) potrzebne do wystawienia faktury lub przygotowania umowy.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="font-bebas text-2xl uppercase tracking-wide text-warm-white sm:text-3xl">
              3. Cele i podstawy prawne przetwarzania danych (RODO)
            </h2>
            <p>Twoje dane osobowe przetwarzane są w następujących celach:</p>
            <div className="space-y-3">
              <div className="border-l-2 border-khaki/60 pl-4">
                <p className="font-semibold text-warm-white">Obsługa zapytań i przygotowanie oferty</p>
                <p className="text-xs text-warm-gray sm:text-sm">
                  <strong>Podstawa prawna:</strong> art. 6 ust. 1 lit. b RODO (podjęcie działań na żądanie osoby przed zawarciem umowy) lub art. 6 ust. 1 lit. f RODO (prawnie uzasadniony interes Administratora polegający na budowaniu relacji z klientami i odpowiadaniu na zapytania).
                </p>
              </div>

              <div className="border-l-2 border-khaki/60 pl-4">
                <p className="font-semibold text-warm-white">Zawarcie i realizacja umowy na usługi wideo/foto</p>
                <p className="text-xs text-warm-gray sm:text-sm">
                  <strong>Podstawa prawna:</strong> art. 6 ust. 1 lit. b RODO (niezbędność do wykonania umowy, której stroną jest osoba, której dane dotyczą).
                </p>
              </div>

              <div className="border-l-2 border-khaki/60 pl-4">
                <p className="font-semibold text-warm-white">Rozliczenia księgowe i podatkowe</p>
                <p className="text-xs text-warm-gray sm:text-sm">
                  <strong>Podstawa prawna:</strong> art. 6 ust. 1 lit. c RODO (wypełnienie obowiązku prawnego ciążącego na Administratorze, m.in. ustawy o rachunkowości oraz przepisów podatkowych).
                </p>
              </div>

              <div className="border-l-2 border-khaki/60 pl-4">
                <p className="font-semibold text-warm-white">Obrona przed roszczeniami lub ich dochodzenie</p>
                <p className="text-xs text-warm-gray sm:text-sm">
                  <strong>Podstawa prawna:</strong> art. 6 ust. 1 lit. f RODO (prawnie uzasadniony interes Administratora).
                </p>
              </div>

              <div className="border-l-2 border-khaki/60 pl-4">
                <p className="font-semibold text-warm-white">Publikacja wizerunku i materiałów w portfolio</p>
                <p className="text-xs text-warm-gray sm:text-sm">
                  <strong>Podstawa prawna:</strong> art. 6 ust. 1 lit. a RODO (dobrowolna, wyraźna zgoda wyrażona w umowie lub osobnym oświadczeniu).
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="font-bebas text-2xl uppercase tracking-wide text-warm-white sm:text-3xl">
              4. Odbiorcy danych
            </h2>
            <p>
              Dane mogą być przekazywane wyłącznie zaufanym podmiotom wspierającym realizację usług:
            </p>
            <ul className="list-inside list-disc space-y-1 pl-2 text-warm-white/75">
              <li>Dostawcom usług hostingowych i serwerowych utrzymującym serwis internetowy,</li>
              <li>Operatorom poczty elektronicznej i systemów łączności,</li>
              <li>Biuru rachunkowo-księgowemu (w przypadku wystawiania dokumentów sprzedaży),</li>
              <li>Organom publicznym, jeżeli taki obowiązek wynika z bezwzględnie obowiązujących przepisów prawa.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="font-bebas text-2xl uppercase tracking-wide text-warm-white sm:text-3xl">
              5. Okres przechowywania danych
            </h2>
            <p>
              Twoje dane osobowe będą przechowywane przez okres:
            </p>
            <ul className="list-inside list-disc space-y-1 pl-2 text-warm-white/75">
              <li>Trwania kontaktu lub negocjacji oferty — a po ich zakończeniu do 12 miesięcy w celach archiwalnych,</li>
              <li>Trwania umowy oraz po jej zakończeniu przez czas wymagany przepisami prawa podatkowego (5 lat od końca roku kalendarzowego),</li>
              <li>Do upływu okresu przedawnienia ewentualnych roszczeń wynikających z umowy,</li>
              <li>W przypadku zgody na publikację wizerunku w portfolio — do momentu ewentualnego wycofania udzielonej zgody.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="font-bebas text-2xl uppercase tracking-wide text-warm-white sm:text-3xl">
              6. Twoje prawa zgodnie z RODO
            </h2>
            <p>W związku z przetwarzaniem Twoich danych osobowych przysługuje Ci:</p>
            <ul className="grid grid-cols-1 gap-2 pt-1 sm:grid-cols-2">
              <li className="rounded-sm border border-warm-gray/10 bg-white/[0.01] p-3">
                <span className="font-semibold text-khaki">Prawo dostępu do danych</span>
                <p className="mt-1 text-xs text-warm-gray">Możliwość uzyskania informacji o tym, jakie dane przetwarzamy i otrzymania ich kopii.</p>
              </li>
              <li className="rounded-sm border border-warm-gray/10 bg-white/[0.01] p-3">
                <span className="font-semibold text-khaki">Prawo do sprostowania</span>
                <p className="mt-1 text-xs text-warm-gray">Możliwość poprawienia danych, jeśli są nieprawidłowe lub niekompletne.</p>
              </li>
              <li className="rounded-sm border border-warm-gray/10 bg-white/[0.01] p-3">
                <span className="font-semibold text-khaki">Prawo do usunięcia („bycia zapomnianym”)</span>
                <p className="mt-1 text-xs text-warm-gray">Żądanie usunięcia danych, o ile nie ma prawnego obowiązku ich dalszego przechowywania.</p>
              </li>
              <li className="rounded-sm border border-warm-gray/10 bg-white/[0.01] p-3">
                <span className="font-semibold text-khaki">Prawo do ograniczenia i sprzeciwu</span>
                <p className="mt-1 text-xs text-warm-gray">Możliwość wniesienia sprzeciwu wobec przetwarzania opartego na prawnie uzasadnionym interesie.</p>
              </li>
            </ul>
            <p className="pt-2 text-xs text-warm-gray sm:text-sm">
              W przypadku uznania, że przetwarzanie danych narusza przepisy RODO, masz również prawo wniesienia skargi do organu nadzorczego — <strong>Prezesa Urzędu Ochrony Danych Osobowych (UODO)</strong>, ul. Stawki 2, 00-193 Warszawa.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="font-bebas text-2xl uppercase tracking-wide text-warm-white sm:text-3xl">
              7. Pliki Cookies, SessionStorage i technologie przeglądarki
            </h2>
            <p>
              Strona internetowa stosuje mechanizmy pamięci podręcznej przeglądarki (np. <code className="rounded bg-white/10 px-1 py-0.5 text-xs text-khaki">sessionStorage</code>) wyłącznie w celach technicznych:
            </p>
            <ul className="list-inside list-disc space-y-1 pl-2 text-warm-white/75">
              <li>Prawidłowe wyświetlanie strony oraz zapamiętywanie stanu animacji powitalnej (intro/preloader) w ramach jednej sesji, aby nie utrudniać przeglądania serwisu,</li>
              <li>Optymalizacja wydajności renderowania treści audiowizualnych.</li>
            </ul>
            <p>
              W przypadku odtwarzania osadzonych materiałów z serwisu YouTube (np. poprzez kliknięcie miniatury wideo), serwis YouTube (Google Ireland Ltd.) może stosować własne pliki cookies i identyfikatory na zasadach określonych w ich polityce prywatności.
            </p>
            <p className="text-xs text-warm-gray sm:text-sm">
              Możesz w każdej chwili zmienić ustawienia dotyczące plików cookies lub wyczyścić pamięć podręczną bezpośrednio w opcjach swojej przeglądarki internetowej.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-3 border-t border-warm-gray/15 pt-8">
            <h2 className="font-bebas text-2xl uppercase tracking-wide text-warm-white sm:text-3xl">
              8. Zmiany w Polityce Prywatności
            </h2>
            <p>
              Polityka Prywatności może być okresowo aktualizowana w celu dostosowania jej do zmian prawnych, technologicznych lub organizacyjnych. Aktualna wersja dokumentu jest zawsze dostępna pod adresem tej podstrony.
            </p>
          </section>
        </div>

        {/* Back CTA */}
        <div className="mt-14 border-t border-warm-gray/15 pt-8">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-micro border border-khaki/30 bg-khaki/10 px-6 py-3 font-mono text-xs uppercase tracking-wider text-khaki transition-colors hover:border-khaki hover:bg-khaki hover:text-black-deep"
          >
            Masz pytania? Skontaktuj się
          </Link>
        </div>
      </div>
    </main>
  )
}
