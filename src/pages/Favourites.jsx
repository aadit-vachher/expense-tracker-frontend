import {useState,useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import './Dashboard.css'

const Favourites=()=>{
  const navigate=useNavigate()
  const [favs,setFavs]=useState([])
  const [error,setError]=useState('')

  useEffect(()=>{
    const token=localStorage.getItem('token')
    if(!token) navigate('/login')
    else fetchFavs()
  },[navigate])

  const fetchFavs=async()=>{
    try{
      const token=localStorage.getItem('token')
      const res=await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/favorite/all`,
        {headers:{Authorization:`Bearer ${token}`}})
      setFavs(res.data)
    }catch(err){
      setError('Could not fetch favourites')
    }
  }

  const handleDeleteFav=async(id)=>{
    try{
      const token=localStorage.getItem('token')
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/favorite/delete/${id}`,
        {headers:{Authorization:`Bearer ${token}`}})
      fetchFavs()
    }catch(err){
      setError('Failed to delete favourite')
    }
  }

  const handleEditFav=async(id,amount,category,description)=>{
    const newAmount=prompt('New amount',amount)
    if(newAmount===null) return
    const newCat=prompt('New category',category)
    if(newCat===null) return
    const newDesc=prompt('New description',description)
    if(newDesc===null) return
    try{
      const token=localStorage.getItem('token')
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/favorite/update/${id}`,
        {amount:newAmount,category:newCat,description:newDesc},
        {headers:{Authorization:`Bearer ${token}`}})
      fetchFavs()
    }catch(err){
      setError('Failed to update favourite')
    }
  }

  return(
    <div className="dashcont">
      <div className="dashhead">
        <div className="dashleft">
          <h1 className="dashlogo">Favourite Expenses</h1>
        </div>
        <div className="dashright">
          <button className="viewbtn" onClick={()=>navigate('/dashboard')}>Back</button>
        </div>
      </div>
      <div className="dashbody">
        <div className="expenseslist">
          <h3>Your Favourites</h3>
          {error && <div className="err">{error}</div>}
          {favs.length===0 ? (
            <div className="noexp">No favourites yet</div>
          ) : (
            <table className="exptable">
              <thead>
                <tr>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {favs.map(f=>
                  <tr key={f.id}>
                    <td>{f.amount}</td>
                    <td>{f.category}</td>
                    <td>{f.description}</td>
                    <td>{f.date ? new Date(f.date).toLocaleDateString("en-IN") : ""}</td>
                    <td>
                      <button className="pagebtn" onClick={()=>handleEditFav(f.id,f.amount,f.category,f.description)}>Edit</button>
                      <button className="deletebtn" onClick={()=>handleDeleteFav(f.id)}>Delete</button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default Favourites
