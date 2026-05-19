import React from "react";
import { getUserRole } from "../utils/getRole";
import SalesDashboard from "../components/SalesMaster/SalesDashboard";
import UserDashboard from "../components/UserMaster/UserDashboard";
import OperationsPortal from "../components/OperationMaster/OperationsPortal";
import AdminSalesDashboard from "../components/SalesMaster/AdminSalesDashboard";



const DashboardPage: React.FC = () => {
  const role = getUserRole() || "";

  return (
    <>
      {role === "admin" && <AdminSalesDashboard />}
      {role === "sales" && <SalesDashboard />}
      {role.includes("account") && <UserDashboard />}
      {role.includes("operation") && <OperationsPortal />}
    </>
  );
};

export default DashboardPage;