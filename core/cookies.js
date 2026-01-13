export function parseCookieHeader(cookieHeader, domain) {
  return cookieHeader.split(";").map(c => {
    const [name, ...rest] = c.trim().split("=");
    return {
      name,
      value: rest.join("="),
      domain: name === "PHPSESSID" ? "www.italcambio.com" : domain,
      path: "/",
      httpOnly: false,
      secure: false,
      //sameSite: ""
    };
  });
}
