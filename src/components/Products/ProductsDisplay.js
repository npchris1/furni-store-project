import { useSelector } from 'react-redux';
import { ProductCardGrid, ProductCardList, Loading } from '..';

const ProductsDisplay = () => {
  const { loading, filterProducts, display } = useSelector(
    (state) => state.products
  );
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <ul
          className={
            display === 'grid'
              ? 'w-full grid gap-4 justify-center md:grid-cols-2 xl:grid-cols-3'
              : 'w-full flex-cols'
          }
        >
          {filterProducts.length === 0 && (
            <div className="font-bold text-red-500">
              Sorry! No products matched your search
            </div>
          )}

          {filterProducts.map((product) => {
            return (
              <li
                key={product.id}
                className="w-[250px] md:w-full mb-8 last:mb-0"
              >
                {display === 'grid' ? (
                  <ProductCardGrid singleProductData={product} />
                ) : (
                  <ProductCardList singleProductData={product} />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
};
export default ProductsDisplay;