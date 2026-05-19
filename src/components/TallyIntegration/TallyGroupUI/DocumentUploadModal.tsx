import React, { useState, useEffect } from 'react';
import { Upload, X, FileText, Eye, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { getPaymentProofs, uploadQuotationDocuments, uploadPaymentProof, getQuotationDocs } from '../../../services/quotationService';
import { getInvoiceProofs, uploadInvoiceProof } from '../../../services/invoiceService';
import { API_BASE_URL } from '../../../config';

interface DocumentUploadModalProps {
    quotationId: string;
    onClose: () => void;
    entityType?: 'quotation' | 'invoice';
    readOnly?: boolean;
}

interface DocumentInfo {
    id: string;
    type: string; // 'AADHAR' | 'PAN' | 'LIGHT_BILL'
    url: string;
    createdAt: string;
    originalName?: string;
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
    quotationId,
    onClose,
    entityType = 'quotation',
    readOnly = false
}) => {
    const [documents, setDocuments] = useState<DocumentInfo[]>([]);
    const [loading, setLoading] = useState(false);

    // Invoices only support LIGHT_BILL via PaymentProof for now unless schema expanded
    const documentTypes = entityType === 'invoice'
        ? [{ key: 'LIGHT_BILL', label: 'LIGHT BILL' }]
        : [
            { key: 'AADHAR', label: 'AADHAR CARD' },
            { key: 'PAN', label: 'PAN CARD' },
            { key: 'LIGHT_BILL', label: 'LIGHT BILL' }
        ];

    useEffect(() => {
        if (quotationId) {
            fetchDocuments();
        }
    }, [quotationId, entityType]);

    const fetchDocuments = async () => {
        try {
            setLoading(true);
            let pProofs: any[] = [];
            let qDocs: any = null;

            if (entityType === 'invoice') {
                pProofs = await getInvoiceProofs(quotationId);
            } else {
                // Fetch both for quotations
                const [proofsData, docsData] = await Promise.all([
                    getPaymentProofs(quotationId).catch(e => []),
                    getQuotationDocs(quotationId).catch(e => null)
                ]);
                pProofs = Array.isArray(proofsData) ? proofsData : [];
                qDocs = docsData;
            }

            console.log('Fetched Payment Proofs:', pProofs);
            console.log('Fetched Quotation Docs:', qDocs);

            // Normalize and merge
            const normalizedDocs: DocumentInfo[] = [];

            // 1. Process Payment Proofs (LIGHT_BILL, ADVANCE, etc.)
            pProofs.forEach(p => {
                normalizedDocs.push({
                    id: p.id,
                    type: p.type,
                    url: p.url || p.imageUrl,
                    createdAt: p.uploadedAt,
                    originalName: p.originalName || `${p.type} Proof`
                });
            });

            // 2. Process Quotation Docs (doc1=AADHAR, doc2=PAN)
            if (qDocs) {
                if (qDocs.doc1) {
                    normalizedDocs.push({
                        id: 'doc1',
                        type: 'AADHAR',
                        url: qDocs.doc1,
                        createdAt: qDocs.createdAt || new Date().toISOString(),
                        originalName: 'Aadhar Card'
                    });
                }
                if (qDocs.doc2) {
                    normalizedDocs.push({
                        id: 'doc2',
                        type: 'PAN',
                        url: qDocs.doc2,
                        createdAt: qDocs.createdAt || new Date().toISOString(),
                        originalName: 'PAN Card'
                    });
                }
                if (qDocs.doc3) {
                    normalizedDocs.push({
                        id: 'doc3',
                        type: 'DOC3',
                        url: qDocs.doc3,
                        createdAt: qDocs.createdAt || new Date().toISOString(),
                        originalName: 'Additional Document'
                    });
                }
            }

            setDocuments(normalizedDocs);
        } catch (error) {
            console.error('Error fetching documents:', error);
        } finally {
            setLoading(false);
        }
    };

    // Robust case-insensitive matching
    const getDocumentByType = (type: string) => {
        return documents.find(d => (d.type || '').toUpperCase() === type);
    };

    const [uploading, setUploading] = useState<string | null>(null);

    const handleFileUpload = async (type: string, file: File) => {
        if (!file || readOnly) return;

        try {
            setUploading(type);
            console.log(`Uploading ${type}...`);

            if (entityType === 'invoice') {
                // For invoice, everything goes through uploadInvoiceProof (which expects PaymentProofs)
                // Since we only show LIGHT_BILL, this is safe. 
                // If we add others, we need to ensure they are valid PaymentProofTypes
                await uploadInvoiceProof(quotationId, file, type);
            } else {
                if (type === 'LIGHT_BILL') {
                    await uploadPaymentProof(quotationId, file, 'LIGHT_BILL');
                } else {
                    // Map type to key expected by uploadQuotationDocuments
                    const key = type === 'AADHAR' ? 'aadharCard' : 'panCard';
                    await uploadQuotationDocuments(quotationId, { [key]: file });
                }
            }

            // Refresh list
            await fetchDocuments();
        } catch (error) {
            console.error(`Error uploading ${type}:`, error);
            alert(`Failed to upload ${type}`);
        } finally {
            setUploading(null);
        }
    };

    const handleView = (url: string) => {
        if (!url) {
            console.error('Document URL is missing');
            return;
        }

        const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
        window.open(fullUrl, '_blank');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden font-sans flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 bg-white">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 tracking-tight">
                            {readOnly ? 'Document Viewer' : 'Document Management'}
                        </h2>
                        <p className="text-xs text-gray-500 mt-1 font-medium bg-gray-100 w-fit px-2 py-0.5 rounded-full">
                            ID: {quotationId}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-700"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 bg-gray-50/50 flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-3 text-gray-400">
                            <div className="animate-spin size-6 border-2 border-current border-t-transparent rounded-full" />
                            <span className="text-sm font-medium">Loading documents...</span>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {documentTypes.map((docType) => {
                                const doc = getDocumentByType(docType.key);
                                const isAvailable = !!doc;

                                return (
                                    <div
                                        key={docType.key}
                                        className={`group relative flex items-center p-4 rounded-xl border transition-all duration-200 ${isAvailable
                                            ? 'bg-white border-blue-100 shadow-sm hover:shadow-md hover:border-blue-200'
                                            : 'bg-white/50 border-gray-100 grayscale-[0.5] hover:grayscale-0'
                                            }`}
                                    >
                                        {/* Icon Container */}
                                        <div className={`size-12 rounded-lg flex items-center justify-center mr-4 shrink-0 transition-colors ${isAvailable
                                            ? 'bg-blue-50 text-blue-600'
                                            : 'bg-gray-100 text-gray-400'
                                            }`}>
                                            {isAvailable ? <FileText size={24} /> : <AlertCircle size={24} />}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0 mr-4">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <h3 className={`text-sm font-bold ${isAvailable ? 'text-gray-800' : 'text-gray-500'}`}>
                                                    {docType.label}
                                                </h3>
                                                {isAvailable && (
                                                    <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wide flex items-center gap-1">
                                                        <CheckCircle2 size={10} /> Available
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500 truncate">
                                                {isAvailable
                                                    ? (doc?.originalName || 'Document available for viewing')
                                                    : 'No document has been uploaded for this item'
                                                }
                                            </p>
                                            {isAvailable && (
                                                <p className="text-[10px] text-gray-400 mt-0.5">
                                                    Uploaded on {new Date(doc.createdAt).toLocaleDateString()}
                                                </p>
                                            )}
                                        </div>

                                        {/* Action */}
                                        <div>
                                            {isAvailable ? (
                                                <button
                                                    onClick={() => handleView(doc.url)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all shadow-sm active:scale-95"
                                                >
                                                    <Eye size={14} />
                                                    View
                                                </button>
                                            ) : readOnly ? (
                                                <span className="px-3 py-1.5 bg-gray-100 text-gray-400 text-[10px] font-black uppercase rounded-lg">
                                                    Not available
                                                </span>
                                            ) : (
                                                <div className="relative">
                                                    <input
                                                        type="file"
                                                        id={`upload-${docType.key}`}
                                                        className="hidden"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) handleFileUpload(docType.key, file);
                                                        }}
                                                        disabled={!!uploading}
                                                    />
                                                    <label
                                                        htmlFor={`upload-${docType.key}`}
                                                        className={`flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-bold rounded-lg transition-all cursor-pointer shadow-sm active:scale-95 select-none ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
                                                    >
                                                        {uploading === docType.key ? (
                                                            <Loader2 size={14} className="animate-spin" />
                                                        ) : (
                                                            <Upload size={14} />
                                                        )}
                                                        {uploading === docType.key ? 'Uploading...' : 'Upload'}
                                                    </label>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-white border-t border-gray-100 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-bold rounded-lg transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
