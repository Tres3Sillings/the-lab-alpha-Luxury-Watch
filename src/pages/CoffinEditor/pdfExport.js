import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const createPdfFromDesign = (designData, imageDataUrl) => {
  // Use 'pt' for precise print layout mapping
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  
  // ==========================================
  // PAGE 1: BRANDING & 3D RENDER
  // ==========================================
  
  // 1. Branding Header
  pdf.setFontSize(22);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(47, 57, 66); // Dark blue from your palette
  pdf.text('Trigard', 40, 60);

  if (imageDataUrl) {
    // 2. Image Layout Math
    const margin = 40;
    const maxImgWidth = pageWidth - (margin * 2);
    // Assuming a rough 16:9 aspect ratio for the canvas screenshot
    const imgWidth = maxImgWidth;
    const imgHeight = (imgWidth * 9) / 16; 
    const imgY = 90;

    // 3. Draw a subtle border frame around the image
    pdf.setDrawColor(220, 220, 220);
    pdf.setLineWidth(1);
    pdf.roundedRect(margin - 2, imgY - 2, imgWidth + 4, imgHeight + 4, 4, 4, 'S');

    // 4. Place the Image
    pdf.addImage(imageDataUrl, 'PNG', margin, imgY, imgWidth, imgHeight);

    // 5. Date under image
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(150, 150, 150);
    pdf.text(`Generated: ${new Date().toLocaleString()}`, margin, imgY + imgHeight + 20);
  }

  // ==========================================
  // PAGE 2: SELECTIONS SUMMARY TABLE
  // ==========================================
  pdf.addPage();

  // 1. Page 2 Header
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0);
  pdf.text('Selections Summary', 40, 60);

  // 2. Format your state data for the table body
  const metalColorMap = {
    '#a06127': 'Bronze',
    '#6b6b6b': 'Stainless Steel',
    '#8B4513': 'Copper'
  };
  const tableData = [
    ['Product Name', 'Custom Coffin'],
    ['Material', designData.coffinMaterial],
    ['Metal Color', metalColorMap[designData.metalColor] || designData.metalColor],
    ['Handle Type', designData.handles],
    ['Handle Color', metalColorMap[designData.handleColor] || designData.handleColor],
    ['Ornament', designData.ornament],
    ['Custom Decal', designData.decalAdded],
    ['Share Link', 'Click here to view this design in your browser'],
    ['Generated', new Date().toLocaleString()]
  ];

  // 3. Generate the styled table
  autoTable(pdf, {
    startY: 80,
    head: [['Item', 'Choice']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [11, 110, 253], textColor: 255, fontStyle: 'bold', fontSize: 12 },
    alternateRowStyles: { fillColor: [247, 247, 247] },
    styles: { font: 'helvetica', fontSize: 11, cellPadding: 8, lineColor: [220, 220, 220], lineWidth: 0.5 },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 140 } },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 1 && data.row.raw[0] === 'Share Link') {
        data.cell.styles.textColor = [11, 110, 253]; 
      }
    },
    didDrawCell: (data) => {
      if (data.section === 'body' && data.column.index === 1 && data.row.raw[0] === 'Share Link') {
        pdf.link(data.cell.x, data.cell.y, data.cell.width, data.cell.height, { url: designData.pageUrl });
      }
    }
  });

  pdf.save(`coffin-design-${Date.now()}.pdf`);
};