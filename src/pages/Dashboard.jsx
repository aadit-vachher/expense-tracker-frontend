import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import './Dashboard.css'

const Dashboard=()=>{
  const navigate=useNavigate()
  const [expenses,setExpenses]=useState([])
  const [amount,setAmount]=useState('')
  const [category,setCategory]=useState('')
  const [desc,setDesc]=useState('')
  const [error,setError]=useState('')
  const [showForm,setShowForm]=useState(false)
  const [showList,setShowList]=useState(false)
  const [currentPage,setCurrentPage]=useState(1)
  const [budget,setBudget]=useState(5000)
  const [editingBudget,setEditingBudget]=useState(false)
  const itemsPerPage=5

  useEffect(()=>{
    const token=localStorage.getItem('token')
    if(!token){
      navigate('/login')
    }else{
      fetchExpenses()
    }
  },[navigate])

  useEffect(() => {
    setCurrentPage(1)
  }, [expenses])

  const fetchExpenses=async()=>{
    try{
      const token=localStorage.getItem('token')
      const res=await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/expense/allexpenses`,
        {headers:{Authorization:`Bearer ${token}`}})
      setExpenses(res.data)
    }catch(err){
      setError('Could not fetch expenses',err)
    }
  }

  const handleAddExpense=async(e)=>{
    e.preventDefault()
    try{
      const token=localStorage.getItem('token')
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/expense/addexpense`,
        {amount,category,description:desc},
        {headers:{Authorization:`Bearer ${token}`}})
      setAmount('')
      setCategory('')
      setDesc('')
      setError('')
      setShowForm(false)
      fetchExpenses()
    }catch(err){
      setError('Failed to add expense',err)
    }
  }

  const handleDeleteExpense=async(id)=>{
    try{
      const token=localStorage.getItem('token')
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/expense/deleteexpense/${id}`,{
        headers:{Authorization:`Bearer ${token}`}
      })
      fetchExpenses()
    }catch(err){
      setError('Failed to delete expense',err)
    }
  }

  const handleLogout=()=>{
    localStorage.removeItem('token')
    navigate('/login')
  }

  const totalExpenses=expenses.reduce((sum,e)=>sum+Number(e.amount),0)
  const now = new Date()
  const thisMonthExpenses = expenses
    .filter(e => {
      const field = e.date || e.createdAt
      if(!field) return false
      const d = new Date(field)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
    .reduce((sum, e) => sum + Number(e.amount), 0)
  const budgetLeft=budget-totalExpenses
  const lastIndex=currentPage*itemsPerPage
  const firstIndex=lastIndex-itemsPerPage
  const paginatedExpenses=expenses.slice(firstIndex,lastIndex)
  const totalPages=Math.ceil(expenses.length/itemsPerPage)

  const submitBudgetEdit=(e)=>{
    e.preventDefault()
    setEditingBudget(false)
  }

  return(
    <div className="dashcont">
      <div className="dashhead">
        <div className="dashleft">
          <h1 className="dashlogo">Expense Tracker</h1>
        </div>
        <div className="dashright">
          <button className="logoutbtn" onClick={handleLogout}>Logout</button>
        </div>
      </div>
      <div className="dashbody">
        <div className="wellsec">
          <h2 className="welltitle">Welcome to Expense Tracker!</h2>
          <p className="wellsub">Manage your finances and track your spending efficiently.</p>
        </div>
        <div className="cardgrid">
          <div className="card">
            <div className="cardicon"><img src='/total_exp.png' alt='Total Expenses' /></div>
            <p className="cardval">₹{totalExpenses}</p>
            <div className="cardlabel">Total Expenses</div>
          </div>
          <div className="card">
            <div className="cardicon"><img src="/this_month.png" alt="this_month" /></div>
            <p className="cardval">₹{thisMonthExpenses}</p>
            <div className="cardlabel">This Month</div>
          </div>
          <div className="card">
            <div className="cardicon"><img src="/budget_left .png" alt="" /></div>
            <p className="cardval">₹{budgetLeft}</p>
            <div className="cardlabel">
              Budget Left
              {editingBudget ? (
                <form onSubmit={submitBudgetEdit} style={{marginTop: "6px"}}>
                  <input
                    type="number"
                    value={budget}
                    onChange={e=>setBudget(Number(e.target.value))}
                    style={{width:"90px",fontSize:"1rem"}}
                  />
                  <button
                    type="submit"
                    style={{marginLeft:"8px",padding:"6px",fontSize:"0.95rem"}}>Save</button>
                </form>
              ) : (
                <button
                  style={{
                    background:"#fbbf24",
                    border:"none",
                    borderRadius:"7px",
                    fontSize:"0.95rem",
                    color:"#393200",
                    marginLeft:"8px",
                    padding:"6px 13px",
                    cursor:"pointer"
                  }}
                  onClick={()=>setEditingBudget(true)}>
                  Edit
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="actsec">
          <button className="actbtn addbtn" onClick={()=>setShowForm(!showForm)}>+ Add Expense</button>
          <button className="actbtn viewbtn" onClick={()=>setShowList(!showList)}>View All Expenses</button>
        </div>
        <div className="infosec">
          <p className="infotext">Start by adding your first expense to begin tracking your spending. You can view detailed analytics and reports later.</p>
        </div>
        {showForm &&
          <form className="addexpenseform" onSubmit={handleAddExpense}>
            <input type="number" placeholder="Amount" value={amount} onChange={e=>setAmount(e.target.value)} required />
            <input type="text" placeholder="Category" value={category} onChange={e=>setCategory(e.target.value)} required />
            <input type="text" placeholder="Description" value={desc} onChange={e=>setDesc(e.target.value)} required />
            <button type="submit">Add</button>
            <button type="button" onClick={()=>setShowForm(false)}>Cancel</button>
            {error && <div className="err">{error}</div>}
          </form>
        }
        {showList &&
          <div className="expenseslist">
            <h3>Your Expenses</h3>
            {expenses.length === 0 ? (
              <div className="noexp">No expenses yet</div>
            ) : (
              <>
                <table className="exptable">
                  <thead>
                    <tr>
                      <th>Amount</th>
                      <th>Category</th>
                      <th>Description</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedExpenses.map(e=>
                      <tr key={e.id}>
                        <td>{e.amount}</td>
                        <td>{e.category}</td>
                        <td>{e.description}</td>
                        <td>
                          <button className="deletebtn" onClick={()=>handleDeleteExpense(e.id)}>Delete</button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                {totalPages > 1 && (
                  <div className="pagination">
                    <button onClick={()=>setCurrentPage(p=>Math.max(p-1,1))} disabled={currentPage===1} className="pagebtn">Prev</button>
                    <span className="pagenum">{currentPage} / {totalPages}</span>
                    <button onClick={()=>setCurrentPage(p=>Math.min(p+1,totalPages))} disabled={currentPage===totalPages} className="pagebtn">Next</button>
                  </div>
                )}
              </>
            )}
            <button className="closebtn" onClick={()=>setShowList(false)}>Close</button>
          </div>
        }
      </div>
    </div>
  )
}

export default Dashboard
