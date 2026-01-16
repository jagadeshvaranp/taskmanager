import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosintance";
import { API_PATHS } from "../../utils/Apipaths";
import { LuUsers } from "react-icons/lu";
import Modal from "./Modal";
import AvatarGroup from "./AvatarGroup"; // Ensure this import path is correct

// Helper to get initials
const getInitials = (name) => {
  if (!name) return "";
  const words = name.split(" ");
  let initials = "";
  for (let i = 0; i < Math.min(words.length, 2); i++) {
    initials += words[i][0];
  }
  return initials.toUpperCase();
};

function SelectUser({ selectedUsers, setSelectedUsers }) {
  const [allUsers, setAllUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempSelectedUsers, setTempSelectedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getAllUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      if (response.data?.length > 0) setAllUsers(response.data);
    } catch (error) {
      console.log("Error fetching users", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleUserSelection = (userId) => {
    setTempSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAssign = () => {
    setSelectedUsers(tempSelectedUsers);
    setIsModalOpen(false);
  };

  // --- FIX IS HERE ---
  // We now filter the Full User Objects, not just the image strings.
  // This allows AvatarGroup to access 'name' if the image is missing.
  const selectedUserObjects = allUsers.filter((user) => 
    selectedUsers.includes(user._id)
  );

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    setTempSelectedUsers(selectedUsers);
  }, [selectedUsers, isModalOpen]);

  return (
    <div className="space-y-4 mt-2">
      {/* If no users selected, show Add Button. Otherwise show AvatarGroup */}
      {selectedUserObjects.length === 0 ? (
        <button
          type="button"
          className="card-btn flex items-center gap-2"
          onClick={() => setIsModalOpen(true)}
        >
          <LuUsers className="text-sm" />
          Add Member
        </button>
      ) : (
        <div 
          className="cursor-pointer inline-block" 
          onClick={() => setIsModalOpen(true)}
          title="Click to manage members"
        >
          {/* Pass the objects, not strings */}
          <AvatarGroup users={selectedUserObjects} maxVisible={3} />
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Select Team Members"
      >
        <div className="space-y-3 h-[50vh] md:h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {isLoading ? (
            <p className="text-center text-gray-500 py-10">Loading users...</p>
          ) : (
            allUsers.map((user) => (
              <div
                key={user._id}
                className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                  tempSelectedUsers.includes(user._id)
                    ? "bg-blue-50 border-blue-400 shadow-sm"
                    : "bg-white border-gray-200 hover:bg-gray-50"
                }`}
                onClick={() => toggleUserSelection(user._id)}
              >
                <div className="flex items-center gap-3">
                  {user.profileImageUrl ? (
                    <img
                      src={user.profileImageUrl}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover border border-gray-300"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200">
                      {getInitials(user.fullName || user.name)}
                    </div>
                  )}

                  <div className="flex flex-col">
                    <p className="text-sm font-semibold text-gray-800">
                      {user.fullName || user.name}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={tempSelectedUsers.includes(user._id)}
                  readOnly
                  className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 pointer-events-none"
                />
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md"
            onClick={() => setIsModalOpen(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm"
            onClick={handleAssign}
          >
            Done
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default SelectUser;