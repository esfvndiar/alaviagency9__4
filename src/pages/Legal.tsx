import React, { useState } from 'react';
import ScrollReveal from '../components/ScrollReveal';
import Layout from '../components/Layout';

const Legal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'datenschutz' | 'impressum'>('datenschutz');

  return (
    <Layout>
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          <ScrollReveal>
            <h1 className="text-3xl md:text-4xl font-display font-medium mb-8 text-zinc-900 dark:text-white">Rechtliche Informationen</h1>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <div className="mb-8 border-b border-zinc-200 dark:border-zinc-700">
              <div className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('datenschutz')}
                  className={`pb-4 relative ${
                    activeTab === 'datenschutz'
                      ? 'text-primary dark:text-primary-foreground font-medium'
                      : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  Datenschutzerklärung
                  {activeTab === 'datenschutz' && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary dark:bg-primary-foreground"></span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('impressum')}
                  className={`pb-4 relative ${
                    activeTab === 'impressum'
                      ? 'text-primary dark:text-primary-foreground font-medium'
                      : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  Impressum
                  {activeTab === 'impressum' && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary dark:bg-primary-foreground"></span>
                  )}
                </button>
              </div>
            </div>

            {activeTab === 'datenschutz' && (
              <div className="prose prose-zinc dark:prose-invert max-w-none">
                <h2>1. Datenschutz auf einen Blick</h2>
                
                <h3 className="text-zinc-800 dark:text-zinc-200">Allgemeine Hinweise</h3>
                <p className="text-zinc-700 dark:text-zinc-300">
                  Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, 
                  wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert 
                  werden können.
                </p>

                <h3 className="text-zinc-800 dark:text-zinc-200">Datenerfassung auf dieser Website</h3>
                <p className="text-zinc-700 dark:text-zinc-300">
                  <strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong><br />
                  Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten 
                  können Sie dem Impressum dieser Website entnehmen.
                </p>

                <h3 className="text-zinc-800 dark:text-zinc-200">Wie erfassen wir Ihre Daten?</h3>
                <p className="text-zinc-700 dark:text-zinc-300">
                  Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z. B. um Daten handeln, 
                  die Sie in ein Kontaktformular eingeben.
                </p>
                <p className="text-zinc-700 dark:text-zinc-300">
                  Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website durch unsere IT-Systeme erfasst. 
                  Das sind vor allem technische Daten (z. B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs). 
                  Die Erfassung dieser Daten erfolgt automatisch, sobald Sie diese Website betreten.
                </p>

                <h3 className="text-zinc-800 dark:text-zinc-200">Wofür nutzen wir Ihre Daten?</h3>
                <p className="text-zinc-700 dark:text-zinc-300">
                  Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu gewährleisten. 
                  Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet werden.
                </p>

                <h3 className="text-zinc-800 dark:text-zinc-200">Welche Rechte haben Sie bezüglich Ihrer Daten?</h3>
                <p className="text-zinc-700 dark:text-zinc-300">
                  Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten 
                  personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung oder Löschung dieser Daten zu verlangen. 
                  Wenn Sie eine Einwilligung zur Datenverarbeitung erteilt haben, können Sie diese Einwilligung jederzeit für die Zukunft widerrufen.
                </p>

                <h2 className="text-zinc-800 dark:text-zinc-200">2. Cookies</h2>
                <p className="text-zinc-700 dark:text-zinc-300">
                  Unsere Internetseiten verwenden teilweise so genannte Cookies. Cookies richten auf Ihrem Rechner keinen Schaden an und enthalten 
                  keine Viren. Cookies dienen dazu, unser Angebot nutzerfreundlicher, effektiver und sicherer zu machen. Cookies sind kleine Textdateien, 
                  die auf Ihrem Rechner abgelegt werden und die Ihr Browser speichert.
                </p>
                <p className="text-zinc-700 dark:text-zinc-300">
                  Sie können Ihren Browser so einstellen, dass Sie über das Setzen von Cookies informiert werden und Cookies nur im Einzelfall erlauben, 
                  die Annahme von Cookies für bestimmte Fälle oder generell ausschließen sowie das automatische Löschen der Cookies beim Schließen des 
                  Browsers aktivieren. Bei der Deaktivierung von Cookies kann die Funktionalität dieser Website eingeschränkt sein.
                </p>

                <h2 className="text-zinc-800 dark:text-zinc-200">3. Datenerfassung auf dieser Website</h2>

                <h3 className="text-zinc-800 dark:text-zinc-200">Server-Log-Dateien</h3>
                <p className="text-zinc-700 dark:text-zinc-300">
                  Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten Server-Log-Dateien, die Ihr Browser 
                  automatisch an uns übermittelt. Dies sind:
                </p>
                <ul>
                  <li>Browsertyp und Browserversion</li>
                  <li>verwendetes Betriebssystem</li>
                  <li>Referrer URL</li>
                  <li>Hostname des zugreifenden Rechners</li>
                  <li>Uhrzeit der Serveranfrage</li>
                  <li>IP-Adresse</li>
                </ul>

                <h3 className="text-zinc-800 dark:text-zinc-200">Kontaktformular</h3>
                <p className="text-zinc-700 dark:text-zinc-300">
                  Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von 
                  Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. 
                  Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
                </p>

                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-8">
                  Stand: April 2025
                </p>
              </div>
            )}

            {activeTab === 'impressum' && (
              <div className="prose prose-zinc dark:prose-invert max-w-none">
                <h2 className="text-zinc-800 dark:text-zinc-200">Angaben gemäß § 5 TMG</h2>
                <p className="text-zinc-700 dark:text-zinc-300">
                  ALAVI<br />
                  Musterstraße 123<br />
                  12345 Musterstadt<br />
                  Deutschland
                </p>

                <h2 className="text-zinc-800 dark:text-zinc-200">Kontakt</h2>
                <p className="text-zinc-700 dark:text-zinc-300">
                  Telefon: +49 (0) 123 456789<br />
                  E-Mail: info@alavi.dev
                </p>

                <h2 className="text-zinc-800 dark:text-zinc-200">Umsatzsteuer-ID</h2>
                <p className="text-zinc-700 dark:text-zinc-300">
                  Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />
                  DE123456789
                </p>

                <h2 className="text-zinc-800 dark:text-zinc-200">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
                <p className="text-zinc-700 dark:text-zinc-300">
                  Max Mustermann<br />
                  Musterstraße 123<br />
                  12345 Musterstadt
                </p>

                <h2 className="text-zinc-800 dark:text-zinc-200">Streitschlichtung</h2>
                <p className="text-zinc-700 dark:text-zinc-300">
                  Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
                </p>

                <h2 className="text-zinc-800 dark:text-zinc-200">Haftung für Inhalte</h2>
                <p className="text-zinc-700 dark:text-zinc-300">
                  Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. 
                  Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu 
                  überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
                </p>

                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-8">
                  Stand: April 2025
                </p>
              </div>
            )}
          </ScrollReveal>
        </div>
      </main>
    </Layout>
  );
};

export default Legal;
