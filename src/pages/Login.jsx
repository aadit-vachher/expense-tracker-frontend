import {useState} from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import './Login.css'

const Login=()=>{
  const [email,setemail]=useState('')
  const [pass,setpass]=useState('')
  const [err,seterr]=useState('')
  const navigate=useNavigate()
  const sub=async(e)=>{
    e.preventDefault()
    try{
      const res=await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`,{email,password:pass})
      localStorage.setItem('token',res.data.token)
      seterr('')
      navigate('/dashboard')}
      catch(error){
      seterr(error.response?.data?.message||'Login failed')}
  }
  return(
    <div className="logcont">
      <div className="logbox">
        <div className="logbrand">
          <span>Expense Tracker</span>
        </div>
        <h2 className="logtitle">Sign in to your account</h2>
        <p className="logsub">Track your expenses and budget</p>
        <form onSubmit={sub} className="logform">
          {err&&<div className="logerr">{err}</div>}
          <input type="email" placeholder="Email" value={email} required
            onChange={e=>setemail(e.target.value)}
            className="loginp"/>
          <input type="password" placeholder="Password" value={pass} required
            onChange={e=>setpass(e.target.value)}
            className="loginp"/>
          <button type="submit" className="logbtn">Login</button>
        </form>
        <div className="logfooter">
          Don't have an account?
          <button type="button" className="loglink" onClick={()=>navigate('/signup')}>Sign Up</button>
        </div>
      </div>
    </div>
  )
}
export default Login
