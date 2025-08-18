declare module 'bootstrap/dist/js/bootstrap.bundle.min.js' {
  const bootstrap: any;
  export = bootstrap;
}

declare module 'bootstrap/dist/js/bootstrap.min.js' {
  const bootstrap: any;
  export = bootstrap;
}

declare module 'bootstrap' {
  export * from 'bootstrap/dist/js/bootstrap.bundle.min.js';
}
