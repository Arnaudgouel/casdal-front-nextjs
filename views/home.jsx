import { Company, CompanyCategories } from "../components";
import logo from "../assets/img/casdal_500.png"

const Header = () => {
  return (
    <div className="bg-info container-fluid" style={{height: "400px"}}>
      <div className="row text-center align-items-center align-content-center h-100">
        <div className="col-md-6"><h2 className="fs-1">Rendre le plaisir des papilles accessible au plus grand nombre</h2></div>
        <div className="col-md-6"><img src={logo} alt="logo casdal" className="img-fluid w-25" /></div>
      </div>
    </div>
)
}

const Home = ({display = null}) => {

  return (
    <div>
      <Header/>
      <div className="container mt-4">
        <CompanyCategories/>
        <hr/>
        <Company filter={display} />
      </div>
    </div>
  )
}

export { Home }