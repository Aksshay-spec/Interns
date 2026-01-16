import { useSelector, useDispatch } from "react-redux";
import { removeFromCart } from "../redux/actions/cartActions";

const Cart = () => {
  const cart = useSelector(state => state);
  const dispatch = useDispatch();

  return (
    <div className="product-title">
      <h2>Cart</h2>
      {cart.map(item => (
        <div key={item.id} className="product-item">
          {item.name}
          <button onClick={() => dispatch(removeFromCart(item.id))}>
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};

export default Cart;
