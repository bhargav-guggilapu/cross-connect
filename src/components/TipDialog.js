import { Close, Payment } from "@mui/icons-material";
import {
  Avatar,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import React, { useState } from "react";
import { ALERTS, COLORS } from "./Constants/Constants";
import Button from "./Helpers/Button";
import { useSnackbar } from "./Helpers/SnackbarContext";

function TipDialog({ isTipOpen, setIsTipOpen, selectedOrder, onTipConfirm }) {
  const showSnackBar = useSnackbar();
  const [tipAmount, setTipAmount] = useState(0);

  const handleTipChange = (tip) => {
    setTipAmount(tip);
  };

  const handleClose = () => {
    setIsTipOpen(false);
  };

  const handleAddTip = () => {
    if (tipAmount < 0) {
      showSnackBar("Tip should not be less than 0", ALERTS.ERROR);
      return;
    }

    onTipConfirm(selectedOrder._id, tipAmount)

    setIsTipOpen(false);
  };

  return (
    <Dialog
      open={isTipOpen}
      onClose={handleClose}
      aria-labelledby="tip-model"
      PaperProps={{
        style: {
          backgroundColor: "#fff8e1",
          borderRadius: "1rem",
          boxShadow: "0 8px 12px rgba(0, 0, 0, 0.2)",
          maxWidth: "800px",
          width: "90%",
        },
      }}
    >
      <DialogTitle id={"tip-model_id"}>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          style={{ position: "absolute", right: 16, top: 10 }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <div className="mt-6 mb-6 mr-3 ml-3 flex justify-between">
          <div className="flex flex-col items-center justify-between basis-1/4">
            <Avatar
              sx={{ height: "150px", width: "150px" }}
              src={selectedOrder?.agent?.photo}
              alt={selectedOrder?.agent?.name}
              className="rounded-full border-2 border-orange-300 mb-4"
            />
            <span className="text-lg text-gray-700 font-poppins font-bold">
              {`${selectedOrder?.agent?.firstName} ${selectedOrder?.agent?.lastName}`}
            </span>
          </div>
          <div className="flex flex-col items-center justify-between basis-3/4">
            <span
              className="text-2xl font-bold text-orange-800"
              style={{ fontFamily: "Rajdhani, sans-serif" }}
            >
              Want to add tip to agent?
            </span>
            <div className="flex justify-center">
              <div className="relative max-w-40 mr-4">
                <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                  ₹
                </span>
                <input
                  type="number"
                  name="cost"
                  placeholder="Tip Amount"
                  className={`w-full pl-6 pr-2 py-2 border border-orange-200 rounded focus:outline-none focus:ring-2 focus:ring-orange-300`}
                  value={tipAmount}
                  onChange={(e) => handleTipChange(e.target.value)}
                />
              </div>
              <Button
                bgColor={COLORS.GREEN_600}
                onClick={handleAddTip}
                icon={Payment}
                text={"Add Tip"}
              />
            </div>

            <div className="mb-1">
              <span
                className="bg-gray-500 font-bold text-white px-3 py-1 rounded-full text-sm mr-5 cursor-pointer"
                onClick={() => setTipAmount(selectedOrder.itemsCost * 0.1)}
              >
                10%
              </span>
              <span
                className="bg-gray-500 font-bold text-white px-3 py-1 rounded-full text-sm mr-5 cursor-pointer"
                onClick={() => setTipAmount(selectedOrder.itemsCost * 0.2)}
              >
                20%
              </span>
              <span
                className="bg-gray-500 font-bold text-white px-3 py-1 rounded-full text-sm mr-5 cursor-pointer"
                onClick={() => setTipAmount(selectedOrder.itemsCost * 0.5)}
              >
                50%
              </span>
              <span
                className="bg-gray-500 font-bold text-white px-3 py-1 rounded-full text-sm cursor-pointer"
                onClick={() => setTipAmount(selectedOrder.itemsCost)}
              >
                100%
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default TipDialog;
