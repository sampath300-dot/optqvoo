// Sites entrypoint: the Angular build is fully static, so every request is
// served from the uploaded asset bundle.
export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request);
  }
};
