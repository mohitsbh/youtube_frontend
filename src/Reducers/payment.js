const initialState = {
  loading: false,
  success: false,
  error: null,
  plan: null,
};

const paymentReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'PAYMENT_REQUEST':
      return { ...state, loading: true, success: false, error: null };

    case 'PAYMENT_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        error: null,
        plan: action.payload.plan,
      };

    case 'PAYMENT_FAIL':
      return { ...state, loading: false, success: false, error: action.payload };

    case 'PAYMENT_RESET':
      return initialState;

    default:
      return state;
  }
};

export default paymentReducer;
