import jsPDF from 'jspdf';
import { BriefingData } from '../types';

export function generateBriefingPDF(briefing: BriefingData): jsPDF {
  const doc = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4',
  });

  // Page header background banner
  doc.setFillColor(11, 31, 58); // #0B1F3A Navy
  doc.rect(0, 0, 210, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.text('SalesScout AI — Executive Briefing', 14, 15);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${new Date(briefing.createdAt).toLocaleDateString()}`, 145, 15);

  let y = 32;

  // Company Name Header
  doc.setTextColor(11, 31, 58);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(briefing.companyName, 14, y);
  y += 6;

  if (briefing.stakeholderName) {
    doc.setFontSize(11);
    doc.setTextColor(31, 169, 160); // Teal
    doc.text(`Stakeholder: ${briefing.stakeholderName}${briefing.stakeholderTitle ? ` (${briefing.stakeholderTitle})` : ''}`, 14, y);
    y += 8;
  } else {
    y += 4;
  }

  // Divider Line
  doc.setDrawColor(226, 232, 240);
  doc.line(14, y, 196, y);
  y += 8;

  // Company Snapshot Section
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(11, 31, 58);
  doc.text('1. COMPANY SNAPSHOT', 14, y);
  y += 6;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text(`Industry: ${briefing.companySnapshot.industry}`, 14, y);
  doc.text(`Size: ${briefing.companySnapshot.companySize}`, 110, y);
  y += 5;
  doc.text(`HQ: ${briefing.companySnapshot.hqLocation}`, 14, y);
  doc.text(`Funding / Revenue: ${briefing.companySnapshot.fundingOrRevenue}`, 110, y);
  y += 7;

  doc.setFont('helvetica', 'bold');
  doc.text('Why It Matters Now:', 14, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  const whyLines = doc.splitTextToSize(briefing.companySnapshot.whyItMattersNow, 180);
  doc.text(whyLines, 14, y);
  y += whyLines.length * 4.5 + 5;

  // Financial Overview Section
  if (briefing.financialOverview) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(11, 31, 58);
    doc.text('2. FINANCIAL OVERVIEW & 3-YEAR TREND', 14, y);
    y += 6;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    if (briefing.financialOverview.summary) {
      const finSummary = doc.splitTextToSize(`Summary: ${briefing.financialOverview.summary}`, 180);
      doc.text(finSummary, 14, y);
      y += finSummary.length * 4.5 + 3;
    }

    const finTrend = briefing.financialOverview.threeYearTrend || briefing.financialOverview.records || [];
    if (finTrend.length > 0) {
      finTrend.forEach((item: any) => {
        const val = item.revenue || '';
        const growth = item.growthOrMargin || item.growth || '';
        const highlight = item.keyHighlight || '';
        doc.text(`• ${item.year}: ${val}${growth ? ` (${growth})` : ''}${highlight ? ` — ${highlight}` : ''}`, 18, y);
        y += 4.5;
      });
      y += 3;
    }
  }

  // Stakeholder Profile
  if (briefing.stakeholderProfile) {
    if (y > 230) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(11, 31, 58);
    doc.text('3. STAKEHOLDER PROFILE', 14, y);
    y += 6;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${briefing.stakeholderProfile.name || ''} | Title: ${briefing.stakeholderProfile.title || ''}`, 14, y);
    y += 5;
    if (briefing.stakeholderProfile.communicationStyle) {
      doc.text(`Communication Style: ${briefing.stakeholderProfile.communicationStyle}`, 14, y);
      y += 5;
    }

    if (briefing.stakeholderProfile.roleOverview) {
      const roleLines = doc.splitTextToSize(`Role Overview: ${briefing.stakeholderProfile.roleOverview}`, 180);
      doc.text(roleLines, 14, y);
      y += roleLines.length * 4.5 + 5;
    }
  }

  // Talking Points
  if (briefing.talkingPoints && Array.isArray(briefing.talkingPoints) && briefing.talkingPoints.length > 0) {
    if (y > 230) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(11, 31, 58);
    doc.text('4. TALKING POINTS & CONVERSATION OPENERS', 14, y);
    y += 6;

    doc.setFontSize(9);
    briefing.talkingPoints.forEach((tp, idx) => {
      if (y > 260) {
        doc.addPage();
        y = 20;
      }
      doc.setFont('helvetica', 'bold');
      doc.text(`${idx + 1}. ${tp.topic || ''}`, 14, y);
      y += 4.5;
      doc.setFont('helvetica', 'italic');
      const openerLines = doc.splitTextToSize(`"${tp.opener || ''}"`, 175);
      doc.text(openerLines, 18, y);
      y += openerLines.length * 4 + 3;
    });
  }

  // Objection Radar
  if (briefing.objectionRadar && Array.isArray(briefing.objectionRadar) && briefing.objectionRadar.length > 0) {
    if (y > 230) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(11, 31, 58);
    doc.text('5. OBJECTION RADAR', 14, y);
    y += 6;

    doc.setFontSize(9);
    briefing.objectionRadar.forEach((obj) => {
      if (y > 260) {
        doc.addPage();
        y = 20;
      }
      doc.setFont('helvetica', 'bold');
      doc.text(`• [${obj.riskLevel || 'Medium'} Risk] "${obj.objection || ''}"`, 14, y);
      y += 4.5;
      doc.setFont('helvetica', 'normal');
      const respLines = doc.splitTextToSize(`Response Strategy: ${obj.responseAngle || ''}`, 180);
      doc.text(respLines, 18, y);
      y += respLines.length * 4 + 3;
    });
  }

  // Footer Disclaimer on last page
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(148, 163, 184);
  doc.text('AI-generated by SalesScout AI — Verify key facts prior to high-stakes meetings.', 14, 285);

  return doc;
}

export function downloadBriefingPDF(briefing: BriefingData) {
  const pdf = generateBriefingPDF(briefing);
  const fileName = `SalesScout_Briefing_${briefing.companyName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
  pdf.save(fileName);
}
