import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AiOutlineSearch, AiOutlineCheck } from 'react-icons/ai';

import FilterDropdown from './FilterDropdown';
import SearchSpin from '../UI/SearchSpin';
import { productsAction } from '../../features/products/products';
import useDebounceInput from '../../hooks/useDebounceInput';

const ProductsFilter = () => {
  const [filterMenu, setFilterMenu] = useState({
    categories: [],
    companies: [],
    colors: [],
  });

  // set up filterInput subscription
  const { productsData, filterInput, maxPrice } = useSelector(
    (state) => state.products
  );
  const { searchName, category, company, color, ship, price } = filterInput;
  const dispatch = useDispatch();

  // use debounce for search & price filter input
  const { isChanging, debounceInput } = useDebounceInput();
  // search & price input state
  const [searchInput, setSearchInput] = useState(searchName);
  const [priceInput, setPriceInput] = useState(price);

  useEffect(() => {
    setPriceInput(price);
  }, [filterInput.price]);

  // sticky filter state
  const [stick, setStick] = useState(false);

  useEffect(() => {
    // Filter List UI to show
    setFilterMenu({
      categories: [...new Set(productsData.map((item) => item.category))],
      companies: [...new Set(productsData.map((item) => item.company))],
      colors: [...new Set(productsData.map((item) => item.colors).flat())],
    });
  }, [productsData]);

  // console.log(filterMenu);

  return (
    <div className={`md:sticky md:top-24 w-full pb-4 md:px-0 `}>
      <div className="text-center">
        {/* Search */}
        <div className="flex justify-center">
          <div className="flex items-center w-full max-w-[300px] relative">
            <AiOutlineSearch size={20} className="absolute left-1" />
            <input
              type="text"
              placeholder="Search"
              value={isChanging ? searchInput : searchName}
              className=" w-full bg-gray-200 rounded-full placeholder:text-sm py-1 pl-7 outline-none border hover:border-amber-200 focus:border-amber-400 focus:bg-gray-50"
              onChange={(e) => {
                setSearchInput(e.target.value);
                debounceInput('searchName', e.target.value);
              }}
            />
          </div>
        </div>

        {/* Select options */}
        <div className="grid grid-cols-2 gap-4 items-start pt-4 md:flex md:flex-col md:items-center">
          {/* Category */}
          <FilterDropdown filterName="Category">
            {['all', ...filterMenu.categories].map((item) => {
              return (
                <li
                  key={item}
                  className="flex justify-between items-center cursor-pointer mb-2 py-1 px-2 rounded-full hover:bg-gray-200"
                  onClick={() => {
                    dispatch(
                      productsAction.setFilter({
                        type: 'category',
                        value: item,
                      })
                    );
                  }}
                >
                  {item.split('')[0].toUpperCase() + item.slice(1)}
                  {item === category && (
                    <AiOutlineCheck className="text-blue-500" />
                  )}
                </li>
              );
            })}
          </FilterDropdown>

          {/* Company */}
          <FilterDropdown filterName="Company">
            {['all', ...filterMenu.companies].map((item) => {
              return (
                <li
                  key={item}
                  className="flex justify-between items-center cursor-pointer mb-2 py-1 px-2 rounded-full hover:bg-gray-200"
                  onClick={() => {
                    dispatch(
                      productsAction.setFilter({
                        type: 'company',
                        value: item,
                      })
                    );
                  }}
                >
                  {item.split('')[0].toUpperCase() + item.slice(1)}
                  {item === company && (
                    <AiOutlineCheck className="text-blue-500" />
                  )}
                </li>
              );
            })}
          </FilterDropdown>

          {/* Colors */}
          <FilterDropdown filterName="Color">
            <div className="grid grid-cols-3 gap-2 py-2">
              {['all', ...filterMenu.colors].map((item, index) => {
                return (
                  <li
                    key={item}
                    className={`flex cursor-pointer `}
                    onClick={() => {
                      dispatch(
                        productsAction.setFilter({
                          type: 'color',
                          value: item,
                        })
                      );
                    }}
                  >
                    <div
                      className="flex justify-center items-center w-5 h-5 rounded-[50%]  hover:border-2 hover:border-amber-700"
                      style={{ backgroundColor: item !== 'all' && `${item}` }}
                    >
                      {item === 'all' && 'All'}
                      {item === color && (
                        <AiOutlineCheck className="text-white font-extrabold" />
                      )}
                    </div>
                  </li>
                );
              })}
            </div>
          </FilterDropdown>

          {/* Shipping */}
          <FilterDropdown filterName="Shipping">
            <div className="flex items-center py-2">
              <input
                id="ship"
                type="checkbox"
                checked={ship ? true : false}
                className="h-4 w-4 rounded border-gray-300"
                onChange={() => {
                  dispatch(
                    productsAction.setFilter({
                      type: 'ship',
                    })
                  );
                }}
              />
              <label
                htmlFor="ship"
                className="ml-2 block text-sm text-gray-900"
              >
                Free Ship
              </label>
            </div>
          </FilterDropdown>

          {/* Price */}
          <div className="col-span-2 flex justify-center w-full max-w-[300px] items-center cursor-pointer px-2 py-1 md:flex-col md:items-start">
            <label htmlFor="price-range" className="font-bold">
              Price
            </label>
            <input
              id="price-range"
              type="range"
              value={priceInput}
              min="0"
              max={maxPrice + 10}
              step="10"
              className="w-full h-2 bg-gray-300 rounded-lg cursor-pointer outline-none mx-2 md:mx-0 md:my-2"
              onChange={(e) => {
                setPriceInput(+e.target.value);
                debounceInput('price', +e.target.value);
              }}
            />
            <p className="min-w-[60px] md:text-left">
              {`${priceInput.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0,
              })}`}
            </p>
          </div>
        </div>
        {/* Clear Filter */}
        <div className="w-full max-w-[300px] mx-auto flex justify-center">
          <p
            className="cursor-pointer underline active:text-amber-300"
            onClick={() => {
              dispatch(productsAction.clearFilter());
              setPriceInput(maxPrice);
              setSearchInput('');
            }}
          >
            Clear All Filters
          </p>
        </div>
        {isChanging && <SearchSpin />}
      </div>
    </div>
  );
};
export default ProductsFilter;
