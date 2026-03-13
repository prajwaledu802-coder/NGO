import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import PageWrapper from "../components/PageWrapper";
import TiltCard from "../components/TiltCard";
import { getCertificate } from "../services/apiClient";

export default function CertificatesPage({ user }) {
  const [certificate, setCertificate] = useState({
    volunteerName: user?.displayName || "Volunteer",
    totalHours: 126,
    eventsCompleted: 18
  });

  useEffect(() => {
    const userId = user?.uid || "demo";
    let active = true;
    getCertificate(userId)
      .then((data) => {
        if (active) {
          setCertificate(data);
        }
      })
      .catch(() => {
        if (active) {
          setCertificate({
            volunteerName: user?.displayName || "Volunteer",
            totalHours: 126,
            eventsCompleted: 18
          });
        }
      });

    return () => {
      active = false;
    };
  }, [user?.uid, user?.displayName]);

  const downloadCertificate = () => {
    const doc = new jsPDF();
    doc.setFillColor(12, 24, 44);
    doc.rect(0, 0, 210, 297, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.text("HelpHive Certificate", 105, 45, { align: "center" });
    doc.setFontSize(14);
    doc.text("Awarded to", 105, 75, { align: "center" });
    doc.setFontSize(22);
    doc.text(certificate.volunteerName, 105, 95, { align: "center" });
    doc.setFontSize(13);
    doc.text(`Total hours: ${certificate.totalHours}`, 105, 118, { align: "center" });
    doc.text(`Events completed: ${certificate.eventsCompleted}`, 105, 128, { align: "center" });
    doc.text("For outstanding service to the community.", 105, 150, { align: "center" });
    doc.save("helphive-certificate.pdf");
  };

  return (
    <PageWrapper>
      <TiltCard className="max-w-2xl">
        <h3 className="font-display text-2xl font-bold text-white">Download Your Certificate</h3>
        <p className="mt-3 text-sm text-slate-300">Volunteer name: {certificate.volunteerName}</p>
        <p className="text-sm text-slate-300">Total hours: {certificate.totalHours}</p>
        <p className="text-sm text-slate-300">Events completed: {certificate.eventsCompleted}</p>
        <button
          onClick={downloadCertificate}
          className="mt-5 rounded-xl bg-emerald-300 px-4 py-2 text-sm font-semibold text-slate-900"
        >
          Download Certificate PDF
        </button>
      </TiltCard>
    </PageWrapper>
  );
}
