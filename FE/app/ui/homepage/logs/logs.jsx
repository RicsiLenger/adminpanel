import React, { useState, useEffect } from "react";
import axios from "axios";

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState("");

  const fetchLogs = async () => {
    try {
      const res = await axios.get("http://localhost:3001/log");
      setLogs(res.data.reverse());
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs =
    filter === ""
      ? logs
      : logs.filter((logEntry) => {
          const filterValues = filter.split(",").map((value) => value.trim());
          return filterValues.includes(logEntry.logtype_name);
        });

  return (
    <div className="border-2 p-2.5 m-[15px] lg:mr-0 rounded-[20px] min-w-[45vw] min-h-[27vh] text-cl5 bg-cl4 bg-opacity-30 shadow-md border-slate-500">
      <div className="flex justify-between text-xl mb-5">
        <div className="ml-2">Logs</div>
        <div>
          <select
            name="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-cl4 rounded-xl p-1 text-sm"
          >
            <option value="">Filter</option>
            <option value="User Added">User Add</option>
            <option value="User Deleted">User Delete</option>
            <option value="User Updated, User's status changed, User partner updated">User Update</option>
            <option value="Partner Added">Partner Add</option>
            <option
              value={"Partner Deleted With Users, Partner and it users Deleted, Partner Deleted and assigned it users to a new partner"}
            >
              Partner Delete
            </option>
            <option value="Partner Updated, Partner's status changed">Partner Update</option>
            <option value="User Logged In">Login</option>
            <option value="User Logged Out">Logout</option>
          </select>
        </div>
      </div>
      <div className="max-h-[17vh] overflow-auto flex">
        <table className="w-full text-sm">
          <tbody>
            {filteredLogs.map((logEntry, index) => (
              <tr key={index} className="flex justify-between">
                <td className="px-5">{logEntry.logtype_name}</td>
                <td className="px-4">
                  {new Date(logEntry.date).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Logs;
