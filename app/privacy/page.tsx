import type { Metadata } from "next";
import { Prose } from "@/app/components/Prose";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "What this site measures, what it stores, and how to change your choice.",
};

export default function PrivacyPage() {
  return (
    <article>
      <div className="mb-12">
        <h1 className="display text-[22px] [overflow-wrap:anywhere]">Privacy Policy</h1>
        <p className="mt-2 text-sm text-subtle">Last updated 14 November 2026.</p>
      </div>

      <Prose>
        <p>
          This is a personal site. It has no accounts, no newsletter, no contact form, no
          advertising, and no profiling. The only optional processing is analytics through Google
          Analytics, which remains completely disabled until you explicitly accept it.
        </p>

        <h2>Who is responsible (Data Controller)</h2>
        <p>
          The data controller is <strong>{site.name}</strong>, located in {site.location} (Spain).
          You can reach me regarding data protection matters at{" "}
          <a href={`mailto:${site.privacyEmail}`}>{site.privacyEmail}</a>.
        </p>

        <h2>What is processed</h2>
        <ul>
          <li>
            <strong>Analytics (strictly after consent):</strong> Pages viewed, links and entries
            clicked, approximate location (country and city derived by GA4 from IP addresses),
            device type, browser, operating system, language, referring site, and session
            interactions such as scroll depth. Google Analytics automatically anonymizes IP
            addresses for EU traffic.
          </li>
          <li>
            <strong>Your consent choice:</strong> Stored locally in your browser so the consent
            banner does not reappear on every page.
          </li>
          <li>
            <strong>Your theme preference:</strong> Light or dark mode, stored locally in your
            browser.
          </li>
          <li>
            <strong>Technical security logs:</strong> Maintained by the hosting provider
            (Cloudflare) briefly for security, DDoS protection, and abuse prevention.
          </li>
        </ul>

        <h2>Legal basis (GDPR)</h2>
        <ul>
          <li>
            <strong>Analytics:</strong> Your explicit consent (Article 6(1)(a) GDPR), which you can
            withdraw at any time.
          </li>
          <li>
            <strong>Security logs:</strong> Legitimate interest in maintaining site security and
            availability (Article 6(1)(f) GDPR).
          </li>
        </ul>

        <h2>Cookies and local storage</h2>
        <p>
          No tracking cookies are set unless you accept them. Declining leaves the site operating
          with essential local storage keys only, which require no prior consent.
        </p>
        <ul>
          <li>
            <code>_ga</code> — Google Analytics, distinguishes unique users. Up to 2 years. Set only
            after consent.
          </li>
          <li>
            <code>_ga_1WRSNRC9Z2</code> — Google Analytics, persists session state. Up to 2 years.
            Set only after consent.
          </li>
          <li>
            <code>analytics-consent</code> — Local storage, remembers your preference. Stored for 12
            months, after which you will be asked again.
          </li>
          <li>
            <code>theme</code> — Local storage, remembers light or dark mode preference. Persists
            until cleared.
          </li>
        </ul>

        <h2>Data recipients and international transfers</h2>
        <p>
          Analytics data is processed by Google Ireland Limited and Google LLC. Data transfers
          outside the European Economic Area rely on Google&apos;s certification under the EU-US
          Data Privacy Framework and Standard Contractual Clauses. No data is sold, rented, or used
          for advertising or profiling.
        </p>

        <h2>Data retention</h2>
        <p>
          Analytics events are retained in Google Analytics according to the configured property
          settings (maximum 14 months). Your consent record expires after 12 months. Hosting
          security logs are automatically purged by Cloudflare after a short operational period.
        </p>

        <h2>Your rights</h2>
        <p>
          Under the GDPR and Spanish data protection laws, you have the right to request access,
          rectification, erasure, restriction, portability, or to object to processing, as well as
          the right to withdraw consent at any time. You can adjust your choice using the{" "}
          <em>Cookie settings</em> control in the footer or by clearing your browser site data.
        </p>
        <p>
          If you believe your data protection rights have been violated, you have the right to lodge
          a complaint with the Spanish supervisory authority, the{" "}
          <strong>Agencia Española de Protección de Datos (AEPD)</strong>, at{" "}
          <a href="https://www.aepd.es" target="_blank" rel="noreferrer">
            aepd.es
          </a>
          , or with the supervisory authority of your habitual residence.
        </p>

        <h2>Policy changes</h2>
        <p>
          If the scope of tracking or data collection changes, this privacy policy and the consent
          banner will be updated, prompting you for a renewed choice on your next visit.
        </p>
      </Prose>
    </article>
  );
}
