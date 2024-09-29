import React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

const steps = [
  "Order Placed",
  "Agent Confirmation",
  "Cost Estimate",
  "Items Gathering",
  "Shipping Estimate",
  "Shipped",
];

const ProgressIndicator = ({ activeStep }) => {
  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      <Stepper activeStep={activeStep - 1} alternativeLabel>
        {steps.map((label, index) => {
          const stepProps = {
            sx: {
              "& .MuiStepLabel-root .Mui-completed": {
                color: "rgb(249 115 22)",
              },
              "& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel":
                {
                  color: "rgb(234 88 12)",
                  fontWeight: 700,
                },
              "& .MuiStepLabel-root .Mui-active": {
                color: "rgb(249 115 22)",
              },
              "& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel":
                {
                  color: "rgb(249 115 22)",
                },
              "& .MuiStepLabel-root .Mui-active .MuiStepIcon-text": {
                fill: "white",
              },
            },
          };
          const labelProps = {};

          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
};

export default ProgressIndicator;
