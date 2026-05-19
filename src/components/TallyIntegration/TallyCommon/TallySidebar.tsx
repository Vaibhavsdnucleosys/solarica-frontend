import React, { useEffect } from 'react';

export interface SidebarButtonProps {
    keyName: string;
    label: string;
    disabled?: boolean;
    onClick?: () => void;
    underline?: 'single' | 'double' | 'none';
}

export const SidebarButton = ({ keyName, label, disabled, onClick, underline = 'none' }: SidebarButtonProps) => {
    // Colors
    const keyColor = disabled ? 'text-gray-400' : 'text-[#1d5b6e]';
    const labelColor = disabled ? 'text-gray-400' : 'text-black';

    // Register keyboard shortcut
    useEffect(() => {
        if (disabled || !onClick) return;

        const handleKeyPress = (e: KeyboardEvent) => {
            // Handle F-keys (F2-F12)
            if (keyName.startsWith('F') && keyName.length <= 3) {
                if (e.key === keyName) {
                    e.preventDefault();
                    onClick();
                }
            }
            // Handle single letter shortcuts (case insensitive)
            else if (keyName.length === 1 && !e.altKey && !e.ctrlKey && !e.metaKey) {
                if (e.key && keyName && e.key.toLowerCase() === keyName.toLowerCase()) {
                    const target = e.target as HTMLElement;
                    if (target && (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA')) {
                        e.preventDefault();
                        onClick();
                    }
                }
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [keyName, disabled, onClick]);

    return (
        <button
            className={`relative px-1 mb-[1px] w-full text-left text-[12px] flex items-center min-h-[32px] group
                transition-all duration-150
                ${disabled ? 'opacity-40 pointer-events-none' : 'hover:translate-x-[-2px] cursor-pointer'}`}
            onClick={onClick}
            disabled={disabled}
        >
            <div className={`flex flex-col justify-center w-full h-full pl-2 pr-4 relative rounded-[3px]
                border transition-all duration-150
                ${disabled
                    ? 'bg-[#f5fbfd] border-[#c0dcea]'
                    : 'bg-gradient-to-r from-white via-[#f4fbff] to-[#eaf6fc] border-[#9ecce0] group-hover:border-[#5ea4d6] group-hover:shadow-[0_1px_6px_rgba(94,164,214,0.2)] shadow-sm'
                }`}
            >
                {keyName && (
                    <div className={`font-black leading-none mt-[2px] mb-[1px] flex flex-col items-start w-fit text-[11px]
                        ${disabled ? 'text-gray-400' : 'text-[#1a6080] group-hover:text-[#0e4f68]'}`}
                    >
                        <span>{keyName}</span>
                        {underline === 'single' && <div className="h-[1.5px] w-full bg-[#1a6080] mt-[1px]" />}
                        {underline === 'double' && (
                            <div className="flex flex-col w-full gap-[1.5px] mt-[1px]">
                                <div className="h-[1px] w-full bg-[#1a6080]" />
                                <div className="h-[1px] w-full bg-[#1a6080]" />
                            </div>
                        )}
                    </div>
                )}
                <span className={`leading-tight text-[11px] font-semibold truncate
                    ${disabled ? 'text-gray-400' : 'text-[#1c2e38] group-hover:text-[#0d3a50]'}`}>
                    {label || '\u00A0'}
                </span>
                {/* Right arrow tab */}
                <div className={`absolute right-0 top-0 bottom-0 w-[13px] flex items-center justify-center rounded-r-[3px] border-l
                    transition-colors duration-150
                    ${disabled
                        ? 'bg-[#ecf7fb] border-[#c0dcea] text-gray-400'
                        : 'bg-[#d4eef8] border-[#9ecce0] text-[#2d819b] group-hover:bg-[#b8e2f5] group-hover:border-[#5ea4d6]'
                    }`}
                >
                    <span className="text-[10px] font-black">›</span>
                </div>
            </div>
        </button>
    );
};

interface TallySidebarProps {
    buttons?: (SidebarButtonProps | { label: 'SEPARATOR' | 'SPACER' })[];
    children?: React.ReactNode;
}

const TallySidebar: React.FC<TallySidebarProps> = ({ buttons = [], children }) => {
    return (
        <div className="w-[140px] bg-[#e8f6fa] flex flex-col pb-1 h-full border-l border-[#a0cbe0] overflow-y-auto no-scrollbar shrink-0 shadow-lg">
            {buttons && buttons.map((btn, index) => {
                if ('label' in btn && btn.label === 'SEPARATOR') {
                    return <div key={index} className="h-[1px] bg-[#a0cbe0] my-1 mx-2 opacity-50" />;
                }
                if ('label' in btn && btn.label === 'SPACER') {
                    return <div key={index} className="flex-1" />;
                }
                const button = btn as SidebarButtonProps;
                return (
                    <SidebarButton
                        key={index}
                        keyName={button.keyName}
                        label={button.label}
                        disabled={button.disabled}
                        onClick={button.onClick}
                        underline={button.underline}
                    />
                );
            })}
            {children}
        </div>
    );
};

export default TallySidebar;
