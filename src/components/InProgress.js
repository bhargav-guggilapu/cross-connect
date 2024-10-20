import React, { useEffect, useState } from "react";
import Button from "./Helpers/Button";
import { DeliveryDining, Inventory, Payment } from "@mui/icons-material";
import {
  AGENT_STATUS,
  COLORS,
  CUSTOMER_STATUS,
  IN_PROGRESS_STATUS,
  ORDER_STATUS,
} from "./Constants/Constants";
import ItemDetails from "./ItemDetails";
import ProgressIndicator from "./ProgressIndicator";
import { getOrder, updateOrder } from "../services/Api";
import Loading from "./Loading";
import {
  convertCurrency,
  getCurrencySymbol,
  getCurrentDate,
  getInProgressStep,
} from "./Helpers/staticFunctions";
import { useNavigate } from "react-router-dom";
import CurrencyToggle from "./Helpers/CurrencyToggle";
import TipDialog from "./TipDialog";

export default function InProgress({ user }) {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isTipOpen, setIsTipOpen] = useState(false);
  const [orders, setOrders] = useState(null);
  const [currency, setCurrency] = useState("INR");

  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const order = await getOrder({
          customer: user._id,
          customerStatus: CUSTOMER_STATUS.IN_PROGRESS,
          orderStatus: ORDER_STATUS.ACTIVE,
        });
        setOrders(order.data);
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

  const startPlacingOrder = () => {
    navigate(`/draft`);
  };

  const fetchOrders = async () => {
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

  const onPaymentHandle = async (item) => {
    setIsLoading(true);

    await updateOrder(
      {
        agentStatus:
          item.inProgressStatus === IN_PROGRESS_STATUS.COST_ESTIMATE
            ? AGENT_STATUS.CONFIRMED
            : AGENT_STATUS.SHIPPED,
        inProgressStatus:
          item.inProgressStatus === IN_PROGRESS_STATUS.COST_ESTIMATE
            ? IN_PROGRESS_STATUS.ITEMS_GATHERING
            : IN_PROGRESS_STATUS.ORDER_SHIPPED,
      },
      { _id: item._id }
    );
    await fetchOrders();

    setIsLoading(false);
  };

  const onTipConfirm = async (id, tipAmount) => {
    setIsLoading(true);

    await updateOrder(
      {
        tipAmount,
        agentStatus: AGENT_STATUS.COMPLETED,
        inProgressStatus: "",
        customerStatus: CUSTOMER_STATUS.DELIVERED,
        deliveredDate: getCurrentDate(),
      },
      { _id: id }
    );

    setIsLoading(false);
    navigate("/delivered");
  };

  const onDeliveryConfirm = async (item) => {
    setSelectedOrder(item);
    setIsTipOpen(true);
  };

  const onTrackingHandle = (trackingId) => {
    window.open(`https://www.fedex.com/fedextrack?trknbr=${trackingId}`);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="p-6 bg-orange-50">
      <div className="flex justify-between items-center">
        <h1
          className="text-2xl font-bold mb-4 text-orange-800"
          style={{ fontFamily: "Rajdhani, sans-serif" }}
        >
          In Progress
        </h1>
        {orders?.length > 0 && (
          <div className="mb-4">
            <CurrencyToggle currency={currency} setCurrency={setCurrency} />
          </div>
        )}
      </div>

      {orders?.length > 0 ? (
        orders.map((item) => (
          <div
            key={item._id}
            className="mb-6 p-6 bg-white rounded-lg shadow-md border border-orange-200"
          >
            <div className="flex flex-row items-center justify-between mb-4">
              <div className="flex space-x-4">
                <p>
                  Order Id:{" "}
                  <span className="bg-orange-500 font-bold text-white px-3 py-1 rounded-full text-sm mr-5">
                    {item._id}
                  </span>
                </p>
                <p>
                  Zip Code:{" "}
                  <span className="bg-orange-500 font-bold text-white px-3 py-1 rounded-full text-sm">
                    {item.agent.address.zipCode}
                  </span>
                </p>
              </div>

              <div className="space-x-4 flex items-center">
                <Button
                  icon={Inventory}
                  bgColor={COLORS.ORANGE_500}
                  onClick={() => openDialog(item)}
                  text="Items"
                />
                {[
                  IN_PROGRESS_STATUS.COST_ESTIMATE,
                  IN_PROGRESS_STATUS.SHIPPING_ESTIMATE,
                ].includes(item.inProgressStatus) && (
                  <>
                    <Button
                      icon={Payment}
                      bgColor={COLORS.GREEN_600}
                      onClick={() => onPaymentHandle(item)}
                      text="Pay Now"
                    />
                  </>
                )}
                {[IN_PROGRESS_STATUS.SHIPPED].includes(
                  item.inProgressStatus
                ) && (
                  <Button
                    icon={DeliveryDining}
                    bgColor={COLORS.GREEN_600}
                    onClick={() => onDeliveryConfirm(item)}
                    text="Confirm Delivery"
                  />
                )}
              </div>
            </div>
            <div className="my-6">
              {getInProgressStep(item.inProgressStatus) === 1 && (
                <p className="text-lg text-gray-700 mb-10 text-center">
                  Waiting for agent{" "}
                  {`${item.agent.firstName} ${item.agent.lastName}`} to confirm
                  on your order.
                </p>
              )}
              {getInProgressStep(item.inProgressStatus) === 2 && (
                <div className="text-lg text-gray-700 mb-10 text-center">
                  <p>
                    Your total items cost is{" "}
                    <span className="text-orange-500">
                      {`${getCurrencySymbol(currency)} ${convertCurrency(
                        currency,
                        item.itemsCost
                      )}`}
                    </span>
                  </p>
                  <p className="text-gray-500 text-sm mt-5">
                    Pay now to get items
                  </p>
                </div>
              )}
              {getInProgressStep(item.inProgressStatus) === 3 && (
                <p className="text-lg text-gray-700 mb-10 text-center">
                  Agent {`${item.agent.firstName} ${item.agent.lastName}`}{" "}
                  gathering items, will let you know the shipping cost estimate
                  in short period.
                </p>
              )}
              {getInProgressStep(item.inProgressStatus) === 4 && (
                <div className="text-lg text-gray-700 mb-10 text-center">
                  <p>
                    Your package weight is{" "}
                    <span className="text-orange-500">
                      {item.packageWeight} KG(s)
                    </span>
                  </p>
                  <p>
                    Your shipping cost is{" "}
                    <span className="text-orange-500">
                      {`${getCurrencySymbol(currency)} ${convertCurrency(
                        currency,
                        item.shippingCost
                      )}`}
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
                    We are shipping your package, will let you know the tracking
                    id in short period.
                  </p>
                </div>
              )}
              {getInProgressStep(item.inProgressStatus) === 6 && (
                <div className="text-lg text-gray-700 mb-10 text-center">
                  <p>
                    Your package has been shipped, your tracking id is{" "}
                    <span
                      className="bg-orange-500 font-bold text-white px-3 py-1 rounded-full text-sm mr-2 cursor-pointer"
                      onClick={() => onTrackingHandle(item.trackingId)}
                    >
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
        ))
      ) : (
        <div className="mb-6 p-6 bg-white rounded-lg shadow-md border border-orange-200">
          <div className="flex flex-col justify-center items-center">
            <h2 className="text-xl mb-4">
              You don't have any in progress orders.
            </h2>
            <Button
              bgColor={COLORS.GREEN_600}
              onClick={startPlacingOrder}
              text="Start Placing Order"
            />
          </div>
        </div>
      )}
      <ItemDetails
        isOpen={isOpen}
        selectedOrder={selectedOrder}
        setIsOpen={setIsOpen}
        title="In Progress"
      />
      <TipDialog
        isTipOpen={isTipOpen}
        setIsTipOpen={setIsTipOpen}
        selectedOrder={selectedOrder}
        onTipConfirm={onTipConfirm}
      />
    </div>
  );
}
