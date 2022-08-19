import { useEffect, useState } from "react"
import { useMe } from "../hooks/useMe"
import api from "../utils/api"

const Profile = () => {
  const [isLoaded, setLoaded] = useState(false)
  const [error, setError] = useState()
  const [updateError, setUpdateError] = useState()
  const [updateSuccess, setUpdateSuccess] = useState()
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [currentPwd, setCurrentPwd] = useState("")
  const [newPwd, setNewPwd] = useState("")
  const {me} = useMe();
  useEffect(() => {
    setLoaded(false)
    setUpdateSuccess(null)
    setUpdateError(null)
    api.get("user",{
      params: {
        "user_id": me?.id
      }
    })
      .then(res => {
        setLoaded(true)
        setEmail(res.data.email)
        setFirstName(res.data.first_name)
        setLastName(res.data.last_name)
      })
      .catch(error => {
        setError(error)
        setLoaded(true)
      })
  }, [me])

  const handleSubmit = (e) => {
    e.preventDefault()
    setUpdateError(null)
    setUpdateSuccess(null)
    let data = new FormData();
    data.append("email", email)
    data.append("first_name", firstName)
    data.append("last_name", lastName)
    data.append("current_password", currentPwd)
    if(newPwd) data.append("new_password", newPwd)
    api.post(`user/${me.id}`,data)
      .then(res => {
        setEmail(res.data.email)
        setFirstName(res.data.first_name)
        setLastName(res.data.last_name)
        setUpdateSuccess(true)
      })
      .catch(error => {
        setUpdateError(error)
      })
  }
  if (error) {
    return <div>{error}</div>
  }
  else if (!isLoaded) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }
  return (
    <div className="container my-5 bg-white shadow rounded-3 p-4">
      <h2 className="text-center">Votre Compte</h2>
      {updateError && <div>Mot de passe invalide</div>}
      {updateSuccess && <div className="alert alert-success">Modification réussie</div>}
      <form onSubmit={e => handleSubmit(e)}>
        <div className="row">
          <label htmlFor="email" className="col-sm-2 col-form-label">Email</label>
          <div className="col-sm-10">
            <input type="email" className="" id="email" value={email} onInput={e => setEmail(e.target.value)} required/>
          </div>
        </div>
        <div className="row mt-2">
          <label htmlFor="firstName" className="col-sm-2 col-form-label">Prénom</label>
          <div className="col-sm-10">
            <input type="text" className="" id="firstName" value={firstName} onInput={e => setFirstName(e.target.value)} required/>
          </div>
        </div>
        <div className="row mt-2">
          <label htmlFor="lastName" className="col-sm-2 col-form-label">Nom</label>
          <div className="col-sm-10">
            <input type="text" className="" id="lastName" value={lastName} onInput={e => setLastName(e.target.value)} required/>
          </div>
        </div>
        <div className="row mt-2">
          <label htmlFor="currentPwd" className="col-sm-2 col-form-label">Votre mot de passe actuel</label>
          <div className="col-sm-10">
            <input type="password" className="" id="currentPwd" value={currentPwd} onInput={e => setCurrentPwd(e.target.value)} required/>
          </div>
        </div>
        <div className="row mt-2">
          <label htmlFor="newPwd" className="col-sm-2 col-form-label">Votre nouveau mot de passe</label>
          <div className="col-sm-10">
            <input type="password" className="" id="newPwd" value={newPwd} onInput={e => setNewPwd(e.target.value)}/>
          </div>
        </div>
        <div className="mt-3 text-center d-grid">
          <button className="btn btn-primary btn-lg text-white">Valider mes nouvelles informations</button>
        </div>
      </form>
    </div>
  )
}

export { Profile }