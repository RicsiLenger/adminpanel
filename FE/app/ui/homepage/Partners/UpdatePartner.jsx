import React, { useState } from "react";
import axios from "axios";

const UpdatePartner = ({ onSubmit, partner }) => {
  const [updatePartner, setPartner] = useState(partner)
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:3001/partners/${partner.id}`, updatePartner);
      if (onSubmit) onSubmit();
    } catch (err) {
      console.log(err);
      alert("Ezekkel az adatokkal már rendelekzik partner");
    }
  };

  return (
    <div>
      <form
        action=""
        onSubmit={handleSubmit}
        className="shadow-md rounded-xl p-8 w-full md:max-w-2xl md:mx-auto border border-slate-700 bg-cl4"
      >
        <h2 className="text-gray-100 mb-8 border-b border-slate-800">
          Update Partner
        </h2>
        <input
          name="name"
          type="text"
          placeholder="Partner name"
          value={updatePartner.name}
          onChange={(e) => setPartner((p) => ({ ...p, name: e.target.value }))}
          className="mb-4 px-4 py-2 border border-solid border-b-2 border-r-2 w-full bg-transparent border-slate-800 rounded-xl placeholder-gray-200"
          required
        ></input>
        <input
          name="location"
          type="text"
          placeholder="Location"
          value={updatePartner.location}
          onChange={(e) =>
            setPartner((p) => ({ ...p, location: e.target.value }))
          }
          className="mb-4 px-4 border py-2 border-solid border-b-2 border-r-2 w-full bg-transparent border-slate-800 rounded-xl placeholder-gray-200"
        ></input>
        <input
          name="phone"
          type="text"
          placeholder="Phone number"
          value={updatePartner.phone}
          onChange={(e) => setPartner((p) => ({ ...p, phone: e.target.value }))}
          className="mb-4 px-4 border py-2 border-solid border-b-2 border-r-2 w-full bg-transparent border-slate-800 rounded-xl placeholder-gray-200"
        ></input>
        <select
              name="isActive"
              value={updatePartner.status}
              onChange={(e) =>
                setPartner((p) => ({ ...p, status: e.target.value }))
              }
              className="mb-4 px-4 border py-2 border-solid border-b-2 border-r-2 w-full bg-cl4 border-slate-800 rounded-xl text-gray-200"
              disabled={updatePartner.status === 1}
            >
              <option value={2}>Is Active?</option>
              <option value={1}>Yes</option>
              <option value={0}>No</option>
            </select>
        <textarea
          name="desc"
          value={partner.description}
          onChange={(e) =>
            setPartner((p) => ({ ...p, description: e.target.value }))
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

export default UpdatePartner;
