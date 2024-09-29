import React, { useState } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import { Add, AddShoppingCart, Clear, Edit } from "@mui/icons-material";
import Button from "./Helpers/Button";
import { COLORS } from "./Constants/Constants";

export default function Draft() {
  const [draftItems, setDraftItems] = useState([
    {
      id: 1,
      name: "T-shirt",
      description: "Cotton, size L, white",
      quantity: 3,
      storeName: "H&M",
    },
    {
      id: 2,
      name: "Jeans",
      description: "Denim, size 32, slim fit",
      quantity: 1,
      storeName: "Levi's",
    },
  ]);
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
        <h1
          className="text-2xl font-bold text-orange-800"
          style={{ fontFamily: "Rajdhani, sans-serif" }}
        >
          Your Draft
        </h1>
        <div className="flex space-x-4">
          <Button
            icon={AddShoppingCart}
            bgColor={COLORS.GREEN_600}
            // onClick={handleChangeAgent}
            text="Place Order"
          />
          <Button
            icon={Clear}
            bgColor={COLORS.RED_100}
            onClick={clearTable}
            text="Clear All"
          />
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
                className={index % 2 === 0 ? "bg-orange-100" : ""}
              >
                <td className="p-3">{item.name}</td>
                <td className="p-3">{item.description}</td>
                <td className="p-3">{item.quantity}</td>
                <td className="p-3">{item.storeName}</td>
                <td className="p-3">
                  <div className="flex">
                    <Button
                      icon={EditIcon}
                      bgColor={COLORS.ORANGE_500}
                      buttonStyles="w-4 h-4"
                      customStyles="mr-2"
                      onClick={() => editItem(item.id)}
                    />
                    <Button
                      icon={DeleteOutlineIcon}
                      bgColor={COLORS.RED_500}
                      buttonStyles="w-4 h-4"
                      onClick={() => deleteItem(item.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 grid grid-cols-5 gap-4">
        <div className="flex flex-col h-[74px]">
          <input
            type="text"
            name="name"
            placeholder="Name"
            className={`w-full p-2 pr-8 border ${
              touched.name && errors.name
                ? "border-red-500"
                : "border-orange-200"
            } rounded focus:outline-none focus:ring-2 focus:ring-orange-300`}
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
            className="w-full p-2 pr-8 border border-orange-200 rounded focus:outline-none focus:ring-2 focus:ring-orange-300 resize-y"
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
            } rounded focus:outline-none focus:ring-2 focus:ring-orange-300`}
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
            className="w-full p-2 pr-8 border border-orange-200 rounded focus:outline-none focus:ring-2 focus:ring-orange-300"
            value={newItem.storeName}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex flex-row h-[74px] justify-center">
          <Button
            icon={editingId == null ? Add : Edit}
            bgColor={COLORS.ORANGE_500}
            onClick={addItem}
            customStyles="max-w-fit h-[42px]"
            text={editingId == null ? "Add Item" : "Update Item"}
          />
        </div>
      </div>
    </div>
  );
}
