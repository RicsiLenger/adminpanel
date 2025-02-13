import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PartnerPage = ({ partner }) => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/partners/${partner.id}/users`);
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [partner.id]);

  return (
    <div className='text-cl5 mr-5 ml-5'>
      <div className='shadow-md rounded-xl p-8 w-full md:max-w-2xl md:mx-auto border border-slate-700 bg-cl4 mb-5 flex justify-between mt-5'>
       <div className='text-center'> 
        <h1 className='text-2xl'>{partner.name}</h1>
        <p className=' text-sm'>{partner.status === 1 ? "active" : "inactive"}</p>
       </div>
        <h1 className='mr-28'>"Logo"</h1>
      </div>
      
      <div className='shadow-md rounded-xl p-8 w-full md:max-w-2xl md:mx-auto border border-slate-700 bg-cl4 min-h-96'>
        <div className='mb-2'>User list</div>
        <table className='w-full text-sm'>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className='p-2.5 text-center'>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{new Date(user.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* <div className='shadow-md rounded-xl p-8 w-full md:max-w-2xl md:mx-auto border border-slate-700 bg-cl4 bg-opacity-50 mb-5 mt-5'>
        <Chart />
      </div> */}
    </div>
  );
};

export default PartnerPage;
