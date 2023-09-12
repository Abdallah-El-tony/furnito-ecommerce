import axios from 'axios'
import React, { useEffect, useState } from 'react'
import TrendySignleProduct from '../TrendySingleProduct'
import Loader from '../loaders/Loader'
import VirticalSingleProduct from './VirticalSingleProduct'
import './shop.css'
import ShopHeader from './ShopHeader'
import { useSelector } from 'react-redux'

const ShopProducts = ({filterData , resetData , getSortValue , isSort}) => {
    const {loading} = useSelector(state=>state.LoaderReducer)
    const [products,setProducts] = useState([])
    const [isloading,setIsLoading] = useState(loading)
    const [direction,setDirection] = useState('horizontal')

    const setIsVirtical = (direction)=>{
        setDirection(direction)
    }
    const getSort = (value)=>{
        getSortValue(value)
    }
    let isPrice = false;
    isPrice = (/\d+/.test(filterData));
    useEffect(()=>{
        setIsLoading(true)
        let result;
        const getProductds = async()=>{
            try {
                if(filterData === '' || filterData === undefined) {
                    result = await axios.get(`http://localhost:3000/Store?catigory=All`)
                }else if(isPrice) {
                    result = await axios.get(`http://localhost:3000/Store?price_gte=${0}&price_lte=${parseFloat(filterData)}`)
                }else if(isSort) {
                    result = await axios.get(`http://localhost:3000/Store?_sort=${filterData}&_order=asc`)
                }
                else
                 result = await axios.get(`http://localhost:3000/Store?q=${filterData}`)
                    setProducts(result.data)
                    setIsLoading(false)
                }catch(Err) {console.log(Err)}
        }
        getProductds()
    },[filterData, products.length, isPrice, isSort])
  return (
   <>
   {isloading && <Loader/>}
    <div className="product-container">
        <div className="row ms-md-0 ms-md-5 justify-content-center">
            <ShopHeader setIsVirtical={setIsVirtical} filterSelected = {filterData} currentDataLenght ={products.length} resetData={resetData} getSort={getSort} isBlog={false}/>

           {products.length === 0?
           <div className='d-flex align-items-center justify-content-center mt-5 pt-5'><p className='text-warning mt-5 fw-normal fs-4'>No Product Found</p></div>
           :
           <div className="row p-0 justify-content-center justify-content-md-start mx-2 mx-sm-0">
                {direction==='virtical'?(products.map(product=>(
                    <VirticalSingleProduct
                        key={product.id}
                        id={product.id}
                        img={product.img}
                        price={product.price}
                        altPrice={product.altPrice}
                        sales={product.sales}
                        isSlider={true}
                        title={product.name}
                        customStyle={false}
                        hasBtn={true}
                        object={product}
                    />
                )))
                :
                (products.map(product=>(
                    <div key={product.id} className="col-12 col-sm-6 col-md-12 col-lg-6 col-xl-4">
                        <TrendySignleProduct 
                        id={product.id}
                        img={product.img}
                        price={product.price}
                        altPrice={product.altPrice}
                        sales={product.sales}
                        isSlider={true}
                        title={product.name}
                        customStyle={true}
                        object={product}
                        />
                    </div>
                )))}
           </div>}
       </div>
    </div>
   </>
  )
}

export default ShopProducts