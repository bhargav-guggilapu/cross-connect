import React, { useState } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";

export default function Draft() {
  const [draftItems, setDraftItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    quantity: 0,
    storeName: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateItem = (item) => {
    let newErrors = {};
    if (!item.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (item.quantity <= 0) {
      newErrors.quantity = "Quantity must be greater than 0";
    }
    return newErrors;
  };

  const addItem = () => {
    const newErrors = validateItem(newItem);
    setErrors(newErrors);
    setTouched({ name: true, quantity: true });

    if (Object.keys(newErrors).length === 0) {
      if (editingId !== null) {
        setDraftItems(
          draftItems.map((item) =>
            item.id === editingId ? { ...newItem, id: editingId } : item
          )
        );
        setEditingId(null);
      } else {
        setDraftItems([...draftItems, { ...newItem, id: Date.now() }]);
      }
      setNewItem({ name: "", description: "", quantity: 0, storeName: "" });
      setTouched({});
    }
  };

  const editItem = (id) => {
    const itemToEdit = draftItems.find((item) => item.id === id);
    setNewItem({ ...itemToEdit });
    setEditingId(id);
    setErrors({});
    setTouched({});
  };

  const deleteItem = (id) => {
    setDraftItems(draftItems.filter((item) => item.id !== id));
  };

  const clearTable = () => {
    setDraftItems([]);
    setNewItem({ name: "", description: "", quantity: 0, storeName: "" });
    setErrors({});
    setTouched({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({
      ...prev,
      [name]: name === "quantity" ? parseInt(value) || 0 : value,
    }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => {
      const newErrors = validateItem({ ...newItem, [name]: value });
      return { ...prev, [name]: newErrors[name] };
    });
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => {
      const newErrors = validateItem(newItem);
      return { ...prev, [name]: newErrors[name] };
    });
  };

  return (
    <div className="p-6 bg-orange-50">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-orange-800 font-rajdhani">
          Your Draft
        </h1>
        <div className="flex space-x-4">
          <button className="px-6 py-2 bg-green-500 text-white rounded-md font-semibold">
            Place Order
          </button>
          <button
            className="px-6 py-2 bg-red-100 text-red-800 rounded-md font-semibold flex items-center"
            onClick={clearTable}
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-orange-500 text-white">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-left">Quantity</th>
              <th className="p-3 text-left">Store Name</th>
              <th className="p-3 text-left"></th>
            </tr>
          </thead>
          <tbody>
            {draftItems.map((item, index) => (
              <tr
                key={item.id}
                className={index % 2 === 0 ? "bg-orange-50" : ""}
              >
                <td className="p-3">{item.name}</td>
                <td className="p-3">{item.description}</td>
                <td className="p-3">{item.quantity}</td>
                <td className="p-3">{item.storeName}</td>
                <td className="p-3">
                  <button
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300 mr-2"
                    onClick={() => editItem(item.id)}
                  >
                    <EditIcon className="w-4 h-4" />
                  </button>
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
                    onClick={() => deleteItem(item.id)}
                  >
                    <DeleteOutlineIcon className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 grid grid-cols-5 gap-4">
        <div className="flex flex-col h-[74px]">
          <input
            type="text"
            name="name"
            placeholder="Name"
            className={`w-full p-2 pr-8 border ${
              touched.name && errors.name
                ? "border-red-500"
                : "border-orange-200"
            } rounded focus:outline-none focus:ring-2 focus:ring-orange-300 bg-gray-100`}
            value={newItem.name}
            onChange={handleInputChange}
            onBlur={handleBlur}
          />
          {touched.name && errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>
        <div className="flex flex-col h-[74px]">
          <textarea
            name="description"
            placeholder="Description"
            className="w-full p-2 pr-8 border border-orange-200 rounded focus:outline-none focus:ring-2 focus:ring-orange-300 bg-gray-100 resize-y"
            value={newItem.description}
            onChange={handleInputChange}
            rows={1}
          />
        </div>
        <div className="flex flex-col h-[74px]">
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            className={`w-full p-2 pr-8 border ${
              touched.quantity && errors.quantity
                ? "border-red-500"
                : "border-orange-200"
            } rounded focus:outline-none focus:ring-2 focus:ring-orange-300 bg-gray-100`}
            value={newItem.quantity}
            onChange={handleInputChange}
            onBlur={handleBlur}
          />
          {touched.quantity && errors.quantity && (
            <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>
          )}
        </div>
        <div className="flex flex-col h-[74px]">
          <input
            type="text"
            name="storeName"
            placeholder="Store Name"
            className="w-full p-2 pr-8 border border-orange-200 rounded focus:outline-none focus:ring-2 focus:ring-orange-300 bg-gray-100"
            value={newItem.storeName}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex flex-col h-[74px]">
          <button
            className="w-full h-[42px] px-4 bg-blue-500 text-white hover:bg-blue-600 rounded-md transition duration-300"
            onClick={addItem}
          >
            {editingId !== null ? "Update Item" : "Add Item"}
          </button>
        </div>
      </div>
    </div>
  );
}
