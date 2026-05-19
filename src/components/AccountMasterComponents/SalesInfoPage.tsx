// import SalesDataDisplay from "../TallyIntegration/TallyGroupUI/SalesDataDisplay";


// const SalesInfoPage = () => {
//     return (
//         <div className="min-h-screen bg-slate-100">
//             <SalesDataDisplay />
//         </div>
//     );
// };

// export default SalesInfoPage;

import Dashboard from "./Dashboard";
import SalesDataDisplay from "../TallyIntegration/TallyGroupUI/SalesDataDisplay";

const SalesInfoPage = () => {
    const userStr = localStorage.getItem("user");

    let role = "";

    if (userStr) {
        const user = JSON.parse(userStr);
        role = (user.role?.name || user.role || "").toLowerCase();
    }

    const isAccounting = role === "accounting";

    return (
        <div className="min-h-screen bg-slate-100">
            {isAccounting ? (
                <SalesDataDisplay />
            ) : (
                <Dashboard />
            )}
        </div>
    );
};

export default SalesInfoPage;