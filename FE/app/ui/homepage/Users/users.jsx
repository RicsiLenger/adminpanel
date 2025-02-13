import React, { Fragment, useEffect, useState } from "react";
import {
  RiDeleteBin2Fill,
  RiSettings4Fill,
  RiArrowGoBackFill,
} from "react-icons/ri";
import { LuCircleSlash2 } from "react-icons/lu";
import { HiOutlinePlus } from "react-icons/hi";
import { TbStatusChange } from "react-icons/tb";
import Modal from "../../modal/modal";
import AddUser from "./addUser";
import UpdateUser from "./UpdateUser";
import SingleUser from "./singleUser";
import axios from "axios";

const Users = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [showUpdateAllStatusButton, setShowUpdateAllStatusButton] =
    useState(false);
  const [inactiveClicked, setInactiveClicked] = useState(false);
  const [filter, setFilter] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [usersData, setUsersData] = useState([]);
  const [partners, setPartners] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [inactiveUserMessage, setInactiveUserMessage] = useState("");
  const fetchAllUsers = async (partnerIds = []) => {
    try {
      const res = await axios.get("http://localhost:3001/users", {
        params: {
          partnerId: partnerIds,
        },
      });
      const filteredUsers = res.data.filter((user) => user.status !== 0);

      setUsersData(filteredUsers);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchInactiveUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3001/users");
      const inactiveUsers = res.data.filter((user) => user.status === 0);
      if (inactiveUsers.length === 0) {
        setInactiveUserMessage("There Aren't Any Inactive Users!");
      } else {
        setInactiveUserMessage("");
      }
      setUsersData(inactiveUsers);
      setShowUpdateAllStatusButton(true);
    } catch (error) {
      console.error(error);
    }
  };

  const updateAllUsersStatus = async () => {
    try {
      await axios.put("http://localhost:3001/user/update-status");
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/users/` + id);
      fetchAllUsers();
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.statusText);
      } else {
        console.error(error.message);
      }
    }
  };
  const handleAddUserSubmit = async () => {
    setShowAddModal(false);
    fetchAllUsers();
  };

  const handleUpdateUserSubmit = async () => {
    setShowUpdateModal(false);
    fetchAllUsers();
  };

  const handleUpdateClick = (user) => {
    setSelectedUserId(user);
    setShowUpdateModal(true);
  };

  const handleUserClick = (user) => {
    setSelectedUserId(user);
    setShowUserModal(true);
  };

  const handleupdateAllUserStatusClick = async () => {
    updateAllUsersStatus();
    setInactiveUserMessage("");
    setInactiveClicked(false)
    setShowUpdateAllStatusButton(false);
    fetchAllUsers();
  };

  const handleBackClick = async () => {
    setInactiveUserMessage("");
    setShowUpdateAllStatusButton(false);
    setInactiveClicked(false)
    fetchAllUsers();
  };

  const handleInactiveClick = async () => {
    try {
      setInactiveClicked(true)
      await fetchInactiveUsers();
    } catch (error) {
      console.error(error);
    } 
  };

  const handleFilterChange = (e) => {
    const selectedFilter = e.target.value;

    if (selectedFilter !== "") {
      const partnerId = parseInt(selectedFilter);
      if (partners.some((partner) => partner.id === partnerId)) {
        if (!selectedFilters.includes(selectedFilter)) {
          const newFilters = [...selectedFilters, selectedFilter];
          setSelectedFilters(newFilters);
          fetchAllUsers(newFilters);
        }
      }
    } else {
      setSelectedFilters([]);
      setFilter("");
      fetchAllUsers();
      setIsFilterActive(false);
    }
  };

  useEffect(() => {
    let interval;
    if (!inactiveClicked) {
      interval = setInterval(() => {
        if (!isFilterActive) {
          fetchAllUsers(selectedFilters);
        }
      }, 5000);
    }

    return () => clearInterval(interval);

  }, [selectedFilters, isFilterActive, inactiveClicked]); 


  const renderFilterBubbles = () => {
    return selectedFilters.map((filter) => (
      <span
        key={filter}
        className=" bg-cl4 mr-2 p-1 rounded-full text-sm max-w-36 overflow-hidden"
      >
        {partners.find((partner) => partner.id === parseInt(filter))?.name}
      </span>
    ));
  };

  const fetchPartners = async () => {
    try {
      const response = await axios.get("http://localhost:3001/partners");
      const filteredPartners = response.data.filter(
        (partner) => partner.status !== 0
      );

      setPartners(filteredPartners);

      fetchAllUsers();
    } catch (error) {
      console.error("Error fetching partners:", error);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  return (
    <Fragment>
      <div className="border-2 p-2.5 m-[15px] rounded-[20px] min-w-[40vw] min-h-[70vh] text-cl5 bg-cl4 bg-opacity-30 shadow-md border-slate-500 ">
        <div className="flex justify-between text-xl mb-5">
          <div className="ml-2 flex ">
            Users
            {showUpdateAllStatusButton && (
              <button
                className="hover:bg-slate-900 p-1 ml-1 rounded-full"
                onClick={handleBackClick}
              >
                <RiArrowGoBackFill />
              </button>
            )}
          </div>
          <div className="flex items-center">
            <div className="flex overflow-x-auto ">{renderFilterBubbles()}</div>
            {!inactiveClicked && (
            <select
              name="filter"
              value={filter}
              onChange={handleFilterChange}
              className="bg-cl4 rounded-xl p-1 text-sm flex-0 justify-start mr-3 overflow-auto max-w-32"
            >
              <option value="">Partner Filter</option>
              {partners.map((partner) => (
                <option key={partner.id} value={partner.id}>
                  {partner.name}
                </option>
              ))}
            </select>
            )}
            {selectedFilters.length > 0 && (
              <button
                className="bg-cl4 hover:bg-slate-900 p-1 rounded-full text-sm mr-2"
                onClick={() => {
                  setSelectedFilters([]);
                  setFilter("");
                  fetchAllUsers();
                }}
              >
                Clear filters
              </button>
            )}
            {showUpdateAllStatusButton && (
              <button
                className="hover:bg-slate-900 p-1 rounded-full"
                onClick={handleupdateAllUserStatusClick}
              >
                <TbStatusChange />
              </button>
            )}
            <button
              className="hover:bg-slate-900 p-1 rounded-full"
              onClick={handleInactiveClick}
            >
              <LuCircleSlash2 />
            </button>
            <button
              className="hover:bg-slate-900 p-1 rounded-full"
              onClick={() => setShowAddModal(true)}
            >
              <HiOutlinePlus />
            </button>
          </div>
        </div>

        {inactiveUserMessage && (
          <div className="text-xl text-center mt-5 text">
            {inactiveUserMessage}
          </div>
        )}
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <tbody>
              {usersData.length === 0 && inactiveUserMessage === "" ? (
                <tr className="text-center">
                  <td className="text-xl">
                    {" "}
                    No user associated with{" "}
                    {selectedFilters
                      ? partners.find(
                          (partner) => partner.id === parseInt(selectedFilters)
                        )?.name
                      : "this partner"}
                  </td>
                </tr>
              ) : (
                usersData.map((user) => (
                  <tr key={user.id} className="p-2.5 text-center w-full">
                    <td>
                      <button
                        className="hover:bg-slate-800 rounded-full pr-2 pl-2"
                        onClick={() => handleUserClick(user)}
                      >
                        {user.name}
                      </button>
                    </td>
                    <td>{user.email}</td>
                    <td>{user.partnerName || "N/A"}</td>
                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                    <td>{user.status === 1 ? "active" : "inactive"}</td>
                    <td>
                      <div className="inline-flex items-baseline text-base">
                        {user.id && (
                          <>
                            <button
                              onClick={() => handleUpdateClick(user)}
                              className="hover:bg-slate-900 p-1 rounded-full"
                            >
                              <RiSettings4Fill />
                            </button>
                            {user.status === 1 && (
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="hover:bg-slate-900 p-1 rounded-full"
                            >
                              <RiDeleteBin2Fill />
                            </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Modal isVisible={showAddModal} onClose={() => setShowAddModal(false)}>
        <AddUser onSubmit={handleAddUserSubmit} />
      </Modal>
      <Modal
        isVisible={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
      >
        {selectedUserId && (
          <UpdateUser onSubmit={handleUpdateUserSubmit} user={selectedUserId} />
        )}
      </Modal>
      <Modal isVisible={showUserModal} onClose={() => setShowUserModal(false)}>
        {selectedUserId && <SingleUser user={selectedUserId} />}
      </Modal>
    </Fragment>
  );
};

export default Users;
