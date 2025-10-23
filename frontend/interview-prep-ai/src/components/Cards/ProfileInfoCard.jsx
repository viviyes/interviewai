import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LuUser } from "react-icons/lu";
import { UserContext } from "../../context/userContext";

const ProfileInfoCard = () => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handelLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/");
  };

  return (
    user && (
      <div className="flex items-center">
        {user.profileImageUrl ? (
          <img
            src={user.profileImageUrl}
            alt=""
            className="w-11 h-11 bg-gray-300 rounded-full mr-3 object-cover"
          />
        ) : (
          <div className="w-11 h-11 flex items-center justify-center bg-indigo-50 rounded-full mr-3">
            <LuUser className="text-xl text-[#6D7CB3]" />
          </div>
        )}
        <div>
          <div className="text-[15px] text-black font-bold leading-3">
            {user.name || ""}
          </div>
          <button
            className="text-[#6D7CB3] text-sm font-semibold cursor-pointer hover:underline"
            onClick={handelLogout}
          >
            Logout
          </button>
        </div>
      </div>
    )
  );
};

export default ProfileInfoCard;
