import React, { ReactElement } from "react";
import PanelLayout from "./PanelLayout";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {
  Device,
  ByteValue,
  WordValue,
  Register,
  toByteHexString,
  toWordHexString,
  isWordRegister
} from "@gebby/core";

interface RegisterCellProps {
  readonly name: Register;
  readonly value: ByteValue | WordValue;
}

const RegisterCell = ({
  name,
  value
}: RegisterCellProps): ReactElement<RegisterCellProps> => (
  <Grid className="register-cell" item xs={isWordRegister(name) ? 12 : 6}>
    <Paper>
      {name}:{" "}
      {isWordRegister(name) ? toWordHexString(value) : toByteHexString(value)}
    </Paper>
  </Grid>
);

interface CpuRegistersPanelProps {
  readonly device: Device;
}

const CpuRegistersPanel = ({
  device: {
    cpu: { registers }
  }
}: CpuRegistersPanelProps): ReactElement<CpuRegistersPanelProps> => (
  <PanelLayout title="CPU Registers">
    <Grid container spacing={0}>
      <RegisterCell name="a" value={registers.a} />
      <RegisterCell name="f" value={registers.f} />
      <RegisterCell name="b" value={registers.b} />
      <RegisterCell name="c" value={registers.c} />
      <RegisterCell name="d" value={registers.d} />
      <RegisterCell name="e" value={registers.e} />
      <RegisterCell name="h" value={registers.h} />
      <RegisterCell name="l" value={registers.l} />
      <RegisterCell name="sp" value={registers.sp} />
      <RegisterCell name="pc" value={registers.pc} />
    </Grid>
  </PanelLayout>
);

export default CpuRegistersPanel;
