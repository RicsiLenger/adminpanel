import React, { useState, useEffect } from "react";
import axios from "axios";

const addPartnerWithUsers = ({ partner, onSubmit }) => {
  const [Users, setUsers] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState({
    name: "",
    location: "",
    phone: "",
    description: "",
  });

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/partners/${partner.id}/users`
      );
      const users = response.data;
      setUsers(users);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await axios.delete(
        `http://localhost:3001/partners/${partner.id}/remove-users`
      );
      const { data: newPartner } = await axios.post(
        "http://localhost:3001/partners", selectedPartner
      );
      await axios.post(
        `http://localhost:3001/partners/${newPartner.id}/add-users`,
        { userIds: Users.map((user) => user.id) }
      );
      if (onSubmit) onSubmit();
      alert("You have successfully deleted the partner and transferred its users!");
    } catch (error) {
      console.error(error);
      alert("An error occurred while assigning users!");
    }
  };
  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="shadow-md rounded-xl p-8 w-full md:max-w-2xl md:mx-auto border border-slate-700 bg-cl4"
      >
        <h2 className="text-gray-100 mb-8 border-b border-slate-800">
          Add Partner with these user(s):{" "}
          {Users.map((user) => user.name).join(", ")}
        </h2>
        <input
          name="name"
          type="text"
          placeholder="Partner name"
          value={selectedPartner.name}
          onChange={(e) =>
            setSelectedPartner((prevPartner) => ({
              ...prevPartner,
              name: e.target.value,
            }))
          }
          className="mb-4 px-4 py-2 border border-solid border-b-2 border-r-2 w-full bg-transparent border-slate-800 rounded-xl placeholder-gray-200"
          required
        />
        <input
          name="location"
          type="text"
          placeholder="Location"
          value={selectedPartner.location}
          onChange={(e) =>
            setSelectedPartner((p) => ({ ...p, location: e.target.value }))
          }
          className="mb-4 px-4 border py-2 border-solid border-b-2 border-r-2 w-full bg-transparent border-slate-800 rounded-xl placeholder-gray-200"
        ></input>
        <input
          name="phone"
          type="text"
          placeholder="Phone number"
          value={selectedPartner.phone}
          onChange={(e) =>
            setSelectedPartner((p) => ({ ...p, phone: e.target.value }))
          }
          className="mb-4 px-4 border py-2 border-solid border-b-2 border-r-2 w-full bg-transparent border-slate-800 rounded-xl placeholder-gray-200"
        ></input>
        <textarea
          name="desc"
          value={selectedPartner.description}
          onChange={(e) =>
            setSelectedPartner((p) => ({ ...p, description: e.target.value }))
          }
          rows="6"
          placeholder="Description"
          className="mb-4 px-4 py-2 border w-full bg-transparent max-h-60 border-solid border-b-2 border-r-2 border-slate-800 rounded-xl placeholder-gray-200"
        ></textarea>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default addPartnerWithUsers;
