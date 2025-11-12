import {useState} from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import './Signup.css'

const Signup=()=>{
  const [name,setname]=useState('')
  const [email,setemail]=useState('')
  const [pass,setpass]=useState('')
  const [error,seterr]=useState('')
  const navigate=useNavigate()

  const sub=async(e)=>{
    e.preventDefault()
    try{
      const res=await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/signup`,{name,email,password:pass})
      localStorage.setItem('token',res.data.token)
      seterr('')
      navigate('/dashboard')
    }catch(err){
      seterr(err.response?.data?.message||'Signup failed')
    }
  }

  return(
    <div className="signupcont">
      <div className="signupbox">
        <div className="signupbrand">
          <span>Expense Tracker</span>
        </div>
        <h2 className="signuptitle">Create Account</h2>
        <p className="signupsub">Sign up and get started</p>
        <form onSubmit={sub} className="signupform">
          {error&&<div className="signuperr">{error}</div>}
          <input type="text" placeholder="Name" value={name} required
            onChange={e=>setname(e.target.value)}
            className="signupinp"/>
          <input type="email" placeholder="Email" value={email} required
            onChange={e=>setemail(e.target.value)}
            className="signupinp"/>
          <input type="password" placeholder="Password" value={pass} required
            onChange={e=>setpass(e.target.value)}
            className="signupinp"/>
          <button type="submit" className="signupbtn">Sign Up</button>
        </form>
        <div className="signupfooter">
          Already have an account?
          <button type="button" className="signuplink" onClick={()=>navigate('/login')}>Login</button>
        </div>
      </div>
    </div>
  )
}

export default Signup
