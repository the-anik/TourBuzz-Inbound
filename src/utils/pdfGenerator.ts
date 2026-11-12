import { jsPDF } from 'jspdf';
import { TourPackage, TourBooking, CurrencyCode } from '../types/tour';
import { formatPrice } from './pricing';

/**
 * Generates and triggers download of an official Tour Package Itinerary PDF.
 */
export function generateTourPackagePDF(tour: TourPackage, currency: CurrencyCode = 'USD'): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  let y = margin;

  // Header Bar
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('TOURBUZZ LIVE · INBOUND TOURISM DOSSIER', margin, 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('GOVERNMENT REGISTERED TOUR OPERATOR · BANGLADESH TOURISM BOARD COMPLIANT', margin, 21);

  y = 38;

  // Tour Title & Tagline
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(tour.title, margin, y);
  y += 7;

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10.5);
  doc.setTextColor(71, 85, 105); // slate-600
  doc.text(tour.tagline, margin, y);
  y += 10;

  // Key Spec Grid
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.roundedRect(margin, y, pageWidth - margin * 2, 26, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);

  const colWidth = (pageWidth - margin * 2) / 4;
  doc.text('DURATION', margin + 6, y + 8);
  doc.text('PRICE PER PERSON', margin + colWidth + 6, y + 8);
  doc.text('DEPARTURE POINT', margin + colWidth * 2 + 6, y + 8);
  doc.text('DIFFICULTY / GROUP', margin + colWidth * 3 + 6, y + 8);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(`${tour.durationDays}D / ${tour.durationNights}N`, margin + 6, y + 18);
  doc.text(formatPrice(tour.priceUSD, currency), margin + colWidth + 6, y + 18);
  doc.text(tour.departurePoint, margin + colWidth * 2 + 6, y + 18);
  doc.text(`${tour.difficulty} (Max ${tour.maxGroupSize})`, margin + colWidth * 3 + 6, y + 18);

  y += 34;

  // Certified Guide & Safety Liaison
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('CERTIFIED INBOUND TOUR LEAD', margin, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text(
    `Lead Guide: ${tour.guide.name}  |  Govt License: ${tour.guide.licenseNumber}  |  Languages: ${tour.guide.languages.join(', ')}`,
    margin,
    y
  );
  y += 5;
  doc.text(
    `24/7 Field Support & WhatsApp: ${tour.guide.phone}  |  Experience: ${tour.guide.experienceYears} Years`,
    margin,
    y
  );
  y += 10;

  // Itinerary Breakdown
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('DAY-BY-DAY ITINERARY', margin, y);
  y += 7;

  tour.itinerary.forEach((day) => {
    // Check page space
    if (y > pageHeight - 35) {
      doc.addPage();
      y = margin;
    }

    doc.setFillColor(241, 245, 249);
    doc.rect(margin, y - 4, pageWidth - margin * 2, 7, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`DAY ${day.day}: ${day.title.toUpperCase()}`, margin + 3, y + 1);
    y += 7;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);

    const splitDesc = doc.splitTextToSize(day.description, pageWidth - margin * 2 - 6);
    doc.text(splitDesc, margin + 3, y);
    y += splitDesc.length * 4.5 + 2;

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`Meals: ${day.meals.join(', ')}  ·  Overnight: ${day.stay}`, margin + 3, y);
    y += 7;
  });

  // What is included
  if (y > pageHeight - 45) {
    doc.addPage();
    y = margin;
  }

  y += 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text("WHAT'S INCLUDED FOR INTERNATIONAL TRAVELERS", margin, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  tour.inclusions.slice(0, 5).forEach((inc) => {
    doc.text(`✓  ${inc}`, margin + 3, y);
    y += 4.5;
  });

  // Foreign Tourist Notice & Helpline
  y += 4;
  doc.setFillColor(254, 242, 242);
  doc.setDrawColor(254, 202, 202);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 22, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(153, 27, 27);
  doc.text('FOREIGN TOURIST MANDATORY ASSISTANCE & SECURITY PROTOCOL', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(185, 28, 28);
  doc.text('• Forest and border zone entry permits processed automatically by TourBuzz Live.', margin + 4, y + 11);
  doc.text('• 24/7 Bangladesh Tourist Police Emergency Liaison: 999 or +880 1320-001299.', margin + 4, y + 16);

  // Footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(`Document generated via TourBuzz Live · www.tourbuzzlive.com · Page ${doc.getNumberOfPages()}`, margin, pageHeight - 8);

  // Trigger download
  const filename = `${tour.slug}-itinerary-tourbuzz.pdf`;
  doc.save(filename);
}

/**
 * Generates an official Passenger Booking Pass & Voucher PDF.
 */
export function generateBookingVoucherPDF(booking: TourBooking, tour: TourPackage): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let y = margin;

  // Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 32, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('TOURBUZZ LIVE · INBOUND TRAVEL PASS', margin, 15);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('OFFICIAL BOOKING CONFIRMATION & LIVE GPS TRACKING VOUCHER', margin, 23);

  y = 44;

  // Booking Code Badge Box
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 28, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text('BOOKING TRACKING CODE', margin + 8, y + 9);
  doc.text('DATE OF ISSUE', margin + 90, y + 9);
  doc.text('TOTAL AMOUNT PAID', margin + 140, y + 9);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text(booking.bookingCode, margin + 8, y + 20);

  doc.setFontSize(10);
  doc.text(new Date(booking.createdAt).toLocaleDateString(), margin + 90, y + 20);
  doc.text(`${formatPrice(booking.totalAmountUSD, booking.currency)} (${booking.currency})`, margin + 140, y + 20);

  y += 38;

  // Passenger & Inbound Permit Details
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('PASSENGER & IMMIGRATION PERMIT DETAILS', margin, y);
  y += 7;

  doc.setDrawColor(226, 232, 240);
  doc.line(margin, y, pageWidth - margin, y);
  y += 7;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105);

  doc.text(`Lead Traveler: ${booking.leadGuestName}`, margin, y);
  doc.text(`Passport No: ${booking.passportNumber}`, margin + 90, y);
  y += 7;

  doc.text(`Nationality: ${booking.nationality}`, margin, y);
  doc.text(`Guest Count: ${booking.guestCount} Adult(s)`, margin + 90, y);
  y += 7;

  doc.text(`Contact Email: ${booking.email}`, margin, y);
  doc.text(`Phone / WhatsApp: ${booking.phone}`, margin + 90, y);
  y += 12;

  // Tour Schedule & Pickup
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('TOUR SCHEDULE & PICKUP COORDINATES', margin, y);
  y += 7;

  doc.setDrawColor(226, 232, 240);
  doc.line(margin, y, pageWidth - margin, y);
  y += 7;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`Tour: ${tour.title}`, margin, y);
  y += 7;

  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`Departure Date: ${booking.departureDate}`, margin, y);
  doc.text(`Meeting Point: ${tour.departurePoint}`, margin + 90, y);
  y += 7;

  doc.text(`Assigned Lead Guide: ${tour.guide.name} (License #${tour.guide.licenseNumber})`, margin, y);
  doc.text(`Emergency Support: ${tour.guide.phone}`, margin + 90, y);
  y += 14;

  // Realtime Tracking Instructions
  doc.setFillColor(238, 242, 255); // indigo-50
  doc.setDrawColor(199, 210, 254);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 34, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(49, 46, 129);
  doc.text('HOW TO TRACK YOUR TOUR IN REAL-TIME', margin + 6, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(67, 56, 202);
  doc.text(`1. Open the "Live Tracking" tab on TourBuzz Live website.`, margin + 6, y + 15);
  doc.text(`2. Enter your unique tracking reference: ${booking.bookingCode}`, margin + 6, y + 21);
  doc.text(`3. Follow vehicle GPS updates, checkpoint arrivals, and broadcast announcements.`, margin + 6, y + 27);

  y += 44;

  // QR representation box
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, 40, 40, 2, 2, 'D');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('DIGITAL PASS', margin + 8, y + 16);
  doc.setFontSize(7);
  doc.text(booking.bookingCode, margin + 11, y + 23);
  doc.text('VERIFIED', margin + 12, y + 29);

  // Otithi Hospitality Guarantee
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('OTITHI HOSPITALITY GUARANTEE', margin + 48, y + 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('In Bengali, "Otithi" means the sacred guest. We ensure your safety, comfort,', margin + 48, y + 17);
  doc.text('and authentic cultural immersion throughout your expedition in Bangladesh.', margin + 48, y + 23);
  doc.text('Dedicated 24/7 Tourist Police Support: Dial 999 or +880 1320-001299.', margin + 48, y + 29);

  // Footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('TourBuzz Live · Official Inbound Travel Voucher · Non-Transferable · Valid with Photo ID', margin, pageHeight - 10);

  // Trigger download
  doc.save(`tourbuzz-pass-${booking.bookingCode}.pdf`);
}
