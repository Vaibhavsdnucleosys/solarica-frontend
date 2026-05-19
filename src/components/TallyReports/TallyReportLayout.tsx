import React from 'react';
import TallyHeader from '../TallyIntegration/TallyGroupUI/TallyHeader';
import TallySidebar, { SidebarButtonProps } from '../TallyIntegration/TallyCommon/TallySidebar';
import { X } from 'lucide-react';

interface TallyReportLayoutProps {
    title: string;
    companyName: string;
    period?: string;
    onBack: () => void;
    children: React.ReactNode;
    sidebarButtons?: (SidebarButtonProps | { label: 'SEPARATOR' | 'SPACER' })[];
    bottomShortcuts?: { key: string, label: string }[];
}

const TallyReportLayout: React.FC<TallyReportLayoutProps> = ({
    title,
    companyName,
    period,
    onBack,
    children,
    sidebarButtons,
    bottomShortcuts
}) => {
    const defaultSidebarButtons: (SidebarButtonProps | { label: 'SEPARATOR' | 'SPACER' })[] = [
        { keyName: 'F2', label: 'Period', underline: 'none' },
        { keyName: 'F3', label: 'Company', underline: 'none' },
        { keyName: 'F4', label: '', disabled: true },
        { label: 'SEPARATOR' },
        { keyName: 'F5', label: '', underline: 'single' },
        { keyName: 'F6', label: '', underline: 'single' },
        { keyName: 'F7', label: '', underline: 'single' },
        { keyName: 'F8', label: 'Valuation', underline: 'single' },
        { keyName: 'F9', label: '', underline: 'single' },
        { keyName: 'F10', label: '', underline: 'single' },
        { label: 'SEPARATOR' },
        { keyName: 'B', label: 'Basis of Values', underline: 'single' },
        { keyName: 'H', label: 'Change View', underline: 'single' },
        { keyName: 'J', label: 'Exception Reports', underline: 'single' },
        { keyName: 'L', label: 'Save View', underline: 'single' },
        { label: 'SEPARATOR' },
        { keyName: 'E', label: 'Apply Filter', underline: 'single' },
        { keyName: 'E', label: 'Filter Details', underline: 'double' },
        { label: 'SEPARATOR' },
        { keyName: 'C', label: 'New Column', underline: 'none' },
        { keyName: 'A', label: 'Alter Column', underline: 'none' },
        { keyName: 'D', label: 'Delete Column', underline: 'none' },
        { keyName: 'N', label: 'Auto Column', underline: 'none' },
        { label: 'SPACER' },
        { keyName: 'F12', label: 'Configure', underline: 'none' },
    ];

    const defaultBottomShortcuts = [
        { key: 'Q', label: 'Quit' },
        { key: 'Space', label: 'Select' },
        { key: 'R', label: 'Remove Line' },
        { key: 'U', label: 'Restore Line' },
    ];

    const shortcuts = bottomShortcuts || defaultBottomShortcuts;

    return (
        <div className="flex flex-col h-screen w-full bg-white font-sans text-sm select-none overflow-hidden relative">
            {/* Top Header Section - Reusing TallyHeader */}
            <div className="flex flex-col shrink-0 z-50">
                <TallyHeader />
            </div>

            {/* Blue Banner Header - matches Image 1 */}
            <div className="bg-[#8ec2eb] text-[#1b2c3c] text-[11px] font-bold px-2 py-0.5 flex items-center justify-between border-b border-[#5ea4d6] shrink-0">
                <div className="flex items-center gap-2">
                    <span className="uppercase">{title}</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                        <div className="w-[1px] h-3 bg-[#5ea4d6] mx-2"></div>
                        <span className="text-[#1b2c3c]">{companyName}</span>
                        <div className="w-[1px] h-3 bg-[#5ea4d6] mx-2"></div>
                    </div>
                    <button onClick={onBack} className="hover:bg-black/10 p-0.5 rounded transition-colors">
                        <X size={14} className="text-[#1b2c3c]" />
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-1 overflow-hidden bg-[#def1fc]">
                {/* Content Container */}
                <div className="flex-1 flex flex-col overflow-hidden relative border-r border-[#88b5dd]">
                    <div className="flex-1 bg-white overflow-auto">
                        {children}
                    </div>

                    {/* Tally Style Bottom Shortcut Bar - matches Image 1 */}
                    <div className="h-[24px] bg-[#def1fc] border-t border-[#88b5dd] flex items-center px-1 shrink-0 overflow-hidden">
                        <div className="flex items-center gap-4 w-full">
                            {shortcuts.map((s, idx) => (
                                <div key={idx} className="flex items-center gap-1 text-[11px] font-bold text-[#2a5585] whitespace-nowrap">
                                    <span className="underline underline-offset-2">{s.key.charAt(0)}</span>
                                    <span>{s.key.length > 1 ? s.key.substring(s.key.length > 1 && s.key !== 'Space' ? 0 : 0) : ''}:</span>
                                    <span className="text-[#1b2c3c]">{s.label}</span>
                                </div>
                            ))}
                            <div className="flex-1"></div>
                            <div className="flex items-center gap-1 text-[11px] font-bold text-[#2a5585]">
                                <span className="underline underline-offset-2">F12</span>
                                <span>:</span>
                                <span className="text-[#1b2c3c]">Configure</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar - Reusing TallySidebar */}
                <TallySidebar buttons={sidebarButtons || defaultSidebarButtons} />
            </div>
        </div>
    );
};

export default TallyReportLayout;