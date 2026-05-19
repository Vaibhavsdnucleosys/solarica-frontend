import React from 'react';

export interface SidebarButtonProps {
    keyName: string;
    label: string;
    disabled?: boolean;
    underline?: 'single' | 'double' | 'none';
    onClick?: () => void;
}

export const SidebarButton = ({ keyName, label, disabled, underline = 'none', onClick }: SidebarButtonProps) => {
    // Colors
    const keyColor = disabled ? 'text-gray-400' : 'text-[#1d5b6e]';
    const labelColor = disabled ? 'text-gray-400' : 'text-black';

    // Register keyboard shortcut
    React.useEffect(() => {
        if (disabled || !onClick) return;

        const handleKeyPress = (e: KeyboardEvent) => {
            // Handle F-keys (F2-F12)
            if (keyName.startsWith('F') && keyName.length <= 3) {
                const fKeyNumber = parseInt(keyName.substring(1));
                if (fKeyNumber >= 2 && fKeyNumber <= 12) {
                    if (e.key === keyName) {
                        e.preventDefault();
                        onClick();
                    }
                }
            }
            // Handle single letter shortcuts (case insensitive)
            else if (keyName.length === 1 && !e.altKey && !e.ctrlKey && !e.metaKey) {
                if (e.key && keyName && e.key.toLowerCase() === keyName.toLowerCase()) {
                    // Only trigger if not typing in an input
                    const target = e.target as HTMLElement;
                    if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
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
            className={`relative bg-transparent group px-1 mb-[1px] w-full text-left text-[10px] sm:text-[11px] lg:text-[12px] ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'} flex items-center min-h-[36px] sm:min-h-[30px] lg:min-h-[26px] ${!disabled && 'hover:bg-[#dceef5] active:bg-[#c0e0f0]'} transition-colors duration-150`}
            onClick={onClick}
            disabled={disabled}
            title={disabled ? '' : `Press ${keyName}`}
        >
            {/* Button Box Content */}
            <div className={`flex flex-row items-center w-full h-full pl-1 bg-gradient-to-r from-white to-[#f0f9fc] border border-[#a0cbe0] rounded-[2px] shadow-sm relative pr-2 sm:pr-3 ${!disabled && 'group-hover:shadow-md group-active:shadow-inner'} transition-shadow duration-150`}>
                {keyName && (
                    <div className={`font-bold leading-none inline-block ${keyColor} mr-1 flex flex-col items-center justify-center text-[9px] sm:text-[10px] lg:text-[11px]`}>
                        <span className="leading-none">{keyName}</span>
                        {underline === 'single' && <div className={`h-[1px] w-full ${disabled ? 'bg-gray-400' : 'bg-[#1d5b6e]'} mt-[0px]`}></div>}
                        {underline === 'double' && (
                            <div className="flex flex-col w-full">
                                <div className={`h-[1px] w-full ${disabled ? 'bg-gray-400' : 'bg-[#1d5b6e]'} mt-[0px]`}></div>
                                <div className={`h-[1px] w-full ${disabled ? 'bg-gray-400' : 'bg-[#1d5b6e]'} mt-[1px]`}></div>
                            </div>
                        )}
                    </div>
                )}
                {/* For empty labels (disabled fillers), we keep height with nbsp */}
                <span className={`${labelColor} leading-tight whitespace-nowrap overflow-hidden text-ellipsis`}>{label || '\u00A0'}</span>

                {/* The Right Chevron Indicator */}
                <div className={`absolute right-0 top-0 bottom-0 w-[12px] sm:w-[13px] lg:w-[14px] flex items-center justify-center bg-[#e0f3f9] border-l border-[#a0cbe0] ${disabled ? 'text-gray-400' : 'text-[#2d819b]'}`}>
                    <span className="text-[8px] sm:text-[9px] lg:text-[10px] font-bold">‹</span>
                </div>
            </div>
        </button>
    );
};

export const TallySidebar = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="w-[100px] sm:w-[120px] lg:w-[140px] bg-[#f2f7f9] border-l border-[#99c7d6] flex flex-col pt-[2px] relative z-20 transition-all duration-200">
            {children}
        </div>
    );
};

export default TallySidebar;
