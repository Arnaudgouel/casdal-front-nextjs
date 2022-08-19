import { createContext } from "react";


const CartContext = createContext({
  price: 0,
  quantity: 0,
  setPrice: () => {},
  setQuantity: () => {},
});

export { CartContext }