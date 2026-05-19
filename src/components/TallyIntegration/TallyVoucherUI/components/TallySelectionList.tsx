import React from 'react';

interface TallySelectionListProps {
    title: string;
    items: string[];
    selectedItem: string;
    onSelect: (item: string) => void;
    width?: string;
    height?: string;
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
    position?: 'absolute' | 'fixed';
    addNewLabel?: string;
    onAddNew?: () => void;
    showMoreLabel?: string;
    onShowMore?: () => void;
    onClose?: () => void;
}

export const TallySelectionList: React.FC<TallySelectionListProps> = ({
    title,
    items,
    selectedItem,
    onSelect,
    width = '250px',
    height = '300px', // Default consistent height
    top,
    left,
    right,
    bottom,
    position = 'absolute',
    addNewLabel,
    onAddNew,
    showMoreLabel,
    onShowMore,
    onClose
}) => {
    return (
        <div
            className={`z-[100] shadow-[0_0_15px_rgba(0,0,0,0.2)] border border-[#2d819b] bg-[#e8f6fa] flex flex-col font-sans text-[13px] leading-tight overflow-hidden`}
            style={{ width, height, top, left, right, bottom, position }}
            onMouseDown={(e) => e.preventDefault()} // Prevent taking focus away from input
            onClick={(e) => e.stopPropagation()}
        >
            {/* Header */}
            <div className="bg-[#2d819b] text-white px-2 py-1 font-bold flex justify-between items-center select-none border-b border-[#1b5e6b]">
                <span>{title}</span>
                <span
                    className="cursor-pointer hover:bg-red-500 px-1.5 leading-none h-full flex items-center transition-colors"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (onClose) {
                            onClose();
                        } else {
                            onSelect(selectedItem);
                        }
                    }}
                >✕</span>
            </div>

            {/* Actions Panel */}
            {(addNewLabel || showMoreLabel) && (
                <div className="flex flex-col text-right bg-[#e8f6fa] border-b border-[#9bc9d9]">
                    {addNewLabel && (
                        <div
                            className="px-2 py-0.5 cursor-pointer hover:bg-white text-[#1d5b6e] font-normal"
                            onClick={(e) => {
                                e.stopPropagation();
                                onAddNew && onAddNew();
                            }}
                        >
                            {addNewLabel}
                        </div>
                    )}
                    {showMoreLabel && (
                        <div
                            className="px-2 py-0.5 cursor-pointer hover:bg-white text-[11px] text-[#1d5b6e] font-normal"
                            onClick={(e) => {
                                e.stopPropagation();
                                onShowMore && onShowMore();
                            }}
                        >
                            {showMoreLabel}
                        </div>
                    )}
                </div>
            )}

            {/* List Items */}
            <div className="flex-1 overflow-y-auto bg-[#e8f6fa] select-none scrollbar-hide">
                {items.map((item, idx) => (
                    <div
                        key={idx}
                        className={`px-2 py-[2px] cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis ${item === selectedItem
                            ? 'bg-[#feba35] text-black font-bold border-b border-[#feba35]'
                            : 'hover:bg-[#dceef5] text-black border-b border-transparent'
                            }`}
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelect(item);
                        }}
                    >
                        {item === 'Not Applicable' ? '♦ Not Applicable' : item}
                    </div>
                ))}
            </div>
        </div>
    );
};
