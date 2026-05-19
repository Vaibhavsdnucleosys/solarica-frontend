import * as XLSX from 'xlsx';

/**
 * Export a flat array of objects as an Excel file.
 */
export const exportToExcel = (data: any[], fileName: string, sheetName: string = 'Sheet1') => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

/**
 * Export an HTML table element to an Excel file using its DOM id.
 */
export const exportTableToExcel = (tableId: string, fileName: string) => {
    const table = document.getElementById(tableId);
    if (!table) return;
    const workbook = XLSX.utils.table_to_book(table);
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

/**
 * Export Profit & Loss data (T-account format) to Excel.
 * Creates two side-by-side sections: Expenses and Income.
 */
export const exportProfitLossToExcel = (data: any, fileName: string) => {
    if (!data) return;

    const rows: any[][] = [];

    // Title
    rows.push(['Profit & Loss Account']);
    rows.push([`Company: ${data.companyName || 'Solarica'}`]);
    rows.push([`Period: ${data.period || '1-Apr-25 to 31-Mar-26'}`]);
    rows.push([]);

    // Headers
    rows.push(['EXPENSES', 'Amount', '', 'INCOME', 'Amount']);

    // Direct Expenses & Direct Income
    const maxDirect = Math.max(
        data.sections?.directExpense?.length || 0,
        data.sections?.directIncome?.length || 0
    );
    for (let i = 0; i < maxDirect; i++) {
        const exp = data.sections?.directExpense?.[i];
        const inc = data.sections?.directIncome?.[i];
        rows.push([
            exp?.name || '',
            exp ? Math.abs(exp.amount) : '',
            '',
            inc?.name || '',
            inc ? Math.abs(inc.amount) : ''
        ]);
    }

    // Gross Profit/Loss
    rows.push([]);
    if (data.calculations?.isLoss) {
        rows.push(['', '', '', 'Gross Loss c/o', Math.abs(data.calculations.grossProfit || 0)]);
    } else {
        rows.push(['Gross Profit c/o', Math.abs(data.calculations?.grossProfit || 0), '', '', '']);
    }
    rows.push([]);

    // Indirect Expenses & Indirect Income
    const maxIndirect = Math.max(
        data.sections?.indirectExpense?.length || 0,
        data.sections?.indirectIncome?.length || 0
    );
    for (let i = 0; i < maxIndirect; i++) {
        const exp = data.sections?.indirectExpense?.[i];
        const inc = data.sections?.indirectIncome?.[i];
        rows.push([
            exp?.name || '',
            exp ? Math.abs(exp.amount) : '',
            '',
            inc?.name || '',
            inc ? Math.abs(inc.amount) : ''
        ]);
    }

    // Net Profit/Loss
    rows.push([]);
    if (data.calculations?.isLoss) {
        rows.push(['', '', '', 'Net Loss', Math.abs(data.calculations.netProfit || 0)]);
    } else {
        rows.push(['Net Profit', Math.abs(data.calculations?.netProfit || 0), '', '', '']);
    }

    const worksheet = XLSX.utils.aoa_to_sheet(rows);

    // Set column widths
    worksheet['!cols'] = [
        { wch: 30 }, // Expense name
        { wch: 18 }, // Expense amount
        { wch: 4 },  // Spacer
        { wch: 30 }, // Income name
        { wch: 18 }, // Income amount
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Profit & Loss');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
};
