import React, { useEffect, useState } from "react";

interface EditEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (employee: any) => void;
  employee: any;
}

const EditEmployeeModal: React.FC<EditEmployeeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  employee,
}) => {
 const [formData, setFormData] = useState({
  name: "",
  email: "",
  mobile: "",
  company: "",
  roleName: "",
  newPassword: "",
});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
  if (employee) {
    setFormData({
      name: employee.name || "",
      email: employee.email || "",
      mobile: employee.phone || "",
      company: employee.company || "",
      roleName: employee.role?.name || "",
      newPassword: "",
    });
  }
}, [employee]);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim())
      newErrors.name = "Name is required";

    if (!formData.email.trim())
      newErrors.email = "Email is required";

    if (!formData.mobile.trim())
      newErrors.mobile = "Mobile is required";

    if (!formData.company)
      newErrors.company = "Company is required";

    if (!formData.roleName)
      newErrors.roleName = "Department is required";

    if (
  formData.newPassword &&
  formData.newPassword.length < 6
) {
  newErrors.newPassword =
    "Password must be at least 6 characters";
}

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-slate-800">
              Edit Employee
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Update employee information
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full border border-slate-200 hover:bg-red-50 hover:text-red-500 transition-all"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <div className="space-y-5">

          {/* Name */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              Full Name
            </label>

            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
              className="w-full p-3 bg-slate-50 border rounded-xl"
            />

            {errors.name && (
              <p className="text-red-500 text-xs mt-1">
                {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              Email
            </label>

            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value,
                })
              }
              className="w-full p-3 bg-slate-50 border rounded-xl"
            />

            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email}
              </p>
            )}
          </div>

          {/* Company */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              Company
            </label>

            <select
              value={formData.company}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  company: e.target.value,
                })
              }
              className="w-full p-3 bg-slate-50 border rounded-xl"
            >
              <option value="">Select Company</option>

              <option value="Solarica Energy India Pvt Ltd">
                Solarica Energy India Pvt Ltd
              </option>

              <option value="Solarica Industries Pvt Ltd">
                Solarica Industries Pvt Ltd
              </option>

              <option value="Solarica Systems Pvt Ltd">
                Solarica Systems Pvt Ltd
              </option>

              <option value="Solarica Fabtech Pvt Ltd">
                Solarica Fabtech Pvt Ltd
              </option>

              <option value="Solarica Greenwheels Pvt Ltd">
                Solarica Greenwheels Pvt Ltd
              </option>
            </select>

            {errors.company && (
              <p className="text-red-500 text-xs mt-1">
                {errors.company}
              </p>
            )}
          </div>

          {/* Department */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              Department
            </label>

            <select
              value={formData.roleName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  roleName: e.target.value,
                })
              }
              className="w-full p-3 bg-slate-50 border rounded-xl"
            >
              <option value="">Select Department</option>

              <option value="Sales">Sales</option>

              <option value="Accounting">
                Accounting
              </option>

              <option value="Operation">
                Operation
              </option>

              <option value="Operation Employee">
                Operation Employee
              </option>
            </select>

            {errors.roleName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.roleName}
              </p>
            )}
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              Mobile
            </label>

            <input
              type="tel"
              value={formData.mobile}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  mobile: e.target.value,
                })
              }
              className="w-full p-3 bg-slate-50 border rounded-xl"
            />

            {errors.mobile && (
              <p className="text-red-500 text-xs mt-1">
                {errors.mobile}
              </p>
            )}
          </div>


{/* New Password */}
<div>
  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
    Change Password
  </label>

  <input
    type="password"
    value={formData.newPassword}
    onChange={(e) =>
      setFormData({
        ...formData,
        newPassword: e.target.value,
      })
    }
    placeholder="Enter new password"
    className="w-full p-3 bg-slate-50 border rounded-xl"
  />

  {errors.newPassword && (
    <p className="text-red-500 text-xs mt-1">
      {errors.newPassword}
    </p>
  )}
</div>

        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-end gap-3">
          
          <button
            onClick={onClose}
            className="px-6 py-2 font-semibold text-slate-600"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all"
          >
            Update Employee
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditEmployeeModal;