import type React from "react";

export type XYZSetState<TState> = React.Dispatch<React.SetStateAction<TState>>;

export type XYZContextState<TState, TDispatch> = {
  state: TState;
  dispatch: TDispatch;
};
export type XYZDispatch<
  State,
  CustomDispatch extends XYZCustomDispatch<State>
> = {
  setXYZState: XYZSetState<State>;
} & {
  [Key in keyof ReturnType<CustomDispatch>]: ReturnType<CustomDispatch>[Key];
};

export type XYZHook<TState, TDispatch extends XYZCustomDispatch<TState>> = (
  context: XYZHookArgs<TState, TDispatch>
) => void;

export type XYZCustomDispatch<TState> = (
  setXYZState: XYZSetState<TState>
) => {};
export type XYZContextProvider<TState> = (
  props: {
    children: React.ReactNode;
  } & Partial<TState>
) => React.ReactNode;

export type XYZDispatchArgs<TState> = XYZSetState<TState>;

export type XYZHookArgs<
  TState,
  TCustomDispatch extends XYZCustomDispatch<TState>
> = {
  state: TState;
  dispatch: XYZDispatch<TState, TCustomDispatch>;
};
