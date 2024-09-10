import React, { createContext, useContext, useMemo, useState } from "react";
import type {
  XYZContextState,
  XYZCustomDispatch,
  XYZDispatch,
  XYZHook,
  XYZSetState,
} from "./types";

export type { XYZDispatchArgs, XYZHookArgs } from "./types";

export function createXYZContext<
  TState,
  TCustomDispatch extends XYZCustomDispatch<TState>,
  TDispatch extends XYZDispatch<TState, TCustomDispatch>,
  THooks extends XYZHook<TState, TCustomDispatch>[],
  TContextState extends XYZContextState<TState, TDispatch>
>({
  initialState,
  dispatch: customDispatch,
  hooks,
}: {
  initialState?: TState;
  dispatch?: TCustomDispatch;
  hooks?: THooks;
}) {
  const XYZContext = createContext<TContextState | undefined>(undefined);

  function runHooks(ctx: TContextState) {
    hooks?.forEach((hook) => hook(ctx));
  }

  function initializeDispatch(setState: XYZSetState<TState>): TDispatch {
    return useMemo(() => {
      if (customDispatch) {
        return {
          ...customDispatch(setState),
          setXYZState: setState,
        };
      }

      return { setXYZState: setState };
    }, []) as TDispatch;
  }

  function XYZProvider({
    children,
    value,
  }: {
    children: React.ReactNode;
    value?: TState;
  }) {
    const [state, setState] = useState<TState>({
      ...initialState,
      ...((value || {}) as TState),
    });
    const dispatch = initializeDispatch(setState);

    runHooks({ state, dispatch } as TContextState);

    return (
      <XYZContext.Provider value={{ state, dispatch } as TContextState}>
        {children}
      </XYZContext.Provider>
    );
  }

  function useXYZContext() {
    const ctx = useContext(XYZContext);

    if (ctx === undefined) {
      throw new Error("useXYZContext must be used within a XYZProvider");
    }

    return ctx;
  }

  return [XYZProvider, useXYZContext] as const;
}
