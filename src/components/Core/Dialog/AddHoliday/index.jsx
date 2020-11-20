import React from "react";
import Dialog from '../index';

export default function AddHolidays({ handleClose, title, open }) {
  return (
    <Dialog handleClose={handleClose} open={open} title={title}>
      AddHolidays
    </Dialog>
  )
}