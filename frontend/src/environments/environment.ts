// Production build (also used by docker-compose.demo.yml): the browser calls the API published on localhost:3000.
export const environment = {
  production: true,
  apiBaseUrl: 'http://localhost:3000/api/v1',
  socketUrl: 'http://localhost:3000',
};
