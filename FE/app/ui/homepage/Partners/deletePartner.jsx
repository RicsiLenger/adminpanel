import React, { useState, useEffect } from "react";
import axios from "axios";

const DeletePartner = ({ partner, onAssignClick, onDelete }) => {
  const [Users, setUsers] = useState([]);
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

  const handleDelete = async (e) => {
    e.preventDefault();

    try {
      await axios.delete(
        `http://localhost:3001/partners/${partner.id}?deleteUsers=true`
      );
      if (onDelete) onDelete();
    } catch (error) {
      console.error(error);
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.statusText);
      } else {
        console.error(error.message);
      }
    }
  };

  const handleOnAssign = (e) => {
    e.preventDefault();
    if (Users.length === 0) {
      alert("This partner doesn't have any user");
    } else {
      onAssignClick();
    }
  };

  return (
    <div>
      <form
        action=""
        className="shadow-md rounded-xl p-8 w-full md:max-w-2xl md:mx-auto border border-slate-700 bg-cl4"
      >
        <div className=" flex-col flex justify-center mb-5">
          <h1 className="text-center">
            Choose how you want to delete {partner.name}!
          </h1>
          {Users.length !== 0 && (
            <p className="flex justify-center">Users: {Users.map((user) => user.name).join(",")}</p>
              )}
            </div>
        <div className="flex justify-center">
          <button
            onClick={handleDelete}
            className="bg-blue-500 text-white mr-1 px-4 py-2 rounded hover:bg-blue-700"
          >
            Delete partner with its users
          </button>
          <button
            onClick={handleOnAssign}
            className="bg-blue-500 text-white ml-1 px-4 py-2 rounded hover:bg-blue-700"
          >
            Delete partner and moving its users
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeletePartner;
