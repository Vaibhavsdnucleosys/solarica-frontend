import React, { useState, useEffect } from 'react';
import TallyEmployeeCategoryCreation from './TallyEmployeeCategoryCreation';
import TallyHeader from '../TallyGroupUI/TallyHeader';
import { TallySidebar, SidebarButton } from '../TallyGroupUI/TallySidebar';

interface TallyEmployeeCategoryListProps {
    onClose?: () => void;
    companyId?: string;
}

const TallyEmployeeCategoryList: React.FC<TallyEmployeeCategoryListProps> = ({ onClose, companyId }) => {
    const [showCreationModal, setShowCreationModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [editMode, setEditMode] = useState<'Create' | 'Alter'>('Create');
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Mock data - replace with API call
    const categories = [
        'Primary Cost Category'
    ];

    // Keydown handler for shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (showCreationModal) return; // Let modal handle its own keys

            if (e.key === 'Escape') {
                if (onClose) onClose();
            }
            if (e.ctrlKey && e.key.toLowerCase() === 'a') {
                e.preventDefault();
                // Accept functionality if needed
            }
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => (prev > 0 ? prev - 1 : categories.length - 1));
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => (prev < categories.length - 1 ? prev + 1 : 0));
            } else if (e.key === 'Enter') {
                e.preventDefault();
                // Open alteration for selected item
                handleCategoryClick(categories[selectedIndex]);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose, showCreationModal, selectedIndex, categories]);

    const handleCategoryClick = (category: string) => {
        setSelectedCategory(category);
        setEditMode('Alter');
        setShowCreationModal(true);
    };

    const handleCreateClick = () => {
        setSelectedCategory('');
        setEditMode('Create');
        setShowCreationModal(true);
    }

    return (
        <div className="w-full h-full flex flex-row bg-[#e8f6fa] font-sans overflow-hidden">
            {/* Left Content Area (Headers + List + Footer) */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="bg-[#8ec2eb] text-[#1b2c3c] px-4 py-0.5 flex justify-between items-center border-b border-[#5ea4d6] relative shrink-0">
                    <div className="flex items-center gap-4">
                        <span className="font-bold text-[13px]">Chart of Accounts</span>
                    </div>
                    <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
                        <span className="font-bold text-[13px]">Solarica</span>
                    </div>
                    <div className="flex items-center absolute right-[2px]">
                        <span onClick={onClose} className="text-[14px] cursor-pointer hover:bg-red-500 hover:text-white px-2">✕</span>
                    </div>
                </div>

                {/* Title Bar */}
                <div className="bg-white px-4 py-1 border-b border-gray-300">
                    <div className="flex justify-between items-center">
                        <span className="font-bold text-[13px]">List of Employee Categories</span>
                        <span className="text-[11px] text-gray-600">For 1-Apr-25</span>
                    </div>
                </div>

                {/* List Area */}
                <div className="flex-1 bg-white overflow-y-auto custom-scrollbar relative">
                    {/* NAME Header removed */}

                    {categories.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 mt-20">
                            <span className="font-bold text-[15px]">No employee categories found</span>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {categories.map((category, index) => (
                                <div
                                    key={index}
                                    className={`px-4 py-1 flex items-center cursor-pointer border-b border-gray-100 transition-colors
                                        ${selectedIndex === index ? 'bg-[#feba35] shadow-sm' : 'hover:bg-[#def1fc]/50'}
                                    `}
                                    onClick={() => {
                                        setSelectedIndex(index);
                                        handleCategoryClick(category);
                                    }}
                                    onMouseEnter={() => setSelectedIndex(index)}
                                >
                                    <span className={`text-[14px] font-bold ${selectedIndex === index ? 'text-black' : 'text-[#1b2c3c]'}`}>
                                        {category}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Bottom Status Bar */}
                <div className="bg-[#8ec2eb] border-t border-[#5ea4d6] px-4 py-1 flex justify-between">
                    <span className="text-[11px] font-bold text-black uppercase tracking-wider">{categories.length} Employee Category</span>
                    <span className="text-[11px] font-bold text-black uppercase tracking-wider">{selectedIndex + 1} of {categories.length}</span>
                </div>

                {/* Footer Actions */}
                <div className="bg-[#def1fc] border-t-2 border-[#2a5585] px-4 py-1 flex items-center gap-6 text-[11px]">
                    <span className="cursor-pointer hover:underline" onClick={onClose}>
                        <span className="text-[#2a5585] font-bold">Q</span>: Quit
                    </span>
                    <span className="cursor-pointer hover:underline" onClick={() => handleCategoryClick(categories[selectedIndex])}>
                        <span className="text-[#2a5585] font-bold">Enter</span>: Alter
                    </span>
                    <span className="cursor-pointer hover:underline">
                        <span className="text-[#2a5585] font-bold">Space</span>: Select
                    </span>
                    <span className="cursor-pointer hover:underline" onClick={onClose}>
                        <span className="text-[#2a5585] font-bold">A</span>: Accept
                    </span>
                    <span className="cursor-pointer hover:underline" onClick={handleCreateClick}>
                        <span className="text-[#2a5585] font-bold">C</span>: Create Master
                    </span>
                    <span className="cursor-pointer hover:underline">
                        <span className="text-[#2a5585] font-bold">D</span>: Delete
                    </span>
                    <span className="cursor-pointer hover:underline">
                        <span className="text-[#2a5585] font-bold">R</span>: Remove Line
                    </span>
                    <span className="cursor-pointer hover:underline">
                        <span className="text-[#2a5585] font-bold">U</span>: Restore Line
                    </span>
                    <span className="cursor-pointer hover:underline">
                        <span className="text-[#2a5585] font-bold">F12</span>: Configure
                    </span>
                </div>
            </div>

            {/* Right Sidebar - Full Height */}
            <TallySidebar>
                <SidebarButton keyName="F2" label="Period" onClick={() => { }} disabled={true} />
                <SidebarButton keyName="F3" label="Company" onClick={() => { }} />
                <SidebarButton keyName="F4" label="" disabled={true} />
                <SidebarButton keyName="F5" label="" disabled={true} />
                <SidebarButton keyName="F6" label="" disabled={true} />
                <SidebarButton keyName="F7" label="" disabled={true} />
                <SidebarButton keyName="F8" label="" disabled={true} />
                <SidebarButton keyName="F9" label="" disabled={true} />
                <SidebarButton keyName="F10" label="Other Masters" onClick={() => { }} />
            </TallySidebar>

            {/* Creation Modal */}
            {showCreationModal && (
                <div className="fixed inset-0 z-[10000] bg-white">
                    <TallyEmployeeCategoryCreation
                        onClose={() => setShowCreationModal(false)}
                        initialMode={editMode}
                        initialName={selectedCategory || ''}
                        companyId={companyId}
                    />
                </div>
            )}
        </div>
    );
};

export default TallyEmployeeCategoryList;
