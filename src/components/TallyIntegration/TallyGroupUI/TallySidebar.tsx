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
            if (keyName.startsWith('F') && keyName.length <= 3) {
                const fKeyNumber = parseInt(keyName.substring(1));
                if (fKeyNumber >= 2 && fKeyNumber <= 12) {
                    if (e.key === keyName) {
                        e.preventDefault();
                        onClick();
                    }
                }
            }
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
            className={`relative bg-transparent group px-[2px] mb-[1px] w-full text-left text-[11px] ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} flex items-center h-[28px] transition-colors duration-75`}
            onClick={onClick}
            disabled={disabled}
        >
            <div className={`flex flex-row items-center w-full h-full pl-1.5 bg-white border border-[#99b9cc] rounded-[2px] relative pr-5 shadow-sm ${disabled ? 'opacity-50' : 'group-hover:border-[#2a5585]'}`}>
                <div className="flex items-center w-full overflow-hidden">
                    {keyName && (
                        <div className={`font-black leading-none inline-block ${keyColor} mr-2 flex flex-col items-center justify-center text-[10px]`}>
                            <span className="leading-none tracking-tighter">{keyName}</span>
                            {underline === 'single' && <div className={`h-[1.5px] w-full ${disabled ? 'bg-gray-400' : 'bg-[#1d5b6e]'} mt-[1px]`}></div>}
                            {underline === 'double' && (
                                <div className="flex flex-col w-full -gap-[1px]">
                                    <div className={`h-[1px] w-full ${disabled ? 'bg-gray-400' : 'bg-[#1d5b6e]'} mt-[1px]`}></div>
                                    <div className={`h-[1px] w-full ${disabled ? 'bg-gray-400' : 'bg-[#1d5b6e]'} mt-[1px]`}></div>
                                </div>
                            )}
                        </div>
                    )}
                    <span className={`${labelColor} leading-tight whitespace-nowrap overflow-hidden text-ellipsis font-bold uppercase tracking-tight text-[10px]`}>{label || '\u00A0'}</span>
                </div>

                {/* Right indicator area */}
                <div className={`absolute right-0 top-0 bottom-0 w-[16px] flex items-center justify-center bg-[#f0f9fc] border-l border-[#99b9cc] ${disabled ? 'text-gray-300' : 'text-[#2a5585] group-hover:bg-[#def1fc]'}`}>
                    <span className="text-[12px] font-black leading-none">›</span>
                </div>
            </div>
        </button>
    );
};

export const TallySidebar = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="w-[130px] bg-[#f2f7f9] border-l border-[#99c7d6] flex flex-col h-full pt-1 relative z-20 shrink-0">
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {children}
            </div>
        </div>
    );
};

export default TallySidebar;
