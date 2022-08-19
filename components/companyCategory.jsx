import { Fragment, useEffect, useState } from "react"
import API from "../utils/api"
import Link from "next/link"


const Item = ({className, item}) => {
  
  let image = require(`../img/companyCategory/burger.png`)
  if (null !== item.image) {
    image = require(`../img/companyCategory/${item.image}`)
  }

  return (
    <div key={item.id} className="flex-grow-1" style={{flexBasis:"200px", whiteSpace:"nowrap"}}>
      <Link href={`/category/${item.id}`} className="text-decoration-none text-black">
        <div className="" aria-hidden="true" style={{backgroundImage: `url("../img/companyCategory/${item.image}")`, backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center", height: "150px"}}>
          <div className="fs-3 fw-bold">
            {item.title}
          </div>
        </div>
      </Link>
    </div>
  )
}

const CompanyCategories = () => {
  const [categories, setCategories] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(null)


  useEffect(() => {
    API.get(`company-categories`)
      .then(res => {
        setCategories(res.data)
        setIsLoaded(true)
      })
      .catch(error => {
        setError(error)
        setIsLoaded(true)
      })
  }, [])

  if (error) {
    return <div>Erreur : {error.message}</div>
  }
  else if (!isLoaded) {
    return (
      <div className="flex-grow-1" style={{flexBasis:"200px", whiteSpace:"nowrap"}}>
        <div className="card" aria-hidden="true">
          <div className="card-body">
            <h5 className="card-title placeholder-glow">
              <span className="placeholder col-6"></span>
            </h5>
            <p className="card-text placeholder-glow">
              <span className="placeholder col-7"></span>
            </p>
            <p className="btn btn-primary disabled placeholder col-6"></p>
          </div>
        </div>
      </div>
    )
  }
  return (
    <Fragment>
      <h3>Catégories</h3>
      <div className="box">
        <div className="row mt-1 justify-content-between align-self-center flex-nowrap content">
          {categories.map(category => <Item key={category.id} item={category}/>)}
        </div>
      </div>
    </Fragment>
  )
}

export { CompanyCategories }