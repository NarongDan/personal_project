import BannerSlide from "../components/BannerSlide";
import ProductCard from "../components/ProductCard";
import useCommercial from "../../../hooks/useCommercial";
import { useEffect } from "react";

export default function HomePageBody() {
  const { getRandomProducts, fetchProducts } = useCommercial();

  const products = getRandomProducts(8);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    // Tawk.to Script
    var Tawk_API = Tawk_API || {},
      Tawk_LoadStart = new Date();
    (function () {
      var s1 = document.createElement("script"),
        s0 = document.getElementsByTagName("script")[0];
      s1.async = true;
      s1.src = "https://embed.tawk.to/6671b4649a809f19fb3f069e/1i0m2hb43";
      s1.charset = "UTF-8";
      s1.setAttribute("crossorigin", "*");
      s0.parentNode.insertBefore(s1, s0);
    })();
  }, []);
  return (
    <>
      <div className="flex items-center justify-center w-full">
        <BannerSlide className="" />
      </div>
      <div className="h-[100px] w-full flex flex-col justify-center items-center space-y-10 mt-10 px-2 text-center">
        <p className="text-2xl text-gray-500">Welcome to our store!</p>
        <p className="text-xl text-gray-500 ">
          Explore our extensive selection of fragrances available for purchase.
        </p>
      </div>
      <div className="flex justify-center w-full px-12 mt-10">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-[100px]">
          {products.slice(0, 8).map((item) => (
            <ProductCard product={item} key={item.id} />
          ))}
        </div>
      </div>
    </>
  );
}
