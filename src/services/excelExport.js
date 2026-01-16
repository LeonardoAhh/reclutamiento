import * as XLSX from 'xlsx';

/**
 * Export candidates data to Excel file
 * @param {Array} candidates - Array of candidate objects
 * @param {Array} vacancies - Array of vacancy objects for reference
 * @param {string} filename - Name of the file to download
 */
export const exportCandidatesToExcel = (candidates, vacancies, filename = 'candidatos') => {
    // Create vacancy lookup map
    const vacancyMap = {};
    vacancies.forEach(v => {
        vacancyMap[v.id] = v.title;
    });

    // Transform data for Excel
    const excelData = candidates.map((candidate, index) => ({
        'No.': index + 1,
        'Nombre Completo': candidate.fullName || '',
        'Email': candidate.email || '',
        'Teléfono': candidate.phone || '',
        'Vacante': vacancyMap[candidate.vacancyId] || candidate.vacancyTitle || 'No especificada',
        'Experiencia': candidate.experience || '',
        'Mensaje': candidate.message || '',
        'Estado': getStatusLabel(candidate.status),
        'Fecha de Postulación': formatDate(candidate.createdAt)
    }));

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    worksheet['!cols'] = [
        { wch: 5 },   // No.
        { wch: 30 },  // Nombre
        { wch: 30 },  // Email
        { wch: 15 },  // Teléfono
        { wch: 25 },  // Vacante
        { wch: 40 },  // Experiencia
        { wch: 40 },  // Mensaje
        { wch: 15 },  // Estado
        { wch: 20 }   // Fecha
    ];

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Candidatos');

    // Generate filename with date
    const date = new Date().toISOString().split('T')[0];
    const fullFilename = `${filename}_${date}.xlsx`;

    // Download file
    XLSX.writeFile(workbook, fullFilename);
};

/**
 * Export recruiters data to Excel file
 * @param {Array} recruiters - Array of recruiter objects
 * @param {string} filename - Name of the file to download
 */
export const exportRecruitersToExcel = (recruiters, filename = 'reclutadoras') => {
    const excelData = recruiters.map((recruiter, index) => ({
        'No.': index + 1,
        'Nombre': recruiter.name || '',
        'Email': recruiter.email || '',
        'Teléfono': recruiter.phone || '',
        'Extensión': recruiter.extension || '',
        'Departamento': recruiter.department || ''
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    worksheet['!cols'] = [
        { wch: 5 },   // No.
        { wch: 30 },  // Nombre
        { wch: 30 },  // Email
        { wch: 15 },  // Teléfono
        { wch: 10 },  // Extensión
        { wch: 25 }   // Departamento
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reclutadoras');

    const date = new Date().toISOString().split('T')[0];
    const fullFilename = `${filename}_${date}.xlsx`;

    XLSX.writeFile(workbook, fullFilename);
};

// Helper functions
const getStatusLabel = (status) => {
    const statusLabels = {
        'pending': 'Pendiente',
        'reviewed': 'Revisado',
        'contacted': 'Contactado',
        'interviewed': 'Entrevistado',
        'hired': 'Contratado',
        'rejected': 'Rechazado'
    };
    return statusLabels[status] || 'Pendiente';
};

const formatDate = (timestamp) => {
    if (!timestamp) return '';

    // Handle Firestore Timestamp
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);

    return date.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
};
