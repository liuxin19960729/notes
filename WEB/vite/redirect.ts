
/**重定向插件 */
function redirect(): Plugin<void> {
  const redirectMap = new Map<string, string>([
    ["/activity", "/home"],
    ["/welfare", "/home"],
    ["/wallet", "/home"],
  ]);
  return {
    name: "redirect-plugin",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const redirect = req.url ? redirectMap.get(req.url) : undefined;
        if (redirect) {
          res.statusCode = 302;
          res.setHeader("Location", redirect);
          res.end();
          return;
        }
        next();
      })
    }
  }
}