import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { toast } from 'sonner';

/**
 * Captures a specific DOM element and exports it as a formatted PDF document.
 * 
 * @param elementId The ID of the HTML element to capture (e.g., 'dashboard-content')
 * @param filename The desired name of the output PDF file (without .pdf)
 */
export const exportElementToPDF = async (elementId: string, filename: string = 'Agridom-Report') => {
    const element = document.getElementById(elementId);

    if (!element) {
        console.error(`Element with id ${elementId} not found.`);
        toast.error('Failed to generate report', {
            description: 'Could not locate the dashboard content.'
        });
        return;
    }

    try {
        // Show a loading toast that doesn't dismiss immediately
        const loadingToast = toast.loading('Generating PDF Report...', {
            description: 'Please wait while we capture your dashboard data.'
        });

        // Capture the element using html2canvas
        const canvas = await html2canvas(element, {
            scale: 2, // Higher scale for better resolution
            useCORS: true, // Allow loading cross-origin images if any
            logging: false,
            backgroundColor: '#ffffff' // Ensure white background for PDF
        });

        const imgData = canvas.toDataURL('image/png');

        // Initialize jsPDF (A4 size, portrait)
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        // Calculate dimensions
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        // Calculate aspect ratio to fit image into PDF dimensions
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

        // Calculate final image dimensions in the PDF
        const finalImgWidth = imgWidth * ratio;
        const finalImgHeight = imgHeight * ratio;

        // Center the image horizontally
        const marginX = (pdfWidth - finalImgWidth) / 2;
        // Add a small top margin
        const marginY = 10;

        // Add header to the PDF
        pdf.setFontSize(18);
        pdf.setTextColor(16, 185, 129); // Emerald-500
        pdf.text('Agridom Platform', 14, 15);

        pdf.setFontSize(10);
        pdf.setTextColor(100, 116, 139); // Slate-500
        pdf.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);

        // Add the captured image below the header
        pdf.addImage(imgData, 'PNG', marginX, Math.max(marginY, 30), finalImgWidth, finalImgHeight);

        // Add footer
        pdf.setFontSize(8);
        pdf.setTextColor(148, 163, 184); // Slate-400
        pdf.text('© Agridom | Data-Driven Agricultural Insights', pdfWidth / 2, pdfHeight - 10, { align: 'center' });

        // Save the PDF
        pdf.save(`${filename}-${new Date().toISOString().split('T')[0]}.pdf`);

        // Dismiss loading and show success
        toast.dismiss(loadingToast);
        toast.success('Report successfully exported!', {
            description: `Saved as ${filename}-${new Date().toISOString().split('T')[0]}.pdf`
        });

    } catch (error) {
        console.error('Error generating PDF:', error);
        toast.dismiss();
        toast.error('Export Failed', {
            description: 'An unexpected error occurred while generating the PDF.'
        });
    }
};
