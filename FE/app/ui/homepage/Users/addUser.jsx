import React, { useState, useEffect } from "react";
import axios from "axios";

const addUser = ({ onSubmit }) => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    status: "",
    phone: "",
    address: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:3001/users", user);
      if (onSubmit) onSubmit();
    } catch (err) {
      console.log(err);
    }
  };

  const [partners, setPartners] = useState([]);

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
      <h2 className="text-gray-100 mb-8 border-b border-slate-800">Add User</h2>
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          name="name"
          value={user.name}
          onChange={(e) => setUser((p) => ({ ...p, name: e.target.value }))}
          placeholder="full name"
          className="mb-4 px-4 border py-2 border-solid border-b-2 border-r-2 w-full bg-transparent border-slate-800 rounded-xl placeholder-gray-200"
        ></input>
        <input
          type="text"
          name="address"
          value={user.address}
          onChange={(e) => setUser((p) => ({ ...p, address: e.target.value }))}
          placeholder="address"
          className="mb-4 px-4 border py-2 border-solid border-b-2 border-r-2 w-full bg-transparent border-slate-800 rounded-xl placeholder-gray-200"
        ></input>
        <input
          type="text"
          placeholder="username"
          name="username"
          value={user.username}
          onChange={(e) => setUser((p) => ({ ...p, username: e.target.value }))}
          className="mb-4 px-4 py-2 border border-solid border-b-2 border-r-2 w-full bg-transparent border-slate-800 rounded-xl placeholder-gray-200"
          required
        ></input>
        <input
          type="email"
          placeholder="email"
          name="email"
          value={user.email}
          onChange={(e) => setUser((p) => ({ ...p, email: e.target.value }))}
          className="mb-4 px-4 border py-2 border-solid border-b-2 border-r-2 w-full bg-transparent border-slate-800 rounded-xl placeholder-gray-200"
          required
        ></input>
        <input
          type="password"
          placeholder="password"
          name="password"
          value={user.password}
          onChange={(e) => setUser((p) => ({ ...p, password: e.target.value }))}
          className="mb-4 px-4 border py-2 border-solid border-b-2 border-r-2 w-full bg-transparent border-slate-800 rounded-xl placeholder-gray-200"
          required
        ></input>
        <input
          type="phone"
          placeholder="phone number"
          name="phone"
          value={user.phone}
          onChange={(e) => setUser((p) => ({ ...p, phone: e.target.value }))}
          className="mb-4 px-4 border py-2 border-solid border-b-2 border-r-2 w-full bg-transparent border-slate-800 rounded-xl placeholder-gray-200"
        ></input>
        
      </div>
      <select
          name="partner"
          value={user.partnerId}
          onChange={(e) =>
            setUser((p) => ({ ...p, partnerId: e.target.value }))
          }
          className="mb-4 px-4 border py-2 border-solid border-b-2 border-r-2 w-full bg-cl4 border-slate-800 rounded-xl text-gray-200"
        >
          <option value="">Select Partner</option>
          {partners.map((partner) => (
            <option key={partner.id} value={partner.id}>
              {partner.name}
            </option>
          ))}
        </select>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Submit
      </button>
    </form>
  );
};

export default addUser;
