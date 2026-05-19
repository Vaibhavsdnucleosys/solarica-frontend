// import React, { useState } from 'react';
// import { Building2, Sparkles } from 'lucide-react';

// interface WelcomeSectionProps {
//     title?: string;
//     showCompanyPills?: boolean;
// }

// const WelcomeSection: React.FC<WelcomeSectionProps> = ({
//     title = 'Welcome to Solarica Group of Companies',
//     showCompanyPills = false
// }) => {
//     const [activeCompany, setActiveCompany] = useState('Solarica Energy India Pvt Ltd');

//     const companies = [
//         'Solarica Energy India Pvt Ltd',
//         'Solarica Systems Pvt Ltd',
//         'Solarica Fabtech Pvt Ltd',
//         'Solarica Industries Pvt Ltd',
//         'Solarica Greenwheels Pvt Ltd',
//     ];

//     const currentDate = new Date().toLocaleDateString('en-US', {
//         weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
//     });

//     return (
//         <div className="relative rounded-2xl overflow-hidden animate-fade-up mb-2" style={{ animationDelay: '0.1s' }}>
//             {/* Gradient background */}
//             <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-2xl" />
//             {/* Decorative blobs */}
//             <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />
//             <div className="absolute bottom-0 left-20 w-48 h-48 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />

//             <div className="relative z-10 p-6 md:p-8">
//                 {/* Title row */}
//                 <div className="flex items-center gap-2 mb-4">
//                     <Sparkles size={14} className="text-indigo-400" />
//                     <span className="text-indigo-300/80 text-xs font-bold tracking-widest uppercase">{title}</span>
//                 </div>

//                 {/* Company pills */}
//                 {showCompanyPills && (
//                     <div className="flex flex-nowrap overflow-x-auto gap-2 pb-4 no-scrollbar">
//                         {companies.map(company => (
//                             <button
//                                 key={company}
//                                 onClick={() => setActiveCompany(company)}
//                                 className={`
//                   whitespace-nowrap px-3 py-1.5 rounded-full text-[11px] font-bold transition-all border flex-shrink-0
//                   ${activeCompany === company
//                                         ? 'bg-white text-slate-900 border-transparent shadow-lg'
//                                         : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10 hover:text-white'
//                                     }
//                 `}
//                             >
//                                 {company}
//                             </button>
//                         ))}
//                     </div>
//                 )}

//                 {/* Active company display */}
//                 <div className="flex items-end justify-between">
//                     <div>
//                         <div className="flex items-center gap-2.5 mb-1">
//                             <div className="w-7 h-7 rounded-lg bg-indigo-500/30 flex items-center justify-center">
//                                 <Building2 size={14} className="text-indigo-300" />
//                             </div>
//                             <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-none">
//                                 {activeCompany}
//                             </h2>
//                         </div>
//                         <p className="text-slate-400 text-sm font-medium ml-9">{currentDate}</p>
//                     </div>
//                     {/* Live pulse dot */}
//                     <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/15 border border-emerald-500/20 rounded-full mb-1">
//                         <span className="relative flex h-2 w-2">
//                             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
//                             <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
//                         </span>
//                         <span className="text-emerald-400 text-[11px] font-bold tracking-wide">Live</span>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default WelcomeSection;


import React from 'react';

import {
    Building2,
    Sparkles
} from 'lucide-react';

interface WelcomeSectionProps {

    title?: string;

    companyName?: string;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({

    title =
        'Welcome to Solarica Group of Companies',

    companyName =
        'Solarica Energy India Pvt Ltd'
}) => {

    const currentDate =
        new Date().toLocaleDateString(
            'en-US',
            {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }
        );

    return (

        <div
            className="
                relative
                rounded-3xl
                overflow-hidden
            "
        >

            {/* Background */}

            <div
                className="
                    absolute inset-0
                    bg-gradient-to-br
                    from-slate-900
                    via-indigo-950
                    to-slate-900
                "
            />

            {/* Glow */}

            <div
                className="
                    absolute top-0 right-0
                    w-80 h-80
                    bg-indigo-600/20
                    rounded-full
                    blur-3xl
                "
            />

            {/* Content */}

            <div className="relative z-10 p-8">

                {/* Title */}

                <div
                    className="
                        flex items-center gap-2
                        mb-5
                    "
                >
                    <Sparkles
                        size={15}
                        className="text-indigo-400"
                    />

                    <span
                        className="
                            text-xs
                            font-black
                            tracking-[0.2em]
                            uppercase
                            text-indigo-300
                        "
                    >
                        {title}
                    </span>
                </div>

                {/* Main */}

                <div
                    className="
                        flex items-end
                        justify-between
                    "
                >

                    <div>

                        <div
                            className="
                                flex items-center gap-3
                                mb-2
                            "
                        >

                            <div
                                className="
                                    w-10 h-10
                                    rounded-xl
                                    bg-indigo-500/20
                                    flex items-center justify-center
                                "
                            >
                                <Building2
                                    size={18}
                                    className="text-indigo-300"
                                />
                            </div>

                            <h2
                                className="
                                    text-4xl
                                    font-black
                                    text-white
                                    tracking-tight
                                "
                            >
                                {companyName}
                            </h2>

                        </div>

                        <p
                            className="
                                text-slate-400
                                text-sm
                                font-medium
                                ml-14
                            "
                        >
                            {currentDate}
                        </p>

                    </div>

                    {/* Live */}

                    <div
                        className="
                            flex items-center gap-2
                            px-4 py-2
                            rounded-full
                            bg-emerald-500/10
                            border border-emerald-500/20
                        "
                    >

                        <span className="relative flex h-2 w-2">

                            <span
                                className="
                                    animate-ping
                                    absolute inline-flex
                                    h-full w-full
                                    rounded-full
                                    bg-emerald-400
                                    opacity-75
                                "
                            />

                            <span
                                className="
                                    relative inline-flex
                                    rounded-full
                                    h-2 w-2
                                    bg-emerald-400
                                "
                            />

                        </span>

                        <span
                            className="
                                text-emerald-400
                                text-xs
                                font-bold
                            "
                        >
                            Live
                        </span>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default WelcomeSection;
