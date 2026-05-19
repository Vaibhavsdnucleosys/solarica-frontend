import React from 'react';

interface ResponsiveModalProps {
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    className?: string;
}

export const ResponsiveModal: React.FC<ResponsiveModalProps> = ({
    children,
    isOpen,
    onClose,
    size = 'md',
    className = '',
}) => {
    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'w-[95vw] max-w-[450px]',
        md: 'w-[95vw] max-w-[600px] sm:max-w-[700px]',
        lg: 'w-[95vw] max-w-[700px] sm:max-w-[950px]',
        xl: 'w-[95vw] max-w-[900px] sm:max-w-[1200px]',
        full: 'w-[95vw] h-[95vh]',
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/10 p-2 sm:p-4"
            onClick={onClose}
        >
            <div
                className={`${sizeClasses[size]} max-h-[95vh] overflow-auto modal-mobile ${className}`}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
};

interface ResponsiveContainerProps {
    children: React.ReactNode;
    className?: string;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
    children,
    className = '',
}) => {
    return (
        <div className={`w-full max-w-full px-2 sm:px-4 lg:px-6 ${className}`}>
            {children}
        </div>
    );
};

interface ResponsiveGridProps {
    children: React.ReactNode;
    cols?: 1 | 2 | 3 | 4;
    className?: string;
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
    children,
    cols = 2,
    className = '',
}) => {
    const gridClasses = {
        1: 'grid-cols-1',
        2: 'grid-cols-1 sm:grid-cols-2',
        3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    };

    return (
        <div className={`grid gap-2 sm:gap-4 ${gridClasses[cols]} ${className}`}>
            {children}
        </div>
    );
};

export default ResponsiveModal;
