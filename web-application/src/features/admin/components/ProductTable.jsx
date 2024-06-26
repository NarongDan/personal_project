import { useEffect, useState } from "react";
import axios from "../../../config/axios";
import Swal from "sweetalert2";
import Spinner from "../../../components/Spinner";
import { toast } from "react-toastify";

const initialInput = {
  productName: "",
  productCost: "",
  productPrice: "",
  productImage: "",
  productDetail: "",
};

export default function ProductTable() {
  const [product, setProduct] = useState({}); // product แต่ละตัวเมื่อกด Edit
  const [products, setProducts] = useState([]); // products ทั้งหมดที่ fetch มา
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState(initialInput);
  const [currentPage, setCurrentPage] = useState(1); // เพิ่มสถานะสำหรับหน้า
  const itemsPerPage = 20; // จำนวนรายการต่อหน้า
  const [descriptionModal, setDescriptionModal] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.keyCode === 27) {
        closeModal();
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setProduct({});
    setInput(initialInput);
    setIsOpen(false);
    setDescriptionModal(false);
  };
  const handleChange = (e) => {
    e.preventDefault();
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const uploadData = new FormData();
    uploadData.append("productName", input.productName);
    uploadData.append("productCost", input.productCost);
    uploadData.append("productPrice", input.productPrice);
    uploadData.append("productImage", input.productImage);
    uploadData.append("productDetail", input.productDetail);
    try {
      setLoading(true);
      if (product.id === undefined) {
        await axios.post("/products", uploadData);
        toast.success("Product uploaded successfully");
      } else {
        await axios.patch(`/products/${product.id}`, uploadData);
        toast.success("Product updated successfully");
      }

      setProduct({}); // clear id
      setInput(initialInput);
      fetchData();
    } catch (error) {
      console.log(error);
      toast.error("Please insert all fields of product");
    } finally {
      setLoading(false);
      setIsOpen(false);
    }
  };

  const fetchData = async () => {
    try {
      const res = await axios.get("/products");
      if (res.data !== undefined) {
        setProducts(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemove = async (id) => {
    try {
      const button = await Swal.fire({
        text: "Remove item",
        title: "Remove",
        icon: "question",
        showCancelButton: true,
        showConfirmButton: true,
      });

      if (button.isConfirmed) {
        setLoading(true);
        const res = await axios.delete(`/products/${id}`);

        if (res.data.message === "product deleted") {
          Swal.fire({
            title: "Remove",
            text: "Remove success",
            icon: "success",
            timer: 1000,
          });

          fetchData();
        }
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // คำนวณรายการที่จะแสดงในหน้าปัจจุบัน
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

  // จำนวนหน้าทั้งหมด
  const totalPages = Math.ceil(products.length / itemsPerPage);

  return (
    <>
      <button className="btn btn-active text-white" onClick={openModal}>
        <i className="fa fa-plus"></i> Add Product
      </button>
      {loading && <Spinner transparent className="z-50" />}
      {isOpen && (
        <div className="modal modal-open z-40">
          <div className="modal-box">
            <h2 className="font-bold text-xl text-center">Add product</h2>
            <form
              className="p-4 flex flex-col space-y-5"
              onSubmit={handleUpdate}
            >
              <p>Product Name</p>
              <input
                type="text"
                className="px-4 py-3 text-md rounded-lg focus:outline-none"
                name="productName"
                value={input.productName}
                onChange={handleChange}
              />
              <p>Product Cost</p>
              <input
                type="text"
                className="px-4 py-3 text-md rounded-lg focus:outline-none"
                name="productCost"
                value={input.productCost}
                onChange={handleChange}
              />
              <p>Product Price</p>
              <input
                type="text"
                className="px-4 py-3 text-md rounded-lg focus:outline-none"
                name="productPrice"
                value={input.productPrice}
                onChange={handleChange}
              />
              <p>Product Image</p>
              <input
                type="file"
                onChange={(e) =>
                  setInput((prev) => ({
                    ...prev,
                    productImage: e.target.files[0],
                  }))
                }
              />
              <p>Product Detail</p>
              <textarea
                className="p-4 resize-none rounded-lg"
                rows="4"
                placeholder="Write description here..."
                name="productDetail"
                value={input.productDetail}
                onChange={handleChange}
              ></textarea>
              <button className="btn btn-active">Upload</button>
            </form>
            <div className="modal-action">
              <button className="btn" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {descriptionModal && (
        <div className="modal modal-open z-40">
          <div className="modal-box">
            <h2 className="font-bold text-xl text-center">Description</h2>
            <p>{selectedDescription}</p>
            <div className="modal-action">
              <button className="btn" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                Photo
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                Cost
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentProducts.length > 0 ? (
              currentProducts.map((item, index) => (
                <tr
                  key={item.id}
                  className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                >
                  <td className="px-2 py-3 whitespace-nowrap">
                    <img
                      src={item.productImage}
                      alt="Product"
                      className="w-full h-24 rounded-lg"
                    />
                  </td>
                  <td className="px-6 py-4 text-center">{item.productName}</td>
                  <td className="px-6 py-4 text-center max-w-xs truncate">
                    <button
                      onClick={() => {
                        setSelectedDescription(item.productDetail);
                        setDescriptionModal(true);
                      }}
                    >
                      {item.productDetail}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    {item.productCost}
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    {item.productPrice}
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <button
                      className="btn btn-primary mr-2"
                      onClick={() => {
                        setProduct(item); // กำหนดข้อมูลของสินค้าที่เลือกเพื่อให้แสดงใน modal
                        setInput({
                          // กำหนดค่า input ของ modal เป็นข้อมูลของสินค้าที่เลือก
                          productName: item.productName,
                          productCost: item.productCost,
                          productPrice: item.productPrice,
                          productImage: item.productImage,
                          productDetail: item.productDetail,
                        });
                        setIsOpen(true); // เปิด modal
                      }}
                    >
                      <i className="fa fa-edit"></i>
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleRemove(item.id)}
                    >
                      <i className="fa fa-times"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No products available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center space-x-2 mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {[...Array(totalPages).keys()].map((number) => (
          <button
            key={number}
            onClick={() => setCurrentPage(number + 1)}
            className={`px-4 py-2 rounded ${
              currentPage === number + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          >
            {number + 1}
          </button>
        ))}
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </>
  );
}
