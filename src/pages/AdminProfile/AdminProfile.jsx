import React, { useState } from 'react'
import { useFetch } from '../../hooks/useFetch'
import { Link, useNavigate } from 'react-router-dom'
import { useEditUser } from '../../hooks/useEditUser';

export const AdminProfile = () => {
    const [isEditing, setIsEditing] = useState('');
    console.log(isEditing)
    const {data: users, load, error, setLoading} = useFetch('http://localhost:3002/users')

    const handelDelete = async (userToDelete) =>{
        setLoading(true)
        try {
          await fetch(`http://localhost:3002/users/${userToDelete}`, {method: 'DELETE'})
          await fecthData()
        } catch (error) {
          console.log("it seems like you are not be able to eliminate this user..", error)
        } finally{
          setLoading(false)
        }
    
      }


    const handleEdit = (id_user)=>{
      
      setIsEditing(id_user)
      const currentUser = users.find(user => user.id === id_user);
      setUser({ username: currentUser.username, email: currentUser.email, role: currentUser.role });
   
    }  

    const navigate = useNavigate()
    const {editUser} = useEditUser()
    const [user, setUser] = useState({ username: "", email:"", role: 0})

    const handelInput = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    } 
    
    const handelSubmit = async (e) =>{
        e.preventDefault()
        //obtain id
        const formData = new FormData(e.target)
        const id_user = formData.get("id")
        const success = await editUser(user, id_user)
        if(success){  
            setIsEditing('')
            navigate('/admin-profile')
           
        }
    }

    if (users.length < 0) {
        return <h1>no user found</h1>;
      } else {
        return (
          <div className="mt-5">
            {load && <div>Loading..</div>}
            {error && <p>Error: {error}</p>}
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>UserName</th>
                  <th>Email</th>
                  <th>Password</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users?.map((item, i) => {
                  return (
                    
                <tr key={i + 1}>
                  <td>{item.id}</td>
                  
                  <td>
                    {!(isEditing === item.id) ? (
                      item.username
                    ) : (
                      <input
                        type="text"
                        className="form-control"
                        id="username"
                        name="username"
                        value={user.username}
                        onChange={handelInput}
                      />
                    )}
                  </td>
                  <td>
                    {!(isEditing === item.id) ? (
                      item.email
                    ) : (
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={user.email}
                        onChange={handelInput}
                      />
                    )}
                  </td>
                  <td>{item.password}</td>
                  <td>
                    {!(isEditing === item.id) ? (
                      item.role.id
                    ) : (
                      <input
                        type="number"
                        className="form-control"
                        id="role"
                        name="role"
                        value={user.role.id}
                        onChange={handelInput}
                      />
                    )}
                  </td>
                  <td>
                    {!(isEditing === item.id) ? (
                      <>
                        <button onClick={() => handleEdit(item.id)} >Editar</button>
                        <Link to={`/user/${item.id}`}>
                          <i className="fa fa-eye" aria-hidden="true"></i>
                        </Link>
                        <button onClick={() => handelDelete(item.id)}>Delete Me</button>
                      </>
                    ) : (
                      <form onSubmit={handelSubmit}>
                        <input
                        type="hidden"
                        id="id"
                        name="id"
                        value={item.id}
                        onChange={handelInput}
                      />
                        <button type="submit" className="btn btn-primary submit-btn">
                          Submit
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
                    
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      }
}
