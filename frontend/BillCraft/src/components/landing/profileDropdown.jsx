import { useNavigate } from "react-router-dom";
import { User, LogOut, ChevronDown } from "lucide-react";

const ProfileDropdown = ({
  isOpen,
  onToggle,
  avatar,
  companyName,
  email,
  onLogout,
}) => {
  const navigate = useNavigate();

  return (
    <div className="relative">
      {/* Profile Button */}
      <button
        onClick={onToggle}
        className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 transition-all duration-200"
      >
        {/* Avatar */}
        {avatar ? (
          <img
            src={avatar}
            alt="Avatar"
            className="w-9 h-9 rounded-full object-cover border-2 border-orange-100"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold shadow-md">
            {companyName?.charAt(0).toUpperCase()}
          </div>
        )}

        {/* User Information */}
        <div className="hidden sm:block text-left">
          <p className="text-sm font-semibold text-gray-800">
            {companyName}
          </p>

          <p className="text-xs text-gray-500">
            {email}
          </p>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 bg-white border border-gray-200 rounded-2xl shadow-xl shadow-gray-900/10 overflow-hidden z-50">

          {/* User Info */}
          <div className="px-4 py-4 bg-gradient-to-r from-orange-50 to-white border-b border-gray-100">
            <div className="flex items-center gap-3">

              {avatar ? (
                <img
                  src={avatar}
                  alt="Avatar"
                  className="w-11 h-11 rounded-full object-cover"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold">
                  {companyName?.charAt(0).toUpperCase()}
                </div>
              )}

              <div className="min-w-0">
                <p className="font-semibold text-gray-900 truncate">
                  {companyName}
                </p>

                <p className="text-xs text-gray-500 truncate">
                  {email}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2">

            {/* View Profile */}
            <button
              onClick={() => {
                navigate("/profile");
                onToggle();
              }}
              className="w-full flex items-center gap-3 px-3 py-3 text-sm text-gray-600 rounded-xl hover:bg-gray-100 hover:text-gray-900 transition-all"
            >
              <User className="w-4 h-4" />

              <span>View Profile</span>
            </button>

            {/* Logout */}
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-3 py-3 text-sm text-red-500 rounded-xl hover:bg-red-50 transition-all"
            >
              <LogOut className="w-4 h-4" />

              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;