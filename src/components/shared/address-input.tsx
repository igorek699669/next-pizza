"use client";

import React from "react";
import { AddressSuggestions } from "react-dadata";
import "react-dadata/dist/react-dadata.css";

interface Props {
  onChange?: (value?: string) => void;
}

export const AdressInput: React.FC<Props> = ({ onChange }) => {
  return (
    <AddressSuggestions
      token="96b321bf500cfaef12ca083fc70d333b0e6c8bc8"
      onChange={(data) => onChange?.(data?.value)}
    />
  );
};
