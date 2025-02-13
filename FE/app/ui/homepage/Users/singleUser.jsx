import React from "react";

const SingleUser = ({ user }) => {
  return (
    <form
  action=""
  className="shadow-md rounded-xl p-8 w-full md:max-w-2xl md:mx-auto bg-cl4 border-2 border-slate-700"
>
  <h1 className="text-gray-100 mb-4 text-xl border-b border-slate-800">
    User Info
  </h1>
  <div className="grid grid-cols-2 gap-4">
    <div className="text-gray-100 bg-transparent border-slate-800 rounded-xl p-4">
      <p className="font-bold">Full Name:</p>
      <p>{user.name}</p>
    </div>
    <div className="text-gray-100 bg-transparent border-slate-800 rounded-xl p-4">
      <p className="font-bold">Address:</p>
      <p>{user.address}</p>
    </div>
    <div className="text-gray-100 bg-transparent border-slate-800 rounded-xl p-4">
      <p className="font-bold">Username:</p>
      <p>{user.username}</p>
    </div>
    <div className="text-gray-100 bg-transparent border-slate-800 rounded-xl p-4">
      <p className="font-bold">Email:</p>
      <p>{user.email}</p>
    </div>
    <div className="text-gray-100 bg-transparent border-slate-800 rounded-xl p-4">
      <p className="font-bold">Phone Number:</p>
      <p>{user.phone}</p>
    </div>
    <div className="text-gray-100 bg-transparent border-slate-800 rounded-xl p-4">
      <p className="font-bold">Last Login:</p>
      <p>2024.02.05</p>
    </div>
    <div className="text-gray-100 bg-transparent border-slate-800 rounded-xl p-4">
      <p className="font-bold">Works for:</p>
      <p>{user.partnerName}</p>
    </div>
    <div className="text-gray-100 bg-transparent border-slate-800 rounded-xl p-4">
      <p className="font-bold">Is Active?:</p>
      <p>{user.status === 1 ? "Yes" : "No"}</p>
    </div>
  </div>
</form>
  );
};

export default SingleUser;