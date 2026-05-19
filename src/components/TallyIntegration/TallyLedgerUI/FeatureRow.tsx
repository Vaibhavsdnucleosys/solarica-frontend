
import React from 'react';

export const FeatureRow = ({ label, val, set }: { label: string, val: string, set: (v: string) => void }) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        // If the event comes from the input (bubbled up), preserve the event for the parent container
        // to handle navigation (e.g. moving to the next row).
        if (e.target !== e.currentTarget) return;

        if (e.key === 'Enter') {
            e.preventDefault();
            e.currentTarget.querySelector('input')?.focus();
        }
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Allow Enter to bubble up to the main container for navigation
        if (e.key === 'Enter') {
            // e.stopPropagation(); // Do NOT stop propagation
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = e.target.value;
        if (v.toLowerCase() === 'y') set('Yes');
        else if (v.toLowerCase() === 'n') set('No');
        else set(v);
    };

    return (
        <div
            className="flex justify-between items-center mb-1 cursor-pointer outline-none"
            onClick={(e) => e.currentTarget.querySelector('input')?.focus()}
            tabIndex={0}
            onKeyDown={handleKeyDown}
        >
            <label className="flex-1 mr-2 cursor-pointer">{label}</label>
            <div className="flex items-center">
                <span className="mr-2">:</span>
                <input
                    type="text"
                    value={val}
                    onChange={handleChange}
                    onKeyDown={handleInputKeyDown}
                    className="w-[60px] bg-transparent border border-transparent px-1 outline-none text-center focus:bg-[#feba35] hover:bg-[#ffe599] font-bold"
                />
            </div>
        </div>
    );
};
