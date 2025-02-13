import React, { useEffect, useState } from "react";
import axios from "axios";

const Assign = ({ partner, onAssign, newPartnerUsers }) => {
  const [Users, setUsers] = useState([]);
  const [partners, setPartners] = useState([]);
  const [selectedPartnerId, setSelectedPartnerId] = useState();

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

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await axios.get("http://localhost:3001/partners");
        setPartners(response.data);
      } catch (error) {
        console.error("Error fetching partners:", error);
      }
    };

    fetchPartners();
  }, []);

  const handleSelectPartner = (e) => {
    setSelectedPartnerId(e.target.value);
  };

  const handleAssignUsers = async () => {

    try {
      await axios.delete(`http://localhost:3001/partners/${partner.id}/remove-users`)
      await axios.post(
        `http://localhost:3001/partners/${selectedPartnerId}/add-users`,
        { userIds: Users.map((user) => user.id) }
      );
      
      if(onAssign) onAssign();
      alert("Sikeresen törölted a partnert és helyezted át az usereit!")
    } catch (error) {
      console.error(error);
      alert("Hiba történt az userek hozzárendelése közben!");
    }
  };

  return (
    <div>
      <form
        action=""
        className="shadow-md rounded-xl p-8 w-full md:max-w-2xl md:mx-auto border border-slate-700 bg-cl4"
      >
        <h1 className="text-center mb-5">
          Choose want you want to do with the users(Users:{" "}
          {Users.map((user) => user.name).join(", ")})
        </h1>
        <div className="flex justify-center">
          <div className=" bg-blue-500 m-1 rounded hover:bg-blue-800">
            <div className="m-1 flex flex-col items-center ">
              <h5 className="text-center">
              If you want to add them to an existing partner, choose the following:
              </h5>

              <select
                className="bg-cl4 rounded-md"
                onChange={handleSelectPartner}
              >
                <option value="">Válassz partnert...</option>
                {partners.map((partner) => (
                  <option key={partner.id} value={partner.id}>
                    {partner.name}
                  </option>
                ))}
              </select>
              {selectedPartnerId && (
                <button
                  type="button"
                  className="bg-slate-300 text-slate-800 m-1 rounded hover:bg-cl4 p-1 hover:text-white"
                  onClick={handleAssignUsers}
                >
                  Hozzáadás
                </button>
              )}
            </div>
          </div>
          <button 
          className="bg-blue-500 text-white m-1 rounded hover:bg-blue-700"
          onClick={Users.length === 0 ? () => alert("This partner does not have a user") : newPartnerUsers}
          
          >
            <p className="m-1">Add a new partner with these user(s)</p>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Assign;
