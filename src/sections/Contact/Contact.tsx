import { useState } from "react";
import type { FormEventHandler } from "react";
import { useTranslation } from "react-i18next";
import Container from "../../components/layout/Container";
import styles from "./Contact.module.css";

type FormState = {
  name: string;
  phone: string;
  service: string;
  message: string;
};

const initialForm: FormState = {
  name: "",
  phone: "",
  service: "",
  message: "",
};

const serviceKeys = [
  "basic",
  "salePrep",
  "premium",
  "premium2Step",
  "oneStepCorrection",
  "twoStepCorrection",
  "hardWax",
  "carbonCoating",
  "ceramicCoating",
  "grapheneCoating",
  "interiorDetailing",
  "upholsteryCleaning",
  "leatherCleaningProtection",
  "acCleaning",
  "headlightRestoration",
  "headlightWrapping",
  "doorHandleProtection",
  "rainRepellent",
  "oilAndFilters",
  "suspensionDiagnostics",
  "mechanicalRepairs",
  "stage1",
  "ecoOff",
  "other",
] as const;

export default function Contact() {
  const { t, i18n } = useTranslation();
  const [form, setForm] = useState<FormState>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (status !== "idle") {
      setStatus("idle");
    }
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setStatus("idle");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source: "contact-form",
          name: form.name,
          phone: form.phone,
          service: form.service,
          message: form.message,
          locale: i18n.language,
          page: `${window.location.pathname}${window.location.hash}`,
        }),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      setStatus("success");
      setForm(initialForm);
    } catch (error) {
      console.error(error);
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className={styles.section}>
      <Container>
        <div className={styles.wrapper}>
          <div className={styles.info}>
            <div className={styles.kicker}>{t("contact.kicker")}</div>

            <h2 className={styles.title}>{t("contact.title")}</h2>

            <p className={styles.description}>{t("contact.description")}</p>
          </div>

          <div className={styles.formCard}>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.field}>
                <label htmlFor="name" className={styles.label}>
                  {t("contact.form.name")}
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className={styles.input}
                  placeholder={t("contact.form.placeholders.name")}
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="phone" className={styles.label}>
                  {t("contact.form.phone")}
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className={styles.input}
                  placeholder={t("contact.form.placeholders.phone")}
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="service" className={styles.label}>
                  {t("contact.form.service")}
                </label>

                <div className={styles.selectWrap}>
                  <select
                    id="service"
                    name="service"
                    className={styles.select}
                    value={form.service}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      {t("contact.form.placeholders.service")}
                    </option>

                    {serviceKeys.map((key) => (
                      <option key={key} value={key}>
                        {t(`contact.form.services.${key}`)}
                      </option>
                    ))}
                  </select>

                  <span className={styles.selectArrow} aria-hidden="true">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <polyline
                        points="6 9 12 15 18 9"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="message" className={styles.label}>
                  {t("contact.form.message")}
                </label>
                <textarea
                  id="message"
                  name="message"
                  className={styles.textarea}
                  placeholder={t("contact.form.placeholders.message")}
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  maxLength={200}
                />
                <div className={styles.charCount}>
                  {form.message.length}/200
                </div>
              </div>

              <button
                type="submit"
                className={styles.button}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? t("contact.form.sending")
                  : t("contact.form.submit")}
              </button>

              {status === "success" && (
                <p className={`${styles.status} ${styles.success}`}>
                  {t("contact.form.success")}
                </p>
              )}

              {status === "error" && (
                <p className={`${styles.status} ${styles.error}`}>
                  {t("contact.form.error")}
                </p>
              )}
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
}
