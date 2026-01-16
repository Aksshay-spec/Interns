import { useDispatch } from "react-redux";
import { addToCart } from "../redux/actions/cartActions";

const Products = () => {
  const dispatch = useDispatch();

  const products = [
    { id:1, name:"Shoes" },
    { id:2, name:"T-Shirt" },
    { id:3, name:"Jeans" },
    { id:4, name:"Watch" },
    { id:5, name:"Backpack" }
  ];

  return (
    <>
      <h2 className="product-title">Products</h2>

      {products.map((product) => (
        <div key={product.id} className="product-item">
          <p>{product.name}</p>
          <button
            onClick={() => dispatch(addToCart(product))}>
            Add to Cart
          </button> 
        </div>
      ))}
    </>
  );
};

export default Products;
