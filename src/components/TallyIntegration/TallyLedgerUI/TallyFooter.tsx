import React from 'react';

export const FooterItem = ({ keyName, label, icon = '^', onClick }: { keyName: string, label: string, icon?: string, onClick?: () => void }) => (
    <div className="h-full flex items-center px-[2px] bg-gradient-to-br from-white to-[#e8f6fa] border-r border-[#a0cbe0] cursor-pointer hover:bg-[#dceef5] active:bg-[#c0e0f0] min-w-fit mx-[1px] relative group shrink-0 transition-colors duration-150" onClick={onClick}>
        <span className="text-[#1d5b6e] font-bold mr-[1px] underline decoration-double text-[9px] sm:text-[10px] lg:text-[11px]">{keyName}</span>
        <span className="text-black text-[9px] sm:text-[10px] lg:text-[11px] pr-1 whitespace-nowrap hidden sm:inline">: {label}</span>
        <span className="text-black text-[9px] sm:hidden pr-1">{label.charAt(0)}</span>
        <span className="text-[8px] sm:text-[9px] text-[#2d819b] font-bold absolute right-[1px] bottom-0">{icon}</span>
    </div>
);

export const FooterEmptyItem = () => (
    <div className="flex-1 h-full mx-[1px] border-r border-[#a0cbe0] bg-gradient-to-br from-white to-[#e8f6fa] relative min-w-[10px] sm:min-w-[20px]">
        <span className="text-[8px] sm:text-[9px] text-[#2d819b] font-bold absolute right-[1px] bottom-0">^</span>
    </div>
);

export const TallyFooter = ({ children, countInfo }: { children: React.ReactNode, countInfo?: string }) => {
    return (
        <div className="absolute bottom-0 w-full flex flex-col z-10 font-sans">
            {/* Count Badge (sitting above footer) if provided */}
            {countInfo && (
                <div className="bg-white px-2 py-1 font-bold text-[10px] sm:text-[11px] lg:text-[12px] border-t border-[#99c7d6] flex items-center">
                    {countInfo}
                </div>
            )}

            {/* Footer Bar */}
            <div className="bg-[#f3f8fa] h-[32px] sm:h-[28px] lg:h-[26px] flex items-center px-[2px] text-[10px] sm:text-[11px] lg:text-[12px] w-full border-t border-[#99c7d6] select-none overflow-x-auto custom-scrollbar">
                {children}
            </div>
        </div>
    );
};

export default TallyFooter;

