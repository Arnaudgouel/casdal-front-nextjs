import zIndex from "@mui/material/styles/zIndex"
import { Fragment, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useMe } from "../hooks/useMe"
import api from "../utils/api"

const Adress = ({item}) => {
  const [name, setName] = useState(item.name)
  const [address1, setAddress1] = useState(item.address_line1)
  const [address2, setAddress2] = useState(item.address_line2)
  const [city, setCity] = useState(item.city)
  const [code, setCode] = useState(item.postal_code)
  const [country, setCountry] = useState(item.country)
  const [phone, setPhone] = useState(item.phone_number)
  const [updateError, setUpdateError] = useState()
  const [updateSuccess, setUpdateSuccess] = useState()
  const [display, setDisplay] = useState(true)
  
  const handleSubmit = (e) => {
    e.preventDefault()
    setUpdateError(null)
    setUpdateSuccess(null)
    let data = new FormData();
    data.append("name", name)
    data.append("address_line1", address1)
    data.append("address_line2", address2)
    data.append("city", city)
    data.append("postal_code", code)
    data.append("country", country)
    data.append("phone_number", phone)
    api.post(`users/addresses/${item.id}`,data)
      .then(res => {
        setUpdateSuccess(true)
      })
      .catch(error => {
        setUpdateError(error)
      })
  }
  const handleDelete = (e) => {
    e.preventDefault()
    api.delete(`users/addresses/${item.id}`)
      .then(
        setDisplay(false)
      )
  }
  return (
    <Fragment>
      {display &&
        <div className="accordion-item" id={`accordion-address${item.id}`}>
          <h2 className="accordion-header" id={item.id}>
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#flush-collapse${item.id}`} aria-expanded="false" aria-controls={`flush-collapse${item.id}`}>
              {item.name && item.name}<span className=""> - {item.address_line1} {item.city}</span>
            </button>
          </h2>
          <div id={`flush-collapse${item.id}`} className="accordion-collapse collapse" aria-labelledby={item.id} data-bs-parent={`#accordion-address${item.id}`}>
            <div className="accordion-body">
              {updateError && <div>{updateError}</div>}
              {updateSuccess && <div className="alert alert-success">Modification réussie</div>}
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
                  <input type="text" className="" id="address2" value={address2} onInput={e => setAddress2(e.target.value)} required/>
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
                <button className="btn btn-dark mt-2 me-3">Valider les modifications</button>
                <button className="btn btn-danger mt-2" onClick={e => handleDelete(e)}>Supprimer l'adresse</button>
              </form>
              </div>
          </div>
        </div>
      } 
    </Fragment>
  )
}

const Addresses = () => {
  const [isLoaded, setLoaded] = useState(false)
  const [error, setError] = useState()
  const [addresses, setAddresses] = useState([])
  const {me} = useMe();
  useEffect(() => {
    setLoaded(false)
    api.get("users/addresses",{
      params: {
        "user_id": me?.id
      }
    })
      .then(res => {
        setLoaded(true)
        setAddresses(res.data)
      })
      .catch(error => {
        setError(error)
        setLoaded(true)
      })
  }, [me])

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
      <h2 className="text-center mb-4">Vos Adresses</h2>
      <Link to={"/address/add"}><button className="btn btn-success float-end mb-3">Ajouter</button></Link>
      <div className="accordion accordion-flush">
        {addresses.map(address => <Adress key={address.id} item={address}/>)}
      </div>
    </div>
  )
}

export { Addresses }