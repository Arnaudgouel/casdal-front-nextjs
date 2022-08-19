import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useMe } from "../hooks/useMe"
import api from "../utils/api"

const AddressForm = () => {
  const [name, setName] = useState("")
  const [address1, setAddress1] = useState("")
  const [address2, setAddress2] = useState("")
  const [city, setCity] = useState("")
  const [code, setCode] = useState("")
  const [country, setCountry] = useState("")
  const [phone, setPhone] = useState("")
  const [updateError, setUpdateError] = useState()
  const [updateSuccess, setUpdateSuccess] = useState()
  const {me} = useMe()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setUpdateError(null)
    setUpdateSuccess(null)
    let data = new FormData();
    data.append("user_id", me.id)
    data.append("name", name)
    data.append("address_line1", address1)
    data.append("address_line2", address2)
    data.append("city", city)
    data.append("postal_code", code)
    data.append("country", country)
    data.append("phone_number", phone)
    api.post(`users/addresses`,data)
      .then(res => {
        setUpdateSuccess(true)
        navigate('/address')

      })
      .catch(error => {
        setUpdateError(error)
      })
  }

  return (
    <div className="container my-5 bg-white shadow rounded-3 p-4">
      <form onSubmit={e => handleSubmit(e)}>
        <label htmlFor="name" className="col-sm-2 col-form-label">Nom</label>
        <div className="col-sm-10">
          <input type="text" className="" id="name" value={name} onInput={e => setName(e.target.value)} required/>
        </div>
        <label htmlFor="address1" className="col-sm-2 col-form-label">Adresse ligne 1</label>
        <div className="col-sm-10">
          <input type="text" className="" id="address1" value={address1} onInput={e => setAddress1(e.target.value)} required/>
        </div>
        <label htmlFor="address2" className="col-sm-2 col-form-label">Adresse ligne 2</label>
        <div className="col-sm-10">
          <input type="text" className="" id="address2" value={address2} onInput={e => setAddress2(e.target.value)}/>
        </div>
        <label htmlFor="city" className="col-sm-2 col-form-label">Ville</label>
        <div className="col-sm-10">
          <input type="text" className="" id="city" value={city} onInput={e => setCity(e.target.value)} required/>
        </div>
        <label htmlFor="code" className="col-sm-2 col-form-label">Code postal</label>
        <div className="col-sm-10">
          <input type="text" className="" id="code" value={code} onInput={e => setCode(e.target.value)} required/>
        </div>
        <label htmlFor="country" className="col-sm-2 col-form-label">Pays</label>
        <div className="col-sm-10">
          <input type="text" className="" id="country" value={country} onInput={e => setCountry(e.target.value)} required/>
        </div>
        <label htmlFor="phone" className="col-sm-2 col-form-label">Numéro de téléphone</label>
        <div className="col-sm-10">
          <input type="text" className="" id="phone" value={phone} onInput={e => setPhone(e.target.value)} required/>
        </div>
        <button className="btn btn-primary mt-2">Valider les modifications</button>
      </form>
    </div>
  )
}

export { AddressForm }