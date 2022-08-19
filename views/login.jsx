import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import logo from "../assets/img/casdal_500.png"
import useToken from "../hooks/useToken"
import api from "../utils/api"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const {setToken, token} = useToken()
  const location = useLocation()

  let background = require(`../assets/img/background casdal login.png`)

  let from = location.state?.from?.pathname || "/"

  const handleSubmit = (e) => {
    e.preventDefault()
    api.post("login",
      {
        "username": email,
        "password": password
      }
    )
      .then(res => {
        setError(null)
        if (!token) {
          setToken(res.data)
        }
        navigate(from, {replace: true})
      })
      .catch(error => setError(error.response.data))
  }
  return (
    <div className="w-100 h-100" style={{backgroundImage: `url("${background}")`, backgroundSize: "cover"}}>
      <div className="position-absolute top-50 start-50 translate-middle bg-light shadow-lg text-center p-3">
        {error &&
          <div className="alert alert-danger">
            Les identifiants ne sont pas corrects
          </div>
        }
        <img className="img-fluid w-25" src={logo} alt="logo" />
        <div className="mt-3 fs-3">Connexion</div>
        <form className="needs-validation" onSubmit={(e) => handleSubmit(e)}>
          <label className="form-label" htmlFor="email">Email</label>
          <input type="email" className="form-control" id="email" value={email} onInput={e => setEmail(e.target.value)} required/>
          <div className="invalid-feedback">
            Veullez renseigner un email
          </div>
          <label className="form-label" htmlFor="password">Mot de passe</label>
          <input type="password" className="form-control" id="password" value={password} onInput={e => setPassword(e.target.value)} required/>
          <div className="invalid-feedback">
            Veullez renseigner un mot de passe
          </div>
          <button className="btn btn-primary mt-2">Se connecter</button>
        </form>
      </div>
    </div>
  )
}

export { Login }