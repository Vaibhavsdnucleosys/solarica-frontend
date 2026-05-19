import React, { useState, useEffect } from 'react';
import TallyHeader from './components/TallyHeader';
import TallyFooter, { FooterItem, FooterEmptyItem } from './components/TallyFooter';
import TallySidebar from '../TallyCommon/TallySidebar';
import { GenericModal } from '../TallyCommon/TallySidebarModals';
import TallyCommonModals from './components/TallyCommonModals';
import AccountingVoucherCreation from './components/AccountingVoucherCreation';
import { getVoucherTypes } from '../../../services/accountingService';
import { Loader2 } from 'lucide-react';
import './index.css';

type ViewMode = 'voucher' | 'createCompany' | 'features';

interface TallyVoucherViewProps {
  onQuit: () => void;
  initialView?: ViewMode;
  mode?: 'list' | 'alter' | 'create';
  companyId: string;
  companyName?: string;
  voucherId?: string;
  voucherType?: string;
  sourceProformaId?: string;
  sourceType?: 'quotation' | 'invoice';
  companies?: Array<{ id?: string; name: string; date: string }>;
  onCompanyChange?: (id: string, name: string) => void;
}

const TallyVoucherView: React.FC<TallyVoucherViewProps> = ({
  onQuit,
  initialView = 'voucher',
  mode,
  companyId,
  companyName = 'Solarica',
  voucherId,
  voucherType,
  sourceProformaId,
  sourceType,
  companies = [],
  onCompanyChange
}) => {
  const [currentView] = useState<ViewMode>(initialView);
  const [activeVoucherMode, setActiveVoucherMode] = useState(voucherType || 'Payment');
  const [voucherTypes, setVoucherTypes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCompanyModal, setShowCompanyModal] = useState(false);


  // Shared Sidebar State
  const [activeModal, setActiveModal] = useState<{ title: string, content: React.ReactNode } | null>(null);

  useEffect(() => {
    const loadTypes = async () => {
      try {
        const types = await getVoucherTypes(companyId);
        setVoucherTypes(types);

        // If "Payment" exists, set it as default
        const pmt = types.find((t: any) => t.category === 'PAYMENT' || t.name === 'Payment');
        if (pmt && !voucherType) setActiveVoucherMode(pmt.name);
      } catch (err) {
        console.error("Failed to load voucher types", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadTypes();
  }, [companyId, voucherType]);

  const handleCompanySelect = (id: string, name: string) => {
    if (onCompanyChange) {
      onCompanyChange(id, name);
    }
    setShowCompanyModal(false);
  };

  const voucherSidebarButtons: any[] = [
    { keyName: 'F2', label: 'Date', onClick: () => { } },
    { keyName: 'F3', label: 'Company', onClick: () => setShowCompanyModal(true) },
    { keyName: 'F4', label: 'Contra', onClick: () => setActiveVoucherMode('Contra') },
    { keyName: 'F5', label: 'Payment', onClick: () => setActiveVoucherMode('Payment') },
    { keyName: 'F6', label: 'Receipt', onClick: () => setActiveVoucherMode('Receipt') },
    { keyName: 'F7', label: 'Journal', onClick: () => setActiveVoucherMode('Journal') },
    { keyName: 'F8', label: 'Sales', onClick: () => setActiveVoucherMode('Sales') },
    { keyName: 'F9', label: 'Purchase', onClick: () => setActiveVoucherMode('Purchase') },
    { keyName: 'F10', label: 'Other Vouchers', onClick: () => { } },
    { keyName: 'SPACER', label: 'SPACER' },
    { keyName: 'H', label: 'Change Mode' },
    { keyName: 'I', label: 'More Details' },
    { keyName: 'SPACER', label: 'SPACER' },
    { keyName: 'Q', label: 'Quit', onClick: onQuit, underline: 'single' }
  ];

  if (isLoading) return (
    <div className="flex flex-col h-screen w-screen items-center justify-center bg-[#def1fc]">
      <Loader2 className="w-12 h-12 text-[#2a5585] animate-spin mb-4" />
      <span className="font-bold text-[#274e79] text-lg">Initializing Accounting Vouchers...</span>
    </div>
  );

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#d4e4f7] font-sans text-[13px] relative">
      <TallyHeader onMenuOptionClick={() => { }} />
      <GenericModal activeModal={activeModal} onClose={() => setActiveModal(null)} />

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden">
          <AccountingVoucherCreation
            voucherType={activeVoucherMode}
            onClose={onQuit}
            companyName={companyName}
            companyId={companyId}
            existingVoucherId={voucherId}
            sourceProformaId={sourceProformaId}
            sourceType={sourceType}
            mode={mode === 'alter' ? 'alter' : 'create'}
          />
        </div>

        <TallySidebar buttons={voucherSidebarButtons} />
      </div>

      <TallyFooter>
        <FooterItem keyName="F1" label="Help" />
        <FooterItem keyName="F11" label="Features" onClick={() => { }} />
        <FooterEmptyItem />
        <FooterEmptyItem />
        <FooterEmptyItem />
        <FooterEmptyItem />
        <FooterEmptyItem />
        <FooterEmptyItem />
        <FooterEmptyItem />
        <FooterEmptyItem />
        <FooterEmptyItem />
        <FooterItem keyName="Q" label="Quit" onClick={onQuit} />
      </TallyFooter>

      <TallyCommonModals
        showExportCurrentModal={false} setShowExportCurrentModal={() => { }}
        showPrintModal={false} setShowPrintModal={() => { }}
        showPrintReportModal={false} setShowPrintReportModal={() => { }}
        showPrintConfigModal={false} setShowPrintConfigModal={() => { }}
        showCompanyModal={showCompanyModal} setShowCompanyModal={setShowCompanyModal}
        openCompanies={companies.map(c => ({ name: c.name, number: c.id || '10000' }))}
        currentCompany={companyName}
        setCurrentCompany={(name: string) => {
          const found = companies.find(c => c.name === name);
          if (found && onCompanyChange) {
            onCompanyChange(found.id || '', found.name);
          }
        }}
      />
    </div>
  );
};

export default TallyVoucherView;
