import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useMe } from "../hooks/useMe"
import { CartContext } from "../utils"
import api from "../utils/api"

const CartItem = ({item, me, handleChangeItem, update, disable}) => {
  const [quantity, setQuantity] = useState(item.quantity)

  useEffect(() => {
    if (quantity !== item.quantity) {
      disable = true
      let data = new FormData()
      data.append("quantity", quantity)
      api.post(`cart/items/${item.id}`, data)
        .then(() => {
          handleChangeItem(!update)
        })
    }
  }, [quantity])

  const changeQuantity = (type) => {
    if (!disable) {
      switch (type) {
        case "increment":
          setQuantity(quantity+1)
          break
        case "decrement":
          setQuantity(quantity-1)
          break
        default:
      }
    }
  }
  return (
    <div className="row mt-3">
      <div className="col-4 text-center">
        <i className="bi bi-dash-circle" style={{cursor: "pointer"}} onClick={() => changeQuantity("decrement")}></i>
        <span className="mx-2">{quantity}</span>
        <i className="bi bi-plus-circle" style={{cursor: "pointer"}} onClick={() => changeQuantity("increment")}></i>
        </div>
      <div className="col-4">{item.name}</div>
      <div className="col-4 text-end">{(item.price/100).toFixed(2)} €</div>
    </div>
  )
}

const Cart = () => {
  const {price, setPrice, setQuantity} = useContext(CartContext);
  const [items, setItems] = useState([])
  const [isLoaded, setLoaded] = useState(false)
  const [error, setError] = useState()
  const [update, setUpdate] = useState(false)
  const {me} = useMe();
  const [disable, setDisable] = useState(false)
  const navigate = useNavigate()
  useEffect(() => {
    setLoaded(false)
    api.get("cart/items",{
      params: {
        "user_id": me?.id
      }
    })
      .then(res => {
        setItems(res.data.products)
        setLoaded(true)
      })
      .catch(error => {
        setError(error)
        setLoaded(true)
      })
  }, [me, setPrice])

  useEffect(() => {
    setDisable(true)
    api.get("cart/items",{
      params: {
        "user_id": me?.id
      }
    })
      .then(res => {
        setItems(res.data.products)
        setQuantity(res.data.total.quantity)
        if (!res.data.total) {
          setPrice(0)
        }
        else {
          setPrice(res.data.total.price)
        }
        setDisable(false)
      })
      .catch(error => {
        setError(error)
      })
  },[update, me, setPrice, setQuantity])

  const handleValidation = () => {
    let data = new FormData()
    data.append("user_id", me.id)
    api.post(`orders`, data)
      .then(() => {
        setPrice(0)
        setQuantity(0)
        navigate("/my-orders")
      }
      )
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
      <h2 className="text-center">Votre Panier</h2>
      {items.map(item => <CartItem key={item.id} item={item} me={me} handleChangeItem={setUpdate} update={update} disable={disable}/>)}
      <div className="mt-5 border-top pt-3 row">
        <div className="col-6">Total</div>
        <div className="col-6 text-end">{price ? (price/100).toFixed(2) : "0,00"} €</div>
      </div>
      <div className="mt-3 text-center d-grid">
        <button className="btn btn-primary btn-lg text-white" onClick={handleValidation} disabled={items.length === 0}>Valider mon panier</button>
      </div>
    </div>
  )
}

export { Cart }