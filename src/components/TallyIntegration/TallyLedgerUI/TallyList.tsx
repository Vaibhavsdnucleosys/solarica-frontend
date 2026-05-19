import React from 'react';
import type { LedgerItem } from './types';

interface TallyListProps {
    data: LedgerItem[];
    selectedItem: string;
    onItemClick: (item: LedgerItem) => void;
    onItemHover: (name: string) => void;
}

const TallyList: React.FC<TallyListProps> = ({ data, selectedItem, onItemClick, onItemHover }) => {

    const renderTree = (items: LedgerItem[], level = 0) => {
        return items.map((item) => (
            <React.Fragment key={item.id}>
                <div
                    className={`cursor-pointer flex items-center leading-none py-1 transition-all duration-100 rounded-sm mx-1 ${item.name === selectedItem ? 'tally-list-item-selected ring-1 ring-yellow-500' : 'font-normal text-gray-800 hover:bg-yellow-50 hover:text-black hover:font-bold'}`}
                    style={{ paddingLeft: `${level === 0 ? 12 : level * 24}px` }}
                    onClick={() => onItemClick(item)}
                    onMouseEnter={() => onItemHover(item.name)}
                >
                    <span
                        className={`
                            whitespace-nowrap transition-transform duration-100
                            ${item.italic ? 'italic' : ''}
                            ${item.type === 'category' ? 'text-lg tracking-tight' : 'text-[15px]'}
                            ${(item.type === 'group' || item.type === 'category' || item.name === selectedItem) ? 'font-bold' : 'font-medium'}
                            ${item.name === selectedItem ? 'scale-[1.02]' : ''}
                        `}
                    >
                        {item.name}
                    </span>
                </div>
                {item.children && renderTree(item.children, level + 1)}
            </React.Fragment>
        ));
    };

    return (
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-white py-4 pl-1 select-none flex flex-col gap-2">
            {data.map((section) => (
                <div key={section.id} className="mb-4">
                    <div className="font-bold text-[15px] px-2 mb-1 text-[#1d5b6e] tracking-normal flex items-center gap-2">
                        <div className="w-[3px] h-[16px] bg-[#feba35]" />
                        {section.name}
                    </div>
                    <div className="flex flex-col gap-0.5">
                        {section.children && renderTree(section.children, 1)}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TallyList;
