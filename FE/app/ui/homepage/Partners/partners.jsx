import React, { Fragment, useEffect, useState } from "react";
import {
  RiDeleteBin2Fill,
  RiSettings4Fill,
  RiArrowGoBackFill,
} from "react-icons/ri";
import { HiOutlinePlus } from "react-icons/hi";
import { LuCircleSlash2 } from "react-icons/lu";
import { TbStatusChange } from "react-icons/tb";
import Image from "next/image";
import PartnersAnonimPhoto from "@/public/partnerphoto.png";
import Modal from "../../modal/modal";
import AddPartner from "./addPartner";
import UpdatePartner from "./UpdatePartner";
import PartnerPage from "./PartnerPage";
import axios from "axios";
import DeletePartner from "./deletePartner";
import Assign from "./assign";
import AddPartnerWithUsers from "./addPartnerWithUsers";

const Partners = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showPageModal, setShowPageModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showNewPartnerUsersModal, setShowNewPartnerUsersModal] =
    useState(false);
  const [showUpdateAllStatusButton, setShowUpdateAllStatusButton] =
    useState(false);
  const [partnerData, setPartnerData] = useState([]);
  const [selectedPartnerId, setSelectedPartnerId] = useState(null);
  const [inactivePartnerMessage, setInactivePartnerMessage] = useState("");

  const fetchAllPartners = async () => {
    try {
      const res = await axios.get("http://localhost:3001/partners");
      const filteredPartners = res.data.filter(
        (partner) => partner.status !== 0
      );
      setPartnerData(filteredPartners);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchInactivePartners = async () => {
    try {
      const res = await axios.get("http://localhost:3001/partners");
      const inactivePartners = res.data.filter(
        (partner) => partner.status === 0
      );
      
      if (inactivePartners.length === 0) {
        setInactivePartnerMessage("There Aren't Any Inactive Partners!");
      } else {
        setInactivePartnerMessage("");
      }

      setPartnerData(inactivePartners);
      setShowUpdateAllStatusButton(true);
    } catch (error) {
      console.error(error);
    }
  };

  const updateAllPartnersStatus = async () => {
    try {
      await axios.put("http://localhost:3001/partner/update-status");
      fetchAllPartners()
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddPartnerSubmit = async () => {
    setShowAddModal(false);
    await fetchAllPartners();
  };
  const handleUpdatePartnerSubmit = async () => {
    setShowUpdateModal(false);
    await fetchAllPartners();
  };

  const handlePageModal = (partner) => {
    setSelectedPartnerId(partner);
    setShowPageModal(true);
  };

  const handleDeleteModal = (partner) => {
    setSelectedPartnerId(partner);
    setShowDeleteModal(true);
  };

  const handleDeleteModalSubmit = async () => {
    setShowDeleteModal(false);
    await fetchAllPartners();
  };

  const handleUpdateClick = (partner) => {
    setSelectedPartnerId(partner);
    setShowUpdateModal(true);
  };

  const handleAssignClick = () => {
    setShowDeleteModal(false);
    setShowAssignModal(true);
  };

  const handleAssignSubmit = async () => {
    setShowAssignModal(false);
    await fetchAllPartners();
  };

  const handleNewPartnerUsersClick = (e) => {
    e.preventDefault();
    setShowAssignModal(false);
    setShowNewPartnerUsersModal(true);
  };

  const handleNewPartnerUsersSubmit = async () => {
    setShowNewPartnerUsersModal(false);
    await fetchAllPartners();
  };

  const handleBackClick = async () => {
    setInactivePartnerMessage("");
    setShowUpdateAllStatusButton(false);
    await fetchAllPartners();
  };

  const handleupdateAllPartnersStatusClick = async () => {
    updateAllPartnersStatus()
    setInactivePartnerMessage("");
    setShowUpdateAllStatusButton(false)
    await fetchAllPartners()
   }

   const handleInactiveClick = async () => {
    try {
      await fetchInactivePartners();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllPartners();
  }, []);

  return (
    <Fragment>
      <div className="border-2 p-2.5 m-[15px] lg:mr-0 rounded-[20px] min-w-[45vw] min-h-[41vh] max-h-[41vh] text-cl5 bg-cl4 bg-opacity-30 shadow-md border-slate-500">
        <div className="flex justify-between text-xl">
          <div className="ml-2 flex">
            Partners
            {showUpdateAllStatusButton && (
              <button 
              className="hover:bg-slate-900 p-1 ml-1 rounded-full"
              onClick={handleBackClick}
              >
                <RiArrowGoBackFill />
              </button>
            )}
          </div>
          <div className="flex">
            {showUpdateAllStatusButton && (
              <button
                className="hover:bg-slate-900 p-1 rounded-full"
                onClick={handleupdateAllPartnersStatusClick}
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
        
        {inactivePartnerMessage && (
          <div className="text-xl text-center mt-5 text">{inactivePartnerMessage}</div>
        )}

        <div className="max-h-[34vh] overflow-auto pt-2">
          <table className="w-full text-sm">
            <tbody>
                {partnerData.map((partner) => (
                <tr
                  key={partner.id}
                  className="text-center flex flex-row justify-between items-center"
                >
                  <td className="w-full">
                    <button
                      onClick={() => handlePageModal(partner)}
                      className="flex w-5/6 hover:bg-slate-900 rounded-full p-1 overflow-hidden"
                    >
                      <Image
                        src={PartnersAnonimPhoto}
                        alt="Partners Logo"
                        width={20}
                        className="invert mt-1 mb-1 ml-6"
                      />
                      <div className="mt-1 mb-1 ml-20">{partner.name}</div>
                    </button>
                  </td>
                  <td>
                    <div className="inline-flex items-baseline text-lg mt-1">
                      <button
                        onClick={() => handleUpdateClick(partner)}
                        className="hover:bg-slate-900 p-1 rounded-full"
                      >
                        <RiSettings4Fill />
                      </button>
                      <button
                        onClick={() => handleDeleteModal(partner)}
                        className="hover:bg-slate-900 p-1 rounded-full"
                      >
                        <RiDeleteBin2Fill />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal isVisible={showAddModal} onClose={() => setShowAddModal(false)}>
        <AddPartner onSubmit={handleAddPartnerSubmit} />
      </Modal>
      <Modal
        isVisible={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
      >
        {selectedPartnerId && (
          <UpdatePartner
            onSubmit={handleUpdatePartnerSubmit}
            partner={selectedPartnerId}
          />
        )}
      </Modal>
      <Modal isVisible={showPageModal} onClose={() => setShowPageModal(false)}>
        {selectedPartnerId && <PartnerPage partner={selectedPartnerId} />}
      </Modal>
      <Modal
        isVisible={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
        }}
      >
        {selectedPartnerId && (
          <DeletePartner
            partner={selectedPartnerId}
            onDelete={handleDeleteModalSubmit}
            onAssignClick={handleAssignClick}
          />
        )}
      </Modal>
      <Modal
        isVisible={showAssignModal}
        onClose={() => setShowAssignModal(false)}
      >
        {selectedPartnerId && (
          <Assign
            partner={selectedPartnerId}
            onAssign={handleAssignSubmit}
            newPartnerUsers={handleNewPartnerUsersClick}
          />
        )}
      </Modal>
      <Modal
        isVisible={showNewPartnerUsersModal}
        onClose={() => setShowNewPartnerUsersModal(false)}
      >
        {selectedPartnerId && (
          <AddPartnerWithUsers
            partner={selectedPartnerId}
            onSubmit={handleNewPartnerUsersSubmit}
          />
        )}
      </Modal>
    </Fragment>
  );
};

export default Partners;
