interface AskRequest {
  question: string;
  user_id: string;
  chat_id?: string;
}

interface APIError {
  message: string;
  status?: number;
}

interface AskResponse {
  question: string;
  answer: string;
  chat_id: string;
  display_settings: {
    vertical_bar: boolean;
    button_display: boolean;
    options: {
      buttons: string[];
    };
    message_history: {
      question: string;
      answer: string;
    }[];
  };
}

interface VerifyOTPRequest {
  otp: number;
  email: string;
  chat_id: string;
}

interface VerifyOTPResponse {
  question: string;
  answer: string;
  chat_id: string;
  display_settings: {
    vertical_bar: boolean;
    button_display: boolean;
    options: {
      buttons: string[];
    };
    message_history: {
      question: string;
      answer: string;
    }[];
  };
}

export const askBart = async (data: AskRequest): Promise<AskResponse> => {
  try {
    const requestBody = {
      question: data.question,
      user_id: data.user_id,
      ...(data.chat_id && { chat_id: data.chat_id }),
    };

    const response = await fetch(
      `https://bart-api-bd05237bdea5.herokuapp.com/ask`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      throw {
        message: responseData.message || "Ask request failed",
        status: response.status,
      } as APIError;
    }

    return responseData as AskResponse;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error("Invalid response format from server");
    }

    if ((error as APIError).status) {
      const apiError = error as APIError;
      throw new Error(
        `Ask request failed (${apiError.status}): ${apiError.message}`
      );
    }

    throw new Error(
      "An unexpected error occurred while processing your question"
    );
  }
};

export const verifyOTP = async (
  data: VerifyOTPRequest
): Promise<AskResponse> => {
  try {
    const response = await fetch(
      `https://bart-api-bd05237bdea5.herokuapp.com/verification/verify_otp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      throw {
        message: responseData.message || "Verification failed",
        status: response.status,
      } as APIError;
    }

    return responseData as VerifyOTPResponse;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error("Invalid response format from server");
    }

    if ((error as APIError).status) {
      const apiError = error as APIError;
      throw new Error(
        `OTP verification failed (${apiError.status}): ${apiError.message}`
      );
    }

    throw new Error("An unexpected error occurred during OTP verification");
  }
};
