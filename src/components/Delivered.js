import React, { useEffect, useState } from "react";
import Button from "./Helpers/Button";
import { Inventory } from "@mui/icons-material";
import { COLORS, CUSTOMER_STATUS, ORDER_STATUS } from "./Constants/Constants";
import ItemDetails from "./ItemDetails";
import { getOrder } from "../services/Api";
import Loading from "./Loading";
import CurrencyToggle from "./Helpers/CurrencyToggle";
import { convertCurrency, getCurrencySymbol } from "./Helpers/staticFunctions";

export default function Delivered({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deliveries, setDeliveries] = useState([]);
  const [currency, setCurrency] = useState("INR");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const order = await getOrder({
          customer: user._id,
          customerStatus: CUSTOMER_STATUS.DELIVERED,
          orderStatus: ORDER_STATUS.ACTIVE,
        });
        setDeliveries(order.data);
      } catch (error) {
        console.error("Error fetching order:", error);
      }
      setIsLoading(false);
    };

    fetchOrders();
  }, [user]);

  const openDialog = (order) => {
    setSelectedOrder(order);
    setIsOpen(true);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="p-6 bg-orange-50">
      <div className="flex justify-between items-center">
        <h1
          className="text-2xl font-bold text-orange-800 mb-4"
          style={{ fontFamily: "Rajdhani, sans-serif" }}
        >
          Orders Delivered
        </h1>
        {deliveries.length > 0 && (
          <div className="mb-4">
            <CurrencyToggle currency={currency} setCurrency={setCurrency} />
          </div>
        )}
      </div>

      {deliveries.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-orange-500 text-white">
              <tr>
                <th className="p-3 text-left">Order ID</th>
                <th className="p-3 text-left">Zip Code</th>
                <th className="p-3 text-left">Agent Name</th>
                <th className="p-3 text-left">Delivered Date</th>
                <th className="p-3 text-left">Items Cost</th>
                <th className="p-3 text-left">Shipping Cost</th>
                <th className="p-3 text-left">Package Weight</th>
                <th className="p-3 text-left"></th>
              </tr>
            </thead>
            <tbody>
              {deliveries.map((item, index) => (
                <tr
                  key={item._id}
                  className={index % 2 === 0 ? "bg-orange-100" : ""}
                >
                  <td className="p-3">{item._id}</td>
                  <td className="p-3">{item.agent.address.zipCode}</td>
                  <td className="p-3">{`${item.agent.firstName} ${item.agent.lastName}`}</td>
                  <td className="p-3">{item.deliveredDate}</td>
                  <td className="p-3">{`${getCurrencySymbol(
                    currency
                  )} ${convertCurrency(currency, item.itemsCost)}`}</td>
                  <td className="p-3">{`${getCurrencySymbol(
                    currency
                  )} ${convertCurrency(currency, item.shippingCost)}`}</td>
                  <td className="p-3">{item.packageWeight} KG(s)</td>
                  <td className="p-3">
                    <Button
                      icon={Inventory}
                      bgColor={COLORS.ORANGE_500}
                      onClick={() => openDialog(item)}
                      text="Items"
                    />
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
              You don't have any delivered orders.
            </h2>
          </div>
        </div>
      )}
      <ItemDetails
        isOpen={isOpen}
        selectedOrder={selectedOrder}
        setIsOpen={setIsOpen}
        title="In Progress"
      />
    </div>
  );
}
