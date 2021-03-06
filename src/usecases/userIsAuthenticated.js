import cookie from "cookie";
import { WARD_STAFF } from "../helpers/userTypes";

export default ({ getTokenProvider, getRetrieveWardById }) => async (
  requestCookie
) => {
  const tokenProvider = getTokenProvider();
  const retrieveWardById = getRetrieveWardById();

  try {
    const { token } = cookie.parse(requestCookie);

    const validatedToken = tokenProvider.validate(token);

    const { error: retrieveWardError } = await retrieveWardById(
      validatedToken.wardId,
      validatedToken.trustId
    );

    if (retrieveWardError) {
      return false;
    }

    if (token && validatedToken.type !== WARD_STAFF) {
      return false;
    }

    return token && validatedToken;
  } catch (err) {
    return false;
  }
};
