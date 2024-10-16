import React, { useEffect, useState } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import { Add, AddShoppingCart, Clear, Edit } from "@mui/icons-material";
import Button from "./Helpers/Button";
import {
  AGENT_STATUS,
  ALERTS,
  COLORS,
  CUSTOMER_STATUS,
  IN_PROGRESS_STATUS,
  ORDER_STATUS,
  UNITS,
} from "./Constants/Constants";
import { createOrder, getOrder, updateOrder } from "../services/Api";
import Loading from "./Loading";
import { formatQuantityUnit } from "./Helpers/staticFunctions";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "./Helpers/SnackbarContext";

export default function Draft({ user }) {
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();

  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    quantity: "",
    unit: "Piece(s)",
    storeName: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [quantityUnitFocused, setQuantityUnitFocused] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      setIsLoading(true);
      try {
        const order = await getOrder({
          customer: user._id,
          agent: user.selectedAgent._id,
          customerStatus: CUSTOMER_STATUS.DRAFT,
          orderStatus: ORDER_STATUS.ACTIVE,
        });

        if (order.data.length === 1) {
          setOrder(order.data[0]);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      }
      setIsLoading(false);
    };

    fetchOrder();
  }, [user]);

  const updateItemsInOrder = async (items, id) => {
    setIsLoading(true);
    const updatedOrder = await updateOrder(
      { items },
      {
        _id: id,
      }
    );

    setOrder(updatedOrder.data);
    setIsLoading(false);
  };

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

  const addItem = async () => {
    const newErrors = validateItem(newItem);
    setErrors(newErrors);
    setTouched({ name: true, quantity: true });

    if (Object.keys(newErrors).length === 0) {
      if (editingId !== null) {
        await updateItemsInOrder(
          order.items.map((item) =>
            item._id === editingId ? { ...newItem, _id: editingId } : item
          ),
          order._id
        );
        setEditingId(null);
      } else {
        await updateItemsInOrder([...order.items, { ...newItem }], order._id);
      }
      setNewItem({
        name: "",
        description: "",
        quantity: "",
        unit: "Piece(s)",
        storeName: "",
      });
      setTouched({});
    }
  };

  const editItem = (id) => {
    const itemToEdit = order.items.find((item) => item._id === id);
    setNewItem({ ...itemToEdit });
    setEditingId(id);
    setErrors({});
    setTouched({});
  };

  const deleteItem = async (id) => {
    await updateItemsInOrder(
      order.items.filter((item) => item._id !== id),
      order._id
    );
  };

  const clearTable = async () => {
    await updateItemsInOrder([], order._id);
    setNewItem({
      name: "",
      description: "",
      quantity: "",
      unit: "Piece(s)",
      storeName: "",
    });
    setErrors({});
    setTouched({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({
      ...prev,
      [name]: name === "quantity" ? parseInt(value) || "" : value,
    }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => {
      const newErrors = validateItem({ ...newItem, [name]: value });
      return { ...prev, [name]: newErrors[name] };
    });
  };

  const handleFocus = () => {
    setQuantityUnitFocused(true);
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => {
      const newErrors = validateItem(newItem);
      return { ...prev, [name]: newErrors[name] };
    });
    setQuantityUnitFocused(false);
  };

  const handlePlaceOrder = async () => {
    if (order.items.length > 0) {
      setIsLoading(true);

      await updateOrder(
        {
          customerStatus: CUSTOMER_STATUS.IN_PROGRESS,
          inProgressStatus: IN_PROGRESS_STATUS.ORDER_PLACED,
        },
        {
          _id: order._id,
        }
      );

      setIsLoading(false);
      navigate("/in-progress");
    } else {
      showSnackbar("Can't place order, your draft is empty.", ALERTS.ERROR);
    }
  };

  const startNewOrder = async () => {
    setIsLoading(true);

    const createdOrder = await createOrder({
      customer: user._id,
      agent: user.selectedAgent._id,
      agentStatus: AGENT_STATUS.ORDERED,
      customerStatus: CUSTOMER_STATUS.DRAFT,
      orderStatus: ORDER_STATUS.ACTIVE,
    });

    setOrder(createdOrder.data);
    setIsLoading(false);
  };

  if (isLoading) {
    return <Loading />;
  }

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
          {order && (
            <Button
              icon={AddShoppingCart}
              bgColor={COLORS.GREEN_600}
              onClick={handlePlaceOrder}
              text="Place Order"
            />
          )}
          {order && (
            <Button
              icon={Clear}
              bgColor={COLORS.RED_100}
              onClick={clearTable}
              text="Clear All"
            />
          )}
        </div>
      </div>

      {order ? (
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
              {order &&
                order.items.map((item, index) => (
                  <tr
                    key={item._id}
                    className={index % 2 === 0 ? "bg-orange-100" : ""}
                  >
                    <td className="p-3">{item.name || `-`}</td>
                    <td className="p-3">{item.description || `-`}</td>
                    <td className="p-3">{`${
                      formatQuantityUnit(item.quantity, item.unit) || `-`
                    }`}</td>
                    <td className="p-3">{item.storeName || `-`}</td>
                    <td className="p-3">
                      <div className="flex">
                        <Button
                          icon={EditIcon}
                          bgColor={COLORS.ORANGE_500}
                          buttonStyles="w-4 h-4"
                          customStyles="mr-2"
                          onClick={() => editItem(item._id)}
                        />
                        <Button
                          icon={DeleteOutlineIcon}
                          bgColor={COLORS.RED_500}
                          buttonStyles="w-4 h-4"
                          onClick={() => deleteItem(item._id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mb-6 p-6 bg-white rounded-lg shadow-md border border-orange-200">
          <div className="flex flex-col justify-center items-center">
            <h2 className="text-xl mb-4">
              You don't have any drafts with
              <span className="text-orange-800">
                {" "}
                {user.selectedAgent.firstName}
              </span>
              .
            </h2>
            <Button
              bgColor={COLORS.GREEN_600}
              onClick={startNewOrder}
              text="Start New Order"
            />
          </div>
        </div>
      )}

      {order && (
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
            <div
              className={`flex ${
                quantityUnitFocused ? "ring-2 ring-orange-300" : ""
              } rounded-md`}
            >
              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                className={`w-2/3 p-2 pr-8 border-t border-b border-l ${
                  touched.quantity && errors.quantity
                    ? "border-red-500"
                    : "border-orange-200"
                } rounded-l focus:outline-none`}
                value={newItem.quantity}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              <select
                name="unit"
                className={`w-1/3 p-2 border-t border-b border-r ${
                  touched.quantity && errors.quantity
                    ? "border-red-500"
                    : "border-orange-200"
                } rounded-r focus:outline-none`}
                value={newItem.unit}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
              >
                {UNITS.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
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
      )}
    </div>
  );
}
