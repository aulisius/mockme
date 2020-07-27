export const api: any = (endpoint: string, callType: any, body = {}, mockmeSessionKey: string) => {
  let bodyParams = {};
  let headers = {};

  switch (callType) {
    case "GET":
      bodyParams = {};
      break;
    case "POST":
      bodyParams = { key: mockmeSessionKey, ...body };
      headers = {
        "Content-Type": "application/json",
      };
      break;
    default:
      return null;
  }

  const payload: any = {
    method: callType,
  };

  if (callType === "POST") {
    payload.body = JSON.stringify({ ...bodyParams });
    payload.headers = headers;
  }

  return fetch(endpoint, payload)
    .then((res) => res.json())
    .then((res) => res)
    .catch((e) => new Error("Error while calling API."));
};
