import React, { useEffect, useState } from "react";
import Button from "./Helpers/Button";
import { Inventory, Payment } from "@mui/icons-material";
import {
  COLORS,
  CUSTOMER_STATUS,
  IN_PROGRESS_STATUS,
  ORDER_STATUS,
} from "./Constants/Constants";
import ItemDetails from "./ItemDetails";
import ProgressIndicator from "./ProgressIndicator";
import { getOrder } from "../services/Api";
import Loading from "./Loading";
import { getInProgressStep } from "./Helpers/staticFunctions";

export default function InProgress({ user }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [orders, setOrders] = useState(null);

  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    const fetchOrder = async () => {
      setIsLoading(true);
      try {
        const order = await getOrder({
          customer: user._id,
          agent: user.selectedAgent._id,
          customerStatus: CUSTOMER_STATUS.IN_PROGRESS,
          orderStatus: ORDER_STATUS.ACTIVE,
        });
        setOrders(order.data);
      } catch (error) {
        console.error("Error fetching order:", error);
      }
      setIsLoading(false);
    };

    fetchOrder();
  }, [user]);

  const openDialog = (items) => {
    setSelectedItems(items);
    setIsOpen(true);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="p-6 bg-orange-50">
      <h1
        className="text-2xl font-bold mb-4 text-orange-800"
        style={{ fontFamily: "Rajdhani, sans-serif" }}
      >
        In Progress
      </h1>
      {orders &&
        orders.map((item) => (
          <div
            key={item._id}
            className="mb-6 p-6 bg-white rounded-lg shadow-md border border-orange-200"
          >
            <div className="flex flex-row items-center justify-between mb-4">
              <h3
                className="text-xl font-bold text-orange-800"
                style={{ fontFamily: "Rajdhani, sans-serif" }}
              >
                Order ID:{" "}
                <span className="text-center text-gray-600 font-semibold">
                  {item._id}
                </span>
              </h3>
              <div className="space-x-4 flex items-center">
                <Button
                  icon={Inventory}
                  bgColor={COLORS.ORANGE_500}
                  onClick={() => openDialog(item.items)}
                  text="Items"
                />
                {[
                  IN_PROGRESS_STATUS.COST_ESTIMATE,
                  IN_PROGRESS_STATUS.SHIPPING_ESTIMATE,
                ].includes(item.inProgressStatus) && (
                  <Button
                    icon={Payment}
                    bgColor={COLORS.GREEN_600}
                    // onClick={handleChangeAgent}
                    text="Pay Now"
                  />
                )}
              </div>
            </div>
            <div className="my-6">
              {getInProgressStep(item.inProgressStatus) === 1 && (
                <p className="text-lg text-gray-700 mb-10 text-center">
                  Waiting for Agent to confirm on your order.
                </p>
              )}
              {getInProgressStep(item.inProgressStatus) === 2 && (
                <div className="text-lg text-gray-700 mb-10 text-center">
                  <p>
                    Your total items cost is{" "}
                    <span className="text-orange-500">${item.itemsCost}</span>
                  </p>
                  <p className="text-gray-500 text-sm mt-5">
                    Pay now to get items
                  </p>
                </div>
              )}
              {getInProgressStep(item.inProgressStatus) === 3 && (
                <p className="text-lg text-gray-700 mb-10 text-center">
                  Agent gathering items, will let you know the shipping cost
                  estimate in short period.
                </p>
              )}
              {getInProgressStep(item.inProgressStatus) === 4 && (
                <div className="text-lg text-gray-700 mb-10 text-center">
                  <p>
                    Your package weight is{" "}
                    <span className="text-orange-500">
                      {item.packageWeight} KG
                    </span>
                  </p>
                  <p>
                    Your shipping cost is{" "}
                    <span className="text-orange-500">
                      ${item.shippingCost}
                    </span>
                  </p>
                  <p className="text-gray-500 text-sm mt-5">
                    Pay now to ship items
                  </p>
                </div>
              )}
              {getInProgressStep(item.inProgressStatus) === 5 && (
                <div className="text-lg text-gray-700 mb-10 text-center">
                  <p>
                    Your package has been shipped, your tracking id is{" "}
                    <span className="bg-orange-500 font-bold text-white px-3 py-1 rounded-full text-sm mr-2 cursor-pointer">
                      {item.trackingId}
                    </span>
                  </p>
                </div>
              )}
              <ProgressIndicator
                activeStep={getInProgressStep(item.inProgressStatus)}
              />
            </div>
          </div>
        ))}
      <ItemDetails
        isOpen={isOpen}
        selectedItems={selectedItems}
        setIsOpen={setIsOpen}
        title="In Progress"
      />
    </div>
  );
}
