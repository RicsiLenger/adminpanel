import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";

const updateUser = ({ onSubmit, user }) => {
  const [updatedUser, setUser] = useState(user);
  const [partners, setPartners] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (updatedUser.partnerId === "") {
        alert("Choose Partner!");
        return;
      }

      if(updateUser.partnerId === "N/A"){
        setUser((prevUser) => ({ ...prevUser, partnerId: "" }));
      }

      await axios.put(`http://localhost:3001/users/${user.id}`, updatedUser);
      await axios.put(`http://localhost:3001/users/${user.id}/partner`, {
        partnerId: updatedUser.partnerId,
      });

      if (onSubmit) onSubmit();
    } catch (err) {
      console.log(err);
      alert("Ezekkel az adatokkal már rendelekzik user");
    }
  };

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await axios.get("http://localhost:3001/partners");
        const filteredPartners = res.data.filter(
          (partner) => partner.status !== 0
        );
        setPartners(filteredPartners);
      } catch (error) {
        console.error("Error fetching partners:", error);
      }
    };
    fetchPartners();
  }, []);

  return (
    <form
      action=""
      onSubmit={handleSubmit}
      className="shadow-md rounded-xl p-8 w-full md:max-w-2xl md:mx-auto bg-cl4 border-2 border-slate-700"
    >
      <h2 className="text-gray-100 mb-8 border-b border-slate-800">
        Update User
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          name="name"
          value={updatedUser.name}
          onChange={(e) => setUser((p) => ({ ...p, name: e.target.value }))}
          placeholder="full name"
          className="mb-4 px-4 border py-2 border-solid border-b-2 border-r-2 w-full bg-transparent border-slate-800 rounded-xl placeholder-gray-200"
        ></input>
        <input
          type="text"
          name="address"
          value={updatedUser.address}
          onChange={(e) => setUser((p) => ({ ...p, address: e.target.value }))}
          placeholder="address"
          className="mb-4 px-4 border py-2 border-solid border-b-2 border-r-2 w-full bg-transparent border-slate-800 rounded-xl placeholder-gray-200"
        ></input>
        <input
          type="text"
          placeholder="username"
          name="username"
          value={updatedUser.username}
          onChange={(e) => setUser((p) => ({ ...p, username: e.target.value }))}
          className="mb-4 px-4 py-2 border border-solid border-b-2 border-r-2 w-full bg-transparent border-slate-800 rounded-xl placeholder-gray-200"
          required
        ></input>
        <input
          type="email"
          placeholder="email"
          name="email"
          value={updatedUser.email}
          onChange={(e) => setUser((p) => ({ ...p, email: e.target.value }))}
          className="mb-4 px-4 border py-2 border-solid border-b-2 border-r-2 w-full bg-transparent border-slate-800 rounded-xl placeholder-gray-200"
          required
        ></input>
        <input
          type="phone"
          placeholder="phone number"
          name="phone"
          value={updatedUser.phone}
          onChange={(e) => setUser((p) => ({ ...p, phone: e.target.value }))}
          className="mb-4 px-4 border py-2 border-solid border-b-2 border-r-2 w-full bg-transparent border-slate-800 rounded-xl placeholder-gray-200"
        ></input>
        <div className="flex gap-1">
          <select
            name="partner"
            value={updatedUser.partnerId}
            onChange={(e) =>
              setUser((prevUser) => ({
                ...prevUser,
                partnerId: e.target.value,
              }))
            }
            className="mb-4 px-4 border py-2 border-solid border-b-2 border-r-2 w-full bg-cl4 border-slate-800 rounded-xl text-gray-200"
            disabled={updatedUser.status === 0}
          >
            <option value="">Select Partner</option>
            {partners.map((partner) => (
              <option key={partner.name} value={partner.id}>
                {partner.name}
              </option>
            ))}
          </select>

          <select
            name="isActive"
            value={updatedUser.status}
            onChange={(e) => {
              if (updatedUser.status === 0) {
                setUser((p) => ({ ...p, status: e.target.value }));
              } else {
                alert("You can only change the status when it's inactive.");
              }
            }}
            disabled={updatedUser.status !== 0}
            className="mb-4 px-4 border py-2 border-solid border-b-2 border-r-2 w-full bg-cl4 border-slate-800 rounded-xl text-gray-200"
          >
            <option value={2}>Is Active?</option>
            <option value={1}>Yes</option>
            <option value={0}>No</option>
          </select>
        </div>
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Submit
      </button>
    </form>
  );
};

export default updateUser;
