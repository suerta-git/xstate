import type {
  ActorRef,
  SCXML,
  State,
  StateMachine,
  AnyInterpreter
} from 'xstate';
import { XStateDevInterface } from 'xstate/lib/devTools';
import { InspectMachineEvent } from './inspectMachine';

export type MaybeLazy<T> = T | (() => T);

export type ServiceListener = (service: AnyInterpreter) => void;

export type Replacer = (key: string, value: any) => any;

export interface InspectorOptions {
  url?: string;
  iframe?: MaybeLazy<HTMLIFrameElement | null | false>;
  devTools?: MaybeLazy<XStateDevInterface>;
  serialize?: Replacer | undefined;
}

export interface Inspector
  extends ActorRef<InspectMachineEvent, State<any, any, any, any, any>> {
  /**
   * Disconnects the inspector.
   */
  disconnect: () => void;
}

/**
 * Events that the receiver sends to the inspector
 */
export type ReceiverCommand =
  | { type: 'xstate.event'; event: string; service: string }
  | { type: 'xstate.inspecting' };

/**
 * Events that the receiver receives from the inspector
 */
export type ReceiverEvent =
  | {
      type: 'service.register';
      machine: string;
      state: string;
      id: string;
      sessionId: string;
      parent?: string;
      source?: string;
    }
  | { type: 'service.stop'; sessionId: string }
  | {
      type: 'service.state';
      state: string;
      sessionId: string;
    }
  | { type: 'service.event'; event: string; sessionId: string };

export type ParsedReceiverEvent =
  | {
      type: 'service.register';
      machine: StateMachine<any, any, any, any, any, any, any>;
      state: State<any, any>;
      id: string;
      sessionId: string;
      parent?: string;
      source?: string;
    }
  | { type: 'service.stop'; sessionId: string }
  | {
      type: 'service.state';
      state: State<any, any, any, any, any>;
      sessionId: string;
    }
  | { type: 'service.event'; event: SCXML.Event<any>; sessionId: string };

export type InspectReceiver = ActorRef<ReceiverCommand, ParsedReceiverEvent>;

export interface WindowReceiverOptions {
  window: Window;
  targetWindow: Window;
}

export interface WebSocketReceiverOptions {
  server: string;
  protocol?: 'ws' | 'wss';
  serialize: Replacer | undefined;
}
