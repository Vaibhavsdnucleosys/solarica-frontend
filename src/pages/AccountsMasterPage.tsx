// // import AccountsDashboard from "../components/AccountMasterComponents/Dashboard";

// // const AccountsMasterPage = () => {
// //   return <AccountsDashboard />;
// // };

// // export default AccountsMasterPage;

// import SalesInfoPage from "../components/AccountMasterComponents/SalesInfoPage";

// // const AccountsMasterPage = () => {
// //    notifications = [], unreadCount = 0,
// //     isNotificationOpen = false,
// //     setIsNotificationOpen = () => { },
// //     handleMarkAsRead = () => { },
// //     handleMarkAllAsRead = () => { },
// //     onViewQuotation,
// export interface Notification {
//     id: string;
//     title: string;
//     message: string;
//     type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
//     isRead: boolean;
//     createdAt: string;
//     quotationId?: string;
// }
// interface DashboardProps {
//     onNavigate?: (view: string) => void;
//     notifications?: Notification[];
//     unreadCount?: number;
//     isNotificationOpen?: boolean;
//     setIsNotificationOpen?: (open: boolean) => void;
//     handleMarkAsRead?: (id: string) => void;
//     handleMarkAllAsRead?: () => void;
//     onViewQuotation?: (id: string) => void;
// }
// const  AccountsMasterPage : React.FC<DashboardProps> = ({
//     notifications = [], unreadCount = 0,
//     isNotificationOpen = false,
//     setIsNotificationOpen = () => { },
//     handleMarkAsRead = () => { },
//     handleMarkAllAsRead = () => { },
//     onViewQuotation,
// }) => {
//   return <SalesInfoPage />;
// };

// export default AccountsMasterPage;

import SalesInfoPage from "../components/AccountMasterComponents/SalesInfoPage";

const AccountsMasterPage = () => {
  return <SalesInfoPage />;
};
 export default AccountsMasterPage;