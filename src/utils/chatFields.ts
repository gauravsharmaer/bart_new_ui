import { Message } from "../Interface/Interface";
import { createTimestamp } from "./chatUtils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createBotMessage = (result: any): Message => ({
    text: result.answer || "No response received",
    isUserMessage: false,
    timestamp: createTimestamp(),
    button_display: result.display_settings?.button_display || false,
    number_of_buttons: result.display_settings?.options?.buttons?.length || 0,
    button_text: result.display_settings?.options?.buttons || [],
    ticket: result.display_settings?.ticket || false,
    ticket_options: result.display_settings?.options?.ticket_options || {},
    history_id: result.display_settings?.message_history[0]?.history_id,
    like: result.display_settings?.message_history[0]?.like,
    un_like: result.display_settings?.message_history[0]?.un_like,
  });
  
  export const createUserMessage = (text: string): Message => ({
    text,
    isUserMessage: true,
    timestamp: createTimestamp(),
    button_display: false,
    number_of_buttons: 0,
    button_text: [],
    ticket: false,
  });





// eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const createBotMessagechatUi = (result: any): Message => ({
    text: result.answer || "No response received",
    isUserMessage: false,
    timestamp: createTimestamp(),
    button_display: result.display_settings?.button_display || false,
    number_of_buttons: result.display_settings?.options?.buttons?.length || 0,
    button_text: result.display_settings?.options?.buttons || [],
    ticket: result.display_settings?.ticket || false,
    ticket_options: result.display_settings?.options?.ticket_options || undefined,
    history_id: result.display_settings?.message_history[
      result.display_settings.message_history.length - 1
    ]?.history_id,
    like: result.display_settings?.message_history[
      result.display_settings.message_history.length - 1
    ]?.like,
    un_like: result.display_settings?.message_history[
      result.display_settings.message_history.length - 1
    ]?.un_like,
  });

    export const createUserMessagechatUi = (text: string): Message => ({
    text,
    isUserMessage: true,
    timestamp: createTimestamp(),
    button_display: false,
    number_of_buttons: 0,
    button_text: [],

  });

  export const createErrorMessage = (error: unknown): Message => ({
    text: error instanceof Error ? error.message : "An error occurred",
    isUserMessage: false,
    timestamp: createTimestamp(),
    button_display: false,
    number_of_buttons: 0,
    button_text: [],
  });