import React, { useState, useRef, useEffect } from 'react';
import { getAllLedgers, createVoucher, getVoucherTypes, getVoucher, updateVoucher, deleteVoucher, Ledger } from '../../../../services/accountingService';
import { API_URL } from '../../../../config';
import TallyLedgerCreation from '../../TallyGroupUI/TallyLedgerCreation';

interface Props {
    voucherType: string;
    voucherNumber?: string;
    date?: string;
    companyName: string;
    companyId: string;
    onClose: () => void;
    existingVoucherId?: string;
    sourceProformaId?: string;
    sourceType?: 'quotation' | 'invoice';
    mode?: 'create' | 'alter' | 'display';
}

const AccountingVoucherCreation: React.FC<Props> = ({
    voucherType,
    voucherNumber,
    date,
    companyName,
    companyId,
    onClose,
    existingVoucherId,
    sourceProformaId,
    sourceType,
    mode = 'create'
}) => {
    // Master Lists
    const [allLedgers, setAllLedgers] = useState<Ledger[]>([]);
    const [voucherTypes, setVoucherTypes] = useState<any[]>([]);
    const [stockItems, setStockItems] = useState<any[]>([]);
    const [filteredStockItems, setFilteredStockItems] = useState<any[]>([]);

    // Mode Flags
    const isSingleEntryMode = ['Payment', 'Receipt', 'Contra'].includes(voucherType);
    const isJournalMode = voucherType === 'Journal';

    // Form State
    const [partyLedgerId, setPartyLedgerId] = useState(''); // "Account" header
    const [accountSearch, setAccountSearch] = useState(''); // Search text for account
    const [currentBalance, setCurrentBalance] = useState(''); // Balance of selected Account

    const [isItemInvoiceMode, setIsItemInvoiceMode] = useState(false);

    // Rows
    const [rows, setRows] = useState<any[]>([]);
    const [itemRows, setItemRows] = useState<any[]>([]); // For Item Invoice mode
    const [isVoucherLoaded, setIsVoucherLoaded] = useState(false);

    useEffect(() => {
        // Initialize or Reset rows when voucher type changes
        const isItemMode = ['Sales', 'Purchase'].includes(voucherType);
        setIsItemInvoiceMode(isItemMode);

        if (!existingVoucherId && !sourceProformaId) {
            if (isJournalMode) {
                setRows([{ drCr: 'By', ledgerId: '', ledgerName: '', debitAmount: '', creditAmount: '', currentBalance: '' }]);
            } else if (isItemMode) {
                setItemRows([{ itemId: '', itemName: '', quantity: '', rate: '', amount: '', unit: '' }]);
                setRows([]);
            } else {
                setRows([{ ledgerId: '', ledgerName: '', amount: '', currentBalance: '' }]);
            }
        }
    }, [voucherType, existingVoucherId, sourceProformaId]);

    const [narration, setNarration] = useState('');
    const [totalAmount, setTotalAmount] = useState('0.00');
    const [totalDebit, setTotalDebit] = useState('0.00');
    const [totalCredit, setTotalCredit] = useState('0.00');

    // UI State
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showAcceptModal, setShowAcceptModal] = useState(false);
    const [activeListField, setActiveListField] = useState<string | null>(null);
    const [selectedListIndex, setSelectedListIndex] = useState(0);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showLedgerCreation, setShowLedgerCreation] = useState(false);

    // Refs for Focus Management
    const accountRef = useRef<HTMLInputElement>(null);
    const salesLedgerRef = useRef<HTMLInputElement>(null);
    const narrationRef = useRef<HTMLTextAreaElement>(null);
    const acceptRef = useRef<HTMLDivElement>(null);
    const rowRefs = useRef<{ [key: string]: (HTMLInputElement | null)[] }>({
        drCr: [],
        ledger: [],
        debit: [],
        credit: [],
        amount: []
    });
    const itemRowRefs = useRef<{ [key: string]: (HTMLInputElement | null)[] }>({
        itemName: [],
        quantity: [],
        rate: [],
        amount: [],
        unit: []
    });
    

    useEffect(() => {
        if (showAcceptModal && acceptRef.current) {
            acceptRef.current.focus();
        }
    }, [showAcceptModal]);

    useEffect(() => {
        loadData();
    }, [existingVoucherId, sourceProformaId, allLedgers.length, voucherType]);

    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if (showAcceptModal || showDeleteModal) return;

            if (e.key.toLowerCase() === 'q') {
                const target = e.target as HTMLElement;
                if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
                    onClose();
                }
            }
        };
        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, [showAcceptModal, showDeleteModal, onClose]);

    const loadData = async () => {
        try {
            const [ledgers, vTypes, sItemsResponse] = await Promise.all([
                getAllLedgers(companyId),
                getVoucherTypes(companyId),
                fetch(`${API_URL}/inventory/stock-items/list/${companyId}`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                }).then(res => res.ok ? res.json() : { data: [] })
            ]);
            
            const sItems = sItemsResponse.data || sItemsResponse;

            setAllLedgers(ledgers);
            setVoucherTypes(vTypes);
            setStockItems(Array.isArray(sItems) ? sItems : []);
            setFilteredStockItems(Array.isArray(sItems) ? sItems : []);

            if (existingVoucherId) {
                const vch = await getVoucher(existingVoucherId);
                if (vch) {
                    setNarration(vch.narration || '');
                    if (vch.partyLedgerId) {
                        setPartyLedgerId(vch.partyLedgerId);
                        const partyLedger = ledgers.find((l: Ledger) => l.id === vch.partyLedgerId);
                        if (partyLedger) {
                            setAccountSearch(partyLedger.name);
                            setCurrentBalance(`${partyLedger.currentBalance} ${partyLedger.currentBalanceType}`);
                        }
                    }

                    const loadedRows = vch.entries
                        .filter((e: any) => e.ledgerId !== vch.partyLedgerId) // Exclude the header account in single entry
                        .map((e: any) => {
                            const l = ledgers.find((ledger: Ledger) => ledger.id === e.ledgerId);
                            if (isJournalMode) {
                                return {
                                    ledgerId: e.ledgerId,
                                    ledgerName: l?.name || 'Unknown',
                                    drCr: e.entryType === 'DEBIT' ? 'By' : 'To',
                                    debitAmount: e.entryType === 'DEBIT' ? e.amount.toString() : '',
                                    creditAmount: e.entryType === 'CREDIT' ? e.amount.toString() : '',
                                    currentBalance: l ? `Cur Bal: ${l.currentBalance} ${l.currentBalanceType}` : ''
                                };
                            } else {
                                return {
                                    ledgerId: e.ledgerId,
                                    ledgerName: l?.name || 'Unknown',
                                    amount: e.amount.toString(),
                                    currentBalance: l ? `Cur Bal: ${l.currentBalance} ${l.currentBalanceType}` : ''
                                };
                            }
                        });

                        if (loadedRows.length > 0) {
                            setRows(loadedRows);
                            calculateTotal(loadedRows);
                        }
                        setIsVoucherLoaded(true);
                    }
                } else if (sourceProformaId) {
                    // Fetch Proforma data and populate Sales Voucher
                    const token = localStorage.getItem('token');
                    const endpoint = sourceType === 'invoice' ? 'invoices' : 'quotations';
                    const res = await fetch(`${API_URL}/${endpoint}/${sourceProformaId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (res.ok) {
                        const json = await res.json();
                        const proformaData = json.data || json; // Handle both direct and nested responses
                        
                        if (proformaData) {
                            setNarration(`Based on ${sourceType === 'invoice' ? 'Proforma Invoice' : 'Quotation'}: ${proformaData.invoiceNumber || proformaData.id?.slice(0, 8) || ''}`);

                            // Try to find the party ledger matching the company name
                            const pName = proformaData.customerName || proformaData.recipientName || proformaData.companyName;
                            const partyLedger = ledgers.find((l: Ledger) => 
                                l.name.toLowerCase() === pName?.toLowerCase() || 
                                l.name.toLowerCase().includes(pName?.toLowerCase() || '___')
                            );
                            if (partyLedger) {
                                setPartyLedgerId(partyLedger.id);
                                setAccountSearch(partyLedger.name);
                                setCurrentBalance(`${partyLedger.currentBalance} ${partyLedger.currentBalanceType}`);
                            }

                            // Try to find a Sales ledger more robustly
                            const salesLedger = ledgers.find((l: Ledger) => 
                                (l.name.toLowerCase().includes('sales') || l.name.toLowerCase().includes('income')) && 
                                (l.group?.name?.toLowerCase().includes('sales account') || l.group?.name?.toLowerCase().includes('income'))
                            ) || ledgers.find((l: Ledger) => l.group?.name?.toLowerCase().includes('sales account'));
                            
                            const totalVal = proformaData.grandTotalPayable || proformaData.netPayableAmount || proformaData.totalAmount || 0;

                            if (salesLedger) {
                                const newRows = [{
                                    ledgerId: salesLedger.id,
                                    ledgerName: salesLedger.name,
                                    amount: totalVal.toString(),
                                    currentBalance: `Cur Bal: ${salesLedger.currentBalance} ${salesLedger.currentBalanceType}`
                                }];
                                setRows(newRows);
                                if (!['Sales', 'Purchase'].includes(voucherType)) {
                                    calculateTotal(newRows);
                                }
                            } else {
                                // Default row if no sales ledger found, so user can select
                                setRows([{
                                    ledgerId: '',
                                    ledgerName: '',
                                    amount: totalVal.toString(),
                                    currentBalance: ''
                                }]);
                            }

                            // Populate Item rows if in Item Invoice mode
                            const isSalesOrPurchase = ['Sales', 'Purchase'].includes(voucherType);
                            const sourceItems = proformaData.items || proformaData.InvoiceItem || proformaData.QuotationItem || [];
                            
                            if (isSalesOrPurchase && sourceItems && sourceItems.length > 0) {
                                setIsItemInvoiceMode(true);
                                const newItemRows = sourceItems.map((item: any) => ({
                                    itemId: item.itemId || item.productId || '',
                                    itemName: item.itemDescription || item.itemName || item.specification || item.name || 'Unknown Item',
                                    quantity: (item.quantity ?? '1').toString(),
                                    rate: (item.rate || item.unitPrice || item.basicPrice || item.price || 0).toString(),
                                    amount: (item.amount || item.totalPrice || 0).toString(),
                                    unit: item.unit || 'Nos'
                                }));
                                setItemRows(newItemRows);
                                
                                // Calculate total amount for item rows
                                const tot = newItemRows.reduce((sum: number, r: any) => sum + (parseFloat(r.amount) || 0), 0);
                                setTotalAmount(tot.toFixed(2));
                                
                                // If Sales ledger exists, use it as Account header
                                if (salesLedger) {
                                    setRows([{
                                        ledgerId: salesLedger.id,
                                        ledgerName: salesLedger.name,
                                        amount: tot.toFixed(2),
                                        currentBalance: `Cur Bal: ${salesLedger.currentBalance} ${salesLedger.currentBalanceType}`
                                    }]);
                                }
                            }
                        }
                    }
                    setIsVoucherLoaded(true);
                }
            } catch (err: any) {
            console.error(err);
            setError("Failed to load data. " + err.message);
        }
    };

    // Filter Logic for the List Panel
    const getAccountHeaderLedgers = () => {
        if (['Payment', 'Receipt', 'Contra'].includes(voucherType)) {
            return allLedgers.filter(l =>
                l.isCashAccount ||
                l.isBankAccount ||
                (l.group?.name === 'Cash-in-Hand' || l.group?.name === 'Bank Accounts' || l.group?.name === 'Bank OD A/c')
            );
        }
        return allLedgers;
    };

    const getParticularRowLedgers = () => {
        if (voucherType === 'Contra') return allLedgers.filter(l =>
            l.isCashAccount ||
            l.isBankAccount ||
            (l.group?.name === 'Cash-in-Hand' || l.group?.name === 'Bank Accounts')
        );
        if (isJournalMode) return allLedgers;
        if (['Payment', 'Receipt'].includes(voucherType)) {
            return allLedgers.filter(l => !l.isCashAccount && !l.isBankAccount && l.group?.name !== 'Cash-in-Hand' && l.group?.name !== 'Bank Accounts');
        }
        return allLedgers;
    };

    const getFilteredLedgers = () => {
        let list: Ledger[] = [];
        let search = '';

        if (activeListField === 'account') {
            list = getAccountHeaderLedgers();
            search = accountSearch;
        } else if (activeListField?.startsWith('ledger-')) {
            const index = parseInt(activeListField.split('-')[1]);
            list = getParticularRowLedgers();
            search = rows[index]?.ledgerName || '';
        } else if (activeListField && !isNaN(parseInt(activeListField))) {
            const index = parseInt(activeListField);
            list = getParticularRowLedgers();
            search = rows[index]?.ledgerName || '';
        }

        if (!search) return list;
        return list.filter(l => l.name.toLowerCase().includes(search.toLowerCase()));
    };

    const getFilteredStockItems = () => {
        if (!activeListField?.startsWith('itemName-')) return [];
        const index = parseInt(activeListField.split('-')[1]);
        const search = itemRows[index]?.itemName || '';
        if (!search) return stockItems;
        return stockItems.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
    };

    const calculateTotal = (currentRows: any[]) => {
        if (isJournalMode) {
            const drT = currentRows.reduce((s, r) => s + (parseFloat(r.debitAmount) || 0), 0);
            const crT = currentRows.reduce((s, r) => s + (parseFloat(r.creditAmount) || 0), 0);
            setTotalDebit(drT.toFixed(2));
            setTotalCredit(crT.toFixed(2));
        } else if (!isItemInvoiceMode) {
            const tot = currentRows.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);
            setTotalAmount(tot.toFixed(2));
        }
    };

    const handleItemRowChange = (index: number, field: string, value: string) => {
        const newItemRows = [...itemRows];
        newItemRows[index][field] = value;
        
        if (field === 'quantity' || field === 'rate') {
            const q = parseFloat(newItemRows[index].quantity || '0');
            const r = parseFloat(newItemRows[index].rate || '0');
            newItemRows[index].amount = (q * r).toFixed(2);
        }
        
        setItemRows(newItemRows);
        calculateItemTotal(newItemRows);
    };

    const calculateItemTotal = (currentItemRows: any[]) => {
        const tot = currentItemRows.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);
        setTotalAmount(tot.toFixed(2));
        
        // Update the Sales Ledger row amount to match total
        if (rows.length > 0) {
            const newRows = [...rows];
            newRows[0].amount = tot.toFixed(2);
            setRows(newRows);
        }
    };

    const addItemRow = () => {
        setItemRows([...itemRows, { itemId: '', itemName: '', quantity: '', rate: '', amount: '', unit: '' }]);
    };

    const removeItemRow = (index: number) => {
        if (itemRows.length > 1) {
            const newRows = itemRows.filter((_, i) => i !== index);
            setItemRows(newRows);
            calculateItemTotal(newRows);
        }
    };

    const selectLedger = (ledger: Ledger) => {
        if (activeListField === 'account') {
            setPartyLedgerId(ledger.id);
            setAccountSearch(ledger.name);
            setCurrentBalance(`${ledger.currentBalance} ${ledger.currentBalanceType}`);
            setActiveListField(null);
            if (isItemInvoiceMode) {
                itemRowRefs.current.itemName[0]?.focus();
            } else {
                rowRefs.current.ledger[0]?.focus();
            }
        } else if (activeListField?.startsWith('ledger-') || (activeListField && !isNaN(parseInt(activeListField)))) {
            const index = activeListField.startsWith('ledger-') ? parseInt(activeListField.split('-')[1]) : parseInt(activeListField);
            const newRows = [...rows];
            newRows[index].ledgerId = ledger.id;
            newRows[index].ledgerName = ledger.name;
            newRows[index].currentBalance = `Cur Bal: ${ledger.currentBalance} ${ledger.currentBalanceType}`;

            setRows(newRows);
            setActiveListField(null);

            if (isJournalMode) {
                if (newRows[index].drCr === 'By') {
                    rowRefs.current.debit[index]?.focus();
                } else {
                    rowRefs.current.credit[index]?.focus();
                }
            } else {
                rowRefs.current.amount[index]?.focus();
            }
        }
    };

    const selectStockItem = (item: any) => {
        if (!activeListField?.startsWith('itemName-')) return;
        const index = parseInt(activeListField.split('-')[1]);
        const newItemRows = [...itemRows];
        newItemRows[index].itemId = item.id;
        newItemRows[index].itemName = item.name;
        newItemRows[index].unit = item.unit?.symbol || item.Unit?.symbol || 'Nos';
        newItemRows[index].rate = item.standardRate?.toString() || '';
        
        if (newItemRows[index].quantity && newItemRows[index].rate) {
            newItemRows[index].amount = (parseFloat(newItemRows[index].quantity) * parseFloat(newItemRows[index].rate)).toFixed(2);
        }

        setItemRows(newItemRows);
        calculateItemTotal(newItemRows);
        setActiveListField(null);
        
        // Move focus to Quantity
        setTimeout(() => {
            itemRowRefs.current.quantity[index]?.focus();
        }, 10);
    };

    const handleAmountEnter = (index: number) => {
        const nextIndex = index + 1;

        if (isJournalMode) {
            const drTotalVal = rows.reduce((s, r) => s + (parseFloat(r.debitAmount) || 0), 0);
            const crTotalVal = rows.reduce((s, r) => s + (parseFloat(r.creditAmount) || 0), 0);

            if (Math.abs(drTotalVal - crTotalVal) < 0.01 && drTotalVal > 0) {
                narrationRef.current?.focus();
            } else {
                const nextDrCr = drTotalVal > crTotalVal ? 'To' : 'By';
                const newRows = [...rows];
                if (index === rows.length - 1) {
                    newRows.push({ drCr: nextDrCr, ledgerId: '', ledgerName: '', debitAmount: '', creditAmount: '', currentBalance: '' });
                    setRows(newRows);
                }
                setTimeout(() => {
                    rowRefs.current.drCr[nextIndex]?.focus();
                }, 10);
            }
        } else if (isItemInvoiceMode && index !== undefined) {
            // For item rows, if amount is entered, go to next item row
           const newItemRows = [...itemRows];
           const nextIndex = index + 1;
           
           if (index === itemRows.length - 1 && newItemRows[index].itemName) {
               newItemRows.push({ itemId: '', itemName: '', quantity: '', rate: '', amount: '', unit: '' });
               setItemRows(newItemRows);
           }
           
           if (index === itemRows.length - 1 && !newItemRows[index].itemName) {
               // If user presses enter on amount and the same row has no item name, assume they are done
               narrationRef.current?.focus();
           } else {
               setTimeout(() => {
                   itemRowRefs.current.itemName[nextIndex]?.focus();
               }, 10);
           }
            if (['Receipt', 'Payment'].includes(voucherType)) {
                narrationRef.current?.focus();
            } else {
                const newRows = [...rows];
                if (index === rows.length - 1) {
                    newRows.push({ ledgerId: '', ledgerName: '', amount: '', currentBalance: '' });
                    setRows(newRows);
                }
                setTimeout(() => {
                    rowRefs.current.ledger[nextIndex]?.focus();
                }, 10);
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent, field: string, index?: number) => {
        const isItemSearch = activeListField?.startsWith('itemName-');
        const filtered = isItemSearch ? getFilteredStockItems() : getFilteredLedgers();

        if (e.key === 'ArrowDown') {
            if (activeListField !== null) {
                e.preventDefault();
                setSelectedListIndex(prev => Math.min(prev + 1, filtered.length - 1));
            }
        } else if (e.key === 'ArrowUp') {
            if (activeListField !== null) {
                e.preventDefault();
                setSelectedListIndex(prev => Math.max(prev - 1, 0));
            }
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (activeListField !== null && filtered.length > 0) {
                if (isItemSearch) {
                    selectStockItem(filtered[selectedListIndex]);
                } else {
                    selectLedger(filtered[selectedListIndex]);
                }
            } else if (field === 'drCr' && index !== undefined) {
                rowRefs.current.ledger[index]?.focus();
            } else if (field === 'itemName' && index !== undefined) {
                itemRowRefs.current.quantity[index]?.focus();
            } else if (field === 'amount' || field === 'debit' || field === 'credit' || field === 'rate' || field === 'quantity') {
                if (index !== undefined) {
                    if (field === 'quantity') {
                        itemRowRefs.current.rate[index]?.focus();
                    } else if (field === 'rate') {
                        itemRowRefs.current.amount[index]?.focus();
                    } else {
                        handleAmountEnter(index);
                    }
                }
            } else if (field === 'narration') {
                setShowAcceptModal(true);
            } else if (field === 'account') {
                if (isItemInvoiceMode) {
                    itemRowRefs.current.itemName[0]?.focus();
                } else {
                    rowRefs.current.ledger[0]?.focus();
                }
            }
        } else if (e.key === 'Escape') {
            setActiveListField(null);
        } else if (e.altKey && (e.key === 'd' || e.key === 'D')) {
            if (existingVoucherId) {
                e.preventDefault();
                setShowDeleteModal(true);
            }
        }
    };

    const handleSave = async () => {
        // Validation
        if (!partyLedgerId) {
            setError("Please select a Party/Account.");
            return;
        }

        if (isItemInvoiceMode && (!rows[0] || !rows[0].ledgerId)) {
            setError(`Please select a ${voucherType === 'Sales' ? 'Sales' : 'Purchase'} Ledger.`);
            return;
        }

        if (isItemInvoiceMode && itemRows.every(r => !r.itemName)) {
            setError("Please add at least one item.");
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            if (isSingleEntryMode && !partyLedgerId && !isItemInvoiceMode) throw new Error("Please select an Account header.");
            if (isItemInvoiceMode && !partyLedgerId) throw new Error("Please select a Party A/c name.");

            const validVType = voucherTypes.find(v => v.name.toLowerCase() === voucherType.toLowerCase());
            if (!validVType) throw new Error(`Voucher Type '${voucherType}' not found.`);

            let entries = [];
            let itemsPayload: any[] = [];
            
            if (isItemInvoiceMode) {
                // Item Invoice Mode uses Party Ledger as Header and Sales Ledger commonly as bottom row or separate mapping.
                // For simplicity, we create the entries from itemRows summing to Sales, and Header to Party.
                // In a true system, we save Items alongside Voucher
                const totalItemAmount = itemRows.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);
                
                if (totalItemAmount === 0) throw new Error("Please add at least one item with an amount.");
                
                // Add Party Entry
                entries.push({
                    ledgerId: partyLedgerId,
                    entryType: voucherType === 'Sales' ? 'DEBIT' : 'CREDIT',
                    amount: totalItemAmount,
                    description: 'Party Account'
                });
                
                // Add Sales/Purchase Ledger Entry (assume first row in `rows` is the Sales ledger if specified)
                const salesPurchaseLedgerId = rows[0]?.ledgerId;
                if (salesPurchaseLedgerId) {
                     entries.push({
                         ledgerId: salesPurchaseLedgerId,
                         entryType: voucherType === 'Sales' ? 'CREDIT' : 'DEBIT',
                         amount: totalItemAmount,
                         description: `${voucherType} Account`
                     });
                }
                
                itemsPayload = itemRows.filter(r => r.itemName).map(r => ({
                    itemId: r.itemId || undefined,
                    itemName: r.itemName,
                    quantity: parseFloat(r.quantity) || 0,
                    rate: parseFloat(r.rate) || 0,
                    amount: parseFloat(r.amount) || 0,
                    unit: r.unit || 'Nos'
                }));
            } else if (isJournalMode) {
                const drTotalVal = rows.reduce((s, r) => s + (parseFloat(r.debitAmount) || 0), 0);
                const crTotalVal = rows.reduce((s, r) => s + (parseFloat(r.creditAmount) || 0), 0);
                if (Math.abs(drTotalVal - crTotalVal) > 0.01) throw new Error("Total Debit must equal Total Credit.");

                entries = rows.filter(r => r.ledgerId && (r.debitAmount || r.creditAmount)).map(r => ({
                    ledgerId: r.ledgerId,
                    entryType: (r.drCr === 'By' || r.drCr?.toLowerCase() === 'dr') ? 'DEBIT' : 'CREDIT',
                    amount: parseFloat(r.debitAmount || r.creditAmount),
                    description: narration
                }));
            } else {
                entries = rows.filter(r => r.ledgerId && r.amount).map(r => ({
                    ledgerId: r.ledgerId,
                    entryType: isSingleEntryMode && voucherType === 'Payment' ? 'DEBIT' :
                        isSingleEntryMode && voucherType === 'Receipt' ? 'CREDIT' :
                            isSingleEntryMode && voucherType === 'Contra' ? (partyLedgerId ? 'DEBIT' : 'CREDIT') : 'DEBIT',
                    amount: parseFloat(r.amount),
                    description: narration
                }));

                if (isSingleEntryMode && partyLedgerId) {
                    const total = entries.reduce((s, e) => s + Number(e.amount), 0);
                    entries.push({
                        ledgerId: partyLedgerId,
                        entryType: voucherType === 'Payment' ? 'CREDIT' :
                            voucherType === 'Receipt' ? 'DEBIT' : 'CREDIT',
                        amount: total,
                        description: 'Header Account'
                    });
                }
            }

            if (entries.length === 0) throw new Error("Please add at least one valid entry.");

            const payload: any = {
                voucherTypeId: validVType.id,
                voucherDate: new Date(),
                entries,
                narration,
                partyLedgerId: partyLedgerId || undefined
            };
            
            if (isItemInvoiceMode && itemsPayload.length > 0) {
                payload.items = itemsPayload;
            }

            if (existingVoucherId) {
                await updateVoucher(existingVoucherId, payload);
            } else {
                await createVoucher(companyId, payload);
            }
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const ListPanel = () => {
        const isItemSearch = activeListField?.startsWith('itemName-');
        const filtered = isItemSearch ? getFilteredStockItems() : getFilteredLedgers();
        const title = isItemSearch ? "List of Stock Items" : "List of Ledger Accounts";

        return (
            <div className="w-72 bg-[#f0f8ff] border-l border-[#2a5585] flex flex-col h-full shadow-lg">
                <div className="bg-[#2a5585] text-white p-1 font-bold flex justify-between items-center text-xs">
                    <span>{title}</span>
                    <span
                        className="cursor-pointer hover:bg-red-500 px-1.5 transition-colors"
                        onClick={() => setActiveListField(null)}
                    >✕</span>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {!isItemSearch && (
                        <div
                            className="px-2 py-1 text-right text-xs text-[#2a5585] border-b border-dashed border-gray-300 cursor-pointer hover:bg-yellow-100"
                            onClick={() => setShowLedgerCreation(true)}
                        >
                            Create
                        </div>
                    )}
                    {filtered.map((item, i) => (
                        <div
                            key={item.id}
                            className={`px-2 py-0.5 text-xs cursor-pointer ${i === selectedListIndex ? 'bg-[#feba35] font-bold' : 'hover:bg-[#feba35]/30'}`}
                            onClick={() => isItemSearch ? selectStockItem(item) : selectLedger(item)}
                        >
                            {item.name}
                        </div>
                    ))}
                    {filtered.length === 0 && <div className="p-4 text-center text-gray-400 text-xs">No {isItemSearch ? 'items' : 'ledgers'} found</div>}
                </div>
            </div>
        );
    };


    const handleDelete = async () => {
        if (!existingVoucherId) return;
        setIsLoading(true);
        try {
            await deleteVoucher(existingVoucherId);
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const DeleteModal = () => {
        if (!showDeleteModal) return null;
        return (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-[110]">
                <div
                    tabIndex={0}
                    autoFocus
                    className="bg-[#def1fc] border-2 border-[#d32f2f] p-6 w-64 text-center shadow-2xl outline-none"
                    onKeyDown={(e) => {
                        if (e.key === 'y' || e.key === 'Y' || e.key === 'Enter') handleDelete();
                        if (e.key === 'n' || e.key === 'N' || e.key === 'Escape') {
                            setShowDeleteModal(false);
                        }
                    }}
                >
                    <div className="font-bold text-[#d32f2f] text-lg mb-4">Delete Voucher?</div>
                    <div className="flex justify-center gap-8 font-bold">
                        <span className="text-gray-800">Yes or Enter</span>
                        <span className="text-gray-800">No or Esc</span>
                    </div>
                </div>
            </div>
        );
    };

    const AcceptModal = () => {
        if (!showAcceptModal) return null;
        return (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-[100]">
                <div
                    ref={acceptRef}
                    tabIndex={0}
                    className="bg-[#def1fc] border-2 border-[#2a5585] p-6 w-64 text-center shadow-2xl outline-none"
                    onKeyDown={(e) => {
                        if (e.key === 'y' || e.key === 'Y' || e.key === 'Enter') handleSave();
                        if (e.key === 'n' || e.key === 'N' || e.key === 'Escape') {
                            setShowAcceptModal(false);
                            narrationRef.current?.focus();
                        }
                    }}
                >
                    <div className="font-bold text-[#2a5585] text-lg mb-4">Accept?</div>
                    <div className="flex justify-center gap-8 font-bold">
                        <span className="text-gray-800">Yes or Enter</span>
                        <span className="text-gray-800">No or Esc</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-1 w-full font-sans select-none text-[13px] relative bg-[#def1fc] overflow-hidden">
            <div className="flex-1 flex flex-col relative border-r border-[#8cb7c9] overflow-hidden">
                {/* Top Info Bar */}
                <div className="bg-[#2a5585] text-white p-1 flex items-center justify-between h-7 shrink-0">
                    <div className="flex gap-4">
                        <span className="font-bold uppercase bg-white/20 px-2">{voucherType}</span>
                        <span>No. {voucherNumber || '1'}</span>
                    </div>
                    <div className="font-bold absolute left-1/2 transform -translate-x-1/2">{companyName}</div>
                    <div className="flex gap-4 items-center pr-10">
                        <span>{date || '1-Apr-26'}</span>
                        <span className="text-[10px] uppercase opacity-80 font-bold">Tuesday</span>
                    </div>
                    <button onClick={onClose} className="absolute right-0 top-0 h-7 w-8 flex items-center justify-center hover:bg-red-500 font-bold text-lg">×</button>
                </div>

                <div className="flex-1 p-3 flex flex-col overflow-hidden bg-white/40">
                    {/* Account Header for Single Entry Modes or Party Ledger for Item Invoice */}
                    {(isSingleEntryMode || isItemInvoiceMode) && (
                        <div className="flex flex-col mb-4">
                            <div className="flex items-center h-7 w-full">
                                <label className="w-32 text-gray-800 font-semibold">{isItemInvoiceMode ? 'Party A/c name :' : 'Account :'}</label>
                                <div className="relative">
                                    <input
                                        ref={accountRef}
                                        value={accountSearch}
                                        onChange={(e) => {
                                            setAccountSearch(e.target.value);
                                            setActiveListField('account');
                                            setSelectedListIndex(0);
                                        }}
                                        onFocus={() => {
                                            setActiveListField('account');
                                            setSelectedListIndex(0);
                                        }}
                                         onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                if (isItemInvoiceMode && itemRows.length > 0) {
                                                    itemRowRefs.current.itemName[0]?.focus();
                                                } else {
                                                    handleKeyDown(e, 'account');
                                                }
                                            } else {
                                                handleKeyDown(e, 'account');
                                            }
                                        }}
                                        className="w-80 h-6 border border-gray-400 outline-none px-1 shadow-sm font-bold bg-[#fefecd]"
                                        autoFocus
                                    />
                                </div>
                                {isItemInvoiceMode && (
                                    <div className="flex-1 text-right text-gray-800 font-bold pr-4">
                                        Current balance : <span className="text-[11px] text-gray-700 italic font-normal">{currentBalance}</span>
                                    </div>
                                )}
                            </div>
                            {!isItemInvoiceMode && (
                                <div className="flex mt-1">
                                    <label className="w-32 text-gray-500 text-[11px] italic">Current balance :</label>
                                    <div className="text-[11px] font-bold text-gray-700 italic">{currentBalance}</div>
                                </div>
                            )}
                            
                            {isItemInvoiceMode && (
                                <div className="flex items-center h-7 mt-2">
                                     <label className="w-32 text-gray-800 font-semibold">{voucherType === 'Sales' ? 'Sales Ledger :' : 'Purchase Ledger :'}</label>
                                     <div className="relative">
                                        <input
                                            ref={salesLedgerRef}
                                            className={`w-80 h-6 border border-gray-400 outline-none px-1 shadow-sm font-bold ${activeListField === 'salesLedger' ? 'bg-[#fefecd]' : ''}`}
                                            value={rows[0]?.ledgerName || ''}
                                            onChange={(e) => {
                                                const newRows = [...rows];
                                                if (!newRows[0]) newRows[0] = { ledgerId: '', ledgerName: '', amount: '0', currentBalance: '' };
                                                newRows[0].ledgerName = e.target.value;
                                                setRows(newRows);
                                                setActiveListField('salesLedger');
                                                setSelectedListIndex(0);
                                            }}
                                            onFocus={() => {
                                                setActiveListField('salesLedger');
                                                setSelectedListIndex(0);
                                            }}
                                            onKeyDown={(e) => handleKeyDown(e, 'salesLedger')}
                                        />
                                     </div>
                                     <div className="flex-1 text-right text-gray-800 font-bold pr-4">
                                        Current balance : <span className="text-[11px] text-gray-700 italic font-normal">{rows[0]?.currentBalance || ''}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Table Header */}
                    <div className="flex border-t border-b border-gray-400 text-[11px] font-bold text-gray-800 h-6 shrink-0 bg-[#f1f1f1]">
                        {isItemInvoiceMode ? (
                            <>
                                <div className="flex-1 py-1 pl-4 uppercase">Name of Item</div>
                                <div className="w-24 py-1 text-right pr-4 uppercase">Quantity</div>
                                <div className="w-24 py-1 text-right pr-2 uppercase">Rate</div>
                                <div className="w-16 py-1 text-left pl-1 uppercase">per</div>
                                <div className="w-32 py-1 text-right pr-4 uppercase">Amount</div>
                            </>
                        ) : isJournalMode ? (
                            <>
                                <div className="w-12 py-1 pl-1"></div>
                                <div className="flex-1 py-1 pl-4 uppercase">Particulars</div>
                                <div className="w-32 py-1 text-right pr-4 uppercase">Debit</div>
                                <div className="w-32 py-1 text-right pr-4 uppercase">Credit</div>
                            </>
                        ) : (
                            <>
                                <div className="flex-1 py-1 pl-4 uppercase">Particulars</div>
                                <div className="w-32 py-1 text-right pr-4 uppercase">Amount</div>
                            </>
                        )}
                    </div>

                    {/* Rows */}
                    <div className="flex-1 overflow-y-auto bg-white/30 border-b border-gray-300">
                        {isItemInvoiceMode ? (
                            <>
                                {itemRows.map((row: any, i: number) => (
                                    <div key={i} className="flex border-b border-gray-100 min-h-[35px] hover:bg-[#feba35]/10 relative group">
                                        <div className="flex-1 flex flex-col justify-center">
                                            <input
                                                ref={el => itemRowRefs.current.itemName[i] = el}
                                                value={row.itemName || ''}
                                                onChange={e => {
                                                    handleItemRowChange(i, 'itemName', e.target.value);
                                                    setActiveListField(`itemName-${i}`);
                                                }}
                                                onFocus={() => {
                                                    setActiveListField(`itemName-${i}`);
                                                    setSelectedListIndex(0);
                                                }}
                                                onKeyDown={e => {
                                                    if (e.key === 'Enter' && !row.itemName && i > 0) {
                                                        narrationRef.current?.focus();
                                                    } else {
                                                        handleKeyDown(e, 'itemName', i);
                                                    }
                                                }}
                                                className={`w-full h-full bg-transparent outline-none px-4 font-bold ${activeListField === `itemName-${i}` ? 'bg-[#fefecd]' : 'focus:bg-[#fefecd]'}`}
                                                placeholder="Item Name"
                                            />
                                        </div>
                                        <div className="w-24 border-l border-gray-200">
                                            <input
                                                ref={el => itemRowRefs.current.quantity[i] = el}
                                                type="number"
                                                value={row.quantity || ''}
                                                onChange={e => handleItemRowChange(i, 'quantity', e.target.value)}
                                                onKeyDown={e => {
                                                    if (e.key === 'Enter') itemRowRefs.current.rate[i]?.focus();
                                                }}
                                                className="w-full h-full bg-transparent border-none outline-none text-right pr-4 font-bold focus:bg-[#fefecd]"
                                            />
                                        </div>
                                        <div className="w-24 border-l border-gray-200">
                                            <input
                                                ref={el => itemRowRefs.current.rate[i] = el}
                                                type="number"
                                                value={row.rate || ''}
                                                onChange={e => handleItemRowChange(i, 'rate', e.target.value)}
                                                onKeyDown={e => {
                                                    if (e.key === 'Enter') itemRowRefs.current.unit[i]?.focus();
                                                }}
                                                className="w-full h-full bg-transparent border-none outline-none text-right pr-2 font-bold focus:bg-[#fefecd]"
                                            />
                                        </div>
                                        <div className="w-16 border-l border-gray-200">
                                            <input
                                                ref={el => itemRowRefs.current.unit[i] = el}
                                                value={row.unit || ''}
                                                onChange={e => handleItemRowChange(i, 'unit', e.target.value)}
                                                onKeyDown={e => {
                                                    if (e.key === 'Enter') itemRowRefs.current.amount[i]?.focus();
                                                }}
                                                className="w-full h-full bg-transparent border-none outline-none text-left pl-2 font-bold focus:bg-[#fefecd]"
                                            />
                                        </div>
                                        <div className="w-32 border-l border-gray-200">
                                            <input
                                                ref={el => itemRowRefs.current.amount[i] = el}
                                                type="number"
                                                value={row.amount || ''}
                                                onChange={e => handleItemRowChange(i, 'amount', e.target.value)}
                                                onKeyDown={e => {
                                                    if (e.key === 'Enter') {
                                                        if (i === itemRows.length - 1) {
                                                            addItemRow();
                                                            setTimeout(() => itemRowRefs.current.itemName[i + 1]?.focus(), 10);
                                                        } else {
                                                            itemRowRefs.current.itemName[i + 1]?.focus();
                                                        }
                                                    }
                                                }}
                                                className="w-full h-full bg-transparent border-none outline-none text-right pr-4 font-bold focus:bg-[#fefecd]"
                                            />
                                        </div>
                                        <button 
                                            onClick={() => removeItemRow(i)}
                                            className="absolute -left-6 top-1/2 -translate-y-1/2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <>
                                {rows.map((row, i) => (
                                    <div key={i} className="flex border-b border-gray-100 min-h-[35px] hover:bg-[#feba35]/10">
                                        {isJournalMode ? (
                                            <>
                                                <div className="w-12 flex items-center justify-center p-0.5">
                                                    <input
                                                        ref={el => rowRefs.current.drCr[i] = el}
                                                        value={row.drCr || ''}
                                                        onChange={e => {
                                                            const val = e.target.value;
                                                            const newRows = [...rows];
                                                            newRows[i].drCr = val;
                                                            setRows(newRows);
                                                        }}
                                                        onKeyDown={e => handleKeyDown(e, 'drCr', i)}
                                                        className="w-full text-center outline-none bg-transparent font-bold capitalize"
                                                        style={{ backgroundColor: activeListField === `drCr-${i}` ? '#fefecd' : 'transparent' }}
                                                        onFocus={() => {
                                                            setActiveListField(null);
                                                            // Auto-focus ledger on first row if needed, but Tally allows editing drCr
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex-1 flex flex-col justify-center">
                                                    <input
                                                        ref={el => rowRefs.current.ledger[i] = el}
                                                        value={row.ledgerName || ''}
                                                        onChange={e => {
                                                            const newRows = [...rows];
                                                            newRows[i].ledgerName = e.target.value;
                                                            setRows(newRows);
                                                            setActiveListField(String(i));
                                                            setSelectedListIndex(0);
                                                        }}
                                                        onFocus={() => {
                                                            setActiveListField(String(i));
                                                            setSelectedListIndex(0);
                                                        }}
                                                        onKeyDown={e => handleKeyDown(e, 'ledger', i)}
                                                        className={`w-full bg-transparent outline-none px-4 font-bold ${activeListField === String(i) ? 'bg-[#fefecd]' : ''}`}
                                                    />
                                                    {row.currentBalance && (
                                                        <div className="px-8 text-[11px] text-gray-500 italic pb-0.5">{row.currentBalance}</div>
                                                    )}
                                                </div>
                                                <div className="w-32 border-l border-gray-200">
                                                    <input
                                                        ref={el => rowRefs.current.debit[i] = el}
                                                        type="number"
                                                        disabled={row.drCr !== 'By'}
                                                        value={row.debitAmount || ''}
                                                        onChange={e => {
                                                            const newRows = [...rows];
                                                            newRows[i].debitAmount = e.target.value;
                                                            setRows(newRows);
                                                            calculateTotal(newRows);
                                                        }}
                                                        onKeyDown={e => handleKeyDown(e, 'debit', i)}
                                                        className="w-full h-full bg-transparent border-none outline-none text-right pr-4 font-bold focus:bg-[#fefecd] disabled:bg-gray-50/10"
                                                        onFocus={() => setActiveListField(null)}
                                                    />
                                                </div>
                                                <div className="w-32 border-l border-gray-200">
                                                    <input
                                                        ref={el => rowRefs.current.credit[i] = el}
                                                        type="number"
                                                        disabled={row.drCr === 'By'}
                                                        value={row.creditAmount || ''}
                                                        onChange={e => {
                                                            const newRows = [...rows];
                                                            newRows[i].creditAmount = e.target.value;
                                                            setRows(newRows);
                                                            calculateTotal(newRows);
                                                        }}
                                                        onKeyDown={e => handleKeyDown(e, 'credit', i)}
                                                        className="w-full h-full bg-transparent border-none outline-none text-right pr-4 font-bold focus:bg-[#fefecd] disabled:bg-gray-50/10"
                                                        onFocus={() => setActiveListField(null)}
                                                    />
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex-1 flex flex-col justify-center">
                                                    <input
                                                        ref={el => rowRefs.current.ledger[i] = el}
                                                        value={row.ledgerName || ''}
                                                        onChange={e => {
                                                            const newRows = [...rows];
                                                            newRows[i].ledgerName = e.target.value;
                                                            setRows(newRows);
                                                            setActiveListField(String(i));
                                                            setSelectedListIndex(0);
                                                        }}
                                                        onFocus={() => {
                                                            setActiveListField(String(i));
                                                            setSelectedListIndex(0);
                                                        }}
                                                        onKeyDown={e => handleKeyDown(e, 'ledger', i)}
                                                        className={`w-full h-full bg-transparent outline-none px-4 font-bold ${activeListField === String(i) ? 'bg-[#fefecd]' : ''}`}
                                                    />
                                                    {row.currentBalance && activeListField !== String(i) && (
                                                        <div className="px-4 text-[11px] text-gray-500 italic pb-0.5">{row.currentBalance}</div>
                                                    )}
                                                </div>
                                                <div className="w-32 border-l border-gray-200">
                                                    <input
                                                        ref={el => rowRefs.current.amount[i] = el}
                                                        type="number"
                                                        value={row.amount || ''}
                                                        onChange={e => {
                                                            const newRows = [...rows];
                                                            newRows[i].amount = e.target.value;
                                                            setRows(newRows);
                                                            calculateTotal(newRows);
                                                        }}
                                                        onKeyDown={e => handleKeyDown(e, 'amount', i)}
                                                        className="w-full h-full bg-transparent border-none outline-none text-right pr-4 font-bold focus:bg-[#fefecd]"
                                                        onFocus={() => setActiveListField(null)}
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </>
                        )}
                    </div>

                    <div className="mt-auto pt-2 flex flex-col shrink-0">
                        <div className="flex justify-between items-end">
                            <div className="flex flex-col w-3/4">
                                <div className="flex items-center">
                                    <label className="text-xs font-bold w-20">Narration:</label>
                                    <textarea
                                        ref={narrationRef}
                                        value={narration}
                                        onChange={e => setNarration(e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(e, 'narration')}
                                        className="flex-1 h-10 border border-gray-400 p-1 resize-none outline-none font-bold bg-[#fefecd]"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col items-end w-1/4 pb-2 pr-4">
                                {isJournalMode ? (
                                    <div className="flex gap-1 items-end">
                                        <div className="text-right">
                                            <div className="text-[10px] text-gray-500 uppercase">Debit</div>
                                            <div className="text-lg font-bold text-gray-800">{totalDebit}</div>
                                        </div>
                                        <div className="text-right ml-8">
                                            <div className="text-[10px] text-gray-500 uppercase">Credit</div>
                                            <div className="text-lg font-bold text-gray-800">{totalCredit}</div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-xl font-bold text-gray-800">
                                        <span className="text-xs mr-2 font-normal">Total:</span>
                                        {totalAmount}
                                    </div>
                                )}
                            </div>
                        </div>
                        {error && <div className="text-red-600 text-[10px] font-bold px-2">{error}</div>}
                    </div>
                </div>

                <div className="bg-[#def1fc] text-[10px] p-0.5 px-4 flex gap-4 text-[#2a5585] border-t border-[#8cb7c9] shrink-0 h-6 items-center">
                    <span className="cursor-pointer" onClick={onClose}><u>Q</u>: Quit</span>
                    <span className="px-1 bg-[#2a5585] text-white cursor-pointer" onClick={() => setShowAcceptModal(true)}><u>A</u>: Accept</span>
                    {existingVoucherId && (
                        <span className="cursor-pointer text-[#d32f2f] font-bold" onClick={() => setShowDeleteModal(true)}><u>D</u>: Delete</span>
                    )}
                    <span className="cursor-pointer"><u>X</u>: Cancel</span>
                </div>
            </div>

            {activeListField !== null && (
                <div className="shrink-0 flex flex-col h-full bg-[#d6ebf5]">
                    <ListPanel />
                </div>
            )}

            <AcceptModal />
            <DeleteModal />

            {showLedgerCreation && (
                <div className="absolute inset-0 z-[120] bg-white">
                    <TallyLedgerCreation
                        onClose={() => {
                            setShowLedgerCreation(false);
                            loadData();
                        }}
                        companyName={companyName}
                        companyId={companyId}
                    />
                </div>
            )}
        </div>
    );
};

export default AccountingVoucherCreation;
